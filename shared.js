// ═══════════════════════════════════════
// TELECOMNET — SHARED THEME & CANVAS JS
// ═══════════════════════════════════════

const THEMES = ['scifi','blueprint','premium'];
const THEME_NAMES = {
  scifi:     '🌌 Sci-Fi Dark Universe',
  blueprint: '⚡ Electric Blueprint',
  premium:   '🔥 Premium Corporate'
};
const THEME_SHORT = {
  scifi:'🌌 Sci-Fi Dark',blueprint:'⚡ Blueprint',premium:'🔥 Premium'
};
const THEME_COLORS = {
  scifi:     [[0,245,255],[0,100,220],[0,200,100]],
  blueprint: [[26,63,168],[244,124,32],[0,80,200]],
  premium:   [[244,124,32],[255,160,70],[100,160,255]]
};

let currentIdx = 0;

function getTheme(){ return THEMES[currentIdx]; }

function applyTheme(t){
  currentIdx = THEMES.indexOf(t);
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('tn_theme', t);
  document.querySelectorAll('.tdot').forEach(d => d.classList.toggle('active', d.dataset.t === t));
  const toast = document.getElementById('theme-toast');
  if(toast){
    toast.textContent = THEME_NAMES[t];
    toast.classList.add('show');
    clearTimeout(toast._tid);
    toast._tid = setTimeout(()=>toast.classList.remove('show'), 2000);
  }
  const lbl = document.getElementById('foot-theme-lbl');
  if(lbl) lbl.textContent = THEME_SHORT[t];
  initCanvas(t);
}

function cycleTheme(){
  currentIdx = (currentIdx + 1) % THEMES.length;
  applyTheme(THEMES[currentIdx]);
}

// Init on load
document.addEventListener('DOMContentLoaded', ()=>{
  const saved = localStorage.getItem('tn_theme') || 'scifi';
  const idx = THEMES.indexOf(saved);
  currentIdx = idx >= 0 ? idx : 0;
  document.documentElement.setAttribute('data-theme', THEMES[currentIdx]);
  document.querySelectorAll('.tdot').forEach(d => d.classList.toggle('active', d.dataset.t === THEMES[currentIdx]));
  const lbl = document.getElementById('foot-theme-lbl');
  if(lbl) lbl.textContent = THEME_SHORT[THEMES[currentIdx]];

  // Theme dots
  document.querySelectorAll('.tdot').forEach(d => d.addEventListener('click', ()=> applyTheme(d.dataset.t)));

  // Hamburger menu
  const burger = document.getElementById('navBurger');
  const mobileNav = document.getElementById('navMobile');
  if(burger && mobileNav){
    burger.addEventListener('click', ()=>{
      const open = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    // Close on outside click
    document.addEventListener('click', e=>{
      if(!burger.contains(e.target) && !mobileNav.contains(e.target)){
        mobileNav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
      }
    });
    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{
      mobileNav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    }));
  }

  initCanvas(THEMES[currentIdx]);
});

// ═══ CANVAS PARTICLES ═══
const canvas = document.getElementById('bgcanvas');
const ctx = canvas.getContext('2d');
let W, H, pts = [], rafId;

function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

function initCanvas(theme){
  cancelAnimationFrame(rafId);
  pts = [];
  const cols = THEME_COLORS[theme];
  for(let i = 0; i < 70; i++){
    const c = cols[Math.floor(Math.random() * cols.length)];
    pts.push({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35, r:Math.random()*1.5+.4, col:c });
  }
  animateCanvas(theme);
}

function animateCanvas(theme){
  ctx.clearRect(0, 0, W, H);
  const lc = THEME_COLORS[theme][0];
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if(p.x < 0) p.x = W; if(p.x > W) p.x = 0;
    if(p.y < 0) p.y = H; if(p.y > H) p.y = 0;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${p.col},.5)`; ctx.fill();
  });
  for(let i = 0; i < pts.length; i++){
    for(let j = i+1; j < pts.length; j++){
      const d = Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);
      if(d < 120){
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(${lc},${.09*(1-d/120)})`; ctx.lineWidth = .5; ctx.stroke();
      }
    }
  }
  rafId = requestAnimationFrame(()=>animateCanvas(theme));
}
