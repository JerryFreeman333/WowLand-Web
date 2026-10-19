document.addEventListener('DOMContentLoaded', () => {
  const D = window.SITE || window.SITE_FALLBACK || {};
  if(!D.networks) return;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

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
  campusWrap.innerHTML = D.networks.map(n => `
    <figure class="campus reveal" style="--accent:${n.color}">
      <img src="${n.image}" alt="${n.name}校园影像" loading="lazy">
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
  setTimeout(()=>{$('.boot').classList.add('done')},850);

  // Nav
  const burger=$('#burger'), links=$('#navLinks');
  burger.addEventListener('click',()=>{links.classList.toggle('open');burger.setAttribute('aria-expanded',links.classList.contains('open'))});
  links.addEventListener('click',e=>{if(e.target.closest('a'))links.classList.remove('open')});

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

  // Edit anchors
  $$('.edit-anchor').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();alert('编辑入口已保留：修改 data.js 中对应字段即可更新该板块。');
  }));
});
