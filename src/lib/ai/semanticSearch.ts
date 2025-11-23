import { Course, Job } from '@/types';

interface SearchResult<T> {
  item: T;
  relevanceScore: number;
  matchedFields: string[];
  highlights: string[];
}

interface SemanticSearchOptions {
  fuzzyMatch?: boolean;
  synonyms?: boolean;
  minScore?: number;
  maxResults?: number;
}

/**
 * Sistema de Busca Semântica com IA
 * Entendimento de linguagem natural para resultados mais relevantes
 */
export class SemanticSearchAI {
  // Mapa de sinônimos e termos relacionados
  private static readonly SYNONYMS_MAP: { [key: string]: string[] } = {
    // Operações Portuárias
    'empilhadeira': ['reach stacker', 'operador', 'movimentação', 'carga', 'armazém'],
    'portuário': ['porto', 'terminal', 'cais', 'doca', 'marítimo'],
    'operador': ['operação', 'controle', 'manejo'],
    'carga': ['descarga', 'carregamento', 'movimentação'],

    // Áreas Técnicas
    'elétrica': ['eletricista', 'instalação', 'manutenção elétrica', 'circuito', 'energia'],
    'mecânica': ['mecânico', 'manutenção', 'reparo', 'máquina'],
    'soldagem': ['soldador', 'solda', 'metalurgia'],
    'eletrônica': ['eletrônico', 'automação', 'controle'],

    // Administrativo
    'administração': ['administrativo', 'gestão', 'gerência'],
    'recursos humanos': ['rh', 'pessoal', 'gente', 'talentos'],
    'contabilidade': ['contador', 'fiscal', 'financeiro'],
    'logística': ['supply chain', 'armazém', 'distribuição', 'estoque'],

    // Tecnologia
    'programação': ['código', 'desenvolvimento', 'software', 'programador'],
    'ti': ['tecnologia', 'informática', 'sistemas', 'tech'],
    'excel': ['planilha', 'spreadsheet', 'dados', 'office'],
    'word': ['documento', 'texto', 'editor', 'office'],

    // Habilidades Comportamentais
    'liderança': ['líder', 'gestão', 'coordenação', 'supervisão'],
    'comunicação': ['comunicar', 'relacionamento', 'atendimento'],
    'trabalho em equipe': ['colaboração', 'time', 'grupo'],
    'organização': ['organizado', 'planejamento', 'estrutura'],

    // Níveis
    'básico': ['iniciante', 'fundamental', 'introdução', 'começo'],
    'intermediário': ['médio', 'regular', 'moderado'],
    'avançado': ['expert', 'especialista', 'proficiente', 'senior'],

    // Modalidades
    'ead': ['online', 'distância', 'remoto', 'digital'],
    'presencial': ['ao vivo', 'físico', 'local'],
    'híbrido': ['misto', 'blended', 'combinado'],

    // Segurança
    'segurança': ['safety', 'proteção', 'prevenção', 'epi'],
    'nr': ['norma regulamentadora', 'segurança do trabalho'],

    // Certificações
    'certificação': ['certificado', 'diploma', 'qualificação', 'credencial'],
    'curso': ['treinamento', 'capacitação', 'formação', 'aula']
  };

  /**
   * Busca semântica de cursos
   */
  public static searchCourses(
    query: string,
    allCourses: Course[],
    options: SemanticSearchOptions = {}
  ): SearchResult<Course>[] {
    const {
      fuzzyMatch = true,
      synonyms = true,
      minScore = 20,
      maxResults = 20
    } = options;

    const normalizedQuery = this.normalizeText(query);
    const queryTerms = normalizedQuery.split(/\s+/);

    const results: SearchResult<Course>[] = allCourses.map(course => {
      let score = 0;
      const matchedFields: string[] = [];
      const highlights: string[] = [];

      // Busca no título (peso 40%)
      const titleScore = this.calculateFieldScore(
        course.title,
        queryTerms,
        { fuzzyMatch, synonyms }
      );
      if (titleScore > 0) {
        score += titleScore * 0.4;
        matchedFields.push('título');
        highlights.push(course.title);
      }

      // Busca na descrição (peso 25%)
      const descScore = this.calculateFieldScore(
        course.description,
        queryTerms,
        { fuzzyMatch, synonyms }
      );
      if (descScore > 0) {
        score += descScore * 0.25;
        matchedFields.push('descrição');
      }

      // Busca em tags (peso 20%)
      const tagsScore = this.calculateArrayFieldScore(
        course.tags,
        queryTerms,
        { fuzzyMatch, synonyms }
      );
      if (tagsScore > 0) {
        score += tagsScore * 0.2;
        matchedFields.push('tags');
      }

      // Busca na categoria (peso 15%)
      const categoryScore = this.calculateFieldScore(
        course.category,
        queryTerms,
        { fuzzyMatch, synonyms }
      );
      if (categoryScore > 0) {
        score += categoryScore * 0.15;
        matchedFields.push('categoria');
      }

      // Busca no instrutor (peso adicional se match)
      const instructorScore = this.calculateFieldScore(
        course.instructor,
        queryTerms,
        { fuzzyMatch: false, synonyms: false }
      );
      if (instructorScore > 0) {
        score += instructorScore * 0.1;
        matchedFields.push('instrutor');
      }

      return {
        item: course,
        relevanceScore: Math.min(100, Math.round(score)),
        matchedFields,
        highlights
      };
    });

    return results
      .filter(r => r.relevanceScore >= minScore)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  /**
   * Busca semântica de vagas
   */
  public static searchJobs(
    query: string,
    allJobs: Job[],
    options: SemanticSearchOptions = {}
  ): SearchResult<Job>[] {
    const {
      fuzzyMatch = true,
      synonyms = true,
      minScore = 20,
      maxResults = 20
    } = options;

    const normalizedQuery = this.normalizeText(query);
    const queryTerms = normalizedQuery.split(/\s+/);

    const results: SearchResult<Job>[] = allJobs.map(job => {
      let score = 0;
      const matchedFields: string[] = [];
      const highlights: string[] = [];

      // Busca no título (peso 35%)
      const titleScore = this.calculateFieldScore(
        job.title,
        queryTerms,
        { fuzzyMatch, synonyms }
      );
      if (titleScore > 0) {
        score += titleScore * 0.35;
        matchedFields.push('título');
        highlights.push(job.title);
      }

      // Busca na descrição (peso 20%)
      const descScore = this.calculateFieldScore(
        job.description,
        queryTerms,
        { fuzzyMatch, synonyms }
      );
      if (descScore > 0) {
        score += descScore * 0.2;
        matchedFields.push('descrição');
      }

      // Busca em skills obrigatórias (peso 25%)
      const requiredSkillsScore = this.calculateArrayFieldScore(
        job.requiredSkills,
        queryTerms,
        { fuzzyMatch, synonyms }
      );
      if (requiredSkillsScore > 0) {
        score += requiredSkillsScore * 0.25;
        matchedFields.push('habilidades obrigatórias');
      }

      // Busca em skills desejadas (peso 10%)
      const desiredSkillsScore = this.calculateArrayFieldScore(
        job.desiredSkills,
        queryTerms,
        { fuzzyMatch, synonyms }
      );
      if (desiredSkillsScore > 0) {
        score += desiredSkillsScore * 0.1;
        matchedFields.push('habilidades desejadas');
      }

      // Busca na categoria (peso 10%)
      const categoryScore = this.calculateFieldScore(
        job.category,
        queryTerms,
        { fuzzyMatch, synonyms }
      );
      if (categoryScore > 0) {
        score += categoryScore * 0.1;
        matchedFields.push('categoria');
      }

      // Busca na localização (peso adicional)
      const locationScore = this.calculateFieldScore(
        job.location,
        queryTerms,
        { fuzzyMatch: false, synonyms: false }
      );
      if (locationScore > 0) {
        score += locationScore * 0.1;
        matchedFields.push('localização');
      }

      return {
        item: job,
        relevanceScore: Math.min(100, Math.round(score)),
        matchedFields,
        highlights
      };
    });

    return results
      .filter(r => r.relevanceScore >= minScore)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  /**
   * Normaliza texto para busca
   */
  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s]/g, ' ') // Remove pontuação
      .replace(/\s+/g, ' ') // Normaliza espaços
      .trim();
  }

  /**
   * Calcula score de match para um campo de texto
   */
  private static calculateFieldScore(
    fieldValue: string,
    queryTerms: string[],
    options: { fuzzyMatch: boolean; synonyms: boolean }
  ): number {
    const normalizedField = this.normalizeText(fieldValue);
    let matchCount = 0;
    const totalTerms = queryTerms.length;

    queryTerms.forEach(term => {
      // Match exato
      if (normalizedField.includes(term)) {
        matchCount += 1;
        return;
      }

      // Fuzzy match (permite pequenas variações)
      if (options.fuzzyMatch && this.fuzzyMatch(normalizedField, term)) {
        matchCount += 0.8;
        return;
      }

      // Match com sinônimos
      if (options.synonyms) {
        const synonyms = this.getSynonyms(term);
        const hasSynonymMatch = synonyms.some(syn =>
          normalizedField.includes(syn)
        );
        if (hasSynonymMatch) {
          matchCount += 0.7;
          return;
        }
      }
    });

    return (matchCount / totalTerms) * 100;
  }

  /**
   * Calcula score para campo array (tags, skills, etc)
   */
  private static calculateArrayFieldScore(
    fieldArray: string[],
    queryTerms: string[],
    options: { fuzzyMatch: boolean; synonyms: boolean }
  ): number {
    const normalizedArray = fieldArray.map(item => this.normalizeText(item));
    let matchCount = 0;
    const totalTerms = queryTerms.length;

    queryTerms.forEach(term => {
      // Match exato em algum item do array
      if (normalizedArray.some(item => item.includes(term))) {
        matchCount += 1;
        return;
      }

      // Fuzzy match em algum item
      if (options.fuzzyMatch) {
        const hasFuzzyMatch = normalizedArray.some(item =>
          this.fuzzyMatch(item, term)
        );
        if (hasFuzzyMatch) {
          matchCount += 0.8;
          return;
        }
      }

      // Match com sinônimos
      if (options.synonyms) {
        const synonyms = this.getSynonyms(term);
        const hasSynonymMatch = normalizedArray.some(item =>
          synonyms.some(syn => item.includes(syn))
        );
        if (hasSynonymMatch) {
          matchCount += 0.7;
          return;
        }
      }
    });

    return (matchCount / totalTerms) * 100;
  }

  /**
   * Fuzzy matching simples (permite 1-2 caracteres diferentes)
   */
  private static fuzzyMatch(text: string, term: string): boolean {
    if (term.length < 4) return false; // Muito curto para fuzzy match

    // Verifica se termo está contido com pequenas variações
    const words = text.split(/\s+/);
    return words.some(word => {
      if (Math.abs(word.length - term.length) > 2) return false;

      let differences = 0;
      const maxDiff = term.length <= 6 ? 1 : 2;

      for (let i = 0; i < Math.min(word.length, term.length); i++) {
        if (word[i] !== term[i]) differences++;
        if (differences > maxDiff) return false;
      }

      return differences <= maxDiff;
    });
  }

  /**
   * Obtém sinônimos de um termo
   */
  private static getSynonyms(term: string): string[] {
    const normalized = this.normalizeText(term);

    // Busca direta
    if (this.SYNONYMS_MAP[normalized]) {
      return this.SYNONYMS_MAP[normalized];
    }

    // Busca em valores (termo pode ser sinônimo de outra palavra)
    for (const [key, synonyms] of Object.entries(this.SYNONYMS_MAP)) {
      if (synonyms.includes(normalized)) {
        return [key, ...synonyms.filter(s => s !== normalized)];
      }
    }

    return [];
  }

  /**
   * Extrai palavras-chave da query
   */
  public static extractKeywords(query: string): string[] {
    const normalized = this.normalizeText(query);
    const words = normalized.split(/\s+/);

    // Remove stop words comuns
    const stopWords = new Set([
      'o', 'a', 'os', 'as', 'de', 'da', 'do', 'das', 'dos',
      'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com',
      'um', 'uma', 'uns', 'umas', 'e', 'ou', 'que', 'qual'
    ]);

    return words.filter(w => w.length > 2 && !stopWords.has(w));
  }

  /**
   * Sugere termos relacionados para a busca
   */
  public static suggestRelatedTerms(query: string): string[] {
    const keywords = this.extractKeywords(query);
    const relatedTerms = new Set<string>();

    keywords.forEach(keyword => {
      const synonyms = this.getSynonyms(keyword);
      synonyms.forEach(syn => relatedTerms.add(syn));
    });

    return Array.from(relatedTerms).slice(0, 5);
  }

  /**
   * Autocomplete inteligente
   */
  public static autocomplete(
    partial: string,
    allCourses: Course[],
    allJobs: Job[]
  ): string[] {
    const normalized = this.normalizeText(partial);
    if (normalized.length < 2) return [];

    const suggestions = new Set<string>();

    // Busca em títulos de cursos
    allCourses.forEach(course => {
      const titleWords = this.normalizeText(course.title).split(/\s+/);
      titleWords.forEach(word => {
        if (word.startsWith(normalized) && word.length > normalized.length) {
          suggestions.add(word);
        }
      });

      // Adiciona tags relevantes
      course.tags.forEach(tag => {
        const normalizedTag = this.normalizeText(tag);
        if (normalizedTag.includes(normalized)) {
          suggestions.add(tag);
        }
      });
    });

    // Busca em títulos de vagas
    allJobs.forEach(job => {
      const titleWords = this.normalizeText(job.title).split(/\s+/);
      titleWords.forEach(word => {
        if (word.startsWith(normalized) && word.length > normalized.length) {
          suggestions.add(word);
        }
      });

      // Adiciona skills relevantes
      [...job.requiredSkills, ...job.desiredSkills].forEach(skill => {
        const normalizedSkill = this.normalizeText(skill);
        if (normalizedSkill.includes(normalized)) {
          suggestions.add(skill);
        }
      });
    });

    return Array.from(suggestions).slice(0, 8);
  }

  /**
   * Analisa intenção da busca
   */
  public static analyzeSearchIntent(query: string): {
    type: 'course' | 'job' | 'skill' | 'certification' | 'general';
    confidence: number;
  } {
    const normalized = this.normalizeText(query);

    const courseKeywords = ['curso', 'aula', 'aprender', 'estudar', 'capacitação', 'treinamento'];
    const jobKeywords = ['vaga', 'emprego', 'trabalho', 'oportunidade', 'contratação'];
    const skillKeywords = ['habilidade', 'skill', 'competência', 'saber'];
    const certKeywords = ['certificado', 'certificação', 'diploma'];

    const courseScore = courseKeywords.filter(k => normalized.includes(k)).length;
    const jobScore = jobKeywords.filter(k => normalized.includes(k)).length;
    const skillScore = skillKeywords.filter(k => normalized.includes(k)).length;
    const certScore = certKeywords.filter(k => normalized.includes(k)).length;

    const maxScore = Math.max(courseScore, jobScore, skillScore, certScore);

    if (maxScore === 0) {
      return { type: 'general', confidence: 50 };
    }

    if (courseScore === maxScore) {
      return { type: 'course', confidence: Math.min(100, courseScore * 40) };
    }
    if (jobScore === maxScore) {
      return { type: 'job', confidence: Math.min(100, jobScore * 40) };
    }
    if (certScore === maxScore) {
      return { type: 'certification', confidence: Math.min(100, certScore * 40) };
    }
    if (skillScore === maxScore) {
      return { type: 'skill', confidence: Math.min(100, skillScore * 40) };
    }

    return { type: 'general', confidence: 50 };
  }
}
