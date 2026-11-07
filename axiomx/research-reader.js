// Loaded only after a reader explicitly requests a paper.
export function createReader(root, getCopy) {
  const dialog = root.querySelector('[data-research-reader]');
  const find = selector => dialog.querySelector(selector);
  const sheet = find('[data-reader-sheet]');
  const viewportNode = find('[data-reader-viewport]');
  const status = find('[data-reader-status]');
  const pageInput = find('[data-reader-page]');
  let enginePromise;
  let loadingTask;
  let documentPDF;
  let renderTask;
  let textLayer;
  let abort;
  let opener;
  let generation = 0;
  let rendering = 0;
  let pageNumber = 1;
  let zoom = 1;
  let resizeFrame;

  function controls() {
    const ready = !!documentPDF;
    pageInput.disabled = !ready;
    pageInput.value = pageNumber;
    pageInput.max = ready ? documentPDF.numPages : 1;
    find('[data-reader-total]').textContent = ready ? '/ ' + documentPDF.numPages : '';
    find('[data-reader-previous]').disabled = !ready || pageNumber <= 1;
    find('[data-reader-next]').disabled = !ready || pageNumber >= documentPDF.numPages;
    find('[data-reader-fit]').disabled = !ready;
    find('[data-reader-zoom-in]').disabled = !ready || zoom >= 3;
    find('[data-reader-zoom-out]').disabled = !ready || zoom <= 0.75;
    find('[data-reader-scale]').textContent = ready ? Math.round(zoom * 100) + '%' : '';
  }
  function release() {
    generation++;
    rendering++;
    abort?.abort();
    renderTask?.cancel();
    textLayer?.cancel();
    if (loadingTask) loadingTask.destroy().catch(error => console.warn('Paper reader cleanup:', error));
    loadingTask = null;
    documentPDF = null;
    renderTask = null;
    textLayer = null;
    sheet.replaceChildren();
    cancelAnimationFrame(resizeFrame);
  }
  function close() {
    if (dialog.open) dialog.close();
  }
  function onClose() {
    release();
    delete dialog.dataset.readerState;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  }
  async function render() {
    if (!documentPDF || !dialog.open) return;
    const current = ++rendering;
    const currentGeneration = generation;
    renderTask?.cancel();
    textLayer?.cancel();
    dialog.dataset.readerState = 'loading';
    status.hidden = false;
    status.textContent = getCopy().loading;
    controls();
    try {
      const pdfPage = await documentPDF.getPage(pageNumber);
      if (current !== rendering || currentGeneration !== generation) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const available = Math.max(180, viewportNode.clientWidth - 32);
      const viewport = pdfPage.getViewport({ scale: available / base.width * zoom });
      const density = Math.min(devicePixelRatio || 1, 2, Math.sqrt(8000000 / (viewport.width * viewport.height)));
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      canvas.width = Math.floor(viewport.width * density);
      canvas.height = Math.floor(viewport.height * density);
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';
      const text = document.createElement('div');
      text.className = 'textLayer';
      text.style.setProperty('--total-scale-factor', viewport.scale);
      sheet.style.width = viewport.width + 'px';
      sheet.style.height = viewport.height + 'px';
      sheet.replaceChildren(canvas, text);
      viewportNode.scrollTo(0, 0);
      renderTask = pdfPage.render({ canvasContext: canvas.getContext('2d'), viewport,
        transform: [density, 0, 0, density, 0, 0] });
      await renderTask.promise;
      if (current !== rendering || currentGeneration !== generation) return;
      const engine = await enginePromise;
      textLayer = new engine.TextLayer({ textContentSource: await pdfPage.getTextContent(), container: text, viewport });
      await textLayer.render();
      if (current !== rendering || currentGeneration !== generation) return;
      dialog.dataset.readerState = 'ready';
      status.hidden = true;
    } catch (error) {
      if (current !== rendering || currentGeneration !== generation || error.name === 'RenderingCancelledException') return;
      dialog.dataset.readerState = 'error';
      status.hidden = false;
      status.textContent = getCopy().readerError;
      sheet.replaceChildren();
    }
  }
  async function open(paper, trigger) {
    release();
    const current = generation;
    opener = trigger;
    pageNumber = 1;
    zoom = 1;
    find('#research-reader-title').textContent = paper.title;
    viewportNode.setAttribute('aria-label', paper.title);
    find('[data-reader-open]').href = paper.pdf;
    dialog.dataset.readerState = 'loading';
    status.textContent = getCopy().loading;
    status.hidden = false;
    controls();
    if (!dialog.open) dialog.showModal();
    find('[data-reader-close]').focus({ preventScroll: true });
    abort = new AbortController();
    try {
      enginePromise ||= import('./vendor/pdfjs-6.5.438/pdf.mjs');
      const engine = await enginePromise;
      if (current !== generation) return;
      engine.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs-6.5.438/pdf.worker.mjs', import.meta.url).href;
      const canonical = new URL(paper.pdf, location.href);
      if (!canonical.pathname.startsWith('/research/') || !canonical.pathname.endsWith('.pdf')) throw new Error('No verified local preview');
      const url = new URL(canonical.pathname, location.origin);
      const response = await fetch(url, { signal: abort.signal });
      if (!response.ok) throw new Error('Paper unavailable');
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length > 25000000 || new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-') throw new Error('Not PDF bytes');
      if (paper.sha256) {
        const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
        const hash = Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('');
        if (hash !== paper.sha256) throw new Error('Paper integrity mismatch');
      }
      if (current !== generation) return;
      loadingTask = engine.getDocument({ data: bytes, isEvalSupported: false, useWasm: false,
        cMapUrl: new URL('./vendor/pdfjs-6.5.438/cmaps/', import.meta.url).href, cMapPacked: true,
        standardFontDataUrl: new URL('./vendor/pdfjs-6.5.438/standard_fonts/', import.meta.url).href });
      documentPDF = await loadingTask.promise;
      if (current !== generation) return;
      await render();
    } catch (error) {
      if (current !== generation || error.name === 'AbortError') return;
      dialog.dataset.readerState = 'error';
      status.hidden = false;
      status.textContent = getCopy().readerError;
    }
  }
  function go(number) {
    if (!documentPDF) return;
    pageNumber = Math.max(1, Math.min(documentPDF.numPages, Number.isFinite(number) ? Math.round(number) : pageNumber));
    render();
  }
  function onClick(event) {
    if (event.target.closest('[data-reader-close]')) close();
    else if (event.target.closest('[data-reader-previous]')) go(pageNumber - 1);
    else if (event.target.closest('[data-reader-next]')) go(pageNumber + 1);
    else if (event.target.closest('[data-reader-fit]')) { zoom = 1; render(); }
    else if (event.target.closest('[data-reader-zoom-in]')) { zoom = Math.min(3, zoom + 0.25); render(); }
    else if (event.target.closest('[data-reader-zoom-out]')) { zoom = Math.max(0.75, zoom - 0.25); render(); }
  }
  function onKey(event) {
    event.stopPropagation();
    if (event.key === 'Escape') { event.preventDefault(); close(); }
  }
  function onPage() { go(Number(pageInput.value)); }
  function onCancel(event) { event.preventDefault(); close(); }
  dialog.addEventListener('click', onClick);
  dialog.addEventListener('keydown', onKey);
  dialog.addEventListener('cancel', onCancel);
  dialog.addEventListener('close', onClose);
  pageInput.addEventListener('change', onPage);
  let previousWidth = 0;
  const resize = new ResizeObserver(() => {
    const width = viewportNode.clientWidth;
    if (width !== previousWidth) {
      previousWidth = width;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => { if (dialog.open && documentPDF) render(); });
    }
  });
  resize.observe(viewportNode);
  return { open, destroy() {
    close(); release(); resize.disconnect();
    dialog.removeEventListener('click', onClick);
    dialog.removeEventListener('keydown', onKey);
    dialog.removeEventListener('cancel', onCancel);
    dialog.removeEventListener('close', onClose);
    pageInput.removeEventListener('change', onPage);
  } };
}
