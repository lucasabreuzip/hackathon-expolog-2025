/**
 * Pecém Empregabilidade - Sistema de IA Completo
 *
 * Este módulo exporta todos os serviços de Inteligência Artificial da plataforma:
 *
 * 1. CourseRecommendationAI - Recomendações personalizadas de cursos
 * 2. SmartMatchingAI - Matching inteligente candidato-vaga
 * 3. VirtualAssistantAI - Chatbot com orientação de carreira
 * 4. ProfileAnalysisAI - Análise profunda de perfil e sugestões
 * 5. SemanticSearchAI - Busca semântica com NLP
 */

export { CourseRecommendationAI } from './courseRecommendation';
export type { RecommendationScore } from './courseRecommendation';

export { SmartMatchingAI } from './smartMatching';

export { VirtualAssistantAI } from './chatbot';
export type { ChatbotResponse, ChatMessage, ChatContext } from './chatbot';

export { ProfileAnalysisAI } from './profileAnalysis';
export type {
  ProfileAnalysisResult,
  ProfileSuggestion,
  KnowledgeGap,
  DevelopmentRoadmap,
  MarketReadinessScore
} from './profileAnalysis';

export { SemanticSearchAI } from './semanticSearch';
export type { SearchResult, SemanticSearchOptions } from './semanticSearch';
