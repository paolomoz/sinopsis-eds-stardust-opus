/**
 * tiles — 4 category image tiles with an overlaid label + hover tagline
 * (synopsys "Powering the Era" section). Each row = one tile.
 * Schema: stardust/eds-schema/index.json § tiles.
 *
 * Authoring per tile row (2 cells):
 *   1. <picture>/<img>  — tile image
 *   2. <h3>Label</h3>, <p>tagline</p>, <p><a href>Learn More</a></p>
 *
 * Decode: the tile becomes an <a> (card-as-link, EW6) using the CTA href;
 * label/tagline/cta are MOVED into the overlay (EW1).
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const media = row.querySelector('picture, img');
    const heading = row.querySelector('h2, h3, h4');
    const link = row.querySelector('a');
    const tag = [...row.querySelectorAll('p')].find((p) => !p.querySelector('a') && p.textContent.trim());

    const tile = document.createElement('a');
    tile.className = 'tile';
    if (link) tile.href = link.getAttribute('href');

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'tile-media';
    if (media) mediaWrap.append(media.tagName === 'IMG' ? media : media);

    const body = document.createElement('div');
    body.className = 'tile-body';
    if (heading) body.append(heading);
    if (tag) { tag.classList.add('tile-tag'); body.append(tag); }
    if (link) {
      const cta = document.createElement('span');
      cta.className = 'tile-more';
      cta.setAttribute('aria-hidden', 'true');
      cta.innerHTML = 'Learn More <svg class="chev" viewBox="0 0 8 12"><path d="M1 1l5 5-5 5" stroke="currentColor" fill="none" stroke-width="1.6"/></svg>';
      body.append(cta);
      // the authored CTA paragraph is redundant now (the whole tile links); keep its
      // text editable by moving it hidden — but simplest: drop the empty <p> wrapper.
      const par = link.closest('p');
      if (par) par.remove();
    }

    tile.append(mediaWrap, body);
    row.replaceChildren(tile);
    row.className = 'tile-cell';
  });
}
