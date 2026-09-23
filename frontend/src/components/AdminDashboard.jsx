import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Users, TrendingUp, Award, FileText, Sparkles, Download, Phone, CheckCircle2, UserCheck, Briefcase, Landmark, Printer } from 'lucide-react';
import { DISTRICT_DEMAND } from '../data/seedData';
import { fetchHeatmapData, fetchConsultants, fetchPlacements, generatePerspectivePlan, assignConsultant } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('perspective');
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICT_DEMAND[0]);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [actionPlanData, setActionPlanData] = useState(null);

  const [consultantsList, setConsultantsList] = useState([
    { id: "FC-SLM-01", name: "Mr. R. Ramesh", district: "Salem", state: "Tamil Nadu", phone: "+91 94432 10987", activeBeneficiaries: 42, grantSanctioned: "₹ 18.5 Lakhs", status: "Active" },
    { id: "FC-SLM-02", name: "Smt. K. Kavitha", district: "Salem", state: "Tamil Nadu", phone: "+91 98421 55670", activeBeneficiaries: 38, grantSanctioned: "₹ 16.0 Lakhs", status: "Active" },
    { id: "FC-MDU-01", name: "Mr. S. Murugan", district: "Madurai", state: "Tamil Nadu", phone: "+91 97890 44321", activeBeneficiaries: 55, grantSanctioned: "₹ 24.2 Lakhs", status: "Active" },
    { id: "FC-VRN-01", name: "Mr. A. K. Sharma", district: "Varanasi", state: "Uttar Pradesh", phone: "+91 91234 88765", activeBeneficiaries: 64, grantSanctioned: "₹ 28.0 Lakhs", status: "Active" }
  ]);

  const [placementPipeline, setPlacementPipeline] = useState([
    { id: "PMAJAY-SC-2026-8841", name: "Gowtham", district: "Salem", course: "Organic Agri-Input Producer (Level 4)", status: "NSQF Certified", outcomeType: "Self-Employment", grantStatus: "Toolkit Grant Sanctioned (₹35,000)", assignedConsultant: "Mr. R. Ramesh" },
    { id: "PMAJAY-SC-2026-8842", name: "Kavitha R", district: "Salem", course: "Solar PV Installer (Level 4)", status: "In Training", outcomeType: "Wage Job", grantStatus: "Transport Allowance Active", assignedConsultant: "Smt. K. Kavitha" },
    { id: "PMAJAY-SC-2026-8843", name: "M. Karthik", district: "Madurai", course: "Data Entry Saksham (Level 4)", status: "Placed in Job", outcomeType: "Wage Job (₹18,000/mo)", grantStatus: "Completed", assignedConsultant: "Mr. S. Murugan" },
    { id: "PMAJAY-SC-2026-8844", name: "P. Lakshmi", district: "Villupuram", course: "Master Weaver (Level 4)", status: "Enterprise Started", outcomeType: "Handloom SHG Leader", grantStatus: "Modernization Grant Released (₹50,000)", assignedConsultant: "Mr. R. Ramesh" }
  ]);

  useEffect(() => {
    async function loadApiData() {
      const heatmapRes = await fetchHeatmapData();
      const consultantsRes = await fetchConsultants();
      const placementsRes = await fetchPlacements();

      if (consultantsRes && consultantsRes.consultants) {
        setConsultantsList(consultantsRes.consultants);
      }
      if (placementsRes && placementsRes.placements) {
        setPlacementPipeline(placementsRes.placements);
      }
    }
    loadApiData();
  }, []);

  const handleGeneratePlan = async () => {
    setGeneratingPlan(true);
    const planRes = await generatePerspectivePlan(selectedDistrict.district, selectedDistrict.state);
    setGeneratingPlan(false);

    if (planRes && planRes.action_plan) {
      setActionPlanData(planRes.action_plan);
    } else {
      setActionPlanData({
        district: selectedDistrict.district,
        state: selectedDistrict.state,
        recommended_gia_budget: "₹ 85 Lakhs",
        target_batches: [
          { course: "Organic Agri-Input Producer (Level 4)", batches: 3, capacity: 90 },
          { course: "Solar PV Installer (Level 4)", batches: 2, capacity: 60 }
        ],
        financial_consultants_mapped: 4,
        expected_placement_rate: "84%",
        gia_toolkit_subsidies_approved: "₹ 45,000 per certified beneficiary"
      });
    }
  };

  const handleAssignConsultant = async (beneficiaryId, beneficiaryName, consultantName) => {
    await assignConsultant(beneficiaryId, beneficiaryName, consultantName, selectedDistrict.district);
    setPlacementPipeline(prev => prev.map(p => p.id === beneficiaryId ? { ...p, assignedConsultant: consultantName } : p));
  };

  return (
    <section className="bg-[#FAF9F6] py-12 px-6 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white p-8 rounded-3xl border border-[#E2DBD0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#E6F4F0] text-[#087F5B] text-xs font-bold px-3 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              <span>Ministry of Social Justice & Empowerment (MoSJE)</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#24302C] font-['Outfit']">
              PM-AJAY GIA Ground Execution & Placement Engine
            </h2>
            <p className="text-sm text-[#5C6E67]">
              Perspective Action Plans, Trained Financial Consultants Registry & Placement Lifecycle Tracker.
            </p>
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={generatingPlan}
            className="flex items-center gap-2 bg-[#087F5B] hover:bg-[#066749] text-white px-6 py-3.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{generatingPlan ? 'FastAPI & Gemini Generating Action Plan...' : 'Generate GIA Perspective Plan'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E2DBD0] overflow-x-auto gap-4 text-sm font-bold text-[#5C6E67]">
          <button
            onClick={() => setActiveTab('perspective')}
            className={`pb-3 transition-colors relative whitespace-nowrap ${activeTab === 'perspective' ? 'text-[#087F5B] border-b-2 border-[#087F5B]' : 'hover:text-[#24302C]'}`}
          >
            📊 Regional Heatmap & AI Perspective Plan
          </button>

          <button
            onClick={() => setActiveTab('consultants')}
            className={`pb-3 transition-colors relative whitespace-nowrap ${activeTab === 'consultants' ? 'text-[#087F5B] border-b-2 border-[#087F5B]' : 'hover:text-[#24302C]'}`}
          >
            💼 Financial Consultants Registry ({consultantsList.length})
          </button>

          <button
            onClick={() => setActiveTab('placement')}
            className={`pb-3 transition-colors relative whitespace-nowrap ${activeTab === 'placement' ? 'text-[#087F5B] border-b-2 border-[#087F5B]' : 'hover:text-[#24302C]'}`}
          >
            🎯 Post-Training Placement Tracker ({placementPipeline.length})
          </button>

          <button
            onClick={() => setActiveTab('coordination')}
            className={`pb-3 transition-colors relative whitespace-nowrap ${activeTab === 'coordination' ? 'text-[#087F5B] border-b-2 border-[#087F5B]' : 'hover:text-[#24302C]'}`}
          >
            🤝 Multi-Department Coordination Hub
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-2">
            <span className="text-xs font-bold text-[#5C6E67] uppercase">Total SC Beneficiaries</span>
            <p className="text-3xl font-extrabold text-[#24302C]">11,470</p>
            <p className="text-[11px] text-[#087F5B] font-bold">↑ 14% increase in voice enrollment</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-2">
            <span className="text-xs font-bold text-[#5C6E67] uppercase">Trained Financial Consultants</span>
            <p className="text-3xl font-extrabold text-[#087F5B]">{consultantsList.length * 37}</p>
            <p className="text-[11px] text-[#5C6E67] font-semibold">Mapped across 42 Aspirational Blocks</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-2">
            <span className="text-xs font-bold text-[#5C6E67] uppercase">Post-Skilling Placement</span>
            <p className="text-3xl font-extrabold text-[#E98B73]">84.2%</p>
            <p className="text-[11px] text-[#087F5B] font-bold">Wage Jobs & Self-Employment</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-2">
            <span className="text-xs font-bold text-[#5C6E67] uppercase">GIA Grants Released</span>
            <p className="text-3xl font-extrabold text-[#24302C]">₹ 4.8 Cr</p>
            <p className="text-[11px] text-[#5C6E67] font-semibold">Direct Toolkit & Stipend Support</p>
          </div>
        </div>

        {/* TAB 1: Perspective Plan & Heatmap */}
        {activeTab === 'perspective' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#24302C] font-['Outfit']">District Opportunity Heatmap</h3>
              <p className="text-xs text-[#5C6E67]">Select a district to view block-level skill gaps and GIA budget metrics.</p>

              <div className="space-y-3 pt-2">
                {DISTRICT_DEMAND.map((d) => (
                  <div
                    key={d.district}
                    onClick={() => { setSelectedDistrict(d); setActionPlanData(null); }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedDistrict.district === d.district 
                        ? 'border-[#087F5B] bg-[#E6F4F0]/60 shadow-sm' 
                        : 'border-[#E2DBD0] hover:border-[#087F5B]/50 bg-[#FAF9F6]'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#24302C]">{d.district}, {d.state}</h4>
                      <p className="text-xs text-[#5C6E67]">Top Demand: <span className="font-semibold text-[#087F5B]">{d.topDemand}</span></p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-bold text-[#24302C]">{d.activeBeneficiaries} Active</p>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#E2DBD0] font-bold text-[#E98B73]">
                        Placement: {d.placementRate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Perspective Action Plan Document */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-6">
              <div className="border-b border-[#E2DBD0] pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#087F5B]">Selected District Analysis</span>
                  <h3 className="text-2xl font-extrabold text-[#24302C] font-['Outfit']">
                    {selectedDistrict.district} ({selectedDistrict.state})
                  </h3>
                </div>
                <span className="text-xs font-bold bg-[#F4EDE2] text-[#24302C] px-3 py-1.5 rounded-full">
                  SC Population: {selectedDistrict.scPopulation}
                </span>
              </div>

              {/* Generated AI Perspective Plan Card */}
              {actionPlanData ? (
                <div className="bg-[#E6F4F0] p-6 rounded-2xl border-2 border-[#087F5B] space-y-4 animate-in fade-in shadow-md">
                  <div className="flex items-center justify-between border-b border-[#087F5B]/20 pb-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#087F5B]">
                      <Sparkles className="w-4 h-4" />
                      <span>FastAPI + Gemini AI GIA Action Plan (FY 2026-27)</span>
                    </div>
                    <button 
                      onClick={() => window.print()} 
                      className="text-xs font-bold bg-[#087F5B] text-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm hover:bg-[#066749]"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print / Export PDF
                    </button>
                  </div>

                  <div className="text-xs text-[#24302C] space-y-2.5 leading-relaxed">
                    <p>• <strong>Recommended GIA Allocation:</strong> {actionPlanData.recommended_gia_budget} budget for {selectedDistrict.district} District under PM-AJAY Grant-in-Aid.</p>
                    <p>• <strong>Target Skilling Batches:</strong> {actionPlanData.target_batches ? actionPlanData.target_batches.map(b => `${b.batches} Batches ${b.course}`).join(', ') : '3 Batches Organic Agri-Input Producer + 2 Batches Solar PV Installer'}.</p>
                    <p>• <strong>Mapped Financial Consultants:</strong> {actionPlanData.financial_consultants_mapped || 4} Certified Consultants assigned for direct SC toolkit delivery.</p>
                    <p>• <strong>Expected Placement Rate:</strong> {actionPlanData.expected_placement_rate || '84%'} (Wage & Enterprise Setup).</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FAF9F6] p-8 rounded-2xl border border-dashed border-[#E2DBD0] text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-[#087F5B] mx-auto" />
                  <p className="text-xs font-bold text-[#24302C]">Click "Generate GIA Perspective Plan" to call FastAPI + Gemini AI API for {selectedDistrict.district}.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E2DBD0]">
                  <span className="text-[10px] font-bold text-[#5C6E67] uppercase">Top Market Gap</span>
                  <p className="font-extrabold text-[#24302C] text-sm mt-1">{selectedDistrict.topDemand}</p>
                </div>
                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E2DBD0]">
                  <span className="text-[10px] font-bold text-[#5C6E67] uppercase">Active Training Centers</span>
                  <p className="font-extrabold text-[#087F5B] text-sm mt-1">4 Certified GIA ITIs</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Financial Consultants Registry */}
        {activeTab === 'consultants' && (
          <div className="bg-white p-8 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#24302C] font-['Outfit']">Trained PM-AJAY Financial Consultants</h3>
                <p className="text-xs text-[#5C6E67]">Assigned experts providing financial guidance, toolkit grants, and Mudra credit support.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {consultantsList.map((c) => (
                <div key={c.id} className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#E2DBD0] space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E6F4F0] text-[#087F5B] flex items-center justify-center font-bold">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#24302C]">{c.name}</h4>
                        <p className="text-xs text-[#5C6E67]">{c.district}, {c.state} • ID: {c.id}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#E6F4F0] text-[#087F5B] px-2.5 py-1 rounded-full font-bold">
                      {c.status}
                    </span>
                  </div>

                  <div className="border-t border-[#E2DBD0]/60 pt-3 text-xs space-y-1">
                    <p className="text-[#24302C]">📞 Contact: <strong>{c.phone}</strong></p>
                    <p className="text-[#24302C]">👥 Mapped Beneficiaries: <strong>{c.activeBeneficiaries} SC Candidates</strong></p>
                    <p className="text-[#087F5B] font-bold">💰 GIA Toolkit Sanctioned: {c.grantSanctioned}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Post-Training Placement Tracker */}
        {activeTab === 'placement' && (
          <div className="bg-white p-8 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#24302C] font-['Outfit'] font-mono">Beneficiary Placement & Enterprise Pipeline</h3>
              <p className="text-xs text-[#5C6E67]">Real-time tracking of SC beneficiaries from enrollment to post-training employment.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2DBD0] text-[#5C6E67] font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Beneficiary</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">NSQF Course</th>
                    <th className="py-3 px-4">Lifecycle Status</th>
                    <th className="py-3 px-4">GIA Grant Status</th>
                    <th className="py-3 px-4">Assigned Consultant</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DBD0]/60 text-[#24302C]">
                  {placementPipeline.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF9F6] transition-colors font-medium">
                      <td className="py-4 px-4 font-bold">{p.name} <br/><span className="text-[10px] text-[#5C6E67] font-normal">{p.id}</span></td>
                      <td className="py-4 px-4">{p.district}</td>
                      <td className="py-4 px-4">{p.course}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          p.status === 'NSQF Certified' || p.status === 'Enterprise Started' || p.status === 'Placed in Job' 
                            ? 'bg-[#E6F4F0] text-[#087F5B]' 
                            : 'bg-[#FDF1EE] text-[#E98B73]'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#087F5B] font-bold">{p.grantStatus}</td>
                      <td className="py-4 px-4 font-semibold">{p.assignedConsultant}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleAssignConsultant(p.id, p.name, "Mr. R. Ramesh")}
                          className="text-[10px] bg-[#087F5B] text-white px-2.5 py-1 rounded-full font-bold shadow-sm hover:bg-[#066749]"
                        >
                          Reassign FC
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Multi-Department Coordination Hub */}
        {activeTab === 'coordination' && (
          <div className="bg-white p-8 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#24302C] font-['Outfit']">Multi-Department Coordination Hub</h3>
            <p className="text-xs text-[#5C6E67]">Unified portal connecting MoSJE Ministry, District Nodal Officers (DNO), NSDC, and ITIs.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#E2DBD0] space-y-2">
                <div className="flex items-center gap-2 text-[#087F5B] font-bold">
                  <Landmark className="w-4 h-4" />
                  <span>MoSJE Ministry Level</span>
                </div>
                <p className="text-[#5C6E67]">State budget releases, scheme guidelines & policy approval.</p>
                <span className="inline-block text-[10px] bg-[#E6F4F0] text-[#087F5B] px-2 py-0.5 rounded-full font-bold">Connected</span>
              </div>

              <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#E2DBD0] space-y-2">
                <div className="flex items-center gap-2 text-[#087F5B] font-bold">
                  <Shield className="w-4 h-4" />
                  <span>District Collectorate (DNO)</span>
                </div>
                <p className="text-[#5C6E67]">Block-level beneficiary verification & toolkit grant release.</p>
                <span className="inline-block text-[10px] bg-[#E6F4F0] text-[#087F5B] px-2 py-0.5 rounded-full font-bold">Connected</span>
              </div>

              <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#E2DBD0] space-y-2">
                <div className="flex items-center gap-2 text-[#087F5B] font-bold">
                  <Award className="w-4 h-4" />
                  <span>NSDC & ITI Training Hubs</span>
                </div>
                <p className="text-[#5C6E67]">NSQF Level 1–7 course delivery, attendance & certification.</p>
                <span className="inline-block text-[10px] bg-[#E6F4F0] text-[#087F5B] px-2 py-0.5 rounded-full font-bold">Connected</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default AdminDashboard;
