import { useEffect, useState } from 'react';
import pecemLogo from '@/assets/pecem-empregabilidade-logo.png';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start fade-in animation
    setTimeout(() => setIsAnimating(true), 100);

    // Start fade-out after 2 seconds
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2500);

    // Finish and unmount after fade-out completes
    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, 3200);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-700 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      <div 
        className={`transform transition-all duration-1000 ease-out px-4 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <img 
          src={pecemLogo} 
          alt="Porto do Pecém" 
          className="h-24 w-auto max-w-[80vw] sm:h-28 md:h-32 lg:h-36 object-contain"
        />
      </div>
    </div>
  );
};
