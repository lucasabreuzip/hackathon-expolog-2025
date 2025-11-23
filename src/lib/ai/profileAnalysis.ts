import { Candidate, Course, CourseProgress, Job } from '@/types';

interface ScoreBreakdown {
  completeness: number;
  skills: number;
  experience: number;
  certifications: number;
  engagement: number;
}

interface ProfileAnalysisResult {
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  suggestions: ProfileSuggestion[];
  knowledgeGaps: KnowledgeGap[];
  developmentRoadmap: DevelopmentRoadmap;
  marketReadiness: MarketReadinessScore;
}

interface ProfileSuggestion {
  category: 'profile' | 'skills' | 'experience' | 'certifications' | 'courses';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: number; // 0-100
}

interface KnowledgeGap {
  area: string;
  description: string;
  severity: 'critical' | 'important' | 'nice-to-have';
  suggestedCourses: string[];
  estimatedTimeToFill: string;
}

interface DevelopmentRoadmap {
  currentLevel: 'iniciante' | 'intermediário' | 'avançado' | 'especialista';
  nextLevel: string;
  timelineMonths: number;
  milestones: Milestone[];
  recommendedActions: string[];
}

interface Milestone {
  phase: number;
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  courses: string[];
}

interface MarketReadinessScore {
  score: number; // 0-100
  level: 'não pronto' | 'preparação' | 'pronto' | 'altamente competitivo';
  factors: {
    profileQuality: number;
    skillRelevance: number;
    certificationStatus: number;
    experienceLevel: number;
  };
  recommendations: string[];
}

/**
 * Sistema de Análise de Perfil com IA
 * Análise profunda e sugestões personalizadas
 */
export class ProfileAnalysisAI {
  /**
   * Analisa perfil completo do candidato
   */
  public static analyzeProfile(
    candidate: Candidate,
    allCourses: Course[],
    courseProgress: CourseProgress[],
    marketJobs: Job[] = []
  ): ProfileAnalysisResult {
    const scoreBreakdown = this.calculateScoreBreakdown(candidate, courseProgress);
    const overallScore = this.calculateOverallScore(scoreBreakdown);

    const strengths = this.identifyStrengths(candidate, courseProgress);
    const weaknesses = this.identifyWeaknesses(candidate, courseProgress);

    const suggestions = this.generateSuggestions(candidate, courseProgress, weaknesses);
    const knowledgeGaps = this.identifyKnowledgeGaps(candidate, allCourses, marketJobs);

    const developmentRoadmap = this.createDevelopmentRoadmap(
      candidate,
      courseProgress,
      knowledgeGaps
    );

    const marketReadiness = this.assessMarketReadiness(
      candidate,
      courseProgress,
      marketJobs
    );

    return {
      overallScore,
      scoreBreakdown,
      strengths,
      weaknesses,
      suggestions,
      knowledgeGaps,
      developmentRoadmap,
      marketReadiness
    };
  }

  /**
   * Calcula breakdown detalhado do score
   */
  private static calculateScoreBreakdown(
    candidate: Candidate,
    courseProgress: CourseProgress[]
  ) {
    // Completude do perfil
    const completeness = candidate.profileCompleteness;

    // Skills (quantidade e qualidade)
    const skillsScore = Math.min(100, (candidate.skills.length / 10) * 100);

    // Experiência
    const experienceYears = candidate.experience.length;
    const experienceScore = Math.min(100, (experienceYears / 5) * 100);

    // Certificações
    const validCerts = candidate.certifications.filter(
      cert => new Date(cert.expiryDate) > new Date()
    ).length;
    const certificationScore = Math.min(100, (validCerts / 3) * 100);

    // Engajamento (baseado em cursos)
    const completedCourses = courseProgress.filter(p => p.status === 'completed').length;
    const inProgressCourses = courseProgress.filter(
      p => p.status === 'in_progress' || p.status === 'enrolled'
    ).length;
    const engagementScore = Math.min(
      100,
      (completedCourses * 20) + (inProgressCourses * 10)
    );

    return {
      completeness,
      skills: skillsScore,
      experience: experienceScore,
      certifications: certificationScore,
      engagement: engagementScore
    };
  }

  /**
   * Calcula score geral do perfil
   */
  private static calculateOverallScore(scoreBreakdown: ScoreBreakdown): number {
    const weights = {
      completeness: 0.25,
      skills: 0.20,
      experience: 0.20,
      certifications: 0.25,
      engagement: 0.10
    };

    return Math.round(
      scoreBreakdown.completeness * weights.completeness +
      scoreBreakdown.skills * weights.skills +
      scoreBreakdown.experience * weights.experience +
      scoreBreakdown.certifications * weights.certifications +
      scoreBreakdown.engagement * weights.engagement
    );
  }

  /**
   * Identifica pontos fortes do candidato
   */
  private static identifyStrengths(
    candidate: Candidate,
    courseProgress: CourseProgress[]
  ): string[] {
    const strengths: string[] = [];

    if (candidate.profileCompleteness >= 90) {
      strengths.push('Perfil muito completo e bem estruturado');
    }

    if (candidate.skills.length >= 8) {
      strengths.push(`Conjunto amplo de habilidades (${candidate.skills.length} skills)`);
    }

    const validCerts = candidate.certifications.filter(
      cert => new Date(cert.expiryDate) > new Date()
    );
    if (validCerts.length >= 3) {
      strengths.push(`Bem certificado (${validCerts.length} certificações válidas)`);
    }

    if (candidate.experience.length >= 3) {
      strengths.push(`Experiência sólida (${candidate.experience.length} posições)`);
    }

    const completedCourses = courseProgress.filter(p => p.status === 'completed').length;
    if (completedCourses >= 5) {
      strengths.push(`Alto engajamento em capacitação (${completedCourses} cursos concluídos)`);
    }

    const inProgress = courseProgress.filter(
      p => p.status === 'in_progress' || p.status === 'enrolled'
    ).length;
    if (inProgress >= 2) {
      strengths.push('Ativamente em desenvolvimento contínuo');
    }

    if (candidate.isPCD) {
      strengths.push('Elegível para vagas exclusivas PCD');
    }

    return strengths;
  }

  /**
   * Identifica pontos fracos do candidato
   */
  private static identifyWeaknesses(
    candidate: Candidate,
    courseProgress: CourseProgress[]
  ): string[] {
    const weaknesses: string[] = [];

    if (candidate.profileCompleteness < 70) {
      weaknesses.push('Perfil incompleto - faltam informações importantes');
    }

    if (candidate.skills.length < 5) {
      weaknesses.push('Poucas habilidades cadastradas no perfil');
    }

    if (candidate.certifications.length === 0) {
      weaknesses.push('Sem certificações profissionais');
    }

    const expiredCerts = candidate.certifications.filter(
      cert => new Date(cert.expiryDate) <= new Date()
    );
    if (expiredCerts.length > 0) {
      weaknesses.push(`${expiredCerts.length} certificação(ões) expirada(s)`);
    }

    if (candidate.experience.length < 2) {
      weaknesses.push('Pouca experiência profissional registrada');
    }

    const completedCourses = courseProgress.filter(p => p.status === 'completed').length;
    if (completedCourses === 0) {
      weaknesses.push('Nenhum curso concluído ainda');
    }

    const inProgress = courseProgress.filter(
      p => p.status === 'in_progress' || p.status === 'enrolled'
    ).length;
    if (inProgress === 0) {
      weaknesses.push('Sem cursos em andamento no momento');
    }

    return weaknesses;
  }

  /**
   * Gera sugestões personalizadas de melhoria
   */
  private static generateSuggestions(
    candidate: Candidate,
    courseProgress: CourseProgress[],
    weaknesses: string[]
  ): ProfileSuggestion[] {
    const suggestions: ProfileSuggestion[] = [];

    // Sugestões baseadas em completude
    if (candidate.profileCompleteness < 100) {
      suggestions.push({
        category: 'profile',
        priority: candidate.profileCompleteness < 70 ? 'high' : 'medium',
        title: 'Complete seu perfil',
        description: `Seu perfil está ${candidate.profileCompleteness}% completo. Perfis completos têm 3x mais visibilidade.`,
        action: 'Acesse "Meu Perfil" e preencha todas as seções',
        impact: 85
      });
    }

    // Sugestões de skills
    if (candidate.skills.length < 8) {
      suggestions.push({
        category: 'skills',
        priority: candidate.skills.length < 5 ? 'high' : 'medium',
        title: 'Adicione mais habilidades',
        description: 'Candidatos com 8+ habilidades têm 40% mais chances de match.',
        action: 'Liste todas as suas competências técnicas e comportamentais',
        impact: 70
      });
    }

    // Sugestões de certificações
    if (candidate.certifications.length === 0) {
      suggestions.push({
        category: 'certifications',
        priority: 'high',
        title: 'Obtenha certificações',
        description: 'Certificações validam suas habilidades e aumentam credibilidade.',
        action: 'Complete cursos na plataforma para obter certificações',
        impact: 90
      });
    }

    // Sugestões de experiência
    if (candidate.experience.length < 3) {
      suggestions.push({
        category: 'experience',
        priority: 'medium',
        title: 'Detalhe suas experiências',
        description: 'Adicione todas as suas experiências profissionais relevantes.',
        action: 'Inclua projetos, estágios e trabalhos anteriores',
        impact: 75
      });
    }

    // Sugestões de cursos
    const completedCourses = courseProgress.filter(p => p.status === 'completed').length;
    if (completedCourses < 3) {
      suggestions.push({
        category: 'courses',
        priority: completedCourses === 0 ? 'high' : 'medium',
        title: 'Complete mais cursos',
        description: 'Cada curso concluído aumenta suas qualificações.',
        action: 'Matricule-se em cursos relacionados à sua área',
        impact: 80
      });
    }

    // Ordena por prioridade e impacto
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : b.impact - a.impact;
    });
  }

  /**
   * Identifica gaps de conhecimento
   */
  private static identifyKnowledgeGaps(
    candidate: Candidate,
    allCourses: Course[],
    marketJobs: Job[]
  ): KnowledgeGap[] {
    const gaps: KnowledgeGap[] = [];
    const candidateSkills = candidate.skills.map(s => s.toLowerCase());

    // Analisa habilidades comuns no mercado
    const marketSkills = new Map<string, number>();
    marketJobs.forEach(job => {
      [...job.requiredSkills, ...job.desiredSkills].forEach(skill => {
        const skillLower = skill.toLowerCase();
        marketSkills.set(skillLower, (marketSkills.get(skillLower) || 0) + 1);
      });
    });

    // Identifica skills mais demandadas que o candidato não tem
    const topMarketSkills = Array.from(marketSkills.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    topMarketSkills.forEach(([skill, demand]) => {
      if (!candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))) {
        const relatedCourses = allCourses
          .filter(course =>
            course.title.toLowerCase().includes(skill) ||
            course.tags.some(tag => tag.toLowerCase().includes(skill))
          )
          .map(c => c.title)
          .slice(0, 3);

        if (relatedCourses.length > 0) {
          gaps.push({
            area: skill,
            description: `Habilidade muito demandada no mercado (${demand} vagas)`,
            severity: demand > 5 ? 'critical' : demand > 2 ? 'important' : 'nice-to-have',
            suggestedCourses: relatedCourses,
            estimatedTimeToFill: this.estimateTimeToFill(relatedCourses.length)
          });
        }
      }
    });

    // Gap de certificações
    if (candidate.certifications.length === 0) {
      gaps.push({
        area: 'Certificações Profissionais',
        description: 'Sem certificações que validem suas competências',
        severity: 'important',
        suggestedCourses: allCourses
          .filter(c => c.category === candidate.mainArea)
          .slice(0, 3)
          .map(c => c.title),
        estimatedTimeToFill: '1-2 meses'
      });
    }

    return gaps.slice(0, 5); // Top 5 gaps
  }

  /**
   * Cria roadmap de desenvolvimento personalizado
   */
  private static createDevelopmentRoadmap(
    candidate: Candidate,
    courseProgress: CourseProgress[],
    gaps: KnowledgeGap[]
  ): DevelopmentRoadmap {
    const currentLevel = this.assessCurrentLevel(candidate, courseProgress);
    const nextLevel = this.getNextLevel(currentLevel);

    const milestones: Milestone[] = [];

    // Fase 1: Fundamentos (0-2 meses)
    if (currentLevel === 'iniciante') {
      milestones.push({
        phase: 1,
        title: 'Construir Fundamentos Sólidos',
        description: 'Estabelecer base de conhecimento e completar perfil',
        duration: '0-2 meses',
        objectives: [
          'Completar perfil para 90%+',
          'Adicionar pelo menos 8 habilidades',
          'Concluir 2-3 cursos básicos',
          'Obter primeira certificação'
        ],
        courses: gaps
          .filter(g => g.severity === 'critical')
          .flatMap(g => g.suggestedCourses)
          .slice(0, 3)
      });
    }

    // Fase 2: Desenvolvimento (2-4 meses)
    milestones.push({
      phase: milestones.length + 1,
      title: 'Desenvolver Competências Avançadas',
      description: 'Aprofundar conhecimento e ganhar experiência prática',
      duration: '2-4 meses',
      objectives: [
        'Concluir 3-5 cursos intermediários',
        'Obter 2-3 certificações relevantes',
        'Aplicar conhecimento em projetos práticos',
        'Expandir network profissional'
      ],
      courses: gaps
        .filter(g => g.severity === 'important')
        .flatMap(g => g.suggestedCourses)
        .slice(0, 3)
    });

    // Fase 3: Especialização (4-6 meses)
    if (currentLevel !== 'iniciante') {
      milestones.push({
        phase: milestones.length + 1,
        title: 'Especializar e Destacar-se',
        description: 'Tornar-se referência na sua área',
        duration: '4-6 meses',
        objectives: [
          'Concluir cursos avançados',
          'Obter certificações de especialista',
          'Contribuir com a comunidade',
          'Buscar posições de liderança'
        ],
        courses: gaps
          .filter(g => g.severity === 'nice-to-have')
          .flatMap(g => g.suggestedCourses)
          .slice(0, 3)
      });
    }

    const recommendedActions = this.getRecommendedActions(currentLevel, gaps);

    return {
      currentLevel,
      nextLevel,
      timelineMonths: milestones.length * 2,
      milestones,
      recommendedActions
    };
  }

  /**
   * Avalia prontidão para o mercado
   */
  private static assessMarketReadiness(
    candidate: Candidate,
    courseProgress: CourseProgress[],
    marketJobs: Job[]
  ): MarketReadinessScore {
    const profileQuality = candidate.profileCompleteness;

    const skillRelevance = this.calculateSkillRelevance(candidate, marketJobs);

    const validCerts = candidate.certifications.filter(
      cert => new Date(cert.expiryDate) > new Date()
    ).length;
    const certificationStatus = Math.min(100, (validCerts / 3) * 100);

    const experienceLevel = Math.min(100, (candidate.experience.length / 5) * 100);

    const factors = {
      profileQuality,
      skillRelevance,
      certificationStatus,
      experienceLevel
    };

    const score = Math.round(
      profileQuality * 0.25 +
      skillRelevance * 0.30 +
      certificationStatus * 0.25 +
      experienceLevel * 0.20
    );

    let level: MarketReadinessScore['level'];
    if (score >= 80) level = 'altamente competitivo';
    else if (score >= 60) level = 'pronto';
    else if (score >= 40) level = 'preparação';
    else level = 'não pronto';

    const recommendations = this.getMarketReadinessRecommendations(score, factors);

    return { score, level, factors, recommendations };
  }

  /**
   * Calcula relevância das skills para o mercado
   */
  private static calculateSkillRelevance(candidate: Candidate, marketJobs: Job[]): number {
    if (marketJobs.length === 0) return 70; // Score padrão

    const candidateSkills = candidate.skills.map(s => s.toLowerCase());
    const marketSkills = new Set<string>();

    marketJobs.forEach(job => {
      [...job.requiredSkills, ...job.desiredSkills].forEach(skill => {
        marketSkills.add(skill.toLowerCase());
      });
    });

    const matchingSkills = candidateSkills.filter(cs =>
      Array.from(marketSkills).some(ms => cs.includes(ms) || ms.includes(cs))
    );

    return Math.min(100, (matchingSkills.length / Math.max(candidateSkills.length, 1)) * 100);
  }

  /**
   * Avalia nível atual do candidato
   */
  private static assessCurrentLevel(
    candidate: Candidate,
    courseProgress: CourseProgress[]
  ): 'iniciante' | 'intermediário' | 'avançado' | 'especialista' {
    const completed = courseProgress.filter(p => p.status === 'completed').length;
    const validCerts = candidate.certifications.filter(
      cert => new Date(cert.expiryDate) > new Date()
    ).length;
    const experience = candidate.experience.length;

    const score = completed * 10 + validCerts * 15 + experience * 10;

    if (score >= 80) return 'especialista';
    if (score >= 50) return 'avançado';
    if (score >= 25) return 'intermediário';
    return 'iniciante';
  }

  /**
   * Determina próximo nível
   */
  private static getNextLevel(current: string): string {
    const levels = {
      'iniciante': 'intermediário',
      'intermediário': 'avançado',
      'avançado': 'especialista',
      'especialista': 'líder/mentor'
    };
    return levels[current as keyof typeof levels] || 'próximo nível';
  }

  /**
   * Estima tempo para preencher gap
   */
  private static estimateTimeToFill(coursesNeeded: number): string {
    if (coursesNeeded <= 1) return '2-4 semanas';
    if (coursesNeeded <= 2) return '1-2 meses';
    return '2-3 meses';
  }

  /**
   * Gera ações recomendadas para o roadmap
   */
  private static getRecommendedActions(
    level: string,
    gaps: KnowledgeGap[]
  ): string[] {
    const actions: string[] = [];

    if (level === 'iniciante') {
      actions.push('Foque em completar seu perfil e obter certificações básicas');
      actions.push('Matricule-se em cursos fundamentais da sua área');
    }

    if (gaps.some(g => g.severity === 'critical')) {
      actions.push('Priorize cursos que preencham gaps críticos identificados');
    }

    actions.push('Mantenha-se ativo: complete pelo menos 1 curso por mês');
    actions.push('Aplique o conhecimento em projetos práticos');
    actions.push('Atualize regularmente suas habilidades e experiências');

    return actions;
  }

  /**
   * Gera recomendações de prontidão para mercado
   */
  private static getMarketReadinessRecommendations(
    score: number,
    factors: MarketReadinessScore['factors']
  ): string[] {
    const recommendations: string[] = [];

    if (factors.profileQuality < 80) {
      recommendations.push('Complete seu perfil para aumentar sua visibilidade');
    }

    if (factors.skillRelevance < 70) {
      recommendations.push('Adicione habilidades mais demandadas pelo mercado');
    }

    if (factors.certificationStatus < 60) {
      recommendations.push('Obtenha certificações para validar suas competências');
    }

    if (factors.experienceLevel < 60) {
      recommendations.push('Ganhe mais experiência através de projetos e estágios');
    }

    if (score >= 80) {
      recommendations.push('Você está pronto! Candidate-se às melhores oportunidades');
    } else if (score >= 60) {
      recommendations.push('Continue se desenvolvendo para se destacar ainda mais');
    } else {
      recommendations.push('Foque em desenvolvimento contínuo antes de se candidatar');
    }

    return recommendations;
  }
}
