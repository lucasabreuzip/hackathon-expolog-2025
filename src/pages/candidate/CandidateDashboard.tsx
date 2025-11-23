import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/components/JobCard';
import { CourseCard } from '@/components/CourseCard';
import { BottomNav } from '@/components/BottomNav';
import { AIChatbot } from '@/components/AIChatbot';
import { getCurrentUser } from '@/lib/mockAuth';
import { calculateMatchScore, getCertificationStatus } from '@/lib/matchScore';
import { CourseRecommendationAI, RecommendationScore } from '@/lib/ai';
import { Candidate, Job, Company, Course, CourseProgress } from '@/types';
import candidatesData from '@/mock/candidates.json';
import jobsData from '@/mock/jobs.json';
import companiesData from '@/mock/companies.json';
import certificationsData from '@/mock/certifications.json';
import courseProgressData from '@/mock/courseProgress.json';
import coursesData from '@/mock/courses.json';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  User,
  FileText,
  Shield,
  GraduationCap,
  Sparkles,
  BookOpen,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Array<{ job: Job; company: Company; matchScore: number }>>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<RecommendationScore[]>([]);
  const [coursesInProgress, setCoursesInProgress] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load candidate data
    const candidateData = candidatesData.find((c) => c.id === user.id);
    if (candidateData) {
      setCandidate(candidateData as Candidate);

      // Calculate match scores for all active jobs
      const jobs = jobsData
        .filter(job => job.active)
        .map(job => {
          const company = companiesData.find(c => c.id === job.companyId);
          const match = calculateMatchScore(candidateData as Candidate, job as Job);
          return {
            job: job as Job,
            company: company as Company,
            matchScore: match.score
          };
        })
        .filter(item => item.matchScore >= 50)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

      setRecommendedJobs(jobs);

      // Calculate course progress stats
      const userCourseProgress = courseProgressData.filter((p) => p.userId === user.id);
      const inProgress = userCourseProgress.filter((p) => p.status === 'in_progress' || p.status === 'enrolled').length;
      const completed = userCourseProgress.filter((p) => p.status === 'completed').length;
      setCoursesInProgress(inProgress);
      setCompletedCourses(completed);

      // Get AI-powered course recommendations
      const recommendations = CourseRecommendationAI.getRecommendations(
        candidateData as Candidate,
        coursesData as Course[],
        userCourseProgress as CourseProgress[],
        3 // Top 3 recommendations
      );
      setRecommendedCourses(recommendations);
    }
  }, [user, navigate]);

  if (!candidate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  // Calculate certification stats
  const activeCerts = candidate.certifications.filter(
    cert => getCertificationStatus(cert) === 'active'
  ).length;
  
  const expiringCerts = candidate.certifications.filter(
    cert => getCertificationStatus(cert) === 'expiring'
  ).length;
  
  const expiredCerts = candidate.certifications.filter(
    cert => getCertificationStatus(cert) === 'expired'
  ).length;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card border-b py-3 sm:py-4 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto flex justify-between items-center gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Olá, {candidate.name.split(' ')[0]}!</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Bem-vindo de volta</p>
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
        {/* Profile Status Card */}
        <Card className="p-4 sm:p-6" data-aos="fade-up" data-aos-duration="800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold mb-1">Status do Perfil</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Complete seu perfil para aumentar suas chances
              </p>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {candidate.profileCompleteness}%
              </span>
            </div>
          </div>

          <Progress value={candidate.profileCompleteness} className="mb-4" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
            <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-primary" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{candidate.experience.length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Experiências</div>
            </div>

            <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-primary" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{candidate.certifications.length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Certificações</div>
            </div>

            <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-primary" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{candidate.skills.length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Habilidades</div>
            </div>

            <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-success" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{candidate.profileCompleteness}%</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Completo</div>
            </div>
          </div>

          <Button
            className="w-full mt-4"
            variant="outline"
            onClick={() => navigate('/candidato/perfil')}
          >
            Completar Perfil
          </Button>
        </Card>

        {/* Capacitação Highlight Card */}
        <Card
          className="p-4 sm:p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
          onClick={() => navigate('/capacitacao')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate('/capacitacao');
            }
          }}
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4">
            <Sparkles className="h-16 w-16 sm:h-20 sm:w-20 text-primary/10" aria-hidden="true" />
          </div>
          <div className="relative z-10">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg sm:text-xl font-bold">Capacitação Profissional</h2>
                  <Badge variant="secondary" className="text-xs">Novo</Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Desenvolva novas habilidades e conquiste certificações para impulsionar sua carreira
                </p>
              </div>
            </div>

            {(coursesInProgress > 0 || completedCourses > 0) && (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                <div className="p-2 sm:p-3 bg-background/50 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg font-bold">{coursesInProgress}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Em andamento</div>
                    </div>
                  </div>
                </div>
                <div className="p-2 sm:p-3 bg-background/50 rounded-lg border border-success/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg font-bold">{completedCourses}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Concluídos</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full" size="lg">
              <GraduationCap className="h-4 w-4 mr-2" aria-hidden="true" />
              {coursesInProgress > 0 ? 'Continuar Aprendendo' : 'Explorar Cursos'}
            </Button>
          </div>
        </Card>

        {/* AI-Powered Course Recommendations */}
        {recommendedCourses.length > 0 && (
          <div data-aos="fade-up" data-aos-delay="150" data-aos-duration="800">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="text-lg sm:text-xl font-semibold">Cursos Recomendados para Você</h2>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
                  IA
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/capacitacao')}
              >
                Ver Todos
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3">
              {recommendedCourses.map((rec) => (
                <div key={rec.course.id} className="relative">
                  <CourseCard course={rec.course} />
                  <div className="absolute top-2 left-2 z-10">
                    <Badge
                      variant={
                        rec.priority === 'high' ? 'destructive' :
                        rec.priority === 'medium' ? 'default' :
                        'secondary'
                      }
                      className="text-xs font-semibold shadow-md"
                    >
                      {rec.score}% Match
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {recommendedCourses[0] && (
              <Card className="p-3 sm:p-4 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-primary mb-1">
                      Por que este curso é perfeito para você:
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {recommendedCourses[0].reason}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Certifications Status */}
        <Card className="p-4 sm:p-6" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Certificações em Destaque</h2>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4">
            <div className="text-center p-2 sm:p-3 md:p-4 bg-success/10 rounded-lg border border-success/20">
              <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-1 sm:mb-2 text-success" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-success">{activeCerts}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Ativas</div>
            </div>

            <div className="text-center p-2 sm:p-3 md:p-4 bg-warning/10 rounded-lg border border-warning/20">
              <Clock className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-1 sm:mb-2 text-warning" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-warning">{expiringCerts}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Expirando</div>
            </div>

            <div className="text-center p-2 sm:p-3 md:p-4 bg-danger/10 rounded-lg border border-danger/20">
              <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-1 sm:mb-2 text-danger" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-danger">{expiredCerts}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Expiradas</div>
            </div>
          </div>

          {expiringCerts > 0 && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 sm:p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-warning mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm sm:text-base font-medium text-warning">Atenção!</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Você tem {expiringCerts} certificação(ões) expirando nos próximos 60 dias.
                    Renove-as para não perder oportunidades.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => navigate('/candidato/perfil')}
          >
            Ver Todas as Certificações
          </Button>
        </Card>

        {/* Recommended Jobs */}
        <div data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Vagas Recomendadas para Você</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/candidato/vagas')}
            >
              Ver Todas
            </Button>
          </div>

          {recommendedJobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {recommendedJobs.map(({ job, company, matchScore }) => (
                <JobCard
                  key={job.id}
                  job={job}
                  company={company}
                  matchScore={matchScore}
                  showMatchScore={true}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
              <p className="text-muted-foreground mb-4">
                Nenhuma vaga recomendada no momento. Complete seu perfil para receber melhores recomendações!
              </p>
              <Button onClick={() => navigate('/candidato/perfil')}>
                Completar Perfil
              </Button>
            </Card>
          )}
        </div>
      </main>

      <BottomNav role="candidate" />
      <AIChatbot />
    </div>
  );
};

export default CandidateDashboard;
