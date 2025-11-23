import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { getCurrentUser } from '@/lib/mockAuth';
import { Application, Job, Company } from '@/types';
import applicationsData from '@/mock/applications.json';
import jobsData from '@/mock/jobs.json';
import companiesData from '@/mock/companies.json';
import { Clock, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CandidateApplications = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [applications, setApplications] = useState<Array<{ 
    application: Application; 
    job: Job; 
    company: Company 
  }>>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const userApplications = applicationsData
      .filter(app => app.candidateId === user.id)
      .map(app => {
        const job = jobsData.find(j => j.id === app.jobId);
        const company = job ? companiesData.find(c => c.id === job.companyId) : null;
        return {
          application: app as Application,
          job: job as Job,
          company: company as Company
        };
      })
      .filter(item => item.job && item.company);

    setApplications(userApplications);
  }, [user, navigate]);

  const getStatusConfig = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: 'Pendente',
          className: 'bg-muted text-muted-foreground',
          description: 'Aguardando análise da empresa'
        };
      case 'viewed':
        return {
          icon: CheckCircle,
          label: 'Visualizada',
          className: 'bg-primary/10 text-primary',
          description: 'A empresa visualizou seu perfil'
        };
      case 'interview':
        return {
          icon: CheckCircle,
          label: 'Em Entrevista',
          className: 'bg-success text-success-foreground',
          description: 'Você foi selecionado para entrevista'
        };
      case 'rejected':
        return {
          icon: XCircle,
          label: 'Não selecionado',
          className: 'bg-danger/10 text-danger',
          description: 'Não foi selecionado para esta vaga'
        };
      case 'hired':
        return {
          icon: CheckCircle,
          label: 'Contratado',
          className: 'bg-success text-success-foreground',
          description: 'Parabéns! Você foi contratado'
        };
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card border-b py-4 px-4 md:px-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Minhas Candidaturas</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe o status das suas candidaturas
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map(({ application, job, company }) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={application.id} className="p-4 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{company.name}</p>
                    </div>
                    <Badge className={statusConfig.className}>
                      <StatusIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {statusConfig.description}
                  </p>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="text-sm text-muted-foreground">
                      Candidatura enviada em{' '}
                      {format(new Date(application.appliedAt), "dd/MM/yyyy 'às' HH:mm", { 
                        locale: ptBR 
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/candidato/vaga/${job.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>

                  {application.matchScore && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Score de compatibilidade:</span>
                        <Badge variant="outline">{application.matchScore}% Match</Badge>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-xl font-semibold mb-2">Nenhuma candidatura ainda</h2>
            <p className="text-muted-foreground mb-6">
              Você ainda não se candidatou a nenhuma vaga. Explore as oportunidades disponíveis!
            </p>
            <Button onClick={() => navigate('/candidato/vagas')}>
              Buscar Vagas
            </Button>
          </Card>
        )}
      </main>

      <BottomNav role="candidate" />
    </div>
  );
};

export default CandidateApplications;
