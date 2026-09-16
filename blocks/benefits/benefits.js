/**
 * benefits — two-column icon link grid ("Design the Future Today":
 * Industry | Technology). Schema: stardust/eds-schema/index.json § benefits.
 *
 * Authoring: a ≤2-column table.
 *   Row 0 (heads):  | Industry | Technology |
 *   Rows 1..6:      | <p><img icon></p> <h3><a href>Title</a></h3> <p>desc</p> | …same for column 2… |
 *
 * A row-major grid (2 cols) stacks column 1 under the first head and column 2
 * under the second. Authored elements are MOVED (EW1); the item becomes an
 * <a> (card-as-link, EW6).
 */
export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'benefits-grid';

  [...block.children].forEach((row, ri) => {
    [...row.children].forEach((cell) => {
      if (ri === 0) {
        const head = document.createElement('div');
        head.className = 'benefits-colhead';
        const h = cell.querySelector('h2, h3, h4') || cell;
        head.append(...cell.childNodes);
        grid.append(head);
        return;
      }
      if (!cell.textContent.trim() && !cell.querySelector('img, picture')) return;
      const icon = cell.querySelector('picture, img');
      const heading = cell.querySelector('h2, h3, h4');
      const link = cell.querySelector('a');
      const desc = [...cell.querySelectorAll('p')].find((p) => !p.querySelector('a, img, picture') && p.textContent.trim());

      const item = document.createElement('a');
      item.className = 'benefit';
      if (link) item.href = link.getAttribute('href');

      const iconWrap = document.createElement('span');
      iconWrap.className = 'benefit-icon';
      if (icon) iconWrap.append(icon.closest('p') ? icon : icon);

      const textWrap = document.createElement('span');
      textWrap.className = 'benefit-text';
      if (heading) {
        // unwrap the inner title link (card-as-link, EW6) but keep the heading
        if (link && heading.contains(link)) link.replaceWith(...link.childNodes);
        textWrap.append(heading);
      }
      if (desc) { desc.classList.add('benefit-desc'); textWrap.append(desc); }

      item.append(iconWrap, textWrap);
      grid.append(item);
    });
  });

  block.replaceChildren(grid);
}
