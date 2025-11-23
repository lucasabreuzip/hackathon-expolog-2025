import { Candidate, Course, CourseProgress } from '@/types';

interface RecommendationScore {
  course: Course;
  score: number;
  reasons: string[];
  priority: 'high' | 'medium' | 'low';
}

/**
 * Sistema de Recomendação de Cursos com IA
 * Analisa o perfil do candidato e sugere cursos personalizados
 */
export class CourseRecommendationAI {
  /**
   * Calcula score de recomendação para um curso baseado no perfil do candidato
   */
  private static calculateRecommendationScore(
    candidate: Candidate,
    course: Course,
    userProgress: CourseProgress[]
  ): RecommendationScore {
    let score = 0;
    const reasons: string[] = [];

    // 1. Verifica se já está matriculado (reduz score drasticamente)
    const isEnrolled = userProgress.some(p => p.courseId === course.id);
    if (isEnrolled) {
      return { course, score: 0, reasons: ['Já matriculado'], priority: 'low' };
    }

    // 2. Análise de área principal (30 pontos)
    const mainAreaMatch = this.analyzeMainAreaMatch(candidate.mainArea, course);
    score += mainAreaMatch.score;
    if (mainAreaMatch.match) {
      reasons.push(mainAreaMatch.reason);
    }

    // 3. Análise de certificações (25 pontos)
    const certMatch = this.analyzeCertificationGap(candidate, course);
    score += certMatch.score;
    if (certMatch.hasGap) {
      reasons.push(certMatch.reason);
    }

    // 4. Análise de habilidades (20 pontos)
    const skillsMatch = this.analyzeSkillsAlignment(candidate.skills, course);
    score += skillsMatch.score;
    if (skillsMatch.hasAlignment) {
      reasons.push(skillsMatch.reason);
    }

    // 5. Nível de completude do perfil (15 pontos)
    const profileMatch = this.analyzeProfileCompleteness(candidate, course);
    score += profileMatch.score;
    if (profileMatch.needsImprovement) {
      reasons.push(profileMatch.reason);
    }

    // 6. Análise de progressão de carreira (10 pontos)
    const careerMatch = this.analyzeCareerProgression(candidate, course, userProgress);
    score += careerMatch.score;
    if (careerMatch.isProgression) {
      reasons.push(careerMatch.reason);
    }

    // Determina prioridade
    let priority: 'high' | 'medium' | 'low' = 'low';
    if (score >= 70) priority = 'high';
    else if (score >= 40) priority = 'medium';

    return { course, score, reasons, priority };
  }

  /**
   * Analisa match com área principal
   */
  private static analyzeMainAreaMatch(mainArea: string, course: Course) {
    const areaKeywords: { [key: string]: string[] } = {
      'Operação de Equipamentos': ['empilhadeira', 'operação', 'equipamentos', 'logística'],
      'Administrativa': ['gestão', 'administrativa', 'supply', 'logística'],
      'Manutenção Industrial': ['nr-10', 'elétrica', 'manutenção', 'segurança'],
      'Segurança do Trabalho': ['nr-', 'segurança', 'altura', 'epi'],
    };

    const keywords = areaKeywords[mainArea] || [];
    const courseText = `${course.title} ${course.description} ${course.tags.join(' ')}`.toLowerCase();

    const matchCount = keywords.filter(keyword => courseText.includes(keyword.toLowerCase())).length;

    if (matchCount > 0) {
      return {
        score: Math.min(30, matchCount * 10),
        match: true,
        reason: `Alinhado com sua área: ${mainArea}`
      };
    }

    return { score: 0, match: false, reason: '' };
  }

  /**
   * Analisa gaps de certificação
   */
  private static analyzeCertificationGap(candidate: Candidate, course: Course) {
    // Verifica se o curso oferece certificações que o candidato não tem
    const courseCertTags = course.tags.filter(tag => tag.toUpperCase().includes('NR-') || tag.toLowerCase().includes('certificação'));

    if (courseCertTags.length > 0) {
      const candidateCerts = candidate.certifications.map(c => c.certificationId.toLowerCase());
      const hasGap = courseCertTags.some(tag => !candidateCerts.some(cert => cert.includes(tag.toLowerCase())));

      if (hasGap) {
        return {
          score: 25,
          hasGap: true,
          reason: 'Certificação que você ainda não possui'
        };
      }
    }

    return { score: 0, hasGap: false, reason: '' };
  }

  /**
   * Analisa alinhamento de habilidades
   */
  private static analyzeSkillsAlignment(skills: string[], course: Course) {
    const courseSkills = course.description.toLowerCase();
    const matchingSkills = skills.filter(skill =>
      courseSkills.includes(skill.toLowerCase())
    );

    if (matchingSkills.length > 0) {
      return {
        score: Math.min(20, matchingSkills.length * 7),
        hasAlignment: true,
        reason: `Complementa suas habilidades em ${matchingSkills[0]}`
      };
    }

    return { score: 0, hasAlignment: false, reason: '' };
  }

  /**
   * Analisa completude do perfil
   */
  private static analyzeProfileCompleteness(candidate: Candidate, course: Course) {
    if (candidate.profileCompleteness < 70 && course.level === 'basico') {
      return {
        score: 15,
        needsImprovement: true,
        reason: 'Curso básico ideal para começar'
      };
    }

    if (candidate.profileCompleteness >= 80 && course.level === 'avancado') {
      return {
        score: 15,
        needsImprovement: true,
        reason: 'Nível avançado adequado ao seu perfil'
      };
    }

    return { score: 5, needsImprovement: false, reason: '' };
  }

  /**
   * Analisa progressão de carreira
   */
  private static analyzeCareerProgression(
    candidate: Candidate,
    course: Course,
    userProgress: CourseProgress[]
  ) {
    const completedCourses = userProgress.filter(p => p.status === 'completed').length;

    // Se tem cursos concluídos e este é de nível superior
    if (completedCourses > 0 && course.level === 'intermediario') {
      return {
        score: 10,
        isProgression: true,
        reason: 'Próximo passo na sua progressão'
      };
    }

    if (completedCourses > 2 && course.level === 'avancado') {
      return {
        score: 10,
        isProgression: true,
        reason: 'Evolução natural dos seus estudos'
      };
    }

    return { score: 0, isProgression: false, reason: '' };
  }

  /**
   * Retorna cursos recomendados ordenados por score
   */
  public static getRecommendations(
    candidate: Candidate,
    allCourses: Course[],
    userProgress: CourseProgress[],
    limit: number = 6
  ): RecommendationScore[] {
    const recommendations = allCourses
      .map(course => this.calculateRecommendationScore(candidate, course, userProgress))
      .filter(rec => rec.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return recommendations;
  }

  /**
   * Retorna roadmap de desenvolvimento personalizado
   */
  public static getPersonalizedRoadmap(
    candidate: Candidate,
    allCourses: Course[],
    userProgress: CourseProgress[]
  ): {
    immediate: RecommendationScore[];
    shortTerm: RecommendationScore[];
    longTerm: RecommendationScore[];
  } {
    const allRecommendations = this.getRecommendations(candidate, allCourses, userProgress, 12);

    return {
      immediate: allRecommendations.filter(r => r.priority === 'high').slice(0, 3),
      shortTerm: allRecommendations.filter(r => r.priority === 'medium').slice(0, 4),
      longTerm: allRecommendations.filter(r => r.priority === 'low').slice(0, 5)
    };
  }
}
