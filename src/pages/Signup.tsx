import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockSignup, setCurrentUser } from '@/lib/mockAuth';
import { toast } from 'sonner';
import pecemLogo from '@/assets/pecem-logo.png';
import { 
  Users, 
  Briefcase, 
  HardHat, 
  Package, 
  Wrench, 
  Shield, 
  Zap, 
  FileText, 
  ArrowLeft,
  ArrowRight 
} from 'lucide-react';
import { UserRole } from '@/types';

const AREAS = [
  { value: 'operacao', label: 'Operação de Equipamentos', icon: HardHat },
  { value: 'logistica', label: 'Logística e Armazenagem', icon: Package },
  { value: 'manutencao', label: 'Manutenção Industrial', icon: Wrench },
  { value: 'seguranca', label: 'Segurança do Trabalho', icon: Shield },
  { value: 'energia', label: 'Energia e Utilidades', icon: Zap },
  { value: 'administrativa', label: 'Administrativa', icon: FileText },
];

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [userType, setUserType] = useState<UserRole | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cep: '',
    city: '',
    isPCD: false,
    gender: '',
    area: ''
  });

  // Check if user type is pre-selected via URL
  useEffect(() => {
    const tipo = searchParams.get('tipo');
    if (tipo === 'candidato') {
      setUserType('candidate');
      setStep(2);
    } else if (tipo === 'empresa') {
      setUserType('company');
      setStep(2);
    }
  }, [searchParams]);

  const handleNext = () => {
    if (step === 1 && !userType) {
      toast.error('Selecione o tipo de conta');
      return;
    }

    if (step === 2) {
      // Validate basic data
      if (!formData.name || !formData.email || !formData.password) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      if (formData.password.length < 8) {
        toast.error('A senha deve ter no mínimo 8 caracteres');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('As senhas não coincidem');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = () => {
    if (userType === 'candidate' && !formData.area) {
      toast.error('Selecione uma área de interesse');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = mockSignup(formData.email, formData.password, formData.name, userType as UserRole);
      setCurrentUser(user);
      toast.success('Cadastro realizado com sucesso!');
      
      // Redirect based on role
      if (user.role === 'candidate') {
        navigate('/candidato/dashboard');
      } else {
        navigate('/empresa/dashboard');
      }
      
      setLoading(false);
    }, 500);
  };

  const renderStepIndicator = () => {
    const totalSteps = 3;
    return (
      <div className="flex justify-center gap-2 mb-8" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={totalSteps}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? 'w-12 bg-primary' : s < step ? 'w-8 bg-primary/50' : 'w-8 bg-muted'
            }`}
            aria-label={`Etapa ${s} de ${totalSteps}${s === step ? ' - atual' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-3 sm:p-4 py-6">
      <Card className="w-full max-w-2xl p-4 sm:p-6 md:p-8" data-aos="fade-up" data-aos-duration="800">
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <img
            src={pecemLogo}
            alt="Pecém - Complexo Industrial e Portuário"
            className="h-12 sm:h-16 md:h-20 w-auto mb-3 sm:mb-4 object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-center">Criar Conta</h1>
        </div>

        {renderStepIndicator()}

        {/* Step 1: Choose account type */}
        {step === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Qual tipo de conta você deseja criar?</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Escolha a opção que melhor se encaixa</p>
            </div>

            <RadioGroup value={userType} onValueChange={(value) => setUserType(value as UserRole)}>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <label htmlFor="candidate-radio">
                  <Card
                    className={`p-4 sm:p-6 cursor-pointer transition-all ${
                      userType === 'candidate' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <RadioGroupItem value="candidate" id="candidate-radio" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
                          <span className="text-sm sm:text-base font-semibold">Sou Candidato</span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Procuro oportunidades de emprego
                        </p>
                      </div>
                    </div>
                  </Card>
                </label>

                <label htmlFor="company-radio">
                  <Card
                    className={`p-4 sm:p-6 cursor-pointer transition-all ${
                      userType === 'company' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <RadioGroupItem value="company" id="company-radio" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" aria-hidden="true" />
                          <span className="text-sm sm:text-base font-semibold">Sou Empresa</span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Quero contratar profissionais
                        </p>
                      </div>
                    </div>
                  </Card>
                </label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Basic information */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Dados Básicos</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Preencha suas informações</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                  required
                  aria-required="true"
                />
              </div>

              {userType === 'candidate' && (
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    required
                    aria-required="true"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(85) 99999-9999"
                  required
                  aria-required="true"
                />
              </div>

              {userType === 'candidate' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                      placeholder="00000-000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Sua cidade"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Selecione seu gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="nao-binario">Não-binário</SelectItem>
                        <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                  required
                  autoComplete="new-password"
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Digite a senha novamente"
                  required
                  autoComplete="new-password"
                  aria-required="true"
                />
              </div>

              {userType === 'candidate' && (
                <div className="md:col-span-2 flex items-center space-x-2">
                  <Checkbox
                    id="isPCD"
                    checked={formData.isPCD}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, isPCD: checked as boolean })
                    }
                  />
                  <Label htmlFor="isPCD" className="cursor-pointer">
                    Sou pessoa com deficiência (PCD)
                  </Label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Area selection (candidate only) or Company segment */}
        {step === 3 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                {userType === 'candidate' ? 'Área de Interesse' : 'Segmento da Empresa'}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {userType === 'candidate'
                  ? 'Selecione sua principal área de atuação'
                  : 'Qual o segmento da sua empresa?'}
              </p>
            </div>

            <RadioGroup value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {AREAS.map((area) => {
                  const Icon = area.icon;
                  return (
                    <label key={area.value} htmlFor={`area-${area.value}`}>
                      <Card
                        className={`p-3 sm:p-4 cursor-pointer transition-all ${
                          formData.area === area.value ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <RadioGroupItem value={area.value} id={`area-${area.value}`} />
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" aria-hidden="true" />
                          <span className="font-medium text-xs sm:text-sm">{area.label}</span>
                        </div>
                      </Card>
                    </label>
                  );
                })}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Voltar
          </Button>

          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Signup;
