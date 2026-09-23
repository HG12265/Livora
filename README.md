# Livora — AI-Driven Voice Assistant for Livelihood Mapping & NSQF Skilling Recommendations (PS 26097)

**Ministry**: Ministry of Social Justice and Empowerment (MoSJE)  
**Department**: Department of Social Justice and Empowerment  
**Scheme**: Grant-in-Aid (GIA) component of PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana)  
**Hackathon**: Smart India Hackathon 2026  

---

## 🚀 Overview

**Livora** is an end-to-end, voice-first AI platform built to reduce poverty and empower Scheduled Caste (SC) communities. Replacing complex, text-heavy forms with natural voice interactions in regional languages (Tamil, Hindi, Telugu, English), Livora conducts empathetic conversational interviews to extract beneficiary aspirations and map them to official **NSQF Qualification Packs (Levels 1–7)**, local economic realities, **PM-AJAY GIA toolkit grants**, and post-training placement support.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Web Speech API (STT & TTS), Tailwind CSS, Lucide Icons
- **Backend**: Python FastAPI, Uvicorn
- **Database**: MongoDB (PyMongo / Motor) with fallback seed store
- **AI Model**: Google Gemini API for natural voice transcript profiling & GIA action plan generation

---

## 🌟 Key Features

1. **Multilingual Voice Interview Engine**: Live speech recognition and audio visualizer interviewing beneficiaries in regional languages & local dialects.
2. **AI/ML Profiling & NSQF Alignment**: Dynamic match scoring against official NCVET/NSDC Qualification Packs (Solar PV Installer, Master Weaver, Organic Agri-Input Producer, Data Entry Saksham).
3. **PM-AJAY GIA Grant Mapping**: ₹35,000–₹50,000 toolkit grants, 100% subsidized training, daily stipends, Stand-Up India loans, and geo-located ITI training centers.
4. **Digital Voice-QR Passbook**: Official government-style beneficiary card with QR code and audio playback summary.
5. **Multi-Channel Accessibility**:
   - **IVR Toll-Free Phone Call Simulator** (`*1800-PMAJAY#`) for feature phone users.
   - **WhatsApp Voice Note Bot Simulator**.
6. **MoSJE Admin Dashboard & Ground Engine**: District livelihood heatmap, trained Financial Consultant assignment, placement lifecycle pipeline, and AI Perspective Plan PDF exporter.

---

## 🏃 Getting Started

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
API Documentation available at `http://127.0.0.1:8000/docs`.
