/**
 * closing — full-bleed "Connect with Us" purple CTA band.
 * Schema: stardust/eds-schema/index.json § connect.
 * Authoring: <h2>Connect with Us</h2> + <p><strong><a>Contact Sales</a></strong></p>
 * (author the section with section-metadata style "full-bleed"). Authored
 * heading + CTA paragraph are MOVED (EW1/EW3).
 */
export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const cta = [...block.querySelectorAll('p')].find((p) => p.querySelector('a'));
  const inner = document.createElement('div');
  inner.className = 'closing-inner';
  if (heading) inner.append(heading);
  if (cta) inner.append(cta);
  block.replaceChildren(inner);
}
