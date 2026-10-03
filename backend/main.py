from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import voice, nsqf, admin, schemes

app = FastAPI(
    title="Livora - PM-AJAY AI Voice Assistant API (PS 26097)",
    description="Production-Grade FastAPI service powered by Gemini AI & MongoDB for NSQF alignment and PM-AJAY GIA recommendations.",
    version="2.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount APIRouters
app.include_router(voice.router)
app.include_router(nsqf.router)
app.include_router(schemes.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Livora PM-AJAY AI Voice Assistant",
        "version": "2.0.0",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "endpoints": [
            "/api/voice/process",
            "/api/voice/profiles",
            "/api/nsqf/courses",
            "/api/nsqf/match",
            "/api/schemes/all",
            "/api/schemes/centers",
            "/api/admin/heatmap",
            "/api/admin/consultants",
            "/api/admin/placements",
            "/api/admin/perspective-plans",
            "/api/admin/generate-plan",
            "/api/admin/coordination-tasks"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    from config import settings
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
