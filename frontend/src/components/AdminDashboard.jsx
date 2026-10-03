import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Users, TrendingUp, Award, FileText, Sparkles, Download, Phone, CheckCircle2, UserCheck, Briefcase, Landmark, Printer, Search, PlusCircle, ArrowUpRight } from 'lucide-react';
import { DISTRICT_DEMAND } from '../data/seedData';
import {
  fetchHeatmapData,
  fetchConsultants,
  registerConsultant,
  fetchPlacements,
  updatePlacementStatus,
  fetchPerspectivePlans,
  generatePerspectivePlan,
  assignConsultant
} from '../services/api';
import { TRANSLATIONS } from '../data/translations';

const AdminDashboard = ({ selectedLanguage = 'en' }) => {
  const [activeTab, setActiveTab] = useState('perspective');
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICT_DEMAND[0]);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [actionPlanData, setActionPlanData] = useState(null);
  const [plansList, setPlansList] = useState([]);
  const [consultantsList, setConsultantsList] = useState([]);
  const [placementPipeline, setPlacementPipeline] = useState([]);
  const [districtsList, setDistrictsList] = useState(DISTRICT_DEMAND);

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  // Assignment Modal
  const [assignmentModal, setAssignmentModal] = useState({ open: false, placement: null, selectedFc: '' });

  // Add Consultant Modal
  const [isAddFcOpen, setIsAddFcOpen] = useState(false);
  const [newFcData, setNewFcData] = useState({
    name: '',
    district: 'Salem',
    state: 'Tamil Nadu',
    phone: '',
    email: '',
    certification: 'NISM Certified PM-AJAY GIA Advisor'
  });

  useEffect(() => {
    async function loadApiData() {
      const heatmapRes = await fetchHeatmapData();
      if (heatmapRes && heatmapRes.districts) {
        setDistrictsList(heatmapRes.districts);
        setSelectedDistrict(heatmapRes.districts[0]);
      }

      const consultantsRes = await fetchConsultants();
      if (consultantsRes && consultantsRes.consultants) {
        setConsultantsList(consultantsRes.consultants);
      }

      const placementsRes = await fetchPlacements();
      if (placementsRes && placementsRes.placements) {
        setPlacementPipeline(placementsRes.placements);
      }

      const plansRes = await fetchPerspectivePlans();
      if (plansRes && plansRes.plans && plansRes.plans.length > 0) {
        setPlansList(plansRes.plans);
        setActionPlanData(plansRes.plans[0]);
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
      setPlansList(prev => [planRes.action_plan, ...prev.filter(p => p.district !== planRes.action_plan.district)]);
    }
  };

  const handleUpdateStatus = async (recordId, newStatus) => {
    const res = await updatePlacementStatus(recordId, newStatus);
    if (res && res.record) {
      setPlacementPipeline(prev => prev.map(p => p.id === recordId ? res.record : p));
    } else {
      setPlacementPipeline(prev => prev.map(p => p.id === recordId ? { ...p, status: newStatus } : p));
    }
  };

  const handleOpenAssignModal = (placement) => {
    setAssignmentModal({
      open: true,
      placement,
      selectedFc: consultantsList[0]?.name || 'Mr. R. Ramesh'
    });
  };

  const handleConfirmAssignment = async () => {
    if (!assignmentModal.placement) return;
    await assignConsultant(
      assignmentModal.placement.id,
      assignmentModal.placement.name,
      assignmentModal.selectedFc,
      assignmentModal.placement.district
    );

    setPlacementPipeline(prev => prev.map(p =>
      p.id === assignmentModal.placement.id
        ? { ...p, assignedConsultant: assignmentModal.selectedFc }
        : p
    ));
    setAssignmentModal({ open: false, placement: null, selectedFc: '' });
  };

  const handleAddConsultant = async (e) => {
    e.preventDefault();
    if (!newFcData.name || !newFcData.phone) return;

    const res = await registerConsultant(newFcData);
    if (res && res.consultant) {
      setConsultantsList(prev => [...prev, res.consultant]);
    }
    setIsAddFcOpen(false);
    setNewFcData({
      name: '',
      district: 'Salem',
      state: 'Tamil Nadu',
      phone: '',
      email: '',
      certification: 'NISM Certified PM-AJAY GIA Advisor'
    });
  };

  const handlePrintPlan = () => {
    window.print();
  };

  return (
    <section className="bg-[#FAF9F6] py-10 px-6 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white p-8 rounded-3xl border border-[#E2DBD0] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 print:border-none">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#E6F4F0] text-[#087F5B] text-xs font-bold px-3 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              <span>{t.adminBadge}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#24302C] font-['Outfit']">
              {t.adminTitle}
            </h2>
            <p className="text-sm text-[#5C6E67]">
              {t.adminSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handleGeneratePlan}
              disabled={generatingPlan}
              className="flex items-center gap-2 bg-[#087F5B] hover:bg-[#066749] text-white px-5 py-3 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{generatingPlan ? 'Gemini AI Planning District...' : `${t.generatePlanBtn} ${selectedDistrict.district}`}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E2DBD0] overflow-x-auto gap-4 text-xs font-bold text-[#5C6E67] print:hidden">
          <button
            onClick={() => setActiveTab('perspective')}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'perspective'
                ? 'border-b-2 border-[#087F5B] text-[#087F5B] font-extrabold'
                : 'hover:text-[#24302C]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.tabPlans}</span>
          </button>

          <button
            onClick={() => setActiveTab('consultants')}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'consultants'
                ? 'border-b-2 border-[#087F5B] text-[#087F5B] font-extrabold'
                : 'hover:text-[#24302C]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.tabConsultants}</span>
          </button>

          <button
            onClick={() => setActiveTab('placements')}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'placements'
                ? 'border-b-2 border-[#087F5B] text-[#087F5B] font-extrabold'
                : 'hover:text-[#24302C]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{t.tabPlacements}</span>
          </button>

          <button
            onClick={() => setActiveTab('heatmap')}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'heatmap'
                ? 'border-b-2 border-[#087F5B] text-[#087F5B] font-extrabold'
                : 'hover:text-[#24302C]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.tabHeatmap}</span>
          </button>
        </div>

        {/* TAB 1: PERSPECTIVE PLAN */}
        {activeTab === 'perspective' && (
          <div className="space-y-6">
            
            {/* District Selector Pill Bar */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 print:hidden">
              <span className="text-xs font-bold text-[#5C6E67]">{t.fieldDistrict}:</span>
              {districtsList.map((d) => (
                <button
                  key={d.district}
                  onClick={() => setSelectedDistrict(d)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedDistrict.district === d.district
                      ? 'bg-[#087F5B] text-white shadow-sm'
                      : 'bg-white border border-[#E2DBD0] text-[#24302C] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {d.district} ({d.state})
                </button>
              ))}
            </div>

            {/* Generated Plan View */}
            {actionPlanData && (
              <div className="bg-white rounded-3xl border border-[#E2DBD0] p-8 shadow-sm space-y-6 print:border-black">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E2DBD0] pb-5 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#087F5B] uppercase tracking-wider block">
                      {t.planApprovedBadge}
                    </span>
                    <h3 className="text-2xl font-black text-[#24302C] font-['Outfit']">
                      {actionPlanData.district} {t.planRoadmapTitle} ({actionPlanData.targetYear || '2026-2030'})
                    </h3>
                    <p className="text-xs text-[#5C6E67] mt-1">
                      Lead State: {actionPlanData.state} • Status: <span className="font-bold text-[#087F5B]">{actionPlanData.status || 'Approved by State SC Development Corporation'}</span>
                    </p>
                  </div>

                  <button
                    onClick={handlePrintPlan}
                    className="bg-[#FAF9F6] hover:bg-black/5 text-[#24302C] border border-[#E2DBD0] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 print:hidden"
                  >
                    <Printer className="w-4 h-4 text-[#087F5B]" />
                    <span>{t.printPlanBtn}</span>
                  </button>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E2DBD0]">
                    <span className="text-[10px] font-bold text-[#5C6E67] uppercase">{t.metricOutlay}</span>
                    <p className="text-xl font-black text-[#087F5B] font-mono">{actionPlanData.totalGiaBudget || '₹ 4.80 Crores'}</p>
                    <span className="text-[10px] text-[#5C6E67]">Annual: {actionPlanData.annualBudget2026 || '₹ 96 Lakhs'}</span>
                  </div>

                  <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E2DBD0]">
                    <span className="text-[10px] font-bold text-[#5C6E67] uppercase">{t.metricBeneficiaries}</span>
                    <p className="text-xl font-black text-[#24302C] font-mono">{actionPlanData.totalTargetBeneficiaries || 2400}</p>
                    <span className="text-[10px] text-[#5C6E67]">Saturation coverage in SC clusters</span>
                  </div>

                  <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E2DBD0]">
                    <span className="text-[10px] font-bold text-[#5C6E67] uppercase">{t.metricFcMapped}</span>
                    <p className="text-xl font-black text-[#24302C] font-mono">{actionPlanData.financialConsultantsMapped || 4} Certified</p>
                    <span className="text-[10px] text-[#087F5B] font-bold">1:50 Counselor Ratio</span>
                  </div>

                  <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E2DBD0]">
                    <span className="text-[10px] font-bold text-[#5C6E67] uppercase">{t.metricPlacementRate}</span>
                    <p className="text-xl font-black text-emerald-600 font-mono">{actionPlanData.projectedPlacementRate || '86%'}</p>
                    <span className="text-[10px] text-[#5C6E67]">Wage & Micro-Enterprise combined</span>
                  </div>
                </div>

                {/* Budget Breakdown Under GIA Component */}
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-[#24302C] uppercase tracking-wider">
                    {t.budgetBreakdownTitle}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-[#E2DBD0] space-y-1">
                      <span className="text-[#5C6E67] block">{t.budgetToolkit}</span>
                      <p className="text-base font-bold text-[#087F5B]">{actionPlanData.budgetBreakdown?.toolkitSubsidies || '₹ 42.0 Lakhs (43.75%)'}</p>
                      <p className="text-[10px] text-[#5C6E67]">Direct DBT grants of ₹35k-50k per certified beneficiary</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#E2DBD0] space-y-1">
                      <span className="text-[#5C6E67] block">{t.budgetTraining}</span>
                      <p className="text-base font-bold text-[#24302C]">{actionPlanData.budgetBreakdown?.trainingCostToInstitutes || '₹ 28.5 Lakhs (29.68%)'}</p>
                      <p className="text-[10px] text-[#5C6E67]">100% free courses, consumables & assessment fees</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#E2DBD0] space-y-1">
                      <span className="text-[#5C6E67] block">{t.budgetStipend}</span>
                      <p className="text-base font-bold text-[#E98B73]">{actionPlanData.budgetBreakdown?.stipendDBTToBeneficiaries || '₹ 15.0 Lakhs (15.62%)'}</p>
                      <p className="text-[10px] text-[#5C6E67]">₹1,500/month attendance allowance to reduce dropouts</p>
                    </div>
                  </div>
                </div>

                {/* Target Batches Table */}
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-[#24302C] uppercase tracking-wider">
                    {t.batchesTitle}
                  </h4>
                  <div className="overflow-x-auto border border-[#E2DBD0] rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF9F6] border-b border-[#E2DBD0] text-[#5C6E67] uppercase font-bold text-[10px]">
                        <tr>
                          <th className="py-3 px-4">{t.thCourse}</th>
                          <th className="py-3 px-4">{t.thBatches}</th>
                          <th className="py-3 px-4">{t.thCapacity}</th>
                          <th className="py-3 px-4">{t.thCluster}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2DBD0]">
                        {(actionPlanData.targetBatches || []).map((b, idx) => (
                          <tr key={idx} className="hover:bg-[#FAF9F6]">
                            <td className="py-3 px-4 font-bold text-[#24302C]">{b.course}</td>
                            <td className="py-3 px-4 font-mono font-bold text-[#087F5B]">{b.batches} Batches</td>
                            <td className="py-3 px-4">{b.capacity} Beneficiaries</td>
                            <td className="py-3 px-4 text-[#5C6E67]">{b.clusterArea || 'District Rural Clusters'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: FINANCIAL CONSULTANTS */}
        {activeTab === 'consultants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[#24302C] font-['Outfit']">
                  {t.fcRegistryTitle}
                </h3>
                <p className="text-xs text-[#5C6E67]">
                  {t.fcRegistrySubtitle}
                </p>
              </div>

              <button
                onClick={() => setIsAddFcOpen(true)}
                className="bg-[#087F5B] hover:bg-[#066749] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.empanelNewFc}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultantsList.map((fc) => (
                <div key={fc.id} className="bg-white rounded-3xl border border-[#E2DBD0] p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-[#E6F4F0] text-[#087F5B] px-2.5 py-0.5 rounded-full">
                      {fc.id}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                      {fc.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-[#24302C]">{fc.name}</h4>
                    <p className="text-xs text-[#087F5B] font-semibold">{fc.district}, {fc.state}</p>
                    <p className="text-[11px] text-[#5C6E67] mt-1">{fc.certification}</p>
                  </div>

                  <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-[#E2DBD0] text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#5C6E67]">{t.fcMetricActive}</span>
                      <span className="font-bold text-[#24302C]">{fc.activeBeneficiaries}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5C6E67]">{t.fcMetricGrants}</span>
                      <span className="font-bold text-[#087F5B]">{fc.grantSanctioned}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5C6E67]">{t.fcMetricCredit}</span>
                      <span className="font-bold text-amber-600">{fc.loansFacilitated || '₹ 32 Lakhs'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E2DBD0] flex items-center justify-between text-xs">
                    <span className="text-[#5C6E67] font-mono">{fc.phone}</span>
                    <a
                      href={`tel:${fc.phone}`}
                      className="text-[#087F5B] hover:underline font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PLACEMENT & ENTERPRISE PIPELINE */}
        {activeTab === 'placements' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#24302C] font-['Outfit']">
                  {t.placementTitle}
                </h3>
                <p className="text-xs text-[#5C6E67]">
                  {t.placementSubtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="bg-[#E6F4F0] text-[#087F5B] px-3 py-1.5 rounded-full">
                  {t.totalTracked} {placementPipeline.length} Candidates
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E2DBD0] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-[#E2DBD0] text-[#5C6E67] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-4 px-5">{t.thBeneficiary}</th>
                      <th className="py-4 px-4">{t.thNsqfDistrict}</th>
                      <th className="py-4 px-4">{t.thStatus}</th>
                      <th className="py-4 px-4">{t.thOutcome}</th>
                      <th className="py-4 px-4">{t.thGrantLoan}</th>
                      <th className="py-4 px-4">{t.thAssignedFc}</th>
                      <th className="py-4 px-5 text-right">{t.thAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DBD0]">
                    {placementPipeline.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-4 px-5">
                          <p className="font-bold text-[#24302C]">{p.name}</p>
                          <span className="text-[10px] font-mono text-[#087F5B] font-bold">{p.id}</span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-[#24302C]">{p.course}</p>
                          <span className="text-[10px] text-[#5C6E67]">{p.district}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            p.status.includes('Placed') || p.status.includes('Enterprise') ? 'bg-emerald-100 text-emerald-800' :
                            p.status.includes('Certified') ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-[#24302C]">{p.outcomeType}</p>
                          <span className="text-[10px] text-[#5C6E67]">{p.employerOrUnit || p.incomeOrSalary}</span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-[11px] text-[#087F5B] font-bold">{p.grantStatus}</p>
                          <span className="text-[10px] text-[#5C6E67]">{p.bankLoanStatus}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-[#24302C]">{p.assignedConsultant || 'Unassigned'}</span>
                        </td>
                        <td className="py-4 px-5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenAssignModal(p)}
                            className="text-[11px] text-[#087F5B] hover:underline font-bold"
                          >
                            {t.btnAssignFc}
                          </button>
                          
                          {p.status !== 'Placed in Wage Job' && p.status !== 'Enterprise Started' && (
                            <button
                              onClick={() => handleUpdateStatus(p.id, 'Enterprise Started')}
                              className="bg-[#087F5B] hover:bg-[#066749] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold"
                            >
                              {t.btnVerifyOutcome}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DISTRICT LIVELIHOOD HEATMAP */}
        {activeTab === 'heatmap' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#24302C] font-['Outfit']">
                {t.heatmapTitle}
              </h3>
              <p className="text-xs text-[#5C6E67]">
                {t.heatmapSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {districtsList.map((d) => (
                <div key={d.district} className="bg-white p-6 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-extrabold text-[#24302C]">{d.district}</h4>
                      <span className="text-xs text-[#5C6E67]">{d.state}</span>
                    </div>
                    <span className="text-xs font-black bg-[#E6F4F0] text-[#087F5B] px-3 py-1 rounded-full">
                      {d.scPopulation} SC Pop
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[#5C6E67] block">{t.topDemandLabel}</span>
                      <p className="font-bold text-[#24302C]">{d.topDemand}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2DBD0]">
                      <div>
                        <span className="text-[#5C6E67]">{t.activeBeneficiariesLabel}</span>
                        <p className="font-bold text-[#087F5B] text-sm">{d.activeBeneficiaries}</p>
                      </div>
                      <div>
                        <span className="text-[#5C6E67]">{t.placementRateLabel}</span>
                        <p className="font-bold text-emerald-600 text-sm">{d.placementRate}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDistrict(d);
                      setActiveTab('perspective');
                      handleGeneratePlan();
                    }}
                    className="w-full bg-[#FAF9F6] hover:bg-[#E6F4F0] text-[#087F5B] border border-[#E2DBD0] py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <span>{t.buildPlanBtn}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Assign Financial Consultant */}
        {assignmentModal.open && (
          <div className="fixed inset-0 z-50 bg-[#24302C]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-[#E2DBD0]">
              <h3 className="text-base font-extrabold text-[#24302C] font-['Outfit']">
                Assign Financial Consultant to {assignmentModal.placement?.name}
              </h3>
              <p className="text-xs text-[#5C6E67]">
                The mapped financial consultant will facilitate the PM-AJAY GIA toolkit grant of ₹35k-50k and Stand-Up India micro-credit.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#24302C] block">Select Certified Consultant:</label>
                <select
                  value={assignmentModal.selectedFc}
                  onChange={e => setAssignmentModal({ ...assignmentModal, selectedFc: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-3 text-xs outline-none focus:border-[#087F5B]"
                >
                  {consultantsList.map(fc => (
                    <option key={fc.id} value={fc.name}>
                      {fc.name} — {fc.district} ({fc.grantSanctioned} sanctioned)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setAssignmentModal({ open: false, placement: null, selectedFc: '' })}
                  className="px-4 py-2 text-xs font-bold text-[#5C6E67]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAssignment}
                  className="bg-[#087F5B] hover:bg-[#066749] text-white px-5 py-2 rounded-full text-xs font-bold shadow-md"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add New Financial Consultant */}
        {isAddFcOpen && (
          <div className="fixed inset-0 z-50 bg-[#24302C]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-[#E2DBD0]">
              <h3 className="text-base font-extrabold text-[#24302C] font-['Outfit']">
                {t.empanelNewFc}
              </h3>

              <form onSubmit={handleAddConsultant} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#24302C] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smt. R. Priya"
                    value={newFcData.name}
                    onChange={e => setNewFcData({ ...newFcData, name: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-2.5 outline-none focus:border-[#087F5B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#24302C] block mb-1">District</label>
                    <select
                      value={newFcData.district}
                      onChange={e => setNewFcData({ ...newFcData, district: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-2.5 outline-none focus:border-[#087F5B]"
                    >
                      <option value="Salem">Salem</option>
                      <option value="Madurai">Madurai</option>
                      <option value="Villupuram">Villupuram</option>
                      <option value="Varanasi">Varanasi</option>
                      <option value="Patna">Patna</option>
                      <option value="Warangal">Warangal</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#24302C] block mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 944..."
                      value={newFcData.phone}
                      onChange={e => setNewFcData({ ...newFcData, phone: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-2.5 outline-none focus:border-[#087F5B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#24302C] block mb-1">Certification Details</label>
                  <input
                    type="text"
                    value={newFcData.certification}
                    onChange={e => setNewFcData({ ...newFcData, certification: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-2.5 outline-none focus:border-[#087F5B]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddFcOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-[#5C6E67]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#087F5B] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md hover:bg-[#066749]"
                  >
                    Save & Empanel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default AdminDashboard;
