import { Job, Candidate, CandidateCertification } from '@/types';
import certifications from '@/mock/certifications.json';
import { differenceInDays } from 'date-fns';

export interface MatchResult {
  score: number;
  missingCertifications: string[];
  missingSkills: string[];
  hasExpiredCertifications: boolean;
}

export const calculateMatchScore = (
  candidate: Candidate,
  job: Job
): MatchResult => {
  let score = 0;
  const missingCertifications: string[] = [];
  const missingSkills: string[] = [];
  let hasExpiredCertifications = false;

  // Check required certifications (60% weight)
  const activeCerts = candidate.certifications.filter(cert => {
    const expiryDate = new Date(cert.expiryDate);
    const isActive = expiryDate > new Date();
    if (!isActive) hasExpiredCertifications = true;
    return isActive && cert.verified;
  });

  const activeCertIds = activeCerts.map(c => c.certificationId);

  if (job.requiredCertifications.length > 0) {
    const hasAllCerts = job.requiredCertifications.every(reqCert => {
      const has = activeCertIds.includes(reqCert);
      if (!has) {
        const certData = certifications.find(c => c.id === reqCert);
        if (certData) missingCertifications.push(certData.name);
      }
      return has;
    });

    if (hasAllCerts) {
      score += 60;
    } else {
      // Partial credit
      const matchedCerts = job.requiredCertifications.filter(c => 
        activeCertIds.includes(c)
      ).length;
      score += (matchedCerts / job.requiredCertifications.length) * 60;
    }
  } else {
    score += 60; // No certs required
  }

  // Check required skills (30% weight)
  if (job.requiredSkills.length > 0) {
    const candidateSkills = candidate.skills.map(s => s.toLowerCase());
    const matchedSkills = job.requiredSkills.filter(reqSkill => 
      candidateSkills.some(cs => cs.includes(reqSkill.toLowerCase()))
    );
    
    job.requiredSkills.forEach(skill => {
      if (!matchedSkills.find(ms => ms.toLowerCase() === skill.toLowerCase())) {
        missingSkills.push(skill);
      }
    });

    score += (matchedSkills.length / job.requiredSkills.length) * 30;
  } else {
    score += 30; // No skills required
  }

  // Geographic proximity (10% weight)
  const distance = calculateDistance(
    candidate.location.coordinates,
    { lat: -3.6, lng: -38.97 } // Pecém approximate coordinates
  );

  if (distance < 20) {
    score += 10;
  } else if (distance < 50) {
    score += 5;
  }

  return {
    score: Math.round(score),
    missingCertifications,
    missingSkills,
    hasExpiredCertifications
  };
};

export const getCertificationStatus = (cert: CandidateCertification): 'active' | 'expiring' | 'expired' => {
  const expiryDate = new Date(cert.expiryDate);
  const today = new Date();
  const daysUntilExpiry = differenceInDays(expiryDate, today);

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry < 60) return 'expiring';
  return 'active';
};

export const getDaysUntilExpiry = (cert: CandidateCertification): number => {
  return differenceInDays(new Date(cert.expiryDate), new Date());
};

// Simple distance calculation (Haversine formula)
function calculateDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
