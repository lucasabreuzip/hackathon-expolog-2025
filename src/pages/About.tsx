import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import pecemLogo from '@/assets/pecem-logo.png';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            aria-label="Voltar para home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img 
            src={pecemLogo} 
            alt="Pecém - Complexo Industrial e Portuário" 
            className="h-11 sm:h-13 w-auto object-contain"
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Sobre a Plataforma</h1>
            <p className="text-lg text-muted-foreground">
              Conectando profissionais qualificados às oportunidades do Porto do Pecém
            </p>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Nossa Missão</h2>
            <p className="text-muted-foreground leading-relaxed">
              Desenvolver uma plataforma de empregabilidade focada em certificações técnicas,
              segurança e inclusão para o Complexo Industrial e Portuário do Pecém. 
              Facilitamos a conexão entre profissionais qualificados e empresas que buscam 
              talentos com as competências necessárias para atuar em um dos principais 
              complexos portuários do Brasil.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Diferenciais</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Sistema de controle de validade de certificações técnicas (NRs)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Algoritmo de match inteligente baseado em competências e localização</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Foco em acessibilidade e inclusão de pessoas com deficiência</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Interface mobile-first otimizada para dispositivos básicos</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Conformidade com WCAG 2.1 AA para máxima acessibilidade</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Contato</h2>
            <p className="text-muted-foreground mb-4">
              Para mais informações sobre a plataforma ou parcerias, entre em contato:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Porto do Pecém</strong></p>
              <p>São Gonçalo do Amarante - CE</p>
              <p>contato@portodopecem.ce.gov.br</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
