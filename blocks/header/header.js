import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * header — synopsys two-row chrome: a dark utility topbar + a nav row that is
 * transparent over the hero and morphs to a solid white sticky bar on scroll
 * (observed live class "overlapping" at y≈400 — motion-observe evidence).
 * Reads /nav sections: 1=brand, 2=links, 3=tools.
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const sections = fragment ? [...fragment.querySelectorAll(':scope > div')] : [];
  const [brand, links, tools] = sections;

  // utility topbar (fixed chrome, not authored)
  const topbar = document.createElement('div');
  topbar.className = 'nav-topbar';
  topbar.innerHTML = `
    <div class="nav-cobrand"><span class="nav-cobrand-name">SYNOPSYS</span><span class="nav-cobrand-sep"></span><span class="nav-cobrand-ansys">Ansys</span></div>
    <div class="nav-utility"><a href="#">🌐 English</a><a href="#">✦ Ask</a></div>`;

  // main nav row
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Primary');

  const brandEl = document.createElement('div');
  brandEl.className = 'nav-brand';
  if (brand) brandEl.append(...brand.childNodes);

  const sectionsEl = document.createElement('div');
  sectionsEl.className = 'nav-sections';
  if (links) sectionsEl.append(...links.childNodes);

  const toolsEl = document.createElement('div');
  toolsEl.className = 'nav-tools';
  const search = document.createElement('button');
  search.className = 'nav-search';
  search.setAttribute('aria-label', 'Search Synopsys.com');
  search.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.6"/><path d="M14 14l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  toolsEl.append(search);
  if (tools) {
    const cta = tools.querySelector('a');
    if (cta) { cta.className = 'nav-cta'; toolsEl.append(cta); }
  }

  // hamburger (mobile)
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', String(open));
  });

  nav.append(brandEl, hamburger, sectionsEl, toolsEl);

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(topbar, nav);
  block.append(wrapper);

  // scroll-state morph (mirrors live "overlapping" at y≈400)
  const onScroll = () => {
    const scrolled = (window.pageYOffset || document.documentElement.scrollTop) > 400;
    block.classList.toggle('is-scrolled', scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
