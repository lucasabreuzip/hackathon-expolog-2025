import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { getCurrentUser } from '@/lib/mockAuth';
import { Job, Application } from '@/types';
import jobsData from '@/mock/jobs.json';
import applicationsData from '@/mock/applications.json';
import courseProgressData from '@/mock/courseProgress.json';
import candidatesData from '@/mock/candidates.json';
import { Briefcase, Users, TrendingUp, Plus, Settings, GraduationCap, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [jobApplications, setJobApplications] = useState<Map<string, number>>(new Map());
  const [candidatesLearning, setCandidatesLearning] = useState(0);
  const [totalCertificatesEarned, setTotalCertificatesEarned] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get company jobs
    const jobs = jobsData.filter(job => job.companyId === user.id && job.active);
    setCompanyJobs(jobs as Job[]);

    // Count applications per job
    const appCounts = new Map<string, number>();
    jobs.forEach(job => {
      const count = applicationsData.filter(app => app.jobId === job.id).length;
      appCounts.set(job.id, count);
    });
    setJobApplications(appCounts);

    // Calculate training stats
    const activeLearners = new Set(courseProgressData.filter((p) =>
      p.status === 'in_progress' || p.status === 'enrolled'
    ).map((p) => p.userId)).size;

    const completedCourses = courseProgressData.filter((p) =>
      p.status === 'completed' && p.certificateIssued
    ).length;

    setCandidatesLearning(activeLearners);
    setTotalCertificatesEarned(completedCourses);
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const totalApplications = Array.from(jobApplications.values()).reduce((sum, count) => sum + count, 0);
  const pendingApplications = applicationsData.filter(app => 
    companyJobs.some(job => job.id === app.jobId) && app.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card border-b py-3 sm:py-4 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto flex justify-between items-center gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Dashboard Empresa</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Bem-vindo, {user.name}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.removeItem('currentUser');
              navigate('/');
            }}
          >
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{companyJobs.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Vagas Ativas</div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{totalApplications}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Candidaturas</div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-warning" aria-hidden="true" />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{pendingApplications}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Pendentes</div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-success" aria-hidden="true" />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold">
              {companyJobs.length > 0 ? Math.round(totalApplications / companyJobs.length) : 0}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Média/Vaga</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Ações Rápidas</h2>
          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
            <Button
              className="h-auto py-3 sm:py-4 flex flex-col gap-2 text-sm sm:text-base"
              onClick={() => alert('Funcionalidade em desenvolvimento')}
            >
              <Plus className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              <span>Publicar Nova Vaga</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-3 sm:py-4 flex flex-col gap-2 text-sm sm:text-base"
              onClick={() => navigate('/empresa/candidatos')}
            >
              <Users className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              <span>Buscar Talentos</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-3 sm:py-4 flex flex-col gap-2 text-sm sm:text-base"
              onClick={() => navigate('/empresa/vagas')}
            >
              <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              <span>Gerenciar Vagas</span>
            </Button>
          </div>
        </Card>

        {/* Talent Development Stats */}
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-success/5 to-primary/5 border-success/20">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="p-2 sm:p-3 bg-success/10 rounded-lg flex-shrink-0">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-success" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold mb-1">Desenvolvimento de Talentos</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Candidatos ativos na plataforma de capacitação
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-background/50 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-xs text-muted-foreground">Estudando Agora</span>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                {candidatesLearning}
              </div>
              <p className="text-xs text-muted-foreground mt-1">candidatos ativos</p>
            </div>

            <div className="p-3 sm:p-4 bg-background/50 rounded-lg border border-success/10">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-success flex-shrink-0" aria-hidden="true" />
                <span className="text-xs text-muted-foreground">Certificados</span>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-success">
                {totalCertificatesEarned}
              </div>
              <p className="text-xs text-muted-foreground mt-1">emitidos</p>
            </div>
          </div>

          <div className="mt-4 p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-xs sm:text-sm text-muted-foreground">
              💡 <strong>Dica:</strong> Candidatos em capacitação demonstram proatividade e interesse em desenvolvimento profissional.
              Explore o perfil deles para encontrar talentos qualificados!
            </p>
          </div>
        </Card>

        {/* Recent Jobs */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Vagas Recentes</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/empresa/vagas')}
            >
              Ver Todas
            </Button>
          </div>

          {companyJobs.length > 0 ? (
            <div className="grid gap-3 sm:gap-4">
              {companyJobs.slice(0, 5).map(job => (
                <Card key={job.id} className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <h3 className="font-semibold text-base sm:text-lg mb-1">{job.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{job.category}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">{job.regime}</Badge>
                        <Badge variant="outline" className="text-xs">{job.location}</Badge>
                      </div>
                    </div>
                    <div className="text-center sm:text-right w-full sm:w-auto">
                      <div className="text-xl sm:text-2xl font-bold text-primary">
                        {jobApplications.get(job.id) || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">candidatos</div>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => navigate(`/candidato/vaga/${job.id}`)}
                    >
                      Ver Vaga
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => navigate(`/empresa/vaga/${job.id}/candidatos`)}
                    >
                      Ver Candidatos
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma vaga publicada</h3>
              <p className="text-muted-foreground mb-4">
                Comece publicando sua primeira vaga para atrair talentos qualificados
              </p>
              <Button onClick={() => navigate('/empresa/vagas/nova')}>
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Publicar Primeira Vaga
              </Button>
            </Card>
          )}
        </div>
      </main>

      <BottomNav role="company" />
    </div>
  );
};

export default CompanyDashboard;
