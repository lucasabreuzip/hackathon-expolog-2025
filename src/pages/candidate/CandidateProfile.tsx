import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BottomNav } from '@/components/BottomNav';
import { CertificationBadge } from '@/components/CertificationBadge';
import { getCurrentUser } from '@/lib/mockAuth';
import { Candidate } from '@/types';
import candidatesData from '@/mock/candidates.json';
import certificationsData from '@/mock/certifications.json';
import { User, Shield, Briefcase, Award, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CandidateProfile = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const [newCert, setNewCert] = useState({
    certificationId: '',
    issueDate: '',
    expiryDate: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const candidateData = candidatesData.find((c) => c.id === user.id);
    if (candidateData) {
      setCandidate(candidateData as Candidate);
    }
  }, [user, navigate]);

  if (!candidate) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const handleAddCertification = () => {
    if (!newCert.certificationId || !newCert.issueDate || !newCert.expiryDate) {
      toast.error('Preencha todos os campos');
      return;
    }

    toast.success('Certificação adicionada com sucesso!');
    setIsAddCertOpen(false);
    setNewCert({ certificationId: '', issueDate: '', expiryDate: '' });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card border-b py-3 sm:py-4 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto flex justify-between items-center gap-2">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Meu Perfil</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/candidato/dashboard')}
          >
            Voltar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Tabs defaultValue="personal" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4" data-aos="fade-down" data-aos-duration="800">
            <TabsTrigger value="personal" className="text-xs sm:text-sm">
              <User className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Dados Pessoais</span>
              <span className="sm:hidden">Dados</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Certificações</span>
              <span className="sm:hidden">Cert.</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="text-xs sm:text-sm">
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Experiência</span>
              <span className="sm:hidden">Exp.</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-xs sm:text-sm">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Habilidades</span>
              <span className="sm:hidden">Skills</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Data Tab */}
          <TabsContent value="personal">
            <Card className="p-4 sm:p-6" data-aos="fade-up" data-aos-duration="800">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Dados Pessoais</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name"
                    defaultValue={candidate.name}
                    aria-label="Nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone"
                    defaultValue={candidate.phone}
                    aria-label="Número de telefone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email"
                    type="email"
                    defaultValue={candidate.email}
                    disabled
                    aria-label="Endereço de e-mail"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input 
                    id="city"
                    defaultValue={candidate.location.city}
                    aria-label="Cidade"
                  />
                </div>

                <div className="md:col-span-2 flex items-center space-x-2">
                  <Checkbox 
                    id="isPCD"
                    checked={candidate.isPCD}
                  />
                  <Label htmlFor="isPCD" className="cursor-pointer">
                    Sou pessoa com deficiência (PCD)
                  </Label>
                </div>
              </div>

              <Button className="mt-6" onClick={() => toast.success('Dados atualizados!')}>
                Salvar Alterações
              </Button>
            </Card>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold">Minhas Certificações</h2>
                <Dialog open={isAddCertOpen} onOpenChange={setIsAddCertOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span className="hidden sm:inline">Adicionar Certificação</span>
                      <span className="sm:hidden">Adicionar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Certificação</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="cert-type">Tipo de Certificação</Label>
                        <Select
                          value={newCert.certificationId}
                          onValueChange={(value) => setNewCert({ ...newCert, certificationId: value })}
                        >
                          <SelectTrigger id="cert-type">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {certificationsData.map((cert) => (
                              <SelectItem key={cert.id} value={cert.id}>
                                {cert.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="issue-date">Data de Emissão</Label>
                        <Input
                          id="issue-date"
                          type="date"
                          value={newCert.issueDate}
                          onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiry-date">Data de Validade</Label>
                        <Input
                          id="expiry-date"
                          type="date"
                          value={newCert.expiryDate}
                          onChange={(e) => setNewCert({ ...newCert, expiryDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddCertOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddCertification}>
                        Salvar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {candidate.certifications.length > 0 ? (
                <div className="grid gap-3 sm:gap-4">
                  {candidate.certifications.map((cert, index) => {
                    const certData = certificationsData.find(c => c.id === cert.certificationId);
                    if (!certData) return null;

                    return (
                      <Card key={index} className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                              <h3 className="font-semibold text-sm sm:text-base">{certData.name}</h3>
                              <CertificationBadge
                                certification={cert}
                                name={certData.name}
                                showDetails
                              />
                            </div>
                            
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>
                                <strong>Emissão:</strong> {format(new Date(cert.issueDate), 'dd/MM/yyyy')}
                              </p>
                              <p>
                                <strong>Validade:</strong> {format(new Date(cert.expiryDate), 'dd/MM/yyyy')}
                              </p>
                              <p>
                                <strong>Órgão Emissor:</strong> {certData.issuingBody}
                              </p>
                            </div>

                            {cert.documentUrl && (
                              <Button variant="link" className="px-0 mt-2">
                                <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                                Ver Documento
                              </Button>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" aria-label="Editar certificação">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              aria-label="Remover certificação"
                              onClick={() => toast.success('Certificação removida!')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
                  <p className="text-muted-foreground mb-4">
                    Você ainda não adicionou certificações
                  </p>
                  <Button onClick={() => setIsAddCertOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                    Adicionar Primeira Certificação
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold">Experiência Profissional</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">Adicionar Experiência</span>
                  <span className="sm:hidden">Adicionar</span>
                </Button>
              </div>

              {candidate.experience.map((exp, index) => (
                <Card key={index} className="p-3 sm:p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg">{exp.position}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{exp.company}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{exp.period}</p>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Editar experiência">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Remover experiência">
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Habilidades e Competências</h2>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Adicionar
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav role="candidate" />
    </div>
  );
};

export default CandidateProfile;
