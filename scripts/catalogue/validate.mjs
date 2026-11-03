import { SITE_LOCALES, STATUS } from './lib.mjs';

function fail(system, field, reason) {
  throw new Error(`catalogue ${system.id || '(unnamed)'}.${field}: ${reason}`);
}

function destination(system, field, value) {
  // Reject characters that URL() would silently normalize or HTML would parse.
  if (typeof value !== 'string' || !/^https:\/\//i.test(value)
      || /[\s\u0000-\u001f\u007f<>"'`\\]/.test(value)) {
    fail(system, field, 'expected an absolute HTTPS URL without whitespace or markup');
  }
  let url;
  try { url = new URL(value); } catch { fail(system, field, 'invalid URL'); }
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) {
    fail(system, field, 'expected HTTPS without credentials');
  }
}

function imagePath(system, field, value) {
  if (typeof value !== 'string'
      || !/^[A-Za-z0-9_./ -]+\.(?:png|jpe?g|webp|gif|avif)$/i.test(value)
      || /[\u0000-\u001f\u007f]/.test(value)
      || value.split('/').some((part) => !part || part === '.' || part === '..')) {
    fail(system, field, 'expected a local relative image path without traversal or URL syntax');
  }
}

/** Validate the complete input before any builder can emit an artefact. */
export function validateCatalogue(catalogue) {
  const systems = catalogue?.systems?.systems;
  if (!Array.isArray(systems) || !systems.length) {
    throw new Error('catalogue systems: expected a non-empty array');
  }
  for (const system of systems) {
    if (!system || typeof system !== 'object' || Array.isArray(system)) {
      throw new Error('catalogue system: expected an object');
    }
    if (Object.hasOwn(system, 'full')
        && (typeof system.full !== 'boolean' || system.full !== true)) {
      fail(system, 'full', 'expected boolean true or absent');
    }
    for (const field of ['id', 'panelsKey', 'catKey']) {
      if (typeof system[field] !== 'string' || !system[field] || /[^A-Za-z0-9_-]/.test(system[field])) {
        fail(system, field, 'expected an identifier');
      }
    }
    if (system.domId != null
        && (typeof system.domId !== 'string' || !system.domId || /[^A-Za-z0-9_-]/.test(system.domId))) {
      fail(system, 'domId', 'expected an identifier or null');
    }
    if (!['link', 'soon', 'editions'].includes(system.variant)) {
      fail(system, 'variant', 'expected link, soon or editions');
    }
    if (!Object.hasOwn(STATUS, system.status)) fail(system, 'status', 'unknown status');
    if (system.variant === 'soon') {
      if (system.href != null && system.href !== '') {
        fail(system, 'href', 'soon entries cannot have a destination');
      }
    } else {
      destination(system, 'href', system.href);
    }
    if (system.variant === 'editions') {
      if (!system.edition || typeof system.edition !== 'object' || Array.isArray(system.edition)) {
        fail(system, 'edition', 'editions entries require edition data');
      }
      destination(system, 'edition.href', system.edition.href);
      if (system.edition.key !== `panels.${system.panelsKey}.original`) {
        fail(system, 'edition.key', 'must match the original-version copy key');
      }
      for (const locale of SITE_LOCALES) {
        if (typeof system.copy?.[locale]?.original !== 'string' || !system.copy[locale].original.trim()) {
          fail(system, `copy.${locale}.original`, 'edition link requires a label');
        }
      }
    } else if (system.edition != null) {
      fail(system, 'edition', 'only editions entries can have edition data');
    }
    if (!system.image || typeof system.image !== 'object' || Array.isArray(system.image)) {
      fail(system, 'image', 'expected image data');
    }
    imagePath(system, 'image.src', system.image.src);
    if (system.image.webp != null) {
      imagePath(system, 'image.webp', system.image.webp);
      if (!/\.webp$/i.test(system.image.webp) || /\s/.test(system.image.webp)) {
        fail(system, 'image.webp', 'expected one WebP srcset path without whitespace');
      }
    }
    if (system.image.crop != null && !['lower', 'middle'].includes(system.image.crop)) {
      fail(system, 'image.crop', 'expected lower, middle or null');
    }
    const { width, height } = system.image;
    if (width != null || height != null) {
      if (![width, height].every((n) => Number.isSafeInteger(n) && n > 0)) {
        fail(system, 'image dimensions', 'expected paired positive integers or no dimensions');
      }
    }
  }
}
