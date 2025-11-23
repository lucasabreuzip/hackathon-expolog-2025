import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BottomNav } from '@/components/BottomNav';
import { getCurrentUser } from '@/lib/mockAuth';
import { Candidate, CourseProgress, Course } from '@/types';
import candidatesData from '@/mock/candidates.json';
import courseProgressData from '@/mock/courseProgress.json';
import coursesData from '@/mock/courses.json';
import {
  Search,
  GraduationCap,
  Award,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Clock,
  Filter,
  User,
  MapPin,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CandidateWithProgress {
  candidate: Candidate;
  coursesInProgress: number;
  coursesCompleted: number;
  certificatesEarned: number;
  totalProgressPercentage: number;
  recentCourses: Array<{
    course: Course;
    progress: CourseProgress;
  }>;
}

const CandidatesList = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateWithProgress[]>([]);
  const [areaFilter, setAreaFilter] = useState('all');
  const [progressFilter, setProgressFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Build candidate data with course progress
    const candidatesWithProgress: CandidateWithProgress[] = candidatesData.map((candidate) => {
      const userProgress = courseProgressData.filter(
        (p) => p.userId === candidate.id
      ) as CourseProgress[];

      const inProgress = userProgress.filter(
        (p) => p.status === 'in_progress' || p.status === 'enrolled'
      ).length;

      const completed = userProgress.filter((p) => p.status === 'completed').length;

      const certificates = userProgress.filter(
        (p) => p.status === 'completed' && p.certificateIssued
      ).length;

      // Calculate average progress
      const avgProgress =
        userProgress.length > 0
          ? Math.round(
              userProgress.reduce((sum, p) => sum + p.progressPercentage, 0) /
                userProgress.length
            )
          : 0;

      // Get recent courses (up to 3)
      const recentCourses = userProgress
        .sort(
          (a, b) =>
            new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
        )
        .slice(0, 3)
        .map((progress) => ({
          course: coursesData.find((c) => c.id === progress.courseId) as Course,
          progress,
        }))
        .filter((item) => item.course); // Remove any undefined courses

      return {
        candidate: candidate as Candidate,
        coursesInProgress: inProgress,
        coursesCompleted: completed,
        certificatesEarned: certificates,
        totalProgressPercentage: avgProgress,
        recentCourses,
      };
    });

    // Apply filters
    let filtered = candidatesWithProgress;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.candidate.name.toLowerCase().includes(term) ||
          item.candidate.mainArea.toLowerCase().includes(term) ||
          item.candidate.skills.some((skill) => skill.toLowerCase().includes(term))
      );
    }

    // Area filter
    if (areaFilter !== 'all') {
      filtered = filtered.filter((item) => item.candidate.mainArea === areaFilter);
    }

    // Progress filter
    if (progressFilter === 'studying') {
      filtered = filtered.filter((item) => item.coursesInProgress > 0);
    } else if (progressFilter === 'certified') {
      filtered = filtered.filter((item) => item.certificatesEarned > 0);
    }

    // Sort by activity (candidates with more courses in progress first)
    filtered.sort((a, b) => {
      const aActivity = a.coursesInProgress * 2 + a.coursesCompleted;
      const bActivity = b.coursesInProgress * 2 + b.coursesCompleted;
      return bActivity - aActivity;
    });

    setFilteredCandidates(filtered);
  }, [user, navigate, searchTerm, areaFilter, progressFilter]);

  if (!user) {
    return null;
  }

  const areas = ['all', ...new Set(candidatesData.map((c) => c.mainArea))];

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
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Buscar Talentos</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Explore candidatos e seus desempenhos na plataforma de capacitação
          </p>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="p-3 sm:p-4">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-2" aria-hidden="true" />
            <div className="text-xl sm:text-2xl font-bold">
              {candidatesData.length}
            </div>
            <div className="text-xs text-muted-foreground">Total de Candidatos</div>
          </Card>

          <Card className="p-3 sm:p-4">
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-2" aria-hidden="true" />
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {filteredCandidates.filter((c) => c.coursesInProgress > 0).length}
            </div>
            <div className="text-xs text-muted-foreground">Estudando Ativamente</div>
          </Card>

          <Card className="p-3 sm:p-4">
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-success mb-2" aria-hidden="true" />
            <div className="text-xl sm:text-2xl font-bold text-success">
              {filteredCandidates.reduce((sum, c) => sum + c.certificatesEarned, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Certificados Emitidos</div>
          </Card>

          <Card className="p-3 sm:p-4">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-warning mb-2" aria-hidden="true" />
            <div className="text-xl sm:text-2xl font-bold text-warning">
              {Math.round(
                filteredCandidates.reduce((sum, c) => sum + c.totalProgressPercentage, 0) /
                  Math.max(1, filteredCandidates.length)
              )}%
            </div>
            <div className="text-xs text-muted-foreground">Progresso Médio</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 mb-6">
          <div className="space-y-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Buscar por nome, área ou habilidades..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" aria-hidden="true" />
                  Área de Atuação
                </label>
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as áreas</SelectItem>
                    {areas.slice(1).map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  Status de Capacitação
                </label>
                <Select value={progressFilter} onValueChange={setProgressFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os candidatos</SelectItem>
                    <SelectItem value="studying">Estudando ativamente</SelectItem>
                    <SelectItem value="certified">Com certificados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Candidates List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredCandidates.length} candidato(s) encontrado(s)
            </p>
          </div>

          {filteredCandidates.length > 0 ? (
            <div className="space-y-4">
              {filteredCandidates.map(
                ({
                  candidate,
                  coursesInProgress,
                  coursesCompleted,
                  certificatesEarned,
                  totalProgressPercentage,
                  recentCourses,
                }) => (
                  <Card key={candidate.id} className="p-4 hover:shadow-lg transition-all">
                    <div className="space-y-4">
                      {/* Candidate Header */}
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{candidate.name}</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  <Briefcase className="h-3 w-3 mr-1" aria-hidden="true" />
                                  {candidate.mainArea}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                                  {candidate.location.city}, {candidate.location.state}
                                </Badge>
                                {candidate.isPCD && (
                                  <Badge variant="secondary" className="text-xs">
                                    PCD
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          {candidate.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.skills.slice(0, 5).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {candidate.skills.length > 5 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{candidate.skills.length - 5}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 sm:grid-cols-1 gap-4 sm:w-32 text-center sm:text-right">
                          <div>
                            <div className="text-2xl font-bold text-primary">
                              {coursesInProgress}
                            </div>
                            <div className="text-xs text-muted-foreground">Em Progresso</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-success">
                              {coursesCompleted}
                            </div>
                            <div className="text-xs text-muted-foreground">Concluídos</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-warning">
                              {certificatesEarned}
                            </div>
                            <div className="text-xs text-muted-foreground">Certificados</div>
                          </div>
                        </div>
                      </div>

                      {/* Course Progress */}
                      {recentCourses.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            <span className="text-sm font-medium">Cursos Recentes</span>
                          </div>
                          {recentCourses.map(({ course, progress }) => (
                            <div
                              key={progress.id}
                              className="p-3 bg-muted/50 rounded-lg space-y-2"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{course.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {course.category}
                                    </Badge>
                                    {progress.status === 'completed' ? (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs bg-success/10 text-success"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                                        Concluído
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="text-xs">
                                        <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                                        Em andamento
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-primary">
                                    {progress.progressPercentage}%
                                  </div>
                                </div>
                              </div>
                              <Progress value={progress.progressPercentage} className="h-2" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/candidato/perfil?id=${candidate.id}`)}
                        >
                          Ver Perfil Completo
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            // Navigate to create job or contact candidate
                            navigate('/empresa/dashboard');
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
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
              <p className="text-muted-foreground mb-4">
                Nenhum candidato encontrado com os filtros selecionados
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setAreaFilter('all');
                  setProgressFilter('all');
                }}
              >
                Limpar Filtros
              </Button>
            </Card>
          )}
        </div>
      </main>

      <BottomNav role="company" />
    </div>
  );
};

export default CandidatesList;
