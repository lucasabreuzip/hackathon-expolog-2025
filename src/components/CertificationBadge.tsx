import { Badge } from '@/components/ui/badge';
import { CandidateCertification } from '@/types';
import { getCertificationStatus, getDaysUntilExpiry } from '@/lib/matchScore';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface CertificationBadgeProps {
  certification: CandidateCertification;
  name: string;
  showDetails?: boolean;
}

export const CertificationBadge = ({ 
  certification, 
  name, 
  showDetails = false 
}: CertificationBadgeProps) => {
  const status = getCertificationStatus(certification);
  const daysUntilExpiry = getDaysUntilExpiry(certification);

  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          variant: 'default' as const,
          className: 'bg-success text-success-foreground',
          icon: CheckCircle,
          label: 'Ativa',
          ariaLabel: `Certificação ${name} ativa, válida até ${new Date(certification.expiryDate).toLocaleDateString('pt-BR')}`
        };
      case 'expiring':
        return {
          variant: 'default' as const,
          className: 'bg-warning text-warning-foreground',
          icon: Clock,
          label: `Expira em ${daysUntilExpiry} dias`,
          ariaLabel: `Certificação ${name} expirando, válida por mais ${daysUntilExpiry} dias`
        };
      case 'expired':
        return {
          variant: 'destructive' as const,
          className: 'bg-danger text-danger-foreground',
          icon: AlertCircle,
          label: 'Expirada',
          ariaLabel: `Certificação ${name} expirada desde ${new Date(certification.expiryDate).toLocaleDateString('pt-BR')}`
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} flex items-center gap-1`}
      aria-label={config.ariaLabel}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {showDetails ? config.label : name}
    </Badge>
  );
};
