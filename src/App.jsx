import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════
   BB BASE THEME — Attio-inspired app chrome
   ═══════════════════════════════════════════ */
const bb = {
  bg: "#ffffff", bgSubtle: "#fafafa", bgMuted: "#f5f5f5",
  bgHover: "#f0f0f0", bgActive: "#ebebeb", bgInverse: "#171717",
  accent: "#171717", accentHover: "#262626",
  text: "#171717", ts: "#6b6b6b", tt: "#a3a3a3", ti: "#ffffff",
  border: "#e5e5e5", bs: "#f0f0f0", bst: "#d4d4d4",
  ring: "rgba(0,0,0,0.08)",
  sh: { xs: "0 1px 2px rgba(0,0,0,0.04)", sm: "0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)", md: "0 4px 8px -1px rgba(0,0,0,0.06),0 2px 4px -2px rgba(0,0,0,0.04)", lg: "0 10px 20px -3px rgba(0,0,0,0.08)" },
  r: { sm: 6, md: 8, lg: 12, xl: 16 },
  font: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
  t: "all 0.15s ease",
};

const WORDS = [
  "Innovative","Friendly","Premium","Bold","Minimal","Warm","Sophisticated","Approachable",
  "Trustworthy","Dynamic","Elegant","Playful","Professional","Rebellious","Sustainable",
  "Luxurious","Technical","Human","Clean","Expressive","Authoritative","Whimsical",
  "Transparent","Energetic","Refined","Inclusive","Futuristic","Organic","Geometric",
  "Confident","Calm","Vibrant","Nostalgic","Crisp","Artisanal","Edgy","Sincere",
  "Ambitious","Cozy","Disruptive",
];

const SPECTRUMS = [["Traditional","Progressive"],["Serious","Playful"],["Understated","Bold"],["Simple","Complex"]];

const RECO_SITES = [
  { name: "Attio", url: "attio.com", desc: "Clean Apple-like minimalism, refined CRM" },
  { name: "Vercel", url: "vercel.com", desc: "Dark, sharp, modern developer brand" },
  { name: "Linear", url: "linear.app", desc: "Ultra-polished, fast, premium tool" },
  { name: "Stripe", url: "stripe.com", desc: "Gradient-rich, editorial, premium" },
  { name: "Notion", url: "notion.so", desc: "Warm, friendly, clean with illustration" },
  { name: "Figma", url: "figma.com", desc: "Colorful, creative, bold and energetic" },
  { name: "Okta", url: "okta.com", desc: "Enterprise trust, clean, corporate" },
  { name: "Hightouch", url: "hightouch.com", desc: "Purple-forward, modern data brand" },
  { name: "Arc", url: "arc.net", desc: "Playful, warm gradients, unconventional" },
  { name: "Raycast", url: "raycast.com", desc: "Dark, sleek keyboard-first tool" },
];

// Curated picsum seeds that produce visually interesting design-adjacent images
const CURATED_IMAGES = [
  { id: "m1", url: "https://picsum.photos/seed/arch42/640/460", desc: "architecture" },
  { id: "m2", url: "https://picsum.photos/seed/minimal88/640/460", desc: "minimal" },
  { id: "m3", url: "https://picsum.photos/seed/nature21/640/460", desc: "organic" },
  { id: "m4", url: "https://picsum.photos/seed/abstract77/640/460", desc: "abstract" },
  { id: "m5", url: "https://picsum.photos/seed/texture55/640/460", desc: "texture" },
  { id: "m6", url: "https://picsum.photos/seed/color33/640/460", desc: "color" },
  { id: "m7", url: "https://picsum.photos/seed/studio19/640/460", desc: "studio" },
  { id: "m8", url: "https://picsum.photos/seed/geo44/640/460", desc: "geometry" },
  { id: "m9", url: "https://picsum.photos/seed/space66/640/460", desc: "space" },
  { id: "m10", url: "https://picsum.photos/seed/warm11/640/460", desc: "warm" },
  { id: "m11", url: "https://picsum.photos/seed/bold99/640/460", desc: "bold" },
  { id: "m12", url: "https://picsum.photos/seed/calm22/640/460", desc: "calm" },
  { id: "m13", url: "https://picsum.photos/seed/dark45/640/460", desc: "dark" },
  { id: "m14", url: "https://picsum.photos/seed/light78/640/460", desc: "light" },
  { id: "m15", url: "https://picsum.photos/seed/retro56/640/460", desc: "retro" },
  { id: "m16", url: "https://picsum.photos/seed/fresh34/640/460", desc: "fresh" },
  { id: "m17", url: "https://picsum.photos/seed/urban12/640/460", desc: "urban" },
  { id: "m18", url: "https://picsum.photos/seed/ocean88/640/460", desc: "ocean" },
  { id: "m19", url: "https://picsum.photos/seed/earth65/640/460", desc: "earth" },
  { id: "m20", url: "https://picsum.photos/seed/neon43/640/460", desc: "neon" },
  { id: "m21", url: "https://picsum.photos/seed/pastel91/640/460", desc: "soft" },
  { id: "m22", url: "https://picsum.photos/seed/concrete7/640/460", desc: "concrete" },
  { id: "m23", url: "https://picsum.photos/seed/luxe50/640/460", desc: "luxe" },
  { id: "m24", url: "https://picsum.photos/seed/tech38/640/460", desc: "tech" },
];

/* ── API ── */
async function callClaudeJSON(prompt) {
  const res = await fetch("/api/anthropic/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

/* ── BB Components ── */
const Tag = ({ children, selected, onClick, small }) => (
  <button onClick={onClick} style={{
    padding: small ? "3px 10px" : "5px 14px", fontSize: small ? 11 : 13,
    fontFamily: bb.font, fontWeight: 450,
    background: selected ? bb.accent : bb.bg,
    color: selected ? bb.ti : bb.ts,
    border: `1px solid ${selected ? bb.accent : bb.border}`,
    borderRadius: 100, cursor: "pointer", transition: bb.t, lineHeight: 1.4,
  }}>{children}</button>
);

const Btn = ({ children, variant = "primary", disabled, onClick, style: sx }) => {
  const v = {
    primary: { background: disabled ? bb.bgActive : bb.accent, color: disabled ? bb.tt : bb.ti, border: "none" },
    secondary: { background: bb.bg, color: bb.ts, border: `1px solid ${bb.border}` },
    ghost: { background: "transparent", color: bb.tt, border: "none" },
  };
  return <button onClick={onClick} disabled={disabled} style={{
    padding: "7px 14px", fontSize: 12, fontFamily: bb.font, fontWeight: 500,
    borderRadius: bb.r.md, cursor: disabled ? "not-allowed" : "pointer",
    transition: bb.t, display: "inline-flex", alignItems: "center", gap: 5,
    ...v[variant], ...sx,
  }}>{children}</button>;
};

const SL = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: bb.tt, fontFamily: bb.font, marginBottom: 10 }}>{children}</div>
);

const Shell = ({ children, mw = 640 }) => (
  <div style={{ minHeight: "100vh", background: bb.bgSubtle, fontFamily: bb.font, display: "flex", justifyContent: "center", padding: "40px 20px" }}>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700&display=swap" rel="stylesheet" />
    <div style={{ maxWidth: mw, width: "100%" }}>{children}</div>
  </div>
);

const Header = ({ step, title, subtitle }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ width: 26, height: 26, borderRadius: bb.r.sm, background: bb.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: bb.ti, fontSize: 12, fontWeight: 700 }}>D</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: bb.text }}>Design System Generator</span>
      {step && <span style={{ fontSize: 11, color: bb.tt, marginLeft: "auto", background: bb.bgMuted, padding: "2px 8px", borderRadius: 100 }}>{step}</span>}
    </div>
    <h1 style={{ fontSize: 24, fontWeight: 600, color: bb.text, margin: "0 0 6px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>{title}</h1>
    <p style={{ fontSize: 14, color: bb.ts, margin: 0, lineHeight: 1.5 }}>{subtitle}</p>
  </div>
);

/* ═══════════════════════════════════════════
   STEP 1: BRIEF
   ═══════════════════════════════════════════ */
function BriefPage({ onNext }) {
  const [b, setB] = useState({ brandName: "", vibeWords: [], spectrums: [50,50,50,50], inspoUrls: ["","",""], selectedReco: [] });
  const [showReco, setShowReco] = useState(false);
  const s = (k,v) => setB(p => ({...p,[k]:v}));
  const toggleWord = w => { const ws = b.vibeWords.includes(w) ? b.vibeWords.filter(x=>x!==w) : b.vibeWords.length<7 ? [...b.vibeWords,w] : b.vibeWords; s("vibeWords",ws); };
  const toggleReco = n => { const sel = b.selectedReco.includes(n) ? b.selectedReco.filter(x=>x!==n) : [...b.selectedReco,n]; s("selectedReco",sel); };
  const setSp = (i,v) => { const n=[...b.spectrums]; n[i]=v; s("spectrums",n); };
  const setUrl = (i,v) => { const n=[...b.inspoUrls]; n[i]=v; s("inspoUrls",n); };
  const ok = b.brandName.trim() && b.vibeWords.length >= 2;

  return (
    <Shell>
      <Header step="Step 1 of 3" title="Creative Brief" subtitle="Describe your brand personality and share design inspirations." />
      <div style={{ background: bb.bg, borderRadius: bb.r.xl, border: `1px solid ${bb.border}`, padding: 28, boxShadow: bb.sh.sm }}>
        {/* Brand Name */}
        <div style={{ marginBottom: 24 }}>
          <SL>Brand Name</SL>
          <input placeholder="Acme Inc." value={b.brandName} onChange={e=>s("brandName",e.target.value)}
            style={{ width: "100%", padding: "8px 12px", fontSize: 14, fontFamily: bb.font, background: bb.bg, color: bb.text, border: `1px solid ${bb.border}`, borderRadius: bb.r.md, outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* Personality */}
        <div style={{ marginBottom: 24 }}>
          <SL>Personality · select up to 7{b.vibeWords.length>0?` (${b.vibeWords.length})`:""}</SL>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {WORDS.map(w => <Tag key={w} selected={b.vibeWords.includes(w)} onClick={()=>toggleWord(w)}>{w}</Tag>)}
          </div>
        </div>

        {/* Spectrums */}
        <div style={{ marginBottom: 24 }}>
          <SL>Brand Spectrum</SL>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SPECTRUMS.map(([l,r],i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: bb.ts }}>{l}</span>
                  <span style={{ fontSize: 12, color: bb.ts }}>{r}</span>
                </div>
                <input type="range" min={0} max={100} value={b.spectrums[i]} onChange={e=>setSp(i,+e.target.value)}
                  style={{ width: "100%", accentColor: bb.accent, height: 4 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Inspo URLs first */}
        <div style={{ marginBottom: 20 }}>
          <SL>Website Inspiration</SL>
          <p style={{ fontSize: 12, color: bb.tt, margin: "0 0 10px", lineHeight: 1.5 }}>Share 1–5 websites whose design you find compelling.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {b.inspoUrls.map((url,i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}>
                <input placeholder={`https://example${i+1}.com`} value={url} onChange={e=>setUrl(i,e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", fontSize: 13, fontFamily: bb.font, background: bb.bg, color: bb.text, border: `1px solid ${bb.border}`, borderRadius: bb.r.md, outline: "none", boxSizing: "border-box" }} />
                {url && (
                  <img src={`https://www.google.com/s2/favicons?domain=${url.replace(/https?:\/\//,"").split("/")[0]}&sz=32`}
                    alt="" style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${bb.border}` }}
                    onError={e => { e.target.style.display = "none"; }} />
                )}
              </div>
            ))}
            {b.inspoUrls.length < 5 && (
              <button onClick={()=>s("inspoUrls",[...b.inspoUrls,""])} style={{ fontSize: 12, color: bb.tt, background: "none", border: "none", cursor: "pointer", fontFamily: bb.font, textAlign: "left", padding: "4px 0" }}>+ Add another</button>
            )}
          </div>
        </div>

        {/* Collapsible recommended */}
        <div style={{ marginBottom: 24 }}>
          <button onClick={()=>setShowReco(!showReco)} style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500,
            color: bb.ts, background: "none", border: "none", cursor: "pointer", fontFamily: bb.font, padding: 0,
          }}>
            <span style={{ fontSize: 10, transition: bb.t, transform: showReco ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▶</span>
            Not sure? Choose from curated examples
            {b.selectedReco.length > 0 && <span style={{ fontSize: 10, background: bb.accent, color: bb.ti, padding: "1px 6px", borderRadius: 100 }}>{b.selectedReco.length}</span>}
          </button>
          {showReco && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {RECO_SITES.map(site => {
                const sel = b.selectedReco.includes(site.name);
                return (
                  <button key={site.name} onClick={()=>toggleReco(site.name)} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", textAlign: "left",
                    background: sel ? bb.bgMuted : bb.bg, border: `1px solid ${sel ? bb.bst : bb.border}`,
                    borderRadius: bb.r.md, cursor: "pointer", transition: bb.t,
                  }}>
                    <img src={`https://www.google.com/s2/favicons?domain=${site.url}&sz=32`} alt=""
                      style={{ width: 24, height: 24, borderRadius: 4, flexShrink: 0 }}
                      onError={e => { e.target.style.display = "none"; }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: bb.text, fontFamily: bb.font }}>{site.name}</div>
                      <div style={{ fontSize: 11, color: bb.tt, fontFamily: bb.font, lineHeight: 1.3 }}>{site.desc}</div>
                    </div>
                    <span style={{ fontSize: 10, color: bb.tt, fontFamily: bb.font, flexShrink: 0 }}>{site.url}</span>
                    {sel && <span style={{ fontSize: 14, color: bb.accent }}>✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={{ paddingTop: 16, borderTop: `1px solid ${bb.bs}` }}>
          <Btn variant="primary" disabled={!ok} onClick={()=>onNext(b)} style={{ width: "100%", padding: "10px", fontSize: 14, justifyContent: "center" }}>
            Continue to Moodboard →
          </Btn>
          {!ok && b.brandName.trim() && <p style={{ fontSize: 12, color: bb.tt, margin: "8px 0 0", textAlign: "center" }}>Select at least 2 personality words</p>}
        </div>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════
   STEP 2: MOODBOARD
   ═══════════════════════════════════════════ */
function MoodboardPage({ brief, onNext, onBack }) {
  const shuffled = useRef([...CURATED_IMAGES].sort(() => Math.random() - 0.5));
  const [queueIdx, setQueueIdx] = useState(2);
  const [queue, setQueue] = useState(shuffled.current.slice(0, 2));
  const [rated, setRated] = useState([]);

  const getNextImage = () => {
    const idx = queueIdx;
    setQueueIdx(prev => prev + 1);
    if (idx < shuffled.current.length) return shuffled.current[idx];
    // Generate more from picsum
    const seed = 200 + idx;
    return { id: `gen-${seed}`, url: `https://picsum.photos/seed/mood${seed}/640/460`, desc: "generated" };
  };

  const rateImage = (img, rating) => {
    setRated(prev => [{ ...img, rating }, ...prev]);
    setQueue(prev => prev.map(q => q.id === img.id ? getNextImage() : q));
  };

  const skipImage = (img) => {
    setQueue(prev => prev.map(q => q.id === img.id ? getNextImage() : q));
  };

  const likedCount = rated.filter(r => r.rating === "love" || r.rating === "like").length;
  const canProceed = likedCount >= 4;

  const rateButtons = [
    { key: "love", icon: "♥", label: "Love", color: "#dc2626" },
    { key: "like", icon: "▲", label: "Like", color: "#171717" },
    { key: "dislike", icon: "▼", label: "Dislike", color: "#171717" },
    { key: "hate", icon: "✕", label: "Hate", color: "#dc2626" },
  ];

  const ratingMeta = { love: { icon: "♥", color: "#dc2626" }, like: { icon: "▲", color: "#171717" }, dislike: { icon: "▼", color: "#9ca3af" }, hate: { icon: "✕", color: "#dc2626" } };

  return (
    <Shell mw={760}>
      <Header step="Step 2 of 3" title="Moodboard"
        subtitle={canProceed ? `${likedCount} liked — you can continue or keep rating.` : `Rate images to build your visual taste. Like at least ${4-likedCount} more to continue.`} />

      {/* Queue — 2 across */}
      <div style={{ background: bb.bg, borderRadius: bb.r.xl, border: `1px solid ${bb.border}`, padding: 20, boxShadow: bb.sh.sm, marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {queue.map(img => (
            <div key={img.id}>
              <div style={{ position: "relative", borderRadius: bb.r.lg, overflow: "hidden", background: bb.bgMuted, marginBottom: 10 }}>
                <img src={img.url} alt="" style={{ width: "100%", aspectRatio: "16/11.5", objectFit: "cover", display: "block" }} />
                <button onClick={()=>skipImage(img)} style={{
                  position: "absolute", top: 8, right: 8, width: 26, height: 26,
                  background: "rgba(0,0,0,0.45)", color: "#fff", border: "none", borderRadius: "50%",
                  cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {rateButtons.map(rb => (
                  <button key={rb.key} onClick={()=>rateImage(img,rb.key)} style={{
                    flex: 1, padding: "6px 0", fontSize: 11, fontFamily: bb.font, fontWeight: 500,
                    background: bb.bg, color: rb.color, border: `1px solid ${bb.border}`,
                    borderRadius: bb.r.sm, cursor: "pointer", transition: bb.t,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  }}>
                    <span style={{ fontSize: 12 }}>{rb.icon}</span>
                    {rb.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <Btn variant="ghost" onClick={onBack}>← Brief</Btn>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: bb.tt }}>{rated.length} rated · {likedCount} liked</span>
        <Btn variant="primary" disabled={!canProceed} onClick={()=>onNext(rated)}>Continue to Style Tiles →</Btn>
      </div>

      {/* Rated grid */}
      {rated.length > 0 && (
        <div style={{ background: bb.bg, borderRadius: bb.r.xl, border: `1px solid ${bb.border}`, padding: 20 }}>
          <SL>Rated Images</SL>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
            {rated.map((img,i) => (
              <div key={i} style={{ position: "relative", borderRadius: bb.r.md, overflow: "hidden" }}>
                <img src={img.url} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, padding: "3px 0",
                  background: "rgba(0,0,0,0.55)", color: ratingMeta[img.rating].color === "#171717" ? "#fff" : ratingMeta[img.rating].color,
                  fontSize: 10, fontWeight: 600, fontFamily: bb.font, textAlign: "center",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                }}>
                  <span>{ratingMeta[img.rating].icon}</span> {img.rating.charAt(0).toUpperCase()+img.rating.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Shell>
  );
}

/* ═══════════════════════════════════════════
   STYLE TILE — Rich mini-website composition
   ═══════════════════════════════════════════ */
function StyleTileCard({ tile }) {
  const t = tile.tokens;
  if (!t) return null;
  const c = t.colors || [];
  const rad = t.borderRadius || 8;
  const heading = `'${t.headingFont}',serif`;
  const body = `'${t.bodyFont}',sans-serif`;

  useEffect(() => {
    const id = `tile-f-${tile.id}`;
    let el = document.getElementById(id);
    if (el) el.remove();
    el = document.createElement("link"); el.id = id; el.rel = "stylesheet";
    el.href = `https://fonts.googleapis.com/css2?family=${[t.headingFont,t.bodyFont].filter(Boolean).map(f=>f.replace(/ /g,"+")+":wght@400;500;600;700;800").join("&family=")}&display=swap`;
    document.head.appendChild(el);
  }, [t.headingFont, t.bodyFont, tile.id]);

  const iconStyle = { width: 44, height: 44, borderRadius: rad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 };

  return (
    <div style={{ background: t.bgColor || "#fff", borderRadius: 16, overflow: "hidden", border: `1px solid ${bb.border}`, boxShadow: bb.sh.lg }}>
      {/* TOP: 2-column hero area */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Left: Illustration / diagram area */}
        <div style={{ background: c[3] || "#1a1a2e", padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 280 }}>
          {/* Abstract shapes / icons */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  {i === 0 && <><circle cx="20" cy="20" r="16" stroke={c[4]||"#ccc"} strokeWidth="1.5" fill="none" /><circle cx="20" cy="20" r="8" fill={c[0]||"#2563eb"} opacity="0.8" /><circle cx="28" cy="12" r="4" fill={c[1]||"#7c3aed"} /></>}
                  {i === 1 && <>{[0,1,2,3,4,5,6,7,8].map(j => <rect key={j} x={4+(j%3)*12} y={4+Math.floor(j/3)*12} width="8" height="8" rx="2" fill={j%2===0?(c[0]||"#2563eb"):(c[4]||"#ccc")} opacity={j<5?"0.8":"0.3"} />)}</>}
                  {i === 2 && <><circle cx="20" cy="20" r="15" stroke={c[4]||"#ccc"} strokeWidth="1.5" fill="none" /><circle cx="20" cy="20" r="10" stroke={c[4]||"#ccc"} strokeWidth="1" fill="none" /><circle cx="20" cy="20" r="5" fill={c[1]||"#7c3aed"} opacity="0.6" /><circle cx="30" cy="14" r="3" fill={c[0]||"#2563eb"} /></>}
                </svg>
              </div>
            ))}
          </div>
          {/* Diagram placeholder */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="200" height="100" viewBox="0 0 200 100" fill="none">
              <circle cx="40" cy="50" r="28" stroke={c[4]||"#ccc"} strokeWidth="1" fill="none" />
              <text x="40" y="54" textAnchor="middle" fill={c[4]||"#ccc"} fontSize="9" fontFamily={body}>Input</text>
              <circle cx="100" cy="50" r="28" fill={c[0]||"#2563eb"} opacity="0.2" stroke={c[0]||"#2563eb"} strokeWidth="1.5" />
              <text x="100" y="54" textAnchor="middle" fill={c[0]||"#2563eb"} fontSize="9" fontWeight="600" fontFamily={body}>Process</text>
              <circle cx="160" cy="50" r="28" stroke={c[4]||"#ccc"} strokeWidth="1" fill="none" />
              <text x="160" y="54" textAnchor="middle" fill={c[4]||"#ccc"} fontSize="9" fontFamily={body}>Output</text>
              <line x1="68" y1="50" x2="72" y2="50" stroke={c[4]||"#ccc"} strokeWidth="1" />
              <line x1="128" y1="50" x2="132" y2="50" stroke={c[4]||"#ccc"} strokeWidth="1" />
            </svg>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", gap: 12 }}>
            {[["2,500+","Onboarded"],["$437 B+","Analyzed"],["82%","Efficiency"]].map(([val,lbl]) => (
              <div key={lbl} style={{ background: "rgba(255,255,255,0.1)", borderRadius: rad, padding: "8px 12px", flex: 1 }}>
                <div style={{ fontFamily: heading, fontSize: 16, fontWeight: 700, color: c[4]||"#fff" }}>{val}</div>
                <div style={{ fontFamily: body, fontSize: 9, color: c[4]||"#ccc", opacity: 0.7 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Feature cards */}
        <div style={{ background: t.bgColor||"#f8f8f8", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { title: "Save Time", desc: "Enable non-experts to deliver expert-level results effortlessly.", icon: "⚡" },
            { title: "Save Money", desc: "No seat licenses or data enrichment fees. Predictable pricing.", icon: "◆" },
            { title: "Reduce Risk", desc: "Onboard faster than ever with full supply chain transparency.", icon: "◎" },
          ].map(card => (
            <div key={card.title} style={{ background: t.bgColor||"#fff", border: `1px solid ${t.borderColor||"#e5e5e5"}`, borderRadius: rad, padding: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ ...iconStyle, width: 32, height: 32, fontSize: 14, background: `${c[0]||"#2563eb"}15`, color: c[0]||"#2563eb" }}>{card.icon}</div>
                <span style={{ fontFamily: heading, fontSize: 14, fontWeight: 700, color: t.textColor||"#111" }}>{card.title}</span>
              </div>
              <p style={{ fontFamily: body, fontSize: 11, color: t.textMuted||"#666", margin: 0, lineHeight: 1.5 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM: 2-column — color shapes + hero text */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Left: Color/shape grid */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
            {[c[0],c[1],c[2]||c[0],c[4]||"#eee",c[3]||"#222",c[0],c[4]||"#eee",c[1]].map((col,i) => (
              <div key={i} style={{
                paddingTop: "80%", borderRadius: i%3===0 ? "50%" : rad,
                background: col, opacity: i > 5 ? 0.5 : 0.85,
              }} />
            ))}
          </div>
          {/* Palette strip */}
          <div style={{ display: "flex", gap: 4 }}>
            {c.map((col,i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ width: "100%", height: 24, borderRadius: 4, background: col, border: "1px solid rgba(0,0,0,0.06)" }} />
                <span style={{ fontSize: 8, color: t.textMuted||"#999", fontFamily: bb.font }}>{col}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Hero text */}
        <div style={{ background: c[3]||"#1a1a2e", padding: 28, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: c[0]||"#2563eb", fontFamily: body, marginBottom: 8 }}>
            {tile.brandName}
          </div>
          <h2 style={{ fontFamily: heading, fontSize: 26, fontWeight: 700, color: c[4]||"#fff", lineHeight: 1.15, margin: "0 0 10px" }}>
            Master your data with our platform.
          </h2>
          <p style={{ fontFamily: body, fontSize: 12, color: c[4]||"#ccc", opacity: 0.7, lineHeight: 1.6, margin: "0 0 16px" }}>
            Onboard, manage, and grow relationships with our all-in-one management platform.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ padding: "9px 20px", fontFamily: body, fontSize: 12, fontWeight: 600, background: c[0]||"#2563eb", color: "#fff", border: "none", borderRadius: rad, cursor: "default" }}>Get Started</button>
            <button style={{ padding: "9px 20px", fontFamily: body, fontSize: 12, fontWeight: 600, background: "transparent", color: c[4]||"#fff", border: `1.5px solid ${c[4]||"#fff"}44`, borderRadius: rad, cursor: "default" }}>Learn More →</button>
          </div>
        </div>
      </div>

      {/* COLOR STRIP — right-edge style accents */}
      <div style={{ display: "flex", height: 8 }}>
        {c.map((col,i) => <div key={i} style={{ flex: 1, background: col }} />)}
      </div>

      {/* FOOTER: Typography + Adjectives */}
      <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${t.borderColor||"#e5e5e5"}` }}>
        <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
          <span style={{ fontFamily: heading, fontSize: 14, fontWeight: 700, color: t.textColor||"#111" }}>{t.headingFont}</span>
          <span style={{ fontFamily: body, fontSize: 12, color: t.textMuted||"#666" }}>{t.bodyFont}</span>
          <span style={{ fontSize: 10, color: bb.tt, fontFamily: bb.font }}>v{tile.version}</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {(tile.adjectives||[]).map(a => (
            <span key={a} style={{ padding: "2px 8px", fontSize: 10, fontFamily: body, fontWeight: 500, background: `${c[0]||"#2563eb"}12`, color: c[0]||"#2563eb", borderRadius: 100 }}>{a}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 3: STYLE TILES PAGE
   ═══════════════════════════════════════════ */
function StyleTilesPage({ brief, moodboardRatings, onBack }) {
  const [tiles, setTiles] = useState([]);
  const [active, setActive] = useState(null);
  const [genning, setGenning] = useState(false);
  const [tab, setTab] = useState("controls");
  const [lb, setLb] = useState(brief);

  const buildVector = useCallback(() => {
    const loved = moodboardRatings.filter(r=>r.rating==="love").length;
    const liked = moodboardRatings.filter(r=>r.rating==="like").length;
    const disliked = moodboardRatings.filter(r=>r.rating==="dislike").length;
    const hated = moodboardRatings.filter(r=>r.rating==="hate").length;
    const inspo = [...lb.selectedReco, ...lb.inspoUrls.filter(Boolean).map(u=>u.replace(/https?:\/\//,"").replace(/\/$/,""))];
    return `Brand:"${lb.brandName}" Personality:${lb.vibeWords.join(",")} Spectrums(0-100):Traditional↔Progressive:${lb.spectrums[0]},Serious↔Playful:${lb.spectrums[1]},Understated↔Bold:${lb.spectrums[2]},Simple↔Complex:${lb.spectrums[3]} Inspo:${inspo.join(",")||"none"} Moodboard:${loved}loved,${liked}liked,${disliked}disliked,${hated}hated`;
  }, [lb, moodboardRatings]);

  const generate = useCallback(async (avoid = null) => {
    setGenning(true);
    try {
      const vec = buildVector();
      const avoidStr = avoid ? `\nAVOID these previous choices: colors[${avoid.tokens.colors.join(",")}], fonts "${avoid.tokens.headingFont}"+"${avoid.tokens.bodyFont}". Make something distinctly different.` : "";
      const result = await callClaudeJSON(`You are a world-class brand designer creating a Style Tile. Generate a cohesive design as JSON.

BRIEF: ${vec}${avoidStr}

Be DISTINCTIVE and OPINIONATED. Don't default to generic blue/white. Let personality and spectrums deeply influence choices.

- colors: array of exactly 5 hex colors [primary, secondary, accent, dark-neutral, light-neutral]. Harmonious, intentional.
- headingFont/bodyFont: distinctive Google Fonts. AVOID: Inter,Roboto,Open Sans,Montserrat,Poppins,Lato. Choose characterful fonts.
- bgColor: tile background (#fff, off-white, cream, or dark)
- textColor: main text. textMuted: muted text. borderColor: border color. Ensure contrast.
- borderRadius: 4-20 based on playful↔serious
- textureCSS: CSS repeating-linear-gradient or radial-gradient pattern using primary at low opacity
- textureSize: CSS background-size for the texture
- adjectives: 3-5 words capturing this tile's direction

ONLY valid JSON (no markdown):
{"colors":["#hex","#hex","#hex","#hex","#hex"],"headingFont":"Name","bodyFont":"Name","bgColor":"#hex","textColor":"#hex","textMuted":"#hex","borderColor":"#hex","borderRadius":8,"textureCSS":"css","textureSize":"20px 20px","adjectives":["w","w","w"]}`);

      const newTile = {
        id: `t-${Date.now()}`, brandName: lb.brandName, version: tiles.length+1,
        tokens: result, adjectives: result.adjectives||lb.vibeWords.slice(0,4),
        savedAt: null,
      };
      setTiles(p => [...p, newTile]);
      setActive(newTile.id);
    } catch (e) { console.error(e); }
    setGenning(false);
  }, [buildVector, lb, tiles.length]);

  useEffect(() => { if (!tiles.length && !genning) generate(); }, []);

  const cur = tiles.find(t => t.id === active);
  const saved = tiles.filter(t => t.savedAt);

  const save = id => setTiles(p => p.map(t => t.id===id ? {...t,savedAt:new Date().toISOString()} : t));
  const dup = tile => {
    const d = {...tile, id:`t-${Date.now()}`, version:tiles.length+1, savedAt:null, tokens:{...tile.tokens, colors:[...tile.tokens.colors]}};
    setTiles(p=>[...p,d]); setActive(d.id);
  };
  const del = id => { setTiles(p=>p.filter(t=>t.id!==id)); if(active===id) setActive(tiles.find(t=>t.id!==id)?.id||null); };
  const updateColor = (i,c) => setTiles(p=>p.map(t=>{if(t.id!==active)return t; const nc=[...t.tokens.colors];nc[i]=c; return{...t,tokens:{...t.tokens,colors:nc}};}));
  const updateTok = (k,v) => setTiles(p=>p.map(t=>t.id!==active?t:{...t,tokens:{...t.tokens,[k]:v}}));

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: bb.font, background: bb.bgSubtle, overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700&display=swap" rel="stylesheet" />

      {/* SIDEBAR */}
      <div style={{ width: 320, borderRight: `1px solid ${bb.border}`, background: bb.bg, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${bb.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: bb.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: bb.ti, fontSize: 9, fontWeight: 700 }}>D</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: bb.text }}>Style Tiles</span>
          </div>
          <button onClick={onBack} style={{ fontSize: 11, color: bb.tt, background: "none", border: "none", cursor: "pointer", fontFamily: bb.font }}>← Moodboard</button>
        </div>

        <div style={{ display: "flex", borderBottom: `1px solid ${bb.border}` }}>
          {[["controls","Controls"],["brief","Brief"],["saved",`Saved (${saved.length})`]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{
              flex:1, padding:"9px 0", fontSize:11, fontWeight:500, fontFamily:bb.font,
              background:"transparent", border:"none",
              color: tab===k?bb.text:bb.tt,
              borderBottom: tab===k?`2px solid ${bb.accent}`:"2px solid transparent",
              cursor:"pointer", transition:bb.t,
            }}>{l}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "14px 16px" }}>
          {/* Reroll + actions */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <Btn variant="primary" disabled={genning} onClick={()=>generate(cur)} style={{ flex:1, justifyContent:"center", fontSize:12 }}>
              {genning?"Generating...":"↻ Reroll"}
            </Btn>
            {cur && <>
              <Btn variant="secondary" onClick={()=>save(cur.id)} style={{ fontSize:11 }}>{cur.savedAt?"✓ Saved":"Save"}</Btn>
              <Btn variant="secondary" onClick={()=>dup(cur)} style={{ fontSize:11 }}>Dup</Btn>
            </>}
          </div>

          {tab === "controls" && cur && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <SL>Colors</SL>
                <div style={{ display: "flex", gap: 8 }}>
                  {(cur.tokens.colors||[]).map((c,i)=>(
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <input type="color" value={c} onChange={e=>updateColor(i,e.target.value)}
                        style={{ width: 32, height: 32, border: `1px solid ${bb.border}`, borderRadius: 6, cursor: "pointer", padding: 0 }} />
                      <span style={{ fontSize: 9, color: bb.tt }}>{["Pri","Sec","Acc","Dark","Light"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <SL>Typography</SL>
                <div style={{ fontSize: 12, color: bb.text, marginBottom: 3 }}>Heading: <strong>{cur.tokens.headingFont}</strong></div>
                <div style={{ fontSize: 12, color: bb.text }}>Body: <strong>{cur.tokens.bodyFont}</strong></div>
              </div>
              <div>
                <SL>Border Radius · {cur.tokens.borderRadius}px</SL>
                <input type="range" min={0} max={24} value={cur.tokens.borderRadius} onChange={e=>updateTok("borderRadius",+e.target.value)}
                  style={{ width: "100%", accentColor: bb.accent, height: 4 }} />
              </div>
              <div>
                <SL>Background / Text</SL>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="color" value={cur.tokens.bgColor} onChange={e=>updateTok("bgColor",e.target.value)} style={{ width: 28, height: 28, border: `1px solid ${bb.border}`, borderRadius: 4, cursor: "pointer", padding: 0 }} />
                  <input type="color" value={cur.tokens.textColor} onChange={e=>updateTok("textColor",e.target.value)} style={{ width: 28, height: 28, border: `1px solid ${bb.border}`, borderRadius: 4, cursor: "pointer", padding: 0 }} />
                  <span style={{ fontSize: 10, color: bb.tt }}>Bg / Text</span>
                </div>
              </div>
            </div>
          )}

          {tab === "brief" && (
            <div>
              <p style={{ fontSize: 12, color: bb.tt, margin: "0 0 12px", lineHeight: 1.5 }}>Adjust then reroll to regenerate.</p>
              <div style={{ marginBottom: 14 }}>
                <SL>Personality · {lb.vibeWords.length}</SL>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {WORDS.map(w=>(
                    <Tag key={w} small selected={lb.vibeWords.includes(w)} onClick={()=>{
                      const ws=lb.vibeWords.includes(w)?lb.vibeWords.filter(x=>x!==w):lb.vibeWords.length<7?[...lb.vibeWords,w]:lb.vibeWords;
                      setLb(p=>({...p,vibeWords:ws}));
                    }}>{w}</Tag>
                  ))}
                </div>
              </div>
              <SL>Spectrums</SL>
              {SPECTRUMS.map(([l,r],i)=>(
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: bb.ts, marginBottom: 3 }}><span>{l}</span><span>{r}</span></div>
                  <input type="range" min={0} max={100} value={lb.spectrums[i]}
                    onChange={e=>{const n=[...lb.spectrums];n[i]=+e.target.value;setLb(p=>({...p,spectrums:n}));}}
                    style={{ width: "100%", accentColor: bb.accent, height: 4 }} />
                </div>
              ))}
            </div>
          )}

          {tab === "saved" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {!saved.length && <p style={{ fontSize: 12, color: bb.tt, textAlign: "center", padding: 20 }}>No saved tiles yet.</p>}
              {saved.map(tile=>(
                <div key={tile.id} onClick={()=>{setActive(tile.id);setTab("controls");}}
                  style={{ padding: 10, borderRadius: bb.r.md, border: `1px solid ${tile.id===active?bb.bst:bb.border}`, background: tile.id===active?bb.bgMuted:bb.bg, cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
                    {tile.tokens.colors.map((c,i)=><div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c, border: "1px solid rgba(0,0,0,0.06)" }} />)}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: bb.text }}>v{tile.version} · {tile.tokens.headingFont}</div>
                  <div style={{ fontSize: 10, color: bb.tt }}>{tile.adjectives?.join(", ")}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
                    <Btn variant="secondary" onClick={e=>{e.stopPropagation();dup(tile);}} style={{ padding: "2px 8px", fontSize: 10 }}>Duplicate</Btn>
                    <Btn variant="ghost" onClick={e=>{e.stopPropagation();del(tile.id);}} style={{ padding: "2px 8px", fontSize: 10, color: "#dc2626" }}>Delete</Btn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflow: "auto", padding: 28, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        {genning && !cur ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 14 }}>
            <div style={{ width: 28, height: 28, border: `2px solid ${bb.bgActive}`, borderTopColor: bb.accent, borderRadius: "50%", animation: "sp .7s linear infinite" }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: bb.ts }}>Generating your first style tile...</span>
            <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : cur ? (
          <div style={{ maxWidth: 640, width: "100%" }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
              {tiles.map(t=>(
                <button key={t.id} onClick={()=>setActive(t.id)} style={{
                  padding: "3px 10px", fontSize: 11, fontFamily: bb.font, fontWeight: 500,
                  background: t.id===active?bb.accent:bb.bg, color: t.id===active?bb.ti:bb.ts,
                  border: `1px solid ${t.id===active?bb.accent:bb.border}`,
                  borderRadius: 100, cursor: "pointer", transition: bb.t,
                }}>v{t.version}{t.savedAt?" ✓":""}</button>
              ))}
            </div>
            <StyleTileCard tile={cur} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════ */
export default function App() {
  const [phase, setPhase] = useState("brief");
  const [brief, setBrief] = useState(null);
  const [mbRatings, setMbRatings] = useState([]);

  return <>
    {phase === "brief" && <BriefPage onNext={b=>{setBrief(b);setPhase("moodboard");}} />}
    {phase === "moodboard" && <MoodboardPage brief={brief} onNext={r=>{setMbRatings(r);setPhase("styletiles");}} onBack={()=>setPhase("brief")} />}
    {phase === "styletiles" && <StyleTilesPage brief={brief} moodboardRatings={mbRatings} onBack={()=>setPhase("moodboard")} />}
  </>;
}
