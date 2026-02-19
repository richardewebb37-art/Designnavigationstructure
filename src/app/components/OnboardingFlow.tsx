import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Book, Users, Calendar, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import logoImage from 'figma:asset/7f4c2830fbeab039f2bfb2e66991fbd14cd52b08.png';

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      {/* The Fictionverse Logo - Fixed at top */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-0 pointer-events-none">
        <img 
          src={logoImage} 
          alt="The Fictionverse" 
          className="h-[200px] w-auto object-contain"
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl border-4 border-yellow-400 shadow-2xl overflow-hidden">
        {/* Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
        
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all z-10"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="relative z-10 p-12 pt-16">
          {/* Icon */}
          <div className={`w-24 h-24 mx-auto mb-8 bg-gradient-to-br ${steps[currentStep].color} rounded-2xl flex items-center justify-center border-4 border-white/20 shadow-2xl`}>
            {steps[currentStep].icon}
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="font-black text-4xl text-white mb-4 tracking-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed max-w-xl mx-auto">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`transition-all ${
                  index === currentStep
                    ? 'w-12 h-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full'
                    : 'w-3 h-3 bg-slate-600 hover:bg-slate-500 rounded-full'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 disabled:bg-slate-800 hover:bg-slate-600 disabled:cursor-not-allowed rounded-xl border-2 border-slate-600 text-white font-bold transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={handleSkip}
              className="px-6 py-3 text-slate-400 hover:text-white font-bold transition-all"
            >
              Skip Tour
            </button>

            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${
                currentStep === steps.length - 1
                  ? 'from-green-600 to-green-700 border-green-400'
                  : 'from-blue-600 to-blue-700 border-blue-400'
              } hover:opacity-90 rounded-xl border-2 text-white font-bold transition-all`}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Check className="w-5 h-5" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5" />
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