import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';

const footprintSource = readFileSync(new URL('../../public/footprint.js', import.meta.url), 'utf8');
const context = { window: {} };
runInNewContext(footprintSource, context);
const footprint = context.window.AXIOM_FOOTPRINT;
const footprintURL = 'https://github.com/Nonarkara/Axiom/blob/61374ed2dadf0e16a58735873bbfbc574d78848f/public/footprint.js';

// GeoNames independently locates the two administrative seats. They are only
// reference cities for provincial studies, never surveyed sites or province extents.
const seats = [
  { id: 'chiang-mai', point: [18.79038, 98.98468], source: 'https://www.geonames.org/1153671/chiang-mai.html', rdf: 'https://sws.geonames.org/1153671/about.rdf' },
  { id: 'nakhon-si-thammarat', point: [8.43333, 99.96667], source: 'https://www.geonames.org/1151933/nakhon-si-thammarat.html', rdf: 'https://sws.geonames.org/1151933/about.rdf' },
];
for (const seat of seats) {
  const anchor = footprint.stops.find(stop => stop.key === seat.id);
  if (!anchor || Math.abs(anchor.lat - seat.point[0]) > 0.01 || Math.abs(anchor.lng - seat.point[1]) > 0.01) throw new Error(`Research city reference disagrees with footprint: ${seat.id}`);
}

export const researchRegions = [
  { id: 'thailand', scope: 'national', kind: 'frame', nameKey: 'thailand', geometryKey: 'coarseFrame', bounds: footprint.coverage.thailand[0], source: footprintURL, sourceLabel: 'Axiom footprint · coarse national frame', precision: 'Coarse overview frame, not a country boundary or observation footprint.' },
  ...seats.map(seat => ({ ...seat, scope: 'provincial', kind: 'reference', nameKey: seat.id === 'chiang-mai' ? 'chiangMai' : 'nakhon', geometryKey: 'cityReference', sourceLabel: 'GeoNames · city reference', precision: 'Administrative-seat reference only; source coordinate precision is not a positional-accuracy guarantee. No provincial polygon or fieldwork location is asserted.', footprintReference: footprintURL })),
  { id: 'gulf', scope: 'regional', kind: 'frame', nameKey: 'gulf', geometryKey: 'analysisFrame', bounds: [[10, 24], [42, 65]], source: 'https://axiom.nonarkara.org/research/seeing-a-war-v1.pdf#page=4', sourceLabel: 'Seeing a War · p. 4, §4.4', precision: 'Published ADS-B analysis box, 10–42°N / 24–65°E. Not an exact boundary of the full study, the Gulf, fieldwork or conflict events.' },
];

export function geographyData() {
  const basemap = JSON.parse(readFileSync(new URL('./assets/basemap.geojson', import.meta.url), 'utf8'));
  return { regions: researchRegions, basemap, provenance: {
    retrieved: '2026-11-04',
    crs: 'EPSG:4326 (WGS84)',
    coordinateOrder: { basemap: 'longitude, latitude (GeoJSON)', regions: 'latitude, longitude (Leaflet reference points and frames)' },
    basemap: { source: basemap.source, sourceSHA256: basemap.sourceSHA256, license: basemap.license, scale: '1:110m', transformation: 'Selected 39 complete country features; original coordinates unchanged; properties reduced to country name. Context only, not study geography.' },
    footprint: { source: footprintURL, sourceSHA256: createHash('sha256').update(footprintSource).digest('hex'), use: 'Thailand coarse frame; independent city-reference cross-check within 0.01 degree.' },
    regionalFrame: { source: researchRegions.find(region => region.id === 'gulf').source, sourceSHA256: '5dbb9959067c7198d4ed3b776c25e1157df3d3e7ea4099de74c61a47c4ff2d5e' },
    cityReferences: seats.map(seat => ({ id: seat.id, source: seat.source, rdf: seat.rdf, sourceSHA256: createHash('sha256').update(readFileSync(new URL('./assets/' + seat.id + '.rdf', import.meta.url))).digest('hex'), point: seat.point, retrieved: '2026-11-04', license: 'GeoNames CC BY 4.0', meaning: 'Administrative seat only; not a field site or provincial boundary.' })),
  } };
}
