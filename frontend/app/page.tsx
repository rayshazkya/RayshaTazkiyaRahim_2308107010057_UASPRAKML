"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ResultCard from "@/components/ResultCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface PredictResult {
  prediction: string;
  confidence: number;
  top_k: { label: string; confidence: number }[];
  gemini_available: boolean;
  ai_insights: string | null;
  gemini_error: string | null;
}

/* ── Decorative SVG leaves ── */
function BgLeaves() {
  return (
    <svg style={{ position:"fixed", inset:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none", opacity:0.07 }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      {/* top-left large leaf */}
      <g transform="translate(-60,20) rotate(-25)" fill="none" stroke="#6dba7a" strokeWidth="0.8">
        <ellipse cx="160" cy="200" rx="80" ry="180"/>
        <line x1="160" y1="20" x2="160" y2="380"/>
        <line x1="160" y1="100" x2="100" y2="160"/><line x1="160" y1="100" x2="220" y2="160"/>
        <line x1="160" y1="160" x2="90" y2="230"/><line x1="160" y1="160" x2="230" y2="230"/>
        <line x1="160" y1="230" x2="95" y2="300"/><line x1="160" y1="230" x2="225" y2="300"/>
        <line x1="160" y1="290" x2="110" y2="350"/><line x1="160" y1="290" x2="210" y2="350"/>
      </g>
      {/* bottom-right leaf */}
      <g transform="translate(1320,700) rotate(40)" fill="none" stroke="#6dba7a" strokeWidth="0.8">
        <ellipse cx="80" cy="120" rx="55" ry="130"/>
        <line x1="80" y1="0" x2="80" y2="240"/>
        <line x1="80" y1="60" x2="35" y2="110"/><line x1="80" y1="60" x2="125" y2="110"/>
        <line x1="80" y1="120" x2="30" y2="175"/><line x1="80" y1="120" x2="130" y2="175"/>
        <line x1="80" y1="175" x2="40" y2="220"/><line x1="80" y1="175" x2="120" y2="220"/>
      </g>
      {/* top-right small fern */}
      <g transform="translate(1200,−20) rotate(10)" fill="none" stroke="#c8a86b" strokeWidth="0.6">
        <ellipse cx="200" cy="80" rx="35" ry="90"/>
        <line x1="200" y1="0" x2="200" y2="160"/>
        <line x1="200" y1="40" x2="170" y2="70"/><line x1="200" y1="40" x2="230" y2="70"/>
        <line x1="200" y1="80" x2="165" y2="115"/><line x1="200" y1="80" x2="235" y2="115"/>
        <line x1="200" y1="120" x2="172" y2="148"/><line x1="200" y1="120" x2="228" y2="148"/>
      </g>
      {/* bottom-left small */}
      <g transform="translate(30,760) rotate(-15)" fill="none" stroke="#c8a86b" strokeWidth="0.6">
        <ellipse cx="60" cy="70" rx="28" ry="75"/>
        <line x1="60" y1="0" x2="60" y2="140"/>
        <line x1="60" y1="35" x2="38" y2="60"/><line x1="60" y1="35" x2="82" y2="60"/>
        <line x1="60" y1="75" x2="35" y2="100"/><line x1="60" y1="75" x2="85" y2="100"/>
        <line x1="60" y1="110" x2="40" y2="132"/><line x1="60" y1="110" x2="80" y2="132"/>
      </g>
    </svg>
  );
}

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<PredictResult | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted.length) return;
    const f = accepted[0];
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/*": [".jpg",".jpeg",".png",".webp"] }, multiple: false,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`${API_URL}/predict`, { method: "POST", body });
      if (!res.ok) { const d = await res.json().catch(()=>({})); throw new Error(d.detail ?? `Error ${res.status}`); }
      setResult(await res.json());
    } catch(e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally { setLoading(false); }
  };

  const handleReset = () => { setPreview(null); setFile(null); setResult(null); setError(null); };

  return (
    <main style={{ position:"relative", zIndex:1, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", padding:"0 16px 80px" }}>
      <BgLeaves />

      {/* ── Header ── */}
      <header style={{ position:"relative", zIndex:1, width:"100%", maxWidth:600, paddingTop:44, paddingBottom:28, marginBottom:28 }}>
        {/* top rule */}
        <div style={{ height:1, background:"linear-gradient(90deg, transparent, rgba(109,186,122,0.4), transparent)", marginBottom:28 }} />

        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(109,186,122,0.12)", border:"1px solid rgba(109,186,122,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:"1.65rem", fontWeight:400, color:"var(--text)", letterSpacing:"-0.01em" }}>
                Lens<span style={{ color:"var(--green)", fontStyle:"italic" }}>Arthropoda</span>
              </h1>
            </div>
            <p style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.65rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--text-muted)", paddingLeft:42 }}>
              AI-Powered Insect Detection
            </p>
          </div>
          <div style={{ textAlign:"right", paddingTop:4 }}>
            <p style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.62rem", color:"var(--text-muted)", lineHeight:1.7 }}>
              118 species<br/>EfficientNet-B3
            </p>
          </div>
        </div>

        {/* bottom rule */}
        <div style={{ height:1, background:"linear-gradient(90deg, transparent, rgba(109,186,122,0.4), transparent)", marginTop:24 }} />
      </header>

      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:600 }}>

        {/* ── Dropzone ── */}
        <div
          {...getRootProps()}
          className="glass"
          style={{
            borderRadius:18,
            border: isDragActive ? "1.5px solid var(--green)" : "1px solid var(--border2)",
            background: isDragActive ? "rgba(109,186,122,0.06)" : "rgba(14,26,16,0.7)",
            backdropFilter:"blur(20px)",
            minHeight: preview ? "auto" : 220,
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", overflow:"hidden",
            transition:"border-color 0.2s, background 0.2s",
            marginBottom:14,
            boxShadow: isDragActive ? "0 0 0 3px rgba(109,186,122,0.1), 0 8px 40px rgba(0,0,0,0.4)" : "0 8px 40px rgba(0,0,0,0.35)",
            animation: !preview ? "pulse-glow 4s ease-in-out infinite" : "none",
          }}
        >
          <input {...getInputProps()} />
          {preview ? (
            <img src={preview} alt="Preview" style={{ width:"100%", maxHeight:360, objectFit:"contain" }} />
          ) : (
            <div style={{ textAlign:"center", padding:"3.5rem 2rem" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(109,186,122,0.08)", border:"1px solid rgba(109,186,122,0.2)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
              </div>
              <p style={{ fontWeight:500, fontSize:"0.95rem", color:"var(--text)", marginBottom:6 }}>
                {isDragActive ? "Lepaskan gambar di sini" : "Unggah gambar serangga"}
              </p>
              <p style={{ fontSize:"0.78rem", color:"var(--text-muted)" }}>Drag & drop atau klik untuk memilih</p>
              <p style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.68rem", color:"var(--text-muted)", marginTop:5, letterSpacing:"0.08em" }}>JPG · PNG · WEBP</p>
            </div>
          )}
        </div>

        {/* ── Buttons ── */}
        <div style={{ display:"flex", gap:10, marginBottom:28 }}>
          <label style={{
            flex:1, padding:"12px 0", borderRadius:11,
            border:"1px solid var(--border2)",
            background:"rgba(255,255,255,0.03)",
            color:"var(--text-mid)", fontFamily:"'Outfit', sans-serif",
            fontWeight:500, fontSize:"0.83rem", letterSpacing:"0.04em",
            textAlign:"center", cursor:"pointer", transition:"all 0.18s",
            backdropFilter:"blur(8px)",
          }}>
            Pilih Gambar
            <input type="file" accept="image/*" style={{ display:"none" }}
              onChange={e => { const f=e.target.files?.[0]; if(f){setFile(f);setPreview(URL.createObjectURL(f));setResult(null);setError(null);}}} />
          </label>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            style={{
              flex:2, padding:"12px 0", borderRadius:11, border:"none",
              background: file && !loading
                ? "linear-gradient(135deg, var(--green-deep) 0%, var(--green) 100%)"
                : "rgba(255,255,255,0.05)",
              color: file && !loading ? "#fff" : "var(--text-muted)",
              fontFamily:"'Outfit', sans-serif", fontWeight:500,
              fontSize:"0.83rem", letterSpacing:"0.1em", textTransform:"uppercase",
              cursor: file && !loading ? "pointer" : "not-allowed",
              transition:"all 0.2s",
              boxShadow: file && !loading ? "0 4px 20px rgba(109,186,122,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" : "none",
            }}
          >
            {loading ? (
              <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <svg style={{ animation:"spin 0.9s linear infinite" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Menganalisis
              </span>
            ) : "Analisis Serangga"}
          </button>

          {preview && (
            <button onClick={handleReset} style={{
              padding:"12px 15px", borderRadius:11,
              border:"1px solid var(--border)", background:"transparent",
              color:"var(--text-muted)", fontFamily:"'Outfit', sans-serif",
              fontSize:"0.82rem", cursor:"pointer", transition:"all 0.18s",
            }}>Reset</button>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign:"center", padding:"28px 0", animation:"fadeUp 0.4s ease" }}>
            <div style={{ width:160, height:2, background:"rgba(109,186,122,0.1)", borderRadius:1, margin:"0 auto 16px", overflow:"hidden", position:"relative" }}>
              <div style={{ position:"absolute", height:"100%", width:"50%", background:"linear-gradient(90deg, transparent, var(--green), transparent)", borderRadius:1, animation:"shimmer-bar 1.4s ease-in-out infinite" }} />
            </div>
            <p style={{ fontFamily:"'Playfair Display', serif", fontSize:"1rem", fontStyle:"italic", color:"var(--text-mid)" }}>
              Mengidentifikasi spesies...
            </p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={{ padding:"13px 16px", borderRadius:11, background:"rgba(180,80,80,0.08)", border:"1px solid rgba(180,80,80,0.2)", color:"#e07070", fontSize:"0.85rem", marginBottom:16, animation:"fadeUp 0.4s ease" }}>
            {error}
          </div>
        )}

        {/* ── Result ── */}
        {result && !loading && (
          <div style={{ animation:"fadeUp 0.5s ease" }}>
            <ResultCard result={result} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ position:"relative", zIndex:1, marginTop:48, fontFamily:"'DM Mono', monospace", fontSize:"0.65rem", letterSpacing:"0.1em", color:"var(--text-muted)", textAlign:"center" }}>
        LensArthropoda · EfficientNet-B3 · 118 species
      </footer>
    </main>
  );
}
