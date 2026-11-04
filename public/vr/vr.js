/* ============================================================
   vr.nonarkara.org — fictional football points demonstration
   Three.js 3D scene: football pitch with column bars.
   Column height = points. Click a bar to open the table panel.
   ============================================================ */

(async function () {
  'use strict';

  /* Invented demonstration values, not sourced league standings. */
  const teams = [...document.querySelectorAll('#vrTableBody tr')].map((row) => ({
    abbr: row.dataset.abbr,
    color: row.dataset.color,
    name: row.cells[1].textContent,
    played: Number(row.cells[2].textContent),
    pts: Number(row.cells[6].textContent),
  }));

  /* The semantic table remains usable even if the module or WebGL fails. */
  const panel = document.getElementById('vrTable');
  const closeBtn = document.querySelector('.vr-table__close');
  const toggle = document.getElementById('vrTableToggle');
  const tableBody = document.getElementById('vrTableBody');
  const tableNote = document.getElementById('vrTableNote');
  const status = document.getElementById('vrStatus');
  let selectedIndex = null;
  let updateSelection = () => {};
  let returnFocus = toggle;

  [...tableBody.rows].forEach((row, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.team = i;
    button.textContent = teams[i].name;
    row.cells[1].replaceChildren(button);
  });

  function openTable(idx = selectedIndex, source = document.activeElement) {
    if (!panel.classList.contains('vr-table--open')) returnFocus = source;
    if (idx !== null) {
      selectedIndex = idx;
      const team = teams[idx];
      tableBody.querySelectorAll('tr').forEach((row, i) => {
        row.classList.toggle('vr-table__row--active', i === idx);
        row.querySelector('button').setAttribute('aria-pressed', String(i === idx));
      });
      tableNote.textContent = `Fictional demonstration: ${team.name} — ${team.pts} points from ${team.played} invented matches.`;
      updateSelection(idx);
    }
    panel.inert = false;
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('vr-table--open');
    toggle.setAttribute('aria-expanded', 'true');
    closeBtn.focus({ preventScroll: true });
  }

  function closeTable() {
    panel.classList.remove('vr-table--open');
    panel.inert = true;
    panel.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    selectedIndex = null;
    updateSelection(null);
    returnFocus?.focus({ preventScroll: true });
  }

  closeBtn.hidden = false;
  closeBtn.addEventListener('click', closeTable);
  toggle.addEventListener('click', () => panel.inert ? openTable() : closeTable());
  tableBody.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-team]');
    if (button) openTable(Number(button.dataset.team));
  });
  document.querySelector('a[href="#vrTable"]').addEventListener('click', (event) => {
    event.preventDefault();
    openTable();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.inert) closeTable();
  });

  try {
  const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
  /* ── Three.js setup ── */
  const canvas = document.getElementById('vrCanvas');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(0, 28, 70);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  /* ── Lighting ── */
  const hemi = new THREE.HemisphereLight(0x88ccff, 0x222222, 0.6);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(30, 60, 30);
  dir.castShadow = true;
  dir.shadow.mapSize.width = 2048;
  dir.shadow.mapSize.height = 2048;
  dir.shadow.camera.left = -60;
  dir.shadow.camera.right = 60;
  dir.shadow.camera.top = 60;
  dir.shadow.camera.bottom = -60;
  scene.add(dir);

  const fill = new THREE.PointLight(0x446688, 0.4);
  fill.position.set(-30, 20, -30);
  scene.add(fill);

  /* ── Football pitch ── */
  const pitchGeo = new THREE.PlaneGeometry(120, 90);
  const pitchMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.9, metalness: 0.1 });
  const pitch = new THREE.Mesh(pitchGeo, pitchMat);
  pitch.rotation.x = -Math.PI / 2;
  pitch.receiveShadow = true;
  scene.add(pitch);

  /* Pitch lines (hairline white) */
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x3a6b4a });
  const lineGeo = (w, h) => new THREE.BoxGeometry(w, 0.05, h);

  /* Outer boundary */
  const boundary = new THREE.Mesh(lineGeo(120, 1), lineMat);
  boundary.position.set(0, 0.06, -45);
  scene.add(boundary);

  const boundary2 = boundary.clone();
  boundary2.position.set(0, 0.06, 45);
  scene.add(boundary2);

  const boundary3 = new THREE.Mesh(lineGeo(1, 90), lineMat);
  boundary3.position.set(-60, 0.06, 0);
  scene.add(boundary3);

  const boundary4 = boundary3.clone();
  boundary4.position.set(60, 0.06, 0);
  scene.add(boundary4);

  /* Center circle */
  const centerCurve = new THREE.EllipseCurve(0, 0, 9, 9, 0, 2 * Math.PI, false, 0);
  const centerPts = centerCurve.getPoints(64);
  const centerGeo = new THREE.BufferGeometry().setFromPoints(centerPts);
  const centerLine = new THREE.LineLoop(centerGeo, lineMat);
  centerLine.position.set(0, 0.07, 0);
  centerLine.rotation.x = -Math.PI / 2;
  scene.add(centerLine);

  /* Center spot */
  const spotGeo = new THREE.CircleGeometry(0.6, 12);
  const spot = new THREE.Mesh(spotGeo, lineMat);
  spot.position.set(0, 0.08, 0);
  spot.rotation.x = -Math.PI / 2;
  scene.add(spot);

  /* ── Column bars (one per team, arranged in an arc) ── */
  const bars = [];
  const barGroup = new THREE.Group();
  scene.add(barGroup);

  const maxPts = Math.max(...teams.map((t) => t.pts));
  const barMaxHeight = 14;
  const radius = 46;
  const arcStart = -Math.PI * 0.42;
  const arcEnd = Math.PI * 0.42;

  teams.forEach((team, i) => {
    const frac = i / (teams.length - 1);
    const angle = arcStart + frac * (arcEnd - arcStart);
    const x = Math.sin(angle) * radius;
    const z = -Math.cos(angle) * radius + 24;

    const height = (team.pts / maxPts) * barMaxHeight;

    const geo = new THREE.BoxGeometry(2.6, height, 2.6);
    const mat = new THREE.MeshStandardMaterial({ color: team.color, roughness: 0.6, metalness: 0.2 });
    const bar = new THREE.Mesh(geo, mat);
    bar.position.set(x, height / 2, z);
    bar.castShadow = true;
    bar.receiveShadow = true;
    bar.userData = { team, abbr: team.abbr, index: i };
    barGroup.add(bar);
    bars.push(bar);

    /* Team label (Sprite) above bar */
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 256;
    labelCanvas.height = 96;
    const ctx = labelCanvas.getContext('2d');
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 256, 96);
    ctx.fillStyle = '#faf9f7';
    ctx.font = 'bold 40px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(team.abbr, 128, 48);
    const tex = new THREE.CanvasTexture(labelCanvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(x, height + 2.5, z);
    sprite.scale.set(4.4, 1.6, 1);
    sprite.userData = { team, abbr: team.abbr, index: i };
    barGroup.add(sprite);
    bars.push(sprite);
  });

  /* ── Selection ring on pitch ── */
  const ringGeo = new THREE.RingGeometry(2.2, 2.8, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xe2b540, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.set(0, 0.09, 0);
  ring.rotation.x = -Math.PI / 2;
  ring.visible = false;
  scene.add(ring);

  /* ── Raycaster for interaction ── */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function onClick(event) {
    onPointerMove(event);
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(bars.filter((b) => b.isMesh));
    if (intersects.length > 0) {
      const bar = intersects[0].object;
      const idx = bar.userData.index;
      openTable(idx, canvas);
    } else if (!panel.inert) {
      closeTable();
    }
  }

  canvas.addEventListener('click', onClick);

  /* Hover: tint bars slightly */
  function onHover(event) {
    onPointerMove(event);
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(bars.filter((b) => b.isMesh));
    bars.forEach((b) => {
      if (!b.isMesh) return;
      if (intersects.length > 0 && intersects[0].object === b) {
        b.material.emissive.set(0x111111);
      } else {
        b.material.emissive.set(0x000000);
      }
    });
    render();
  }
  canvas.addEventListener('pointermove', onHover);

  updateSelection = (idx) => {
    bars.filter((b) => b.isMesh).forEach((bar) => {
      bar.material.emissive.set(bar.userData.index === idx ? 0x333333 : 0x000000);
    });
    const bar = bars.find((b) => b.isMesh && b.userData.index === idx);
    if (bar) {
      ring.position.copy(bar.position);
      ring.position.y = 0.09;
      ring.visible = true;
    } else {
      ring.visible = false;
    }
    render();
  };

  canvas.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    const delta = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    openTable(((selectedIndex ?? 0) + delta + teams.length) % teams.length, canvas);
  });

  // Render only on input/resize; no autoplay, drift or hidden-page loop.
  function render() {
    if (!document.hidden) renderer.render(scene, camera);
  }

  /* ── Resize ── */
  function onResize() {
    const { width, height } = canvas.getBoundingClientRect();
    camera.aspect = width / height;
    const distance = Math.max(100, 125 / camera.aspect);
    camera.position.set(0, distance * 0.65, distance);
    camera.lookAt(0, 4, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  }
  const observer = new ResizeObserver(onResize);
  observer.observe(canvas);
  document.addEventListener('visibilitychange', render);
  window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
  window.addEventListener('pageshow', () => observer.observe(canvas));

  /* ── Start ── */
  onResize();
  canvas.dataset.ready = 'true';
  status.textContent = 'Interactive 3D scene. Fictional demonstration.';
  closeTable();
  } catch (error) {
    status.textContent = '3D unavailable. Fictional standings remain available in the table.';
    console.warn('3D demonstration unavailable:', error);
  }
})();
