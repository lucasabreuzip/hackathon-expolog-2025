import { Candidate, Job } from '@/types';

interface MatchInsights {
  skillAlignment: number;
  experienceMatch: number;
  certificationMatch: number;
  locationScore: number;
  culturalFit: number;
}

interface EnhancedMatchResult {
  score: number;
  confidence: 'high' | 'medium' | 'low';
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  successPrediction: number; // 0-100
  insights: MatchInsights;
}

/**
 * Sistema de Matching Inteligente com IA
 * Análise avançada de compatibilidade candidato-vaga
 */
export class SmartMatchingAI {
  /**
   * Calcula match avançado com análise semântica
   */
  public static calculateEnhancedMatch(
    candidate: Candidate,
    job: Job
  ): EnhancedMatchResult {
    const insights = {
      skillAlignment: this.analyzeSkillAlignment(candidate, job),
      experienceMatch: this.analyzeExperienceMatch(candidate, job),
      certificationMatch: this.analyzeCertificationMatch(candidate, job),
      locationScore: this.analyzeLocationCompatibility(candidate, job),
      culturalFit: this.analyzeCulturalFit(candidate, job)
    };

    // Score ponderado
    const score = Math.round(
      insights.skillAlignment * 0.25 +
      insights.experienceMatch * 0.20 +
      insights.certificationMatch * 0.30 +
      insights.locationScore * 0.15 +
      insights.culturalFit * 0.10
    );

    const strengths = this.identifyStrengths(candidate, job, insights);
    const gaps = this.identifyGaps(candidate, job, insights);
    const recommendations = this.generateRecommendations(gaps, candidate);
    const successPrediction = this.predictSuccessRate(insights, candidate);

    let confidence: 'high' | 'medium' | 'low' = 'low';
    if (score >= 80) confidence = 'high';
    else if (score >= 60) confidence = 'medium';

    return {
      score,
      confidence,
      strengths,
      gaps,
      recommendations,
      successPrediction,
      insights
    };
  }

  /**
   * Análise semântica de alinhamento de habilidades
   */
  private static analyzeSkillAlignment(candidate: Candidate, job: Job): number {
    const requiredSkills = [...job.requiredSkills];
    const desiredSkills = [...job.desiredSkills];
    const candidateSkills = candidate.skills.map(s => s.toLowerCase());

    // Palavras-chave relacionadas (análise semântica simplificada)
    const semanticMap: { [key: string]: string[] } = {
      'empilhadeira': ['reach stacker', 'operação', 'logística', 'armazenagem'],
      'excel': ['planilhas', 'office', 'dados', 'relatórios'],
      'comunicação': ['atendimento', 'relacionamento', 'equipe'],
      'liderança': ['gestão', 'coordenação', 'supervisão'],
      'elétrica': ['manutenção', 'instalações', 'circuitos']
    };

    let matchedRequired = 0;
    let matchedDesired = 0;

    // Verifica skills obrigatórias com análise semântica
    requiredSkills.forEach(reqSkill => {
      const reqLower = reqSkill.toLowerCase();
      const hasExactMatch = candidateSkills.some(cs => cs.includes(reqLower) || reqLower.includes(cs));

      if (hasExactMatch) {
        matchedRequired++;
      } else {
        // Verifica match semântico
        const semanticMatches = semanticMap[reqLower] || [];
        const hasSemanticMatch = candidateSkills.some(cs =>
          semanticMatches.some(sm => cs.includes(sm) || sm.includes(cs))
        );
        if (hasSemanticMatch) {
          matchedRequired += 0.5; // Match parcial
        }
      }
    });

    // Verifica skills desejadas
    desiredSkills.forEach(desSkill => {
      const desLower = desSkill.toLowerCase();
      const hasMatch = candidateSkills.some(cs => cs.includes(desLower) || desLower.includes(cs));
      if (hasMatch) matchedDesired++;
    });

    const requiredScore = requiredSkills.length > 0
      ? (matchedRequired / requiredSkills.length) * 70
      : 70;

    const desiredScore = desiredSkills.length > 0
      ? (matchedDesired / desiredSkills.length) * 30
      : 30;

    return Math.min(100, Math.round(requiredScore + desiredScore));
  }

  /**
   * Análise de experiência
   */
  private static analyzeExperienceMatch(candidate: Candidate, job: Job): number {
    const yearsOfExperience = candidate.experience.length;

    if (yearsOfExperience >= job.restrictions.minExperience) {
      return 100;
    }

    // Pontuação parcial baseada em proximidade
    const ratio = yearsOfExperience / Math.max(1, job.restrictions.minExperience);
    return Math.min(100, Math.round(ratio * 100));
  }

  /**
   * Análise de certificações
   */
  private static analyzeCertificationMatch(candidate: Candidate, job: Job): number {
    if (job.requiredCertifications.length === 0) {
      return 100;
    }

    const validCerts = candidate.certifications.filter(
      cert => new Date(cert.expiryDate) > new Date()
    );

    const validCertIds = validCerts.map(c => c.certificationId.toLowerCase());
    const matchedCerts = job.requiredCertifications.filter(reqCert =>
      validCertIds.includes(reqCert.toLowerCase())
    );

    return Math.round((matchedCerts.length / job.requiredCertifications.length) * 100);
  }

  /**
   * Análise de compatibilidade de localização
   */
  private static analyzeLocationCompatibility(candidate: Candidate, job: Job): number {
    const candidateLocation = `${candidate.location.city}, ${candidate.location.state}`.toLowerCase();
    const jobLocation = job.location.toLowerCase();

    if (candidateLocation.includes(jobLocation) || jobLocation.includes(candidateLocation)) {
      return 100;
    }

    // Verifica se é mesma região (Ceará)
    if (candidate.location.state === 'CE' && jobLocation.includes('ce')) {
      return 70;
    }

    return 40; // Localização diferente
  }

  /**
   * Análise de fit cultural (baseado em categoria e área)
   */
  private static analyzeCulturalFit(candidate: Candidate, job: Job): number {
    let score = 50; // Base

    // Match de área
    const categoryMatch = candidate.mainArea.toLowerCase().includes(job.category.toLowerCase()) ||
                         job.category.toLowerCase().includes(candidate.mainArea.toLowerCase());

    if (categoryMatch) {
      score += 30;
    }

    // PCD fit
    if (candidate.isPCD && job.restrictions.pcdExclusive) {
      score += 20;
    }

    return Math.min(100, score);
  }

  /**
   * Identifica pontos fortes do candidato
   */
  private static identifyStrengths(
    candidate: Candidate,
    job: Job,
    insights: MatchInsights
  ): string[] {
    const strengths: string[] = [];

    if (insights.certificationMatch >= 80) {
      strengths.push('Todas as certificações necessárias em dia');
    }

    if (insights.skillAlignment >= 80) {
      strengths.push('Forte alinhamento de habilidades');
    }

    if (insights.experienceMatch === 100) {
      strengths.push('Experiência acima do requisito mínimo');
    }

    if (insights.locationScore === 100) {
      strengths.push('Localização ideal');
    }

    if (candidate.profileCompleteness >= 90) {
      strengths.push('Perfil muito completo');
    }

    return strengths;
  }

  /**
   * Identifica gaps do candidato
   */
  private static identifyGaps(
    candidate: Candidate,
    job: Job,
    insights: MatchInsights
  ): string[] {
    const gaps: string[] = [];

    if (insights.certificationMatch < 100) {
      gaps.push('Faltam algumas certificações obrigatórias');
    }

    if (insights.skillAlignment < 70) {
      gaps.push('Algumas habilidades importantes estão faltando');
    }

    if (insights.experienceMatch < 100) {
      gaps.push('Experiência abaixo do requisito mínimo');
    }

    if (candidate.profileCompleteness < 70) {
      gaps.push('Perfil incompleto - adicione mais informações');
    }

    return gaps;
  }

  /**
   * Gera recomendações personalizadas
   */
  private static generateRecommendations(
    gaps: string[],
    candidate: Candidate
  ): string[] {
    const recommendations: string[] = [];

    gaps.forEach(gap => {
      if (gap.includes('certificações')) {
        recommendations.push('Complete os cursos de certificação necessários na plataforma');
      }
      if (gap.includes('habilidades')) {
        recommendations.push('Adicione mais habilidades relevantes ao seu perfil');
      }
      if (gap.includes('experiência')) {
        recommendations.push('Destaque projetos e realizações na sua experiência profissional');
      }
      if (gap.includes('Perfil incompleto')) {
        recommendations.push('Complete todas as seções do seu perfil para melhorar o match');
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Seu perfil está ótimo! Candidate-se com confiança');
    }

    return recommendations;
  }

  /**
   * Prediz taxa de sucesso na vaga
   */
  private static predictSuccessRate(insights: MatchInsights, candidate: Candidate): number {
    // Modelo de predição baseado em múltiplos fatores
    const weights = {
      skills: 0.30,
      certs: 0.25,
      experience: 0.20,
      profile: 0.15,
      location: 0.10
    };

    const profileScore = candidate.profileCompleteness;

    const prediction = Math.round(
      insights.skillAlignment * weights.skills +
      insights.certificationMatch * weights.certs +
      insights.experienceMatch * weights.experience +
      profileScore * weights.profile +
      insights.locationScore * weights.location
    );

    return Math.min(100, prediction);
  }
}
