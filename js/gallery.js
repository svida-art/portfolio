import {el, picture, text, ui} from './content.js';
import {createViewer} from './viewer.js';

export function artworkCaption(work) {
  const title = text(work.title);
  const year = Number.isFinite(work.year) ? String(work.year) : text(work.year);
  const metadata = [text(work.medium), year, text(work.dimensions)].filter(Boolean).join(' · ');
  const description = text(work.description);
  if (!title && !metadata && !description) return;

  return el('figcaption', {},
    title ? el('em', {}, title) : null,
    metadata ? el('span', {class: 'caption-meta'}, metadata) : null,
    description ? el('p', {class: 'caption-description'}, description) : null
  );
}

function artworkCard(work, index, eager) {
  const title = text(work.title);
  const alt = text(work.alt);
  const name = title || alt;
  const label = name ? ui(`View ${name}`, `${name} ansehen`)
    : ui(`View artwork ${index + 1}`, `Werk ${index + 1} ansehen`);
  const img = picture(work, eager);
  if (title && alt && title !== alt) img.id = `artwork-image-${index + 1}`;
  const trigger = el('button', {
    type: 'button', class: 'art-button', 'aria-label': label, 'aria-haspopup': 'dialog',
    'aria-describedby': img.id || undefined
  }, img);
  const card = el('figure', {}, trigger, artworkCaption(work));
  return {card, trigger, img};
}

export function renderArtworkSet(container, works, featured = false) {
  if (!works.length) return;
  const cards = works.map((work, index) => artworkCard(work, index, featured));
  const viewer = createViewer(works, artworkCaption);
  cards.forEach(({card, trigger}, index) => {
    trigger.addEventListener('click', event => viewer.open(index, trigger, event.detail > 0));
    container.append(card);
  });
  // The dialog sits outside the masonry container so it never occupies a column.
  document.querySelector('main').append(viewer.dialog);

  if (featured) {
    const [{card, img}] = cards;
    card.classList.add('feature');
    const sizeFeature = () => {
      const width = img.naturalWidth || Number(img.getAttribute('width'));
      const height = img.naturalHeight || Number(img.getAttribute('height'));
      if (!width || !height) return;
      card.classList.toggle('feature-tall', width <= height);
      card.style.setProperty('--feature-ratio', width / height);
    };
    img.addEventListener('load', sizeFeature);
    sizeFeature();
  } else {
    masonry(container);
  }
}

function masonry(gallery) {
  const cards = [...gallery.children];
  let frame;
  let previousWidth;

  function layout() {
    frame = undefined;
    const width = gallery.getBoundingClientRect().width;
    if (!width) return;
    previousWidth = width;
    const styles = getComputedStyle(gallery);
    const columns = Number(styles.getPropertyValue('--gallery-columns'));
    const gap = parseFloat(styles.getPropertyValue('--gallery-gap'));

    if (columns === 1) {
      gallery.classList.remove('masonry');
      gallery.style.removeProperty('height');
      return;
    }

    const columnWidth = (width - gap * (columns - 1)) / columns;
    gallery.style.setProperty('--column-width', `${columnWidth}px`);
    gallery.classList.add('masonry');
    const heights = cards.map(card => card.getBoundingClientRect().height);
    const bottoms = Array(columns).fill(0);
    cards.forEach((card, index) => {
      const column = bottoms.indexOf(Math.min(...bottoms));
      card.style.left = `${column * (columnWidth + gap)}px`;
      card.style.top = `${bottoms[column]}px`;
      bottoms[column] += heights[index] + gap;
    });
    gallery.style.height = `${Math.max(...bottoms) - gap}px`;
  }

  function schedule() {
    frame ??= requestAnimationFrame(layout);
  }

  layout();
  const observer = new ResizeObserver(entries => {
    if (entries.some(({target}) => target !== gallery
      || gallery.getBoundingClientRect().width !== previousWidth)) schedule();
  });
  observer.observe(gallery);
  cards.forEach(card => observer.observe(card));
  window.addEventListener('resize', schedule);
  document.fonts.ready.then(schedule);
}
