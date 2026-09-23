import React, { useState } from 'react';
import { Leaf, Globe, ChevronDown, User, Shield, Phone, MessageSquare } from 'lucide-react';

const Navbar = ({ currentView, setCurrentView, selectedLanguage, setSelectedLanguage, onOpenVoiceModal }) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' }
  ];

  return (
    <nav className="w-full bg-[#FAF9F6] border-b border-[#E2DBD0] sticky top-0 z-50 px-6 lg:px-16 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#E6F4F0] flex items-center justify-center text-[#087F5B] group-hover:scale-105 transition-transform shadow-sm">
            <div className="relative">
              <Leaf className="w-6 h-6 text-[#087F5B] fill-[#087F5B]/20" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E98B73]"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-[#087F5B] font-['Outfit']">Livora</span>
              <span className="text-[10px] bg-[#E6F4F0] text-[#087F5B] font-bold px-2 py-0.5 rounded-full border border-[#087F5B]/20">PM-AJAY AI</span>
            </div>
            <p className="text-[10px] text-[#5C6E67] font-medium tracking-tight hidden sm:block">
              Mapping Skills. Connecting Opportunities. Enabling Livelihoods.
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#24302C]">
          <button 
            onClick={() => setCurrentView('home')}
            className={`transition-colors py-1 relative ${currentView === 'home' ? 'text-[#087F5B] font-bold border-b-2 border-[#087F5B]' : 'hover:text-[#087F5B]'}`}
          >
            Home
          </button>
          
          <button 
            onClick={() => setCurrentView('nsqf')}
            className={`transition-colors py-1 relative ${currentView === 'nsqf' ? 'text-[#087F5B] font-bold border-b-2 border-[#087F5B]' : 'hover:text-[#087F5B]'}`}
          >
            NSQF Skilling
          </button>

          <button 
            onClick={() => setCurrentView('schemes')}
            className={`transition-colors py-1 relative ${currentView === 'schemes' ? 'text-[#087F5B] font-bold border-b-2 border-[#087F5B]' : 'hover:text-[#087F5B]'}`}
          >
            PM-AJAY Grants
          </button>

          <button 
            onClick={() => setCurrentView('passbook')}
            className={`transition-colors py-1 relative ${currentView === 'passbook' ? 'text-[#087F5B] font-bold border-b-2 border-[#087F5B]' : 'hover:text-[#087F5B]'}`}
          >
            Digital Passbook
          </button>

          <button 
            onClick={() => setCurrentView('admin')}
            className={`transition-colors py-1 flex items-center gap-1 relative ${currentView === 'admin' ? 'text-[#087F5B] font-bold border-b-2 border-[#087F5B]' : 'hover:text-[#087F5B]'}`}
          >
            <Shield className="w-3.5 h-3.5 text-[#087F5B]" />
            MoSJE Admin
          </button>
        </div>

        {/* Right Actions: Language Dropdown & Login */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 text-xs font-semibold bg-white border border-[#E2DBD0] hover:border-[#087F5B] text-[#24302C] px-3 py-2 rounded-full shadow-sm transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-[#087F5B]" />
              <span>{languages.find(l => l.code === selectedLanguage)?.name || 'English'}</span>
              <ChevronDown className="w-3 h-3 text-[#5C6E67]" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2DBD0] rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1 text-[11px] font-bold text-[#5C6E67] uppercase tracking-wider">
                  Select Regional Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#E6F4F0] ${selectedLanguage === lang.code ? 'text-[#087F5B] font-bold bg-[#E6F4F0]/60' : 'text-[#24302C]'}`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-sm">{lang.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login Button */}
          <button 
            onClick={onOpenVoiceModal}
            className="flex items-center gap-2 text-xs font-bold bg-[#087F5B] hover:bg-[#066749] text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
