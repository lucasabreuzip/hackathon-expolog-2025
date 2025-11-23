import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseCard } from '@/components/CourseCard';
import { BottomNav } from '@/components/BottomNav';
import { getCurrentUser } from '@/lib/mockAuth';
import { SemanticSearchAI } from '@/lib/ai';
import { Course, CourseProgress } from '@/types';
import coursesData from '@/mock/courses.json';
import courseProgressData from '@/mock/courseProgress.json';
import { Search, SlidersHorizontal, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Array<{ course: Course; progress: CourseProgress }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    // Get user's enrolled courses
    if (user) {
      const userProgress = courseProgressData.filter((p) => p.userId === user.id);
      const enrolledCourses = userProgress.map((progress) => {
        const course = coursesData.find((c) => c.id === progress.courseId);
        return {
          course: course as Course,
          progress: progress as CourseProgress,
        };
      }).filter(item => item.course);
      setMyCourses(enrolledCourses);
    }
  }, [user]);

  useEffect(() => {
    let courses = coursesData.filter((c) => c.active);

    // Apply search filter with AI semantic search
    if (searchTerm && searchTerm.length >= 2) {
      const searchResults = SemanticSearchAI.searchCourses(
        searchTerm,
        courses as Course[],
        {
          fuzzyMatch: true,
          synonyms: true,
          minScore: 20,
          maxResults: 100
        }
      );
      courses = searchResults.map(result => result.item);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      courses = courses.filter((course) => course.category === selectedCategory);
    }

    // Apply mode filter
    if (selectedMode !== 'all') {
      courses = courses.filter((course) => course.mode === selectedMode);
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      courses = courses.filter((course) => course.level === selectedLevel);
    }

    // Sort by published date (newest first) only if not searching
    if (!searchTerm) {
      courses.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    setFilteredCourses(courses as Course[]);
  }, [searchTerm, selectedCategory, selectedMode, selectedLevel]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const categories = ['all', ...new Set(coursesData.map((course) => course.category))];

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
            {categories.slice(1).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mode">Modalidade</Label>
        <Select value={selectedMode} onValueChange={setSelectedMode}>
          <SelectTrigger id="mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as modalidades</SelectItem>
            <SelectItem value="ead">EAD</SelectItem>
            <SelectItem value="presencial">Presencial</SelectItem>
            <SelectItem value="hibrido">Híbrido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Nível</Label>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger id="level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os níveis</SelectItem>
            <SelectItem value="basico">Básico</SelectItem>
            <SelectItem value="intermediario">Intermediário</SelectItem>
            <SelectItem value="avancado">Avançado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSearchTerm('');
          setSelectedCategory('all');
          setSelectedMode('all');
          setSelectedLevel('all');
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
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Capacitação</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Desenvolva suas habilidades e conquiste novas oportunidades
          </p>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Todos os Cursos
            </TabsTrigger>
            <TabsTrigger value="my-courses" className="text-xs sm:text-sm">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Meus Cursos ({myCourses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="space-y-4" data-aos="fade-down" data-aos-duration="800">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    placeholder="Busca inteligente: cursos, habilidades, certificações..."
                    className="pl-10 pr-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Buscar cursos com IA"
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

              {/* Course Results */}
              <div className="md:col-span-3 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {filteredCourses.length} curso(s) encontrado(s)
                  </p>
                </div>

                {filteredCourses.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {filteredCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
                    <p className="text-muted-foreground mb-4">
                      Nenhum curso encontrado com os filtros selecionados
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setSelectedMode('all');
                        setSelectedLevel('all');
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-courses">
            {myCourses.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {myCourses.map(({ course, progress }) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={progress}
                    showProgress={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-lg font-semibold mb-2">Nenhum curso em andamento</h3>
                <p className="text-muted-foreground mb-4">
                  Explore nosso catálogo e comece sua jornada de aprendizado
                </p>
                <Button onClick={() => navigate('/capacitacao')}>
                  <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                  Explorar Cursos
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav role={user.role} />
    </div>
  );
};

export default Courses;
