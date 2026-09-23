export const NSQF_QUALIFICATION_PACKS = [
  {
    id: "AGR/Q4801",
    role: "Organic Agri-Input Producer",
    sector: "Agriculture & Allied",
    level: 4,
    matchScore: 96,
    durationHours: 200,
    entryReq: "8th Pass / Agricultural background",
    description: "Production of bio-fertilizers, vermicompost, and organic pest management solutions.",
    skillGaps: ["Quality Testing & Soil pH Analysis", "Packaging & FPO Marketing"],
    outcomes: "Agri-entrepreneur, bio-input supplier to local Farmers Producer Organizations.",
    avgSalary: "₹15,000 - ₹22,000 / month",
    giaToolkitGrant: "₹35,000 Bio-Unit Setup Support under PM-AJAY GIA"
  },
  {
    id: "AMH/Q1947",
    role: "Master Weaver & Handloom Stylist",
    sector: "Handicrafts & Apparel",
    level: 4,
    matchScore: 94,
    durationHours: 350,
    entryReq: "Traditional Weaving Skill / 8th Pass",
    description: "Modern jacquard weaving techniques, organic dyeing, and e-commerce product design.",
    skillGaps: ["Natural Dye Formulation", "Digital Cataloging for Online Markets"],
    outcomes: "Handloom cluster artisan, SHG enterprise leader.",
    avgSalary: "₹18,000 - ₹28,000 / month",
    giaToolkitGrant: "₹50,000 Handloom Modernization Grant under PM-AJAY GIA"
  },
  {
    id: "ELE/Q5901",
    role: "Solar PV Installer & Technician",
    sector: "Renewable Energy & Green Skills",
    level: 4,
    matchScore: 92,
    durationHours: 300,
    entryReq: "10th Pass / Basic Technical Aptitude",
    description: "Install, test, and maintain rooftop and off-grid solar photovoltaic systems.",
    skillGaps: ["AC/DC Inverter Testing", "Safety Standards & Earthing"],
    outcomes: "Wage employment in green energy firms or self-employed solar technician.",
    avgSalary: "₹16,000 - ₹24,000 / month",
    giaToolkitGrant: "₹45,000 Toolkit Subsidy under PM-AJAY GIA"
  },
  {
    id: "AUTO/Q0302",
    role: "Electric Vehicle (EV) Scooter Service Technician",
    sector: "Automotive & EV Tech",
    level: 4,
    matchScore: 90,
    durationHours: 320,
    entryReq: "10th Pass / Mechanical Interest",
    description: "Lithium-ion battery diagnostics, BLDC motor servicing, and EV scooter wiring maintenance.",
    skillGaps: ["BMS Controller Testing", "High Voltage Safety"],
    outcomes: "EV service workshop owner or dealership technician.",
    avgSalary: "₹18,000 - ₹30,000 / month",
    giaToolkitGrant: "₹50,000 EV Servicing Kit Support under PM-AJAY GIA"
  },
  {
    id: "SSC/Q2212",
    role: "Data Entry & Digital Saksham Operator",
    sector: "IT-ITES & Digital Services",
    level: 4,
    matchScore: 88,
    durationHours: 400,
    entryReq: "10th Pass / Basic Computer Familiarity",
    description: "Data digitization, online government service portal operations, and e-governance support.",
    skillGaps: ["Advanced Excel & Tally Data", "Regional Language Keyboard Typing"],
    outcomes: "Common Service Center (CSC) operator, BPO desk associate.",
    avgSalary: "₹14,000 - ₹20,000 / month",
    giaToolkitGrant: "₹30,000 Digital Kiosk Setup Grant"
  },
  {
    id: "ELE/Q8104",
    role: "Smartphone & Electronics Repairing Technician",
    sector: "Electronics & Hardware",
    level: 3,
    matchScore: 85,
    durationHours: 250,
    entryReq: "8th Pass / Hardware Interest",
    description: "Troubleshooting, SMD soldering, display replacement, and mobile hardware diagnostics.",
    skillGaps: ["SMD Circuit Soldering", "Multimeter Diagnostics"],
    outcomes: "Mobile repair store enterprise or service center associate.",
    avgSalary: "₹15,000 - ₹25,000 / month",
    giaToolkitGrant: "₹30,000 Repairing Toolkit Grant under PM-AJAY GIA"
  },
  {
    id: "HCS/Q5401",
    role: "Community Health & Swachhta Assistant",
    sector: "Healthcare & Caregiving",
    level: 4,
    matchScore: 84,
    durationHours: 360,
    entryReq: "10th Pass",
    description: "Community health monitoring, first aid, sanitation management, and elderly care.",
    skillGaps: ["First Aid & Vitals Recording", "Sanitation Safety Standards"],
    outcomes: "Community health worker, NGO health associate.",
    avgSalary: "₹14,000 - ₹20,000 / month",
    giaToolkitGrant: "₹35,000 Caregiving Medical Kit Grant"
  },
  {
    id: "LCS/Q0012",
    role: "Leather Goods & Footwear Crafts Artisan",
    sector: "Leather Crafts & Artisans",
    level: 3,
    matchScore: 82,
    durationHours: 280,
    entryReq: "Traditional Artisan Skill / 8th Pass",
    description: "Pattern stitching, leather cutting, shoe assembly, and ethnic craft design.",
    skillGaps: ["Precision Cutting Machines", "Modern Sole Bonding"],
    outcomes: "Footwear enterprise artisan, leather SHG member.",
    avgSalary: "₹16,000 - ₹26,000 / month",
    giaToolkitGrant: "₹40,000 Leathercraft Machine Subsidy"
  }
];

export const GIA_SCHEMES = [
  {
    id: "PMAJAY-GIA-01",
    name: "PM-AJAY Skill Development & Transport Grant",
    type: "100% Subsidized Training",
    benefits: "Free tuition, free course books, daily ₹150 transport allowance + post-training stipend.",
    eligibility: "SC beneficiaries registered under PM-AJAY aspirational blocks."
  },
  {
    id: "PMAJAY-GIA-02",
    name: "PM-AJAY Micro-Enterprise Toolkit Subsidy",
    type: "Capital Grant",
    benefits: "Up to ₹50,000 grant for purchasing tools, sewing machines, solar kits, or agro-machines.",
    eligibility: "Candidates completing NSQF Level 3 or 4 certified training."
  },
  {
    id: "STANDUP-INDIA-SC",
    name: "Stand-Up India Enterprise Credit (SC Component)",
    type: "Interest Subsidized Loan",
    benefits: "Collateral-free bank loan from ₹10 Lakh to ₹1 Crore with 25% PM-AJAY GIA margin support.",
    eligibility: "First-time SC greenfield entrepreneurs."
  }
];

export const TRAINING_CENTERS = [
  {
    name: "Government Industrial Training Institute (ITI) - Salem Cluster",
    location: "Salem, Tamil Nadu",
    distanceKm: "4.2 km away",
    phone: "+91 94432 10987",
    nextBatch: "Starts Oct 10, 2026",
    consultant: "Mr. R. Ramesh (Trained PM-AJAY Consultant)"
  },
  {
    name: "Pradhan Mantri Kaushal Kendra (PMKK) - District Skill Hub",
    location: "Salem City, Tamil Nadu",
    distanceKm: "7.8 km away",
    phone: "+91 98421 55670",
    nextBatch: "Starts Oct 15, 2026",
    consultant: "Smt. K. Kavitha (GIA Coordinator)"
  }
];

export const DISTRICT_DEMAND = [
  { district: "Salem", state: "Tamil Nadu", topDemand: "Organic Agriculture & Solar PV", scPopulation: "18.4%", activeBeneficiaries: 1420, placementRate: "84%" },
  { district: "Madurai", state: "Tamil Nadu", topDemand: "Agri-Processing & Mobile Tech", scPopulation: "21.2%", activeBeneficiaries: 1890, placementRate: "82%" },
  { district: "Villupuram", state: "Tamil Nadu", topDemand: "Bio-Inputs & Modern Apparel", scPopulation: "28.6%", activeBeneficiaries: 2310, placementRate: "74%" },
  { district: "Varanasi", state: "Uttar Pradesh", topDemand: "Handicrafts & Digital Saksham", scPopulation: "19.8%", activeBeneficiaries: 3100, placementRate: "80%" },
  { district: "Patna", state: "Bihar", topDemand: "Data Entry & Solar Technician", scPopulation: "16.5%", activeBeneficiaries: 2750, placementRate: "76%" }
];
