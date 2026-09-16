import { loadFragment } from '../fragment/fragment.js';

/**
 * footer — dark synopsys mega footer: 4 link columns (each an authored
 * <h3> + <ul>) + a bottom bar (social row, brand wordmark, legal line).
 *
 * The delivery pipeline flattens the authored column <div>s into a single
 * default-content-wrapper, so columns are rebuilt here by <h3> boundary
 * (each <h3> and its following <ul> = one column). Authored nodes are MOVED.
 */
export default async function decorate(block) {
  const fragment = await loadFragment('/footer');
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer';

  if (fragment) {
    // 1. columns — group each <h3> with the <ul> that follows it
    const cols = document.createElement('div');
    cols.className = 'footer-cols';
    let current = null;
    [...fragment.querySelectorAll('h3, ul')].forEach((el) => {
      if (el.tagName === 'H3') {
        current = document.createElement('div');
        current.className = 'footer-col';
        current.append(el);
        cols.append(current);
      } else if (current) {
        current.append(el);
      }
    });
    if (cols.children.length) footer.append(cols);

    // 2. bottom bar — social + brand wordmark + legal
    const brand = [...fragment.querySelectorAll('p')].find((p) => p.textContent.trim() === 'SYNOPSYS' || p.classList.contains('footer-brand'));
    const legal = [...fragment.querySelectorAll('p')].find((p) => /All Rights Reserved|Rights Reserved|Privacy/.test(p.textContent) || p.classList.contains('footer-legal'));

    const bar = document.createElement('div');
    bar.className = 'footer-bottom';
    const social = document.createElement('div');
    social.className = 'footer-social';
    social.innerHTML = `
      <a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h3l-7 8 8 12h-6l-5-7-5 7H-1l8-9L-1 2h6l4 6 5-6z" transform="translate(1)"/></svg></a>
      <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 110 4 2 2 0 010-4zM3 9h3v12H3zM9 9h3v2c.6-1 1.8-2 3.5-2 3 0 4.5 2 4.5 5.5V21h-3v-6c0-1.6-.7-2.7-2.2-2.7-1.2 0-1.8.8-2.1 1.6-.1.3-.1.7-.1 1V21H9z"/></svg></a>
      <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l1-4h-4V8c0-1 .3-1.6 1.8-1.6H17V3.1C16.7 3 15.6 3 14.4 3 11.9 3 10 4.5 10 7.7V10H7v4h3v8z"/></svg></a>
      <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7c-.2-.9-.9-1.5-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4c-.8.2-1.5.8-1.7 1.7C1 8.8 1 12 1 12s0 3.2.4 4.7c.2.9.9 1.5 1.7 1.7 1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4c.8-.2 1.5-.8 1.7-1.7.4-1.5.4-4.7.4-4.7zM9.7 15.3V8.7l5.8 3.3z"/></svg></a>
      <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>`;
    bar.append(social);
    if (brand) { brand.classList.add('footer-brand'); bar.append(brand); }
    footer.append(bar);
    if (legal) { legal.classList.add('footer-legal'); footer.append(legal); }
  }

  block.append(footer);
}
