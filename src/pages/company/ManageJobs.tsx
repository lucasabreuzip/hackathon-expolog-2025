import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { getCurrentUser } from '@/lib/mockAuth';
import { Job, Application } from '@/types';
import jobsData from '@/mock/jobs.json';
import applicationsData from '@/mock/applications.json';
import {
  Briefcase,
  Plus,
  Edit,
  Eye,
  Users,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ManageJobs = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [jobApplications, setJobApplications] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get all company jobs (active and inactive)
    const allJobs = jobsData.filter((job) => job.companyId === user.id) as Job[];
    setJobs(allJobs);

    // Count applications per job
    const appCounts = new Map<string, number>();
    allJobs.forEach((job) => {
      const count = applicationsData.filter((app) => app.jobId === job.id).length;
      appCounts.set(job.id, count);
    });
    setJobApplications(appCounts);
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const filteredJobs = jobs.filter((job) => {
    if (statusFilter === 'active') return job.active;
    if (statusFilter === 'inactive') return !job.active;
    return true;
  });

  const activeJobsCount = jobs.filter((j) => j.active).length;
  const inactiveJobsCount = jobs.filter((j) => !j.active).length;
  const totalApplications = Array.from(jobApplications.values()).reduce(
    (sum, count) => sum + count,
    0
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card border-b py-3 sm:py-4 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/empresa/dashboard')}
            className="mb-2"
          >
            ← Voltar ao Dashboard
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                Gerenciar Vagas
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Gerencie todas as suas oportunidades de emprego
              </p>
            </div>
            <Button onClick={() => navigate('/empresa/vagas/nova')}>
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Nova Vaga
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="p-3 sm:p-4">
            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-2" aria-hidden="true" />
            <div className="text-xl sm:text-2xl font-bold">{jobs.length}</div>
            <div className="text-xs text-muted-foreground">Total de Vagas</div>
          </Card>

          <Card className="p-3 sm:p-4">
            <CheckCircle
              className="h-4 w-4 sm:h-5 sm:w-5 text-success mb-2"
              aria-hidden="true"
            />
            <div className="text-xl sm:text-2xl font-bold text-success">
              {activeJobsCount}
            </div>
            <div className="text-xs text-muted-foreground">Ativas</div>
          </Card>

          <Card className="p-3 sm:p-4">
            <XCircle
              className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mb-2"
              aria-hidden="true"
            />
            <div className="text-xl sm:text-2xl font-bold">{inactiveJobsCount}</div>
            <div className="text-xs text-muted-foreground">Inativas</div>
          </Card>

          <Card className="p-3 sm:p-4">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-2" aria-hidden="true" />
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {totalApplications}
            </div>
            <div className="text-xs text-muted-foreground">Candidaturas</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Filtrar por Status</label>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as 'all' | 'active' | 'inactive')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as vagas</SelectItem>
                <SelectItem value="active">Apenas ativas</SelectItem>
                <SelectItem value="inactive">Apenas inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="p-4 hover:shadow-lg transition-all">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {job.category}
                          </p>
                        </div>
                        <Badge
                          variant={job.active ? 'default' : 'secondary'}
                          className={
                            job.active
                              ? 'bg-success/10 text-success border-success/20'
                              : ''
                          }
                        >
                          {job.active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>

                      {/* Info */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="h-3 w-3 mr-1" aria-hidden="true" />
                          {job.regime}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                          {formatDate(job.publishedAt)}
                        </Badge>
                        {job.restrictions.pcdExclusive && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            Exclusiva PCD
                          </Badge>
                        )}
                        {job.restrictions.womenExclusive && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                          >
                            Exclusiva Mulheres
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-center sm:text-right">
                      <div className="flex items-center gap-2 justify-center sm:justify-end mb-1">
                        <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span className="text-2xl font-bold text-primary">
                          {jobApplications.get(job.id) || 0}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">candidatos</div>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>

                  {/* Salary */}
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">
                      R$ {job.salary.min.toLocaleString('pt-BR')} - R${' '}
                      {job.salary.max.toLocaleString('pt-BR')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/candidato/vaga/${job.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        alert('Funcionalidade de edição em desenvolvimento');
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/empresa/vaga/${job.id}/candidatos`)}
                    >
                      <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                      Ver Candidatos
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Briefcase
              className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold mb-2">
              {statusFilter === 'all'
                ? 'Nenhuma vaga cadastrada'
                : statusFilter === 'active'
                ? 'Nenhuma vaga ativa'
                : 'Nenhuma vaga inativa'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter === 'all'
                ? 'Comece publicando sua primeira vaga para atrair talentos qualificados'
                : 'Altere o filtro para ver outras vagas'}
            </p>
            {statusFilter === 'all' ? (
              <Button onClick={() => navigate('/empresa/vagas/nova')}>
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Publicar Primeira Vaga
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setStatusFilter('all')}>
                Ver Todas as Vagas
              </Button>
            )}
          </Card>
        )}
      </main>

      <BottomNav role="company" />
    </div>
  );
};

export default ManageJobs;
