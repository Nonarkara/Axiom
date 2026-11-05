// Chrome is visible edge-banded UI, not an off-screen sticky content rail.
export function chromeBudget({ width, height, bands, headers }) {
  const intervals = [];
  let headerH = 0;
  for (const rect of headers) {
    if (rect.visible === false) continue;
    if (rect.top <= 4 && rect.bottom > 0 && rect.right > 0 && rect.left < width) {
      headerH = Math.max(headerH, Math.min(height, rect.bottom) - Math.max(0, rect.top));
    }
  }
  if (headerH) intervals.push([0, headerH]);
  for (const rect of bands) {
    if (rect.visible === false) continue;
    const span = Math.min(width, rect.right) - Math.max(0, rect.left);
    const top = Math.max(0, rect.top);
    const bottom = Math.min(height, rect.bottom);
    if (bottom <= top || span < width * 0.8) continue;
    intervals.push([top, bottom]);
  }
  const merged = [];
  for (const interval of intervals.sort((a, b) => a[0] - b[0])) {
    const previous = merged.at(-1);
    if (previous && interval[0] <= previous[1] + 2) previous[1] = Math.max(previous[1], interval[1]);
    else merged.push([...interval]);
  }
  let chromeH = 0;
  for (const [top, bottom] of merged) {
    if (top <= 2 || bottom >= height - 2) chromeH += bottom - top;
  }
  return { chromeH: Math.round(chromeH), chromePct: +((chromeH / height) * 100).toFixed(1) };
}
