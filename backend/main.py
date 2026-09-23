from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import voice, nsqf, admin

app = FastAPI(
    title="Livora - PM-AJAY AI Voice Assistant API (PS 26097)",
    description="Production-Grade FastAPI service powered by Gemini AI & MongoDB for NSQF alignment and PM-AJAY GIA recommendations.",
    version="1.0.0"
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
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Livora PM-AJAY AI Voice Assistant",
        "version": "1.0.0",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "endpoints": [
            "/api/voice/process",
            "/api/nsqf/match",
            "/api/admin/heatmap",
            "/api/admin/generate-plan"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
