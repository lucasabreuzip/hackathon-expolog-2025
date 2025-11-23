import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BottomNav } from '@/components/BottomNav';
import { getCurrentUser } from '@/lib/mockAuth';
import { calculateMatchScore } from '@/lib/matchScore';
import { Candidate, Job, Application, CourseProgress, Course } from '@/types';
import candidatesData from '@/mock/candidates.json';
import jobsData from '@/mock/jobs.json';
import applicationsData from '@/mock/applications.json';
import courseProgressData from '@/mock/courseProgress.json';
import coursesData from '@/mock/courses.json';
import {
  TrendingUp,
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  User,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Shield
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CandidateApplication {
  application: Application;
  candidate: Candidate;
  matchScore: number;
  coursesInProgress: number;
  coursesCompleted: number;
  certificatesEarned: number;
  recentCourses: Array<{
    course: Course;
    progress: CourseProgress;
  }>;
}

const JobCandidates = () => {
  const navigate = useNavigate();
  const { id: jobId } = useParams();
  const user = getCurrentUser();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!jobId) {
      navigate('/empresa/dashboard');
      return;
    }

    // Get job details
    const jobData = jobsData.find((j) => j.id === jobId);
    if (!jobData) {
      navigate('/empresa/dashboard');
      return;
    }
    setJob(jobData as Job);

    // Get applications for this job
    const jobApplications = applicationsData.filter(
      (app) => app.jobId === jobId
    ) as Application[];

    // Build candidate applications with course progress
    const candidateApps: CandidateApplication[] = jobApplications
      .map((application) => {
        const candidate = candidatesData.find(
          (c) => c.id === application.candidateId
        ) as Candidate;

        if (!candidate) return null;

        // Calculate match score
        const match = calculateMatchScore(candidate, jobData as Job);

        // Get course progress
        const userProgress = courseProgressData.filter(
          (p) => p.userId === candidate.id
        ) as CourseProgress[];

        const inProgress = userProgress.filter(
          (p) => p.status === 'in_progress' || p.status === 'enrolled'
        ).length;

        const completed = userProgress.filter(
          (p) => p.status === 'completed'
        ).length;

        const certificates = userProgress.filter(
          (p) => p.status === 'completed' && p.certificateIssued
        ).length;

        // Get recent courses (up to 2)
        const recentCourses = userProgress
          .sort(
            (a, b) =>
              new Date(b.lastAccessedAt).getTime() -
              new Date(a.lastAccessedAt).getTime()
          )
          .slice(0, 2)
          .map((progress) => ({
            course: coursesData.find((c) => c.id === progress.courseId) as Course,
            progress,
          }))
          .filter((item) => item.course);

        return {
          application,
          candidate,
          matchScore: match.score,
          coursesInProgress: inProgress,
          coursesCompleted: completed,
          certificatesEarned: certificates,
          recentCourses,
        };
      })
      .filter((item) => item !== null) as CandidateApplication[];

    // Apply status filter
    let filtered = candidateApps;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.application.status === statusFilter);
    }

    // Sort by match score
    filtered.sort((a, b) => b.matchScore - a.matchScore);

    setCandidates(filtered);
  }, [user, navigate, jobId, statusFilter]);

  if (!user || !job) {
    return null;
  }

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'viewed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'interview':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'hired':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: Application['status']) => {
    const labels = {
      pending: 'Pendente',
      viewed: 'Visualizado',
      interview: 'Entrevista',
      rejected: 'Rejeitado',
      hired: 'Contratado',
    };
    return labels[status] || status;
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
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{job.title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {candidates.length} candidatura(s) recebida(s)
          </p>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Job Summary */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <h2 className="font-semibold text-lg mb-2">Resumo da Vaga</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{job.category}</Badge>
                <Badge variant="outline">{job.regime}</Badge>
                <Badge variant="outline">
                  <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                  {job.location}
                </Badge>
                {job.restrictions.pcdExclusive && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    Exclusiva PCD
                  </Badge>
                )}
                {job.restrictions.womenExclusive && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                    Exclusiva Mulheres
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/candidato/vaga/${job.id}`)}
              >
                Ver Detalhes da Vaga
              </Button>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Filtrar por Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="viewed">Visualizados</SelectItem>
                <SelectItem value="interview">Em entrevista</SelectItem>
                <SelectItem value="hired">Contratados</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Candidates List */}
        {candidates.length > 0 ? (
          <div className="space-y-4">
            {candidates.map(
              ({
                application,
                candidate,
                matchScore,
                coursesInProgress,
                coursesCompleted,
                certificatesEarned,
                recentCourses,
              }) => (
                <Card key={application.id} className="p-4 hover:shadow-lg transition-all">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{candidate.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                <Briefcase className="h-3 w-3 mr-1" aria-hidden="true" />
                                {candidate.mainArea}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                                {candidate.location.city}
                              </Badge>
                              {candidate.isPCD && (
                                <Badge variant="secondary" className="text-xs">
                                  PCD
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge
                            className={`${
                              matchScore >= 80
                                ? 'bg-success text-success-foreground'
                                : matchScore >= 60
                                ? 'bg-warning text-warning-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <TrendingUp className="h-3 w-3 mr-1" aria-hidden="true" />
                            {matchScore}% Match
                          </Badge>
                        </div>
                      </div>

                      <Badge className={getStatusColor(application.status)}>
                        {getStatusLabel(application.status)}
                      </Badge>
                    </div>

                    {/* Course Performance */}
                    <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <GraduationCap
                          className="h-5 w-5 mx-auto mb-1 text-primary"
                          aria-hidden="true"
                        />
                        <div className="text-lg font-bold text-primary">
                          {coursesInProgress}
                        </div>
                        <div className="text-xs text-muted-foreground">Em Progresso</div>
                      </div>
                      <div className="text-center">
                        <CheckCircle
                          className="h-5 w-5 mx-auto mb-1 text-success"
                          aria-hidden="true"
                        />
                        <div className="text-lg font-bold text-success">
                          {coursesCompleted}
                        </div>
                        <div className="text-xs text-muted-foreground">Concluídos</div>
                      </div>
                      <div className="text-center">
                        <Award
                          className="h-5 w-5 mx-auto mb-1 text-warning"
                          aria-hidden="true"
                        />
                        <div className="text-lg font-bold text-warning">
                          {certificatesEarned}
                        </div>
                        <div className="text-xs text-muted-foreground">Certificados</div>
                      </div>
                    </div>

                    {/* Recent Courses */}
                    {recentCourses.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BookOpen
                            className="h-4 w-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium">
                            Cursos em Andamento
                          </span>
                        </div>
                        {recentCourses.map(({ course, progress }) => (
                          <div
                            key={progress.id}
                            className="p-3 bg-background rounded-lg border space-y-2"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{course.title}</p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {course.category}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-primary">
                                  {progress.progressPercentage}%
                                </div>
                                {progress.status === 'completed' ? (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-success/10 text-success mt-1"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                                    Concluído
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                                    Estudando
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Progress value={progress.progressPercentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {candidate.skills.length > 0 && (
                      <div>
                        <span className="text-sm font-medium mb-2 block">
                          Habilidades:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 6).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 6 && (
                            <Badge variant="secondary" className="text-xs">
                              +{candidate.skills.length - 6}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          navigate(`/candidato/perfil?id=${candidate.id}`)
                        }
                      >
                        Ver Perfil Completo
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // Handle contact or update status
                          alert('Funcionalidade de contato em desenvolvimento');
                        }}
                      >
                        Entrar em Contato
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            )}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-muted-foreground mb-4">
              {statusFilter === 'all'
                ? 'Nenhum candidato se candidatou a esta vaga ainda'
                : 'Nenhum candidato encontrado com este status'}
            </p>
            {statusFilter !== 'all' && (
              <Button variant="outline" onClick={() => setStatusFilter('all')}>
                Mostrar Todos
              </Button>
            )}
          </Card>
        )}
      </main>

      <BottomNav role="company" />
    </div>
  );
};

export default JobCandidates;
