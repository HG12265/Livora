import json
import os
import datetime
from config import settings

# Seed datasets for NSQF Qualification Packs
SEED_NSQF_QPS = [
    {
        "id": "ELE/Q5901",
        "role": "Solar PV Installer & Technician",
        "sector": "Renewable Energy & Green Skills",
        "level": 4,
        "durationHours": 300,
        "entryReq": "10th Pass / Basic Technical Aptitude",
        "description": "Install, test, and maintain rooftop and off-grid solar photovoltaic systems.",
        "skillGaps": ["AC/DC Inverter Testing", "Safety Standards & Earthing"],
        "outcomes": "Wage employment in green energy firms or self-employed solar technician.",
        "avgSalary": "₹16,000 - ₹24,000 / month",
        "giaToolkitGrant": "₹45,000 Toolkit Subsidy under PM-AJAY GIA"
    },
    {
        "id": "AMH/Q1947",
        "role": "Master Weaver & Handloom Stylist",
        "sector": "Handicrafts & Apparel",
        "level": 4,
        "durationHours": 350,
        "entryReq": "Traditional Weaving Skill / 8th Pass",
        "description": "Modern jacquard weaving techniques, organic dyeing, and e-commerce product design.",
        "skillGaps": ["Natural Dye Formulation", "Digital Cataloging for Online Markets"],
        "outcomes": "Handloom cluster artisan, SHG enterprise leader.",
        "avgSalary": "₹18,000 - ₹28,000 / month",
        "giaToolkitGrant": "₹50,000 Handloom Modernization Grant under PM-AJAY GIA"
    },
    {
        "id": "AGR/Q4801",
        "role": "Organic Agri-Input Producer",
        "sector": "Agriculture & Allied",
        "level": 4,
        "durationHours": 200,
        "entryReq": "8th Pass / Agricultural background",
        "description": "Production of bio-fertilizers, vermicompost, and organic pest management solutions.",
        "skillGaps": ["Quality Testing & Soil pH Analysis", "Packaging & FPO Marketing"],
        "outcomes": "Agri-entrepreneur, bio-input supplier to local Farmers Producer Organizations.",
        "avgSalary": "₹15,000 - ₹22,000 / month",
        "giaToolkitGrant": "₹35,000 Bio-Unit Setup Support"
    },
    {
        "id": "SSC/Q2212",
        "role": "Data Entry & Digital Saksham Operator",
        "sector": "IT-ITES & Digital Services",
        "level": 4,
        "durationHours": 400,
        "entryReq": "10th Pass / Basic Computer Familiarity",
        "description": "Data digitization, online government service portal operations, and e-governance support.",
        "skillGaps": ["Advanced Excel & Tally Data", "Regional Language Keyboard Typing"],
        "outcomes": "Common Service Center (CSC) operator, BPO desk associate.",
        "avgSalary": "₹14,000 - ₹20,000 / month",
        "giaToolkitGrant": "₹30,000 Digital Kiosk Setup Grant"
    }
]

# Fast, zero-latency In-Memory Database store
in_memory_profiles = {}

def save_beneficiary_profile(profile_data: dict) -> str:
    profile_id = f"PMAJAY-SC-2026-{len(in_memory_profiles) + 8841}"
    profile_data["id"] = profile_id
    profile_data["created_at"] = datetime.datetime.now().isoformat()
    
    # Save instantly to memory store
    in_memory_profiles[profile_id] = profile_data

    # Optional fast MongoDB insert attempt with strict 300ms timeout
    try:
        from pymongo import MongoClient
        client = MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=300, socketTimeoutMS=300)
        db = client[settings.DATABASE_NAME]
        db.beneficiary_profiles.insert_one(profile_data.copy())
    except Exception as err:
        pass # Zero-delay fallback

    return profile_id

def get_beneficiary_profile(profile_id: str):
    return in_memory_profiles.get(profile_id)

def get_all_beneficiary_profiles():
    return list(in_memory_profiles.values())

def get_all_nsqf_qps():
    return SEED_NSQF_QPS
