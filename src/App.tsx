import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ImageProcessor from "./pages/ImageProcessor";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import JobSearch from "./pages/candidate/JobSearch";
import JobDetails from "./pages/candidate/JobDetails";
import CandidateApplications from "./pages/candidate/CandidateApplications";

// Company pages
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CandidatesList from "./pages/company/CandidatesList";
import JobCandidates from "./pages/company/JobCandidates";
import ManageJobs from "./pages/company/ManageJobs";

// Capacitacao pages
import Courses from "./pages/capacitacao/Courses";
import CourseDetails from "./pages/capacitacao/CourseDetails";
import LearnCourse from "./pages/capacitacao/LearnCourse";
import MyCourses from "./pages/capacitacao/MyCourses";
import Certificates from "./pages/capacitacao/Certificates";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AccessibilityPanel />
        <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Signup />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/processar-logo" element={<ImageProcessor />} />

          {/* Candidate Routes */}
          <Route path="/candidato/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidato/perfil" element={<CandidateProfile />} />
          <Route path="/candidato/vagas" element={<JobSearch />} />
          <Route path="/candidato/vaga/:id" element={<JobDetails />} />
          <Route path="/candidato/candidaturas" element={<CandidateApplications />} />

          {/* Company Routes */}
          <Route path="/empresa/dashboard" element={<CompanyDashboard />} />
          <Route path="/empresa/candidatos" element={<CandidatesList />} />
          <Route path="/empresa/vaga/:id/candidatos" element={<JobCandidates />} />
          <Route path="/empresa/vagas" element={<ManageJobs />} />

          {/* Capacitacao Routes */}
          <Route path="/capacitacao" element={<Courses />} />
          <Route path="/capacitacao/curso/:id" element={<CourseDetails />} />
          <Route path="/capacitacao/aprender/:id" element={<LearnCourse />} />
          <Route path="/capacitacao/meus-cursos" element={<MyCourses />} />
          <Route path="/capacitacao/certificados" element={<Certificates />} />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
