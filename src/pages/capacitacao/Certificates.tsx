import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { getCurrentUser } from '@/lib/mockAuth';
import { CourseCertificate } from '@/types';
import certificatesData from '@/mock/courseCertificates.json';
import { Award, Download, Share2, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const Certificates = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [certificates, setCertificates] = useState<CourseCertificate[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get user's certificates
    const userCertificates = certificatesData.filter((cert) => cert.userId === user.id);
    setCertificates(userCertificates as CourseCertificate[]);
  }, [user, navigate]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const handleDownload = (certificate: CourseCertificate) => {
    toast.success(`Baixando certificado ${certificate.certificateNumber}`);
    // In a real app, this would trigger actual download
  };

  const handleShare = (certificate: CourseCertificate) => {
    toast.success('Link copiado para a área de transferência!');
    // In a real app, this would copy share link
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card border-b py-3 sm:py-4 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Meus Certificados</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Seus certificados de conclusão de cursos
          </p>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6" data-aos="fade-up" data-aos-duration="800">
          <Card className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{certificates.length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Certificados</div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-success mb-1 sm:mb-2" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {certificates.reduce((sum, cert) => sum + cert.hours, 0)}h
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Horas Estudadas</div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 col-span-2">
            <div className="flex flex-col items-center text-center">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-warning mb-1 sm:mb-2" aria-hidden="true" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {certificates.length > 0
                  ? (certificates.reduce((sum, cert) => sum + (cert.grade || 0), 0) / certificates.length).toFixed(1)
                  : '0'}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Nota Média</div>
            </div>
          </Card>
        </div>

        {/* Certificates List */}
        {certificates.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {certificates.map((certificate) => (
              <Card
                key={certificate.id}
                className="overflow-hidden"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Certificate Icon/Preview */}
                    <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                      <Award className="h-12 w-12 sm:h-16 sm:w-16 text-primary" aria-hidden="true" />
                    </div>

                    {/* Certificate Info */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold">{certificate.courseTitle}</h3>
                          <Badge variant="secondary" className="text-xs">Concluído</Badge>
                        </div>
                        <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                            <span>
                              Emitido em {format(new Date(certificate.issuedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                            <span>Carga horária: {certificate.hours} horas</span>
                          </p>
                          {certificate.grade && (
                            <p className="flex items-center gap-2">
                              <Award className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                              <span>Nota final: {certificate.grade}</span>
                            </p>
                          )}
                          {certificate.validUntil && (
                            <p className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                              <span>
                                Válido até {format(new Date(certificate.validUntil), "dd/MM/yyyy")}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">
                          Nº do Certificado: <span className="font-mono font-medium">{certificate.certificateNumber}</span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDownload(certificate)}
                          className="text-xs sm:text-sm"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Baixar PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(certificate)}
                          className="text-xs sm:text-sm"
                        >
                          <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Compartilhar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-2">Nenhum certificado ainda</h3>
            <p className="text-muted-foreground mb-4">
              Complete cursos para receber certificados de conclusão
            </p>
            <Button onClick={() => navigate('/capacitacao')}>
              Explorar Cursos
            </Button>
          </Card>
        )}
      </main>

      <BottomNav role={user.role} />
    </div>
  );
};

export default Certificates;
