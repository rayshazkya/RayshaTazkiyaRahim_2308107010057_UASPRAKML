"use client";
import ReactMarkdown from "react-markdown";

interface TopK { label: string; confidence: number; }
interface PredictResult {
  prediction: string; confidence: number; top_k: TopK[];
  gemini_available: boolean; ai_insights: string | null; gemini_error: string | null;
}

const Divider = () => (
  <div style={{ display:"flex", alignItems:"center", gap:12, margin:"22px 0" }}>
    <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg, transparent, rgba(109,186,122,0.25))" }} />
    <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(109,186,122,0.15)" stroke="rgba(109,186,122,0.5)" strokeWidth="1.4">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    </svg>
    <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg, rgba(109,186,122,0.25), transparent)" }} />
  </div>
);

export default function ResultCard({ result }: { result: PredictResult }) {
  const { prediction, confidence, top_k, gemini_available, ai_insights, gemini_error } = result;
  const fmt = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const confColor = confidence >= 70 ? "var(--green)" : confidence >= 40 ? "var(--gold)" : "#e07070";

  return (
    <div style={{ background:"rgba(12,24,14,0.82)", backdropFilter:"blur(20px)", border:"1px solid var(--border2)", borderRadius:18, overflow:"hidden", boxShadow:"0 12px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(109,186,122,0.08)" }}>

      {/* accent bar */}
      <div style={{ height:2, background:"linear-gradient(90deg, var(--green-deep), var(--green), rgba(200,168,107,0.6), transparent)" }} />

      <div style={{ padding:"26px 26px 30px" }}>

        {/* ── Hasil Identifikasi ── */}
        <p style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.62rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:14 }}>
          Hasil Identifikasi
        </p>

        <div style={{ marginBottom:22 }}>
          <p style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:5 }}>Nama</p>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"2.1rem", fontWeight:400, fontStyle:"italic", color:"var(--text)", lineHeight:1.1, marginBottom:18 }}>
            {fmt(prediction)}
          </h2>

          <p style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:10 }}>Confidence</p>

          {/* Main bar */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
            <div style={{ flex:1, height:4, background:"rgba(255,255,255,0.05)", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${confidence}%`, background:`linear-gradient(90deg, ${confColor}, rgba(200,168,107,0.6))`, borderRadius:2, transition:"width 1s ease", boxShadow:`0 0 8px ${confColor}50` }} />
            </div>
            <span style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.95rem", color:confColor, minWidth:52, textAlign:"right" }}>
              {confidence}%
            </span>
          </div>

          {/* Alt predictions */}
          <div style={{ display:"flex", flexDirection:"column", gap:7, padding:"14px 16px", background:"rgba(255,255,255,0.02)", borderRadius:10, border:"1px solid rgba(109,186,122,0.08)" }}>
            {top_k.slice(1).map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:"0.78rem", color:"var(--text-muted)", flex:1, fontStyle:"italic" }}>{fmt(item.label)}</span>
                <div style={{ width:90, height:2, background:"rgba(255,255,255,0.05)", borderRadius:1, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${item.confidence}%`, background:"rgba(109,186,122,0.3)", borderRadius:1 }} />
                </div>
                <span style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.68rem", color:"var(--text-muted)", minWidth:38, textAlign:"right" }}>{item.confidence}%</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ── AI Insights ── */}
        <p style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.62rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background: gemini_available ? "var(--green)" : "rgba(255,255,255,0.15)", boxShadow: gemini_available ? "0 0 6px var(--green)" : "none" }} />
          Informasi Spesies
        </p>

        {gemini_available && ai_insights ? (
          <div className="prose-insect">
            <ReactMarkdown>{ai_insights}</ReactMarkdown>
          </div>
        ) : (
          <div style={{ padding:"16px 18px", borderRadius:11, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontFamily:"'Playfair Display', serif", fontStyle:"italic", fontSize:"0.95rem", color:"var(--text-muted)", marginBottom: gemini_error ? 6 : 0 }}>
              Informasi AI tidak tersedia saat ini.
            </p>
            {gemini_error && (
              <p style={{ fontFamily:"'DM Mono', monospace", fontSize:"0.68rem", color:"rgba(255,255,255,0.2)", lineHeight:1.6 }}>
                {gemini_error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
