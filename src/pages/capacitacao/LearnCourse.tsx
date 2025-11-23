import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/mockAuth';
import { Course, Lesson, CourseProgress } from '@/types';
import coursesData from '@/mock/courses.json';
import courseProgressData from '@/mock/courseProgress.json';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  PlayCircle,
  FileText,
  HelpCircle,
  Download,
  X,
  Home
} from 'lucide-react';
import { toast } from 'sonner';

const LearnCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const courseData = coursesData.find(c => c.id === id);
    if (!courseData) {
      navigate('/capacitacao');
      return;
    }

    setCourse(courseData as Course);

    // Get user progress
    const userProgress = courseProgressData.find(
      p => p.courseId === id && p.userId === user.id
    );

    if (!userProgress) {
      // User not enrolled, redirect to course details
      navigate(`/capacitacao/curso/${id}`);
      return;
    }

    setProgress(userProgress as CourseProgress);

    // Set current lesson to the first incomplete lesson or first lesson
    const firstIncompleteIndex = courseData.lessons.findIndex(
      (lesson) => !userProgress.completedLessons.includes(lesson.id)
    );
    setCurrentLessonIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
  }, [id, user, navigate]);

  if (!course || !progress) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const currentLesson = course.lessons[currentLessonIndex];
  const isLessonCompleted = progress.completedLessons.includes(currentLesson.id);
  const isLastLesson = currentLessonIndex === course.lessons.length - 1;
  const isFirstLesson = currentLessonIndex === 0;

  const handleMarkComplete = () => {
    if (!isLessonCompleted) {
      toast.success('Aula concluída!');
      // In a real app, this would update the backend
    }
  };

  const handleNextLesson = () => {
    if (!isLastLesson) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (progress.status !== 'completed') {
      toast.success('Parabéns! Você concluiu o curso!');
      navigate(`/capacitacao/certificados`);
    }
  };

  const handlePreviousLesson = () => {
    if (!isFirstLesson) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLessonClick = (index: number) => {
    setCurrentLessonIndex(index);
    setShowSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="h-4 w-4" aria-hidden="true" />;
      case 'text':
        return <FileText className="h-4 w-4" aria-hidden="true" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4" aria-hidden="true" />;
      case 'document':
        return <Download className="h-4 w-4" aria-hidden="true" />;
      default:
        return <FileText className="h-4 w-4" aria-hidden="true" />;
    }
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

  const renderLessonContent = () => {
    switch (currentLesson.type) {
      case 'video':
        return (
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-sm opacity-75">Player de vídeo será carregado aqui</p>
              <p className="text-xs opacity-50 mt-2">{currentLesson.content}</p>
            </div>
          </div>
        );
      case 'text':
        return (
          <Card className="p-4 sm:p-6 prose prose-sm sm:prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
          </Card>
        );
      case 'quiz':
        return (
          <Card className="p-4 sm:p-6">
            <div className="text-center py-8">
              <HelpCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Avaliação</h3>
              <p className="text-muted-foreground mb-6">
                Teste seus conhecimentos sobre o conteúdo estudado
              </p>
              <Button size="lg">Iniciar Avaliação</Button>
            </div>
          </Card>
        );
      case 'document':
        return (
          <Card className="p-4 sm:p-6">
            <div className="text-center py-8">
              <Download className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Material para Download</h3>
              <p className="text-muted-foreground mb-6">
                Baixe o material de apoio para acompanhar a aula
              </p>
              <Button size="lg">
                <Download className="h-4 w-4 mr-2" />
                Baixar Material
              </Button>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b py-3 px-3 sm:px-4 md:px-6 sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                aria-label="Voltar"
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/candidato/dashboard')}
                aria-label="Ir para o início"
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <Home className="h-4 w-4" />
              </Button>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base font-semibold truncate">{course.title}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block truncate">
                Aula {currentLessonIndex + 1} de {course.lessons.length}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden flex-shrink-0"
          >
            {showSidebar ? <X className="h-4 w-4" /> : 'Aulas'}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="container mx-auto mt-3">
          <div className="flex items-center gap-2">
            <Progress value={progress.progressPercentage} className="h-2 flex-1" />
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              {progress.progressPercentage}%
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex">
        {/* Sidebar - Lessons List */}
        <aside
          className={`${
            showSidebar ? 'fixed inset-y-0 left-0 z-50 w-full sm:w-80' : 'hidden'
          } lg:block lg:static lg:w-80 bg-card border-r overflow-y-auto`}
          style={{ maxHeight: 'calc(100vh - 80px)' }}
        >
          <div className="p-3 sm:p-4 space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Conteúdo do Curso</h2>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowSidebar(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {course.lessons.map((lesson: Lesson, index: number) => {
              const completed = progress.completedLessons.includes(lesson.id);
              const isCurrent = index === currentLessonIndex;

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : completed
                      ? 'bg-success/10 hover:bg-success/20'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {completed ? (
                        <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />
                      ) : (
                        getLessonIcon(lesson.type)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs opacity-75">Aula {index + 1}</span>
                        <Badge variant={isCurrent ? 'secondary' : 'outline'} className="text-xs">
                          {getLessonTypeLabel(lesson.type)}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium line-clamp-2">{lesson.title}</p>
                      <p className="text-xs opacity-75 mt-1">{lesson.duration} min</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* Lesson Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {getLessonTypeLabel(currentLesson.type)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Aula {currentLessonIndex + 1} de {course.lessons.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{currentLesson.title}</h2>
            <p className="text-sm sm:text-base text-muted-foreground">{currentLesson.description}</p>
          </div>

          {/* Lesson Content */}
          <div>{renderLessonContent()}</div>

          <Separator />

          {/* Lesson Navigation */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button
              variant="outline"
              onClick={handlePreviousLesson}
              disabled={isFirstLesson}
              className="order-2 sm:order-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Aula Anterior
            </Button>

            {!isLessonCompleted && (
              <Button variant="outline" onClick={handleMarkComplete} className="order-1 sm:order-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Concluída
              </Button>
            )}

            <Button onClick={handleNextLesson} className="order-3">
              {isLastLesson ? 'Concluir Curso' : 'Próxima Aula'}
              {!isLastLesson && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default LearnCourse;
