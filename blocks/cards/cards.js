/**
 * cards — "What's New" news cards. Each row = one card.
 * Schema: stardust/eds-schema/index.json § cards.
 *
 * Authoring per card row (2 cells):
 *   1. <picture>/<img>  — card image (16:9)
 *   2. <p><code>News Release</code> August 26, 2026</p>  (code = category chip, rest = date)
 *      <h3>Title</h3>
 *      <p><a href>Learn more</a></p>
 *
 * Authored elements are MOVED (EW1). The chip rides a <code> tag (preserved
 * by DA); the date is the remaining text in the meta paragraph.
 */
export default function decorate(block) {
  block.classList.add('cards');
  [...block.children].forEach((row) => {
    const media = row.querySelector('picture, img');
    const heading = row.querySelector('h2, h3, h4');
    const metaP = [...row.querySelectorAll('p')].find((p) => p.querySelector('code') || (!p.querySelector('a, img, picture') && /\d{4}/.test(p.textContent)));
    const link = row.querySelector('a');

    const card = document.createElement('article');
    card.className = 'card';

    if (media) {
      const mw = document.createElement('div');
      mw.className = 'card-image';
      const img = media.tagName === 'IMG' ? media : media.querySelector('img');
      if (img) img.classList.add('card-img');
      mw.append(media);
      card.append(mw);
    }

    const body = document.createElement('div');
    body.className = 'card-body';

    if (metaP) {
      metaP.classList.add('card-meta');
      const code = metaP.querySelector('code');
      if (code) {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = code.textContent;
        code.replaceWith(chip);
        const date = document.createElement('span');
        date.className = 'card-date';
        // remaining text of the meta paragraph is the date
        [...metaP.childNodes].forEach((n) => { if (n !== chip && n.textContent.trim()) { date.append(n); } });
        metaP.append(date);
      }
      body.append(metaP);
    }
    if (heading) { heading.classList.add('card-title'); body.append(heading); }
    if (link) { const par = link.closest('p') || link; par.classList.add('card-more'); link.classList.add('link-more'); body.append(par); }

    card.append(body);
    row.replaceChildren(card);
  });
}
