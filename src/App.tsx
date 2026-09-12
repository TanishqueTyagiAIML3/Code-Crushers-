import React, { useState, useEffect } from 'react';
import { MainDashboard } from './components/MainDashboard';
import { VisionSection } from './components/VisionSection';
import { LanguageSelectionSection } from './components/LanguageSelectionSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { AccessibilitySettings } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CurriculumProgressProvider } from './context/CurriculumProgressContext';
import { OfflineBanner } from './components/OfflineBanner';
import { CustomCursor } from './components/CustomCursor';
import { Sparkles, Compass, Globe } from 'lucide-react';

function AppContent() {
  const { selectedLanguage, t } = useLanguage();

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    openDyslexic: false,
    bionicReading: false,
    highContrast: false,
    customCursor: true,
    speechSpeed: 1.0,
    fontSize: 'normal'
  });

  // Dynamically sync high-contrast mode class to root document element
  useEffect(() => {
    if (accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [accessibility.highContrast]);

  const [showFullSpecs, setShowFullSpecs] = useState(false);

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-300 ${
      accessibility.openDyslexic ? 'font-dyslexic' : ''
    } ${accessibility.highContrast ? 'high-contrast-mode bg-black text-[#ffff00]' : ''} ${
      accessibility.customCursor !== false ? 'cursor-custom-enabled' : ''
    }`}>
      {/* Unique Custom Fluid Cursor with Precision Dot & Ambient Aura Ring */}
      {accessibility.customCursor !== false && (
        <CustomCursor accessibility={accessibility} />
      )}

      {/* Offline Status Alert for Rural Students with Intermittent Connectivity */}
      <OfflineBanner />

      {/* Primary Flagship App Screen: Exact Match of User Provided Design */}
      <div className="flex-1 flex flex-col w-full animate-slide-up">
        <MainDashboard
          accessibility={accessibility}
          setAccessibility={setAccessibility}
        />
      </div>

      {/* Subtle Bottom Expand for Architecture & Regional Dialects */}
      <div className="w-full px-4 pb-4 animate-slide-up [animation-delay:600ms]">
        <div className="flex justify-center">
          <button
            onClick={() => setShowFullSpecs(!showFullSpecs)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-[#ea580c] hover:border-orange-200 shadow-sm transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>{showFullSpecs ? 'Hide Platform Architecture' : `${t.languageLabel}: ${selectedLanguage.name} • View Dialect Matrix & Specs`}</span>
          </button>
        </div>

        {showFullSpecs && (
          <div className="mt-8 space-y-12 animate-fade-in border-t border-slate-200 pt-8 max-w-7xl mx-auto">
            <LanguageSelectionSection />
            <ArchitectureSection />
            <VisionSection accessibility={accessibility} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CurriculumProgressProvider>
          <AppContent />
        </CurriculumProgressProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}


