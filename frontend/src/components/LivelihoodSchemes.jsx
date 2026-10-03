import React, { useState, useEffect } from 'react';
import { Landmark, MapPin, Phone, UserCheck, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { fetchSchemes, fetchTrainingCenters } from '../services/api';
import { GIA_SCHEMES, TRAINING_CENTERS } from '../data/seedData';
import { TRANSLATIONS } from '../data/translations';

const LivelihoodSchemes = ({ selectedCourse, onProceedToPassbook, beneficiaryProfile, selectedLanguage = 'en' }) => {
  const [schemes, setSchemes] = useState(GIA_SCHEMES);
  const [centers, setCenters] = useState(TRAINING_CENTERS);
  const [selectedCenter, setSelectedCenter] = useState(null);

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const course = selectedCourse || {
    id: "AMH/Q1947",
    role: "Master Weaver & Handloom Stylist",
    level: 4,
    durationHours: 350,
    avgSalary: "₹18,000 - ₹28,000 / month",
    giaToolkitGrant: "₹50,000 Handloom Modernization Grant under PM-AJAY GIA"
  };

  const profile = beneficiaryProfile || {
    name: "Jeeva",
    district: "Salem",
    assignedConsultant: "Mr. R. Ramesh"
  };

  useEffect(() => {
    async function loadData() {
      const sRes = await fetchSchemes();
      if (sRes && sRes.schemes) setSchemes(sRes.schemes);

      const cRes = await fetchTrainingCenters(profile.district || 'Salem');
      if (cRes && cRes.centers && cRes.centers.length > 0) {
        setCenters(cRes.centers);
        setSelectedCenter(cRes.centers[0]);
      } else {
        setSelectedCenter(TRAINING_CENTERS[0]);
      }
    }
    loadData();
  }, [profile.district]);

  return (
    <section className="bg-[#FAF9F6] py-10 px-6 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white p-8 rounded-3xl border border-[#E2DBD0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#FDF1EE] text-[#E98B73] text-xs font-bold px-3 py-1 rounded-full">
              <Landmark className="w-3.5 h-3.5" />
              <span>{t.schemesBadge}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#24302C] font-['Outfit']">
              {t.schemesTitle}
            </h2>
            <p className="text-sm text-[#5C6E67]">
              {t.schemesSubtitle} ({profile.name} • {profile.district || 'Salem'})
            </p>
          </div>

          <button
            onClick={onProceedToPassbook}
            className="bg-[#087F5B] hover:bg-[#066749] text-white px-6 py-3 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>{t.proceedToPassbook}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Course Context Banner */}
        <div className="bg-[#E6F4F0] p-6 rounded-3xl border-2 border-[#087F5B]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase bg-[#087F5B] text-white px-2.5 py-0.5 rounded-full">
                {t.activePathwayBadge}
              </span>
              <span className="text-xs font-mono font-bold text-[#087F5B]">{course.id}</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#24302C] font-['Outfit']">{course.role}</h3>
            <p className="text-xs text-[#5C6E67]">
              {course.durationHours} {t.hours} • NSQF {t.level} {course.level} • {t.expectedIncome} {course.avgSalary}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#087F5B]/20 text-right space-y-1 shadow-sm">
            <span className="text-[10px] font-bold text-[#5C6E67] uppercase">{t.giaSupportTitle}</span>
            <p className="text-sm font-black text-[#087F5B]">{course.giaToolkitGrant}</p>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold inline-block">
              {t.subsidizedBadge}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: PM-AJAY GIA Schemes List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-[#24302C] font-['Outfit']">
                {t.entitlementsTitle}
              </h3>
              <span className="text-xs font-bold text-[#087F5B]">{t.entitlementsCount}</span>
            </div>
            
            <div className="space-y-4">
              {schemes.map((scheme) => (
                <div 
                  key={scheme.id} 
                  className="bg-white p-6 rounded-3xl border border-[#E2DBD0] hover:border-[#087F5B] shadow-sm space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-[#E6F4F0] text-[#087F5B] px-3 py-1 rounded-full">
                      {scheme.id}
                    </span>
                    <span className="text-xs font-bold text-[#E98B73]">{scheme.type}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-[#24302C] font-['Outfit']">{scheme.name}</h4>
                  <p className="text-xs text-[#5C6E67] leading-relaxed">{scheme.benefits}</p>
                  
                  <div className="pt-2 text-[11px] font-semibold text-[#24302C] bg-[#FAF9F6] p-3 rounded-xl border border-[#E2DBD0] flex items-center gap-2">
                    <span className="text-[#087F5B] font-bold">{t.eligibilityLabel}</span>
                    <span>{scheme.eligibility}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Empanelled ITI Training Centers & Financial Consultant Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Financial Consultant Card */}
            <div className="bg-gradient-to-br from-[#1C2826] to-[#24302C] text-white p-6 rounded-3xl shadow-xl space-y-4 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase bg-[#E98B73] text-white px-2.5 py-0.5 rounded-full">
                  {t.fcCardTitle}
                </span>
                <span className="text-xs text-white/60">{t.fcCertified}</span>
              </div>

              <div>
                <h4 className="text-lg font-bold font-['Outfit']">{profile.assignedConsultant || "Mr. R. Ramesh"}</h4>
                <p className="text-xs text-white/70">{t.fcRoleDesc}</p>
                <p className="text-xs text-emerald-400 font-mono mt-1">{t.fieldDistrict}: {profile.district || "Salem"}</p>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl text-xs space-y-1.5 text-white/90">
                <div className="flex items-center justify-between">
                  <span>{t.fcBeneficiaries}</span>
                  <span className="font-bold">42 Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t.fcGrants}</span>
                  <span className="font-bold text-emerald-300">₹ 18.5 Lakhs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t.fcLoans}</span>
                  <span className="font-bold text-amber-300">₹ 48.0 Lakhs</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <a
                  href="tel:+919443210987"
                  className="w-full bg-[#087F5B] hover:bg-[#066749] text-white text-center py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.fcCallBtn} (+91 94432 10987)</span>
                </a>
              </div>
            </div>

            {/* Empanelled Training Centers */}
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-[#24302C] font-['Outfit'] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#087F5B]" />
                <span>{t.centersTitle}</span>
              </h3>

              <div className="space-y-4">
                {centers.map((center) => (
                  <div
                    key={center.id}
                    onClick={() => setSelectedCenter(center)}
                    className={`bg-white p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-3 ${
                      selectedCenter?.id === center.id ? 'border-[#087F5B] shadow-md ring-2 ring-[#087F5B]/10' : 'border-[#E2DBD0] hover:border-[#087F5B]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#087F5B] bg-[#E6F4F0] px-2.5 py-0.5 rounded-full">
                        {center.id}
                      </span>
                      <span className="text-[11px] font-bold text-[#5C6E67]">{center.district}, {center.state}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#24302C]">{center.name}</h4>
                    <p className="text-xs text-[#5C6E67] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E98B73] flex-shrink-0" />
                      <span>{center.address}</span>
                    </p>

                    <div className="bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E2DBD0] text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#5C6E67]">{t.centerHead}</span>
                        <span className="font-bold text-[#24302C]">{center.contactPerson}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#5C6E67]">{t.centerStipend}</span>
                        <span className="font-bold text-[#087F5B]">{center.stipendProvided}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default LivelihoodSchemes;
