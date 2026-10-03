import React, { useState, useEffect } from 'react';
import { Award, BookOpen, CheckCircle, Sparkles, AlertCircle, ArrowRight, Volume2, Clock, IndianRupee, MapPin, Wrench, ShieldCheck, ChevronRight } from 'lucide-react';
import { fetchNsqfCourses } from '../services/api';
import { NSQF_QUALIFICATION_PACKS } from '../data/seedData';
import { TRANSLATIONS } from '../data/translations';

const NsqfRecommendations = ({ beneficiaryProfile, customMatchedCourses, onSelectCourse, selectedLanguage = 'en' }) => {
  const [coursesList, setCoursesList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const profile = beneficiaryProfile || {
    name: "Jeeva",
    location: "Tharamangalam, Salem, Tamil Nadu",
    district: "Salem",
    education: "10th Standard",
    familyOccupation: "Handloom Weaving & Textiles",
    currentSkills: "Traditional pit-loom weaving, warp and weft alignment",
    preference: "Self-Employment with PM-AJAY Toolkit Grant",
    mobility: "Local Village Cluster (within 15km)"
  };

  useEffect(() => {
    async function loadCourses() {
      if (customMatchedCourses && customMatchedCourses.length > 0) {
        setCoursesList(customMatchedCourses);
        return;
      }

      const res = await fetchNsqfCourses();
      let initialList = (res && res.courses) ? res.courses : NSQF_QUALIFICATION_PACKS;

      const occLower = (profile.familyOccupation || "").toLowerCase();
      const scored = initialList.map(c => {
        let score = c.matchScore || 78;
        if ((occLower.includes("weave") || occLower.includes("loom") || occLower.includes("handloom")) && c.id.includes("AMH")) {
          score = 96;
        } else if ((occLower.includes("agri") || occLower.includes("farm")) && c.id.includes("AGR")) {
          score = 96;
        } else if ((occLower.includes("solar") || occLower.includes("electric")) && c.id.includes("ELE/Q5901")) {
          score = 92;
        } else if ((occLower.includes("auto") || occLower.includes("bike")) && c.id.includes("AUTO")) {
          score = 91;
        } else if ((occLower.includes("data") || occLower.includes("computer")) && c.id.includes("SSC")) {
          score = 88;
        }
        return { ...c, matchScore: score };
      }).sort((a, b) => b.matchScore - a.matchScore);

      setCoursesList(scored);
    }
    loadCourses();
  }, [customMatchedCourses, beneficiaryProfile]);

  const speakCourseInfo = (course) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const textMap = {
      ta: `வணக்கம் ${profile.name}! உங்களுக்கான சிறந்த NSQF பயிற்சி: ${course.role}. பொருத்தம்: ${course.matchScore} சதவீதம். PM-AJAY உதவி: ${course.giaToolkitGrant}.`,
      en: `Hello ${profile.name}! Recommended NSQF Pathway: ${course.role}. Match Score is ${course.matchScore} percent. PM-AJAY benefit: ${course.giaToolkitGrant}.`,
      hi: `नमस्ते ${profile.name}! अनुशंसित NSQF पाठ्यक्रम: ${course.role}. उपयुक्तता: ${course.matchScore} प्रतिशत। पीएम-अजय अनुदान: ${course.giaToolkitGrant}.`,
      te: `నమస్కారం ${profile.name}! సిఫార్సు చేయబడిన NSQF కోర్సు: ${course.role}. సరిపోలిక: ${course.matchScore} శాతం. పీఎం-అజయ్ గ్రాంట్: ${course.giaToolkitGrant}.`
    };

    const utterance = new SpeechSynthesisUtterance(textMap[selectedLanguage] || textMap.en);
    utterance.lang = selectedLanguage === 'ta' ? 'ta-IN' : selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'te' ? 'te-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const filteredCourses = coursesList.filter(course => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'self') return (course.giaToolkitGrant || "").includes("Grant") || (course.giaToolkitGrant || "").includes("Support");
    if (selectedFilter === 'level4') return course.level === 4;
    return true;
  });

  return (
    <section className="bg-[#FAF9F6] py-10 px-6 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#E2DBD0] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#E6F4F0] text-[#087F5B] text-xs font-bold px-3 py-1 rounded-full">
              <Award className="w-3.5 h-3.5" />
              <span>{t.nsqfBadge}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#24302C] font-['Outfit']">
              {t.nsqfTitle} {profile.name}
            </h2>
            <p className="text-sm text-[#5C6E67]">
              {t.nsqfSubtitle} ({profile.education}, {profile.familyOccupation}, {profile.location || 'Salem'})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#5C6E67]">{t.filterBy}</span>
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedFilter === 'all' ? 'bg-[#087F5B] text-white shadow-sm' : 'bg-[#FAF9F6] border border-[#E2DBD0] text-[#24302C]'
              }`}
            >
              {t.filterAll} ({coursesList.length})
            </button>
            <button
              onClick={() => setSelectedFilter('self')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedFilter === 'self' ? 'bg-[#087F5B] text-white shadow-sm' : 'bg-[#FAF9F6] border border-[#E2DBD0] text-[#24302C]'
              }`}
            >
              {t.filterToolkit}
            </button>
            <button
              onClick={() => setSelectedFilter('level4')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedFilter === 'level4' ? 'bg-[#087F5B] text-white shadow-sm' : 'bg-[#FAF9F6] border border-[#E2DBD0] text-[#24302C]'
              }`}
            >
              {t.filterLevel4}
            </button>
          </div>
        </div>

        {/* Beneficiary Context Banner */}
        <div className="bg-[#E6F4F0]/60 border border-[#087F5B]/20 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div><span className="font-extrabold text-[#087F5B]">{t.labelName}:</span> <span className="font-bold text-[#24302C]">{profile.name}</span></div>
            <div><span className="font-extrabold text-[#087F5B]">{t.labelEdu}:</span> <span className="font-bold text-[#24302C]">{profile.education}</span></div>
            <div><span className="font-extrabold text-[#087F5B]">{t.labelTrade}:</span> <span className="font-bold text-[#24302C]">{profile.familyOccupation}</span></div>
            <div><span className="font-extrabold text-[#087F5B]">{t.labelLocation}:</span> <span className="font-bold text-[#24302C]">{profile.location}</span></div>
          </div>
          <span className="bg-[#087F5B] text-white px-3 py-1 rounded-full font-bold text-[11px]">
            {coursesList[0]?.matchScore || 96}% {t.matchScore}
          </span>
        </div>

        {/* Qualification Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => (
            <div 
              key={course.id}
              className={`bg-white rounded-3xl border-2 transition-all duration-300 p-6 flex flex-col justify-between space-y-5 hover:shadow-xl ${
                idx === 0 ? 'border-[#087F5B] shadow-md ring-2 ring-[#087F5B]/10' : 'border-[#E2DBD0] hover:border-[#087F5B]/50'
              }`}
            >
              <div className="space-y-4">
                
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-extrabold bg-[#E6F4F0] text-[#087F5B] px-3 py-1 rounded-full border border-[#087F5B]/20">
                    {course.id}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#087F5B] bg-[#FAF9F6] px-2.5 py-1 rounded-full border border-[#E2DBD0]">
                      {course.matchScore}% {t.matchScore}
                    </span>
                    <button
                      onClick={() => speakCourseInfo(course)}
                      className="w-7 h-7 rounded-full bg-[#FAF9F6] hover:bg-[#E6F4F0] text-[#087F5B] flex items-center justify-center transition-colors"
                      title="Audio narration"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Course Title & Sector */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E67]">{course.sector}</span>
                  <h3 className="text-lg font-extrabold text-[#24302C] leading-snug font-['Outfit'] mt-0.5">
                    {course.role}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#5C6E67] mt-2 font-medium">
                    <span className="bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#E2DBD0]">{t.level} {course.level}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#087F5B]" /> {course.durationHours} {t.hours}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#5C6E67] leading-relaxed line-clamp-2">
                  {course.description}
                </p>

                {/* Skill Gaps Requiring Intervention */}
                <div className="bg-[#FFF9F5] border border-[#F5D5C6] p-3 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C85A32]">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{t.skillGapsTitle}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(course.skillGaps || []).map((gap, gIdx) => (
                      <span key={gIdx} className="text-[10px] bg-white border border-[#F5D5C6] text-[#24302C] px-2 py-0.5 rounded-md font-semibold">
                        • {gap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* PM-AJAY GIA Toolkit Grant Highlight */}
                <div className="bg-[#E6F4F0] p-3 rounded-2xl border border-[#087F5B]/30 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#087F5B] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E98B73]" />
                    {t.giaSupportTitle}
                  </span>
                  <p className="text-xs font-extrabold text-[#24302C]">
                    {course.giaToolkitGrant}
                  </p>
                  <p className="text-[10px] text-[#5C6E67]">
                    {t.expectedIncome} {course.avgSalary}
                  </p>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#E2DBD0] flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveCourseModal(course)}
                  className="text-xs font-bold text-[#5C6E67] hover:text-[#087F5B] underline"
                >
                  {t.viewCurriculum}
                </button>

                <button
                  onClick={() => onSelectCourse(course)}
                  className="bg-[#087F5B] hover:bg-[#066749] text-white px-4 py-2 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>{t.selectPathway}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Detailed Curriculum Modal */}
        {activeCourseModal && (
          <div className="fixed inset-0 z-50 bg-[#24302C]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FAF9F6] border border-[#E2DBD0] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#087F5B] uppercase font-mono">{activeCourseModal.id}</span>
                  <h3 className="text-lg font-extrabold text-[#24302C] font-['Outfit']">{activeCourseModal.role}</h3>
                </div>
                <button onClick={() => setActiveCourseModal(null)} className="text-[#5C6E67] hover:text-black">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-extrabold text-[#24302C]">{t.entryReqLabel}</span>
                  <p className="text-[#5C6E67]">{activeCourseModal.entryReq}</p>
                </div>
                
                <div>
                  <span className="font-extrabold text-[#24302C]">{t.coreModulesLabel}</span>
                  <ul className="list-disc pl-4 text-[#5C6E67] space-y-1 mt-1">
                    {(activeCourseModal.curriculumModules || [
                      "Technical Safety & Workshop Protocols",
                      "Practical Tool Handling & Maintenance",
                      "Quality Inspection & Certification",
                      "Customer Billing & Digital Payments"
                    ]).map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-extrabold text-[#24302C]">{t.outcomesLabel}</span>
                  <p className="text-[#087F5B] font-bold">{activeCourseModal.outcomes}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectCourse(activeCourseModal);
                  setActiveCourseModal(null);
                }}
                className="w-full bg-[#087F5B] text-white py-3 rounded-full text-xs font-bold shadow-md hover:bg-[#066749]"
              >
                {t.proceedBtn}
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default NsqfRecommendations;
