import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BottomNav } from '@/components/BottomNav';
import { getCurrentUser } from '@/lib/mockAuth';
import { calculateMatchScore } from '@/lib/matchScore';
import { Job, Company, Candidate } from '@/types';
import jobsData from '@/mock/jobs.json';
import companiesData from '@/mock/companies.json';
import candidatesData from '@/mock/candidates.json';
import certificationsData from '@/mock/certifications.json';
import {
  MapPin,
  Briefcase,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  TrendingUp,
  ArrowLeft,
  Share2,
  Home
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [matchResult, setMatchResult] = useState<ReturnType<typeof calculateMatchScore> | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const jobData = jobsData.find(j => j.id === id);
    if (jobData) {
      setJob(jobData as Job);
      const companyData = companiesData.find(c => c.id === jobData.companyId);
      setCompany(companyData as Company);

      const candidateData = candidatesData.find(c => c.id === user.id);
      if (candidateData) {
        setCandidate(candidateData as Candidate);
        const match = calculateMatchScore(candidateData as Candidate, jobData as Job);
        setMatchResult(match);
      }
    }
  }, [id, user, navigate]);

  if (!job || !company || !candidate || !matchResult) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const handleApply = () => {
    toast.success('Candidatura enviada com sucesso!');
    setShowApplyDialog(false);
    navigate('/candidato/candidaturas');
  };

  const formatSalary = (min: number, max: number) => {
    return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card border-b py-3 sm:py-4 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Voltar"
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/candidato/dashboard')}
              aria-label="Ir para o início"
              className="flex-shrink-0"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <h1 className="text-base sm:text-xl md:text-2xl font-bold truncate">Detalhes da Vaga</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Job Header Card */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Building className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">{company.name}</span>
              </div>
            </div>
            <Badge 
              className={`${
                matchResult.score >= 80 ? 'bg-success' : 
                matchResult.score >= 60 ? 'bg-warning' : 
                'bg-muted'
              } text-white flex items-center gap-1 text-lg px-4 py-2`}
            >
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              {matchResult.score}% Match
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Localização</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Regime</p>
                <p className="font-medium">{job.regime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Faixa Salarial</p>
                <p className="font-medium">{formatSalary(job.salary.min, job.salary.max)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline">{job.category}</Badge>
            {job.restrictions.pcdExclusive && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                Exclusiva PCD
              </Badge>
            )}
            {job.restrictions.noColorBlindness && (
              <Badge variant="secondary">Não aceita daltonismo</Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" size="lg" onClick={() => setShowApplyDialog(true)}>
              Candidatar-se
            </Button>
            <Button variant="outline" size="icon" aria-label="Compartilhar vaga">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Requirements Compatibility */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Requisitos e Compatibilidade</h3>
          
          {/* Required Certifications */}
          {job.requiredCertifications.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">Certificações Obrigatórias</h4>
              <div className="space-y-2">
                {job.requiredCertifications.map(certId => {
                  const certData = certificationsData.find(c => c.id === certId);
                  if (!certData) return null;

                  const hasCert = candidate.certifications.some(
                    c => c.certificationId === certId && new Date(c.expiryDate) > new Date()
                  );

                  return (
                    <div 
                      key={certId} 
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                    >
                      {hasCert ? (
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-5 w-5 text-danger flex-shrink-0" aria-hidden="true" />
                      )}
                      <span className={hasCert ? 'text-success' : 'text-danger'}>
                        {certData.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {hasCert ? 'Você possui' : 'Você não possui'}
                      </span>
                    </div>
                  );
                })}
              </div>
              {matchResult.missingCertifications.length > 0 && (
                <div className="mt-4 p-4 bg-danger/10 border border-danger/20 rounded-lg">
                  <p className="text-sm text-danger font-medium mb-2">
                    Certificações faltantes:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {matchResult.missingCertifications.map((cert, idx) => (
                      <li key={idx}>• {cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Required Skills */}
          {job.requiredSkills.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Habilidades Obrigatórias</h4>
              <div className="space-y-2">
                {job.requiredSkills.map((skill, idx) => {
                  const hasSkill = candidate.skills.some(
                    s => s.toLowerCase().includes(skill.toLowerCase())
                  );

                  return (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                    >
                      {hasSkill ? (
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-5 w-5 text-danger flex-shrink-0" aria-hidden="true" />
                      )}
                      <span className={hasSkill ? 'text-success' : 'text-danger'}>
                        {skill}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {hasSkill ? 'Você possui' : 'Você não possui'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Job Description */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Descrição da Vaga</h3>
          <p className="text-muted-foreground leading-relaxed">{job.description}</p>
        </Card>

        {/* Desired Skills */}
        {job.desiredSkills.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Requisitos Desejáveis</h3>
            <div className="flex flex-wrap gap-2">
              {job.desiredSkills.map((skill, idx) => (
                <Badge key={idx} variant="outline">{skill}</Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Additional Info */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Informações Adicionais</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Benefícios</h4>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, idx) => (
                  <Badge key={idx} variant="secondary">{benefit}</Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Data de Publicação:</span>
                <p className="font-medium mt-1">
                  {format(new Date(job.publishedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              {job.restrictions.minExperience > 0 && (
                <div>
                  <span className="text-muted-foreground">Experiência Mínima:</span>
                  <p className="font-medium mt-1">
                    {job.restrictions.minExperience} ano(s)
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </main>

      {/* Apply Confirmation Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Candidatura</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Você está se candidatando para a vaga de <strong>{job.title}</strong> na empresa <strong>{company.name}</strong>.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Seu perfil será enviado com:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {candidate.certifications.length} certificação(ões)</li>
                <li>• {candidate.experience.length} experiência(s) profissional(is)</li>
                <li>• {candidate.skills.length} habilidade(s)</li>
                <li>• Score de compatibilidade: <span className={getMatchColor(matchResult.score)}>{matchResult.score}%</span></li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApply}>
              Confirmar Candidatura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav role="candidate" />
    </div>
  );
};

export default JobDetails;
