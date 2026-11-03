// A stale baseline cannot supply the missing cells of a failed fresh chunk.
export function assembleSpatialBaseline(seed, receipts, expectedRoutes) {
  const fresh = {};
  const reasons = { ...(seed?.reasons || {}) };
  for (const receipt of receipts) {
    const widths = receipt?.measuredWidths;
    if (!Array.isArray(widths) || !widths.length || !receipt.provenance?.measuredAt) {
      throw new Error('spatial chunk has no fresh measurement receipt');
    }
    for (const [route, cells] of Object.entries(receipt.routes || {})) {
      if (fresh[route]) throw new Error(`spatial route measured twice: ${route}`);
      const actual = Object.keys(cells).map(Number).sort((a, b) => a - b);
      if (JSON.stringify(actual) !== JSON.stringify([...widths].sort((a, b) => a - b))) {
        throw new Error(`spatial chunk is incomplete: ${route}`);
      }
      for (const [width, cell] of Object.entries(cells)) {
        if (cell.error || !Array.isArray(cell.findings) || !cell.chrome || !Number.isInteger(Number(width))) {
          throw new Error(`spatial cell is unreadable: ${route}@${width}`);
        }
      }
      fresh[route] = cells;
    }
    for (const [key, reason] of Object.entries(receipt.reasons || {})) {
      if (!reasons[key]) reasons[key] = reason;
    }
  }
  const missing = expectedRoutes.filter(route => !fresh[route]);
  const unexpected = Object.keys(fresh).filter(route => !expectedRoutes.includes(route));
  if (missing.length || unexpected.length) {
    throw new Error(`spatial coverage mismatch; missing: ${missing.join(', ')}; unexpected: ${unexpected.join(', ')}`);
  }
  const routes = { ...(seed?.routes || {}), ...fresh };
  const signatures = new Set(Object.values(routes).flatMap(cells =>
    Object.values(cells).flatMap(cell => (cell.findings || []).map(f => `${f.kind}|${f.sel}`))));
  const measuredWidths = [...new Set(Object.values(routes).flatMap(cells => Object.keys(cells).map(Number)))].sort((a, b) => a - b);
  return {
    version: 2, tool: 'spatial-law', widths: seed?.widths || [], measuredWidths,
    limits: seed?.limits || {},
    reasons: Object.fromEntries(Object.entries(reasons).filter(([key]) => signatures.has(key))),
    exempt: seed?.exempt || [],
    provenance: {
      measuredAt: new Date().toISOString(),
      measurements: Object.values(fresh).reduce((n, cells) => n + Object.keys(cells).length, 0),
      routes: expectedRoutes.length, widths: measuredWidths.length,
      measuredTogether: receipts.length === 1,
      carriedOver: Object.keys(routes).filter(route => !fresh[route]),
      parts: receipts.map(receipt => receipt.provenance),
    },
    routes,
  };
}
