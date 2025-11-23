import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Course, CourseProgress } from '@/types';
import { Clock, User, BookOpen, MapPin, Monitor, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress;
  showProgress?: boolean;
  compact?: boolean;
}

export const CourseCard = ({ course, progress, showProgress = false, compact = false }: CourseCardProps) => {
  const navigate = useNavigate();

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'ead':
        return <Monitor className="h-3 w-3" aria-hidden="true" />;
      case 'presencial':
        return <Users className="h-3 w-3" aria-hidden="true" />;
      case 'hibrido':
        return <BookOpen className="h-3 w-3" aria-hidden="true" />;
      default:
        return <BookOpen className="h-3 w-3" aria-hidden="true" />;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'ead':
        return 'EAD';
      case 'presencial':
        return 'Presencial';
      case 'hibrido':
        return 'Híbrido';
      default:
        return mode;
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

  const handleCardClick = () => {
    if (showProgress && progress?.status === 'in_progress') {
      navigate(`/capacitacao/aprender/${course.id}`);
    } else if (showProgress && progress?.status === 'completed') {
      navigate(`/capacitacao/curso/${course.id}`);
    } else {
      navigate(`/capacitacao/curso/${course.id}`);
    }
  };

  if (compact) {
    return (
      <Card
        className="p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
          }
        }}
        aria-label={`${course.title} - ${course.instructor}`}
      >
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">{course.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{course.instructor}</p>
            </div>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {getModeIcon(course.mode)}
              <span className="ml-1">{getModeLabel(course.mode)}</span>
            </Badge>
          </div>
          {showProgress && progress && (
            <div className="space-y-1">
              <Progress value={progress.progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{progress.progressPercentage}% concluído</p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer card-elevated" data-aos="fade-up" data-aos-duration="800">
      <div
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
          }
        }}
        aria-label={`Ver detalhes do curso: ${course.title}`}
      >
        {/* Course Thumbnail */}
        <div className="relative h-36 sm:h-40 md:h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <BookOpen className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-primary/40" aria-hidden="true" />
          <div className="absolute top-2 right-2">
            <Badge className={getLevelColor(course.level)}>
              {getLevelLabel(course.level)}
            </Badge>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-3 sm:p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{course.instructor}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span>{course.duration}h</span>
            </div>
            {course.mode === 'presencial' && course.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                <span className="truncate">{course.location}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {getModeIcon(course.mode)}
              <span className="ml-1">{getModeLabel(course.mode)}</span>
            </Badge>
            <Badge variant="outline" className="text-xs">{course.category}</Badge>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>

          {showProgress && progress && (
            <div className="pt-2 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{progress.progressPercentage}%</span>
              </div>
              <Progress value={progress.progressPercentage} className="h-2" />
            </div>
          )}

          <Button
            className="w-full mt-2 text-xs sm:text-sm"
            variant={showProgress && progress?.status === 'in_progress' ? 'default' : 'outline'}
            aria-label={
              showProgress && progress?.status === 'in_progress'
                ? `Continuar curso ${course.title}`
                : showProgress && progress?.status === 'completed'
                ? `Revisar curso ${course.title}`
                : `Inscrever-se em ${course.title}`
            }
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            {showProgress && progress?.status === 'in_progress' && 'Continuar Curso'}
            {showProgress && progress?.status === 'completed' && 'Revisar Curso'}
            {showProgress && progress?.status === 'enrolled' && 'Iniciar Curso'}
            {!showProgress && 'Ver Detalhes'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
