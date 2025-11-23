import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { BottomNav } from '@/components/BottomNav';
import { getCurrentUser } from '@/lib/mockAuth';
import { Course, CourseProgress } from '@/types';
import coursesData from '@/mock/courses.json';
import courseProgressData from '@/mock/courseProgress.json';
import {
  Clock,
  User,
  BookOpen,
  MapPin,
  Monitor,
  Users,
  Calendar,
  ArrowLeft,
  Share2,
  Play,
  CheckCircle,
  Lock,
  Home
} from 'lucide-react';
import { toast } from 'sonner';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const courseData = coursesData.find(c => c.id === id);
    if (courseData) {
      setCourse(courseData as Course);

      // Check if user is already enrolled
      const userProgress = courseProgressData.find(
        p => p.courseId === id && p.userId === user.id
      );
      if (userProgress) {
        setProgress(userProgress as CourseProgress);
      }
    }
  }, [id, user, navigate]);

  if (!course) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const handleEnroll = () => {
    toast.success('Inscrição realizada com sucesso!');
    setShowEnrollDialog(false);
    // In a real app, this would create a new course progress entry
    navigate('/capacitacao/meus-cursos');
  };

  const handleStartOrContinue = () => {
    navigate(`/capacitacao/aprender/${course.id}`);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'ead':
        return <Monitor className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />;
      case 'presencial':
        return <Users className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />;
      case 'hibrido':
        return <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />;
      default:
        return <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'ead':
        return 'EAD - Ensino à Distância';
      case 'presencial':
        return 'Presencial';
      case 'hibrido':
        return 'Híbrido (EAD + Presencial)';
      default:
        return mode;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'basico':
        return 'Básico';
      case 'intermediario':
        return 'Intermediário';
      case 'avancado':
        return 'Avançado';
      default:
        return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basico':
        return 'bg-success/10 text-success border-success/20';
      case 'intermediario':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'avancado':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getLessonIcon = (type: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />;
    }
    return <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
  };

  const getLessonTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Vídeo';
      case 'text':
        return 'Leitura';
      case 'quiz':
        return 'Avaliação';
      case 'document':
        return 'Documento';
      default:
        return type;
    }
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
          <h1 className="text-base sm:text-xl md:text-2xl font-bold truncate">Detalhes do Curso</h1>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Course Header Card */}
        <Card className="overflow-hidden">
          {/* Course Thumbnail */}
          <div className="relative h-40 sm:h-48 md:h-56 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <BookOpen className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-primary/40" aria-hidden="true" />
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
              <Badge className={getLevelColor(course.level)}>
                {getLevelLabel(course.level)}
              </Badge>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4 gap-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{course.title}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm sm:text-base">{course.instructor}</span>
                </div>
              </div>
              <Button variant="outline" size="icon" aria-label="Compartilhar curso" className="flex-shrink-0">
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Duração</p>
                  <p className="text-xs sm:text-sm font-medium truncate">{course.duration} horas</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getModeIcon(course.mode)}
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Modalidade</p>
                  <p className="text-xs sm:text-sm font-medium truncate">
                    {course.mode === 'ead' ? 'EAD' : course.mode === 'presencial' ? 'Presencial' : 'Híbrido'}
                  </p>
                </div>
              </div>

              {course.mode === 'presencial' && course.location && (
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Local</p>
                    <p className="text-xs sm:text-sm font-medium truncate">{course.location}</p>
                  </div>
                </div>
              )}

              {course.mode === 'presencial' && course.schedule && (
                <div className="flex items-center gap-2 col-span-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Horário</p>
                    <p className="text-xs sm:text-sm font-medium truncate">{course.schedule}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              <Badge variant="outline" className="text-xs">{course.category}</Badge>
              {course.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>

            {progress && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-primary/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium">Seu Progresso</span>
                  <span className="text-xs sm:text-sm font-medium">{progress.progressPercentage}%</span>
                </div>
                <Progress value={progress.progressPercentage} className="h-2 mb-2" />
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {progress.completedLessons.length} de {course.lessons.length} aulas concluídas
                </p>
              </div>
            )}

            <div className="flex gap-2">
              {progress ? (
                <>
                  {progress.status === 'completed' ? (
                    <Button className="flex-1 text-sm sm:text-base" size="lg" onClick={handleStartOrContinue}>
                      Revisar Curso
                    </Button>
                  ) : (
                    <Button className="flex-1 text-sm sm:text-base" size="lg" onClick={handleStartOrContinue}>
                      <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                      {progress.status === 'enrolled' ? 'Iniciar Curso' : 'Continuar Curso'}
                    </Button>
                  )}
                </>
              ) : (
                <Button className="flex-1 text-sm sm:text-base" size="lg" onClick={() => setShowEnrollDialog(true)}>
                  Inscrever-se no Curso
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Course Description */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Sobre o Curso</h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {course.description}
          </p>

          <Separator className="my-4 sm:my-6" />

          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
              <strong>Modalidade:</strong> {getModeLabel(course.mode)}
            </p>
            {course.mode !== 'ead' && course.maxStudents && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong>Vagas limitadas:</strong> {course.maxStudents} alunos
              </p>
            )}
          </div>
        </Card>

        {/* Course Curriculum */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Conteúdo do Curso</h3>
          <div className="space-y-2">
            {course.lessons.map((lesson, index) => {
              const isCompleted = progress?.completedLessons.includes(lesson.id) || false;

              return (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border transition-colors ${
                    isCompleted ? 'bg-success/5 border-success/20' : 'bg-muted/30'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getLessonIcon(lesson.type, isCompleted)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        Aula {index + 1}
                      </span>
                      <Badge variant="outline" className="text-[10px] sm:text-xs">
                        {getLessonTypeLabel(lesson.type)}
                      </Badge>
                    </div>
                    <h4 className="text-sm sm:text-base font-medium mb-1 truncate">{lesson.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-xs sm:text-sm text-muted-foreground">
                    {lesson.duration} min
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>

      {/* Enrollment Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Inscrição</DialogTitle>
            <DialogDescription>
              Você está prestes a se inscrever no curso <strong>{course.title}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <p><strong>Instrutor:</strong> {course.instructor}</p>
            <p><strong>Duração:</strong> {course.duration} horas</p>
            <p><strong>Modalidade:</strong> {getModeLabel(course.mode)}</p>
            {course.mode !== 'ead' && course.schedule && (
              <p><strong>Horário:</strong> {course.schedule}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEnroll}>
              Confirmar Inscrição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav role={user?.role || 'candidate'} />
    </div>
  );
};

export default CourseDetails;
