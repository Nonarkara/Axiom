import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const PLATES_DEF = [
  {
    id: 'techhunt',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Nighthawks_by_Edward_Hopper_1942.jpg',
    artist: 'Edward Hopper',
    title: 'Nighthawks',
    year: '1942',
    collection: 'Art Institute of Chicago',
    licence: 'Public domain',
    why: 'The late-night diner on the corner where founders and nocturnal builders gather: 125 verified startups across seven domains hunted down and ranked by live market signal.',
    medium: 'oil on canvas'
  },
  {
    id: 'non',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg',
    artist: 'Vincent van Gogh',
    title: 'Self-Portrait',
    year: '1889',
    collection: "Musée d'Orsay, Paris",
    licence: 'Public domain',
    why: 'Anthropologist, architect, builder: the work starts by watching how a city actually behaves, then turning what was seen into an interface nobody needs a manual for.',
    medium: 'oil on canvas'
  },
  {
    id: 'poon',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_ProjectFXD.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_ProjectFXD.jpg',
    artist: 'Rembrandt van Rijn',
    title: 'Self-Portrait',
    year: '1659',
    collection: 'National Gallery of Art, Washington',
    licence: 'Public domain',
    why: 'Infrastructure, policy, and execution held to the city: a master plan co-authored, a bus predicted, and a country read as what it is — a complex adaptive system that has to keep working.',
    medium: 'oil on canvas'
  },
  {
    id: 'second-brain',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Hans_Holbein_d._J._-_Bildnis_des_schreibenden_Erasmus_von_Rotterdam%2C_1523.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Hans_Holbein_d._J._-_Bildnis_des_schreibenden_Erasmus_von_Rotterdam%2C_1523.jpg',
    artist: 'Hans Holbein the Younger',
    title: 'Portrait of Erasmus of Rotterdam Writing',
    year: '1523',
    collection: 'Kunstmuseum Basel',
    licence: 'Public domain',
    why: 'A humanist scholar at his desk annotating texts and linking ideas across volumes: your personal vault wired to every coding platform, notes indexed, and memory preserved.',
    medium: 'oil and tempera on panel'
  },
  {
    id: 'soccer',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Henri_Rousseau_-_The_Football_Players.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Henri_Rousseau_-_The_Football_Players.jpg',
    artist: 'Henri Rousseau',
    title: 'The Football Players',
    year: '1908',
    collection: 'Solomon R. Guggenheim Museum, New York',
    licence: 'Public domain',
    why: 'Players in striped jerseys passing and contesting space in dynamic rhythm: tactics desk, squad movements, and real-time match geometry laid out on one pitch.',
    medium: 'oil on canvas'
  },
  {
    id: 'each',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Massysm_Quentin_%E2%80%94_The_Moneylender_and_his_Wife_%E2%80%94_1514.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Massysm_Quentin_%E2%80%94_The_Moneylender_and_his_Wife_%E2%80%94_1514.jpg',
    artist: 'Quentin Matsys',
    title: 'The Moneylender and his Wife',
    year: '1514',
    collection: 'Musée du Louvre, Paris',
    licence: 'Public domain',
    why: 'Gold scales, open ledgers, coins, and records kept in strict balance: ERP, accounting ledgers, cash runway, and double-entry bookkeeping reconciled on one single screen.',
    medium: 'oil on panel'
  },
  {
    id: 'simcity',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Joseph_Stella%2C_1919-20%2C_Brooklyn_Bridge%2C_oil_on_canvas%2C_215.3_x_194.6_cm%2C_Yale_University_Art_Gallery.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Joseph_Stella,_1919-20,_Brooklyn_Bridge,_oil_on_canvas,_215.3_x_194.6_cm,_Yale_University_Art_Gallery.jpg',
    artist: 'Joseph Stella',
    title: 'Brooklyn Bridge',
    year: '1919–1920',
    collection: 'Yale University Art Gallery, New Haven',
    licence: 'Public domain',
    why: 'The steel lattice, glowing cables, and soaring infrastructure of a modern metropolis: real-site urban economics simulated block by block on OpenStreetMap.',
    medium: 'oil on canvas'
  },
  {
    id: 'miaoshen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Chinese_School_-_The_Bund_at_Shanghai_-_1995.61_-_World_Museum.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Chinese_School_-_The_Bund_at_Shanghai_-_1995.61_-_World_Museum.jpg',
    artist: 'Chinese School',
    title: 'The Bund at Shanghai',
    year: '19th century',
    collection: 'World Museum, Liverpool',
    licence: 'Public domain',
    why: 'The Huangpu riverfront and the historical Bund: still water running — the city read by someone standing at the water\'s edge, written as letters across three languages.',
    medium: 'oil on canvas'
  },
  {
    id: 'lcbcity',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/George_Bellows_-_Men_of_the_Docks_-_1912_-_The_National_Gallery.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:George_Bellows_-_Men_of_the_Docks_-_1912_-_The_National_Gallery.jpg',
    artist: 'George Bellows',
    title: 'Men of the Docks',
    year: '1912',
    collection: 'The National Gallery, London',
    licence: 'Public domain',
    why: 'Stevedores, heavy freight, and massive ocean-going hulls on the industrial waterfront: Laem Chabang\'s port corridors, lorry GPS telemetry, and container dwell times read as one working dock.',
    medium: 'oil on canvas'
  },
  {
    id: 'chula',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg',
    artist: 'Raphael',
    title: 'The School of Athens',
    year: '1509–1511',
    collection: 'Apostolic Palace, Vatican',
    licence: 'Public domain',
    why: 'The academy gathered under one vaulted geometry — philosophers, geometers, astronomers, and architects: forty-seven campus feeds unified under one roof for Siam\'s premier university.',
    medium: 'fresco'
  },
  {
    id: 'chonburi',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Turner_-_Rain%2C_Steam_and_Speed_-_National_Gallery_file.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Turner_-_Rain,_Steam_and_Speed_-_National_Gallery_file.jpg',
    artist: 'J.M.W. Turner',
    title: 'Rain, Steam, and Speed – The Great Western Railway',
    year: '1844',
    collection: 'The National Gallery, London',
    licence: 'Public domain',
    why: 'Locomotive power cutting through storm across the viaduct: Eastern Seaboard industrial arterial corridors, expressways, logistics flow, and heavy manufacturing moving at full speed.',
    medium: 'oil on canvas'
  },
  {
    id: 'kmitl',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Le_osservazioni_astronomiche_-_Giove.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Le_osservazioni_astronomiche_-_Giove.jpg',
    artist: 'Donato Creti',
    title: 'Astronomical Observations: Jupiter',
    year: '1711',
    collection: 'Pinacoteca Vaticana, Rome',
    licence: 'Public domain',
    why: 'A nocturnal observatory peering through optical telemetry into planetary orbits: Ladkrabang\'s aerospace, engineering towers, satellite telemetry, and signal grid monitored through the night.',
    medium: 'oil on canvas'
  },
  {
    id: 'phuket-bus',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Honor%C3%A9_Daumier_%28French%2C_Marseilles_1808%E2%80%931879_Valmondois%29_-_The_Third-Class_Carriage_-_Google_Art_Project.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Honor%C3%A9_Daumier_(French,_Marseilles_1808%E2%80%931879_Valmondois)_-_The_Third-Class_Carriage_-_Google_Art_Project.jpg',
    artist: 'Honoré Daumier',
    title: 'The Third-Class Carriage',
    year: 'c. 1862–1864',
    collection: 'The Metropolitan Museum of Art, New York',
    licence: 'Public domain',
    why: 'Passengers seated shoulder to shoulder on the public transit line: one passenger\'s phone, live GPS telemetry, and the exact second the next municipal bus pulls up to the curb.',
    medium: 'oil on canvas'
  },
  {
    id: 'nst',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Hanuman%2C_general_of_the_monkey_army_-_Museu_do_Oriente_-_Lisbon%2C_Portugal_-_DSC06728.JPG',
    source: 'https://commons.wikimedia.org/wiki/File:Hanuman,_general_of_the_monkey_army_-_Museu_do_Oriente_-_Lisbon,_Portugal_-_DSC06728.JPG',
    artist: 'Southern Thai Master Artisan',
    title: 'Nang Talung: Hanuman, General of the Monkey Army',
    year: '19th century',
    collection: 'Museu do Oriente, Lisbon',
    licence: 'CC0',
    why: 'The shadow puppet of Nakhon Si Thammarat cut from treated hide: Khao Luang and Pak Phanang basin, ancient Tambralinga, and thirty-plus civic feeds brought to light through silhouette and precision.',
    medium: 'carved and painted cowhide shadow puppet'
  },
  {
    id: 'phuket',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Bangkok_National_Library_2018-12-21_%2807%29.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Bangkok_National_Library_2018-12-21_(07).jpg',
    artist: 'Siamese Master Painter',
    title: 'The Royal Fleet Procession',
    year: '1887–1888',
    collection: 'National Library of Thailand, Bangkok',
    licence: 'CC0',
    why: 'Siamese royal fleet moving across open water, each vessel holding its exact position in formation: thirty-four Andaman feeds — maritime corridors, tourism vessels, weather, and safety — coordinated into one operational picture.',
    medium: 'tempera and gold leaf on cloth'
  },
  {
    id: 'o3',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Market_Scene_Thai_Folk_Painting_Rattanakosin.png',
    source: 'https://commons.wikimedia.org/wiki/File:Market_Scene_Thai_Folk_Painting_Rattanakosin.png',
    artist: 'Thai Folk Master',
    title: 'Market Scene in the Rattanakosin Kingdom',
    year: '19th century',
    collection: 'National Museum, Bangkok',
    licence: 'Public domain',
    why: 'Local community commerce, crafts, and produce traded openly: Thailand\'s 154,078 OTOP registry records across 77 provinces, each carrying its origin, provenance, and maker.',
    medium: 'watercolour on paper'
  }
];

const UA = 'AxiomReadingRoom/1.0 (https://axiom.nonarkara.org; dr-non@nonarkara.org)';

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

function getDimensions(filePath) {
  const out = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}"`, { encoding: 'utf8' });
  const w = out.match(/pixelWidth:\s*(\d+)/)?.[1];
  const h = out.match(/pixelHeight:\s*(\d+)/)?.[1];
  return { width: parseInt(w, 10), height: parseInt(h, 10) };
}

async function main() {
  const platesFile = path.resolve('axiomx/plates.js');
  let platesJs = fs.readFileSync(platesFile, 'utf8');

  for (const item of PLATES_DEF) {
    console.log(`\nProcessing ${item.id} (${item.title})...`);
    const ext = item.url.endsWith('.png') ? '.png' : '.jpg';
    const tmpSrc = `/tmp/raw_${item.id}${ext}`;
    const targetWebp = path.resolve(`axiomx/art/${item.id}.webp`);

    if (!fs.existsSync(tmpSrc)) {
      console.log(`  Downloading ${item.url}...`);
      await download(item.url, tmpSrc);
    }

    const { width: rawW, height: rawH } = getDimensions(tmpSrc);
    console.log(`  Raw dimensions: ${rawW} x ${rawH}`);

    // If max dimension exceeds 1600, scale down to 1600 on longest side
    let scaleFlag = '';
    if (rawW > 1600 || rawH > 1600) {
      if (rawW >= rawH) {
        scaleFlag = '-resize 1600 0';
      } else {
        scaleFlag = '-resize 0 1600';
      }
    }

    // Convert with cwebp
    execSync(`cwebp -q 88 ${scaleFlag} "${tmpSrc}" -o "${targetWebp}"`);
    const { width: finalW, height: finalH } = getDimensions(targetWebp);
    console.log(`  Final WebP dimensions: ${finalW} x ${finalH}`);

    // Build the 10-field array for plates.js
    const tuple = [
      JSON.stringify(item.artist),
      JSON.stringify(item.title),
      JSON.stringify(item.year),
      JSON.stringify(item.collection),
      JSON.stringify(item.source),
      JSON.stringify(item.licence),
      JSON.stringify(item.why),
      JSON.stringify(String(finalW)),
      JSON.stringify(String(finalH)),
      JSON.stringify(item.medium),
    ];
    const newEntry = `"${item.id}": [${tuple.join(',')}],`;

    // Regex replace or insert
    const regex = new RegExp(`"${item.id}":\\s*\\[[^\\]]+\\],?`);
    if (regex.test(platesJs)) {
      platesJs = platesJs.replace(regex, newEntry);
      console.log(`  Replaced ${item.id} in plates.js`);
    } else {
      console.warn(`  Warning: ${item.id} not found in plates.js`);
    }
  }

  fs.writeFileSync(platesFile, platesJs, 'utf8');
  console.log('\nUpdated axiomx/plates.js successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
