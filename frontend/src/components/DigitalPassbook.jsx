import React from 'react';
import { QrCode, Download, Volume2, ShieldCheck, Award, MapPin, CheckCircle, Sparkles, Printer, User, Phone, Landmark } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

const DigitalPassbook = ({ beneficiaryProfile, selectedCourse, grantApplication, selectedLanguage = 'en' }) => {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const profile = beneficiaryProfile || {
    id: "PMAJAY-SC-2026-8841",
    name: "Jeeva",
    location: "Tharamangalam, Salem, Tamil Nadu",
    district: "Salem",
    education: "10th Standard",
    familyOccupation: "Handloom Weaving & Textiles",
    preference: "Self-Employment with PM-AJAY Toolkit Grant",
    assignedConsultant: "Mr. R. Ramesh",
    grantEligible: "₹50,000 Handloom Modernization Grant under PM-AJAY GIA"
  };

  const course = selectedCourse || {
    id: "AMH/Q1947",
    role: "Master Weaver & Handloom Stylist",
    level: 4,
    durationHours: 350,
    giaToolkitGrant: "₹50,000 Handloom Modernization Grant under PM-AJAY GIA",
    avgSalary: "₹18,000 - ₹28,000 / month"
  };

  const playVoiceSummary = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const grantStatusText = grantApplication
      ? `MoSJE Sanction ID: ${grantApplication.appId}. Grant Status: Approved 50,000 Rupees Capital Subsidy.`
      : `Sanctioned GIA Toolkit Grant: ${course.giaToolkitGrant}.`;

    const textMap = {
      ta: `வணக்கம் ${profile.name}! உங்கள் PM-AJAY டிஜிட்டல் பாஸ்புக் தயார். ஐடி: ${profile.id}. தேர்ந்தெடுக்கப்பட்ட NSQF பயிற்சி: ${course.role}. ${grantApplication ? `அனுமதிக்கப்பட்ட மானிய எண்: ${grantApplication.appId}. 50,000 ரூபாய் இலவச டூல்கிட் மானியம் உறுதி செய்யப்பட்டது.` : `உங்களுக்கு அனுமதிக்கப்பட்ட GIA மானியம்: ${course.giaToolkitGrant}.`} உங்கள் நிதி ஆலோசகர்: ${grantApplication?.assignedFc || profile.assignedConsultant}.`,
      en: `Hello ${profile.name}! Your PM-AJAY Digital Livelihood Passbook is generated. ID: ${profile.id}. Selected NSQF training: ${course.role}. ${grantStatusText} Assigned Financial Consultant: ${grantApplication?.assignedFc || profile.assignedConsultant}.`,
      hi: `नमस्ते ${profile.name}! आपका पीएम-अजय डिजिटल पासबुक तैयार है। आईडी: ${profile.id}। अनुशंसित प्रशिक्षण: ${course.role}। ${grantApplication ? `स्वीकृत अनुदान संख्या: ${grantApplication.appId}। 50,000 रुपये टूलकिट स्वीकृत।` : `स्वीकृत अनुदान: ${course.giaToolkitGrant}।`} आपके वित्तीय सलाहकार: ${grantApplication?.assignedFc || profile.assignedConsultant}।`,
      te: `నమస్కారం ${profile.name}! మీ పీఎం-అజయ్ డిజిటల్ పాస్‌బుక్ సిద్ధంగా ఉంది. ఐడీ: ${profile.id}. ఎంచుకున్న శిక్షణ: ${course.role}. ${grantApplication ? `మంజూరు సంఖ్య: ${grantApplication.appId}. 50,000 రూపాయల టూల్‌కిట్ గ్రాంట్ ఆమోదించబడింది.` : `మంజూరు చేయబడిన గ్రాంట్: ${course.giaToolkitGrant}.`} మీ ఆర్థిక సలహాదారు: ${grantApplication?.assignedFc || profile.assignedConsultant}.`
    };

    const utterance = new SpeechSynthesisUtterance(textMap[selectedLanguage] || textMap.en);
    utterance.lang = selectedLanguage === 'ta' ? 'ta-IN' : selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'te' ? 'te-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="bg-[#FAF9F6] py-10 px-6 lg:px-16 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Passbook Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#E6F4F0] text-[#087F5B] text-xs font-bold px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.passbookBadge}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#24302C] font-['Outfit']">
            {t.passbookTitle}
          </h2>
          <p className="text-xs text-[#5C6E67]">
            {t.passbookSubtitle}
          </p>
        </div>

        {/* The Digital Card Container */}
        <div className="bg-white rounded-3xl border-2 border-[#087F5B] shadow-2xl overflow-hidden p-8 space-y-6 relative print:border-black print:shadow-none">
          
          {/* Top Card Header */}
          <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#087F5B] text-white flex items-center justify-center font-black text-2xl shadow-md">
                🇮🇳
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-[#087F5B] uppercase tracking-wider block">
                  {t.cardMinistry}
                </span>
                <h3 className="text-lg font-extrabold text-[#24302C] font-['Outfit']">
                  {t.cardTitle}
                </h3>
              </div>
            </div>
            
            <span className="text-[11px] font-extrabold bg-[#E6F4F0] text-[#087F5B] px-3 py-1.5 rounded-full border border-[#087F5B]/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.verifiedBadge}</span>
            </span>
          </div>

          {/* Card Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Beneficiary Details */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-[#5C6E67] uppercase">{t.labelName}</span>
                <p className="text-2xl font-black text-[#24302C] font-['Outfit']">{profile.name}</p>
                <p className="text-xs text-[#087F5B] font-mono font-bold">ID: {profile.id || 'PMAJAY-SC-2026-8841'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">{t.labelLocation}</span>
                  <p className="font-bold text-[#24302C]">{profile.location || 'Salem, Tamil Nadu'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">{t.labelEdu}</span>
                  <p className="font-bold text-[#24302C]">{profile.education}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">{t.labelTrade}</span>
                  <p className="font-bold text-[#24302C]">{profile.familyOccupation}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">{t.labelFc}</span>
                  <p className="font-bold text-[#087F5B]">{profile.assignedConsultant || 'Mr. R. Ramesh'}</p>
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#FAF9F6] rounded-2xl border border-[#E2DBD0] space-y-2">
              <div className="bg-white p-3 rounded-xl shadow-inner border border-[#E2DBD0]">
                {/* Visual government-style QR representation */}
                <div className="w-24 h-24 bg-white grid grid-cols-6 grid-rows-6 gap-0.5 p-1 border-2 border-[#24302C]">
                  <div className="col-span-2 row-span-2 bg-[#24302C] rounded-sm"></div>
                  <div className="col-span-2 row-span-1 bg-[#24302C]"></div>
                  <div className="col-span-2 row-span-2 bg-[#24302C] rounded-sm"></div>
                  <div className="col-span-1 row-span-2 bg-[#24302C]"></div>
                  <div className="col-span-2 row-span-2 bg-[#087F5B]"></div>
                  <div className="col-span-1 row-span-2 bg-[#24302C]"></div>
                  <div className="col-span-2 row-span-2 bg-[#24302C] rounded-sm"></div>
                  <div className="col-span-2 row-span-2 bg-[#24302C] rounded-sm"></div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#5C6E67] font-bold">{t.scanVerify}</span>
            </div>

          </div>

          {/* Approved Training & Subsidy Details Banner */}
          <div className="bg-[#E6F4F0] p-4 rounded-2xl border border-[#087F5B]/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#087F5B]">{t.labelPathway}</span>
              <span className="font-mono font-bold text-[#087F5B]">{course.id} ({t.level} {course.level})</span>
            </div>
            <p className="text-sm font-extrabold text-[#24302C]">{course.role}</p>
            
            <div className="pt-2 border-t border-[#087F5B]/20 flex items-center justify-between text-xs">
              <span className="font-bold text-[#24302C]">{t.labelGrant}</span>
              <span className="font-black text-[#087F5B]">{course.giaToolkitGrant}</span>
            </div>
          </div>

          {/* Official MoSJE GIA Grant Sanction Certificate Box */}
          {grantApplication && (
            <div className="bg-[#FFFDF9] p-5 rounded-2xl border-2 border-amber-300 shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#087F5B] text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-xs">
                MoSJE Sanctioned
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold text-lg">
                  📜
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                    PM-AJAY GIA Capital Subsidy Certificate
                  </span>
                  <p className="text-xs font-mono font-bold text-[#087F5B]">
                    Sanction Ref: {grantApplication.appId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-amber-200/80">
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">Approved Grant:</span>
                  <p className="font-black text-[#087F5B]">{grantApplication.grantAmount} (100% Free)</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">Loan Linkage:</span>
                  <p className="font-bold text-[#24302C]">{grantApplication.loanType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">Assigned Consultant:</span>
                  <p className="font-bold text-[#087F5B]">{grantApplication.assignedFc}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">Consultant Phone:</span>
                  <p className="font-bold font-mono text-[#24302C]">{grantApplication.fcPhone}</p>
                </div>
              </div>

              {grantApplication.toolkitItems && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#5C6E67] uppercase">Sanctioned Toolkit Items:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {grantApplication.toolkitItems.map((item, i) => (
                      <span key={i} className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg font-medium">
                        ✓ {item.name.split('&')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons: Voice Playback & Print / Download */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 print:hidden">
            <button
              onClick={playVoiceSummary}
              className="w-full sm:w-1/2 bg-[#24302C] hover:bg-[#087F5B] text-white py-3 px-4 rounded-full text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <Volume2 className="w-4 h-4 text-[#E98B73] group-hover:scale-110 transition-transform" />
              <span>{t.listenAudioBtn}</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:w-1/2 bg-white hover:bg-black/5 text-[#24302C] border border-[#E2DBD0] py-3 px-4 rounded-full text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#087F5B]" />
              <span>{t.printPassbookBtn}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default DigitalPassbook;
