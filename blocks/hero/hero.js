/**
 * hero — dark video/poster carousel band (synopsys homepage).
 * Schema: stardust/eds-schema/index.json § hero.
 *
 * Authoring rows (one cell each):
 *   1. <picture>/<img>  — poster background (LCP; eager-loaded)
 *   2. <h1>             — headline (the page's single <h1>)
 *   3. lede paragraph
 *   4. primary CTA      — <strong><a> (buttonized before decorate)
 *   5..9. slide labels  — bare <a> in a <p>, one per carousel slide;
 *                         the first is the active slide.
 *
 * Template-slotted (#95): authored elements are MOVED into role slots (EW1),
 * never rebuilt. The carousel is frozen at slide 1 (t=0); the slide links
 * are the nav strip.
 * @ew-exempt none
 */
export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2');
  const paras = [...block.querySelectorAll('p')];
  const ctas = paras.filter((p) => p.querySelector('a.button'));
  // slide labels = link-bearing paragraphs that are NOT buttonized CTAs
  const slideParas = paras.filter((p) => p.querySelector('a') && !p.querySelector('a.button'));
  // lede = the link-free, non-heading paragraph
  const lede = paras.find((p) => !p.querySelector('a') && p.textContent.trim());

  const mediaSlot = document.createElement('div');
  mediaSlot.className = 'hero-media';
  if (media) {
    const img = media.tagName === 'IMG' ? media : media.querySelector('img');
    if (img) { img.loading = 'eager'; img.setAttribute('fetchpriority', 'high'); }
    mediaSlot.append(media);
  }

  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  if (heading) inner.append(heading);
  if (lede) { lede.classList.add('hero-lede'); inner.append(lede); }
  ctas.forEach((p) => inner.append(p));

  block.replaceChildren(mediaSlot, inner);

  if (slideParas.length) {
    const nav = document.createElement('div');
    nav.className = 'hero-nav';
    nav.setAttribute('role', 'tablist');
    nav.setAttribute('aria-label', 'Hero slides');
    slideParas.forEach((p, i) => {
      const a = p.querySelector('a');
      if (i === 0 && a) a.classList.add('is-active');
      nav.append(p); // move the authored paragraph (editable)
    });
    const play = document.createElement('button');
    play.className = 'hero-play';
    play.setAttribute('aria-label', 'Pause');
    play.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="3.5" height="12"/><rect x="8.5" y="1" width="3.5" height="12"/></svg>';
    nav.append(play);
    block.append(nav);
  }
}
