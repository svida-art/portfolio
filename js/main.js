import {
  artwork, contentLink, el, items, language, load, localized, mediaUrl, picture, query,
  richText, shared, supportsPageTransitions, text, ui, url
} from './content.js';
import {renderArtworkSet} from './gallery.js';

const page = document.body.dataset.page;
const main = document.querySelector('main');
const entryId = query.get('id');

let rendered = false;
let revealed = false;

function skipPendingTransition({viewTransition}) {
  if (!viewTransition) return;
  const eagerImages = [...main.querySelectorAll('img[loading="eager"]')];
  if (!rendered || eagerImages.some(img => !img.complete)) {
    // Skipping the animation rejects ready while ordinary navigation continues.
    viewTransition.ready.catch(() => {});
    viewTransition.skipTransition();
  }
}

window.addEventListener('pageswap', skipPendingTransition);
window.addEventListener('pagereveal', event => {
  revealed = true;
  skipPendingTransition(event);
});

const link = (path, label, className) => el('a', {href: url(path), class: className}, label);
const back = (path, label) => link(path, '← ' + label, 'back');

function instagramProfileUrl(social) {
  const profile = /^https?:\/\/(?:www\.)?instagram\.com\/(\w(?:[\w.]{0,28}\w)?)\/?(?:[?#]\S*)?$/i;
  const sections = ['about', 'accounts', 'direct', 'explore', 'p', 'reel', 'reels', 'share', 'stories', 'tv'];
  for (const entry of items(social)) {
    const href = text(entry?.href);
    const username = profile.exec(href)?.[1];
    if (username && !username.includes('..') && !sections.includes(username.toLowerCase())) return href;
  }
}

function renderChrome(settings, contact, active) {
  const {email, social} = shared(contact);
  const navigation = localized(settings).navigation;
  const nav = el('nav', {id: 'navigation', 'aria-label': ui('Main navigation', 'Hauptnavigation')});
  for (const id of ['portfolio', 'services', 'about', 'news', 'contact']) {
    nav.append(el('a', {href: url(id), 'aria-current': active === id ? 'page' : undefined}, navigation[id]));
  }
  const instagramUrl = instagramProfileUrl(social);
  if (instagramUrl) {
    const instagram = el('a', {class: 'nav-instagram', href: instagramUrl, 'aria-label': 'Instagram'});
    instagram.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
        aria-hidden="true" focusable="false">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>`;
    nav.append(instagram);
  }

  const languages = el('div', {class: 'languages'});
  for (const code of ['en', 'de']) {
    const target = new URL(location.href);
    target.searchParams.set('lang', code);
    if (code === 'de') languages.append(el('span', {'aria-hidden': 'true'}, '/'));
    languages.append(el('a', {
      href: target.href, lang: code, hreflang: code, 'aria-label': code === 'en' ? 'English' : 'Deutsch',
      'aria-current': language === code ? 'true' : undefined
    }, code.toUpperCase()));
  }
  const menu = el('button', {type: 'button', class: 'menu', 'aria-controls': 'navigation',
    'aria-expanded': 'false'}, ui('Menu', 'Menü'), el('i', {'aria-hidden': 'true'}));
  function toggle(open) {
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  }
  menu.addEventListener('click', () => toggle(menu.getAttribute('aria-expanded') === 'false'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open') && !document.querySelector('dialog[open]')) {
      toggle(false);
      menu.focus();
    }
  });
  const {artist} = shared(settings);
  const brand = () => link('index', artist, 'brand');
  document.querySelector('header').append(
    el('a', {class: 'skip', href: '#main'}, ui('Skip to content', 'Zum Inhalt')),
    el('div', {class: 'mast wrap'}, brand(), nav, languages, menu)
  );
  document.querySelector('footer').append(el('div', {class: 'wrap foot'},
    brand(), el('small', {}, '© ' + new Date().getFullYear() + ' ' + artist), emailLink(email)
  ));
}

function emailLink(value) {
  const email = text(value);
  if (email) return el('a', {href: 'mailto:' + email}, email);
}

function sectionTitle(title, intro) {
  return el('div', {class: 'section-title'}, el('h1', {}, title), text(intro) ? el('p', {}, text(intro)) : null);
}

function photoFigure(photo, caption, eager = false) {
  if (!mediaUrl(photo?.image)) return;
  return el('figure', {}, picture(photo, eager),
    text(caption) ? el('figcaption', {}, el('span', {class: 'caption-meta'}, text(caption))) : null
  );
}

function previewImage(candidates) {
  const frame = el('div', {class: 'preview-image'});
  const sources = candidates.filter(candidate => mediaUrl(candidate?.image));
  function show(index) {
    if (!sources[index]) {
      frame.replaceChildren();
      return;
    }
    const img = picture(sources[index]);
    img.addEventListener('error', () => show(index + 1), {once: true});
    frame.replaceChildren(img);
  }
  show(0);
  return frame;
}

async function loadArtworks() {
  const works = (await load('artworks')).map(artwork).filter(work => work.id && mediaUrl(work.image));
  return new Map(works.map(work => [work.id, work]));
}

function galleryWorks(entry, works) {
  return items(shared(entry).works).map(item => works.get(item?.artwork)).filter(Boolean);
}

function categoryPreviews(galleries, works, compact = false) {
  return el('div', {class: compact ? 'collections compact' : 'collections'}, ...galleries.map(entry => {
    const {id, cover, coverImage} = shared(entry);
    const {title, coverAlt} = localized(entry);
    const coverArtwork = works.get(cover);
    const artworkAlt = !text(coverImage) && text(coverAlt);
    const candidates = [
      {image: coverImage, alt: coverAlt, protectArtwork: true},
      coverArtwork && {...coverArtwork, alt: artworkAlt || coverArtwork.alt},
      ...galleryWorks(entry, works)
    ];
    return el('a', {href: url('gallery', {id})}, previewImage(candidates),
      el(compact ? 'h3' : 'h2', {class: 'preview-title'}, title)
    );
  }));
}

async function renderHome() {
  const [home, works, galleries] = await Promise.all([load('home'), loadArtworks(), load('galleries')]);
  const {pageTitle, selected, portfolioLink} = localized(home);
  const featured = works.get(shared(home).featured) || works.values().next().value;
  const hero = el('section', {class: 'hero wrap'}, el('h1', {class: 'visually-hidden'}, pageTitle));
  main.append(hero, el('section', {class: 'selected'}, el('div', {class: 'wrap'},
    el('div', {class: 'section-bar'}, el('h2', {}, selected), link('portfolio', portfolioLink, 'text-link')),
    categoryPreviews(galleries.slice(0, 4), works, true)
  )));
  if (featured) renderArtworkSet(hero, [featured], true);
  return pageTitle;
}

async function renderPortfolio() {
  const [data, works, galleries] = await Promise.all([load('portfolio'), loadArtworks(), load('galleries')]);
  const {title, intro} = localized(data);
  main.append(el('section', {class: 'wrap interior'}, sectionTitle(title, intro), categoryPreviews(galleries, works)));
  return title;
}

async function renderGallery() {
  const [portfolio, galleries, works] = await Promise.all([load('portfolio'), load('galleries'), loadArtworks()]);
  const id = document.body.dataset.galleryId ?? entryId;
  const entry = id && galleries.find(item => shared(item).id === id);
  const section = el('section', {class: 'wrap interior'}, back('portfolio', localized(portfolio).title));
  main.append(section);
  if (!entry) {
    const unavailable = ui('Gallery unavailable', 'Galerie nicht verfügbar');
    section.append(sectionTitle(unavailable));
    return unavailable;
  }

  const {title, description} = localized(entry);
  const gallery = el('div', {class: 'gallery'});
  section.append(sectionTitle(title, description), gallery);
  const ordered = galleryWorks(entry, works);
  if (ordered.length) renderArtworkSet(gallery, ordered);
  else gallery.append(el('p', {}, ui('No artworks have been added yet.', 'Hier wurden noch keine Werke hinzugefügt.')));
  return title;
}

async function renderServices() {
  const [overview, entries] = await Promise.all([load('services-overview'), load('services')]);
  const {title, intro} = localized(overview);
  const section = el('section', {class: 'wrap interior'});
  if (page === 'services') {
    section.append(sectionTitle(title, intro));
    section.append(el('div', {class: 'collections service-previews'}, ...entries.map(entry => {
      const {id, coverImage} = shared(entry);
      const {title: name, coverAlt} = localized(entry);
      return el('a', {href: url('service', {id})}, previewImage([{image: coverImage, alt: coverAlt}]),
        el('h2', {class: 'preview-title'}, name));
    })));
    main.append(section);
    return title;
  }

  const entry = entries.find(item => shared(item).id === entryId);
  section.append(back('services', title));
  main.append(section);
  if (!entry) {
    const unavailable = ui('Service unavailable', 'Leistung nicht verfügbar');
    section.append(sectionTitle(unavailable));
    return unavailable;
  }

  const data = localized(entry);
  const sharedData = shared(entry);
  const article = el('article', {class: 'service-detail'}, sectionTitle(data.title, data.intro), richText(data.body));
  const href = contentLink(sharedData.inquiryUrl);
  if (href && text(data.inquiryLabel)) article.append(el('a', {class: 'text-link', href}, text(data.inquiryLabel)));
  section.append(article);
  const photos = items(sharedData.photos).map((photo, index) => {
    const {alt, caption} = items(data.photos)[index] ?? {};
    return photoFigure({image: photo?.image, alt}, caption);
  }).filter(Boolean);
  if (photos.length) section.append(el('div', {class: 'service-gallery'}, ...photos));
  return data.title;
}

async function renderAbout() {
  const [data, works, portfolio] = await Promise.all([load('about'), loadArtworks(), load('portfolio')]);
  const copy = localized(data);
  const {image, artwork: reference} = shared(data);
  const photo = mediaUrl(image) ? {image, alt: copy.alt} : works.get(reference);
  main.append(el('section', {class: 'wrap interior'}, el('div', {class: 'editorial'},
    el('div', {}, sectionTitle(copy.title, copy.intro), text(copy.sub) ? el('h2', {}, copy.sub) : null,
      richText(copy.body), link('portfolio', localized(portfolio).title, 'text-link')),
    photoFigure(photo, copy.caption, true)
  )));
  return copy.title;
}

function renderContact(contact) {
  const {title, intro, body} = localized(contact);
  const {email, telephone, social} = shared(contact);
  const section = el('section', {class: 'wrap interior'}, sectionTitle(title, intro), richText(body));
  if (text(email)) section.append(el('div', {class: 'contact-email'}, emailLink(email)));
  if (text(telephone)) {
    section.append(el('p', {class: 'contact-line'}, el('a', {href: 'tel:' + telephone.replace(/[^+\d]/g, '')}, telephone)));
  }
  const socials = items(social).map(({label, href}) => {
    const destination = contentLink(href);
    if (destination && text(label)) return el('li', {}, el('a', {href: destination}, label));
  }).filter(Boolean);
  if (socials.length) section.append(el('ul', {class: 'social-links'}, ...socials));
  main.append(section);
  return title;
}

async function renderNews() {
  const [overview, articles, works] = await Promise.all([load('news-overview'), load('news'), loadArtworks()]);
  const {title, intro} = localized(overview);
  function photo(item) {
    const {coverImage, image} = shared(item);
    return mediaUrl(coverImage) ? {image: coverImage, alt: localized(item).coverAlt} : works.get(image);
  }

  if (page === 'article') {
    const item = articles.find(article => shared(article).id === entryId);
    const copy = localized(item);
    const articleTitle = copy.title || ui('Article unavailable', 'Beitrag nicht verfügbar');
    main.append(el('article', {class: 'article wrap interior'}, back('news', title), el('h1', {}, articleTitle),
      item ? photoFigure(photo(item), copy.caption, true) : null, richText(copy.body)
    ));
    return articleTitle;
  }

  const section = el('section', {class: 'wrap interior'}, sectionTitle(title, intro));
  const formatDate = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeZone: 'UTC'});
  for (const item of articles.slice().sort((a, b) => text(shared(b).date).localeCompare(text(shared(a).date)))) {
    const {id, date} = shared(item);
    const copy = localized(item);
    const image = photo(item);
    const dateValue = new Date(date);
    section.append(el('a', {
      class: image ? 'news-entry' : 'news-entry news-entry-text', href: url('article', {id})
    }, image ? picture(image) : null, el('div', {},
      Number.isFinite(dateValue.getTime()) ? el('time', {datetime: date}, formatDate.format(dateValue)) : null,
      el('h2', {}, copy.title), text(copy.excerpt) ? el('p', {}, copy.excerpt) : null
    )));
  }
  main.append(section);
  return title;
}

async function render() {
  const [settings, contact] = await Promise.all([load('settings'), load('contact')]);
  let active = page;
  if (page === 'gallery') active = 'portfolio';
  if (page === 'article') active = 'news';
  if (page === 'service') active = 'services';
  renderChrome(settings, contact, active);

  let title;
  if (page === 'gallery') title = await renderGallery();
  else if (page === 'index') title = await renderHome();
  else if (page === 'portfolio') title = await renderPortfolio();
  else if (page === 'services' || page === 'service') title = await renderServices();
  else if (page === 'about') title = await renderAbout();
  else if (page === 'contact') title = renderContact(contact);
  else if (page === 'news' || page === 'article') title = await renderNews();
  document.title = title + ' · ' + shared(settings).artist;

  rendered = true;
  if (supportsPageTransitions && revealed) main.classList.add('page-arrival');
}

render().catch(error => {
  console.error(error);
  main.textContent = ui('The catalogue could not be loaded. Please reload the page.',
    'Der Katalog konnte nicht geladen werden. Bitte laden Sie die Seite erneut.');
});
