import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { mockLogin, setCurrentUser } from '@/lib/mockAuth';
import { toast } from 'sonner';
import pecemLogo from '@/assets/pecem-logo.png';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = mockLogin(email, password);
      
      if (user) {
        setCurrentUser(user);
        toast.success('Login realizado com sucesso!');
        
        // Redirect based on role
        if (user.role === 'candidate') {
          navigate('/candidato/dashboard');
        } else {
          navigate('/empresa/dashboard');
        }
      } else {
        toast.error('E-mail ou senha incorretos');
      }
      
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-md p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <img
            src={pecemLogo}
            alt="Pecém - Complexo Industrial e Portuário"
            className="h-14 sm:h-16 md:h-20 w-auto mb-4 sm:mb-6 object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-center">Entrar na Plataforma</h1>
          <p className="text-sm sm:text-base text-muted-foreground text-center mt-2">
            Acesse sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              aria-required="true"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Ainda não tem conta?{' '}
            <Link to="/cadastro" className="text-primary hover:underline focus-ring">
              Cadastre-se aqui
            </Link>
          </p>

          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Voltar para home
          </Button>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-muted rounded-lg">
          <p className="text-xs font-semibold mb-2">Contas de demonstração:</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Candidato:</strong> joao.santos@email.com / senha123</p>
            <p><strong>Empresa:</strong> empresa@logistica.com / senha123</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
