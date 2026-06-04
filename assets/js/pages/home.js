// Vanilla TrustAI homepage renderer.
(function(){
  const SITE = window.TRUSTAI_SITE;
  const T = window.TRUSTAI_HOME;
  const I = window.Icon;
  const PILLAR_ICONS = window.PILLAR_ICONS || [];

  const orbitAngleSets = {
    4: [-135, -45, 45, 135],
    6: [-90, -30, 30, 90, 150, 210],
    9: [-90, -50, -10, 30, 70, 110, 150, 190, 230]
  };
  const researchOrbitAdvanceMs = 4800;

  function orbitAngle(index, total){
    const angles = orbitAngleSets[total];
    if (angles) return angles[index];
    return -90 + (index * (360 / Math.max(total, 1)));
  }

  function esc(value){
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function icon(name, size){
    return I ? I({ name, size }) : "";
  }

  function marker(name){
    return esc((T.sectionMarkers && T.sectionMarkers[name]) || "");
  }

  function sectionHeader({ kicker, title, subtitle, delay = 120 }){
    return `
      <div class="vA-head">
        <div class="vA-kicker" data-reveal>${esc(kicker)}</div>
        <h2 data-reveal data-delay="60">${esc(title)}</h2>
        ${subtitle ? `<p class="sub" data-reveal data-delay="${delay}">${esc(subtitle)}</p>` : ""}
        <span class="vA-sectionRule" data-reveal data-delay="${delay + 60}"></span>
      </div>
    `;
  }

  function nav(){
    return `
      <nav class="vA-nav">
        <a class="vA-navLogoLink" href="#" aria-label="${esc(SITE.brand.name)}">
          <img class="vA-navLogo" src="${esc(SITE.assets.logoFull)}" alt="${esc(SITE.brand.name)}">
        </a>
        <div class="vA-links">
          ${SITE.nav.items.filter((item) => item.visible).map((item) => `<a href="${esc(item.href)}">${esc(item.label)}</a>`).join("")}
        </div>
      </nav>
    `;
  }

  function hero(){
    return `
      <header class="vA-hero">
        <canvas class="vA-neural"></canvas>
        <div class="vA-heroBrand" data-reveal="scale">
          <div class="vA-brandLockup">
            <img class="vA-cutLogo" src="${esc(SITE.assets.logoSymbol)}" alt="" aria-hidden="true">
            <div class="vA-wordmark">
              <h1 class="vA-heroTitle">${esc(SITE.brand.wordmarkPrefix)}<span class="ai">${esc(SITE.brand.wordmarkAccent)}</span></h1>
              <p class="vA-heroClaim">${esc(SITE.brand.claim)}</p>
            </div>
          </div>
        </div>
        <div class="vA-introMeta" data-reveal data-delay="180"><span class="dot"></span><span class="vA-introText">${esc(SITE.brand.heroMeta)}</span></div>
        <div class="vA-cue">${esc(SITE.ui.scrollCue)}<div class="m"></div></div>
      </header>
    `;
  }

  function sectionMission(){
    return `
      <section class="vA-step vA-mission">
        <div class="vA-marker">${marker("mission")}</div>
        <div class="vA-head">
          <div class="vA-kicker" data-reveal>${esc(T.mission.kicker)}</div>
          <h2 data-reveal="missionTitle" data-delay="80">${esc(T.mission.title)}</h2>
        </div>
        <div class="vA-missionLine" data-reveal data-delay="170">
          <p class="vA-mlead">${esc(T.mission.leadPrefix)}<span class="hl">${esc(T.mission.leadHighlight)}</span>${esc(T.mission.leadSuffix)}</p>
        </div>
        <div class="vA-missionTriad" data-reveal data-delay="280">
          <span class="vA-pulseTrack t1"><span class="vA-infoPulse p1"></span></span>
          <span class="vA-pulseTrack t2"><span class="vA-infoPulse p2"></span></span>
          ${T.mission.pillars.map((pillar, index) => `
            <div class="vA-triadNode n${index + 1}" data-reveal data-delay="${360 + index * 160}">
              <div class="vA-nodeOrb">${icon(PILLAR_ICONS[index], 34)}</div>
              <h3>${esc(pillar.t)}</h3>
              <p class="vA-triadDesc">${esc(pillar.d)}</p>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  function sectionResearch(){
    return `
      <section class="vA-step alt">
        <div class="vA-marker">${marker("research")}</div>
        ${sectionHeader({
          kicker: T.research.kicker,
          title: T.research.title,
          subtitle: T.research.subtitle
        })}
        <div class="vA-researchOrbit" data-reveal>
          <div class="vA-orbitMap">
            <div class="vA-orbitRing r1"></div>
            <div class="vA-orbitRing r2"></div>
            <div class="vA-orbitRing r3"></div>
            <div class="vA-orbitSignal s1"></div>
            <div class="vA-orbitSignal s2"></div>
            <div class="vA-orbitSignal s3"></div>
            <div class="vA-orbitCore">
              <div class="vA-orbitFocus">
                <div class="focusNum"></div>
                <div class="focusTitle"></div>
                <p class="focusDesc"></p>
              </div>
            </div>
            ${T.areas.map((area, index) => `
              <button class="vA-orbitItem" data-index="${index}" style="--a:${orbitAngle(index, T.areas.length)}deg" aria-label="${esc(`${area.n}. ${area.t}`)}">
                <span class="orbitIndex">${esc(area.n)}</span>
                <span class="orbitTitle">${esc(area.t)}</span>
              </button>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function sectionEducation(){
    return `
      <section class="vA-step">
        <div class="vA-marker">${marker("education")}</div>
        ${sectionHeader({
          kicker: T.education.kicker,
          title: T.education.title,
          delay: 60
        })}
        <div class="vA-eduPath">
          <div class="vA-eduFrame" data-reveal>
            <p class="lead" data-reveal>${esc(T.education.intro)}</p>
            <p class="goal" data-reveal data-delay="80">${esc(T.education.goal)}</p>
          </div>
          <div class="vA-eduStages">
            ${T.education.items.map((item, index) => `
              <div class="vA-eduStage" data-reveal data-delay="${80 + index * 70}">
                <div class="vA-ico">${icon(item.icon, 22)}</div>
                <div class="body">
                  <h3>${esc(item.t)}</h3>
                  <p>${esc(item.d)}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function sectionCollaborations(){
    return `
      <section class="vA-step alt">
        <div class="vA-marker">${marker("collaborations")}</div>
        ${sectionHeader({
          kicker: T.collab.kicker,
          title: T.collab.title,
          subtitle: T.collab.intro
        })}
        <div class="vA-actors" data-reveal>
          ${T.collab.actors.map((actor, index) => `
            <div class="vA-actor">
              <div class="ic">${icon(actor.icon, 26)}</div>
              <div class="t">${esc(actor.t)}</div>
              <div class="d">${esc(actor.d)}</div>
            </div>
            ${index < T.collab.actors.length - 1 ? `<div class="vA-aconn"><span class="sp" style="animation-delay:${index * 0.9}s"></span></div>` : ""}
          `).join("")}
        </div>
        <p class="vA-cgoal" data-reveal>${esc(T.collab.goal)}</p>
        <div class="vA-acts">
          ${T.collab.activities.map((activity, index) => `
            <div class="vA-act" data-reveal data-delay="${index * 80}">
              <div class="vA-ico">${icon(activity.icon, 22)}</div>
              <h3>${esc(activity.t)}</h3>
              <p>${esc(activity.d)}</p>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  function footer(){
    return `
      <footer class="vA-foot">
        <div class="top">
          <div class="vA-footBrand">
            <div class="vA-footWordmark" aria-label="${esc(SITE.brand.name)}">
              ${esc(SITE.footer.wordmarkPrefix)}<span class="ai">${esc(SITE.footer.wordmarkAccent)}</span>
            </div>
            <p class="vA-footClaim">${esc(SITE.footer.claim)}</p>
          </div>
        </div>
        <div class="bottom">
          <span>${esc(SITE.footer.copyright)}</span>
          <span>${esc(SITE.footer.legal)}</span>
        </div>
      </footer>
    `;
  }

  function renderHomePage(){
    return `
      <div class="vA">
        ${nav()}
        <div class="vA-flow">
          <div class="vA-rail"><div class="fill"><span class="pulse"></span></div></div>
          ${hero()}
          ${sectionMission()}
          ${sectionResearch()}
          ${sectionEducation()}
          ${sectionCollaborations()}
        </div>
        ${footer()}
      </div>
    `;
  }

  function initHero(root){
    const heroEl = root.querySelector(".vA-hero");
    const canvas = root.querySelector(".vA-neural");
    const stops = [];

    if (canvas && window.neuralNet) {
      stops.push(window.neuralNet(canvas, {
        count: 46,
        linkDist: 195,
        node: "#2D7DBE",
        line: "45,125,190",
        pulse: "#22B6C8",
        pulseChance: 0.052,
        glow: "52,211,224",
        drift: 0.16
      }));
    }

    const onMove = (event) => {
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const mx = (event.clientX - rect.left) / rect.width - 0.5;
      const my = (event.clientY - rect.top) / rect.height - 0.5;
      heroEl.style.setProperty("--px", `${(mx * 8).toFixed(1)}px`);
      heroEl.style.setProperty("--py", `${(my * 8).toFixed(1)}px`);
      heroEl.style.setProperty("--pxs", `${(mx * -20).toFixed(1)}px`);
      heroEl.style.setProperty("--pys", `${(my * -20).toFixed(1)}px`);
    };

    if (heroEl) heroEl.addEventListener("mousemove", onMove);

    return () => {
      if (heroEl) heroEl.removeEventListener("mousemove", onMove);
      stops.forEach((stop) => stop && stop());
    };
  }

  function initFlow(root){
    const flow = root.querySelector(".vA-flow");
    const fill = root.querySelector(".vA-rail .fill");
    const markers = Array.from(root.querySelectorAll(".vA-marker"));

    const onScroll = () => {
      if (!flow || !fill) return;
      const rect = flow.getBoundingClientRect();
      const vh = window.innerHeight;
      const frac = Math.min(Math.max((vh * 0.46 - rect.top) / rect.height, 0), 1);
      fill.style.height = `${frac * 100}%`;
      markers.forEach((marker) => {
        const markerRect = marker.getBoundingClientRect();
        marker.classList.toggle("lit", markerRect.top < vh * 0.52);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }

  function initResearchOrbit(root){
    const focus = root.querySelector(".vA-orbitFocus");
    const num = focus && focus.querySelector(".focusNum");
    const title = focus && focus.querySelector(".focusTitle");
    const desc = focus && focus.querySelector(".focusDesc");
    const items = Array.from(root.querySelectorAll(".vA-orbitItem"));
    let active = 0;
    let isOrbitPaused = false;

    const setActive = (index) => {
      active = index;
      const area = T.areas[active] || T.areas[0];
      items.forEach((item, itemIndex) => item.classList.toggle("on", itemIndex === active));
      if (num) num.textContent = `${area.n}${T.research.focusSeparator}${T.research.focusLabel}`;
      if (title) title.textContent = area.t;
      if (desc) desc.textContent = area.d;
      if (focus) {
        focus.style.animation = "none";
        focus.offsetHeight;
        focus.style.animation = "";
      }
    };

    const pauseOrbit = (index) => {
      isOrbitPaused = true;
      setActive(index);
    };

    const resumeOrbit = () => {
      isOrbitPaused = false;
    };

    items.forEach((item) => {
      const index = Number(item.dataset.index);
      item.addEventListener("mouseenter", () => pauseOrbit(index));
      item.addEventListener("mouseleave", resumeOrbit);
      item.addEventListener("focus", () => pauseOrbit(index));
      item.addEventListener("blur", resumeOrbit);
    });

    const timer = setInterval(() => {
      if (!isOrbitPaused) setActive((active + 1) % T.areas.length);
    }, researchOrbitAdvanceMs);
    setActive(0);

    return () => clearInterval(timer);
  }

  function mountHomePage(){
    document.title = SITE.brand.pageTitle;

    const stage = document.getElementById("stage");
    if (!stage) return;

    stage.innerHTML = renderHomePage();
    const root = stage.querySelector(".vA");
    const stops = [
      initHero(root),
      initFlow(root),
      initResearchOrbit(root)
    ];

    setTimeout(() => {
      if (window.initReveal) stops.push(window.initReveal(root));
      if (window.initCounters) stops.push(window.initCounters(root));
    }, 50);
  }

  window.TrustAIHomePage = { renderHomePage, mountHomePage };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountHomePage, { once: true });
  } else {
    mountHomePage();
  }
})();
