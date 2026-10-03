import React, { useState } from 'react';
import { Mic, ArrowRight, Play, Sparkles, Volume2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import heroBeneficiaryImg from '../assets/hero_beneficiary.jpg';
import { TRANSLATIONS } from '../data/translations';

const HeroSection = ({ onStartSpeaking, onHowItWorksClick, selectedLanguage = 'en' }) => {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlaySample = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(t.heroSpeechBubble);
    const langMap = { ta: 'ta-IN', en: 'en-IN', hi: 'hi-IN', te: 'te-IN' };
    utterance.lang = langMap[selectedLanguage] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] pt-6 pb-14 lg:pt-10 lg:pb-20 px-4 sm:px-6 lg:px-12">
      
      {/* Subtle background ambient gradients */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#E6F4F0]/60 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#F4EDE2]/70 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Headline & Action */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E6F4F0] border border-[#087F5B]/30 text-[#087F5B] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#087F5B]" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Headline with balanced Indic typography */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#24302C] tracking-tight leading-[1.2]">
            <span>{t.heroTitle1}</span>{' '}
            <span>{t.heroTitle2}</span><br />
            <span className="text-[#087F5B]">{t.heroTitle3}</span>
          </h1>

          {/* Subheadline Description */}
          <p className="text-sm sm:text-base text-[#5C6E67] font-normal leading-relaxed max-w-xl">
            {t.heroDesc}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onStartSpeaking}
              className="flex items-center gap-2.5 bg-[#087F5B] hover:bg-[#066749] text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group active:scale-95"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Mic className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
              </div>
              <span>{t.heroStartBtn}</span>
              <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onHowItWorksClick}
              className="flex items-center gap-2 bg-white border border-[#E2DBD0] hover:border-[#087F5B] text-[#087F5B] px-6 py-3.5 rounded-full text-sm font-bold hover:bg-[#E6F4F0]/40 transition-all shadow-sm active:scale-95"
            >
              <div className="w-6 h-6 rounded-full bg-[#E6F4F0] flex items-center justify-center text-[#087F5B]">
                <Play className="w-3 h-3 fill-[#087F5B]" />
              </div>
              <span>{t.heroHowBtn}</span>
            </button>
          </div>

          {/* Beneficiary Empowerment Note */}
          <div className="flex items-center gap-2.5 pt-2 text-xs text-[#5C6E67] font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#087F5B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#087F5B]"></span>
            </span>
            <span>{t.heroLangSupport}</span>
          </div>

        </div>

        {/* Right Column: Sleek Framed Card with Live Voice Widget */}
        <div className="lg:col-span-6 flex justify-center">
          
          <div className="w-full max-w-md bg-white p-3.5 rounded-3xl border border-[#E2DBD0] shadow-xl space-y-3 relative">
            
            {/* Beneficiary Photo Container */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F4EDE2] border border-[#E2DBD0]">
              <img
                src={heroBeneficiaryImg}
                alt="Beneficiary interacting with Voice Assistant"
                className="w-full h-full object-cover object-center"
              />
              
              {/* Floating Verified Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-[#087F5B] flex items-center gap-1.5 shadow-md border border-[#087F5B]/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#087F5B]" />
                <span>MoSJE PM-AJAY GIA</span>
              </div>
            </div>

            {/* Integrated Interactive Voice Audio Bar */}
            <div className="bg-[#FAF9F6] border border-[#E2DBD0] rounded-2xl p-3.5 space-y-2.5 shadow-inner">
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#E98B73] uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E98B73] animate-ping"></span>
                  {t.heroSpeechLiveBadge}
                </span>

                <button
                  onClick={handlePlaySample}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                    isPlayingAudio 
                      ? 'bg-[#087F5B] text-white shadow-sm' 
                      : 'bg-white border border-[#E2DBD0] text-[#087F5B] hover:bg-[#E6F4F0]'
                  }`}
                  title="Click to hear voice sample"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'Playing...' : 'Tap to Listen'}</span>
                </button>
              </div>

              {/* Sample Spoken text with Animated Waveform */}
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#E2DBD0]">
                {/* Audio Waves */}
                <div className="flex items-center gap-0.5 h-5 flex-shrink-0">
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                </div>

                <p className="text-xs font-semibold text-[#24302C] leading-snug truncate">
                  "{t.heroSpeechBubble}"
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
