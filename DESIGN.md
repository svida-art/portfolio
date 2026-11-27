# Artist Portfolio — Website Design Document

**Version:** 1.1 — Prototype v2 and CMS integration\
**Project type:** Bilingual artist portfolio  
**Languages:** English and German  
**Hosting:** GitHub Pages  
**Content management:** Sveltia CMS

---

## 1. Project overview

The project is a lightweight, responsive portfolio website showcasing the artist's work, with particular emphasis on watercolor paintings, illustration and creative projects.

The website should provide an elegant visual presentation of the artwork, introduce the artist, communicate available services, facilitate commissions and allow visitors to follow the artist's activities through news publications.

The artist must be able to independently maintain the website through a user-friendly graphical content management interface, without programming knowledge.

### Primary objectives

- Present artwork in an attractive, professional and accessible manner.
- Establish a distinctive visual identity reflecting the artist's artistic style.
- Provide a bilingual experience in English and German.
- Ensure excellent usability on desktop computers, tablets and smartphones.
- Allow independent content management by the artist.
- Maintain minimal technical complexity and external dependencies.
- Avoid recurring hosting and software subscription costs within the hosting service's free-tier limits.
- Ensure long-term maintainability and portability.

## 2. Website structure

### 2.1. Main navigation

The following navigation labels are adapted to natural English and German terminology commonly used on artist portfolio websites.

| Ukrainian reference | English | German |
|---|---|---|
| Портфоліо | Portfolio | Portfolio |
| Послуги і замовлення | Services & Commissions | Leistungen & Auftragsarbeiten |
| Про мене | About Me | Über mich |
| Новини | News | Aktuelles |
| Контакти | Contact | Kontakt |

The artist's name, displayed in the upper-left corner, functions as a link to the homepage.

A language switcher labelled **EN / DE** is positioned alongside the main navigation.

When configured, the Instagram link appears after Contact and before the language switcher on desktop. On mobile it appears below Contact inside the expanded menu.

### 2.2. Portfolio categories

The artist creates, translates, edits, reorders and deletes portfolio categories in Sveltia CMS. Each category has a gallery URL based on its stable ID. The initial collection preserves these galleries.

| Ukrainian reference | English | German |
|---|---|---|
| Дизайн | Design | Design |
| Ілюстрація | Illustration | Illustration |
| Портрети | Portraits | Porträts |
| Творчі проєкти | Creative Projects | Künstlerische Projekte |

### 2.3. Sitemap

- Home
- Portfolio
  - Individual gallery pages generated from CMS entries
- Services & Commissions
  - Individual service pages generated from CMS entries
- About Me
- News
  - Individual news articles
- Contact

All public pages are available in both languages.

## 3. Visual identity and design direction

### 3.1. General aesthetic

The visual identity should be inspired by watercolor painting, traditional art materials, fine-art exhibition catalogues and contemporary editorial design.

The intended atmosphere is:

- Light and airy.
- Elegant but not excessively decorative.
- Organic and tactile.
- Calm and welcoming.
- Personal rather than corporate.
- Timeless rather than trend-driven.

The artwork itself should remain the dominant visual element. Interface elements should complement the paintings without competing with their colors or composition.

### 3.2. Background and textures

The primary background should use a warm off-white color with an optional subtle watercolor paper texture.

The texture should be:

- Fine-grained and natural-looking.
- Low contrast.
- Seamlessly repeatable.
- Lightweight and locally hosted.
- Subtle enough not to interfere with text readability or artwork reproduction.

Restrained watercolor washes may be used in selected decorative areas, such as the homepage or section transitions. Decorative elements should not be applied indiscriminately throughout the website.

### 3.3. Proposed color palette

| Purpose | Color | HEX |
|---|---|---|
| Main background | Warm watercolor paper | #F8F5EE |
| Secondary background | Light ivory | #FDFBF7 |
| Primary text | Warm charcoal | #383630 |
| Secondary text | Muted grey-brown | #77736B |
| Primary accent | Muted sage green | #879785 |
| Secondary accent | Dusty terracotta | #C28F7D |
| Alternative accent | Muted watercolor blue | #91A9BC |
| Dividers and borders | Pale warm grey | #DED9CF |

The palette is provisional and should be refined after reviewing the artist's actual work.

Accent colors should primarily be used for decoration, hover states and selected interface elements. Text and interactive controls must maintain sufficient contrast.

### 3.4. Typography

Typography should combine artistic elegance with practical readability.

**Artist's name**

A distinctive, refined serif, calligraphic or handwritten typeface. It should resemble a personal signature or an editorial wordmark without becoming difficult to read.

**Headings**

An elegant serif typeface, with generous spacing and a restrained hierarchy.

Potential typefaces:

- Cormorant Garamond
- EB Garamond
- Bodoni Moda
- Playfair Display

**Body text and navigation**

A clean, understated sans-serif or highly readable serif typeface.

Potential typefaces:

- Jost
- Lato
- Source Sans 3

All selected fonts must support German characters and be hosted locally in optimized WOFF2 format.

### 3.5. Interface styling

- Generous whitespace.
- Minimal borders and separators.
- Predominantly rectangular artwork presentation.
- Subtle hover transitions.
- Ordinary links use underlines, hover and focus states, or a clickable preview.
- Arrows indicate functional navigation such as back links and previous and next artwork controls.
- Little or no artificial drop shadows.
- No gradients or prominent interface decorations unless artistically justified.
- No intrusive animations, automatic carousels or distracting visual effects.

The website should evoke the experience of browsing a physical artist's portfolio.

## 4. Global website layout

### 4.1. Header

The desktop header consists of three primary elements:

- Artist's name or wordmark on the left.
- Main horizontal navigation on the right.
- English/German language switcher.

The active page is indicated by a subtle underline or accent color.

The Instagram link uses a 20 px inline SVG outline with a transparent background. It inherits the navigation text and hover colors and has a 44 × 44 px target, an accessible name and a visible keyboard focus indicator.

The header should be consistent across all pages, with sufficient vertical space to create a calm, uncluttered appearance.

### 4.2. Content area

The main content area should use a centered, responsive layout with a maximum width of approximately 1440 pixels.

Text-oriented pages should have a narrower reading area, while galleries should make more extensive use of the available screen width.

### 4.3. Footer

A minimal footer containing:

- Artist's name.
- Copyright notice.
- Contact email.
- Social media links, if applicable.
- Privacy and legal information, where applicable.

The footer should remain visually secondary to the main content. The artist's homepage link, copyright notice and email share a typographic baseline on each row. Long names and email addresses wrap within the available width.

## 5. Individual page designs

### 5.1. Homepage

The homepage opens with one large, artist-selected artwork inside the existing content margins. It uses the available width for landscape images and keeps square and portrait images comfortably sized. Images retain their proportions and can be opened in the artwork viewer. When artwork information is available, it appears below the image in the same caption style as the galleries. The hero uses 20 px of top padding below the header, reduced to 14 px at viewport widths of 650 px and below.

Selected Collections remains below the featured artwork. It shows up to the first four categories in the same order and with the same covers as the Portfolio overview. The header, language switcher, paper background and footer frame the artwork.

The CMS provides one featured artwork selection shared by both languages. The artwork and Selected Collections provide the homepage introduction.

### 5.2. Portfolio overview

The portfolio overview displays all categories in the order set in Sveltia CMS. Each category is represented by a large preview image and category title.

Desktop layout:

- Two-column image grid.
- Generous spacing between categories.
- Consistent image preview proportions.

Mobile layout:

- Single-column arrangement on narrow screens.
- Large, easily tappable previews.

Clicking anywhere within a category preview opens the corresponding gallery page.

The artist can choose an artwork by its stable ID or select or upload a dedicated cover image through the CMS. The selection is shared by both languages and used on the Portfolio overview and in Selected Collections. Cover alternative text can be translated. A dedicated image takes precedence. If the dedicated file is unavailable, the site tries the cover artwork. If that reference is unavailable, it uses the first available gallery work. An empty category remains accessible from its labeled preview.

### 5.3. Category gallery pages

Each category has a page containing a category heading, optional introductory text, an artwork gallery and a link back to the Portfolio overview. Portfolio stays active in the main navigation. The shared `gallery.html` entry point reads the category ID from the URL, and the language switcher preserves it. A missing, unknown or deleted ID displays a localized unavailable message with a link to the overview.

The responsive masonry gallery uses equal-width columns and consistent gaps. It places the first artworks across the top from left to right, then places each next artwork in the shortest column, breaking ties from left to right. The layout measures image and caption heights and updates when viewport, fonts or card heights change. The CMS order also determines document order, focus order and viewer navigation. Each artwork retains its original aspect ratio.

**Artwork information**

An artwork requires only its image. The optional caption can contain an italic title, technique, creation year, physical dimensions and an extended description. The caption wraps on small screens and takes up space only when content is present. Alternative text is translated independently of the visible caption. Additional views of an artwork can be catalogued as individual gallery entries, as in the existing detail studies.

**Manual artwork ordering**

The artist adds artworks to a gallery by selecting references to stable artwork IDs and arranges them with Sveltia's drag-and-drop list. Both languages read the same saved order.

**Expanded artwork viewer**

The fullscreen viewer fits the full optimized image in the space left by its controls and caption. It preserves image proportions, displays the entire artwork and can enlarge small sources. A desktop bottom row places the title on the left and medium, year and dimensions on the right. Caption fields wrap in their own columns, and an extended description can continue below the row. Oversized fields support keyboard and touch scrolling. A single artwork omits the arrows, and empty caption fields take up no space.

The viewer uses 6 px of top and bottom padding, reduced to 4 px on short landscape screens, with room for device safe areas. Close and navigation buttons have borderless styling, hover feedback and targets of at least 44 × 44 px. Tab and Shift+Tab show focus on the active control. Left and Right navigate without changing the focus style established by the last interaction. Escape closes the viewer, and focus returns to the artwork that opened it. Captions remain selectable while viewer controls use non-selectable text.

With a fine, hover-capable primary pointer, all empty space to either side of a stationary, fitted artwork links to the previous and next works in multi-artwork galleries. The chevrons sit about 7.5% in from the viewer edges. Their vertical centerline is set when the viewer opens or resizes, so it stays steady as artworks and captions change during navigation. The chevrons can be hidden independently of the click areas. When a wide artwork leaves too little room beside it, the chevrons give way to previous and next buttons in the upper left. These buttons also appear when Tab reaches them or while the viewer has no displayable image. They remain available to screen readers and take up no space in the desktop caption row.

Pressing or tapping the artwork toggles zoom relative to its fitted size. Desktop zoom is 130%, and devices with a coarse primary pointer use 150% in either orientation. The selected point guides the zoom, and drags pan the enlarged image. A second press or tap resets it. Controls and caption remain at their normal size. Closing the viewer or changing artworks resets the zoom and pan.

In fitted mode, a dominant horizontal swipe navigates after 40 CSS pixels of travel. A deliberate flick can navigate after 20 CSS pixels when its average horizontal speed is at least 0.5 CSS pixels per millisecond. A dominant vertical swipe closes the viewer after 72 CSS pixels, including in a single-artwork viewer.

Artwork follows fitted swipes and returns to center when a swipe falls short or is interrupted. Horizontal swipes, side clicks, navigation buttons and arrow keys slide between works in around 180 ms. The viewer background and controls stay stationary. The current work stays visible while the requested image loads, and the viewer preloads its immediate neighbors. With reduced motion enabled, the viewer switches images as soon as they are ready and skips the swipe movement.

### 5.4. Services & Commissions

The overview presents a responsive set of smaller image-and-title previews. The entire card links to the service's dedicated page. The starting categories are Drawing & Painting Classes, Ceramics and Commissions, with English and German titles and editable sample content.

Each service detail page uses the site's editorial typography and can include a title, optional introduction, formatted description, ordered photographs with optional captions, and an optional inquiry link. Photographs retain their aspect ratios. A back link returns visitors to the overview, and Services & Commissions stays active in the main navigation.

The artist can create, translate, reorder and delete service categories in the CMS. The reusable `service.html` reads a stable ID from the URL and retrieves the entry from the services collection. Renaming or reordering the service preserves its URL. The language switcher keeps the service ID. A missing entry displays a localized message and a link to the overview.

### 5.5. About Me

An editorial-style biography page presenting the artist's personal and professional background.

Potential content:

- Artist's portrait photograph.
- Biography.
- Artistic philosophy.
- Education and experience.
- Exhibitions and achievements.
- Creative techniques and materials.

On desktop, the page may use an asymmetric two-column layout combining photography and text.

On mobile, the content should flow naturally in a single column.

The artist's photograph and biography must be editable through the CMS.

### 5.6. News

A chronological collection of publications managed through Sveltia CMS.

Potential publication types:

- Exhibition announcements.
- New artworks.
- Completed projects.
- Artistic events.
- Awards and achievements.
- Personal creative updates.

The news overview displays entries in reverse chronological order.

Each entry includes:

- Publication date.
- Cover image, if provided.
- Title.
- Short introductory excerpt.
- Link to the complete article.

Individual articles contain formatted text, images, links and optional image captions.

Each article has a unique, shareable URL.

The artist should be able to create, edit, preview, publish and delete articles independently.

### 5.7. Contact

A simple and welcoming page providing contact information.

Potential content:

- Short introductory message.
- Email address.
- Telephone number, if desired.
- Social media profiles.
- Studio location, if relevant.
- Commission inquiry information.

Email links should open the visitor's preferred email application.

A server-based contact form is not required for the initial version, avoiding additional hosting and third-party service dependencies.

## 6. Multilingual functionality

The website will support English and German using Sveltia CMS's built-in internationalization features.

### Language behavior

- English is proposed as the default language.
- German-speaking visitors may automatically receive the German version on their first visit.
- Visitors can change languages on any page.
- Changing languages preserves the current page, category, article or service.
- The selected language is remembered locally.
- Language-specific URLs can be copied and shared.
- The language switcher uses language names or abbreviations rather than national flags.

### Translatable and shared content

| Content field | Behavior |
|---|---|
| Page headings | Translated |
| Page text | Translated |
| Artwork titles | Translated |
| Artwork descriptions | Translated |
| Artwork technique | Translated |
| Image alternative text | Translated |
| News titles and articles | Translated |
| Service titles, introductions, descriptions, captions and inquiry labels | Translated |
| Artwork and service photographs | Shared |
| Portfolio covers and featured artwork selection | Shared |
| Artwork, gallery, service and article identifiers | Shared |
| Service and photograph ordering | Shared |
| Portfolio category and gallery artwork ordering | Shared |
| Artwork dimensions | Shared |
| Creation year | Shared |
| Publication dates | Shared |
| Contact details | Shared |

Translations should be managed within the same CMS entry to minimize duplicated work.

Images are uploaded once. Optional artwork text can be blank in either language.

## 7. Content management system

### 7.1. Platform

Sveltia CMS provides the administrative interface at [`/portfolio/admin/`](https://hqmap.github.io/portfolio/admin/). It loads a pinned release and uses the GitHub backend for `hqmap/portfolio`. The administration interface runs independently of the public site.

### 7.2. CMS content organization

- **Website Pages** manages the homepage, Portfolio overview, Services overview, About Me, News overview and Contact. The homepage selects a featured artwork. Contact holds the studio email used in the footer, along with optional phone and social links. The first valid Instagram profile URL in the shared Social links list supplies the navigation icon in both languages.
- **Artwork Library** manages images, stable identifiers and artwork metadata.
- **Portfolio Galleries & Covers** manages the ordered collection of galleries. Each gallery has a stable ID, a shared cover artwork or dedicated cover image, and a draggable list of artwork references. Titles, introductions and cover alternative text can be translated. Introductions and cover alternative text are optional.
- **Services & Commissions** manages the ordered service categories, covers, translated editorial content, photo lists and inquiry links.
- **News Articles** manages publications, dates, cover images and formatted articles.
- **Website Settings** manages the artist name and translated navigation labels.
- **Asset Library** holds artwork scans, photographs and other uploaded media.

The interface exposes content fields. Page structure and technical configuration are maintained in source.

### 7.3. Editing functionality

The artist can upload an image once, add optional artwork information and select the artwork in any gallery. The gallery's reorderable list controls public order for both languages. A separate selection controls each cover and the homepage artwork.

The artist can create, rename, reorder and delete categories in the galleries collection. Sveltia generates an ID for a new gallery. The same gallery ID serves both languages and stays in place when the gallery is renamed or moved. Deleting a gallery removes its references to artwork. The Artwork Library and other galleries keep their entries.

The artist can create, edit, reorder and delete services in the ordered services collection. A new service receives a stable ID. Its cover and photos are shared, while titles, introductions, descriptions, image captions, alternative text and inquiry labels can be translated independently. English and German content live in the same entry.

The CMS provides visual rich-text editing for descriptions, biographies and articles. Editors can preview entries before publishing and update contact details through the same interface.

### 7.4. Live preview

The Sveltia preview pane uses the public stylesheet and local fonts, along with templates for the homepage, artworks, galleries and editorial entries. The templates display the current locale and use Sveltia's asset and relation preview data. Each gallery entry uses the same preview template and shows its saved or draft cover and artwork sequence. The public pages provide the responsive masonry layout and interactive viewer.

### 7.5. Authentication

Authentication will use a GitHub Personal Access Token (PAT).

The token should:

- Be fine-grained.
- Be restricted to the portfolio repository.
- Have only the necessary repository permissions.
- Be stored securely.
- Never be embedded in public website code or committed to the repository.

Initial authentication will be configured on the artist's laptop.

The artist will receive brief instructions covering normal use, signing in again and token renewal.

No external OAuth authentication service is required.

### 7.6. Publishing workflow

1. The artist opens the administration page.
2. Selects a page, gallery or news article.
3. Edits the relevant content.
4. Reviews the preview.
5. Saves or publishes the changes.
6. Sveltia CMS commits the updated files to GitHub.
7. GitHub Pages automatically deploys the updated website.

Previous published versions remain recoverable through Git's version history.

The initial implementation will use a simple publishing workflow rather than a complex editorial approval system.

## 8. Image management and optimization

Image quality is particularly important because the website presents fine art.

### Upload processing

Sveltia CMS should be configured to optimize uploaded photographs automatically.

Configured upload settings:

- Maximum long-edge resolution: 2800 pixels.
- Optimized WebP output.
- High compression quality, 94.
- Preservation of original aspect ratio.
- No automatic cropping.
- No automatic color enhancement or sharpening.

Evaluate the upload settings with representative watercolor scans before replacing the review assets.

Particular attention should be paid to delicate color transitions, paper texture, fine brushwork and subtle low-contrast details.

Original high-resolution artwork photographs should be archived separately rather than relying on the website as the artist's primary image archive.

### Public website image loading

- Eager loading for the homepage feature, About photograph and news article cover. Offscreen gallery images use native lazy loading.
- In browsers with cross-document transition support, newly loaded images can fade in over 100 ms when motion is enabled. The fade changes opacity and leaves the image sizing and masonry layout to the existing layout rules.
- Valid stored dimensions reserve space when they match the image path. The browser reads intrinsic dimensions for new images and corrects dimensions when an image changes.
- Optimized thumbnails where practical.
- The viewer uses the full optimized image and has no additional source resolution limit.
- Responsive image presentation.
- Preservation of accurate color appearance using suitable sRGB source files.

The site uses one optimized file per artwork. The artist can upload a scan without entering pixel dimensions or creating thumbnails.

### Public artwork saving deterrents

The public image renderer marks Artwork Library images and portfolio covers as protected when it creates them, including cover fallbacks and images loaded by the fullscreen viewer. The marked images cancel their own context-menu events and set `draggable="false"`. CSS limits selection on those images and requests suppression of touch callouts with `-webkit-touch-callout: none` in browsers that support it.

Sveltia CMS uses its own image previews and asset controls. The public behavior deters casual saving. Visitors can still download the served image files or take screenshots.

## 9. Responsive design

The website should be designed for screen widths ranging from approximately 320 pixels to large desktop displays.

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| Navigation | Horizontal | Adaptive | Collapsible |
| Portfolio overview | 2 columns | 2 columns | 1 column |
| Services overview | 3 columns | 2 columns | 1 column |
| Artwork gallery | 3 masonry columns | 2 masonry columns | 1 column |
| Biography | Image and text | Adaptive | Stacked |
| News overview | 2–3 columns | 2 columns | 1 column |
| Artwork viewer | Fullscreen overlay | Fullscreen overlay | Touch-friendly fullscreen |

Additional requirements:

- No horizontal scrolling at normal viewport widths.
- Comfortable reading sizes.
- Adequately sized touch targets.
- No essential functionality dependent on mouse hover.
- Easily accessible language selection.
- Support for portrait and landscape device orientations.
- Responsive image and text sizing.
- Tap the artwork to toggle zoom on touch screens. On narrow portrait screens, the caption stays close to the image and arrows sit below it. On short landscape screens, arrows sit at the top left and Close sits at the top right.

## 10. Technical architecture

### 10.1. Technology stack

| Component | Technology |
|---|---|
| Website structure | HTML5 |
| Styling | CSS3 |
| Interactive functionality | Vanilla JavaScript |
| Content storage | JSON |
| Content management | Sveltia CMS |
| Version control | Git |
| Repository | GitHub |
| Hosting | GitHub Pages |
| Authentication | GitHub PAT |
| Database | None |
| Backend server | None |
| Build process | None |

No static site generator, JavaScript framework, Node.js environment or package manager is required for website deployment.

### 10.2. Repository structure

    portfolio/
    ├── index.html, portfolio.html, gallery.html, services.html, service.html
    ├── about.html, contact.html, news.html, article.html
    ├── favicon.png
    ├── galleries/
    │   └── design.html, illustration.html, portraits.html, creative-projects.html
    ├── css/style.css
    ├── js/
    │   └── main.js, content.js, gallery.js, viewer.js
    ├── content/
    │   ├── artworks.json, galleries.json, services.json, news.json
    │   ├── home.json, portfolio.json, services-overview.json
    │   └── about.json, contact.json, news-overview.json, settings.json
    ├── images/
    │   ├── artworks/
    │   └── textures/
    ├── fonts/
    ├── admin/
    │   └── index.html, config.yml, preview.js, preview.css
    ├── .nojekyll
    ├── DESIGN.md
    ├── AGENTS.md
    └── README.md

### 10.3. Content rendering

The HTML entry points load the shared stylesheet and the main vanilla JavaScript module. Page renderers fetch their JSON relative to the repository base, including from nested gallery pages. The renderer reads exact-locale text and default-locale shared values from each entry. Shared media values written as `/portfolio/images/…` resolve within the GitHub Pages project path.

The public entry points share a small, transparent watercolor favicon in both languages. Relative icon links resolve to the repository's `favicon.png` from top-level pages and the nested legacy gallery URLs.

Public links use full-document navigation. Supporting browsers can crossfade ready documents in 140 ms while showing the destination header at full opacity. The main module registers the readiness check before the first paint. If JSON or eager imagery is still loading when the browser is ready to start a transition, the browser skips the crossfade and displays the destination as it loads. Late main content eases into view over 120 ms. These effects require browser support for cross-document view transitions and honor the visitor's reduced-motion preference.

Artworks, galleries, services and news articles are stored as arrays of Sveltia single-file entries with `en` and `de` objects. Website pages are individual bilingual JSON files. `content/galleries.json` provides the category order and stores references to the Artwork Library in saved order. Settings, covers and relationships are editable through native CMS fields.

Galleries, news articles and services use reusable static detail pages. Example URLs include `gallery.html?id=design&lang=en`, `article.html?id=by-the-water&lang=en` and `service.html?id=painting-classes&lang=de`. The query string preserves the identifier on reload and when changing languages. The four original URLs under `galleries/` pass their existing IDs to the same gallery renderer, so they continue to work after a rename or reorder on static hosting.

Sveltia's rich-text field stores HTML. Public rendering copies permitted structural elements from an inert template and validates links and image paths. Public pages load no CMS scripts.

### 10.4. External dependencies

External dependencies should be kept to a minimum.

- Sveltia CMS, loaded only in the administration interface.
- Locally hosted fonts.
- Locally hosted images and decorative textures.
- Native browser functionality wherever possible.

CMS and library versions should be pinned to tested releases.

No external analytics, tracking scripts, advertising or unnecessary CDN resources should be included by default.

## 11. Performance and accessibility

### Performance requirements

- Minimal HTML, CSS and JavaScript payload.
- No unnecessary frontend frameworks.
- Fast initial page rendering.
- Deferred loading of nonessential resources.
- Lazy-loaded galleries.
- Optimized fonts and textures.
- Minimal visual layout shifts.
- Usability over slower mobile connections.

The CMS must not introduce additional downloads or processing overhead for ordinary website visitors.

### Accessibility requirements

- Semantic HTML.
- Keyboard-accessible navigation and galleries.
- Visible keyboard focus indicators.
- Descriptive image alternative text.
- Sufficient text contrast.
- Appropriate heading hierarchy.
- Correct document language attributes.
- Accessible fullscreen artwork viewer.
- Respect for reduced-motion system preferences.

### Search engine optimization

- Descriptive page titles.
- Page descriptions.
- Human-readable page paths where practical.
- Appropriate heading structure.
- Shareable bilingual URLs.
- Sitemap and robots.txt where useful.
- Basic social media preview metadata.

The no-build architecture means that dynamically loaded article content and article-specific metadata may not be recognized by every search engine or social media crawler. This is an accepted initial trade-off for architectural simplicity.

## 12. Security and maintenance

- HTTPS through GitHub Pages.
- Repository-restricted authentication credentials.
- No publicly exposed private tokens.
- Sanitization of rendered rich-text content.
- Git-based change history and recovery.
- Periodic repository backups.
- Independent archival of original artwork photographs.
- Monitoring of repository and published website size.
- Occasional review of CMS and dependency updates.

Content management should remain separate from website structure, reducing the risk of accidental design changes.

## 13. Prototype v2 scope

Prototype v2 includes:

- The bilingual site and its established paper texture, palette, typography and navigation.
- One artist-selected homepage artwork, with Selected Collections below it.
- CMS-managed portfolio galleries with independent covers, optional captions and responsive masonry.
- A fullscreen viewer with fitted image sizing, 130% desktop and 150% touch zoom, panning and keyboard, mouse and touch navigation.
- An ordered Services & Commissions overview and dynamic bilingual service pages.
- News overview and individual articles, About Me and Contact.
- Sveltia CMS with a shared media library, native editing and ordering, optimized uploads, previews and GitHub PAT sign-in.
- A GitHub Pages project deployment with static routes and no build step.
- Administration and verification instructions in the README.

E-commerce, payment processing, visitor accounts, server-based contact forms and complex editorial workflows remain outside this revision's scope.

## 14. Final design principles

The finished website should feel like a small, carefully curated online art exhibition.

The technical infrastructure should remain invisible to both visitors and the artist. Visitors should be able to focus on the artwork, while the artist should be able to maintain the portfolio without dealing with programming, deployment procedures or file structures.

**Art first. Simplicity, elegance and independence throughout.**
