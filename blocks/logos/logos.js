/**
 * logos — Ecosystem Partners logo row. One row per logo (cell = <img>).
 * Schema: stardust/eds-schema/index.json § partners.
 * Authored <img>/<picture> are MOVED into a centered flex row (EW1; images
 * carry no editable text).
 */
export default function decorate(block) {
  const row = document.createElement('div');
  row.className = 'logos-row';
  block.querySelectorAll('picture, img').forEach((m) => {
    const item = document.createElement('span');
    item.className = 'logo';
    item.append(m.tagName === 'PICTURE' ? m : m);
    row.append(item);
  });
  block.replaceChildren(row);
}
