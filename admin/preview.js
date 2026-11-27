(() => {
  const {CMS, html} = window;
  if (!CMS) return;
  CMS.registerPreviewStyle('../css/style.css');
  CMS.registerPreviewStyle('./preview.css');

  const data = props => props.entry.get('data').toJS();
  const related = (props, keys, id) => props.fieldsMetaData.getIn([...keys, 'artworks', id])?.toJS();
  const clean = value => typeof value === 'string' ? value.trim() : value;
  const marked = key => ({'data-key-path': key, tabIndex: 0});

  function image(props, source, alt, key) {
    const src = source && props.getAsset(source)?.url;
    return src ? html`<img ...${marked(key)} src=${src} alt=${alt || ''} />` : null;
  }

  function artwork(props, work, key) {
    const title = clean(work.title);
    const meta = [work.medium, work.year, work.dimensions].map(clean).filter(Boolean).join(' · ');
    const description = clean(work.description);
    return html`<figure>
      ${image(props, work.image, work.alt, key)}
      ${(title || meta || description) && html`<figcaption>
        ${title && html`<em>${title}</em>`}
        ${meta && html`<span className="caption-meta">${meta}</span>`}
        ${description && html`<p className="caption-description">${description}</p>`}
      </figcaption>`}
    </figure>`;
  }

  function editorial(props) {
    const entry = data(props);
    const newsArtwork = entry.image && related(props, ['image'], entry.image);
    const aboutArtwork = entry.artwork && related(props, ['artwork'], entry.artwork);
    const photo = entry.coverImage ? {image: entry.coverImage, alt: entry.coverAlt}
      : newsArtwork || (entry.image ? {image: entry.image, alt: entry.alt} : aboutArtwork) || {};
    const photoKey = entry.coverImage ? 'coverImage' : entry.image ? 'image' : 'artwork';
    const photos = entry.photos ?? [];
    return html`<article className="cms-preview">
      <h1 ...${marked('title')}>${entry.title}</h1>
      ${entry.intro && html`<p ...${marked('intro')} className="cms-intro">${entry.intro}</p>`}
      ${entry.excerpt && html`<p ...${marked('excerpt')} className="cms-intro">${entry.excerpt}</p>`}
      ${image(props, photo.image, photo.alt, photoKey)}
      ${entry.caption && html`<p ...${marked('caption')} className="caption-meta">${entry.caption}</p>`}
      ${entry.sub && html`<h2 ...${marked('sub')}>${entry.sub}</h2>`}
      ${entry.body && html`<div className="rich-text">${props.widgetFor('body')}</div>`}
      ${photos.length > 0 && html`<div className="cms-gallery">${photos.map((photo, index) => html`<figure key=${index}>
        ${image(props, photo.image, photo.alt, `photos.${index}.image`)}
        ${photo.caption && html`<figcaption><span className="caption-meta">${photo.caption}</span></figcaption>`}
      </figure>`)}</div>`}
      ${entry.inquiryLabel && html`<p className="text-link" ...${marked('inquiryLabel')}>${entry.inquiryLabel}</p>`}
      ${entry.email && html`<p className="contact-email" ...${marked('email')}>${entry.email}</p>`}
    </article>`;
  }

  function gallery(props) {
    const entry = data(props);
    const works = (entry.works ?? []).map(({artwork: id}, index) => ({
      work: related(props, ['works', 'artwork'], id), index
    })).filter(({work}) => work);
    const coverArtwork = related(props, ['cover'], entry.cover);
    const artworkAlt = (!clean(entry.coverImage) && clean(entry.coverAlt)) || coverArtwork?.alt;
    const cover = image(props, entry.coverImage, entry.coverAlt, 'coverImage')
      ?? image(props, coverArtwork?.image, artworkAlt, 'cover')
      ?? works.map(({work, index}) => image(props, work.image, work.alt, `works.${index}.artwork`)).find(Boolean);
    return html`<article className="cms-preview">
      <h1 ...${marked('title')}>${entry.title}</h1>
      ${entry.description && html`<p ...${marked('description')} className="cms-intro">${entry.description}</p>`}
      ${cover}
      <div className="cms-gallery">${works.map(({work, index}) => html`<div key=${index}>
        ${artwork(props, work, `works.${index}.artwork`)}
      </div>`)}</div>
    </article>`;
  }

  CMS.registerPreviewTemplate('artworks', props => html`<div className="cms-preview">
    ${artwork(props, data(props), 'image')}
  </div>`);
  CMS.registerPreviewTemplate('home', props => {
    const entry = data(props);
    const featured = related(props, ['featured'], entry.featured);
    return html`<article className="cms-preview">
      ${featured && artwork(props, featured, 'featured')}
      <h2 ...${marked('selected')}>${entry.selected}</h2>
      <p className="text-link" ...${marked('portfolioLink')}>${entry.portfolioLink}</p>
    </article>`;
  });
  CMS.registerPreviewTemplate('galleries', gallery);
  for (const name of ['about', 'contact', 'news', 'services', 'portfolio', 'news-overview', 'services-overview']) {
    CMS.registerPreviewTemplate(name, editorial);
  }
})();
