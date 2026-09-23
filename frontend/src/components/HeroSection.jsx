import React from 'react';
import { Mic, ArrowRight, Play, Sparkles, Volume2 } from 'lucide-react';
import heroBeneficiaryImg from '../assets/hero_beneficiary.jpg';

const HeroSection = ({ onStartSpeaking, onHowItWorksClick }) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] pt-8 pb-16 lg:pt-12 lg:pb-24 px-6 lg:px-16">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4EDE2] rounded-full blur-3xl opacity-60 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#E6F4F0] rounded-full blur-3xl opacity-50 -z-10"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Text Content */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E6F4F0] border border-[#087F5B]/20 text-[#087F5B] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#087F5B]" />
            <span>AI-Powered Voice Assistant</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#24302C] tracking-tight leading-[1.1] font-['Outfit']">
            Your Skills.<br />
            Your Path.<br />
            <span className="text-[#087F5B]">Your Future.</span>
          </h1>

          {/* Subheadline Description */}
          <p className="text-base sm:text-lg text-[#5C6E67] font-normal max-w-xl leading-relaxed">
            A simple voice-based platform that helps you discover skill training and livelihood opportunities, matched to your needs and location.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={onStartSpeaking}
              className="flex items-center gap-3 bg-[#087F5B] hover:bg-[#066749] text-white px-8 py-4 rounded-full text-base font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Mic className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </div>
              <span>Start Speaking</span>
              <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onHowItWorksClick}
              className="flex items-center gap-2.5 bg-transparent border-2 border-[#E2DBD0] hover:border-[#087F5B] text-[#087F5B] px-7 py-3.5 rounded-full text-base font-bold hover:bg-[#E6F4F0]/50 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-[#E6F4F0] flex items-center justify-center text-[#087F5B]">
                <Play className="w-3.5 h-3.5 fill-[#087F5B]" />
              </div>
              <span>How It Works</span>
            </button>
          </div>

          {/* Beneficiary Empowerment Note */}
          <div className="flex items-center gap-3 pt-2 text-xs text-[#5C6E67] font-semibold">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#087F5B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#087F5B]"></span>
            </span>
            <span>Supports Tamil, Hindi, Telugu, English & Regional Dialects</span>
          </div>

        </div>

        {/* Right Visual Stack - Indian Woman Beneficiary & Floating Mic */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          
          {/* Organic Organic Shape Background Leaf Pill */}
          <div className="relative w-full max-w-lg aspect-square">
            
            {/* Organic Sand backdrop */}
            <div className="absolute inset-0 bg-[#F4EDE2] rounded-[140px_40px_160px_40px] transform rotate-3 scale-95 opacity-90"></div>
            
            {/* Organic Emerald Accent Circle */}
            <div className="absolute top-6 left-6 w-32 h-32 bg-[#087F5B]/10 rounded-full blur-xl"></div>

            {/* Main Beneficiary Image Mask */}
            <div className="relative w-full h-full rounded-[120px_30px_140px_30px] overflow-hidden border-4 border-white shadow-xl">
              <img
                src={heroBeneficiaryImg}
                alt="Beneficiary interacting with Voice Assistant"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Floating Audio Speech Bubble (Top Right) */}
            <div className="absolute -top-4 right-0 lg:-right-4 bg-white/95 backdrop-blur-md border border-[#E2DBD0] rounded-2xl shadow-xl p-4 flex items-center gap-3 max-w-xs animate-bounce-slow">
              <div className="w-10 h-10 rounded-full bg-[#E6F4F0] flex items-center justify-center text-[#087F5B] shrink-0">
                {/* Audio Wave animation */}
                <div className="flex items-center gap-0.5 h-4">
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-[#24302C]">Voice Assistant Active</p>
                <p className="text-[11px] text-[#5C6E67] font-medium leading-tight">
                  "Tell me about your skills, interests and goals..."
                </p>
              </div>
            </div>

            {/* Interactive Microphone Pulse Button (Right Side Ripple) */}
            <div className="absolute bottom-8 -right-4 lg:-right-8">
              <button
                onClick={onStartSpeaking}
                className="w-20 h-20 rounded-full bg-[#087F5B] text-white flex items-center justify-center shadow-2xl animate-mic-pulse hover:scale-110 transition-transform cursor-pointer group"
                title="Click to start speaking"
              >
                <Mic className="w-9 h-9 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
