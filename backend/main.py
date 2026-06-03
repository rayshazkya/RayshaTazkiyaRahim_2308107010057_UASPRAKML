from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from ml_service import get_classifier
from gemini_service import get_insect_insights


# ── Startup: load model sekali saat server nyala ──────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[Startup] Loading model...")
    get_classifier()
    print("[Startup] Model ready!")
    yield
    print("[Shutdown] Server stopped.")


app = FastAPI(
    title="LensArthropoda API",
    description="Smart Insect Identifier powered by EfficientNet-B3 + Gemini",
    version="1.0.0",
    lifespan=lifespan
)

# CORS: izinkan frontend Next.js akses backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "LensArthropoda API is running 🐛"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint utama:
    1. Terima gambar dari user
    2. Jalankan inference model ML
    3. Panggil Gemini untuk insights
    4. Return hasil gabungan
    """
    # Validasi tipe file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar.")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="File gambar kosong.")

    # ── 1. Prediksi dengan model ML ──────────────────────────────────────────
    try:
        classifier  = get_classifier()
        ml_result   = classifier.predict(image_bytes, top_k=3)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saat inference: {str(e)}")

    insect_name = ml_result["prediction"]
    confidence  = ml_result["confidence"]

    # ── 2. Insights dari Gemini (dengan fallback) ─────────────────────────────
    gemini_result = get_insect_insights(insect_name, confidence)

    # ── 3. Susun response ─────────────────────────────────────────────────────
    response = {
        "prediction":       insect_name,
        "confidence":       confidence,
        "top_k":            ml_result["top_k"],
        "gemini_available": gemini_result["success"],
        "ai_insights":      gemini_result["content"],   # None jika Gemini gagal
        "gemini_error":     gemini_result["error"],     # None jika Gemini sukses
    }

    return response
