import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job, Company } from '@/types';
import { MapPin, Briefcase, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  company: Company;
  matchScore?: number;
  showMatchScore?: boolean;
}

export const JobCard = ({ job, company, matchScore, showMatchScore = true }: JobCardProps) => {
  const navigate = useNavigate();

  const formatSalary = (min: number, max: number) => {
    return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'bg-success text-success-foreground';
    if (score >= 60) return 'bg-warning text-warning-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer card-elevated" data-aos="fade-up" data-aos-duration="800">
      <div
        className="space-y-3"
        onClick={() => navigate(`/candidato/vaga/${job.id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate(`/candidato/vaga/${job.id}`);
          }
        }}
        aria-label={`Ver detalhes da vaga: ${job.title} na ${company.name}`}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-1">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground">{company.name}</p>
          </div>
          {showMatchScore && matchScore !== undefined && (
            <Badge 
              className={`${getMatchColor(matchScore)} flex items-center gap-1`}
              aria-label={`Compatibilidade de ${matchScore}%`}
            >
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              {matchScore}% Match
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" aria-hidden="true" />
            <span>{job.regime}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{job.category}</Badge>
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

        <div className="pt-2 border-t border-border">
          <p className="text-sm font-medium text-foreground">
            {formatSalary(job.salary.min, job.salary.max)}
          </p>
        </div>

        <Button 
          className="w-full mt-2"
          aria-label={`Candidatar-se para ${job.title}`}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/candidato/vaga/${job.id}`);
          }}
        >
          Ver Detalhes
        </Button>
      </div>
    </Card>
  );
};
