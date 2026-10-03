import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Users, TrendingUp, Award, FileText, Sparkles, Download, Phone, CheckCircle2, UserCheck, Briefcase, Landmark, Printer, Search, PlusCircle, ArrowUpRight, X, Eye } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  const [isDppModalOpen, setIsDppModalOpen] = useState(false);

  // Real Direct PDF Generator using jsPDF and autoTable (No Print Dialog!)
  const handleDownloadDirectPDF = () => {
    const data = actionPlanData || plansList[0] || {
      district: selectedDistrict?.district || 'Salem',
      state: selectedDistrict?.state || 'Tamil Nadu',
      totalGiaBudget: '₹ 4.80 Crores',
      annualBudget2026: '₹ 96 Lakhs',
      totalTargetBeneficiaries: 2400
    };

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const district = data.district || 'Salem';
    const state = data.state || 'Tamil Nadu';
    const stateCodeMap = {
      'Tamil Nadu': 'TN',
      'Madhya Pradesh': 'MP',
      'Telangana': 'TS',
      'Uttar Pradesh': 'UP',
      'Bihar': 'BR',
      'Andhra Pradesh': 'AP',
      'Karnataka': 'KA',
      'Maharashtra': 'MH'
    };
    const stateCode = stateCodeMap[state] || (state || 'TN').slice(0, 2).toUpperCase();
    const distCode = (district || 'SLM').slice(0, 3).toUpperCase();
    const refCode = `MoSJE/GIA/DPP/${stateCode}/${distCode}/2026-31`;
    const issueDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // Outer Decorative Border
    doc.setDrawColor(8, 127, 91);
    doc.setLineWidth(0.8);
    doc.rect(8, 8, 194, 280);

    // Top Green Band
    doc.setFillColor(8, 127, 91);
    doc.rect(8, 8, 194, 3.5, 'F');

    // Header Content
    doc.setTextColor(36, 48, 44);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text("GOVERNMENT OF INDIA", 105, 17, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(8, 127, 91);
    doc.text("MINISTRY OF SOCIAL JUSTICE AND EMPOWERMENT (MoSJE)", 105, 23, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(92, 110, 103);
    doc.text("Department of Social Justice and Empowerment - Shastri Bhawan, New Delhi", 105, 27.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(8, 127, 91);
    doc.text("PRADHAN MANTRI ANUSUCHIT JAATI ABHYUDAY YOJANA (PM-AJAY)", 105, 34, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(36, 48, 44);
    doc.text("5-YEAR DISTRICT PERSPECTIVE PLAN (2026 - 2031)", 105, 40, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(92, 110, 103);
    doc.text("Grant-in-Aid (GIA) Component for SC Livelihood Saturation & Enterprise Promotion", 105, 44.5, { align: 'center' });

    // Divider line
    doc.setDrawColor(226, 219, 208);
    doc.setLineWidth(0.4);
    doc.line(14, 47, 196, 47);

    // Administrative Info Block
    doc.setFillColor(250, 249, 246);
    doc.rect(14, 50, 182, 16, 'F');
    doc.setDrawColor(226, 219, 208);
    doc.rect(14, 50, 182, 16, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(92, 110, 103);
    doc.text("DOCUMENT REF NO:", 18, 55.5);
    doc.text("DISTRICT & STATE:", 108, 55.5);
    doc.text("APPRAISAL STATUS:", 18, 62);
    doc.text("DATE OF ISSUE:", 108, 62);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(8, 127, 91);
    doc.text(refCode, 52, 55.5);
    doc.text("APPROVED BY DLIC / MoSJE", 52, 62);

    doc.setTextColor(36, 48, 44);
    doc.text(`${district}, ${state}`, 142, 55.5);
    doc.text(issueDate, 142, 62);

    // Section 1: Executive Appraisal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(8, 127, 91);
    doc.text("1. EXECUTIVE APPRAISAL & BASELINE SOCIO-ECONOMIC PROFILE", 14, 72);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(36, 48, 44);
    const summaryText = `Under the statutory guidelines of the Grant-in-Aid (GIA) component of PM-AJAY, this 5-Year District Perspective Plan establishes the livelihood enhancement and NSQF-aligned skilling roadmap for ${district} District (${state}) covering 2026-2031. With an identified SC population concentration of 28.4%, the plan eliminates informal skill barriers through certified NCVET training and provides capital toolkits up to Rs. 50,000 to transition vulnerable SC families into certified wage employment and self-sustaining micro-enterprises.`;
    const splitSummary = doc.splitTextToSize(summaryText, 182);
    doc.text(splitSummary, 14, 76.5);

    // Section 2: Outlay Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(8, 127, 91);
    doc.text("2. YEAR-WISE FINANCIAL OUTLAY & PHYSICAL TARGETS (2026 - 2031)", 14, 94);

    autoTable(doc, {
      startY: 97,
      margin: { left: 14, right: 14 },
      head: [['Plan Year', 'Target Beneficiaries', 'Batches', 'Toolkit Grants', 'Training Cost', 'Stipend DBT', 'Total Outlay']],
      body: [
        ['Year 1 (2026-27)', '480 Beneficiaries', '16 Batches', 'Rs. 42.00 L', 'Rs. 28.50 L', 'Rs. 15.00 L', 'Rs. 96.00 Lakhs'],
        ['Year 2 (2027-28)', '510 Beneficiaries', '17 Batches', 'Rs. 45.00 L', 'Rs. 30.50 L', 'Rs. 16.00 L', 'Rs. 102.50 Lakhs'],
        ['Year 3 (2028-29)', '550 Beneficiaries', '18 Batches', 'Rs. 48.50 L', 'Rs. 33.00 L', 'Rs. 17.20 L', 'Rs. 110.00 Lakhs'],
        ['Year 4 (2029-30)', '590 Beneficiaries', '20 Batches', 'Rs. 52.00 L', 'Rs. 35.50 L', 'Rs. 18.50 L', 'Rs. 118.00 Lakhs'],
        ['Year 5 (2030-31)', '625 Beneficiaries', '21 Batches', 'Rs. 55.00 L', 'Rs. 37.50 L', 'Rs. 19.80 L', 'Rs. 125.00 Lakhs'],
        ['5-YEAR TOTAL', '2,755 Beneficiaries', '92 Batches', 'Rs. 242.50 L', 'Rs. 165.00 L', 'Rs. 86.50 L', 'Rs. 5.515 Crores']
      ],
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 1.8, textColor: [36, 48, 44] },
      headStyles: { fillColor: [8, 127, 91], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { fontStyle: 'bold' },
        6: { fontStyle: 'bold', textColor: [8, 127, 91] }
      },
      didParseCell: (cellData) => {
        if (cellData.row.index === 5) {
          cellData.cell.styles.fillColor = [230, 244, 240];
          cellData.cell.styles.fontStyle = 'bold';
        }
      }
    });

    const finalY = doc.lastAutoTable.finalY + 6;

    // Section 3: Trades Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(8, 127, 91);
    doc.text("3. MAPPED PRIORITY NSQF TRADES & GIA CAPITAL TOOLKITS", 14, finalY);

    autoTable(doc, {
      startY: finalY + 2.5,
      margin: { left: 14, right: 14 },
      head: [['QP Code', 'Job Role', 'Level', 'Hours', 'GIA Capital Subsidy & Toolkit Package']],
      body: [
        ['SGJ/Q0101', 'Solar PV Installer (Suryamitra)', 'Level 4', '300 Hrs', 'Rs. 50,000 (Clamp Multimeter, MC4 Crimper, Safety Harness, DC Tester)'],
        ['AMH/Q1947', 'Self Employed Tailor & Fashion Craftsman', 'Level 4', '340 Hrs', 'Rs. 50,000 (Industrial Direct-Drive Motorized Sewing & Overlock Machine)'],
        ['AER/Q1101', 'Drone Service Technician (Kisan Drone)', 'Level 5', '420 Hrs', 'Rs. 50,000 (Smart LiPo Balancing Charger, Avionics Rig & Spray Calibrator)'],
        ['ELE/Q1401', 'Field Technician Home Appliances', 'Level 4', '350 Hrs', 'Rs. 45,000 (Digital Testing, Soldering Station & Wire Diagnostic Tools)']
      ],
      theme: 'grid',
      styles: { fontSize: 6.8, cellPadding: 1.8, textColor: [36, 48, 44] },
      headStyles: { fillColor: [28, 40, 38], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [8, 127, 91], cellWidth: 24 },
        1: { fontStyle: 'bold', cellWidth: 48 },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 16, halign: 'center' },
        4: { cellWidth: 79 }
      }
    });

    const finalY2 = doc.lastAutoTable.finalY + 10;

    // Signatures Block
    doc.setDrawColor(36, 48, 44);
    doc.setLineWidth(0.4);

    // GM DIC
    doc.line(16, finalY2 + 10, 65, finalY2 + 10);
    doc.setFontSize(7);
    doc.setTextColor(8, 127, 91);
    doc.setFont('helvetica', 'italic');
    doc.text("Signed (Digital Verification)", 24, finalY2 + 7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(36, 48, 44);
    doc.text("GENERAL MANAGER", 26, finalY2 + 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text("District Industries Centre (DIC)", 24, finalY2 + 17.5);

    // MD SCDC
    doc.line(78, finalY2 + 10, 130, finalY2 + 10);
    doc.setFontSize(7);
    doc.setTextColor(8, 127, 91);
    doc.setFont('helvetica', 'italic');
    doc.text("Signed (Digital Verification)", 86, finalY2 + 7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(36, 48, 44);
    doc.text("MANAGING DIRECTOR", 88, finalY2 + 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text("State SC Development Corp (SCDC)", 81, finalY2 + 17.5);

    // Collector Stamp / DLIC Seal
    doc.setFillColor(230, 244, 240);
    doc.roundedRect(141, finalY2 + 2.5, 53, 6, 1, 1, 'F');
    doc.setDrawColor(8, 127, 91);
    doc.setLineWidth(0.35);
    doc.roundedRect(141, finalY2 + 2.5, 53, 6, 1, 1, 'S');
    doc.setFontSize(6.8);
    doc.setTextColor(8, 127, 91);
    doc.setFont('helvetica', 'bold');
    doc.text("APPROVED UNDER PM-AJAY GIA", 167.5, finalY2 + 6.8, { align: 'center' });
    doc.line(141, finalY2 + 10, 194, finalY2 + 10);
    doc.setTextColor(36, 48, 44);
    doc.setFontSize(7.5);
    doc.text("DISTRICT MAGISTRATE / COLLECTOR", 142, finalY2 + 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text("Chairman, DLIC (PM-AJAY)", 153, finalY2 + 17.5);

    // Footer
    doc.setFontSize(6.5);
    doc.setTextColor(92, 110, 103);
    doc.text("Livora AI Engine  |  Ministry of Social Justice & Empowerment (MoSJE)  |  PM-AJAY GIA Component (PS 26097)", 105, 284, { align: 'center' });

    // Save Directly!
    doc.save(`MoSJE_PM_AJAY_5Year_Perspective_Plan_${district}.pdf`);
  };

  const handleExportCSV = () => {
    if (!actionPlanData) return;
    const rows = [
      ["PRADHAN MANTRI ANUSUCHIT JAATI ABHYUDAY YOJANA (PM-AJAY)"],
      ["GIA COMPONENT - 5-YEAR DISTRICT PERSPECTIVE PLAN (2026-2030)"],
      [`District: ${actionPlanData.district}`, `State: ${actionPlanData.state}`, `Date: ${new Date().toLocaleDateString('en-IN')}`],
      [""],
      ["Component / Head", "Year 1 (2026-27)", "Year 2 (2027-28)", "Year 3 (2028-29)", "Year 4 (2029-30)", "Year 5 (2030-31)", "Total 5-Year Outlay (Rs. Lakhs)"],
      ["Toolkit Capital Asset Grants (Rs. 50k)", "42.00", "45.00", "48.50", "52.00", "55.00", "242.50"],
      ["Training Costs to ITI/NSTI Centers", "28.50", "30.50", "33.00", "35.50", "37.50", "165.00"],
      ["Beneficiary Trainee Stipend DBT", "15.00", "16.00", "17.20", "18.50", "19.80", "86.50"],
      ["Financial Consultant (FC) & Monitoring", "10.50", "11.00", "11.30", "12.00", "12.70", "57.50"],
      ["TOTAL FINANCIAL OUTLAY (Rs. Lakhs)", "96.00", "102.50", "110.00", "118.00", "125.00", "551.50"],
      [""],
      ["Physical Target (SC Beneficiaries)", "480", "510", "550", "590", "625", "2755"],
      ["Certified Batches Mapped", "16", "17", "18", "20", "21", "92"],
      ["Projected Placement / Enterprise Rate", "84%", "86%", "88%", "89%", "91%", "87.6% (Avg)"]
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PM_AJAY_5Year_Perspective_Plan_${actionPlanData.district}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

                  <div className="flex flex-wrap items-center gap-2.5 print:hidden">
                    <button
                      onClick={handleDownloadDirectPDF}
                      className="bg-[#087F5B] hover:bg-[#066749] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5 text-white" />
                      <span>Download Official PDF</span>
                    </button>

                    <button
                      onClick={() => setIsDppModalOpen(true)}
                      className="bg-[#FAF9F6] hover:bg-black/5 text-[#24302C] border border-[#E2DBD0] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#087F5B]" />
                      <span>Preview Document</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="bg-[#FAF9F6] hover:bg-black/5 text-[#24302C] border border-[#E2DBD0] px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#087F5B]" />
                      <span>CSV</span>
                    </button>
                  </div>
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

        {/* Official MoSJE 5-Year District Perspective Plan Document Modal */}
        {isDppModalOpen && actionPlanData && (
          <div className="fixed inset-0 z-50 bg-[#24302C]/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-[#FAF9F6] border border-[#E2DBD0] rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col">
              
              {/* Modal Control Bar */}
              <div className="bg-[#1C2826] text-white px-6 py-3.5 flex items-center justify-between flex-shrink-0 print:hidden">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#087F5B] flex items-center justify-center text-white text-xs font-black">
                    🇮🇳
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-['Outfit']">
                      Official MoSJE Document Preview: {actionPlanData.district} 5-Year Plan
                    </h3>
                    <p className="text-[10px] text-white/60">
                      Standard Government format compliant with PM-AJAY GIA Component Guidelines
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={handleDownloadDirectPDF}
                    className="bg-[#087F5B] hover:bg-[#066749] text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>Download Official PDF</span>
                  </button>
                  <button
                    onClick={() => setIsDppModalOpen(false)}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Document Printable Sheet */}
              <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-[#24302C] space-y-6 shadow-inner print:p-0">
                
                {/* Formal MoSJE Header */}
                <div className="text-center space-y-1.5 border-b-2 border-[#24302C] pb-5">
                  <div className="text-2xl font-serif">🏛️</div>
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#5C6E67]">
                    GOVERNMENT OF INDIA • भारत सरकार
                  </h4>
                  <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-[#24302C] font-['Outfit']">
                    MINISTRY OF SOCIAL JUSTICE AND EMPOWERMENT (MoSJE)
                  </h2>
                  <p className="text-xs font-serif italic text-[#5C6E67]">
                    Department of Social Justice and Empowerment • New Delhi
                  </p>
                  <div className="pt-2">
                    <span className="inline-block bg-[#087F5B] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-sm shadow-xs">
                      PRADHAN MANTRI ANUSUCHIT JAATI ABHYUDAY YOJANA (PM-AJAY)
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#24302C] pt-1">
                    5-YEAR DISTRICT PERSPECTIVE PLAN (2026 – 2031)
                  </h3>
                  <p className="text-[11px] font-semibold text-[#087F5B]">
                    Grant-in-Aid (GIA) Component for SC Livelihood Saturation & Enterprise Promotion
                  </p>
                </div>

                {/* Administrative Reference Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF9F6] p-3.5 rounded-xl border border-[#E2DBD0] text-xs">
                  <div>
                    <span className="text-[10px] text-[#5C6E67] uppercase font-bold block">Document Ref:</span>
                    <span className="font-mono font-bold text-[#087F5B]">MoSJE/GIA/DPP/{(actionPlanData?.state || 'TN').slice(0,2).toUpperCase()}/{(actionPlanData?.district || 'SLM').slice(0,3).toUpperCase()}/2026</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5C6E67] uppercase font-bold block">District & State:</span>
                    <span className="font-bold text-[#24302C]">{actionPlanData?.district || selectedDistrict?.district || 'Salem'}, {actionPlanData?.state || selectedDistrict?.state || 'Tamil Nadu'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5C6E67] uppercase font-bold block">Appraisal Status:</span>
                    <span className="font-bold text-emerald-700">Approved by MoSJE DLIC</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5C6E67] uppercase font-bold block">Date of Issue:</span>
                    <span className="font-mono text-[#24302C]">{new Date().toLocaleDateString('en-GB')}</span>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-1.5 text-xs text-[#24302C] leading-relaxed">
                  <h4 className="font-extrabold uppercase text-[#087F5B] tracking-wider text-[11px] border-b border-[#087F5B]/20 pb-1">
                    1. Executive Appraisal & Socio-Economic Profile
                  </h4>
                  <p>
                    In accordance with the operational guidelines of the <strong>Grant-in-Aid (GIA) component of PM-AJAY</strong>, this 5-Year District Perspective Plan establishes the livelihood enhancement and NSQF-aligned skilling roadmap for <strong>{actionPlanData.district} District</strong> ({actionPlanData.state}) covering the period 2026–2031. With a target SC population concentration of <strong>28.4%</strong>, this plan resolves the mismatch between traditional craft heritage and modern market demand, ensuring comprehensive household saturation.
                  </p>
                </div>

                {/* 5-Year Outlay & Targets Table */}
                <div className="space-y-2">
                  <h4 className="font-extrabold uppercase text-[#087F5B] tracking-wider text-[11px] border-b border-[#087F5B]/20 pb-1">
                    2. Year-Wise Financial Outlay & Physical Targets (2026–2031)
                  </h4>
                  <div className="overflow-x-auto border border-[#24302C]/40 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#FAF9F6] border-b border-[#24302C]/40 text-[#24302C] font-extrabold text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3 border-r border-[#E2DBD0]">Plan Year</th>
                          <th className="py-2.5 px-3 border-r border-[#E2DBD0]">Target SC Beneficiaries</th>
                          <th className="py-2.5 px-3 border-r border-[#E2DBD0]">Batches</th>
                          <th className="py-2.5 px-3 border-r border-[#E2DBD0]">Toolkit Subsidy (₹ L)</th>
                          <th className="py-2.5 px-3 border-r border-[#E2DBD0]">Training Cost (₹ L)</th>
                          <th className="py-2.5 px-3 border-r border-[#E2DBD0]">Stipend DBT (₹ L)</th>
                          <th className="py-2.5 px-3">Total GIA Outlay</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2DBD0] text-[11px]">
                        <tr>
                          <td className="py-2 px-3 font-bold border-r border-[#E2DBD0]">Year 1 (2026-27)</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">480 Beneficiaries</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">16 Batches</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 42.00 L</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 28.50 L</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 15.00 L</td>
                          <td className="py-2 px-3 font-bold text-[#087F5B]">₹ 96.00 Lakhs</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-bold border-r border-[#E2DBD0]">Year 2 (2027-28)</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">510 Beneficiaries</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">17 Batches</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 45.00 L</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 30.50 L</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 16.00 L</td>
                          <td className="py-2 px-3 font-bold text-[#087F5B]">₹ 102.50 Lakhs</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-bold border-r border-[#E2DBD0]">Year 3 (2028-29)</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">550 Beneficiaries</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">18 Batches</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 48.50 L</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 33.00 L</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 17.20 L</td>
                          <td className="py-2 px-3 font-bold text-[#087F5B]">₹ 110.00 Lakhs</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-bold border-r border-[#E2DBD0]">Year 4 (2029-30)</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">590 Beneficiaries</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">20 Batches</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 52.00 L</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 35.50 L</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 18.50 L</td>
                          <td className="py-2 px-3 font-bold text-[#087F5B]">₹ 118.00 Lakhs</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-bold border-r border-[#E2DBD0]">Year 5 (2030-31)</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">625 Beneficiaries</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">21 Batches</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 55.00 L</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 37.50 L</td>
                          <td className="py-2 px-3 border-r border-[#E2DBD0]">₹ 19.80 L</td>
                          <td className="py-2 px-3 font-bold text-[#087F5B]">₹ 125.00 Lakhs</td>
                        </tr>
                        <tr className="bg-[#E6F4F0] font-black text-xs text-[#087F5B]">
                          <td className="py-2.5 px-3 border-r border-[#087F5B]/30 uppercase">5-Year Total</td>
                          <td className="py-2.5 px-3 border-r border-[#087F5B]/30">2,755 Beneficiaries</td>
                          <td className="py-2.5 px-3 border-r border-[#087F5B]/30">92 Batches</td>
                          <td className="py-2.5 px-3 border-r border-[#087F5B]/30">₹ 242.50 L</td>
                          <td className="py-2.5 px-3 border-r border-[#087F5B]/30">₹ 165.00 L</td>
                          <td className="py-2.5 px-3 border-r border-[#087F5B]/30">₹ 86.50 L</td>
                          <td className="py-2.5 px-3 text-sm">₹ 5.515 Crores</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Priority Trades & NSQF Pathways */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-extrabold uppercase text-[#087F5B] tracking-wider text-[11px] border-b border-[#087F5B]/20 pb-1">
                    3. Mapped NSQF Trades & GIA Capital Toolkit Entitlements
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#E2DBD0]">
                      <span className="font-bold text-[#087F5B]">SGJ/Q0101: Solar PV Installer (Suryamitra) - Level 4</span>
                      <p className="text-[10px] text-[#5C6E67]">Toolkit Grant: ₹50,000 (Clamp Multimeter, MC4 Crimper, Fall-protection safety harness)</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#E2DBD0]">
                      <span className="font-bold text-[#087F5B]">AMH/Q1947: Self Employed Tailor & Fashion Craftsman - Level 4</span>
                      <p className="text-[10px] text-[#5C6E67]">Toolkit Grant: ₹50,000 (Industrial Motorized Direct-Drive Sewing & Overlock Machine)</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#E2DBD0]">
                      <span className="font-bold text-[#087F5B]">AER/Q1101: Drone Service Technician (Kisan Drone) - Level 5</span>
                      <p className="text-[10px] text-[#5C6E67]">Toolkit Grant: ₹50,000 (Smart LiPo Balancing Charger, Avionics Rig & Spray Calibrator)</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#E2DBD0]">
                      <span className="font-bold text-[#087F5B]">ELE/Q1401: Field Technician Home Appliances - Level 4</span>
                      <p className="text-[10px] text-[#5C6E67]">Toolkit Grant: ₹45,000 (Digital Testing & Soldering Repair Station)</p>
                    </div>
                  </div>
                </div>

                {/* Official Sign-Off Block */}
                <div className="pt-6 border-t-2 border-[#24302C] space-y-4">
                  <div className="grid grid-cols-3 gap-6 text-center text-[10px]">
                    <div className="space-y-8">
                      <div className="font-mono text-emerald-800 font-bold italic pt-4">Signed (Digital)</div>
                      <div className="border-t border-[#24302C] pt-1">
                        <p className="font-extrabold text-[#24302C]">General Manager</p>
                        <p className="text-[#5C6E67]">District Industries Centre (DIC)</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="font-mono text-emerald-800 font-bold italic pt-4">Signed (Digital)</div>
                      <div className="border-t border-[#24302C] pt-1">
                        <p className="font-extrabold text-[#24302C]">Managing Director</p>
                        <p className="text-[#5C6E67]">State SC Development Corp (SCDC)</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="inline-block border-2 border-[#087F5B] rounded-full p-2 text-[#087F5B] font-extrabold text-[9px] uppercase tracking-wider transform -rotate-3">
                        ★ APPROVED ★<br/>
                        DISTRICT COLLECTOR
                      </div>
                      <div className="border-t border-[#24302C] pt-1">
                        <p className="font-extrabold text-[#24302C]">District Magistrate / Collector</p>
                        <p className="text-[#5C6E67]">Chairman, DLIC (PM-AJAY)</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default AdminDashboard;
