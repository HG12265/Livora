import React, { useState } from 'react';
import { Leaf, Globe, ChevronDown, Shield, Mic, Phone, MessageSquare, Award, Landmark, QrCode, Users, Home as HomeIcon } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

const Navbar = ({ currentView, setCurrentView, selectedLanguage, setSelectedLanguage, onOpenVoiceModal }) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', native: 'Tamil', flag: '🇮🇳' },
    { code: 'hi', name: 'हिन्दी', native: 'Hindi', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', native: 'Telugu', flag: '🇮🇳' }
  ];

  const navItems = [
    { id: 'home', label: t.navHome, icon: HomeIcon },
    { id: 'voice', label: t.navVoice, icon: Mic, highlight: true },
    { id: 'nsqf', label: t.navNsqf, icon: Award },
    { id: 'schemes', label: t.navSchemes, icon: Landmark },
    { id: 'passbook', label: t.navPassbook, icon: QrCode },
    { id: 'ground', label: t.navGround, icon: Users },
    { id: 'admin', label: t.navAdmin, icon: Shield, badge: t.govBadge }
  ];

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm">
      {/* Main Navbar */}
      <nav className="w-full bg-white/95 backdrop-blur-md border-b border-[#E2DBD0] px-4 lg:px-10 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentView('home')} 
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#087F5B] flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md">
              <Leaf className="w-5 h-5 text-white fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#087F5B] font-['Outfit']">Livora</span>
                <span className="text-[9px] bg-[#E6F4F0] text-[#087F5B] font-extrabold px-1.5 py-0.5 rounded-full border border-[#087F5B]/30">
                  PM-AJAY
                </span>
              </div>
              <p className="text-[9px] text-[#5C6E67] font-medium tracking-tight hidden xl:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Navigation Links - Smooth horizontal scrolling without clipping */}
          <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-1.5 w-max mx-auto px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'voice') {
                        onOpenVoiceModal();
                      } else {
                        setCurrentView(item.id);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap flex-shrink-0 text-xs font-bold ${
                      isActive 
                        ? 'bg-[#087F5B] text-white shadow-sm ring-1 ring-[#087F5B]' 
                        : item.highlight
                        ? 'bg-[#E6F4F0] text-[#087F5B] hover:bg-[#d8efe8]'
                        : 'hover:bg-black/5 text-[#24302C]'
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-[#087F5B]' : 'text-[#087F5B]'}`} />}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ml-0.5 ${isActive ? 'bg-white text-[#087F5B]' : 'bg-[#E98B73] text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Actions: Language Switcher & Quick Voice Trigger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-bold bg-[#FAF9F6] border border-[#E2DBD0] hover:border-[#087F5B] text-[#24302C] px-3 py-1.5 rounded-full shadow-sm transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-[#087F5B]" />
                <span>{languages.find(l => l.code === selectedLanguage)?.name || 'English'}</span>
                <ChevronDown className="w-3 h-3 text-[#5C6E67]" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E2DBD0] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[10px] font-extrabold text-[#5C6E67] uppercase tracking-wider border-b border-[#E2DBD0]/60">
                    Language / மொழி
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#E6F4F0] hover:text-[#087F5B] transition-colors ${
                        selectedLanguage === lang.code ? 'font-bold text-[#087F5B] bg-[#E6F4F0]/50' : 'text-[#24302C]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{lang.name}</span>
                        <span className="text-[10px] text-[#5C6E67]">({lang.native})</span>
                      </div>
                      <span className="text-xs">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Voice Assistant Button */}
            <button
              onClick={onOpenVoiceModal}
              className="bg-[#087F5B] hover:bg-[#066749] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 group flex-shrink-0"
            >
              <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>{t.startVoiceBtn}</span>
            </button>

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
