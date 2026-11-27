# Clara Weiss artist portfolio

A bilingual static portfolio for GitHub Pages. The artist name, biography, example email, studio notes, service examples and review images are sample content. The Ceramics cover is a generated placeholder.

## Run locally

There is no install or build step. With the checkout named `portfolio`, run this from its parent directory.

```sh
python3 -m http.server 8327 --bind 127.0.0.1
```

Open `http://127.0.0.1:8327/portfolio/` for the site and `http://127.0.0.1:8327/portfolio/admin/` for the editor. Serving the parent directory exercises the same project subpath as GitHub Pages. GitHub Pages serves the repository root directly, with `.nojekyll`.

Use `?lang=en` or `?lang=de` to test each locale. The language switcher preserves the page and its `id` query parameter. Direct detail URLs include `gallery.html?id=design&lang=en`, `article.html?id=by-the-water&lang=en` and `service.html?id=painting-classes&lang=de`.

## Replace the favicon

Replace `favicon.png` in the repository root with your own PNG of the same name. A transparent 32 × 32 px image works well at browser-tab sizes. The replacement applies to both languages and the legacy gallery URLs. Browsers can cache favicons after publishing. If the old icon persists, check in a private window or clear the site's cached data.

## Edit content with Sveltia

Open the production [Content Manager](https://hqmap.github.io/portfolio/admin/) once the revision is deployed. The admin uses Sveltia CMS **0.273.1**, the GitHub backend for `hqmap/portfolio` and simple publishing. Only the admin downloads Sveltia.

1. In **Artwork Library**, create an artwork and upload or select an image. The ID is generated automatically. The title, medium, year, physical dimensions, description and alt text can be left blank. Add English and German descriptions and alt text in their respective locales.
2. In **Portfolio Galleries & Covers**, create a gallery and enter its English and German titles and optional introductions. Sveltia generates the gallery ID. Open a gallery again to edit or rename it.
3. In the gallery, choose **Add Artwork** under **Artwork order** and select a work by title or image filename. In the English pane, drag the item handles or use the move controls. The German pane follows the same order. A work can appear in multiple galleries.
4. Choose **Cover artwork** or select or upload a **Dedicated cover image**. A dedicated image takes precedence. Add **Cover alternative text** in each language for the image you chose. If the dedicated file is unavailable, the site tries the cover artwork. If that reference is unavailable, it uses the first available gallery work. Clearing the dedicated image returns the preview to the selected artwork.
5. Choose **Reorder** in the gallery collection, drag the categories into position and choose **Done**. Portfolio shows the full list, and Selected Collections on the homepage shows up to the first four. Select a gallery and choose **Delete** to remove it. Its artworks remain in the library and in any other galleries that use them.
6. In **Website Pages → Homepage**, change **Featured artwork**. The artwork selection is shared. If the selection is missing, the page uses the first available work in the library.
7. In **Services & Commissions**, add the English and German titles and descriptions and choose a cover. Add optional photographs with translated captions and alt text. Use the collection's reorder control to change the sequence shown on the public overview. An inquiry requires a destination and a label for the language where it should appear.
8. Edit the biography, contact details and other overview copy under **Website Pages**. Manage posts under **News Articles** and the name and navigation labels under **Website Settings**. Use **Assets** to browse uploaded images.

To show the Instagram icon, add your profile name and full Instagram profile URL under **Website Pages → Contact → Social links** in the English pane. The navigation uses the first valid Instagram profile URL for both languages. When the list contains no valid Instagram profile URL, the icon takes up no space.

The preview pane uses the public fonts and colors and shows draft content, including images and formatted text. Each gallery preview shows its cover and artwork order for the current locale in simple columns. The public pages provide masonry placement, the artwork viewer and complete site navigation. Existing images may be selected through the Asset Library, and uploads are optimized to WebP at quality 94 with a 2800 px bounding box. Artwork images keep their aspect ratios. Retain separate archival scans. The public gallery and viewer share the full optimized image.

### Owner sign-in and publishing

1. In GitHub, open **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Choose the repository owner as the resource owner, set an expiration, select **Only select repositories**, and choose `hqmap/portfolio`.
3. Under repository permissions grant **Contents: Read and write**. GitHub adds **Metadata: Read** automatically. The simple workflow uses the contents permission.
4. On the admin page, choose **Sign In Using Access Token** and paste the token there. Sveltia remembers this sign-in in the browser. Keep the token in a password manager and sign out on shared devices.
5. Review edits in the preview and choose **Save**. Sveltia commits directly to `main`, and GitHub Pages serves the update after its deployment completes. The publishing account must be allowed to write to that branch under the repository's branch rules.
6. Choose **Sign Out** in the user menu to remove the browser's session. When the token expires, create its replacement with the same repository access, sign out if necessary, and use **Sign In Using Access Token** again. Revoke the old token in GitHub after confirming the replacement works.

See [Sveltia's GitHub backend instructions](https://sveltiacms.app/docs/backends/github) and [GitHub's token settings guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

## Content files

The CMS uses `single_file` internationalization. A page file contains `{"en": {...}, "de": {...}}`. Each entry in an artwork, gallery, service or news array uses the same shape. The CMS copies fields marked `duplicate` from English to German. The service photo list synchronizes its images and order from either locale. The public site reads shared values from English and translated fields from the selected locale. Blank optional captions stay blank in that language.

| File | Shape and relationships |
|---|---|
| `content/artworks.json` | Array. `id`, `image`, `year` and `dimensions` are shared. `title`, `medium`, `description` and `alt` are translated. |
| `content/galleries.json` | Ordered array. `id`, the `cover` artwork ID, optional `coverImage` path and `works` are shared. `works` is an ordered list of `{"artwork": "artwork-id"}` items. `title`, optional `description` and optional `coverAlt` are translated. |
| `content/home.json` | Shared `featured` artwork ID with translated page title and Selected Collections text. |
| `content/services.json` | Ordered array. `id`, `coverImage`, photo image paths, photo order and `inquiryUrl` are shared. Photo captions and alt text, title, intro, body, cover alt text and inquiry label are translated. |
| `content/news.json` | Array with stable `id`, shared publication date and optional artwork ID or dedicated cover. Titles, summaries, articles and image descriptions are translated. The public list sorts by date. |
| `content/{about,contact,portfolio,services-overview,news-overview,settings}.json` | Individual pages and settings. About Me can use an uploaded photo or an artwork reference. Contact holds the shared email, optional phone and social links. |

`artworks.json` replaces the earlier ID-keyed object. Website pages use individual bilingual files with their own CMS forms. The original service copy appears under Commissions. The retired homepage introduction is preserved in the history of `content/home.json`.

The gallery collection replaces the individual category JSON files. The migration kept the four gallery IDs, translations, covers, artwork references and ordering. The Artwork Library supplies the same artwork IDs and metadata.

New categories use `gallery.html?id=<gallery-id>&lang=<locale>`. Renaming or reordering a category preserves its ID and URL. The original `galleries/design.html`, `galleries/illustration.html`, `galleries/portraits.html` and `galleries/creative-projects.html` entry points load the same collection using their original IDs on GitHub Pages. A missing, unknown or deleted ID shows a localized unavailable message and a link back to Portfolio.

Uploaded image paths look like `/portfolio/images/name.webp` and resolve relative to the project root on public pages. Legacy `pixelSize` metadata in an artwork's English object is optional and used only when it names the current image. The browser also checks its intrinsic size on load. Physical artwork dimensions are an optional caption field.

Sveltia stores formatted text as HTML. The public renderer retains common editorial elements and checks link and image schemes while rebuilding the markup. The font licenses accompany the local WOFF2 files.

## Artwork saving deterrents

Public Artwork Library images and portfolio covers suppress the default image context menu and native image dragging. Supporting browsers also suppress the image callout on long press. The artist can still manage and download images in Sveltia CMS. These measures deter casual saving. Public image files remain downloadable and screenshots are still possible.

## Artwork viewer settings

In `js/viewer.js`, `DESKTOP_ZOOM_SCALE` (1.3) and `MOBILE_ZOOM_SCALE` (1.5) set zoom relative to the fitted image. Mobile zoom follows the browser's coarse primary pointer setting in both orientations.

`HORIZONTAL_SWIPE_THRESHOLD` (40), `FLICK_MIN_DISTANCE` (20) and `VERTICAL_SWIPE_THRESHOLD` (72) are measured in CSS pixels. `FLICK_MIN_VELOCITY` (0.5) is the minimum average horizontal speed in CSS pixels per millisecond for shorter swipes.

On desktop, the empty space beside fitted artwork in multi-artwork galleries provides previous and next click areas. The chevrons sit about 7.5% in from the viewer edges at a fixed height through artwork transitions. In `css/style.css`, the chevrons are approximately 27 px tall, with 18% resting opacity and 30% on hover. Add `viewer-hide-chevrons` to the generated dialog's class list in `js/viewer.js` to hide the chevrons while keeping the click areas. Previous and next buttons appear in the upper left when reached by Tab or when a wide artwork leaves too little room at the sides.

## Verify in a disposable copy

The public pages can be served at `/portfolio/` and tested in a browser without signing in. For CMS edits, use a copy of the checkout and [Sveltia's local development workflow](https://sveltiacms.app/docs/workflows/local) in a supported Chromium browser. The [Test backend](https://sveltiacms.app/docs/backends/test) can also seed the site's JSON and images for a browser-only round trip. Keep the production config on the GitHub backend.

In the disposable editor, create, rename, reorder and remove galleries with the category editor and collection reorder controls. Select or upload covers and confirm the saved gallery and artwork order, references and URLs in both languages. Check empty and unavailable galleries, the original gallery URLs and the homepage's four-category limit at desktop and mobile widths. After saving, recheck service URLs and the spacing above landscape and portrait featured artwork on the homepage. The repository owner's authenticated PAT login and first live publishing check take place on the deployed revision.

Follow public links on desktop and through the mobile menu. Switch languages on a detail page and use browser Back and Forward at both viewport sizes. On a ready destination, a supporting browser can crossfade the page in 140 ms while the header stays at full opacity. Repeat with the cache disabled and network throttling enabled. The browser displays slow destinations as they load, and late content and images use short opacity fades where supported. Enable reduced motion and check that page and image motion is disabled.

Open an artwork in each language and check the viewer at desktop, portrait phone and landscape phone sizes. The desktop caption row has the title on the left and metadata on the right. On a portrait phone the caption sits below the image and the arrows stay at the bottom. On a short landscape screen the arrows and Close sit at the top.

- Open an artwork by mouse and press Left and Right repeatedly before and after zooming. Check that the controls and artwork show no focus rings from those shortcuts. Close with the mouse and confirm focus returns to the opening artwork without an outline. Tab and Shift+Tab through the controls to check their focus rings, and test closing with Escape and with Enter on Close.
- Click near the outer edge and the artwork edge of both empty areas beside landscape, square and portrait artwork. Check that the chevrons stay in place through slides. Repeat with `viewer-hide-chevrons` applied. Open a panorama that reaches the chevron positions and use the upper-left arrows to navigate. Confirm the artwork itself toggles 130% zoom, the side areas are inactive while zoomed, and single-artwork galleries omit navigation. Click the navigation buttons repeatedly and confirm that captions can still be selected normally.
- On a touch device, check 150% zoom, tap-to-reset and panning in both orientations. Check that short horizontal swipes and fast flicks navigate, and minor or canceled gestures return the artwork to center. Swipe up and down to close fitted artwork, including in a single-artwork viewer. Swipe while zoomed to check panning in both directions.
- Check long and empty captions and repeat navigation with reduced motion. Throttle the network to check that the current artwork stays visible while the next artwork loads. Verify touch behavior and orientation changes on iOS Safari and Chrome on Android with physical devices.

Check the footer baselines on desktop and mobile. Try a longer artist name in Website Settings and a longer email address in Contact to verify wrapping and link behavior. Check the browser-tab icon on public pages, including a legacy gallery URL, in both languages.

Right-click and drag the featured artwork, portfolio covers, gallery images and viewer images. Check that ordinary text and links still open their context menus. Long-press artwork on iOS Safari and Chrome on Android. Device testing is needed to verify native mobile menus because desktop emulation tests web events and CSS, while the device controls the callout.
