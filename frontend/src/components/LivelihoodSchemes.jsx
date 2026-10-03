import React, { useState, useEffect } from 'react';
import { Landmark, MapPin, Phone, UserCheck, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2, HelpCircle, Wrench, X, Send, BellRing, FileText, CheckCircle, IndianRupee } from 'lucide-react';
import { fetchSchemes, fetchTrainingCenters } from '../services/api';
import { GIA_SCHEMES, TRAINING_CENTERS } from '../data/seedData';
import { TRANSLATIONS } from '../data/translations';

const LivelihoodSchemes = ({ selectedCourse, onProceedToPassbook, beneficiaryProfile, grantApplication, onGrantApplied, selectedLanguage = 'en' }) => {
  const [schemes, setSchemes] = useState(GIA_SCHEMES);
  const [centers, setCenters] = useState(TRAINING_CENTERS);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [selectedLoanOption, setSelectedLoanOption] = useState('grant_only');
  const [isSubmittingGrant, setIsSubmittingGrant] = useState(false);
  const [smsAlert, setSmsAlert] = useState(null);

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

  const getToolkitItems = (courseRole) => {
    const r = (courseRole || '').toLowerCase();
    if (r.includes('solar') || r.includes('electric')) {
      return [
        { name: "Digital Clamp Multimeter & Solar Irradiance Meter", cost: "₹ 14,500", spec: "True-RMS 1000V DC/AC with PV test leads" },
        { name: "MC4 Solar Crimping Tool, Wire Stripper & Cutter Set", cost: "₹ 8,200", spec: "High-leverage ratchet mechanism for 2.5-6.0mm² cable" },
        { name: "Full Body Safety Harness, Hard Hat & 1000V Insulated Gloves", cost: "₹ 9,800", spec: "EN361 certified rooftop fall protection kit" },
        { name: "DC Circuit Breaker, Fuse & Solar Array Diagnostic Rig", cost: "₹ 17,500", spec: "Handheld solar panel string & diode fault analyzer" }
      ];
    }
    if (r.includes('tailor') || r.includes('weaver') || r.includes('apparel') || r.includes('garment')) {
      return [
        { name: "Heavy-Duty Direct-Drive Motorized Sewing Machine", cost: "₹ 24,500", spec: "550W energy-efficient servo motor, auto needle position" },
        { name: "4-Thread Industrial Differential Feed Overlock Machine", cost: "₹ 16,000", spec: "High-speed edge trimmer & serger for modern garments" },
        { name: "French Curve Set, Tailoring Shears & Rotary Cutter", cost: "₹ 4,500", spec: "Professional pattern drafting and multi-layer fabric cutting" },
        { name: "Starter Commercial Fabric, Zippers & Industrial Thread Bulk", cost: "₹ 5,000", spec: "Raw material working capital bundle to take initial orders" }
      ];
    }
    return [
      { name: "Precision Industrial Calibration & Diagnostic Station", cost: "₹ 22,000", spec: "Digital testing bench with multi-pin diagnostic interface" },
      { name: "High-Torque Specialized Service Toolset & Hardware Kit", cost: "₹ 14,000", spec: "Hardened chrome vanadium bits, digital torque wrenches" },
      { name: "Smart LiPo Battery Charger & Voltage Health Analyzer", cost: "₹ 9,000", spec: "Multi-channel balancing charger with temperature cutoff" },
      { name: "Spares, Hardware Fasteners & Consumables Starter Pack", cost: "₹ 5,000", spec: "Essential replacement components for enterprise launch" }
    ];
  };

  const handleApplyGrant = () => {
    setIsSubmittingGrant(true);
    setTimeout(() => {
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const distLower = (profile.district || '').toLowerCase();
      const stateCode = distLower.includes('sagar') ? 'MP' : distLower.includes('warangal') ? 'TS' : 'TN';
      const appId = `PMAJAY-GIA-2026-${stateCode}-${randomId}`;
      const fcName = profile.assignedConsultant || "Mr. R. Sundaramoorthy";
      const fcPhone = "+91 94432 10987";
      
      const appData = {
        appId,
        status: "APPROVED_PENDING_DISBURSEMENT",
        beneficiaryName: profile.name,
        district: profile.district || "Salem",
        courseId: course.id,
        courseRole: course.role,
        grantAmount: "₹ 50,000",
        loanType: selectedLoanOption === 'mudra' ? "Mudra Shishu Loan (₹50,000 @ 7.5%)" : "100% Free Grant (Nil Repayment)",
        assignedFc: fcName,
        fcPhone: fcPhone,
        timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        toolkitItems: getToolkitItems(course.role)
      };

      if (onGrantApplied) {
        onGrantApplied(appData);
      }

      setSmsAlert({
        phone: "+91 98410 XXXXX",
        text: `Dear ${profile.name}, your ₹50,000 PM-AJAY GIA Toolkit Grant application is APPROVED under Ref: ${appId}. Mapped FC: ${fcName} (${fcPhone}). Track live at pmajay.gov.in`
      });

      setIsSubmittingGrant(false);
    }, 700);
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

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsGrantModalOpen(true)}
              className="bg-[#087F5B] hover:bg-[#066749] text-white px-6 py-3 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0 animate-pulse hover:animate-none"
            >
              <Wrench className="w-4 h-4 text-[#E98B73]" />
              <span>{t.applyToolkitBtn || "Apply for ₹50,000 PM-AJAY Toolkit Grant"}</span>
            </button>

            <button
              onClick={onProceedToPassbook}
              className="bg-white hover:bg-black/5 text-[#24302C] border border-[#E2DBD0] px-6 py-3 rounded-full text-xs font-bold shadow-xs transition-all flex items-center gap-2 flex-shrink-0"
            >
              <span>{t.proceedToPassbook}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Course Context Banner with Grant Status Badge */}
        <div className="bg-[#E6F4F0] p-6 rounded-3xl border-2 border-[#087F5B]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase bg-[#087F5B] text-white px-2.5 py-0.5 rounded-full">
                {t.activePathwayBadge}
              </span>
              <span className="text-xs font-mono font-bold text-[#087F5B]">{course.id}</span>
              {grantApplication && (
                <span className="text-[10px] font-extrabold uppercase bg-[#E98B73] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <CheckCircle className="w-3 h-3 text-white" />
                  Grant Registered: {grantApplication.appId}
                </span>
              )}
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
              {grantApplication ? "Approved by SCDC" : t.subsidizedBadge}
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

      {/* Toolkit Grant Application Modal */}
      {isGrantModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#24302C]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#FAF9F6] border border-[#E2DBD0] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-white px-6 py-4 border-b border-[#E2DBD0] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#087F5B] text-white flex items-center justify-center shadow-sm">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-[#24302C] font-['Outfit']">
                      {t.toolkitModalTitle || "PM-AJAY GIA Capital Subsidy & Toolkit Sanction"}
                    </h3>
                    <span className="text-[10px] bg-[#E6F4F0] text-[#087F5B] font-extrabold px-2 py-0.5 rounded-full">
                      100% Grant
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C6E67]">
                    {t.toolkitModalSub || "Direct Financial Grant (MoSJE) for SC Self-Employment under GIA Component"}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsGrantModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-[#5C6E67] hover:text-[#24302C] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">

              {/* Beneficiary & Trade Info */}
              <div className="bg-white p-4 rounded-2xl border border-[#E2DBD0] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">Beneficiary:</span>
                  <p className="font-extrabold text-[#24302C]">{profile.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">Category:</span>
                  <p className="font-bold text-[#087F5B]">SC / GIA Eligible</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">District / Hub:</span>
                  <p className="font-bold text-[#24302C]">{profile.district || "Salem"}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C6E67] uppercase font-bold">Capital Grant:</span>
                  <p className="font-black text-[#087F5B]">₹ 50,000</p>
                </div>
              </div>

              {/* Standard Certified Toolkit Package */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase text-[#24302C] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#087F5B]" />
                    <span>{t.toolkitItemization || "Standard Certified Toolkit Equipment Package:"}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-[#087F5B] bg-[#E6F4F0] px-2 py-0.5 rounded-full font-bold">
                    {course.id} Package
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2DBD0] divide-y divide-[#E2DBD0]/60 overflow-hidden shadow-2xs">
                  {getToolkitItems(course.role).map((item, idx) => (
                    <div key={idx} className="p-3 flex items-start justify-between gap-3 text-xs hover:bg-[#FAF9F6] transition-colors">
                      <div className="space-y-0.5">
                        <p className="font-bold text-[#24302C] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#087F5B] flex-shrink-0" />
                          <span>{item.name}</span>
                        </p>
                        <p className="text-[10px] text-[#5C6E67] pl-5">{item.spec}</p>
                      </div>
                      <span className="font-black text-[#087F5B] flex-shrink-0 text-xs">{item.cost}</span>
                    </div>
                  ))}
                  <div className="p-3 bg-[#E6F4F0] flex items-center justify-between text-xs font-black text-[#087F5B]">
                    <span>Total Grant Allocation (MoSJE GIA):</span>
                    <span className="text-sm">₹ 50,000 (100% Free Subsidy)</span>
                  </div>
                </div>
              </div>

              {/* Bank Loan Linkage Options (Mudra / GIA) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#24302C] block">
                  {t.bankLinkageOption || "Mudra Loan Linkage (Zero Collateral):"}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label 
                    onClick={() => setSelectedLoanOption('grant_only')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                      selectedLoanOption === 'grant_only' 
                        ? 'border-[#087F5B] bg-[#E6F4F0]/60 ring-2 ring-[#087F5B]/10' 
                        : 'border-[#E2DBD0] bg-white hover:border-[#087F5B]/40'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="loanOption" 
                      checked={selectedLoanOption === 'grant_only'} 
                      onChange={() => setSelectedLoanOption('grant_only')}
                      className="accent-[#087F5B]"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-[#24302C]">Grant Only</p>
                      <p className="text-[10px] text-[#5C6E67]">₹50,000 100% free capital subsidy</p>
                    </div>
                  </label>

                  <label 
                    onClick={() => setSelectedLoanOption('mudra')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                      selectedLoanOption === 'mudra' 
                        ? 'border-[#087F5B] bg-[#E6F4F0]/60 ring-2 ring-[#087F5B]/10' 
                        : 'border-[#E2DBD0] bg-white hover:border-[#087F5B]/40'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="loanOption" 
                      checked={selectedLoanOption === 'mudra'} 
                      onChange={() => setSelectedLoanOption('mudra')}
                      className="accent-[#087F5B]"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-[#24302C]">Grant + Mudra Shishu Loan</p>
                      <p className="text-[10px] text-[#5C6E67]">Additional ₹50,000 working capital @ 7.5%</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Mapped Financial Consultant (FC) */}
              <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E2DBD0] flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-[#5C6E67]">{t.assignedFcLabel || "Assigned Financial Consultant (FC):"}</span>
                  <p className="font-extrabold text-[#24302C]">{profile.assignedConsultant || "Mr. R. Sundaramoorthy"}</p>
                  <p className="text-[10px] text-[#5C6E67]">Certified NISM/DIC Consultant • Mapped to {profile.district || "Salem"}</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full">
                  Verified FC
                </span>
              </div>

              {/* SMS Alert Simulation Banner */}
              {smsAlert && (
                <div className="bg-[#1C2826] text-white p-4 rounded-2xl shadow-lg border border-white/10 space-y-2 animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#E98B73] flex items-center gap-1.5">
                      <BellRing className="w-4 h-4 animate-bounce" />
                      <span>{t.smsAlertTitle || "Live SMS Dispatched to Beneficiary Mobile"}</span>
                    </span>
                    <span className="text-[10px] font-mono text-white/60">{smsAlert.phone}</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl font-mono text-[11px] text-emerald-300 leading-relaxed">
                    "{smsAlert.text}"
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-white p-4 px-6 border-t border-[#E2DBD0] flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
              <span className="text-[11px] text-[#5C6E67]">
                MoSJE GIA Component • Zero Processing Fee
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsGrantModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-[#5C6E67] hover:bg-black/5 transition-all"
                >
                  Close
                </button>

                {smsAlert ? (
                  <button
                    onClick={() => {
                      setIsGrantModalOpen(false);
                      onProceedToPassbook();
                    }}
                    className="w-full sm:w-auto bg-[#087F5B] hover:bg-[#066749] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>View Sanctioned Passbook</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleApplyGrant}
                    disabled={isSubmittingGrant}
                    className="w-full sm:w-auto bg-[#087F5B] hover:bg-[#066749] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingGrant ? "Registering with MoSJE..." : t.submitGrantBtn || "Submit PM-AJAY Grant Application"}</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default LivelihoodSchemes;
