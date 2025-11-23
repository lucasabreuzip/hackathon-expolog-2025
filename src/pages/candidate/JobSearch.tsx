import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { JobCard } from '@/components/JobCard';
import { BottomNav } from '@/components/BottomNav';
import { getCurrentUser } from '@/lib/mockAuth';
import { calculateMatchScore } from '@/lib/matchScore';
import { SemanticSearchAI } from '@/lib/ai';
import { Candidate, Job, Company } from '@/types';
import candidatesData from '@/mock/candidates.json';
import jobsData from '@/mock/jobs.json';
import companiesData from '@/mock/companies.json';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobSearch = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [filteredJobs, setFilteredJobs] = useState<Array<{ job: Job; company: Company; matchScore: number }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyFullMatch, setOnlyFullMatch] = useState(false);

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

  useEffect(() => {
    if (!candidate) return;

    let activeJobs = jobsData.filter(job => job.active) as Job[];

    // Filter women-exclusive jobs based on candidate gender
    activeJobs = activeJobs.filter(job => {
      // If job is women-exclusive, only show to female candidates
      if (job.restrictions.womenExclusive) {
        return candidate.gender === 'feminino';
      }
      // Show all other jobs to everyone
      return true;
    });

    // Apply search filter with AI semantic search
    if (searchTerm && searchTerm.length >= 2) {
      const searchResults = SemanticSearchAI.searchJobs(
        searchTerm,
        activeJobs,
        {
          fuzzyMatch: true,
          synonyms: true,
          minScore: 20,
          maxResults: 100
        }
      );
      activeJobs = searchResults.map(result => result.item);
    }

    // Map jobs with match scores and company info
    let jobs = activeJobs.map(job => {
      const company = companiesData.find(c => c.id === job.companyId);
      const match = calculateMatchScore(candidate, job);
      return {
        job: job,
        company: company as Company,
        matchScore: match.score
      };
    });

    // Apply category filter
    if (selectedCategory !== 'all') {
      jobs = jobs.filter(({ job }) => job.category === selectedCategory);
    }

    // Apply full match filter
    if (onlyFullMatch) {
      jobs = jobs.filter(({ matchScore }) => matchScore === 100);
    }

    // Sort by match score (semantic search already sorts by relevance)
    if (!searchTerm) {
      jobs.sort((a, b) => b.matchScore - a.matchScore);
    }

    setFilteredJobs(jobs);
  }, [candidate, searchTerm, selectedCategory, onlyFullMatch]);

  if (!candidate) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const categories = ['all', ...new Set(jobsData.map(job => job.category))];

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.slice(1).map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="fullMatch"
          checked={onlyFullMatch}
          onCheckedChange={(checked) => setOnlyFullMatch(checked as boolean)}
        />
        <Label htmlFor="fullMatch" className="cursor-pointer">
          Apenas vagas que atendo 100%
        </Label>
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setSearchTerm('');
          setSelectedCategory('all');
          setOnlyFullMatch(false);
        }}
      >
        Limpar Filtros
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card border-b py-3 sm:py-4 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Buscar Vagas</h1>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4" data-aos="fade-down" data-aos-duration="800">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Busca inteligente: cargo, habilidades, empresa..."
                className="pl-10 pr-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar vagas com IA"
              />
              {searchTerm && (
                <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                  <Sparkles className="h-2 w-2 mr-1" />
                  IA
                </Badge>
              )}
            </div>
            
            {/* Mobile Filter */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Abrir filtros</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block">
            <Card className="p-4 sticky top-4">
              <h2 className="font-semibold mb-4">Filtros</h2>
              <FilterPanel />
            </Card>
          </aside>

          {/* Job Results */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {filteredJobs.length} vaga(s) encontrada(s)
              </p>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid gap-4">
                {filteredJobs.map(({ job, company, matchScore }) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    company={company}
                    matchScore={matchScore}
                    showMatchScore={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
                <p className="text-muted-foreground mb-4">
                  Nenhuma vaga encontrada com os filtros selecionados
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setOnlyFullMatch(false);
                  }}
                >
                  Limpar Filtros
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>

      <BottomNav role="candidate" />
    </div>
  );
};

export default JobSearch;
