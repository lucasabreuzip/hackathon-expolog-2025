export interface Certification {
  id: string;
  name: string;
  category: 'safety' | 'operational' | 'technical';
  validityPeriod: number;
  issuingBody: string;
}

export interface CandidateCertification {
  certificationId: string;
  issueDate: string;
  expiryDate: string;
  documentUrl: string | null;
  verified: boolean;
}

export interface Experience {
  position: string;
  company: string;
  period: string;
}

export interface Location {
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  location: Location;
  isPCD: boolean;
  gender?: 'feminino' | 'masculino' | 'nao-binario' | 'prefiro-nao-informar' | 'outro';
  avatar: string | null;
  mainArea: string;
  profileCompleteness: number;
  certifications: CandidateCertification[];
  experience: Experience[];
  skills: string[];
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string | null;
  segment: string;
  location: string;
}

export interface JobRestrictions {
  pcdExclusive: boolean;
  womenExclusive: boolean;
  noColorBlindness: boolean;
  minExperience: number;
}

export interface Salary {
  min: number;
  max: number;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  requiredCertifications: string[];
  requiredSkills: string[];
  desiredSkills: string[];
  restrictions: JobRestrictions;
  salary: Salary;
  regime: 'CLT' | 'PJ' | 'Temp';
  benefits: string[];
  active: boolean;
  publishedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  matchScore: number;
  status: 'pending' | 'viewed' | 'interview' | 'rejected' | 'hired';
  appliedAt: string;
}

export type UserRole = 'candidate' | 'company';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  name: string;
}

// AVA - Ambiente Virtual de Aprendizagem Types

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'document';
  content: string; // URL for video/document, HTML for text, JSON for quiz
  duration: number; // in minutes
  order: number;
  isRequired: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: number; // total duration in hours
  mode: 'ead' | 'presencial' | 'hibrido';
  level: 'basico' | 'intermediario' | 'avancado';
  instructor: string;
  location?: string; // for presencial courses
  schedule?: string; // for presencial courses
  maxStudents?: number;
  tags: string[];
  lessons: Lesson[];
  certificateTemplate?: string;
  active: boolean;
  publishedAt: string;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  lastAccessedAt: string;
  completedLessons: string[]; // array of lesson IDs
  progressPercentage: number;
  quizScores: { [lessonId: string]: number };
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  certificateIssued: boolean;
}

export interface CourseCertificate {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  certificateNumber: string;
  downloadUrl: string;
  validUntil?: string; // optional expiry date
  hours: number; // course duration
  grade?: number; // final grade if applicable
}

export interface CourseEnrollment {
  userId: string;
  courseId: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'dropped';
  attendance?: number; // for presencial courses
}
