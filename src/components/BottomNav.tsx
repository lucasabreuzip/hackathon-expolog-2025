import { Home, Briefcase, User, Bell, GraduationCap } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  role: 'candidate' | 'company';
}

export const BottomNav = ({ role }: BottomNavProps) => {
  const candidateLinks = [
    { to: '/candidato/dashboard', icon: Home, label: 'Início' },
    { to: '/candidato/vagas', icon: Briefcase, label: 'Vagas' },
    { to: '/capacitacao', icon: GraduationCap, label: 'Cursos' },
    { to: '/candidato/perfil', icon: User, label: 'Perfil' },
    { to: '/candidato/candidaturas', icon: Bell, label: 'Candidaturas' }
  ];

  const companyLinks = [
    { to: '/empresa/dashboard', icon: Home, label: 'Início' },
    { to: '/empresa/vagas', icon: Briefcase, label: 'Vagas' },
    { to: '/empresa/candidatos', icon: User, label: 'Talentos' },
  ];

  const links = role === 'candidate' ? candidateLinks : companyLinks;

  return (
    <nav 
      className="bottom-nav md:hidden"
      aria-label="Navegação principal"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-muted-foreground transition-colors focus-ring"
            activeClassName="text-primary bg-primary/10"
            aria-label={link.label}
          >
            <link.icon className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
