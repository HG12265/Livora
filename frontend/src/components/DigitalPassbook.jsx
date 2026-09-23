import React from 'react';
import { QrCode, Download, Volume2, ShieldCheck, Award, MapPin, CheckCircle, Sparkles } from 'lucide-react';

const DigitalPassbook = ({ beneficiaryProfile, selectedCourse, selectedLanguage }) => {
  const profile = beneficiaryProfile || {
    name: "Gowtham",
    id: "PMAJAY-SC-2026-8841",
    location: "Salem, Tamil Nadu",
    education: "12th Standard",
    familyOccupation: "Agriculture & Organic Farming"
  };

  const course = selectedCourse || {
    id: "AGR/Q4801",
    role: "Organic Agri-Input Producer",
    level: 4,
    giaToolkitGrant: "₹35,000 Bio-Unit Setup Support under PM-AJAY GIA"
  };

  const playVoiceSummary = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const text = selectedLanguage === 'ta'
      ? `வணக்கம் ${profile.name}! உங்கள் PM-AJAY டிஜிட்டல் பாஸ்புக் தயார். தேர்ந்தெடுக்கப்பட்ட படிப்பு: ${course.role}. உங்களுக்கு ஒதுக்கீடு செய்யப்பட்ட GIA மானியம்: ${course.giaToolkitGrant}.`
      : `Hello ${profile.name}! Your PM-AJAY Digital Livelihood Passbook is generated. Selected training: ${course.role}. Matched GIA Grant: ${course.giaToolkitGrant}.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === 'ta' ? 'ta-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="bg-[#FAF9F6] py-12 px-6 lg:px-16 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Passbook Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#E6F4F0] text-[#087F5B] text-xs font-bold px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 4: Digital Livelihood Passbook</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#24302C] font-['Outfit']">
            PM-AJAY Beneficiary Voice-QR Card
          </h2>
          <p className="text-xs text-[#5C6E67]">
            Official Government of India Livelihood & Skilling Identification Card under PM-AJAY GIA Component.
          </p>
        </div>

        {/* The Digital Card Container */}
        <div className="bg-white rounded-3xl border-2 border-[#087F5B] shadow-2xl overflow-hidden p-8 space-y-6 relative">
          
          {/* Top Card Header */}
          <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#087F5B] text-white flex items-center justify-center font-black text-xl shadow-md">
                🇮🇳
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-[#087F5B] uppercase tracking-wider">Ministry of Social Justice & Empowerment</span>
                <h3 className="text-lg font-extrabold text-[#24302C] font-['Outfit']">PM-AJAY GIA Livelihood Passbook</h3>
              </div>
            </div>
            <span className="text-xs font-extrabold bg-[#E6F4F0] text-[#087F5B] px-3 py-1 rounded-full border border-[#087F5B]/30">
              VERIFIED SC BENEFICIARY
            </span>
          </div>

          {/* Card Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Beneficiary Details */}
            <div className="md:col-span-8 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-[#5C6E67] uppercase">Beneficiary Name</span>
                <p className="text-xl font-extrabold text-[#24302C]">{profile.name}</p>
                <p className="text-xs text-[#087F5B] font-mono font-bold">ID: PMAJAY-SC-2026-8841</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#5C6E67] uppercase">Location</span>
                  <p className="font-bold text-[#24302C]">{profile.location}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#5C6E67] uppercase">Education</span>
                  <p className="font-bold text-[#24302C]">{profile.education}</p>
                </div>
              </div>

              <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E2DBD0] text-xs space-y-1">
                <span className="text-[10px] font-extrabold text-[#087F5B] uppercase">Mapped Training & Grant</span>
                <p className="font-bold text-[#24302C]">{course.role} (Level {course.level})</p>
                <p className="text-[11px] text-[#E98B73] font-semibold">{course.giaToolkitGrant}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#FAF9F6] rounded-2xl border border-[#E2DBD0] text-center">
              <div className="w-28 h-28 bg-white border-2 border-[#24302C] p-2 rounded-xl flex items-center justify-center shadow-inner">
                <QrCode className="w-24 h-24 text-[#24302C]" />
              </div>
              <span className="text-[10px] font-bold text-[#5C6E67] mt-2">Scan for Voice Verification</span>
            </div>

          </div>

          {/* Card Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E2DBD0] pt-5">
            <button
              onClick={playVoiceSummary}
              className="flex items-center gap-2 bg-[#E6F4F0] hover:bg-[#087F5B] hover:text-white text-[#087F5B] px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
            >
              <Volume2 className="w-4 h-4" />
              <span>Play Audio Passbook Summary</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-[#087F5B] hover:bg-[#066749] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download / Print Card</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default DigitalPassbook;
