# Sistema de IA - Pecém Empregabilidade

## Visão Geral

Este documento descreve o sistema completo de Inteligência Artificial implementado na plataforma Pecém Empregabilidade. O sistema foi desenvolvido para oferecer uma experiência personalizada e inteligente aos usuários.

## 📋 Componentes do Sistema

### 1. **Recomendação de Cursos Personalizados** ✅

**Arquivo:** `src/lib/ai/courseRecommendation.ts`

**Funcionalidades:**
- Análise do perfil do candidato (certificações, experiência, skills)
- Sugestão de cursos relevantes para crescimento profissional
- Score de recomendação baseado em objetivos de carreira
- Roadmap personalizado de desenvolvimento

**Algoritmo de Scoring:**
- **30%** - Alinhamento com área de atuação
- **25%** - Gap de certificações
- **20%** - Compatibilidade de habilidades
- **15%** - Completude do perfil
- **10%** - Progressão de carreira

**Métodos Principais:**
```typescript
CourseRecommendationAI.getRecommendations(candidate, courses, progress, limit)
CourseRecommendationAI.getPersonalizedRoadmap(candidate, courses, progress)
```

**Uso na UI:**
- Dashboard do candidato mostra top 3 cursos recomendados
- Badge com score de match e prioridade (alta/média/baixa)
- Explicação do porquê da recomendação

---

### 2. **Sistema de Matching Inteligente** ✅

**Arquivo:** `src/lib/ai/smartMatching.ts`

**Funcionalidades:**
- Análise semântica de compatibilidade candidato-vaga
- Predição de taxa de sucesso na vaga
- Identificação de pontos fortes e gaps
- Recomendações personalizadas de melhoria

**Análise Multi-dimensional:**
- **Skill Alignment** - Alinhamento de habilidades (com análise semântica)
- **Experience Match** - Compatibilidade de experiência
- **Certification Match** - Certificações válidas vs requeridas
- **Location Score** - Compatibilidade de localização
- **Cultural Fit** - Fit cultural baseado em área e categoria

**Score Ponderado:**
- Skills: 25%
- Experience: 20%
- Certifications: 30%
- Location: 15%
- Cultural Fit: 10%

**Métodos Principais:**
```typescript
SmartMatchingAI.calculateEnhancedMatch(candidate, job)
```

**Retorno:**
```typescript
{
  score: number,                    // 0-100
  confidence: 'high' | 'medium' | 'low',
  strengths: string[],
  gaps: string[],
  recommendations: string[],
  successPrediction: number,        // 0-100
  insights: {
    skillAlignment: number,
    experienceMatch: number,
    certificationMatch: number,
    locationScore: number,
    culturalFit: number
  }
}
```

---

### 3. **Assistente Virtual (Chatbot)** ✅

**Arquivo:** `src/lib/ai/chatbot.ts`
**Componente UI:** `src/components/AIChatbot.tsx`

**Funcionalidades:**
- Chat inteligente para tirar dúvidas sobre cursos
- Orientação de carreira personalizada
- Análise de perfil em tempo real
- Ajuda na navegação da plataforma
- Sugestões contextuais

**Capacidades:**
- Análise de intenção da mensagem
- Respostas contextualizadas ao perfil do usuário
- Sugestões de ações rápidas
- Histórico de conversa

**Preparado para WhatsApp:**
- Método `prepareWhatsAppContext()` para integração futura
- Método `formatForWhatsApp()` para formatar mensagens

**Métodos Principais:**
```typescript
VirtualAssistantAI.processMessage(userMessage, context, history)
VirtualAssistantAI.analyzeProfile(context)
VirtualAssistantAI.provideCareerGuidance(context)
```

**Uso na UI:**
- Botão flutuante no canto inferior direito
- Janela de chat modal com histórico
- Sugestões rápidas de perguntas
- Badge "IA" identificando assistente inteligente

---

### 4. **Análise de Perfil com IA** ✅

**Arquivo:** `src/lib/ai/profileAnalysis.ts`

**Funcionalidades:**
- Análise profunda do perfil do candidato
- Sugestões automáticas de melhorias
- Identificação de gaps de conhecimento
- Roadmap de desenvolvimento personalizado
- Avaliação de prontidão para o mercado

**Breakdown de Score:**
- Completude do perfil
- Quantidade e qualidade de habilidades
- Experiência profissional
- Certificações válidas
- Engajamento com a plataforma

**Componentes da Análise:**

#### Knowledge Gaps
Identifica áreas de conhecimento faltantes:
- Habilidades demandadas pelo mercado
- Certificações importantes
- Cursos recomendados para preencher gaps
- Severidade: crítico, importante, nice-to-have

#### Development Roadmap
Cria plano de desenvolvimento em fases:
- **Fase 1:** Fundamentos (0-2 meses)
- **Fase 2:** Desenvolvimento (2-4 meses)
- **Fase 3:** Especialização (4-6 meses)

#### Market Readiness
Avalia prontidão para o mercado:
- Score geral (0-100)
- Nível: não pronto, preparação, pronto, altamente competitivo
- Fatores analisados: qualidade do perfil, relevância de skills, certificações, experiência

**Métodos Principais:**
```typescript
ProfileAnalysisAI.analyzeProfile(candidate, courses, progress, jobs)
```

**Retorno Completo:**
```typescript
{
  overallScore: number,
  scoreBreakdown: {...},
  strengths: string[],
  weaknesses: string[],
  suggestions: ProfileSuggestion[],
  knowledgeGaps: KnowledgeGap[],
  developmentRoadmap: DevelopmentRoadmap,
  marketReadiness: MarketReadinessScore
}
```

---

### 5. **Busca Semântica** ✅

**Arquivo:** `src/lib/ai/semanticSearch.ts`

**Funcionalidades:**
- Busca inteligente de cursos e vagas
- Entendimento de linguagem natural
- Matching com sinônimos e termos relacionados
- Fuzzy matching para correção de erros de digitação
- Autocomplete inteligente
- Análise de intenção de busca

**Mapa de Sinônimos:**
Inclui mapeamento extensivo de termos relacionados:
- Operações Portuárias (empilhadeira, reach stacker, etc.)
- Áreas Técnicas (elétrica, mecânica, soldagem, etc.)
- Administrativo (RH, contabilidade, logística, etc.)
- Tecnologia (programação, TI, Excel, etc.)
- Habilidades Comportamentais (liderança, comunicação, etc.)

**Algoritmo de Relevância:**

Para Cursos:
- Título: 40%
- Descrição: 25%
- Tags: 20%
- Categoria: 15%

Para Vagas:
- Título: 35%
- Descrição: 20%
- Skills Obrigatórias: 25%
- Skills Desejadas: 10%
- Categoria: 10%

**Métodos Principais:**
```typescript
SemanticSearchAI.searchCourses(query, courses, options)
SemanticSearchAI.searchJobs(query, jobs, options)
SemanticSearchAI.autocomplete(partial, courses, jobs)
SemanticSearchAI.analyzeSearchIntent(query)
SemanticSearchAI.suggestRelatedTerms(query)
```

**Opções de Busca:**
```typescript
{
  fuzzyMatch: boolean,    // Permite erros de digitação
  synonyms: boolean,      // Usa sinônimos
  minScore: number,       // Score mínimo (0-100)
  maxResults: number      // Limite de resultados
}
```

---

## 🎯 Implementações na UI

### Dashboard do Candidato
✅ **Implementado:**
- Seção de "Cursos Recomendados para Você" com badge "IA"
- Top 3 cursos com score de match
- Explicação do porquê da recomendação
- Priorização visual (alta/média/baixa)

### Chatbot Flutuante
✅ **Implementado:**
- Botão flutuante com indicador de IA
- Janela de chat modal
- Histórico de conversas
- Sugestões rápidas
- Animação de loading
- Scroll automático

### Ainda a Implementar
- [ ] Busca semântica na página de cursos
- [ ] Busca semântica na página de vagas
- [ ] Análise de perfil na página de perfil
- [ ] Insights de matching na tela de detalhes da vaga
- [ ] Integração com WhatsApp para chatbot

---

## 📚 Como Usar

### 1. Importar os Serviços de IA

```typescript
import {
  CourseRecommendationAI,
  SmartMatchingAI,
  VirtualAssistantAI,
  ProfileAnalysisAI,
  SemanticSearchAI
} from '@/lib/ai';
```

### 2. Exemplo: Recomendações de Cursos

```typescript
const recommendations = CourseRecommendationAI.getRecommendations(
  candidate,
  allCourses,
  userProgress,
  3 // Top 3
);

recommendations.forEach(rec => {
  console.log(`${rec.course.title} - Score: ${rec.score}%`);
  console.log(`Razão: ${rec.reason}`);
  console.log(`Prioridade: ${rec.priority}`);
});
```

### 3. Exemplo: Matching Inteligente

```typescript
const match = SmartMatchingAI.calculateEnhancedMatch(candidate, job);

console.log(`Score: ${match.score}%`);
console.log(`Confiança: ${match.confidence}`);
console.log(`Predição de Sucesso: ${match.successPrediction}%`);
console.log(`Pontos Fortes:`, match.strengths);
console.log(`Gaps:`, match.gaps);
console.log(`Recomendações:`, match.recommendations);
```

### 4. Exemplo: Chatbot

```typescript
const context = {
  candidate,
  courses: allCourses,
  courseProgress: userProgress
};

const response = await VirtualAssistantAI.processMessage(
  "Quais cursos você recomenda?",
  context,
  conversationHistory
);

console.log(response.message);
console.log('Sugestões:', response.suggestions);
```

### 5. Exemplo: Análise de Perfil

```typescript
const analysis = ProfileAnalysisAI.analyzeProfile(
  candidate,
  allCourses,
  userProgress,
  marketJobs
);

console.log(`Score Geral: ${analysis.overallScore}%`);
console.log('Pontos Fortes:', analysis.strengths);
console.log('Pontos Fracos:', analysis.weaknesses);
console.log('Sugestões:', analysis.suggestions);
console.log('Roadmap:', analysis.developmentRoadmap);
console.log('Prontidão:', analysis.marketReadiness);
```

### 6. Exemplo: Busca Semântica

```typescript
const results = SemanticSearchAI.searchCourses(
  "curso de empilhadeira",
  allCourses,
  {
    fuzzyMatch: true,
    synonyms: true,
    minScore: 30,
    maxResults: 10
  }
);

results.forEach(result => {
  console.log(`${result.item.title} - Relevância: ${result.relevanceScore}%`);
  console.log('Campos correspondentes:', result.matchedFields);
});
```

---

## 🔧 Tecnologias Utilizadas

- **TypeScript** - Tipagem forte para segurança
- **React 18.3** - Interface do usuário
- **Algoritmos Proprietários** - Análise semântica e scoring
- **JSON Mock Data** - Dados de teste

---

## 🚀 Próximos Passos

### Curto Prazo
1. Implementar busca semântica nas páginas de cursos e vagas
2. Adicionar análise de perfil na página de perfil
3. Melhorar matching na tela de detalhes da vaga
4. Testes de usabilidade com usuários

### Médio Prazo
1. Integração com WhatsApp Business API
2. Machine Learning para melhorar recomendações
3. A/B testing de algoritmos de matching
4. Analytics de uso do chatbot

### Longo Prazo
1. Processamento de Linguagem Natural avançado
2. Integração com modelos de IA externos (GPT, etc.)
3. Sistema de feedback e aprendizado contínuo
4. Personalização profunda baseada em comportamento

---

## 📊 Métricas de Sucesso

### KPIs Esperados
- **Engajamento:** +40% no uso de cursos
- **Conversão:** +30% de inscrições em cursos
- **Satisfação:** NPS >70 no chatbot
- **Matching:** +25% de precisão nas recomendações
- **Retenção:** +35% de usuários ativos mensais

---

## 🤝 Contribuindo

Para adicionar novas funcionalidades ao sistema de IA:

1. Crie um novo arquivo em `src/lib/ai/`
2. Implemente a lógica seguindo o padrão de classes estáticas
3. Adicione tipos TypeScript apropriados
4. Exporte no `src/lib/ai/index.ts`
5. Crie componente de UI se necessário
6. Atualize esta documentação

---

## 📝 Notas Técnicas

- Todos os algoritmos são executados no lado do cliente
- Não há latência de rede para processamento de IA
- Dados sensíveis nunca saem do navegador
- Sistema preparado para migração para backend quando necessário
- Código modular e facilmente testável

---

**Última atualização:**
**Versão:** 1.0.0
**Autor:** Lucas Abreu
