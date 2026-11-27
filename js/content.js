const root = new URL('../', import.meta.url);
export const query = new URLSearchParams(location.search);
export const supportsPageTransitions = 'CSSViewTransitionRule' in window && 'onpagereveal' in window;

let preference;
try { preference = localStorage.getItem('catalogue-language'); } catch {}
export const language = [query.get('lang'), preference, navigator.language.split('-')[0]]
  .find(value => value === 'en' || value === 'de') || 'en';
try { localStorage.setItem('catalogue-language', language); } catch {}
document.documentElement.lang = language;

export const ui = (en, de) => language === 'de' ? de : en;
export const localized = entry => entry?.[language] ?? {};
export const shared = entry => entry?.en ?? entry?.de ?? {};
export const items = value => Array.isArray(value) ? value : [];
export const text = value => typeof value === 'string' ? value.trim() : '';

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value != null) node.setAttribute(key, value);
  }
  node.append(...children.filter(child => child != null));
  return node;
}

export async function load(name) {
  const response = await fetch(new URL('content/' + name + '.json', root));
  if (!response.ok) throw Error(`Could not load ${name} (${response.status})`);
  return response.json();
}

export function url(path, params = {}) {
  const target = new URL(path + '.html', root);
  target.search = new URLSearchParams({lang: language, ...params});
  return target.href;
}

function safeUrl(value, image = false) {
  const path = text(value);
  if (!path) return;
  try {
    // The CMS stores repository-root media paths. GitHub Pages serves them under /portfolio/.
    const relative = path.startsWith('/portfolio/images/') ? path.slice('/portfolio/'.length)
      : path.startsWith('/images/') ? path.slice(1) : path;
    const target = new URL(relative, path.startsWith('#') ? location.href : root);
    if (target.protocol === 'https:' || target.protocol === 'http:') return target;
    if (!image && (target.protocol === 'mailto:' || target.protocol === 'tel:')) return target;
  } catch {}
}

export function contentLink(value) {
  const target = safeUrl(value);
  if (!target) return;
  if (target.origin === root.origin && target.pathname.startsWith(root.pathname)
      && target.pathname.endsWith('.html') && !target.searchParams.has('lang')) {
    target.searchParams.set('lang', language);
  }
  return target.href;
}

export const mediaUrl = value => safeUrl(value, true)?.href;

function storedSize(image, pixelSize) {
  if (pixelSize?.image === image && Number.isInteger(pixelSize.width) && pixelSize.width > 0
      && Number.isInteger(pixelSize.height) && pixelSize.height > 0) {
    return pixelSize;
  }
  return {};
}

export function picture({image, alt, pixelSize, protectArtwork}, eager = false) {
  const {width, height} = storedSize(image, pixelSize);
  const img = el('img', {
    width, height, alt: text(alt), loading: eager ? 'eager' : 'lazy', decoding: 'async'
  });
  if (protectArtwork) {
    img.draggable = false;
    img.setAttribute('data-protected-artwork', '');
    img.addEventListener('contextmenu', event => event.preventDefault());
  }
  // A replacement at the same path can also have a different intrinsic size.
  img.addEventListener('load', () => {
    if (img.naturalWidth && img.naturalHeight) {
      img.width = img.naturalWidth;
      img.height = img.naturalHeight;
      if (supportsPageTransitions) img.classList.add('image-arrival');
    }
  }, {once: true});
  const src = mediaUrl(image);
  if (src) img.src = src;
  return img;
}

export function artwork(entry) {
  const {id, image, year, dimensions, pixelSize} = shared(entry);
  const {title, medium, description, alt} = localized(entry);
  return {id, image, year, dimensions, pixelSize, title, medium, description, alt, protectArtwork: true};
}

const richTags = new Set([
  'p', 'div', 'span', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i', 'u', 's',
  'del', 'sup', 'sub', 'ul', 'ol', 'li', 'blockquote', 'br', 'hr', 'a', 'img', 'figure',
  'figcaption', 'pre', 'code', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'
]);
const discardedTags = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'template']);

export function richText(value) {
  if (!text(value)) return;
  const template = document.createElement('template');
  template.innerHTML = value;
  const container = el('div', {class: 'rich-text'});

  function appendAllowed(source, target) {
    for (const node of source.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        target.append(node.textContent);
        continue;
      }
      if (node.nodeType !== Node.ELEMENT_NODE || discardedTags.has(node.localName)) continue;

      const tag = node.localName === 'h1' ? 'h2' : node.localName;
      if (!richTags.has(tag)) {
        appendAllowed(node, target);
        continue;
      }
      if (tag === 'img') {
        const image = node.getAttribute('src');
        if (mediaUrl(image)) target.append(picture({image, alt: node.getAttribute('alt')}));
        continue;
      }

      const href = tag === 'a' ? contentLink(node.getAttribute('href')) : undefined;
      const clean = el(tag === 'a' && !href ? 'span' : tag, {href});
      for (const attr of ['start', 'colspan', 'rowspan']) {
        const number = node.getAttribute(attr);
        if (number && /^\d{1,4}$/.test(number)) clean.setAttribute(attr, number);
      }
      appendAllowed(node, clean);
      target.append(clean);
    }
  }
  appendAllowed(template.content, container);
  return container;
}
