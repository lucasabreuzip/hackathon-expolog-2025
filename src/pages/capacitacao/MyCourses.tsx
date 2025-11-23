import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseCard } from '@/components/CourseCard';
import { BottomNav } from '@/components/BottomNav';
import { getCurrentUser } from '@/lib/mockAuth';
import { Course, CourseProgress } from '@/types';
import coursesData from '@/mock/courses.json';
import courseProgressData from '@/mock/courseProgress.json';
import { GraduationCap, BookOpen, CheckCircle, Clock, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [enrolledCourses, setEnrolledCourses] = useState<Array<{ course: Course; progress: CourseProgress }>>([]);
  const [inProgressCourses, setInProgressCourses] = useState<Array<{ course: Course; progress: CourseProgress }>>([]);
  const [completedCourses, setCompletedCourses] = useState<Array<{ course: Course; progress: CourseProgress }>>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get user's enrolled courses
    const userProgress = courseProgressData.filter((p) => p.userId === user.id);
    const courses = userProgress.map((progress) => {
      const course = coursesData.find((c) => c.id === progress.courseId);
      return {
        course: course as Course,
        progress: progress as CourseProgress,
      };
    }).filter(item => item.course);

    setEnrolledCourses(courses);

    // Filter by status
    setInProgressCourses(courses.filter(item => item.progress.status === 'in_progress' || item.progress.status === 'enrolled'));
    setCompletedCourses(courses.filter(item => item.progress.status === 'completed'));
  }, [user, navigate]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionText,
    actionOnClick
  }: {
    icon: LucideIcon;
    title: string;
    description: string;
    actionText?: string;
    actionOnClick?: () => void;
  }) => (
    <Card className="p-8 text-center">
      <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {actionText && actionOnClick && (
        <Button onClick={actionOnClick}>
          <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
          {actionText}
        </Button>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card border-b py-3 sm:py-4 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Meus Cursos</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Acompanhe seu progresso e continue aprendendo
          </p>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6" data-aos="fade-up" data-aos-duration="800">
          <Card className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{enrolledCourses.length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Total</div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-warning mb-1 sm:mb-2" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{inProgressCourses.length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Em Andamento</div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success mb-1 sm:mb-2" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{completedCourses.length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Concluídos</div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              Todos ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="text-xs sm:text-sm">
              Em Andamento ({inProgressCourses.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">
              Concluídos ({completedCourses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {enrolledCourses.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {enrolledCourses.map(({ course, progress }) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={progress}
                    showProgress={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={GraduationCap}
                title="Nenhum curso em andamento"
                description="Explore nosso catálogo e comece sua jornada de aprendizado"
                actionText="Explorar Cursos"
                actionOnClick={() => navigate('/capacitacao')}
              />
            )}
          </TabsContent>

          <TabsContent value="in-progress">
            {inProgressCourses.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {inProgressCourses.map(({ course, progress }) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={progress}
                    showProgress={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Clock}
                title="Nenhum curso em andamento"
                description="Você não tem cursos em andamento no momento"
                actionText="Explorar Cursos"
                actionOnClick={() => navigate('/capacitacao')}
              />
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedCourses.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {completedCourses.map(({ course, progress }) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={progress}
                    showProgress={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CheckCircle}
                title="Nenhum curso concluído"
                description="Complete seus cursos para receber certificados"
              />
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav role={user.role} />
    </div>
  );
};

export default MyCourses;
