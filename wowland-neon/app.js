document.addEventListener('DOMContentLoaded', () => {
  const D = window.SITE || window.SITE_FALLBACK || {};
  if(!D.networks) return;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');

  // Every normal page open, refresh, or history restore starts at the hero.
  // Navigation clicks still work after load; only the persisted entry position is reset.
  const returnToHome = () => {
    if(location.hash) history.replaceState(null, '', location.pathname + location.search);
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    scrollTo(0, 0);
    root.style.scrollBehavior = previous;
  };
  returnToHome();
  addEventListener('pageshow', returnToHome);
  addEventListener('load', returnToHome);

  // Static text
  $('#brandShort').textContent = D.brandShort;
  $('#alliance').textContent = D.alliance;
  $('#intro').textContent = D.intro;
  $('#heroSlogan').textContent = D.slogan;
  $('#footSlogan').textContent = D.slogan;
  $('#footAlliance').textContent = D.alliance;
  $('#update').textContent = D.updated;

  // Campus
  const campusWrap = $('#campusWrap');
  campusWrap.innerHTML = D.networks.map((n,i) => `
    <figure class="campus reveal" style="--accent:${n.color}">
      <img src="${n.image}" alt="${n.name}校园影像" loading="lazy" decoding="async" fetchpriority="${i===0?'high':'auto'}">
      <small>${n.en}</small>
      <i>${n.status}</i>
      <b>${n.name}</b>
    </figure>`).join('');

  // Brands
  const tone=['','cyan','amber'];
  $('#brandWrap').innerHTML = D.brands.map((b,i)=>`
    <article class="brand-card ${tone[i%3]} reveal">
      <div class="num">${b.num}</div>
      <span class="tag">${b.en}</span>
      <h3>${b.cn}</h3>
      <div class="brand-en">${b.en}</div>
      <p class="slogan">${b.slogan}</p>
      <p>${b.desc}</p>
      <ul class="points">${b.points.map(x=>`<li>${x}</li>`).join('')}</ul>
      <div class="brand-foot"><span>${b.date}</span></div>
    </article>`).join('');

  // WowWall CTA (data-driven)
  const wa=$('#wallCta');
  if(wa && D.wall){
    wa.href=D.wall.url; wa.textContent=D.wall.label+' ↗';
    const wn=$('#wallNote'); if(wn) wn.textContent=D.wall.note;
  }

  // Path
  $('#pathWrap').innerHTML = D.path.map((p,i)=>`
    <article class="step reveal"><small>${String(i+1).padStart(2,'0')} / ${p.chip}</small><b>${p.title}</b><p>${p.text}</p></article>`).join('');

  // Notices (公告板：只展示公告，不含活动记录)
  const list=$('#noticeList');
  function renderBoard(){
    list.innerHTML = D.notices.map(n=>`
      <article class="notice">
        <time>${n.date}</time>
        <div>
          <h4>${n.title}</h4><p>${n.body}</p>
          <div class="notice-foot"><span class="status ${n.status==='筹备'?'on':n.status==='待开启'?'wait':''}">${n.status}</span>${n.pinned?'<span class="status">置顶</span>':''}</div>
        </div>
      </article>`).join('');
  }
  renderBoard();

  // Retro (往期回顾)
  const toneMap=['','cyan','amber'];
  $('#retroWrap').innerHTML=D.retro.map((r,i)=>`
    <article class="retro-card ${toneMap[i%3]} reveal" style="--accent:${r.color}">
      <div class="num">${String(i+1).padStart(2,'0')}</div>
      <span class="tag">${r.en}</span>
      <h3>${r.title}</h3>
      <p>${r.desc}</p>
      <a class="btn ghost retro-link" href="${r.url}" target="_blank" rel="noopener">了解详情 ↗</a>
    </article>`).join('');

  // Boot
  setTimeout(()=>{
    $('.boot')?.classList.add('done');
    document.body.classList.add('booted');
  },1150);
  setTimeout(()=>{$('.boot')?.remove()},2100);

  // Nav
  const burger=$('#burger'), links=$('#navLinks');
  const setMenu = open => {
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-lock', open);
  };
  burger.addEventListener('click',()=>setMenu(!links.classList.contains('open')));
  links.addEventListener('click',e=>{if(e.target.closest('a,button'))setMenu(false)});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&links.classList.contains('open'))setMenu(false)});
  addEventListener('resize',()=>{if(innerWidth>1250&&links.classList.contains('open'))setMenu(false)});

  // Active nav
  const sections=['about','brands','board','records','wall','retro'];
  const navMap=new Map($$('.nav-links a').map(a=>[a.hash.slice(1),a]));
  const navObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){$$('.nav-links a').forEach(a=>a.classList.remove('active'));navMap.get(e.target.id)?.classList.add('active')}})},{rootMargin:'-42% 0px -52% 0px'});
  sections.forEach(id=>{const el=document.getElementById(id);if(el)navObs.observe(el)});

  // Reveal — ouke-style: 30% visibility threshold, expo-out easing, sibling stagger
  const revObs=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.classList.add('in');
    revObs.unobserve(e.target);
  }),{threshold:.3,rootMargin:'0px 0px -6% 0px'});

  function stagger(parents){
    parents.forEach(p=>{
      [...p.querySelectorAll(':scope > .reveal')].forEach((el,i)=>{
        el.style.setProperty('--d',`${Math.min(i*0.06,0.18)}s`);
      });
    });
  }
  // Group siblings so each grid/list gets its own 0.06s-step cascade (capped at 0.18s)
  const groupSet=new Set();
  $$('.reveal').forEach(el=>groupSet.add(el.parentElement));
  stagger(groupSet);
  $$('.reveal').forEach(x=>revObs.observe(x));

  // After the entrance transition settles, switch to snappier spring hover feedback
  document.addEventListener('transitionend',e=>{
    if(e.target.classList?.contains('reveal')&&e.target.classList.contains('in')){
      e.target.classList.add('fx-done');
    }
  });


  // ---- Cyber decor ----
  // HUD corner brackets on key panels
  $$('.campus-panel,.board,.kv-feature,.hero-poster-link,.brand-card,.step,.retro-card,.about-card,.panel').forEach(el=>el.classList.add('cyber-corners'));

  // section index readout on each section head (ghost number, terminal style)
  $$('.sec-head').forEach((head,i)=>{
    const label=head.querySelector('.sec-label');
    if(!label)return;
    const idx=document.createElement('span');
    idx.className='sec-index';
    idx.textContent=String(i+1).padStart(2,'0');
    head.querySelector('div').appendChild(idx);
  });


  // Data-stream ticker under the nav
  const tickItems=[
    ...D.networks.map(n=>`${n.name} · ONLINE`),
    ...D.brands.map(b=>b.cn),
    ...D.notices.map(n=>n.title)
  ];
  const seg=tickItems.map(x=>`<b>${x}</b><i>//</i>`).join('');
  const ticker=document.createElement('div');
  ticker.className='ticker';
  ticker.setAttribute('aria-hidden','true');
  ticker.innerHTML=`<div class="ticker-track"><span>SYSTEM<i>//</i>${seg}</span><span>SYSTEM<i>//</i>${seg}</span></div>`;
  document.querySelector('header.nav').insertAdjacentElement('afterend',ticker);

  // Circuit traces in the hero (pure SVG, animated dashes)
  const circuit=`<svg class="hero-circuit" viewBox="0 0 500 340" aria-hidden="true">
    <path class="c1" d="M10 40 H120 V110 H230 V60 H340 V150 H470"/>
    <path class="c2" d="M30 300 H140 V220 H260 V290 H380 V200 H490"/>
    <path class="c3" d="M60 170 H180 V120 H300 V190 H430 V130"/>
    <circle class="r" cx="10" cy="40" r="3.5"/>
    <circle cx="120" cy="110" r="3.5"/>
    <circle cx="230" cy="60" r="3.5"/>
    <circle class="r" cx="340" cy="150" r="3.5"/>
    <circle cx="470" cy="150" r="3.5"/>
    <circle cx="30" cy="300" r="3.5"/>
    <circle class="r" cx="260" cy="290" r="3.5"/>
    <circle cx="380" cy="200" r="3.5"/>
    <circle cx="180" cy="120" r="3.5"/>
    <circle class="r" cx="430" cy="130" r="3.5"/>
  </svg>`;
  document.querySelector('.hero').insertAdjacentHTML('afterbegin',circuit);

  // ============================================================
  // CYBER ART LAYER 3.0 — interaction art wiring
  // ============================================================
  const sectorMeta = {
    top:     { code:'00 / UPLINK',    accent:'#ff2e4d' },
    about:   { code:'01 / ORIGIN',    accent:'#ff2e4d' },
    brands:  { code:'02 / PROGRAMS',  accent:'#31e8c8' },
    path:    { code:'03 / PROTOCOL',  accent:'#ffd54a' },
    board:   { code:'04 / BULLETIN',  accent:'#ff2e4d' },
    records: { code:'05 / FIELD LOG', accent:'#31e8c8' },
    wall:    { code:'06 / WALL',      accent:'#8b78ff' },
    retro:   { code:'07 / ARCHIVE',   accent:'#ffd54a' }
  };

  // Big sector glyphs, readouts and orbital art behind every section
  $$('main > section').forEach((sec, i) => {
    const meta = sectorMeta[sec.id] || { code:`0${i} / SECTOR`, accent:'#ff2e4d' };
    sec.style.setProperty('--sector-accent', meta.accent);
    const art = document.createElement('div');
    art.className = 'sector-art';
    art.setAttribute('aria-hidden', 'true');
    art.innerHTML = `
      <span class="sector-art-index">${String(i).padStart(2,'0')}</span>
      <span class="sector-art-code">${meta.code} // WENZHOU NODE // ${meta.accent.toUpperCase()}</span>
      <span class="sector-art-ring"></span>
      <span class="sector-art-bars"></span>
      <span class="sector-art-cross"></span>`;
    sec.prepend(art);
  });

  // Four-corner HUD brackets on every framed surface
  $$('.cyber-corners').forEach(el => {
    const extra = document.createElement('i');
    extra.className = 'corner-extra';
    extra.setAttribute('aria-hidden', 'true');
    el.appendChild(extra);
  });

  // Perspective spotlight layer + pointer-follow glow
  const fxTargets = $$('.brand-card,.retro-card,.step,.about-card,.panel,.campus-panel,.kv-feature');
  fxTargets.forEach(el => {
    const fx = document.createElement('span');
    fx.className = 'card-fx';
    fx.setAttribute('aria-hidden', 'true');
    el.prepend(fx);
  });

  // Identity readout on the about card
  const intro = $('#intro');
  if(intro){
    intro.insertAdjacentHTML('beforebegin',
      '<div class="about-readout" aria-hidden="true"><span>PROFILE // WOWLAND</span><b>ID 3C-2026</b><span>STATUS: ACTIVE</span></div>');
  }

  // Circuit nodes on protocol steps + archive rings on retro cards
  $$('.step').forEach((step, i) => {
    step.style.setProperty('--step-index', String(i + 1));
    step.insertAdjacentHTML('afterbegin', '<span class="step-node" aria-hidden="true"></span>');
  });
  $$('.retro-card').forEach((card, i) => {
    card.insertAdjacentHTML('beforeend',
      `<span class="retro-visual" aria-hidden="true"></span><span class="retro-file" aria-hidden="true">ARCHIVE_${String(i + 1).padStart(2,'0')}.DAT</span>`);
  });

  // CRT signal waveform in the empty activity-log viewport
  const logWave = $('#logWave');
  if(logWave){
    logWave.innerHTML = Array.from({length:34}, (_, i) => {
      const h = 16 + Math.round(Math.random() * 84);
      const d = (i * 0.055).toFixed(2);
      return `<i style="--h:${h}%;--d:${d}s"></i>`;
    }).join('');
  }

  // Hero network status cycles like a live terminal
  const netStatus = $('#netStatus');
  if(netStatus && !prefersReduced.matches){
    const statuses = ['ONLINE','SYNCING','LINKED','STABLE'];
    let si = 0;
    setInterval(() => {
      netStatus.classList.add('swap');
      setTimeout(() => {
        si = (si + 1) % statuses.length;
        netStatus.textContent = statuses[si];
        netStatus.classList.remove('swap');
      }, 150);
    }, 3200);
  }

  // ---- HUD telemetry: section, coordinates, clock, scroll progress ----
  const hudSection = $('#hudSection');
  const hudCoords = $('#hudCoords');
  const hudClock = $('#hudClock');
  const hudProgress = $('#hudProgress');
  const hudLabels = {
    top:'00 / HERO', about:'01 / ORIGIN', brands:'02 / PROGRAMS', path:'03 / PROTOCOL',
    board:'04 / BULLETIN', records:'05 / FIELD LOG', wall:'06 / WALL', retro:'07 / ARCHIVE'
  };
  if(hudSection){
    const hudObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting && hudLabels[e.target.id]) hudSection.textContent = hudLabels[e.target.id];
      });
    }, { rootMargin:'-42% 0px -52% 0px' });
    $$('main > section').forEach(sec => hudObs.observe(sec));
  }

  let coordX = 0, coordY = 0, coordRaf = null;
  const paintCoords = () => {
    if(hudCoords) hudCoords.textContent =
      `X ${String(Math.max(0, Math.round(coordX))).padStart(4,'0')} / Y ${String(Math.max(0, Math.round(coordY))).padStart(4,'0')}`;
    coordRaf = null;
  };
  addEventListener('pointermove', e => {
    coordX = e.clientX; coordY = e.clientY;
    if(!coordRaf) coordRaf = requestAnimationFrame(paintCoords);
  }, { passive:true });

  const paintClock = () => {
    if(!hudClock) return;
    const d = new Date();
    hudClock.textContent = d.toLocaleTimeString('en-GB', { hour12:false });
  };
  paintClock();
  setInterval(paintClock, 1000);

  let progressQueued = false;
  const paintProgress = () => {
    progressQueued = false;
    if(!hudProgress) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    hudProgress.style.setProperty('--p', p.toFixed(4));
  };
  addEventListener('scroll', () => {
    if(!progressQueued){ progressQueued = true; requestAnimationFrame(paintProgress); }
  }, { passive:true });
  addEventListener('resize', paintProgress);
  paintProgress();
  paintCoords();

  // Yield the bottom HUD to the footer so the copyright stays legible
  const footEl = document.querySelector('.site-foot');
  if(footEl){
    const footObs = new IntersectionObserver(entries => {
      document.body.classList.toggle('at-footer', entries.some(e => e.isIntersecting));
    }, { threshold:.06 });
    footObs.observe(footEl);
  }

  // ---- Custom cyber cursor + click lock-on ripple ----
  const cursor = $('#cursor');
  const cursorLabel = $('#cursorLabel');
  if(cursor && finePointer.matches && !prefersReduced.matches){
    document.body.classList.add('cursor-ready');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive:true });
    const cursorLoop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx.toFixed(2)}px,${cy.toFixed(2)}px,0)`;
      requestAnimationFrame(cursorLoop);
    };
    cursorLoop();

    const hotZone = 'a,button,.brand-card,.retro-card,.step,.campus,.notice,.qr-item,.panel,.hero-poster-link,.log-empty';
    document.addEventListener('pointerover', e => {
      const hit = e.target.closest(hotZone);
      cursor.classList.toggle('is-active', !!hit);
      if(cursorLabel){
        cursorLabel.textContent = hit
          ? (hit.dataset.cursor || (hit.matches('a,button') ? 'OPEN' : 'SCAN'))
          : 'LINK';
      }
    });
    document.addEventListener('pointerdown', e => {
      cursor.classList.add('is-down');
      if(prefersReduced.matches) return;
      const ring = document.createElement('span');
      ring.className = 'click-ring';
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      document.body.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove(), { once:true });
    });
    document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
  }

  // ---- Spotlight + tilt for framed cards ----
  if(finePointer.matches && !prefersReduced.matches){
    fxTargets.forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (e.clientX - r.left) / Math.max(1, r.width)));
        const y = Math.min(1, Math.max(0, (e.clientY - r.top) / Math.max(1, r.height)));
        el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
        if(el.matches('.brand-card,.retro-card,.step')){
          el.style.setProperty('--tilt-x', `${((0.5 - y) * 4).toFixed(2)}deg`);
          el.style.setProperty('--tilt-y', `${((x - 0.5) * 6).toFixed(2)}deg`);
        }
      }, { passive:true });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '50%');
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  // Section title glitch burst when a sector is acquired
  const titleGlitchObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const title = e.target.querySelector('.sec-title');
      if(title && !prefersReduced.matches){
        title.classList.add('glitch-in');
        setTimeout(() => title.classList.remove('glitch-in'), 650);
      }
      titleGlitchObs.unobserve(e.target);
    });
  }, { threshold:.32 });
  $$('main > section').forEach(sec => { if(sec.id) titleGlitchObs.observe(sec); });

  // Keep the QR chrome above the generated decoration layer
  const qrCardEl = $('#qrCard');
  if(qrCardEl) qrCardEl.style.setProperty('--sector-accent', '#31e8c8');

  // Periodic glitch flicker on the neon "WowLand" wordmark
  setInterval(()=>{
    document.body.classList.add('glitching');
    setTimeout(()=>document.body.classList.remove('glitching'),700);
  },6000);

  // ---- Scroll-linked color flow (hero palette -> section palette) ----
  const mesh=document.querySelector('.hero-mesh');
  const root=document.documentElement;
  // Keyframes: [scrollY px, --fa red, --fb cyanTR, --fc violet, --fd cyanBR, --fe redBL]
  // Derived from viewport height so pacing feels the same on every screen.
  const stops=[
    [0,      .26, .12, .14, .05, .05],
    [innerHeight*.55, .22, .11, .16, .08, .07],
    [innerHeight*1.1, .12, .09, .20, .11, .09],
    [innerHeight*2.0, .07, .08, .16, .13, .07],
    [innerHeight*3.2, .05, .10, .12, .10, .05],
    [1e9,    .05, .10, .12, .10, .05]
  ];
  let cur=[.26,.12,.14,.05,.05], tgt=[...cur], flowRaf=null;
  function pick(y){
    for(let i=0;i<stops.length-1;i++){
      const [y0,...a]=stops[i],[y1,...b]=stops[i+1];
      if(y>=y0&&y<y1){const t=(y-y0)/Math.max(y1-y0,1);return a.map((v,k)=>v+(b[k]-v)*t)}
    }
    return stops[stops.length-1].slice(1);
  }
  function applyFlow(){
    cur=cur.map((v,i)=>v+(tgt[i]-v)*.09);
    mesh.style.setProperty('--fa',cur[0].toFixed(3));
    mesh.style.setProperty('--fb',cur[1].toFixed(3));
    mesh.style.setProperty('--fc',cur[2].toFixed(3));
    mesh.style.setProperty('--fd',cur[3].toFixed(3));
    mesh.style.setProperty('--fe',cur[4].toFixed(3));
    if(Math.abs(tgt[0]-cur[0])+Math.abs(tgt[2]-cur[2])>0.002){
      flowRaf=requestAnimationFrame(applyFlow);
    }else flowRaf=null;
  }
  function onScrollFlow(){
    tgt=pick(scrollY);
    if(!flowRaf)flowRaf=requestAnimationFrame(applyFlow);
  }
  addEventListener('scroll',onScrollFlow,{passive:true});
  onScrollFlow();
  // Initialize immediately
  applyFlow();
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){
    // jump straight to the target without easing
    cur=[...tgt];applyFlow();cancelAnimationFrame(flowRaf);flowRaf=null;
  }
  addEventListener('resize',()=>{onScrollFlow()});

  // Cyber particles
  const canvas=$('#fx'), ctx=canvas.getContext('2d');
  let w,h,pts=[],raf,mx=0,my=0;
  const dpr=Math.min(devicePixelRatio||1,2);
  function resize(){w=canvas.width=innerWidth*dpr;h=canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';
    const count=innerWidth<760?64:150;
    pts=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22*dpr,vy:(Math.random()-.5)*.22*dpr,r:(Math.random()*1.6+.5)*dpr}));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    // grid
    ctx.strokeStyle='rgba(255,46,77,.07)';ctx.lineWidth=1;
    for(let x=0;x<w;x+=72*dpr){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
    for(let y=0;y<h;y+=72*dpr){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    // points
    pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
      ctx.fillStyle='rgba(49,232,200,.72)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill()});
    // links
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y)/dpr;
      if(d<120){ctx.strokeStyle=`rgba(255,46,77,${.16*(1-d/120)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
    // cursor echo
    const cx=mx*dpr,cy=my*dpr;
    ctx.strokeStyle='rgba(255,255,255,.24)';ctx.beginPath();ctx.moveTo(cx-14*dpr,cy);ctx.lineTo(cx+14*dpr,cy);ctx.moveTo(cx,cy-14*dpr);ctx.lineTo(cx,cy+14*dpr);ctx.stroke();
    raf=requestAnimationFrame(draw);
  }
  resize();draw();
  addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw()});
  addEventListener('load',()=>{cancelAnimationFrame(raf);resize();draw()});
  addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});
  // Reduced motion: render one static frame instead of a continuous loop
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){
    cancelAnimationFrame(raf);draw();
  }

  // ---- QR modal ----
  const qrModal = $('#qrModal');
  const qrCard = $('#qrCard');
  const qrClose = $('#qrClose');
  const qrCanvas = $('#qrCodeCanvas');
  const qrCtx = qrCanvas?.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let qrAnim = null;
  let qrLastFocus = null;

  function clearQrCanvas(){
    if(!qrCanvas || !qrCtx) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    qrCtx.setTransform(1, 0, 0, 1, 0, 0);
    qrCtx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
    qrCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function animateQrDecode(){
    if(!qrModal || !qrCard || !qrCanvas || !qrCtx) return;
    cancelAnimationFrame(qrAnim);
    clearQrCanvas();

    if(reduceMotion.matches){
      qrCanvas.style.opacity = '0';
      return;
    }

    const dpr = Math.min(devicePixelRatio || 1, 2);
    const rect = qrCard.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    qrCanvas.width = Math.round(w * dpr);
    qrCanvas.height = Math.round(h * dpr);
    qrCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    qrCanvas.style.opacity = '1';

    const chars = '01';
    const rowHeight = 14;
    const charWidth = 6.8;
    const pad = 18;
    const duration = 1650;
    const start = performance.now();

    function draw(now){
      const raw = Math.min(1, (now - start) / duration);
      const progress = 1 - Math.pow(1 - raw, 3);
      const scanY = h * progress;

      qrCtx.clearRect(0, 0, w, h);
      if(scanY < h){
        qrCtx.fillStyle = 'rgba(3,5,8,.91)';
        qrCtx.fillRect(0, scanY, w, h - scanY);

        qrCtx.font = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        qrCtx.textBaseline = 'top';
        const count = Math.ceil((w - pad * 2) / charWidth);
        let row = Math.max(0, Math.floor(scanY / rowHeight));
        for(let y = row * rowHeight; y < h; y += rowHeight){
          let bits = '';
          for(let i = 0; i < count; i++) bits += chars[(Math.random() * 2) | 0];
          qrCtx.fillStyle = row % 9 === 0
            ? 'rgba(255,46,77,.36)'
            : row % 3 === 0
              ? 'rgba(49,232,200,.24)'
              : 'rgba(49,232,200,.35)';
          qrCtx.fillText(bits, pad, y);
          row++;
        }
      }

      if(raw < 1){
        const lineY = Math.min(h - 1, scanY);
        qrCtx.save();
        qrCtx.shadowColor = 'rgba(255,46,77,.9)';
        qrCtx.shadowBlur = 18;
        qrCtx.fillStyle = 'rgba(255,46,77,.95)';
        qrCtx.fillRect(0, lineY, w, 2);
        qrCtx.restore();
        qrCtx.fillStyle = 'rgba(255,46,77,.12)';
        qrCtx.fillRect(0, Math.max(0, lineY - 12), w, 12);
        qrCtx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
        qrCtx.fillStyle = 'rgba(255,144,160,.9)';
        qrCtx.fillText(`DECODE ${String(Math.round(raw * 100)).padStart(3, '0')}%`, w - 112, Math.max(8, lineY - 16));
        qrAnim = requestAnimationFrame(draw);
      }else{
        qrCtx.clearRect(0, 0, w, h);
        qrCanvas.style.opacity = '0';
        qrAnim = null;
      }
    }

    qrAnim = requestAnimationFrame(draw);
  }

  function openQrModal(){
    if(!qrModal) return;
    qrLastFocus = document.activeElement;
    qrModal.classList.add('open');
    qrModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('qr-lock');
    requestAnimationFrame(() => {
      animateQrDecode();
      qrClose?.focus({ preventScroll: true });
    });
  }

  function closeQrModal(){
    if(!qrModal || !qrModal.classList.contains('open')) return;
    qrModal.classList.remove('open');
    qrModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('qr-lock');
    cancelAnimationFrame(qrAnim);
    qrAnim = null;
    clearQrCanvas();
    if(qrLastFocus && typeof qrLastFocus.focus === 'function'){
      qrLastFocus.focus({ preventScroll: true });
    }
  }

  $$('.qr-open').forEach(btn => btn.addEventListener('click', openQrModal));
  qrClose?.addEventListener('click', closeQrModal);
  qrModal?.addEventListener('click', e => {
    if(e.target === qrModal) closeQrModal();
  });
  document.addEventListener('keydown', e => {
    if(!qrModal?.classList.contains('open')) return;
    if(e.key === 'Escape'){
      e.preventDefault();
      closeQrModal();
      return;
    }
    if(e.key === 'Tab'){
      const focusable = [...qrModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.disabled && el.getClientRects().length);
      if(!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if(e.shiftKey && document.activeElement === first){
        e.preventDefault();
        last.focus();
      }else if(!e.shiftKey && document.activeElement === last){
        e.preventDefault();
        first.focus();
      }
    }
  });
  addEventListener('resize', () => {
    if(qrModal?.classList.contains('open')) animateQrDecode();
  });

  // Edit anchors
  $$('.edit-anchor').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();alert('编辑入口已保留：修改 data.js 中对应字段即可更新该板块。');
  }));
});
