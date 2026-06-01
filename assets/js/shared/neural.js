// Shared animation helpers for TrustAI homepage
(function(){
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal-on-scroll: observes [data-reveal] inside root and replays on re-entry.
  window.initReveal = function(root){
    root = root || document;
    const els = root.querySelectorAll('[data-reveal]');
    if (reduce){ els.forEach(e=>e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        const el = en.target;
        if(en.isIntersecting){
          const d = parseFloat(el.getAttribute('data-delay')||'0');
          el.style.transitionDelay = d + 'ms';
          el.classList.add('is-in');
        } else {
          el.style.transitionDelay = '0ms';
          el.classList.remove('is-in');
        }
      });
    }, { threshold:0.12, rootMargin:'0px 0px -8% 0px' });
    els.forEach(e=>io.observe(e));
    return io;
  };

  // Count-up: animates [data-count] numbers when visible. Keeps suffix like + or %.
  window.initCounters = function(root){
    root = root || document;
    const els = root.querySelectorAll('[data-count]:not(.counted)');
    const run = (el)=>{
      el.classList.add('counted');
      const raw = el.getAttribute('data-count');
      const m = String(raw).match(/^(\d+)(.*)$/);
      if(!m){ el.textContent = raw; return; }
      const target = parseInt(m[1],10); const suffix = m[2]||'';
      if (reduce){ el.textContent = target + suffix; return; }
      const dur = 1400; const t0 = performance.now();
      const tick = (t)=>{
        const p = Math.min(1,(t-t0)/dur);
        const e = 1 - Math.pow(1-p,3);
        el.textContent = Math.round(target*e) + suffix;
        if(p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (reduce){ els.forEach(run); return; }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ run(en.target); io.unobserve(en.target); } });
    }, { threshold:0.5 });
    els.forEach(e=>io.observe(e));
    return io;
  };

  // Lightweight neural-network canvas: nodes drift, links fade by distance,
  // pulses travel along links. Returns a stop() fn. Subtle & professional.
  window.neuralNet = function(canvas, opts){
    opts = opts || {};
    if (reduce) return function(){};
    const ctx = canvas.getContext('2d');
    let W=0,H=0,dpr=Math.min(2,window.devicePixelRatio||1), raf=0;
    const COUNT = opts.count||34;
    const LINK = opts.linkDist||150;
    const node = opts.node||'#2D7DBE';
    const line = opts.line||'45,125,190';
    const pulse = opts.pulse||'#34D3E0';
    const pulseChance = opts.pulseChance||0.04;
    const glow = opts.glow||'52,211,224';
    const drift = opts.drift||0.22;
    let nodes=[], pulses=[];
    function resize(){
      W=canvas.clientWidth; H=canvas.clientHeight;
      canvas.width=W*dpr; canvas.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function seed(){
      nodes=[];
      for(let i=0;i<COUNT;i++){
        const band = Math.random();
        const cx = band < .68 ? W*(.22+Math.random()*.56) : Math.random()*W;
        const cy = band < .68 ? H*(.20+Math.random()*.58) : Math.random()*H;
        nodes.push({
          x:cx,y:cy,
          vx:(Math.random()-.5)*drift,vy:(Math.random()-.5)*drift,
          r:Math.random()*1.9+1.05,
          phase:Math.random()*Math.PI*2
        });
      }
    }
    function spawnPulse(){
      // pick a random link
      const a=Math.floor(Math.random()*nodes.length);
      let b=-1,best=LINK;
      for(let j=0;j<nodes.length;j++){ if(j===a)continue; const dx=nodes[a].x-nodes[j].x,dy=nodes[a].y-nodes[j].y; const d=Math.hypot(dx,dy); if(d<best){best=d;b=j;} }
      if(b>=0) pulses.push({a,b,t:0,sp:0.0035+Math.random()*0.0045,w:Math.random()*1.4+1});
    }
    function drawGlow(){
      const g=ctx.createRadialGradient(W*.5,H*.46,0,W*.5,H*.46,Math.max(W,H)*.56);
      g.addColorStop(0,`rgba(${glow},.16)`);
      g.addColorStop(.42,`rgba(${glow},.07)`);
      g.addColorStop(1,`rgba(${glow},0)`);
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    }
    function frame(){
      ctx.clearRect(0,0,W,H);
      drawGlow();
      for(const n of nodes){
        n.x+=n.vx; n.y+=n.vy;
        if(n.x<0||n.x>W) n.vx*=-1; if(n.y<0||n.y>H) n.vy*=-1;
      }
      // links
      for(let i=0;i<nodes.length;i++){
        for(let j=i+1;j<nodes.length;j++){
          const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y; const d=Math.hypot(dx,dy);
          if(d<LINK){
            const a=(1-d/LINK)*0.52;
            const mx=(nodes[i].x+nodes[j].x)/2, my=(nodes[i].y+nodes[j].y)/2;
            const bend=Math.sin((performance.now()/2200)+nodes[i].phase)*6;
            ctx.strokeStyle=`rgba(${line},${a})`; ctx.lineWidth=1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x,nodes[i].y);
            ctx.quadraticCurveTo(mx+bend,my-bend,nodes[j].x,nodes[j].y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for(const n of nodes){
        const breathe=.75+Math.sin(performance.now()/1800+n.phase)*.12;
        ctx.fillStyle=node; ctx.globalAlpha=.72;
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,7); ctx.fill();
        ctx.fillStyle=`rgba(${glow},${.07*breathe})`;
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r*5.4,0,7); ctx.fill();
      }
      ctx.globalAlpha=1;
      // pulses
      for(let k=pulses.length-1;k>=0;k--){
        const p=pulses[k]; p.t+=p.sp; if(p.t>=1){ pulses.splice(k,1); continue; }
        const A=nodes[p.a],B=nodes[p.b]; if(!A||!B){ pulses.splice(k,1); continue; }
        const x=A.x+(B.x-A.x)*p.t, y=A.y+(B.y-A.y)*p.t;
        ctx.fillStyle=pulse; ctx.shadowColor=pulse; ctx.shadowBlur=14;
        ctx.beginPath(); ctx.arc(x,y,2.4*p.w,0,7); ctx.fill();
        ctx.globalAlpha=.22; ctx.beginPath(); ctx.arc(x,y,8*p.w,0,7); ctx.fill(); ctx.globalAlpha=1; ctx.shadowBlur=0;
      }
      if(Math.random()<pulseChance) spawnPulse();
      raf=requestAnimationFrame(frame);
    }
    resize(); seed();
    const onR=()=>{ resize(); seed(); };
    window.addEventListener('resize',onR);
    frame();
    return function(){ cancelAnimationFrame(raf); window.removeEventListener('resize',onR); };
  };
})();
