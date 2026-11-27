import {el, picture, text, ui} from './content.js';

const DESKTOP_ZOOM_SCALE = 1.3;
const MOBILE_ZOOM_SCALE = 1.5;
const DRAG_THRESHOLD = 7;
const HORIZONTAL_SWIPE_THRESHOLD = 40;
const VERTICAL_SWIPE_THRESHOLD = 72;
const FLICK_MIN_DISTANCE = 20;
const FLICK_MIN_VELOCITY = 0.5; // CSS pixels per millisecond.
const AXIS_RATIO = 1.2;
const SLIDE_DURATION = 180;
const CHEVRON_INSET = .075;
const CHEVRON_CLEARANCE = 10;
const MIN_SIDE_TARGET = 44;

function swipeAxis(dx, dy) {
  const x = Math.abs(dx);
  const y = Math.abs(dy);
  if (x > y * AXIS_RATIO) return 'x';
  if (y > x * AXIS_RATIO) return 'y';
}

function completesHorizontalSwipe(dx, elapsed) {
  const distance = Math.abs(dx);
  return distance >= HORIZONTAL_SWIPE_THRESHOLD
    || (distance >= FLICK_MIN_DISTANCE && elapsed > 0 && distance / elapsed >= FLICK_MIN_VELOCITY);
}

function translate(x, y = 0) {
  return `translate(${x}px, ${y}px)`;
}

export function createViewer(works, caption) {
  const hasSteps = works.length > 1;
  const close = el('button', {type: 'button', autofocus: ''}, ui('Close', 'Schließen'), ' ×');
  const prev = el('button', {type: 'button', 'aria-label': ui('Previous work', 'Vorheriges Werk')}, '←');
  const next = el('button', {type: 'button', 'aria-label': ui('Next work', 'Nächstes Werk')}, '→');
  const zoom = el('button', {
    type: 'button', class: 'viewer-image', 'aria-label': ui('Zoom artwork', 'Werk vergrößern'),
    'aria-pressed': 'false', hidden: ''
  });
  const adjacent = el('div', {class: 'viewer-adjacent', 'aria-hidden': 'true', hidden: ''});
  // The arrow buttons provide keyboard and screen-reader navigation.
  const leftSide = hasSteps ? el('div', {class: 'viewer-side viewer-side-left', 'aria-hidden': 'true'}) : null;
  const rightSide = hasSteps ? el('div', {class: 'viewer-side viewer-side-right', 'aria-hidden': 'true'}) : null;
  const viewport = el('div', {class: 'viewer-viewport'}, adjacent, zoom, leftSide, rightSide);
  const steps = hasSteps ? el('div', {class: 'steps'}, prev, next) : null;
  const stage = el('figure', {class: 'viewer-stage'}, viewport, steps);
  const status = el('span', {class: 'visually-hidden', 'aria-live': 'polite'});
  const dialog = el('dialog', {class: 'viewer', 'aria-label': ui('Artwork viewer', 'Werkansicht')},
    el('div', {class: 'viewer-controls'}, close), stage, status
  );

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = matchMedia('(pointer: coarse)');
  const wrap = index => (index + works.length) % works.length;
  let opener;
  let current = 0;
  let artwork;
  let nearby = new Map();
  let destination;
  let details;
  let fitted;
  let sideLayout;
  let position;
  let zoomScale = 1;
  let pointer;
  let animations;
  let dragX = 0;

  function prepare(index) {
    const image = picture(works[index], true);
    const entry = {image, ready: false};
    entry.loaded = image.decode().then(() => {
      entry.ready = true;
      return true;
    }, () => false);
    return entry;
  }

  function preloadNearby() {
    const images = new Map([[current, artwork]]);
    if (hasSteps) {
      for (const step of [-1, 1]) {
        const index = wrap(current + step);
        if (!images.has(index)) images.set(index, nearby.get(index) ?? prepare(index));
      }
    }
    nearby = images;
  }

  function place(left, top) {
    const width = fitted.width * zoomScale;
    const height = fitted.height * zoomScale;
    const {viewWidth, viewHeight} = fitted;
    const clamp = (offset, size, available) => size > available
      ? Math.min(0, Math.max(available - size, offset)) : (available - size) / 2;
    position = {left: clamp(left, width, viewWidth), top: clamp(top, height, viewHeight)};
    // Narrow portrait layouts can place the caption just below the fitted image.
    details?.style.setProperty('--caption-offset', `${Math.min(0, position.top + height - viewHeight)}px`);
    Object.assign(zoom.style, {
      width: `${width}px`, height: `${height}px`,
      left: `${position.left}px`, top: `${position.top}px`
    });
  }

  function fitSideNavigation(view) {
    const frame = dialog.getBoundingClientRect();
    if (sideLayout?.width !== frame.width || sideLayout.height !== frame.height
        || sideLayout.viewLeft !== view.left || sideLayout.viewRight !== view.right) {
      const inset = frame.width * CHEVRON_INSET;
      const left = Math.max(CHEVRON_CLEARANCE, frame.left + inset - view.left);
      const right = Math.max(CHEVRON_CLEARANCE, view.right - frame.right + inset);
      sideLayout = {
        width: frame.width, height: frame.height, viewLeft: view.left, viewRight: view.right,
        minimumWidth: Math.max(MIN_SIDE_TARGET, Math.max(left, right) + CHEVRON_CLEARANCE)
      };
      viewport.style.setProperty('--viewer-chevron-left', `${left}px`);
      viewport.style.setProperty('--viewer-chevron-right', `${right}px`);
      // Keep the centerline steady if a new caption changes the artwork's fitted height.
      viewport.style.setProperty('--viewer-chevron-top', `${view.height / 2}px`);
    }
    const sideWidth = Math.max(0, fitted.left);
    viewport.style.setProperty('--viewer-side-width', `${sideWidth}px`);
    dialog.classList.toggle('viewer-side-fallback', sideWidth < sideLayout.minimumWidth);
  }

  function fit() {
    if (!dialog.open) return;
    // Allow keyboard scrolling when a caption field reaches its height limit.
    if (details) {
      for (const field of [details, ...details.children]) {
        const scrollable = field.scrollHeight > field.clientHeight && getComputedStyle(field).overflowY === 'auto';
        if (scrollable) field.tabIndex = 0;
        else field.removeAttribute('tabindex');
      }
    }
    if (!artwork?.ready) return;
    const {naturalWidth, naturalHeight} = artwork.image;
    const view = viewport.getBoundingClientRect();
    const {width: viewWidth, height: viewHeight} = view;
    if (!viewWidth || !viewHeight) return;
    if (fitted?.viewWidth === viewWidth && fitted.viewHeight === viewHeight) return;
    if (fitted) {
      endDrag();
      clearMotion();
    }
    const scale = Math.min(viewWidth / naturalWidth, viewHeight / naturalHeight);
    const width = naturalWidth * scale;
    const height = naturalHeight * scale;
    fitted = {width, height, left: (viewWidth - width) / 2, top: (viewHeight - height) / 2, viewWidth, viewHeight};
    place((viewWidth - width * zoomScale) / 2, (viewHeight - height * zoomScale) / 2);
    if (hasSteps) fitSideNavigation(view);
    zoom.hidden = false;
  }

  function resetZoom() {
    zoomScale = 1;
    fitted = undefined;
    zoom.setAttribute('aria-pressed', 'false');
  }

  function announceArtwork() {
    const work = works[current];
    status.textContent = [ui(`Artwork ${current + 1} of ${works.length}`, `Werk ${current + 1} von ${works.length}`),
      text(work.title) || text(work.alt)].filter(Boolean).join('. ');
  }

  function announceUnavailable() {
    status.textContent = ui('Artwork image unavailable.', 'Das Werkbild ist nicht verfügbar.');
  }

  function show(index, entry) {
    current = index;
    artwork?.image.removeAttribute('id');
    artwork = entry;
    resetZoom();
    details?.remove();
    details = caption(works[index]);
    if (details) stage.append(details);

    const {image} = entry;
    image.id = 'viewer-artwork-image';
    if (image.alt) zoom.setAttribute('aria-describedby', image.id);
    else zoom.removeAttribute('aria-describedby');
    zoom.replaceChildren(image);
    zoom.hidden = !entry.ready;
    fit();
    announceArtwork();
    if (!entry.ready) {
      entry.loaded.then(ready => {
        if (artwork !== entry || !dialog.open) return;
        if (ready) fit();
        else announceUnavailable();
      });
    }
    preloadNearby();
  }

  function clearAdjacent() {
    adjacent.replaceChildren();
    adjacent.hidden = true;
    adjacent.removeAttribute('style');
  }

  function clearMotion() {
    animations?.forEach(animation => animation.cancel());
    animations = undefined;
    dragX = 0;
    zoom.style.removeProperty('transform');
    clearAdjacent();
  }

  function animateImages(from, sideFrom, sideTo) {
    zoom.style.removeProperty('transform');
    adjacent.style.removeProperty('transform');
    const animate = (element, start, end) => element.animate(
      [{transform: start}, {transform: end}],
      {duration: SLIDE_DURATION, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both'}
    );
    const effects = [animate(zoom, from, translate(0))];
    if (!adjacent.hidden) effects.push(animate(adjacent, sideFrom, sideTo));
    animations = effects;
    Promise.all(effects.map(effect => effect.finished)).then(() => {
      if (animations === effects) clearMotion();
    }, () => {}); // Interruption cancels the animations and clears their layers synchronously.
  }

  function restoreDrag() {
    if (reducedMotion.matches) clearMotion();
    else if (zoom.style.transform) {
      animateImages(zoom.style.transform, adjacent.style.transform,
        translate(-Math.sign(dragX) * fitted.viewWidth));
    }
  }

  function stepIndex(step) {
    return wrap((destination?.index ?? current) + step);
  }

  function slideTo(index, entry, step, offset) {
    const outgoing = fitted && !reducedMotion.matches ? artwork.image : undefined;
    const distance = step * (fitted?.viewWidth ?? 0);
    const {width, height, left, top} = zoom.style;
    clearMotion();
    show(index, entry);
    if (!outgoing) return;
    adjacent.append(outgoing);
    adjacent.hidden = false;
    Object.assign(adjacent.style, {width, height, left, top});
    animateImages(translate(distance + offset), translate(offset), translate(-distance));
  }

  function navigate(step, offset = 0) {
    const index = stepIndex(step);
    endDrag();
    if (index === current) {
      destination = undefined;
      restoreDrag();
      if (artwork?.ready) announceArtwork();
      return;
    }
    const entry = nearby.get(index) ?? prepare(index);
    const request = {index};
    destination = request;
    const arrive = (ready, startOffset) => {
      if (destination !== request || !dialog.open) return;
      if (ready) {
        destination = undefined;
        slideTo(index, entry, step, startOffset);
      } else {
        // Keep the displayed artwork and let another step move past the unavailable one.
        request.failed = true;
        announceUnavailable();
      }
    };
    if (entry.ready) arrive(true, offset);
    else {
      restoreDrag();
      entry.loaded.then(ready => arrive(ready, 0));
    }
  }

  function toggleZoom(clientX, clientY) {
    if (!fitted) return;
    destination = undefined;
    endDrag();
    clearMotion();
    const deviceScale = coarsePointer.matches ? MOBILE_ZOOM_SCALE : DESKTOP_ZOOM_SCALE;
    zoomScale = zoomScale === 1 ? deviceScale : 1;
    zoom.setAttribute('aria-pressed', String(zoomScale > 1));
    if (zoomScale === 1) {
      place(fitted.left, fitted.top);
      return;
    }

    const bounds = viewport.getBoundingClientRect();
    const x = clientX == null ? fitted.viewWidth / 2 : clientX - bounds.left;
    const y = clientY == null ? fitted.viewHeight / 2 : clientY - bounds.top;
    place(x - (x - fitted.left) * zoomScale, y - (y - fitted.top) * zoomScale);
  }

  zoom.addEventListener('click', event => {
    // Keyboard and assistive technology activate the button without a pointer gesture.
    if (!event.detail) toggleZoom();
  });

  viewport.addEventListener('pointerdown', event => {
    if (pointer && event.pointerType === 'touch' && !event.isPrimary) cancelDrag();
    if (pointer || !event.isPrimary || event.button !== 0 || !fitted) return;
    if (!destination?.failed) destination = undefined;
    clearMotion();
    pointer = {id: event.pointerId, x: event.clientX, y: event.clientY, position, moved: false,
      target: event.target, startTime: event.timeStamp};
    viewport.setPointerCapture(event.pointerId);
  });

  function trackPointer(event) {
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer.moved ||= Math.hypot(dx, dy) >= DRAG_THRESHOLD;
    if (pointer.moved && zoomScale > 1) {
      viewport.classList.add('dragging');
      place(pointer.position.left + dx, pointer.position.top + dy);
    } else if (pointer.moved && event.pointerType !== 'mouse') {
      pointer.axis ??= swipeAxis(dx, dy);
      if (!reducedMotion.matches) followSwipe(dx, dy);
    }
    return {dx, dy};
  }

  function followSwipe(dx, dy) {
    if (pointer.axis === 'y') {
      const limit = fitted.viewHeight / 2;
      zoom.style.transform = translate(0, Math.max(-limit, Math.min(limit, dy)));
    } else if (pointer.axis === 'x' && hasSteps) {
      const step = dx < 0 ? 1 : -1;
      const index = stepIndex(step);
      const entry = nearby.get(index);
      const width = fitted.viewWidth;
      if (index !== current && entry?.ready) {
        dragX = Math.max(-width, Math.min(width, dx));
        if (adjacent.firstElementChild !== entry.image) adjacent.replaceChildren(entry.image);
        adjacent.hidden = false;
        adjacent.style.transform = translate(dragX + step * width);
      } else {
        clearAdjacent();
        // Resist the swipe while the adjacent image is loading so the artwork stays visible.
        dragX = Math.max(-32, Math.min(32, dx / 4));
      }
      zoom.style.transform = translate(dragX);
    }
  }

  viewport.addEventListener('pointermove', event => {
    if (pointer?.id === event.pointerId) trackPointer(event);
  });

  // A native touch gesture can swallow the first gallery tap after a swipe closes the dialog.
  viewport.addEventListener('touchmove', event => {
    if (event.cancelable) event.preventDefault();
  }, {passive: false});

  viewport.addEventListener('pointerup', event => {
    if (pointer?.id !== event.pointerId) return;
    const {dx, dy} = trackPointer(event);
    const target = pointer.moved ? null : document.elementFromPoint(event.clientX, event.clientY);
    const tappedImage = zoom.contains(pointer.target) && zoom.contains(target);
    const clickedSide = target && target === pointer.target && event.pointerType === 'mouse'
      && (target === leftSide || target === rightSide);
    const axis = zoomScale === 1 && pointer.axis === swipeAxis(dx, dy) ? pointer.axis : undefined;
    const elapsed = event.timeStamp - pointer.startTime;
    endDrag();
    if (tappedImage) {
      toggleZoom(event.clientX, event.clientY);
    } else if (clickedSide) {
      navigate(target === leftSide ? -1 : 1);
    } else if (axis === 'y' && Math.abs(dy) >= VERTICAL_SWIPE_THRESHOLD) {
      closeViewer(true);
    } else if (axis === 'x' && hasSteps && completesHorizontalSwipe(dx, elapsed)) {
      navigate(dx < 0 ? 1 : -1, dragX);
    } else {
      restoreDrag();
    }
  });

  function endDrag() {
    // Capture is released by the browser after pointerup or pointercancel.
    pointer = undefined;
    viewport.classList.remove('dragging');
  }

  function cancelDrag() {
    endDrag();
    restoreDrag();
  }

  function closeViewer(fromPointer) {
    endDrag();
    clearMotion();
    if (fromPointer && opener) {
      // Native dialog restoration may carry the previous :focus-visible state.
      const trigger = opener;
      trigger.classList.add('viewer-pointer-focus');
      trigger.addEventListener('blur', () => trigger.classList.remove('viewer-pointer-focus'), {once: true});
    }
    dialog.close();
  }
  viewport.addEventListener('pointercancel', event => {
    if (pointer?.id === event.pointerId) cancelDrag();
  });
  viewport.addEventListener('lostpointercapture', event => {
    if (event.target === viewport && pointer?.id === event.pointerId) cancelDrag();
  });

  close.addEventListener('click', event => closeViewer(event.detail > 0));
  prev.addEventListener('click', () => navigate(-1));
  next.addEventListener('click', () => navigate(1));
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    endDrag();
    clearMotion();
    resetZoom();
    destination = undefined;
    artwork = undefined;
    nearby.clear();
    zoom.replaceChildren();
    opener?.focus({preventScroll: true});
    opener = undefined;
  });
  // Arrow shortcuts leave pointer-initiated focus alone. Tab restores visible focus within the dialog.
  dialog.addEventListener('pointerdown', () => dialog.classList.add('viewer-pointer-focus'));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') dialog.classList.remove('viewer-pointer-focus');
    if (!hasSteps || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const previous = event.key === 'ArrowLeft';
      if (details?.contains(event.target)) (previous ? prev : next).focus({preventScroll: true});
      navigate(previous ? -1 : 1);
    }
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) clearMotion();
  });
  new ResizeObserver(fit).observe(viewport);

  return {
    dialog,
    open(index, trigger, fromPointer) {
      opener = trigger;
      sideLayout = undefined;
      endDrag();
      clearMotion();
      destination = undefined;
      nearby.clear();
      dialog.classList.toggle('viewer-pointer-focus', fromPointer);
      // Record the gallery trigger for native restoration in browsers that don't focus clicked buttons.
      if (document.activeElement !== trigger) trigger.focus({preventScroll: true});
      dialog.showModal();
      show(index, prepare(index));
    }
  };
}
