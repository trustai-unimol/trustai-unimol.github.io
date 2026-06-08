// Vanilla TrustAI publications page renderer.
(function(){
  const SITE = window.TRUSTAI_SITE;
  const P = window.TRUSTAI_PUBLICATIONS;
  const M = P.meta;

  const LS_FILTER = 'trustai.pub.filter';
  const LS_SORT = 'trustai.pub.sort';

  let activeFilter = initialFilterIndex();
  let sortDir = readStorage(LS_SORT) || 'desc';
  if (!['asc', 'desc'].includes(sortDir)) sortDir = 'desc';
  let openYears = null;

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g, (c) => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function readStorage(key){
    try {
      const store = window.localStorage || (typeof localStorage !== 'undefined' ? localStorage : null);
      return store ? store.getItem(key) : null;
    } catch (err) {
      return null;
    }
  }

  function writeStorage(key, value){
    try {
      const store = window.localStorage || (typeof localStorage !== 'undefined' ? localStorage : null);
      if (store) store.setItem(key, value);
    } catch (err) {}
  }

  function initialFilterIndex(){
    const stored = readStorage(LS_FILTER);
    const found = P.filters.findIndex((filter) => filter.id === stored);
    return found >= 0 ? found : 0;
  }

  function navItems(){
    return SITE.nav.items.filter((item) => item.visible);
  }

  function homeHref(){
    const home = SITE.nav.items.find((item) => item.id === 'home');
    return home ? home.href : 'home.html';
  }

  function venueMeta(code){
    return P.venues[code] || { full: code, type: 'C' };
  }

  function venueType(pub){
    return venueMeta(pub.v).type === 'J' ? 'J' : 'C';
  }

  function filterMatches(filter, pub){
    if (!filter || filter.kind === 'all') return true;
    if (filter.kind === 'venueType') return venueType(pub) === filter.venueType;
    return true;
  }

  function filtered(filterIndex = activeFilter){
    const filter = P.filters[filterIndex] || P.filters[0];
    return P.pubs.filter((pub) => filterMatches(filter, pub));
  }

  function sorted(list){
    return list.slice().sort((x, y) => sortDir === 'desc' ? y.y - x.y : x.y - y.y);
  }

  function publicationStats(){
    if (!P.pubs.length) return { total: 0, venues: 0, min: null, max: null };
    let min = Infinity;
    let max = -Infinity;
    const venues = new Set();
    P.pubs.forEach((pub) => {
      min = Math.min(min, pub.y);
      max = Math.max(max, pub.y);
      venues.add(pub.v);
    });
    return { total: P.pubs.length, venues: venues.size, min, max };
  }

  function count(filterIndex){
    return filtered(filterIndex).length;
  }

  function filterRange(filterIndex){
    const list = filtered(filterIndex);
    if (!list.length) return '';
    const years = list.map((pub) => pub.y);
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? String(min) : `${min}-${String(max).slice(2)}`;
  }

  function latest(limit){
    return P.pubs.slice().sort((x, y) => y.y - x.y).slice(0, limit);
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
    const s = publicationStats();
    const span = s.min === null ? '' : `${s.min}<span class="accent">-</span>${String(s.max).slice(2)}`;
    return `
      <header class="pub-hero">
        <canvas class="pub-neural" aria-hidden="true"></canvas>
        <div class="pub-heroInner">
          <div class="pub-kicker">${esc(M.kicker)}</div>
          <h1 class="pub-heroTitle">${esc(M.title)}</h1>
          <p class="pub-heroSub">${esc(M.subtitle)}</p>
          <div class="pub-stats">
            <div class="pub-stat"><div class="num">${s.total}</div><div class="lbl">${esc(M.statsPapers)}</div></div>
            <div class="pub-stat"><div class="num">${s.venues}</div><div class="lbl">${esc(M.statsVenues)}</div></div>
            <div class="pub-stat"><div class="num">${span}</div><div class="lbl">${esc(M.statsSpan)}</div></div>
          </div>
        </div>
      </header>`;
  }

  function latestStrip(){
    const rows = latest(3);
    const maxYear = rows.length ? rows[0].y : '';
    return `
      <section class="pub-latest">
        <div class="pub-secLabel">${esc(M.latestLabel)} <span class="cnt">/ ${esc(maxYear)}</span></div>
        <div class="pub-featGrid">
          ${rows.map((pub) => {
            const meta = venueMeta(pub.v);
            return `
            <article class="pub-feat">
              <span class="pub-featTag"><span class="d"></span>${esc(pub.y)} - ${esc(M.latestMarker)}</span>
              <h3 class="pub-featTitle">${esc(pub.t)}</h3>
              <div class="pub-featVenue"><span class="vt ${meta.type === 'J' ? 'j' : 'c'}"></span>${esc(meta.full)}</div>
              <div class="pub-featMeta">
                <span class="pub-featAuthors">${esc(pub.a)}</span>
                ${venueBadge(pub.v)}
              </div>
            </article>`;
          }).join('')}
        </div>
      </section>`;
  }

  function venueBadge(code){
    const meta = venueMeta(code);
    const label = meta.short || code;
    const dot = meta.type === 'J' ? 'j' : 'c';
    return `<span class="pub-venue" title="${esc(meta.full)}"><span class="vt ${dot}"></span>${esc(label)}</span>`;
  }

  function rail(){
    return `
      <aside class="pub-rail">
        <div class="pub-railHead"><div class="pub-secLabel">${esc(M.browseLabel)}</div></div>
        ${P.filters.map((filter, index) => `
          <button class="pub-themeBtn ${index === activeFilter ? 'on' : ''}" data-filter="${index}">
            <span class="pub-tnum">${count(index)}</span>
            <span class="pub-tbody">
              <span class="pub-tt">${esc(filter.title)}</span>
              <span class="pub-tmeta">${esc(M.papersLabel)} <span class="sep"></span> ${esc(filterRange(index))}</span>
            </span>
          </button>`).join('')}
      </aside>`;
  }

  function itemHTML(pub, index){
    return `
      <article class="pub-item" style="--d:${Math.min(index * 36, 360)}ms">
        <div class="pub-main">
          <p class="pub-authors">${esc(pub.a)}</p>
          <h3 class="pub-title">${esc(pub.t)}</h3>
        </div>
        <div class="pub-meta">
          ${venueBadge(pub.v)}
        </div>
      </article>`;
  }

  function groupByYear(pubs){
    const groups = [];
    const positions = {};
    pubs.forEach((pub) => {
      if (!(pub.y in positions)) {
        positions[pub.y] = groups.length;
        groups.push({ y: pub.y, items: [] });
      }
      groups[positions[pub.y]].items.push(pub);
    });
    return groups;
  }

  function streamHTML(groups){
    let index = 0;
    if (!groups.length) return `<div class="pub-empty">${esc(M.noResults)}</div>`;
    return groups.map((group) => {
      const open = openYears.has(group.y);
      const countLabel = group.items.length === 1 ? M.paperSingular : M.paperPlural;
      return `
      <div class="pub-ygroup ${open ? 'open' : ''}" data-ygroup="${group.y}">
        <button class="pub-yhead" data-ytoggle="${group.y}" aria-expanded="${open}">
          <span class="yn">${group.y}</span>
          <span class="yc">${group.items.length} ${esc(countLabel)}</span>
          <span class="ychev" aria-hidden="true"></span>
        </button>
        <div class="pub-ybody"><div class="pub-yitems">
          ${group.items.map((pub) => itemHTML(pub, index++)).join('')}
        </div></div>
      </div>`;
    }).join('');
  }

  function histogram(pubs, allOpen){
    const s = publicationStats();
    if (s.min === null) return '';
    const counts = {};
    pubs.forEach((pub) => { counts[pub.y] = (counts[pub.y] || 0) + 1; });
    let max = 1;
    for (let y = s.min; y <= s.max; y += 1) max = Math.max(max, counts[y] || 0);
    let bars = '';
    for (let y = s.min; y <= s.max; y += 1) {
      const c = counts[y] || 0;
      const h = c ? Math.round(8 + (c / max) * 40) : 3;
      bars += `
        <div class="pub-hbar ${c ? '' : 'empty'}"${c ? ` data-hyear="${y}" title="${esc(M.jumpToYear)} ${y}"` : ''}>
          <span class="hc">${c || '0'}</span>
          <span class="hb" style="height:${h}px"></span>
          <span class="hy">'${String(y).slice(2)}</span>
        </div>`;
    }
    return `
      <div class="pub-histWrap">
        <div class="pub-histTop">
          <div class="pub-histLabel">${esc(M.histogramLabel)}</div>
          <button class="pub-expandAll" data-expandall>${esc(allOpen ? M.collapseAll : M.expandAll)}</button>
        </div>
        <div class="pub-hist">${bars}</div>
      </div>`;
  }

  function panelBody(){
    const filter = P.filters[activeFilter] || P.filters[0];
    const list = filtered();
    const pubs = sorted(list);
    const groups = groupByYear(pubs);
    if (openYears === null) openYears = new Set(groups.length ? [groups[0].y] : []);
    const allOpen = groups.length > 0 && groups.every((group) => openYears.has(group.y));
    const publicationLabel = list.length === 1 ? M.publicationSingular : M.publicationPlural;
    return `
      <div class="pub-panelBody">
        <div class="pub-panelHead">
          <div>
            <div class="pub-panelKicker">${list.length} ${esc(publicationLabel)}</div>
            <h2 class="pub-panelTitle">${esc(filter.title)}</h2>
            <p class="pub-panelDesc">${esc(filter.description)}</p>
          </div>
          <div class="pub-seg" data-seg="sort" aria-label="${esc(M.sortLabel)}">
            <button data-sort="desc" class="${sortDir === 'desc' ? 'on' : ''}">${esc(M.sortNewest)}</button>
            <button data-sort="asc" class="${sortDir === 'asc' ? 'on' : ''}">${esc(M.sortOldest)}</button>
          </div>
        </div>
        ${histogram(list, allOpen)}
        <div class="pub-list">
          ${streamHTML(groups)}
        </div>
      </div>`;
  }

  function explorer(){
    return `
      <section class="pub-explorer" id="explorer">
        ${rail()}
        <div class="pub-panel">${panelBody()}</div>
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

  function renderPublicationsPage(){
    return `
      <div class="vA pub">
        ${nav()}
        ${hero()}
        ${latestStrip()}
        ${explorer()}
        ${footer()}
      </div>`;
  }

  function syncExpandAll(root){
    const control = root.querySelector('[data-expandall]');
    if (!control) return;
    const groups = [...root.querySelectorAll('.pub-ygroup')];
    const allOpen = groups.length > 0 && groups.every((group) => group.classList.contains('open'));
    control.textContent = allOpen ? M.collapseAll : M.expandAll;
  }

  function setGroupOpen(group, open){
    group.classList.toggle('open', open);
    const button = group.querySelector('[data-ytoggle]');
    if (button) button.setAttribute('aria-expanded', String(open));
    const year = Number(group.dataset.ygroup);
    if (open) openYears.add(year);
    else openYears.delete(year);
  }

  function wireYears(root){
    root.querySelectorAll('[data-ytoggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const group = button.closest('.pub-ygroup');
        setGroupOpen(group, !group.classList.contains('open'));
        syncExpandAll(root);
      });
    });
    root.querySelectorAll('[data-hyear]').forEach((bar) => {
      bar.addEventListener('click', () => {
        const year = Number(bar.dataset.hyear);
        const group = root.querySelector(`.pub-ygroup[data-ygroup="${year}"]`);
        if (!group) return;
        setGroupOpen(group, true);
        syncExpandAll(root);
        const top = group.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
    const expandAll = root.querySelector('[data-expandall]');
    if (expandAll) {
      expandAll.addEventListener('click', () => {
        const groups = [...root.querySelectorAll('.pub-ygroup')];
        const allOpen = groups.every((group) => group.classList.contains('open'));
        groups.forEach((group) => setGroupOpen(group, !allOpen));
        syncExpandAll(root);
      });
    }
  }

  function refreshPanel(root){
    const panel = root.querySelector('.pub-panel');
    panel.innerHTML = panelBody();
    const body = panel.querySelector('.pub-panelBody');
    if (body) body.classList.add('swap');
    wireSort(root);
    wireYears(root);
  }

  function setFilter(root, index){
    activeFilter = index;
    const filter = P.filters[index] || P.filters[0];
    writeStorage(LS_FILTER, filter.id);
    openYears = null;
    root.querySelectorAll('[data-filter]').forEach((button) => {
      button.classList.toggle('on', Number(button.dataset.filter) === index);
    });
    refreshPanel(root);
  }

  function wireSort(root){
    root.querySelectorAll('[data-sort]').forEach((button) => {
      button.addEventListener('click', () => {
        sortDir = button.dataset.sort;
        writeStorage(LS_SORT, sortDir);
        openYears = null;
        refreshPanel(root);
      });
    });
  }

  function wire(root){
    root.querySelectorAll('[data-filter]').forEach((button) => {
      button.addEventListener('click', () => setFilter(root, Number(button.dataset.filter)));
    });
    wireSort(root);
    wireYears(root);
  }

  function mountPublicationsPage(){
    document.title = M.pageTitle;
    const stage = document.getElementById('stage');
    if (!stage) return;
    stage.innerHTML = renderPublicationsPage();
    const root = stage.querySelector('.vA');
    wire(root);
    const canvas = root.querySelector('.pub-neural');
    if (canvas && window.neuralNet) {
      window.neuralNet(canvas, {
        count: 40, linkDist: 188, node: '#2D7DBE', line: '45,125,190',
        pulse: '#22B6C8', pulseChance: 0.05, glow: '52,211,224', drift: 0.14
      });
    }
  }

  window.TrustAIPublicationsPage = {
    renderPublicationsPage,
    mountPublicationsPage,
    publicationStats,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountPublicationsPage, { once: true });
  } else {
    mountPublicationsPage();
  }
})();
