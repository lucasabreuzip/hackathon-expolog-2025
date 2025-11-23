import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Shield, TrendingUp } from 'lucide-react';
import { SplashScreen } from '@/components/SplashScreen';
import { ThemeToggle } from '@/components/ThemeToggle';
import pecemLogo from '@/assets/pecem-logo.png';

const Landing = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex justify-between items-center gap-2">
          <img
            src={pecemLogo}
            alt="Pecém - Complexo Industrial e Portuário"
            className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
          />
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              aria-label="Fazer login"
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/cadastro')}
              aria-label="Criar nova conta"
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              Cadastrar
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-gradient py-10 sm:py-16 md:py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 text-primary dark:text-white leading-tight px-2"
                data-aos="fade-down"
                data-aos-duration="1000"
              >
                Conectando Talentos ao Porto do Pecém
              </h1>
              <p
                className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed px-2"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="1000"
              >
                Plataforma de empregabilidade focada em certificações técnicas e segurança
              </p>
            </div>
          </div>
        </section>

        {/* CTA Cards */}
        <section className="container mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 mb-12 sm:mb-16">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <Card
              className="p-6 sm:p-8 hover:shadow-xl transition-all cursor-pointer card-elevated h-full"
              onClick={() => navigate('/cadastro?tipo=candidato')}
              data-aos="fade-right"
              data-aos-delay="300"
              data-aos-duration="1000"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/cadastro?tipo=candidato');
                }
              }}
              aria-label="Sou Candidato - Criar conta como profissional"
            >
              <div className="flex flex-col items-center justify-between text-center space-y-4 h-full">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold">Sou Candidato</h2>
                  <p className="text-base text-muted-foreground leading-relaxed min-h-[4.5rem]">
                    Cadastre suas certificações, encontre vagas compatíveis e candidate-se às melhores oportunidades.
                  </p>
                </div>
                <Button className="w-full mt-auto" size="lg">
                  Começar Agora
                </Button>
              </div>
            </Card>

            <Card
              className="p-6 sm:p-8 hover:shadow-xl transition-all cursor-pointer card-elevated h-full"
              onClick={() => navigate('/cadastro?tipo=empresa')}
              data-aos="fade-left"
              data-aos-delay="300"
              data-aos-duration="1000"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/cadastro?tipo=empresa');
                }
              }}
              aria-label="Sou Empresa - Criar conta empresarial"
            >
              <div className="flex flex-col items-center justify-between text-center space-y-4 h-full">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-8 w-8 text-secondary" aria-hidden="true" />
                </div>
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold">Sou Empresa</h2>
                  <p className="text-base text-muted-foreground leading-relaxed min-h-[4.5rem]">
                    Publique vagas, encontre profissionais qualificados e gerencie seus processos seletivos.
                  </p>
                </div>
                <Button className="w-full mt-auto" size="lg" variant="secondary">
                  Criar Conta Empresarial
                </Button>
              </div>
            </Card>
          </div>
        </section>


        {/* Features Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 
              className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              Por que usar nossa plataforma?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <Card className="p-5 sm:p-6" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3 sm:mb-4" aria-hidden="true" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Certificações Verificadas
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Sistema de controle de validade de NRs e certificações técnicas.
                  Receba alertas antes do vencimento.
                </p>
              </Card>

              <Card className="p-5 sm:p-6" data-aos="fade-up" data-aos-delay="350" data-aos-duration="1000">
                <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3 sm:mb-4" aria-hidden="true" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Match Inteligente
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Algoritmo que conecta candidatos e vagas com base em 
                  certificações, habilidades e localização.
                </p>
              </Card>

              <Card className="p-5 sm:p-6" data-aos="fade-up" data-aos-delay="500" data-aos-duration="1000">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3 sm:mb-4" aria-hidden="true" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Inclusão e Acessibilidade
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Vagas exclusivas PCD e plataforma totalmente acessível 
                  seguindo padrões WCAG 2.1 AA.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center text-muted-foreground">
          <p className="text-sm sm:text-base">&copy; 2024 Porto do Pecém - Plataforma de Empregabilidade</p>
          <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="/sobre" className="text-sm sm:text-base hover:text-primary transition-colors focus-ring">
              Sobre
            </a>
            <a href="#" className="text-sm sm:text-base hover:text-primary transition-colors focus-ring">
              Privacidade
            </a>
            <a href="#" className="text-sm sm:text-base hover:text-primary transition-colors focus-ring">
              Termos de Uso
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
