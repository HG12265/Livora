import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle2, Clock, AlertCircle, Sparkles, Send, MapPin, Phone, Building2, WifiOff, RefreshCw } from 'lucide-react';
import { fetchCoordinationTasks, updateCoordinationTask, groundRegisterBeneficiary } from '../services/api';
import { TRANSLATIONS } from '../data/translations';

const GroundHub = ({ selectedLanguage = 'en' }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const [formData, setFormData] = useState({
    name: '',
    village: '',
    district: 'Salem',
    state: 'Tamil Nadu',
    education: '10th Standard',
    traditionalOccupation: 'Handloom Weaving',
    preference: 'Self-Employment with Toolkit Grant',
    contactPhone: '',
    assignedFacilitator: 'Gram Panchayat Village Mitra (Tharamangalam)'
  });

  useEffect(() => {
    async function loadTasks() {
      const res = await fetchCoordinationTasks();
      if (res && res.tasks) {
        setTasks(res.tasks);
      } else {
        setTasks([
          {
            id: "TASK-COORD-101",
            title: "NSQF Level 4 Practical Assessment Batch Approval",
            initiator: "NSDC / Sector Skill Council",
            responsibleAgency: "State SC Development Corporation (SCDC)",
            district: "Salem",
            targetGroup: "60 Solar PV Candidates (Batch 2)",
            deadline: "2026-10-18",
            status: "In Progress",
            actionRequired: "Issue hall tickets and depute external certified assessor."
          },
          {
            id: "TASK-COORD-102",
            title: "Sanction of ₹50,000 Toolkit Grants Direct Benefit Transfer",
            initiator: "District Industries Centre (DIC) - Salem",
            responsibleAgency: "Ministry of Social Justice & Empowerment (MoSJE)",
            district: "Salem",
            targetGroup: "42 Certified Master Weavers",
            deadline: "2026-10-25",
            status: "Pending MoSJE Signoff",
            actionRequired: "PFMS DBT payment batch release for approved PFMS beneficiary bank accounts."
          },
          {
            id: "TASK-COORD-103",
            title: "Stand-Up India Bank Loan Camp with District Lead Bank",
            initiator: "Lead District Manager (Canara Bank)",
            responsibleAgency: "Financial Consultants Team & SCDC",
            district: "Madurai",
            targetGroup: "35 Micro-Enterprise Applicants (EV & Digital Kiosk)",
            deadline: "2026-11-02",
            status: "Scheduled",
            actionRequired: "Mobilize applicants with project reports and Mudra loan forms."
          }
        ]);
      }
    }
    loadTasks();
  }, []);

  const handleUpdateStatus = async (taskId, newStatus) => {
    await updateCoordinationTask(taskId, newStatus);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleSubmitGroundRegistration = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.village) return;

    setLoading(true);
    await groundRegisterBeneficiary(formData);
    setLoading(false);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);

    setFormData({
      name: '',
      village: '',
      district: 'Salem',
      state: 'Tamil Nadu',
      education: '10th Standard',
      traditionalOccupation: 'Handloom Weaving',
      preference: 'Self-Employment with Toolkit Grant',
      contactPhone: '',
      assignedFacilitator: 'Gram Panchayat Village Mitra'
    });
  };

  return (
    <section className="bg-[#FAF9F6] py-10 px-6 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-[#E2DBD0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#E6F4F0] text-[#087F5B] text-xs font-bold px-3 py-1 rounded-full">
              <Users className="w-3.5 h-3.5" />
              <span>{t.groundBadge}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#24302C] font-['Outfit']">
              {t.groundTitle}
            </h2>
            <p className="text-sm text-[#5C6E67]">
              {t.groundSubtitle}
            </p>
          </div>

          <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-[#E2DBD0] flex items-center gap-3 text-xs">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
            <div>
              <span className="font-bold text-[#24302C] block">{t.groundSync}</span>
              <span className="text-[10px] text-[#5C6E67]">{t.groundCoverage}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Gram Panchayat Rapid Kiosk Onboarding */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-extrabold text-[#24302C] font-['Outfit'] flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#087F5B]" />
                    <span>{t.kioskTitle}</span>
                  </h3>
                  <p className="text-xs text-[#5C6E67]">
                    {t.kioskSubtitle}
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-[#E6F4F0] text-[#087F5B] px-2.5 py-1 rounded-full font-bold">
                  {t.kioskBadge}
                </span>
              </div>

              {formSubmitted && (
                <div className="bg-[#E6F4F0] border border-[#087F5B] p-4 rounded-2xl text-xs text-[#087F5B] font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t.kioskSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmitGroundRegistration} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#24302C] block mb-1">{t.fieldName}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jeeva R"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-2.5 outline-none focus:border-[#087F5B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#24302C] block mb-1">{t.fieldVillage}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tharamangalam East"
                      value={formData.village}
                      onChange={e => setFormData({ ...formData, village: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-2.5 outline-none focus:border-[#087F5B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#24302C] block mb-1">{t.fieldDistrict}</label>
                    <select
                      value={formData.district}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-2.5 outline-none focus:border-[#087F5B]"
                    >
                      <option value="Salem">Salem (Tamil Nadu)</option>
                      <option value="Madurai">Madurai (Tamil Nadu)</option>
                      <option value="Villupuram">Villupuram (Tamil Nadu)</option>
                      <option value="Varanasi">Varanasi (Uttar Pradesh)</option>
                      <option value="Patna">Patna (Bihar)</option>
                      <option value="Warangal">Warangal (Telangana)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#24302C] block mb-1">{t.fieldEdu}</label>
                    <select
                      value={formData.education}
                      onChange={e => setFormData({ ...formData, education: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-2.5 outline-none focus:border-[#087F5B]"
                    >
                      <option value="10th Standard">10th Standard</option>
                      <option value="12th Standard">12th Standard</option>
                      <option value="8th Pass">8th Pass</option>
                      <option value="ITI / Diploma">ITI / Diploma</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#24302C] block mb-1">{t.fieldTrade}</label>
                    <input
                      type="text"
                      placeholder="e.g. Handloom Weaving / Agriculture"
                      value={formData.traditionalOccupation}
                      onChange={e => setFormData({ ...formData, traditionalOccupation: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-2.5 outline-none focus:border-[#087F5B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#24302C] block mb-1">{t.fieldPhone}</label>
                    <input
                      type="text"
                      placeholder="+91 98421..."
                      value={formData.contactPhone}
                      onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-2.5 outline-none focus:border-[#087F5B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#24302C] block mb-1">{t.fieldMitra}</label>
                  <input
                    type="text"
                    value={formData.assignedFacilitator}
                    onChange={e => setFormData({ ...formData, assignedFacilitator: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#E2DBD0] rounded-xl p-2.5 outline-none focus:border-[#087F5B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#087F5B] hover:bg-[#066749] text-white py-3 rounded-full text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting to Central Database...' : t.groundSubmitBtn}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Inter-Agency Coordination Tasks */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-lg font-extrabold text-[#24302C] font-['Outfit'] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#087F5B]" />
                  <span>{t.coordinationTitle}</span>
                </h3>
                <p className="text-xs text-[#5C6E67]">
                  {t.coordinationSubtitle}
                </p>
              </div>
              <span className="text-xs font-bold text-[#087F5B]">{tasks.length} {t.coordinationTasks}</span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white p-5 rounded-3xl border border-[#E2DBD0] shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#087F5B] bg-[#E6F4F0] px-2.5 py-0.5 rounded-full">
                      {task.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#24302C]">{task.title}</h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#FAF9F6] p-3 rounded-xl border border-[#E2DBD0]">
                    <div>
                      <span className="text-[#5C6E67] block">{t.labelInitiator}</span>
                      <span className="font-semibold text-[#24302C]">{task.initiator}</span>
                    </div>
                    <div>
                      <span className="text-[#5C6E67] block">{t.labelAgency}</span>
                      <span className="font-semibold text-[#087F5B]">{task.responsibleAgency}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#5C6E67]">
                    <span className="font-bold text-[#24302C]">{t.labelActionReq}</span> {task.actionRequired}
                  </div>

                  <div className="pt-2 border-t border-[#E2DBD0] flex items-center justify-between text-xs">
                    <span className="text-[#5C6E67]">Target: {task.targetGroup}</span>
                    <div className="flex items-center gap-2">
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(task.id, 'Completed')}
                          className="bg-[#087F5B] hover:bg-[#066749] text-white px-3 py-1 rounded-full text-[10px] font-bold transition-all"
                        >
                          {t.signoffBtn}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default GroundHub;
