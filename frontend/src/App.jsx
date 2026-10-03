import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import VoiceOnboarding from './components/VoiceOnboarding';
import NsqfRecommendations from './components/NsqfRecommendations';
import LivelihoodSchemes from './components/LivelihoodSchemes';
import DigitalPassbook from './components/DigitalPassbook';
import GroundHub from './components/GroundHub';
import AdminDashboard from './components/AdminDashboard';
import IvrSimulator from './components/IvrSimulator';
import WhatsappSimulator from './components/WhatsappSimulator';
import { PhoneCall, MessageSquare, ArrowRight, Sparkles, Award, ShieldCheck, Landmark } from 'lucide-react';
import { TRANSLATIONS } from './data/translations';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isIvrModalOpen, setIsIvrModalOpen] = useState(false);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);

  const [beneficiaryProfile, setBeneficiaryProfile] = useState(null);
  const [customMatchedCourses, setCustomMatchedCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const handleProfileCreated = (profileData, matchedCourses) => {
    if (profileData) setBeneficiaryProfile(profileData);
    if (matchedCourses && matchedCourses.length > 0) {
      setCustomMatchedCourses(matchedCourses);
      setSelectedCourse(matchedCourses[0]);
    }
    setCurrentView('nsqf');
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setCurrentView('schemes');
  };

  const handleHowItWorksClick = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartStep = (stepNum) => {
    if (stepNum === 1) setIsVoiceModalOpen(true);
    if (stepNum === 2) setCurrentView('nsqf');
    if (stepNum === 3) setCurrentView('schemes');
    if (stepNum === 4) setCurrentView('passbook');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-['Plus_Jakarta_Sans'] text-[#24302C] selection:bg-[#E6F4F0] selection:text-[#087F5B]">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />

      {/* Main View Router */}
      <main>
        {currentView === 'home' && (
          <>
            <HeroSection
              onStartSpeaking={() => setIsVoiceModalOpen(true)}
              onHowItWorksClick={handleHowItWorksClick}
              selectedLanguage={selectedLanguage}
            />

            {/* Quick Highlights Callout Bar */}
            <section className="bg-white border-y border-[#E2DBD0] py-8 px-6 lg:px-16">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
                <div 
                  onClick={() => setIsVoiceModalOpen(true)} 
                  className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E2DBD0] hover:border-[#087F5B] cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center gap-2 text-[#087F5B] font-extrabold">
                    <Sparkles className="w-4 h-4" />
                    <span>{t.quickVoiceTitle}</span>
                  </div>
                  <p className="text-[#5C6E67]">
                    {t.quickVoiceDesc}
                  </p>
                </div>

                <div 
                  onClick={() => setCurrentView('nsqf')} 
                  className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E2DBD0] hover:border-[#087F5B] cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center gap-2 text-[#087F5B] font-extrabold">
                    <Award className="w-4 h-4" />
                    <span>{t.quickNsqfTitle}</span>
                  </div>
                  <p className="text-[#5C6E67]">
                    {t.quickNsqfDesc}
                  </p>
                </div>

                <div 
                  onClick={() => setCurrentView('schemes')} 
                  className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E2DBD0] hover:border-[#087F5B] cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center gap-2 text-[#087F5B] font-extrabold">
                    <Landmark className="w-4 h-4" />
                    <span>{t.quickGrantsTitle}</span>
                  </div>
                  <p className="text-[#5C6E67]">
                    {t.quickGrantsDesc}
                  </p>
                </div>

                <div 
                  onClick={() => setCurrentView('admin')} 
                  className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E2DBD0] hover:border-[#087F5B] cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center gap-2 text-[#087F5B] font-extrabold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.quickAdminTitle}</span>
                  </div>
                  <p className="text-[#5C6E67]">
                    {t.quickAdminDesc}
                  </p>
                </div>
              </div>
            </section>

            <HowItWorks 
              onStartStep={handleStartStep} 
              selectedLanguage={selectedLanguage}
            />
          </>
        )}

        {currentView === 'nsqf' && (
          <NsqfRecommendations
            beneficiaryProfile={beneficiaryProfile}
            customMatchedCourses={customMatchedCourses}
            onSelectCourse={handleSelectCourse}
            selectedLanguage={selectedLanguage}
          />
        )}

        {currentView === 'schemes' && (
          <LivelihoodSchemes
            selectedCourse={selectedCourse}
            beneficiaryProfile={beneficiaryProfile}
            onProceedToPassbook={() => setCurrentView('passbook')}
            selectedLanguage={selectedLanguage}
          />
        )}

        {currentView === 'passbook' && (
          <DigitalPassbook
            beneficiaryProfile={beneficiaryProfile}
            selectedCourse={selectedCourse}
            selectedLanguage={selectedLanguage}
          />
        )}

        {currentView === 'ground' && (
          <GroundHub 
            selectedLanguage={selectedLanguage}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard 
            selectedLanguage={selectedLanguage}
          />
        )}
      </main>

      {/* Floating Low-Tech Simulators Buttons (Feature Phone & WhatsApp Voice Notes) */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col sm:flex-row items-center gap-3 print:hidden">
        <button
          onClick={() => setIsIvrModalOpen(true)}
          className="bg-[#1C2826] hover:bg-[#087F5B] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 transition-all hover:scale-105 border border-white/20"
          title="Simulate IVR Toll-Free Phone Call (*1800-PMAJAY#)"
        >
          <PhoneCall className="w-4 h-4 text-[#E98B73]" />
          <span>{t.ivrBtn}</span>
        </button>

        <button
          onClick={() => setIsWhatsappModalOpen(true)}
          className="bg-[#075E54] hover:bg-[#128C7E] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 transition-all hover:scale-105 border border-white/20"
          title="Simulate WhatsApp Voice Note Interface"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span>{t.waBtn}</span>
        </button>
      </div>

      {/* Voice Onboarding Modal */}
      <VoiceOnboarding
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onProfileCreated={handleProfileCreated}
        selectedLanguage={selectedLanguage}
      />

      {/* IVR Phone Call Simulator Modal */}
      <IvrSimulator
        isOpen={isIvrModalOpen}
        onClose={() => setIsIvrModalOpen(false)}
        selectedLanguage={selectedLanguage}
      />

      {/* WhatsApp Voice Note Simulator Modal */}
      <WhatsappSimulator
        isOpen={isWhatsappModalOpen}
        onClose={() => setIsWhatsappModalOpen(false)}
        selectedLanguage={selectedLanguage}
      />

      {/* Official Government Footer */}
      <footer className="bg-white border-t border-[#E2DBD0] py-8 px-6 lg:px-16 text-xs text-[#5C6E67] space-y-3 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-extrabold text-[#087F5B] font-['Outfit'] text-sm">
              {t.footerTitle}
            </p>
            <p className="text-[11px]">
              {t.footerSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="bg-[#E6F4F0] text-[#087F5B] px-3 py-1 rounded-full">{t.sihBadge}</span>
            <span>{t.footerStatus}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
