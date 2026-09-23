import React from 'react';
import { Landmark, MapPin, Phone, UserCheck, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { GIA_SCHEMES, TRAINING_CENTERS } from '../data/seedData';

const LivelihoodSchemes = ({ selectedCourse, onProceedToPassbook }) => {
  return (
    <section className="bg-[#FAF9F6] py-12 px-6 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#FDF1EE] text-[#E98B73] text-xs font-bold px-3 py-1 rounded-full">
            <Landmark className="w-3.5 h-3.5" />
            <span>Step 3: PM-AJAY GIA Grant & Scheme Mapping</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#24302C] font-['Outfit']">
            Local Livelihood Grants & Nearby GIA Training Centers
          </h2>
          <p className="text-sm text-[#5C6E67]">
            Direct financial support, daily stipend, and assigned financial consultants under GIA component of PM-AJAY.
          </p>
        </div>

        {/* Selected Course Context Bar */}
        {selectedCourse && (
          <div className="bg-[#E6F4F0] p-6 rounded-2xl border border-[#087F5B]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#087F5B]">Selected Training Pathway</span>
              <h4 className="text-lg font-extrabold text-[#24302C]">{selectedCourse.role} ({selectedCourse.id})</h4>
              <p className="text-xs text-[#5C6E67]">Duration: {selectedCourse.durationHours} Hours | Expected Salary: {selectedCourse.avgSalary}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-[#087F5B] border border-[#087F5B]/20">
              ✅ Matched GIA Toolkit Grant: {selectedCourse.giaToolkitGrant}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PM-AJAY GIA Schemes List */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold text-[#24302C] font-['Outfit']">Applicable PM-AJAY & MoSJE Schemes</h3>
            
            {GIA_SCHEMES.map((scheme) => (
              <div key={scheme.id} className="bg-white p-6 rounded-3xl border border-[#E2DBD0] hover:border-[#087F5B] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-[#E6F4F0] text-[#087F5B] px-3 py-1 rounded-full">
                    {scheme.id}
                  </span>
                  <span className="text-xs font-bold text-[#E98B73]">{scheme.type}</span>
                </div>
                <h4 className="text-lg font-bold text-[#24302C] font-['Outfit']">{scheme.name}</h4>
                <p className="text-xs text-[#5C6E67] leading-relaxed">{scheme.benefits}</p>
                <div className="pt-2 text-[11px] font-semibold text-[#24302C] bg-[#FAF9F6] p-3 rounded-xl border border-[#E2DBD0]">
                  🎯 Eligibility: {scheme.eligibility}
                </div>
              </div>
            ))}
          </div>

          {/* Nearby GIA Training Centers & Financial Consultants */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold text-[#24302C] font-['Outfit']">Nearby Certified Training Centers</h3>
            
            {TRAINING_CENTERS.map((center, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E6F4F0] text-[#087F5B] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#24302C]">{center.name}</h4>
                    <p className="text-xs text-[#5C6E67]">{center.location} • <span className="text-[#087F5B] font-bold">{center.distanceKm}</span></p>
                  </div>
                </div>

                <div className="border-t border-[#E2DBD0]/60 pt-3 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-[#24302C]">
                    <Phone className="w-3.5 h-3.5 text-[#087F5B]" />
                    <span>Contact: {center.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#24302C]">
                    <UserCheck className="w-3.5 h-3.5 text-[#E98B73]" />
                    <span>Consultant: <strong>{center.consultant}</strong></span>
                  </div>
                  <p className="text-[11px] text-[#087F5B] font-bold pt-1">📅 Next Batch: {center.nextBatch}</p>
                </div>
              </div>
            ))}

            <button
              onClick={onProceedToPassbook}
              className="w-full bg-[#087F5B] hover:bg-[#066749] text-white py-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <span>Generate Voice Livelihood Passbook (QR Card) ➔</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LivelihoodSchemes;
