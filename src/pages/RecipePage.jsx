import { useLocation, useNavigate } from 'react-router-dom'

/* ─── SVG Icons ──────────────────────────────────────── */
const Icons = {
  Back:       () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Star:       () => <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Flame:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 17c1.38 0 2.5-1.12 2.5-2.5 0-1.38-.77-2.77-2.5-4.5-1.73 1.73-2.5 3.12-2.5 4.5z"/><path d="M12 22c4.97 0 9-4.03 9-9 0-3.5-2-6.5-5-8.5 0 2-1 4-3 5.5C11 8 9 5 9 3c-3 2-5 5-5 8.5C4 17.97 8.03 22 12 22z"/></svg>,
  Activity:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Droplet:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
  Heart:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Grid:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Leaf:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34l1.4.92a1 1 0 001.35-.24 6.99 6.99 0 0011.46-8 1 1 0 01-.03-1.02z"/></svg>,
  Zap:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Salt:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2h6l1 7H8L9 2z"/><path d="M8 9a5 5 0 000 10h8a5 5 0 000-10"/></svg>,
  Circle:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>,
  FileText:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Cart:       () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  CookingPot: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8"/><path d="M4 12V8a8 8 0 0116 0v4"/><path d="M15 2l1 2"/><path d="M9 2l-1 2"/></svg>,
  Tag:        () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
}

/* ─── CSS ─────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rp {
    font-family: 'DM Sans', sans-serif;
    background: #F5F4F0;
    min-height: 100vh;
  }

  /* ── PAGE WRAP ── */
  .rp-page {
    max-width: 860px;
    padding: 36px 40px 56px;
  }

  /* ── PAGE TITLE ── */
  .rp-page-title {
    font-family: 'Libre Baskerville', serif;
    font-size: 28px;
    font-weight: 700;
    color: #111;
    margin-bottom: 22px;
    line-height: 1.25;
  }

  /* ── BACK LINK ── */
  .rp-back {
    display: inline-flex; align-items: center; gap: 5px;
    background: none; border: none; cursor: pointer;
    color: #F97316; font-size: 13px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    padding: 0; margin-bottom: 18px;
    transition: opacity 0.12s;
  }
  .rp-back:hover { opacity: 0.7; }

  /* ── BADGES ── */
  .rp-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
  .rp-badge-match {
    display: inline-flex; align-items: center; gap: 4px;
    background: linear-gradient(135deg, #F97316, #FB923C);
    color: #fff; font-size: 11px; font-weight: 700;
    padding: 3px 10px; border-radius: 99px;
  }
  .rp-tag { font-size: 11px; padding: 3px 10px; border-radius: 99px; font-weight: 500; border: 1px solid transparent; }
  .rp-tag-blue   { background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE; }
  .rp-tag-green  { background: #F0FDF4; color: #166534; border-color: #BBF7D0; }
  .rp-tag-orange { background: #FFF7ED; color: #C2410C; border-color: #FED7AA; }

  /* ── CARD ── */
  .rp-card {
    background: #ECEAE4;
    border-radius: 14px;
    padding: 20px 22px;
    margin-bottom: 16px;
  }
  .rp-card:last-child { margin-bottom: 0; }

  /* ── NUTRITION CARD ── */
  .rp-nutr-card {
    background: #ECEAE4;
    border-radius: 14px;
    padding: 18px 20px;
    margin-bottom: 16px;
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }
  .rp-nutr-img {
    width: 160px;
    height: 160px;
    border-radius: 10px;
    background: #D9D7D0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 64px;
    overflow: hidden;
  }
  .rp-nutr-content { flex: 1; min-width: 0; }
  .rp-nutr-heading {
    font-size: 13px; font-weight: 700; color: #374151;
    margin-bottom: 10px; text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .rp-nutr-list { display: flex; flex-direction: column; gap: 5px; }
  .rp-nutr-row {
    display: flex; align-items: center; gap: 7px;
    font-size: 13px; line-height: 1.4;
  }
  .rp-nutr-ico { color: #F97316; display: flex; align-items: center; flex-shrink: 0; }
  .rp-nutr-text { font-weight: 700; color: #1F2937; }
  .rp-nutr-sub  { font-weight: 400; color: #374151; }

  /* ── SECTION CARD HEAD ── */
  .rp-section-head {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 12px;
  }
  .rp-section-ico {
    width: 28px; height: 28px; border-radius: 8px;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #F97316; flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }
  .rp-section-title {
    font-family: 'Libre Baskerville', serif;
    font-size: 15px; font-weight: 700; color: #111;
  }

  /* ── DESCRIPTION ── */
  .rp-desc-text {
    font-size: 13.5px; color: #4B5563; line-height: 1.85;
  }

  /* ── INGREDIENTS ── */
  .rp-ing-list { display: flex; flex-direction: column; gap: 7px; }
  .rp-ing-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; color: #374151;
  }
  .rp-ing-dot {
    width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0;
    background: #fff; border: 1px solid #FDBA74;
    display: flex; align-items: center; justify-content: center;
    font-size: 10.5px; font-weight: 700; color: #F97316;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  /* ── STEPS ── */
  .rp-steps-list { display: flex; flex-direction: column; gap: 10px; }
  .rp-step { display: flex; gap: 12px; align-items: flex-start; }
  .rp-step-num {
    width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11.5px; font-weight: 700; margin-top: 2px;
  }
  .rp-step-num.solid   { background: linear-gradient(135deg,#F97316,#FB923C); color:#fff; box-shadow: 0 2px 8px rgba(249,115,22,0.28); }
  .rp-step-num.outline { background: #fff; border: 1px solid #FDBA74; color: #C2410C; }
  .rp-step-text { font-size: 13.5px; color: #374151; line-height: 1.78; padding-top: 3px; }

  /* ── FOOTER ── */
  .rp-footer { padding: 24px 0 0; font-size: 11.5px; color: #B0AFA9; }

  @media (max-width: 560px) {
    .rp-page { padding: 24px 18px 40px; }
    .rp-nutr-card { flex-direction: column; }
    .rp-nutr-img  { width: 100%; height: 180px; }
  }
`

/* ─── Nutrition icon map ── */
const nutrIcons = {
  calories:    <Icons.Flame />,
  protein:     <Icons.Activity />,
  fat:         <Icons.Droplet />,
  saturated:   <Icons.Heart />,
  carbs:       <Icons.Grid />,
  fiber:       <Icons.Leaf />,
  sugar:       <Icons.Zap />,
  sodium:      <Icons.Salt />,
  cholesterol: <Icons.Circle />,
}

/* ─── Component ──────────────────────────────────────── */
export const RecipePage = () => {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const meal = state?.meal

  if (!meal) return (
    <>
      <style>{css}</style>
      <div className="rp" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:13, color:'#9CA3AF', marginBottom:18 }}>Recipe not found.</div>
          <button onClick={() => navigate('/rekomendasi')} style={{ padding:'9px 20px', borderRadius:9, background:'#F97316', border:'none', color:'#fff', fontWeight:600, cursor:'pointer', fontSize:13 }}>
            Back
          </button>
        </div>
      </div>
    </>
  )

  const n = meal.nutrition || {}
  const r = meal.recipe    || {}

  const nutrRows = [
    { key:'calories',    label:'Calories',      val: n.calories,    unit:'kcal' },
    { key:'protein',     label:'Protein',       val: n.protein,     unit:'g'    },
    { key:'fat',         label:'Fat',           val: n.fat,         unit:'g'    },
    { key:'saturated',   label:'Saturated Fat', val: n.saturated,   unit:'g'    },
    { key:'carbs',       label:'Carbohydrates', val: n.carbs,       unit:'g'    },
    { key:'fiber',       label:'Fiber',         val: n.fiber,       unit:'g'    },
    { key:'sugar',       label:'Sugar',         val: n.sugar,       unit:'g'    },
    { key:'sodium',      label:'Sodium',        val: n.sodium,      unit:'mg'   },
    { key:'cholesterol', label:'Cholesterol',   val: n.cholesterol, unit:'mg'   },
  ]

  return (
    <>
      <style>{css}</style>
      <div className="rp">
        <div className="rp-page">

          {/* Back */}
          <button className="rp-back" onClick={() => navigate('/rekomendasi')}>
            <Icons.Back /> Back to recommendations
          </button>

          {/* Badges */}
          <div className="rp-badges">
            <span className="rp-badge-match"><Icons.Star /> {(meal.recommendation_score * 100).toFixed(0)}% match</span>
            {meal.cuisine_type        && <span className="rp-tag rp-tag-blue">{meal.cuisine_type}</span>}
            {meal.health_tag          && <span className="rp-tag rp-tag-green">{meal.health_tag}</span>}
            {meal.main_protein_source && <span className="rp-tag rp-tag-orange">{meal.main_protein_source}</span>}
          </div>

          {/* Title */}
          <h1 className="rp-page-title">{meal.name}</h1>

          {/* ── Nutrition box: image left + nutrition list right ── */}
          <div className="rp-nutr-card">
            {/* Food image / emoji */}
            <div className="rp-nutr-img">
              {meal.emoji || '🍽'}
            </div>

            {/* Nutrition list */}
            <div className="rp-nutr-content">
              <div className="rp-nutr-heading">Contains:</div>
              <div className="rp-nutr-list">
                {nutrRows.map(({ key, label, val, unit }) => {
                  const display = (val !== null && val !== undefined && val !== '') ? val : null
                  if (display === null) return null
                  return (
                    <div key={key} className="rp-nutr-row">
                      <span className="rp-nutr-ico">{nutrIcons[key]}</span>
                      <span>
                        <span className="rp-nutr-text">{display}{unit} </span>
                        <span className="rp-nutr-sub">{label}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Description ── */}
          <div className="rp-card">
            <div className="rp-section-head">
              <div className="rp-section-ico"><Icons.FileText /></div>
              <span className="rp-section-title">Description</span>
            </div>
            <p className="rp-desc-text">{meal.description}</p>
          </div>

          {/* ── Ingredients ── */}
          <div className="rp-card">
            <div className="rp-section-head">
              <div className="rp-section-ico"><Icons.Cart /></div>
              <span className="rp-section-title">Ingredients</span>
            </div>
            <div className="rp-ing-list">
              {(r.ingredients || []).map((ing, i) => (
                <div key={i} className="rp-ing-item">
                  <span className="rp-ing-dot">{i + 1}</span>
                  {ing}
                </div>
              ))}
            </div>
          </div>

          {/* ── Steps ── */}
          <div className="rp-card">
            <div className="rp-section-head">
              <div className="rp-section-ico"><Icons.CookingPot /></div>
              <span className="rp-section-title">How to cook</span>
            </div>
            <div className="rp-steps-list">
              {(r.steps || []).map((step, i) => (
                <div key={i} className="rp-step">
                  <div className={`rp-step-num ${i % 2 === 0 ? 'solid' : 'outline'}`}>{i + 1}</div>
                  <p className="rp-step-text">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rp-footer">© 2026 Health Plan · DBS Foundation</div>
        </div>
      </div>
    </>
  )
}