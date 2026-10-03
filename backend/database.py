import json
import os
import datetime
from config import settings

DB_FILE = os.path.join(os.path.dirname(__file__), "livora_db.json")

# Official NSQF Qualification Packs (Levels 1 to 7) under NCVET / NSDC
SEED_NSQF_QPS = [
    {
        "id": "AGR/Q4801",
        "role": "Organic Agri-Input Producer",
        "sector": "Agriculture & Allied Green Trades",
        "level": 4,
        "durationHours": 200,
        "entryReq": "8th Pass / Agricultural background",
        "description": "Production of bio-fertilizers, vermicompost, botanical pesticides, and organic soil conditioners for Farmer Producer Organizations.",
        "skillGaps": ["Quality Testing & Soil pH Analysis", "Bio-Packaging & FPO Direct Marketing", "Organic Certification Standards"],
        "curriculumModules": ["Soil Ecology & Bio-fertilizer Science", "Vermi-wash & Compost Processing", "Packaging & Pricing", "Digital Marketplace Linkage"],
        "outcomes": "Agri-entrepreneur, bio-input supplier to local FPOs, organic nursery operator.",
        "avgSalary": "₹16,000 - ₹24,000 / month",
        "giaToolkitGrant": "₹35,000 Bio-Unit Setup Support under PM-AJAY GIA",
        "districtDemandRank": "High (Salem, Villupuram, Varanasi)"
    },
    {
        "id": "AMH/Q1947",
        "role": "Master Weaver & Handloom Stylist",
        "sector": "Handicrafts & Modern Apparel",
        "level": 4,
        "durationHours": 350,
        "entryReq": "Traditional Handloom Weaving Experience / 8th Pass",
        "description": "Modern computer-aided jacquard design, organic eco-dyeing, saree border styling, and e-commerce cataloging for global markets.",
        "skillGaps": ["Natural Dye Formulation & Chemical Safety", "CAD Jacquard Punch Card Reading", "E-Commerce Photography & Cataloging"],
        "curriculumModules": ["Advanced Loom Tuning", "Organic Vegetable Dyeing", "Market Trend Adaptation", "Digital Payments & ONDC Onboarding"],
        "outcomes": "Handloom cluster master artisan, SHG micro-enterprise leader, textile exporter collaborator.",
        "avgSalary": "₹18,000 - ₹28,000 / month",
        "giaToolkitGrant": "₹50,000 Handloom Modernization Grant under PM-AJAY GIA",
        "districtDemandRank": "Very High (Salem, Tharamangalam, Varanasi)"
    },
    {
        "id": "ELE/Q5901",
        "role": "Solar PV Rooftop Installer & Technician",
        "sector": "Renewable Energy & Green Skills",
        "level": 4,
        "durationHours": 300,
        "entryReq": "10th Pass / Basic Electrical & Technical Interest",
        "description": "Assemble, install, test, and maintain grid-tied and off-grid rooftop solar photovoltaic systems and PM-Surya Ghar installations.",
        "skillGaps": ["AC/DC Hybrid Inverter Troubleshooting", "Earthing & Surge Protection Compliance", "Net-Metering Grid Synchronization"],
        "curriculumModules": ["Solar Cell Mechanics", "Rooftop Mounting Rigging", "Wiring & Inverter Commissioning", "Safety Standards IEEE/CEA"],
        "outcomes": "EPC solar installation technician, rooftop maintenance contractor, green energy franchisee.",
        "avgSalary": "₹18,000 - ₹26,000 / month",
        "giaToolkitGrant": "₹45,000 Solar Toolkit Subsidy under PM-AJAY GIA",
        "districtDemandRank": "Very High (Salem, Madurai, Patna)"
    },
    {
        "id": "AUTO/Q0302",
        "role": "Electric Vehicle (EV) 2W/3W Service Specialist",
        "sector": "Automotive & Clean Mobility",
        "level": 4,
        "durationHours": 320,
        "entryReq": "10th Pass / Basic Mechanical or Auto Interest",
        "description": "Lithium-ion battery diagnostics, Battery Management System (BMS) calibration, BLDC hub motor servicing, and EV scooter wiring.",
        "skillGaps": ["BMS Cell Balancing Diagnostics", "High-Voltage Safety Protocols", "Regenerative Braking Fault Tracing"],
        "curriculumModules": ["Li-ion Chemistries & Safety", "Controller & BLDC Motor Servicing", "CAN-bus Sensor Reading", "EV Workshop Setup"],
        "outcomes": "Authorized EV dealership technician, independent EV multi-brand repair enterprise owner.",
        "avgSalary": "₹18,000 - ₹32,000 / month",
        "giaToolkitGrant": "₹50,000 EV Diagnostic Toolkit Support under PM-AJAY GIA",
        "districtDemandRank": "High (Madurai, Salem, Patna)"
    },
    {
        "id": "SSC/Q2212",
        "role": "Digital Saksham & Citizen Services Operator",
        "sector": "IT-ITES & E-Governance",
        "level": 4,
        "durationHours": 400,
        "entryReq": "10th Pass / Basic Computer & English Familiarity",
        "description": "Public service delivery, government portal data operations (DBT, Aadhaar, PM-AJAY), regional typing, and digital financial inclusion.",
        "skillGaps": ["Advanced Spreadsheet Analysis & MIS Reporting", "Regional Language Indic Keyboard Typing", "Cyber Security & Phishing Awareness"],
        "curriculumModules": ["Digital Literacy & OS Operations", "MoSJE & Citizen Service Portals", "Financial Technology & AEPS", "Customer Service & Ethics"],
        "outcomes": "Common Service Center (CSC) village entrepreneur, BPO associate, municipal e-governance assistant.",
        "avgSalary": "₹15,000 - ₹22,000 / month",
        "giaToolkitGrant": "₹30,000 Digital Kiosk Setup Grant under PM-AJAY GIA",
        "districtDemandRank": "Very High (All Districts)"
    },
    {
        "id": "ELE/Q8104",
        "role": "Smartphone & Micro-Electronics Hardware Technician",
        "sector": "Electronics & Hardware Maintenance",
        "level": 3,
        "durationHours": 250,
        "entryReq": "8th Pass / Basic Hardware Interest",
        "description": "Component-level micro-soldering, SMD rework, display refurbishment, liquid damage repair, and smartphone motherboard diagnostics.",
        "skillGaps": ["SMD Hot Air Rework Precision", "Schematic Diagram & Multimeter Diagnostics", "Software Flashing & Bootloader Recovery"],
        "curriculumModules": ["Basic Circuitry & Ohms Law", "Hardware Disassembly & Inspection", "SMD IC Replacement", "Store Management & Customer Billing"],
        "outcomes": "Independent electronics service shop owner, service center warranty technician.",
        "avgSalary": "₹15,000 - ₹25,000 / month",
        "giaToolkitGrant": "₹30,000 Micro-Soldering Toolkit Grant under PM-AJAY GIA",
        "districtDemandRank": "High (Madurai, Salem, Varanasi)"
    },
    {
        "id": "HCS/Q5401",
        "role": "Community Health & Swachhta Associate",
        "sector": "Healthcare & Allied Services",
        "level": 4,
        "durationHours": 360,
        "entryReq": "10th Pass / Social Engagement Aptitude",
        "description": "Community health surveying, digital vitals recording, sanitation compliance, maternal-child nutrition outreach, and first aid.",
        "skillGaps": ["Digital Tele-health Kiosk Operations", "Sterilization Protocols & Bio-Medical Waste Handling", "Elderly Care Patient Mobilization"],
        "curriculumModules": ["Human Biology & Vitals Checking", "Sanitation & Swachh Bharat Norms", "Community Outreach & Counseling", "Emergency First Response"],
        "outcomes": "Primary Health Centre field associate, NGO wellness coordinator, home health caregiver.",
        "avgSalary": "₹14,000 - ₹20,000 / month",
        "giaToolkitGrant": "₹35,000 Community Caregiving Kit Support",
        "districtDemandRank": "Medium (Villupuram, Patna)"
    },
    {
        "id": "LCS/Q0012",
        "role": "Leather Goods & Ethnic Footwear Crafts Artisan",
        "sector": "Leather & Traditional Crafts",
        "level": 3,
        "durationHours": 280,
        "entryReq": "Traditional Leatherwork Background / 8th Pass",
        "description": "Modern pattern cutting, ergonomic sole bonding, hand-stitching of durable ethnic footwear, and finished leather accessory design.",
        "skillGaps": ["Precision Mechanical Skiving & Cutting", "Non-Toxic Eco-Friendly Adhesives", "Digital Export Packaging Standards"],
        "curriculumModules": ["Leather Grading & Selection", "Footwear Pattern Grading", "Sole Attachment & Finishing", "SHG Group Branding"],
        "outcomes": "Artisanal footwear enterprise founder, industrial leather factory skilled technician.",
        "avgSalary": "₹16,000 - ₹26,000 / month",
        "giaToolkitGrant": "₹40,000 Leathercraft Machine Subsidy under PM-AJAY GIA",
        "districtDemandRank": "High (Varanasi, Villupuram)"
    }
]

# Empanelled PM-AJAY GIA Training Centers
SEED_TRAINING_CENTERS = [
    {
        "id": "TC-TN-01",
        "name": "Government Industrial Training Institute (ITI) - Salem",
        "district": "Salem",
        "state": "Tamil Nadu",
        "address": "Gorimedu, Salem - 636008",
        "contactPerson": "Er. K. Velmurugan (Principal)",
        "phone": "+91 94433 22110",
        "courses": ["Solar PV Installer", "Electric Vehicle Technician", "Organic Agri-Input"],
        "capacity": 180,
        "hostelAvailable": True,
        "stipendProvided": "₹1,500 / month PM-AJAY GIA Stipend",
        "geo": {"lat": 11.6643, "lng": 78.1460}
    },
    {
        "id": "TC-TN-02",
        "name": "MoSJE Center of Excellence for Handloom Weavers - Tharamangalam",
        "district": "Salem",
        "state": "Tamil Nadu",
        "address": "Main Road, Tharamangalam, Salem - 636502",
        "contactPerson": "Smt. S. Gomathi (Master Trainer)",
        "phone": "+91 98420 77890",
        "courses": ["Master Weaver & Handloom Stylist", "Digital Saksham Operator"],
        "capacity": 120,
        "hostelAvailable": False,
        "stipendProvided": "₹1,500 / month PM-AJAY GIA Stipend",
        "geo": {"lat": 11.6974, "lng": 77.9768}
    },
    {
        "id": "TC-TN-03",
        "name": "PM-AJAY Multi-Skilling Development Centre - Madurai",
        "district": "Madurai",
        "state": "Tamil Nadu",
        "address": "K.Pudur, Madurai - 625007",
        "contactPerson": "Mr. M. Soundararajan (Centre Head)",
        "phone": "+91 97891 66540",
        "courses": ["Electric Vehicle Technician", "Smartphone Repairing", "Data Entry Saksham"],
        "capacity": 200,
        "hostelAvailable": True,
        "stipendProvided": "₹1,500 / month PM-AJAY GIA Stipend",
        "geo": {"lat": 9.9252, "lng": 78.1198}
    },
    {
        "id": "TC-UP-01",
        "name": "District Skill Development Centre - Varanasi",
        "district": "Varanasi",
        "state": "Uttar Pradesh",
        "address": "Cantt Road, Varanasi - 221002",
        "contactPerson": "Dr. R. P. Tiwari",
        "phone": "+91 91230 44556",
        "courses": ["Master Weaver", "Leather Goods Artisan", "Solar PV Installer"],
        "capacity": 160,
        "hostelAvailable": True,
        "stipendProvided": "₹1,500 / month PM-AJAY GIA Stipend",
        "geo": {"lat": 25.3176, "lng": 82.9739}
    }
]

# PM-AJAY GIA Schemes & Direct Benefits
SEED_GIA_SCHEMES = [
    {
        "id": "PMAJAY-GIA-01",
        "name": "PM-AJAY Free Skill Training & Daily Stipend",
        "type": "100% Fully Subsidized Skilling",
        "benefits": "Zero course fee, free government course book & safety uniform, plus ₹1,500/month direct bank transfer (DBT) attendance stipend.",
        "eligibility": "SC community members aged 18-45 years with family annual income < ₹3,00,000."
    },
    {
        "id": "PMAJAY-GIA-02",
        "name": "Post-Training Livelihood Toolkit Grant",
        "type": "Capital Asset Grant",
        "benefits": "Non-repayable toolkit grant of ₹35,000 to ₹50,000 deposited in bank account upon clearing official NSQF Level 3-7 assessment.",
        "eligibility": "Certified SC candidate intending to start micro-enterprise, cluster trade, or specialized service."
    },
    {
        "id": "PMAJAY-GIA-03",
        "name": "Stand-Up India / MUDRA Institutional Credit Linkage",
        "type": "Credit Facilitation Support",
        "benefits": "Zero-collateral bank loans up to ₹10 Lakhs under MUDRA (Kishor/Tarun) with 33% capital subsidy facilitated through dedicated Financial Consultant.",
        "eligibility": "NSQF certified SC candidates establishing registered micro-enterprise or service outlet."
    },
    {
        "id": "PMAJAY-GIA-04",
        "name": "SC Development Corporation (SCDC) Margin Money Subsidy",
        "type": "State Venture Subsidy",
        "benefits": "Up to ₹50,000 or 50% project cost subsidy for group SHGs & cooperative societies in traditional arts and agriculture.",
        "eligibility": "SC Self-Help Groups (SHGs) with minimum 70% SC representation."
    }
]

# District Demand & Demographics
SEED_DISTRICT_DEMAND = [
    {
        "district": "Salem",
        "state": "Tamil Nadu",
        "topDemand": "Handloom Modernization, Organic Farming & Solar PV",
        "scPopulation": "18.4%",
        "activeBeneficiaries": 1420,
        "placementRate": "84%",
        "giaSanctioned": "₹ 1.45 Crores",
        "leadOfficer": "Dr. V. Rajesh, IAS (District Collector)",
        "priorityTrades": ["Master Weaver", "Organic Agri-Input", "Solar PV Installer"]
    },
    {
        "district": "Madurai",
        "state": "Tamil Nadu",
        "topDemand": "EV Scooter Maintenance & Digital Saksham",
        "scPopulation": "21.2%",
        "activeBeneficiaries": 1890,
        "placementRate": "82%",
        "giaSanctioned": "₹ 1.82 Crores",
        "leadOfficer": "Smt. M. Sangeetha, IAS",
        "priorityTrades": ["EV Scooter Service", "Data Entry Saksham", "Electronics Repair"]
    },
    {
        "district": "Villupuram",
        "state": "Tamil Nadu",
        "topDemand": "Bio-Inputs, Leather Crafts & Modern Apparel",
        "scPopulation": "28.6%",
        "activeBeneficiaries": 2310,
        "placementRate": "74%",
        "giaSanctioned": "₹ 2.10 Crores",
        "leadOfficer": "Thiru C. Palani, IAS",
        "priorityTrades": ["Organic Agri-Input", "Leather Crafts", "Swachhta Assistant"]
    },
    {
        "district": "Varanasi",
        "state": "Uttar Pradesh",
        "topDemand": "Handicrafts Jacquard & Rooftop Solar",
        "scPopulation": "19.8%",
        "activeBeneficiaries": 3100,
        "placementRate": "80%",
        "giaSanctioned": "₹ 2.75 Crores",
        "leadOfficer": "Shri S. Rajalingam, IAS",
        "priorityTrades": ["Master Weaver", "Solar PV Installer", "Data Entry Saksham"]
    },
    {
        "district": "Patna",
        "state": "Bihar",
        "topDemand": "Digital Saksham, EV Repair & Solar PV",
        "scPopulation": "16.5%",
        "activeBeneficiaries": 2750,
        "placementRate": "76%",
        "giaSanctioned": "₹ 2.20 Crores",
        "leadOfficer": "Dr. Chandrashekhar Singh, IAS",
        "priorityTrades": ["Data Entry Saksham", "EV Scooter Service", "Electronics Repair"]
    },
    {
        "district": "Warangal",
        "state": "Telangana",
        "topDemand": "Solar PV Rooftop, Handloom & Bio-Compost",
        "scPopulation": "20.1%",
        "activeBeneficiaries": 1640,
        "placementRate": "81%",
        "giaSanctioned": "₹ 1.60 Crores",
        "leadOfficer": "Smt. P. Pravinya, IAS",
        "priorityTrades": ["Solar PV Installer", "Organic Agri-Input", "Master Weaver"]
    }
]

# Certified Financial Consultants (NISM / PM-AJAY Certified)
SEED_FINANCIAL_CONSULTANTS = [
    {
        "id": "FC-SLM-01",
        "name": "Mr. R. Ramesh",
        "district": "Salem",
        "state": "Tamil Nadu",
        "phone": "+91 94432 10987",
        "email": "r.ramesh.mosje@pmajay.gov.in",
        "certification": "NISM-Series-V-A & MoSJE GIA Certified Advisor",
        "activeBeneficiaries": 42,
        "grantSanctioned": "₹ 18.5 Lakhs",
        "loansFacilitated": "₹ 48.0 Lakhs (Stand-Up India)",
        "status": "Active"
    },
    {
        "id": "FC-SLM-02",
        "name": "Smt. K. Kavitha",
        "district": "Salem",
        "state": "Tamil Nadu",
        "phone": "+91 98421 55670",
        "email": "kavitha.k@pmajay.gov.in",
        "certification": "State SC Corp Empanelled Financial Counselor",
        "activeBeneficiaries": 38,
        "grantSanctioned": "₹ 16.0 Lakhs",
        "loansFacilitated": "₹ 34.5 Lakhs (MUDRA)",
        "status": "Active"
    },
    {
        "id": "FC-MDU-01",
        "name": "Mr. S. Murugan",
        "district": "Madurai",
        "state": "Tamil Nadu",
        "phone": "+91 97890 44321",
        "email": "s.murugan@pmajay.gov.in",
        "certification": "NISM Certified Micro-Credit Advisor",
        "activeBeneficiaries": 55,
        "grantSanctioned": "₹ 24.2 Lakhs",
        "loansFacilitated": "₹ 62.0 Lakhs",
        "status": "Active"
    },
    {
        "id": "FC-VRN-01",
        "name": "Mr. A. K. Sharma",
        "district": "Varanasi",
        "state": "Uttar Pradesh",
        "phone": "+91 91234 88765",
        "email": "aksharma.up@pmajay.gov.in",
        "certification": "MoSJE Senior Financial Specialist",
        "activeBeneficiaries": 64,
        "grantSanctioned": "₹ 28.0 Lakhs",
        "loansFacilitated": "₹ 75.0 Lakhs",
        "status": "Active"
    },
    {
        "id": "FC-VLP-01",
        "name": "Thiru N. Baskaran",
        "district": "Villupuram",
        "state": "Tamil Nadu",
        "phone": "+91 94441 89012",
        "email": "baskaran.vlp@pmajay.gov.in",
        "certification": "District Lead Bank Financial Inclusion Trainer",
        "activeBeneficiaries": 49,
        "grantSanctioned": "₹ 21.5 Lakhs",
        "loansFacilitated": "₹ 51.0 Lakhs",
        "status": "Active"
    }
]

# Placement Pipeline & Post-Training Tracking Records
SEED_PLACEMENTS = [
    {
        "id": "PMAJAY-SC-2026-8841",
        "name": "Gowtham",
        "district": "Salem",
        "course": "Organic Agri-Input Producer (NSQF Level 4)",
        "status": "NSQF Certified",
        "outcomeType": "Self-Employment / Bio-Unit Enterprise",
        "employerOrUnit": "Kaveri Bio-Compost FPO Supplier Unit",
        "incomeOrSalary": "₹22,000 / month expected",
        "grantStatus": "Toolkit Grant Sanctioned (₹35,000)",
        "bankLoanStatus": "MUDRA Shishu Loan ₹50,000 Approved (Canara Bank)",
        "assignedConsultant": "Mr. R. Ramesh",
        "trainingCenter": "Government ITI Salem",
        "enrollmentDate": "2026-01-10",
        "completionDate": "2026-04-15"
    },
    {
        "id": "PMAJAY-SC-2026-8842",
        "name": "Kavitha R",
        "district": "Salem",
        "course": "Solar PV Rooftop Installer (NSQF Level 4)",
        "status": "In Training (Module 3)",
        "outcomeType": "Wage Employment",
        "employerOrUnit": "SunRay Green Energies Ltd (Signed LOI)",
        "incomeOrSalary": "₹18,500 / month + Incentives",
        "grantStatus": "Monthly Stipend Active (₹1,500/mo DBT)",
        "bankLoanStatus": "Not Applicable (Wage Job Track)",
        "assignedConsultant": "Smt. K. Kavitha",
        "trainingCenter": "Government ITI Salem",
        "enrollmentDate": "2026-02-01",
        "completionDate": "2026-05-30"
    },
    {
        "id": "PMAJAY-SC-2026-8843",
        "name": "M. Karthik",
        "district": "Madurai",
        "course": "Data Entry & Digital Saksham (NSQF Level 4)",
        "status": "Placed in Wage Job",
        "outcomeType": "Wage Employment",
        "employerOrUnit": "Madurai E-Seva Integrated Services Center",
        "incomeOrSalary": "₹16,500 / month (Verified Pay-slip)",
        "grantStatus": "Digital Kiosk Setup Grant Completed",
        "bankLoanStatus": "Completed",
        "assignedConsultant": "Mr. S. Murugan",
        "trainingCenter": "PM-AJAY Multi-Skilling Centre Madurai",
        "enrollmentDate": "2025-10-15",
        "completionDate": "2026-02-28"
    },
    {
        "id": "PMAJAY-SC-2026-8844",
        "name": "P. Lakshmi",
        "district": "Salem",
        "course": "Master Weaver & Handloom Stylist (NSQF Level 4)",
        "status": "Enterprise Started",
        "outcomeType": "SHG Enterprise (Leader)",
        "employerOrUnit": "Tharamangalam Sri Murugan SC Weavers SHG",
        "incomeOrSalary": "₹26,000 / month net revenue",
        "grantStatus": "Modernization Grant Released (₹50,000)",
        "bankLoanStatus": "Stand-Up India Loan ₹4.5 Lakhs Disbursed",
        "assignedConsultant": "Mr. R. Ramesh",
        "trainingCenter": "MoSJE Center of Excellence Tharamangalam",
        "enrollmentDate": "2025-09-01",
        "completionDate": "2026-01-20"
    },
    {
        "id": "PMAJAY-SC-2026-8845",
        "name": "D. Rajesh Kumar",
        "district": "Villupuram",
        "course": "Leather Goods & Ethnic Footwear Crafts (Level 3)",
        "status": "Toolkit Disbursed",
        "outcomeType": "Self-Employment",
        "employerOrUnit": "Rajesh Artisan Footwear Works",
        "incomeOrSalary": "₹19,000 / month",
        "grantStatus": "₹40,000 Leathercraft Machine Disbursed",
        "bankLoanStatus": "State SC Corp Margin Money ₹25,000 Approved",
        "assignedConsultant": "Thiru N. Baskaran",
        "trainingCenter": "District Skill Development Centre",
        "enrollmentDate": "2025-11-01",
        "completionDate": "2026-03-10"
    }
]

# Perspective Action Plans (5-Year Roadmap for Districts)
SEED_PERSPECTIVE_PLANS = [
    {
        "id": "PLAN-SLM-2026-30",
        "district": "Salem",
        "state": "Tamil Nadu",
        "targetYear": "2026-2030 (5-Year Plan)",
        "totalGiaBudget": "₹ 4.80 Crores",
        "annualBudget2026": "₹ 96 Lakhs",
        "totalTargetBeneficiaries": 2400,
        "targetBatches": [
            {"course": "Master Weaver & Handloom Stylist (Level 4)", "batches": 8, "capacity": 240, "clusterArea": "Tharamangalam / Jalakandapuram"},
            {"course": "Solar PV Rooftop Installer (Level 4)", "batches": 6, "capacity": 180, "clusterArea": "Salem Urban / Omalur"},
            {"course": "Organic Agri-Input Producer (Level 4)", "batches": 6, "capacity": 180, "clusterArea": "Mecheri / Attur"},
            {"course": "Electric Vehicle 2W/3W Service Specialist (Level 4)", "batches": 4, "capacity": 120, "clusterArea": "Salem City"}
        ],
        "budgetBreakdown": {
            "toolkitSubsidies": "₹ 42.0 Lakhs (43.75%)",
            "trainingCostToInstitutes": "₹ 28.5 Lakhs (29.68%)",
            "stipendDBTToBeneficiaries": "₹ 15.0 Lakhs (15.62%)",
            "consultantsHonorarium": "₹ 6.5 Lakhs (6.77%)",
            "mobilizationAndIEC": "₹ 4.0 Lakhs (4.16%)"
        },
        "financialConsultantsMapped": 4,
        "projectedPlacementRate": "86%",
        "status": "Approved by State SC Development Corporation",
        "lastUpdated": datetime.datetime.now().strftime("%Y-%m-%d")
    }
]

# Inter-Agency Coordination Tasks (MoSJE, SCDC, NSDC, District DIC)
SEED_COORDINATION_TASKS = [
    {
        "id": "TASK-COORD-101",
        "title": "NSQF Level 4 Practical Assessment Batch Approval",
        "initiator": "NSDC / Sector Skill Council",
        "responsibleAgency": "State SC Development Corporation (SCDC)",
        "district": "Salem",
        "targetGroup": "60 Solar PV Candidates (Batch 2)",
        "deadline": "2026-10-18",
        "status": "In Progress",
        "actionRequired": "Issue hall tickets and depute external certified assessor."
    },
    {
        "id": "TASK-COORD-102",
        "title": "Sanction of ₹50,000 Toolkit Grants Direct Benefit Transfer",
        "initiator": "District Industries Centre (DIC) - Salem",
        "responsibleAgency": "Ministry of Social Justice & Empowerment (MoSJE)",
        "district": "Salem",
        "targetGroup": "42 Certified Master Weavers",
        "deadline": "2026-10-25",
        "status": "Pending MoSJE Signoff",
        "actionRequired": "PFMS DBT payment batch release for approved PFMS beneficiary bank accounts."
    },
    {
        "id": "TASK-COORD-103",
        "title": "Stand-Up India Bank Loan Camp with District Lead Bank",
        "initiator": "Lead District Manager (Canara Bank)",
        "responsibleAgency": "Financial Consultants Team & SCDC",
        "district": "Madurai",
        "targetGroup": "35 Micro-Enterprise Applicants (EV & Digital Kiosk)",
        "deadline": "2026-11-02",
        "status": "Scheduled",
        "actionRequired": "Mobilize applicants with project reports and Mudra loan forms."
    },
    {
        "id": "TASK-COORD-104",
        "title": "Gram Panchayat Mobile Voice Kiosk Deployment Review",
        "initiator": "District Collectorate - Villupuram",
        "responsibleAgency": "Ground Technical Support & Village Facilitators",
        "district": "Villupuram",
        "targetGroup": "14 Gram Panchayats with >40% SC Population",
        "deadline": "2026-10-30",
        "status": "Completed",
        "actionRequired": "500+ voice profiles captured and geo-tagged."
    }
]

# In-memory working database
memory_db = {
    "beneficiary_profiles": {},
    "nsqf_qps": SEED_NSQF_QPS,
    "training_centers": SEED_TRAINING_CENTERS,
    "gia_schemes": SEED_GIA_SCHEMES,
    "district_demand": SEED_DISTRICT_DEMAND,
    "financial_consultants": SEED_FINANCIAL_CONSULTANTS,
    "placements": SEED_PLACEMENTS,
    "perspective_plans": SEED_PERSPECTIVE_PLANS,
    "coordination_tasks": SEED_COORDINATION_TASKS
}

def load_db_from_disk():
    global memory_db
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
                saved = json.load(f)
                for k, v in saved.items():
                    memory_db[k] = v
        except Exception as e:
            print("Notice: Error loading disk DB, using seed datasets:", e)

def save_db_to_disk():
    try:
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(memory_db, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print("Notice: Error saving DB to disk:", e)

# Initial load
load_db_from_disk()

# Prepopulate sample beneficiaries if empty
if not memory_db["beneficiary_profiles"]:
    sample_beneficiary = {
        "id": "PMAJAY-SC-2026-8841",
        "name": "Jeeva",
        "location": "Tharamangalam, Salem, Tamil Nadu",
        "district": "Salem",
        "state": "Tamil Nadu",
        "education": "10th Standard",
        "familyOccupation": "Handloom Weaving & Textiles",
        "currentSkills": "Traditional Handloom Weaving, warp and weft alignment, natural dyes",
        "currentActivity": "Assisting family pit loom, monthly income ₹7,500",
        "mobility": "Local (Within 15km / Tharamangalam Cluster)",
        "preference": "Self-Employment / SHG Modernization",
        "assignedConsultant": "Mr. R. Ramesh",
        "recommendedCourse": "Master Weaver & Handloom Stylist (Level 4)",
        "grantEligible": "₹50,000 Handloom Modernization Grant under PM-AJAY GIA",
        "created_at": datetime.datetime.now().isoformat()
    }
    memory_db["beneficiary_profiles"][sample_beneficiary["id"]] = sample_beneficiary
    save_db_to_disk()

def save_beneficiary_profile(profile_data: dict) -> str:
    count = len(memory_db["beneficiary_profiles"]) + 8841
    profile_id = profile_data.get("id") or f"PMAJAY-SC-2026-{count}"
    profile_data["id"] = profile_id
    profile_data["created_at"] = datetime.datetime.now().isoformat()

    # Assign nearest consultant if not already set
    if "assignedConsultant" not in profile_data or not profile_data["assignedConsultant"]:
        district = profile_data.get("district", "Salem")
        matching_fc = next((fc["name"] for fc in memory_db["financial_consultants"] if fc["district"].lower() in district.lower()), "Mr. R. Ramesh")
        profile_data["assignedConsultant"] = matching_fc

    memory_db["beneficiary_profiles"][profile_id] = profile_data

    # Add / update placement pipeline entry
    existing_placement = next((p for p in memory_db["placements"] if p["id"] == profile_id), None)
    if not existing_placement:
        memory_db["placements"].insert(0, {
            "id": profile_id,
            "name": profile_data.get("name", "Beneficiary"),
            "district": profile_data.get("district") or profile_data.get("location", "Salem").split(",")[0].strip(),
            "course": profile_data.get("recommendedCourse", "Organic Agri-Input / Solar PV / Weaver"),
            "status": "Enrolled & Profile Verified",
            "outcomeType": profile_data.get("preference", "Self-Employment"),
            "employerOrUnit": "Pending Training Completion",
            "incomeOrSalary": "Projected ₹18,000 / month",
            "grantStatus": "Eligible for Toolkit Grant",
            "bankLoanStatus": "Assigned to " + profile_data["assignedConsultant"],
            "assignedConsultant": profile_data["assignedConsultant"],
            "trainingCenter": "Government ITI / MoSJE Center",
            "enrollmentDate": datetime.date.today().strftime("%Y-%m-%d"),
            "completionDate": (datetime.date.today() + datetime.timedelta(days=90)).strftime("%Y-%m-%d")
        })

    save_db_to_disk()

    # Fast MongoDB sync if configured
    try:
        from pymongo import MongoClient
        client = MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=200, socketTimeoutMS=200)
        db = client[settings.DATABASE_NAME]
        db.beneficiary_profiles.replace_one({"id": profile_id}, profile_data.copy(), upsert=True)
    except Exception:
        pass

    return profile_id

def get_beneficiary_profile(profile_id: str):
    return memory_db["beneficiary_profiles"].get(profile_id)

def get_all_beneficiary_profiles():
    return list(memory_db["beneficiary_profiles"].values())

def get_all_nsqf_qps():
    return memory_db["nsqf_qps"]

def get_all_training_centers():
    return memory_db["training_centers"]

def get_all_gia_schemes():
    return memory_db["gia_schemes"]

def get_district_demand():
    return memory_db["district_demand"]

def get_all_financial_consultants():
    return memory_db["financial_consultants"]

def add_financial_consultant(fc_data: dict):
    fc_id = f"FC-{fc_data.get('district', 'GEN')[:3].upper()}-{len(memory_db['financial_consultants']) + 1:02d}"
    fc_data["id"] = fc_id
    memory_db["financial_consultants"].append(fc_data)
    save_db_to_disk()
    return fc_data

def get_all_placements():
    return memory_db["placements"]

def update_placement_status(record_id: str, new_status: str, outcome_type: str = None, employer_or_unit: str = None, income: str = None):
    for p in memory_db["placements"]:
        if p["id"] == record_id:
            p["status"] = new_status
            if outcome_type: p["outcomeType"] = outcome_type
            if employer_or_unit: p["employerOrUnit"] = employer_or_unit
            if income: p["incomeOrSalary"] = income
            save_db_to_disk()
            return p
    return None

def get_all_perspective_plans():
    return memory_db["perspective_plans"]

def save_perspective_plan(plan_data: dict):
    plan_id = f"PLAN-{plan_data.get('district', 'SLM')[:3].upper()}-{datetime.date.today().year}"
    plan_data["id"] = plan_id
    plan_data["lastUpdated"] = datetime.date.today().strftime("%Y-%m-%d")
    
    # Check if plan for this district already exists, replace or append
    for idx, p in enumerate(memory_db["perspective_plans"]):
        if p.get("district", "").lower() == plan_data.get("district", "").lower():
            memory_db["perspective_plans"][idx] = plan_data
            save_db_to_disk()
            return plan_data

    memory_db["perspective_plans"].append(plan_data)
    save_db_to_disk()
    return plan_data

def get_all_coordination_tasks():
    return memory_db["coordination_tasks"]

def update_coordination_task(task_id: str, status: str):
    for task in memory_db["coordination_tasks"]:
        if task["id"] == task_id:
            task["status"] = status
            save_db_to_disk()
            return task
    return None
