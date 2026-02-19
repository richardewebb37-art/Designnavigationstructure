import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Book, Users, Calendar, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { setShowOnboarding } = useApp();

  const steps = [
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: 'Welcome to The Fictionverse!',
      description: 'Your ultimate platform for creative writing and reading. Explore original works and fan fiction from your favorite universes.',
      color: 'from-yellow-600 to-orange-600',
    },
    {
      icon: <Book className="w-12 h-12" />,
      title: 'Discover Amazing Stories',
      description: 'Browse through thousands of stories from Marvel, DC, Star Wars, and more. Or dive into completely original universes created by our community.',
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Join the Community',
      description: 'Connect with fellow writers and readers. Share feedback, participate in discussions, and make new friends who share your passion.',
      color: 'from-purple-600 to-purple-700',
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: 'Compete in Events',
      description: 'Participate in writing challenges, contests, and community events. Show off your skills and win exclusive badges!',
      color: 'from-green-600 to-green-700',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      {/* The Fictionverse Logo - Responsive positioning */}
      <div className="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 z-0 pointer-events-none">
        <div className="text-center">
          <div className="text-6xl sm:text-7xl lg:text-8xl mb-2">📚</div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
            The Fictionverse
          </h1>
          <p className="text-sm sm:text-base font-bold text-yellow-400 uppercase tracking-wide">
            By AlterOne Studio
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-yellow-400 shadow-2xl overflow-hidden mx-auto">
        {/* Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
        
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all z-10"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        <div className="relative z-10 p-6 sm:p-8 md:p-12 pt-8 sm:pt-12 md:pt-16">
          {/* Icon - Responsive size */}
          <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-6 sm:mb-8 bg-gradient-to-br ${steps[currentStep].color} rounded-xl sm:rounded-2xl flex items-center justify-center border-2 sm:border-4 border-white/20 shadow-2xl`}>
            <div className="[&>svg]:w-8 [&>svg]:h-8 sm:[&>svg]:w-10 sm:[&>svg]:h-10 md:[&>svg]:w-12 md:[&>svg]:h-12 text-white">
              {steps[currentStep].icon}
            </div>
          </div>

          {/* Content - Responsive text */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-white mb-3 sm:mb-4 tracking-tight px-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl mx-auto px-2">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Progress Dots - Responsive spacing */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`transition-all ${
                  index === currentStep
                    ? 'w-8 sm:w-10 md:w-12 h-2 sm:h-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full'
                    : 'w-2 sm:w-3 h-2 sm:h-3 bg-slate-600 hover:bg-slate-500 rounded-full'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons - Responsive layout */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-700 disabled:bg-slate-800 hover:bg-slate-600 disabled:cursor-not-allowed rounded-lg sm:rounded-xl border-2 border-slate-600 text-white font-bold transition-all text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Previous
            </button>

            <button
              onClick={handleSkip}
              className="order-first sm:order-none px-4 sm:px-6 py-2 sm:py-3 text-slate-400 hover:text-white font-bold transition-all text-sm sm:text-base"
            >
              Skip Tour
            </button>

            <button
              onClick={handleNext}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r ${
                currentStep === steps.length - 1
                  ? 'from-green-600 to-green-700 border-green-400'
                  : 'from-blue-600 to-blue-700 border-blue-400'
              } hover:opacity-90 rounded-lg sm:rounded-xl border-2 text-white font-bold transition-all text-sm sm:text-base`}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />
      </div>
    </div>
  );
}