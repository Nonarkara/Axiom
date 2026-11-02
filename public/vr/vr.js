/* ============================================================
   vr.nonarkara.org — Premier League 2026-27 VR table
   Three.js 3D scene: football pitch with column bars.
   Column height = points. Click a bar to open the table panel.
   ============================================================ */

(function () {
  'use strict';

  /* ── Premier League 2026-27 table (representative) ── */
  /* Column height = points. 20 teams, 50 played matches. */
  const teams = [
    { abbr: 'MCI', name: 'Manchester City', pts: 95, played: 50, color: '#00247d' },
    { abbr: 'ARS', name: 'Arsenal', pts: 89, played: 50, color: '#a51931' },
    { abbr: 'LIV', name: 'Liverpool', pts: 86, played: 50, color: '#c41e3a' },
    { abbr: 'CHE', name: 'Chelsea', pts: 78, played: 50, color: '#034694' },
    { abbr: 'MUN', name: 'Man Utd', pts: 74, played: 50, color: '#da291c' },
    { abbr: 'TOT', name: 'Tottenham', pts: 71, played: 50, color: '#132257' },
    { abbr: 'NEW', name: 'Newcastle', pts: 66, played: 50, color: '#241f20' },
    { abbr: 'AST', name: 'Aston Villa', pts: 64, played: 50, color: '#670e36' },
    { abbr: 'BHA', name: 'Brighton', pts: 62, played: 50, color: '#0057ba' },
    { abbr: 'FUL', name: 'Fulham', pts: 59, played: 50, color: '#000000' },
    { abbr: 'CRY', name: 'Crystal Palace', pts: 57, played: 50, color: '#4b923d' },
    { abbr: 'BRE', name: 'Brentford', pts: 56, played: 50, color: '#e30613' },
    { abbr: 'EVE', name: 'Everton', pts: 53, played: 50, color: '#27346a' },
    { abbr: 'WHU', name: 'West Ham', pts: 51, played: 50, color: '#7a263a' },
    { abbr: 'BOU', name: 'Bournemouth', pts: 49, played: 50, color: '#da331d' },
    { abbr: 'IPS', name: 'Ipswich', pts: 47, played: 50, color: '#0033a0' },
    { abbr: 'WOL', name: 'Wolves', pts: 45, played: 50, color: '#e64e1f' },
    { abbr: 'LEI', name: 'Leicester', pts: 44, played: 50, color: '#00247d' },
    { abbr: 'SOU', name: 'Southampton', pts: 39, played: 50, color: '#d71920' },
    { abbr: 'LEE', name: 'Leeds', pts: 38, played: 50, color: '#ffcd00' },
  ];

  /* ── Three.js setup ── */
  const canvas = document.getElementById('vrCanvas');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  scene.fog = new THREE.Fog(0x0a0a0a, 40, 140);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(0, 28, 70);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
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
  boundary.rotation.x = -Math.PI / 2;
  scene.add(boundary);

  const boundary2 = boundary.clone();
  boundary2.position.set(0, 0.06, 45);
  scene.add(boundary2);

  const boundary3 = new THREE.Mesh(lineGeo(1, 90), lineMat);
  boundary3.position.set(-60, 0.06, 0);
  boundary3.rotation.x = -Math.PI / 2;
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
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius - 18;

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
    sprite.scale.set(2.6, 0.9, 1);
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

  let selectedIndex = null;

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onClick() {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(bars.filter((b) => b.isMesh));
    if (intersects.length > 0) {
      const bar = intersects[0].object;
      const idx = bar.userData.index;
      selectTeam(idx);
    }
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('click', onClick);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('click', onClick);

  /* Hover: tint bars slightly */
  function onHover() {
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
  }
  window.addEventListener('pointermove', onHover);
  canvas.addEventListener('pointermove', onHover);

  function selectTeam(idx) {
    selectedIndex = idx;
    const team = teams[idx];
    const bar = bars.find((b) => b.isMesh && b.userData.index === idx);
    if (bar) {
      ring.position.copy(bar.position);
      ring.position.y = 0.09;
      ring.visible = true;
    }
    openTable(idx);
  }

  /* ── Table panel ── */
  const panel = document.getElementById('vrTable');
  const panelInner = document.getElementById('vrTableInner');
  const closeBtn = document.querySelector('.vr-table__close');
  const tableBody = document.getElementById('vrTableBody');
  const tableNote = document.getElementById('vrTableNote');

  function renderTable(highlightIdx) {
    tableBody.innerHTML = teams
      .map(
        (t, i) => `
        <tr${i === highlightIdx ? ' class="vr-table__row--active"' : ''}>
          <td>${i + 1}</td>
          <td>${t.abbr}</td>
          <td>${t.played}</td>
          <td>—</td>
          <td>—</td>
          <td>—</td>
          <td>${t.pts}</td>
        </tr>`
      )
      .join('');
    const t = teams[highlightIdx];
    tableNote.textContent = `${t.name} — ${t.pts} points from ${t.played} matches. Column height = points.`;
  }

  function openTable(idx) {
    renderTable(idx);
    panel.classList.add('vr-table--open');
  }

  function closeTable() {
    panel.classList.remove('vr-table--open');
    ring.visible = false;
    selectedIndex = null;
  }

  closeBtn.addEventListener('click', closeTable);

  /* Click canvas background closes table */
  canvas.addEventListener('click', () => {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (target === canvas || target.parentElement === canvas) closeTable();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTable();
  });

  /* ── Animation loop ── */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    /* Gentle camera drift */
    camera.position.x = Math.sin(t * 0.15) * 4;
    camera.lookAt(0, 0, 0);

    /* Subtle pulse on selected bar */
    if (selectedIndex !== null) {
      const bar = bars.find((b) => b.isMesh && b.userData.index === selectedIndex);
      if (bar) {
        const s = 1 + Math.sin(t * 3) * 0.02;
        bar.scale.set(s, s, s);
      }
    }

    renderer.render(scene, camera);
  }

  /* ── Resize ── */
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  /* ── Start ── */
  renderTable(0);
  animate();
})();
