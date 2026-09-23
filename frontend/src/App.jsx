import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import VoiceOnboarding from './components/VoiceOnboarding';
import NsqfRecommendations from './components/NsqfRecommendations';
import LivelihoodSchemes from './components/LivelihoodSchemes';
import DigitalPassbook from './components/DigitalPassbook';
import AdminDashboard from './components/AdminDashboard';
import IvrSimulator from './components/IvrSimulator';
import WhatsappSimulator from './components/WhatsappSimulator';
import { PhoneCall, MessageSquare } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isIvrModalOpen, setIsIvrModalOpen] = useState(false);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);

  const [beneficiaryProfile, setBeneficiaryProfile] = useState({
    name: "Gowtham",
    location: "Salem, Tamil Nadu",
    education: "12th Standard",
    familyOccupation: "Agriculture & Organic Farming",
    currentSkills: "Agricultural operations & crop management",
    mobility: "Local",
    preference: "Self-Employment"
  });

  const [customMatchedCourses, setCustomMatchedCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleProfileCreated = (profileData, matchedCourses) => {
    if (profileData) setBeneficiaryProfile(profileData);
    if (matchedCourses) setCustomMatchedCourses(matchedCourses);
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
            />
            <HowItWorks onStartStep={handleStartStep} />
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
            onProceedToPassbook={() => setCurrentView('passbook')}
          />
        )}

        {currentView === 'passbook' && (
          <DigitalPassbook
            beneficiaryProfile={beneficiaryProfile}
            selectedCourse={selectedCourse}
            selectedLanguage={selectedLanguage}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Floating Low-Tech Simulators Buttons */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => setIsIvrModalOpen(true)}
          className="bg-[#24302C] hover:bg-[#087F5B] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 transition-all hover:scale-105 border border-white/20"
          title="Simulate IVR Toll-Free Phone Call (*1800-PMAJAY#)"
        >
          <PhoneCall className="w-4 h-4 text-[#E98B73]" />
          <span>IVR Helpline (*1800#)</span>
        </button>

        <button
          onClick={() => setIsWhatsappModalOpen(true)}
          className="bg-[#075E54] hover:bg-[#128C7E] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 transition-all hover:scale-105 border border-white/20"
          title="Simulate WhatsApp Voice Note Interface"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span>WhatsApp Voice Bot</span>
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

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2DBD0] py-8 px-6 lg:px-16 text-center text-xs text-[#5C6E67] space-y-2">
        <p className="font-extrabold text-[#087F5B] font-['Outfit']">Livora — PM-AJAY AI-Driven Voice Assistant (PS 26097)</p>
        <p>Ministry of Social Justice & Empowerment (MoSJE) • Smart India Hackathon 2026</p>
      </footer>

    </div>
  );
}

export default App;
