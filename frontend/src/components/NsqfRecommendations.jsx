import React from 'react';
import { Award, BookOpen, CheckCircle, Sparkles, AlertCircle, ArrowRight, Volume2 } from 'lucide-react';
import { NSQF_QUALIFICATION_PACKS } from '../data/seedData';

const NsqfRecommendations = ({ beneficiaryProfile, customMatchedCourses, onSelectCourse, selectedLanguage }) => {
  const profile = beneficiaryProfile || {
    name: "Gowtham",
    education: "12th Standard",
    familyOccupation: "Agriculture & Organic Farming",
    location: "Salem, Tamil Nadu",
    preference: "Self-Employment / Micro-Enterprise"
  };

  // If backend returned matched courses, use them; otherwise sort seed data based on profile occupation
  let coursesToDisplay = customMatchedCourses || NSQF_QUALIFICATION_PACKS;

  if (!customMatchedCourses && profile.familyOccupation) {
    const occLower = profile.familyOccupation.toLowerCase();
    coursesToDisplay = NSQF_QUALIFICATION_PACKS.map(c => {
      let score = c.matchScore;
      if (occLower.includes("agri") || occLower.includes("farm")) {
        if (c.id === "AGR/Q4801") score = 96;
        if (c.id === "ELE/Q5901") score = 88;
      }
      return { ...c, matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  const speakCourseInfo = (course) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const text = selectedLanguage === 'ta'
      ? `வணக்கம் ${profile.name}! உங்களுக்கான சிறந்த பயிற்சி: ${course.role}. இந்த படிப்பிற்கு ${course.matchScore} சதவீதம் பொருத்தம் உள்ளது. ${course.giaToolkitGrant}.`
      : `Hello ${profile.name}! Recommended course for you: ${course.role}. Match score is ${course.matchScore} percent. ${course.giaToolkitGrant}.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === 'ta' ? 'ta-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="bg-[#FAF9F6] py-12 px-6 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-[#E2DBD0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#E6F4F0] text-[#087F5B] text-xs font-bold px-3 py-1 rounded-full">
              <Award className="w-3.5 h-3.5" />
              <span>Step 2: NSQF Level 1-7 Alignment Engine</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#24302C] font-['Outfit']">
              Recommended Skilling Pathways for {profile.name}
            </h2>
            <p className="text-sm text-[#5C6E67]">
              Matched based on Education ({profile.education}) & Occupation ({profile.familyOccupation})
            </p>
          </div>

          <div className="bg-[#F4EDE2] p-4 rounded-2xl border border-[#E2DBD0] text-xs font-semibold text-[#24302C] space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-[#5C6E67]">Captured Beneficiary Profile</p>
            <p>📍 Location: <strong>{profile.location}</strong></p>
            <p>🎯 Preference: <strong>{profile.preference || "Self-Employment"}</strong></p>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coursesToDisplay.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-3xl border border-[#E2DBD0] hover:border-[#087F5B] hover:shadow-lg transition-all p-7 space-y-5 relative overflow-hidden group"
            >
              
              {/* Match Score Badge */}
              <div className="flex items-center justify-between border-b border-[#E2DBD0]/60 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-[#E6F4F0] text-[#087F5B] px-3 py-1 rounded-full">
                    QP: {course.id}
                  </span>
                  <span className="text-xs font-bold bg-[#F4EDE2] text-[#24302C] px-3 py-1 rounded-full">
                    NSQF Level {course.level}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-[#E6F4F0] text-[#087F5B] font-extrabold text-sm px-3 py-1 rounded-full border border-[#087F5B]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{course.matchScore}% Match</span>
                </div>
              </div>

              {/* Course Title & Description */}
              <div>
                <h3 className="text-xl font-extrabold text-[#24302C] group-hover:text-[#087F5B] transition-colors font-['Outfit']">
                  {course.role}
                </h3>
                <p className="text-xs text-[#5C6E67] font-semibold mt-1">Sector: {course.sector}</p>
                <p className="text-sm text-[#5C6E67] mt-3 leading-relaxed">{course.description}</p>
              </div>

              {/* Skill Gap Analysis */}
              <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E2DBD0] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E98B73]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Identified Skill Gap & Bridge Micro-Course:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {course.skillGaps.map((gap, idx) => (
                    <span key={idx} className="text-xs bg-white border border-[#E2DBD0] text-[#24302C] px-3 py-1 rounded-lg font-medium">
                      • {gap}
                    </span>
                  ))}
                </div>
              </div>

              {/* PM-AJAY GIA Grant Highlight */}
              <div className="bg-[#E6F4F0] p-4 rounded-2xl border border-[#087F5B]/30 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase text-[#087F5B]">PM-AJAY GIA Support</p>
                  <p className="text-xs font-extrabold text-[#24302C]">{course.giaToolkitGrant}</p>
                </div>
                <button
                  onClick={() => speakCourseInfo(course)}
                  className="w-9 h-9 rounded-full bg-white text-[#087F5B] flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                  title="Listen in Voice"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectCourse && onSelectCourse(course)}
                className="w-full bg-[#087F5B] hover:bg-[#066749] text-white py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Select Course & Map GIA Grant ➔</span>
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default NsqfRecommendations;
