import { Candidate, Course, CourseProgress, Job, Application } from '@/types';
import { SmartMatchingAI } from './smartMatching';
import { CourseRecommendationAI } from './courseRecommendation';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContext {
  candidate: Candidate;
  courses: Course[];
  courseProgress: CourseProgress[];
  jobs?: Job[];
  applications?: Application[];
}

interface ChatbotResponse {
  message: string;
  suggestions?: string[];
  data?: unknown;
  actionType?: 'course_recommendation' | 'profile_analysis' | 'career_guidance' | 'navigation' | 'general';
}

/**
 * Assistente Virtual Inteligente
 * Chatbot com IA para orientação de carreira e suporte
 */
export class VirtualAssistantAI {
  /**
   * Processa mensagem do usuário e gera resposta contextual
   */
  public static async processMessage(
    userMessage: string,
    context: ChatContext,
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatbotResponse> {
    const messageLower = userMessage.toLowerCase();

    // Análise de intenção baseada em palavras-chave
    if (this.isAboutCourses(messageLower)) {
      return this.handleCourseQuery(messageLower, context);
    }

    if (this.isAboutProfile(messageLower)) {
      return this.handleProfileQuery(context);
    }

    if (this.isAboutCareer(messageLower)) {
      return this.handleCareerGuidance(context);
    }

    if (this.isAboutJobs(messageLower)) {
      return this.handleJobQuery(messageLower, context);
    }

    if (this.isAboutCertifications(messageLower)) {
      return this.handleCertificationQuery(context);
    }

    if (this.isAboutProgress(messageLower)) {
      return this.handleProgressQuery(context);
    }

    // Resposta padrão com sugestões
    return this.handleGeneralQuery(messageLower, context);
  }

  /**
   * Análise de perfil do candidato
   */
  public static analyzeProfile(context: ChatContext): ChatbotResponse {
    const { candidate, courseProgress } = context;
    const completedCourses = courseProgress.filter(p => p.status === 'completed').length;
    const inProgressCourses = courseProgress.filter(
      p => p.status === 'in_progress' || p.status === 'enrolled'
    ).length;

    const profileScore = candidate.profileCompleteness;
    let profileFeedback = '';

    if (profileScore >= 90) {
      profileFeedback = '🌟 Seu perfil está excelente! Muito completo e bem estruturado.';
    } else if (profileScore >= 70) {
      profileFeedback = '👍 Seu perfil está bom, mas ainda há espaço para melhorias.';
    } else {
      profileFeedback = '⚠️ Seu perfil precisa de atenção. Complete mais informações para melhorar suas chances.';
    }

    const recommendations: string[] = [];

    if (candidate.skills.length < 5) {
      recommendations.push('Adicione mais habilidades ao seu perfil (mínimo recomendado: 5)');
    }

    if (candidate.certifications.length === 0) {
      recommendations.push('Obtenha certificações para se destacar no mercado');
    }

    if (candidate.experience.length < 2) {
      recommendations.push('Adicione mais experiências profissionais ao seu perfil');
    }

    if (profileScore < 80) {
      recommendations.push('Complete todas as seções do seu perfil para alcançar 80%+');
    }

    const message = `
📊 **Análise do Seu Perfil**

${profileFeedback}

**Estatísticas:**
- Completude do Perfil: ${profileScore}%
- Habilidades: ${candidate.skills.length}
- Certificações: ${candidate.certifications.length}
- Experiências: ${candidate.experience.length}
- Cursos Concluídos: ${completedCourses}
- Cursos em Andamento: ${inProgressCourses}

${recommendations.length > 0 ? '**Recomendações para Melhorar:**\n' + recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n') : ''}
    `.trim();

    return {
      message,
      actionType: 'profile_analysis',
      suggestions: [
        'Quais cursos você recomenda?',
        'Como melhorar meu perfil?',
        'Quais são minhas chances nas vagas?'
      ]
    };
  }

  /**
   * Orientação de carreira personalizada
   */
  public static provideCareerGuidance(context: ChatContext): ChatbotResponse {
    const { candidate, courses, courseProgress } = context;
    const roadmap = CourseRecommendationAI.getPersonalizedRoadmap(
      candidate,
      courses,
      courseProgress
    );

    const message = `
🎯 **Orientação de Carreira Personalizada**

Com base no seu perfil como **${candidate.mainArea}**, aqui está seu plano de desenvolvimento:

**📍 Ações Imediatas (Próximas 2 semanas):**
${roadmap.immediate.map((rec, i) =>
  `${i + 1}. ${rec.course.title} - Score: ${rec.score}% - ${rec.reason}`
).join('\n') || 'Você está no caminho certo! Continue seus cursos atuais.'}

**🚀 Curto Prazo (1-3 meses):**
${roadmap.shortTerm.map((rec, i) =>
  `${i + 1}. ${rec.course.title} - ${rec.reason}`
).join('\n') || 'Foque em completar os cursos em andamento primeiro.'}

**🌟 Longo Prazo (3-6 meses):**
${roadmap.longTerm.map((rec, i) =>
  `${i + 1}. ${rec.course.title} - ${rec.reason}`
).join('\n') || 'Continue desenvolvendo suas habilidades principais.'}

**Dica Profissional:** ${this.getCareerTip(candidate)}
    `.trim();

    return {
      message,
      actionType: 'career_guidance',
      data: roadmap,
      suggestions: [
        'Ver cursos recomendados',
        'Analisar meu perfil',
        'Buscar vagas compatíveis'
      ]
    };
  }

  /**
   * Detecta se a mensagem é sobre cursos
   */
  private static isAboutCourses(message: string): boolean {
    const keywords = ['curso', 'cursos', 'aprender', 'estudar', 'capacitação', 'treinamento', 'aula'];
    return keywords.some(k => message.includes(k));
  }

  /**
   * Detecta se a mensagem é sobre perfil
   */
  private static isAboutProfile(message: string): boolean {
    const keywords = ['perfil', 'meu perfil', 'como estou', 'minha conta', 'meus dados'];
    return keywords.some(k => message.includes(k));
  }

  /**
   * Detecta se a mensagem é sobre carreira
   */
  private static isAboutCareer(message: string): boolean {
    const keywords = ['carreira', 'crescer', 'desenvolvimento', 'orientação', 'futuro', 'plano'];
    return keywords.some(k => message.includes(k));
  }

  /**
   * Detecta se a mensagem é sobre vagas
   */
  private static isAboutJobs(message: string): boolean {
    const keywords = ['vaga', 'vagas', 'emprego', 'trabalho', 'oportunidade'];
    return keywords.some(k => message.includes(k));
  }

  /**
   * Detecta se a mensagem é sobre certificações
   */
  private static isAboutCertifications(message: string): boolean {
    const keywords = ['certificado', 'certificação', 'certificações', 'diploma'];
    return keywords.some(k => message.includes(k));
  }

  /**
   * Detecta se a mensagem é sobre progresso
   */
  private static isAboutProgress(message: string): boolean {
    const keywords = ['progresso', 'andamento', 'como estou indo', 'evolução', 'status'];
    return keywords.some(k => message.includes(k));
  }

  /**
   * Responde perguntas sobre cursos
   */
  private static handleCourseQuery(message: string, context: ChatContext): ChatbotResponse {
    const { candidate, courses, courseProgress } = context;
    const recommendations = CourseRecommendationAI.getRecommendations(
      candidate,
      courses,
      courseProgress,
      3
    );

    const inProgress = courseProgress.filter(
      p => p.status === 'in_progress' || p.status === 'enrolled'
    ).length;

    const message_text = `
📚 **Sobre Seus Cursos**

Você tem **${inProgress} curso(s) em andamento**.

**Cursos Recomendados para Você:**
${recommendations.map((rec, i) =>
  `${i + 1}. **${rec.course.title}**\n   - ${rec.reason}\n   - Prioridade: ${rec.priority === 'high' ? '🔥 Alta' : rec.priority === 'medium' ? '⭐ Média' : '💡 Baixa'}`
).join('\n\n')}

Quer saber mais sobre algum curso específico?
    `.trim();

    return {
      message: message_text,
      actionType: 'course_recommendation',
      data: recommendations,
      suggestions: [
        'Ver todos os cursos',
        'Meus cursos em andamento',
        'Como escolher um curso?'
      ]
    };
  }

  /**
   * Responde perguntas sobre perfil
   */
  private static handleProfileQuery(context: ChatContext): ChatbotResponse {
    return this.analyzeProfile(context);
  }

  /**
   * Fornece orientação de carreira
   */
  private static handleCareerGuidance(context: ChatContext): ChatbotResponse {
    return this.provideCareerGuidance(context);
  }

  /**
   * Responde perguntas sobre vagas
   */
  private static handleJobQuery(message: string, context: ChatContext): ChatbotResponse {
    const { candidate, jobs = [], applications = [] } = context;

    const activeApplications = applications.filter(
      a => a.status === 'pending' || a.status === 'in_review'
    ).length;

    let jobMessage = `
💼 **Sobre Vagas e Oportunidades**

Você tem **${activeApplications} candidatura(s) ativa(s)**.
    `.trim();

    if (jobs.length > 0) {
      const topJob = jobs[0];
      const match = SmartMatchingAI.calculateEnhancedMatch(candidate, topJob);

      jobMessage += `

**Melhor Vaga para Você:**
- **${topJob.title}**
- Score de Match: ${match.score}%
- Confiança: ${match.confidence === 'high' ? '🟢 Alta' : match.confidence === 'medium' ? '🟡 Média' : '🔴 Baixa'}

${match.strengths.length > 0 ? `**Seus Pontos Fortes:**\n${match.strengths.map(s => `✅ ${s}`).join('\n')}` : ''}

${match.gaps.length > 0 ? `\n**Áreas para Desenvolvimento:**\n${match.gaps.map(g => `📝 ${g}`).join('\n')}` : ''}
      `.trim();
    } else {
      jobMessage += '\n\nAinda não temos vagas mapeadas para você. Complete seu perfil para receber recomendações!';
    }

    return {
      message: jobMessage,
      actionType: 'general',
      suggestions: [
        'Buscar vagas',
        'Melhorar meu match',
        'Ver minhas candidaturas'
      ]
    };
  }

  /**
   * Responde perguntas sobre certificações
   */
  private static handleCertificationQuery(context: ChatContext): ChatbotResponse {
    const { candidate, courseProgress } = context;
    const completedCourses = courseProgress.filter(p => p.status === 'completed');
    const validCerts = candidate.certifications.filter(
      cert => new Date(cert.expiryDate) > new Date()
    );
    const expiredCerts = candidate.certifications.filter(
      cert => new Date(cert.expiryDate) <= new Date()
    );

    const message = `
🏆 **Suas Certificações**

**Certificações Válidas:** ${validCerts.length}
${validCerts.map(cert =>
  `- ${cert.certificationId} (Validade: ${new Date(cert.expiryDate).toLocaleDateString('pt-BR')})`
).join('\n') || '- Nenhuma certificação válida'}

${expiredCerts.length > 0 ? `\n⚠️ **Certificações Expiradas:** ${expiredCerts.length}\n${expiredCerts.map(cert => `- ${cert.certificationId}`).join('\n')}` : ''}

**Cursos Concluídos com Certificado:** ${completedCourses.filter(p => p.certificateIssued).length}

💡 **Dica:** Complete mais cursos na plataforma para obter certificações reconhecidas pelo mercado!
    `.trim();

    return {
      message,
      actionType: 'general',
      suggestions: [
        'Ver cursos para certificação',
        'Meus certificados',
        'Renovar certificações'
      ]
    };
  }

  /**
   * Responde perguntas sobre progresso
   */
  private static handleProgressQuery(context: ChatContext): ChatbotResponse {
    const { courseProgress } = context;

    const completed = courseProgress.filter(p => p.status === 'completed').length;
    const inProgress = courseProgress.filter(
      p => p.status === 'in_progress' || p.status === 'enrolled'
    ).length;

    const totalProgress = courseProgress.reduce(
      (sum, p) => sum + p.progressPercentage, 0
    ) / Math.max(courseProgress.length, 1);

    const message = `
📈 **Seu Progresso na Plataforma**

**Status Atual:**
- Cursos Concluídos: ${completed}
- Cursos em Andamento: ${inProgress}
- Progresso Médio: ${Math.round(totalProgress)}%

${inProgress > 0 ? '🎯 Continue focado! Você está fazendo um ótimo trabalho.' : ''}
${completed > 3 ? '🌟 Parabéns pela dedicação! Você já concluiu vários cursos.' : ''}
${completed === 0 && inProgress === 0 ? '💡 Que tal começar um curso hoje? Vou te recomendar alguns!' : ''}
    `.trim();

    return {
      message,
      actionType: 'general',
      suggestions: [
        'Ver meus cursos',
        'Continuar estudando',
        'Buscar novos cursos'
      ]
    };
  }

  /**
   * Resposta geral com navegação
   */
  private static handleGeneralQuery(message: string, context: ChatContext): ChatbotResponse {
    const greeting = this.isGreeting(message);

    if (greeting) {
      return {
        message: `Olá, ${context.candidate.name}! 👋\n\nSou sua assistente virtual. Estou aqui para ajudar você com:\n\n✅ Recomendações de cursos personalizadas\n✅ Análise do seu perfil profissional\n✅ Orientação de carreira\n✅ Informações sobre vagas e oportunidades\n✅ Acompanhamento do seu progresso\n\nComo posso ajudar você hoje?`,
        actionType: 'general',
        suggestions: [
          'Analisar meu perfil',
          'Recomendar cursos',
          'Orientação de carreira',
          'Buscar vagas'
        ]
      };
    }

    return {
      message: `Entendi que você quer saber sobre: "${message}".\n\nAinda estou aprendendo! Mas posso te ajudar com:\n\n📚 Cursos e capacitações\n👤 Análise de perfil\n🎯 Orientação de carreira\n💼 Vagas e oportunidades\n📊 Seu progresso\n\nO que você gostaria de saber?`,
      actionType: 'general',
      suggestions: [
        'Analisar meu perfil',
        'Ver cursos recomendados',
        'Buscar vagas',
        'Meu progresso'
      ]
    };
  }

  /**
   * Detecta saudações
   */
  private static isGreeting(message: string): boolean {
    const greetings = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'opa'];
    return greetings.some(g => message.includes(g));
  }

  /**
   * Gera dica de carreira personalizada
   */
  private static getCareerTip(candidate: Candidate): string {
    const tips = [
      'Mantenha seu perfil sempre atualizado com suas últimas experiências e habilidades.',
      'Certificações validam seu conhecimento - complete cursos para obtê-las!',
      'Networking é fundamental. Participe de eventos e conecte-se com profissionais da área.',
      'A prática leva à perfeição. Aplique o que você aprende nos cursos em projetos reais.',
      'Esteja aberto a aprender continuamente. O mercado está sempre evoluindo.'
    ];

    if (candidate.certifications.length === 0) {
      return 'Obtenha certificações! Elas são diferenciais importantes no mercado de trabalho.';
    }

    if (candidate.profileCompleteness < 70) {
      return 'Complete seu perfil! Perfis completos têm até 3x mais chances de serem vistos por recrutadores.';
    }

    if (candidate.skills.length < 5) {
      return 'Adicione mais habilidades ao seu perfil para aumentar suas chances em processos seletivos.';
    }

    return tips[Math.floor(Math.random() * tips.length)];
  }

  /**
   * Prepara contexto para integração com WhatsApp
   * Este método será usado quando integrarmos com API do WhatsApp
   */
  public static prepareWhatsAppContext(
    phoneNumber: string,
    candidate: Candidate,
    courses: Course[],
    courseProgress: CourseProgress[]
  ): ChatContext {
    return {
      candidate,
      courses,
      courseProgress
    };
  }

  /**
   * Formata resposta para WhatsApp (texto simples sem markdown)
   */
  public static formatForWhatsApp(response: ChatbotResponse): string {
    // Remove markdown para WhatsApp
    return response.message
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/`/g, '')
      .trim();
  }
}