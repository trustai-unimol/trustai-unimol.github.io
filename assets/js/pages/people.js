// Vanilla TrustAI people page renderer.
(function(){
  const SITE = window.TRUSTAI_SITE;
  const D = window.TRUSTAI_PEOPLE;
  const M = D.meta;

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g, (c) => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function icon(name, size){
    return window.Icon ? window.Icon({ name, size }) : '';
  }

  function pad(n){
    return String(n).padStart(2, '0');
  }

  function navItems(){
    return SITE.nav.items.filter((item) => item.visible);
  }

  function homeHref(){
    const home = SITE.nav.items.find((item) => item.id === 'home');
    return home ? home.href : 'home.html';
  }

  function peopleStats(){
    const stats = {
      total: D.people.length,
      alumni: (D.alumni || []).length,
      pastStudents: (D.pastStudents || []).length,
    };
    return stats;
  }

  function nav(){
    return `
      <nav class="vA-nav">
        <a class="vA-navLogoLink" href="${esc(homeHref())}" aria-label="${esc(SITE.brand.name)}">
          <img class="vA-navLogo" src="${esc(SITE.assets.logoFull)}" alt="${esc(SITE.brand.name)}">
        </a>
        <div class="vA-links">
          ${navItems().map((item) => `
            <a href="${esc(item.href)}" class="${item.id === M.activeNav ? 'is-active' : ''}"${item.id === M.activeNav ? ' aria-current="page"' : ''}>${esc(item.label)}</a>
          `).join('')}
        </div>
      </nav>`;
  }

  function hero(){
    const s = peopleStats();
    return `
      <header class="ppl-hero">
        <canvas class="ppl-neural" aria-hidden="true"></canvas>
        <div class="ppl-heroInner">
          <div class="ppl-kicker">${esc(M.kicker)}</div>
          <h1 class="ppl-heroTitle">${esc(M.title)}</h1>
          <p class="ppl-heroSub">${esc(M.subtitle)}</p>
          <div class="ppl-stats">
            <div class="ppl-stat"><div class="num">${pad(s.total)}</div><div class="lbl">${esc(M.statMembers)}</div></div>
            <div class="ppl-stat"><div class="num">${pad(s.alumni)}</div><div class="lbl">${esc(M.statAlumni)}</div></div>
            <div class="ppl-stat"><div class="num">${pad(s.pastStudents)}</div><div class="lbl">${esc(M.statPastStudents)}</div></div>
          </div>
        </div>
      </header>`;
  }

  function portrait(person, className){
    if (person.photo) {
      return `
      <div class="ppl-portrait ${esc(className || '')}">
        <img class="ppl-photo" src="${esc(person.photo)}" alt="${esc(person.name)}" loading="lazy">
      </div>`;
    }
    const fallback = person.mono || String(person.name || '').trim().charAt(0) || '?';
    return `
      <div class="ppl-portrait ${esc(className || '')}">
        <span class="mono">${esc(fallback)}</span>
        <span class="cap">${esc(M.portraitLabel)}</span>
      </div>`;
  }

  function kwTags(list){
    return (list || []).map((item) => `<span class="ppl-kw">${esc(item)}</span>`).join('');
  }

  function links(person, variant){
    return (person.links || []).map((link) => {
      const def = D.linkIcons[link.type] || D.linkIcons.profile;
      if (variant === 'lead') {
        return `<a class="ppl-link" href="${esc(link.href)}" aria-label="${esc(def.label)}">${icon(def.icon, 17)}${esc(def.label)}</a>`;
      }
      return `<a class="ppl-iconBtn" href="${esc(link.href)}" title="${esc(def.label)}" aria-label="${esc(def.label)}">${icon(def.icon, 17)}</a>`;
    }).join('');
  }

  function lead(person){
    if (!person) return '';
    return `
      <section class="ppl-leadWrap" data-reveal>
        <div class="ppl-secLabel">${esc(M.leadLabel)}</div>
        <div class="ppl-lead">
          <div class="ppl-leadPortrait">${portrait(person, '')}</div>
          <div class="ppl-leadBody">
            <span class="ppl-roleBadge"><span class="d"></span>${esc(person.role)}</span>
            <h2 class="ppl-name">${esc(person.name)}</h2>
            <p class="ppl-affil">${esc(person.affil)}</p>
            <p class="ppl-leadBio">${esc(person.bio)}</p>
            <div class="ppl-focusRow">
              <div class="ppl-focusLbl">${esc(M.interestsLabel)}</div>
              <div class="ppl-kwRow">${kwTags(person.interests)}</div>
            </div>
            <div class="ppl-links">${links(person, 'lead')}</div>
          </div>
        </div>
      </section>`;
  }

  function card(person, index){
    return `
      <article class="ppl-card" data-reveal data-delay="${index * 70}">
        <div class="ppl-cardTop">
          ${portrait(person, 'ppl-cardPortrait')}
          <div class="ppl-cardId">
            <div class="ppl-cardRole">${esc(person.role)}</div>
            <h3 class="ppl-cardName">${esc(person.name)}</h3>
            <p class="ppl-cardAffil">${esc(person.affil)}</p>
          </div>
        </div>
        <div class="ppl-cardMeta">
          <div class="ppl-focusLbl">${esc(M.interestsLabel)}</div>
          <div class="ppl-kwRow">${kwTags(person.interests)}</div>
        </div>
        <div class="ppl-cardLinks">${links(person, 'card')}</div>
      </article>`;
  }

  function team(){
    const rest = D.people.filter((person) => !person.lead);
    return `
      <section class="ppl-gridWrap">
        <div class="ppl-secLabel" data-reveal>${esc(M.teamLabel)}</div>
        <div class="ppl-grid">
          ${rest.map((person, index) => card(person, index)).join('')}
        </div>
      </section>`;
  }

  function archiveSection(label, people, className){
    const list = people || [];
    return `
      <section class="ppl-gridWrap ${esc(className)}">
        <div class="ppl-secLabel" data-reveal>${esc(label)}</div>
        ${list.length ? `
          <div class="ppl-grid">
            ${list.map((person, index) => card(person, index)).join('')}
          </div>
        ` : `<div class="ppl-empty" data-reveal>${esc(M.emptySectionLabel)}</div>`}
      </section>`;
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
      </footer>`;
  }

  function renderPeoplePage(){
    const leadPerson = D.people.find((person) => person.lead) || D.people[0];
    return `
      <div class="vA ppl">
        ${nav()}
        ${hero()}
        ${lead(leadPerson)}
        ${team()}
        ${archiveSection(M.alumniLabel, D.alumni, 'ppl-alumniWrap')}
        ${archiveSection(M.pastStudentsLabel, D.pastStudents, 'ppl-pastStudentsWrap')}
        ${footer()}
      </div>`;
  }

  function mountPeoplePage(){
    document.title = M.pageTitle;
    const stage = document.getElementById('stage');
    if (!stage) return;
    stage.innerHTML = renderPeoplePage();
    const root = stage.querySelector('.vA');
    const canvas = root.querySelector('.ppl-neural');
    if (canvas && window.neuralNet) {
      window.neuralNet(canvas, {
        count: 40, linkDist: 188, node: '#2D7DBE', line: '45,125,190',
        pulse: '#22B6C8', pulseChance: 0.05, glow: '52,211,224', drift: 0.14
      });
    }
    setTimeout(() => { if (window.initReveal) window.initReveal(root); }, 50);
  }

  window.TrustAIPeoplePage = { renderPeoplePage, mountPeoplePage, peopleStats };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountPeoplePage, { once: true });
  } else {
    mountPeoplePage();
  }
})();
