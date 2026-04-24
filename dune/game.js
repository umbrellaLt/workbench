/* =====================================================
   DUNE — Amiga 1992 Web Remake
   ===================================================== */

// ── DATA ──────────────────────────────────────────────

const SIETCHES = [
  { id:0, name:'Sietch Tabr',        x:130, y:168, leader:'Stilgar',   emoji:'🏜️', fremen:80, phase:1,
    intro:'Stilgar eyes you with suspicion. "You are not Fremen... yet. Prove yourself worthy of the desert."' },
  { id:1, name:'Tuono Sietch',       x:72,  y:108, leader:'Turok',     emoji:'🪨', fremen:40, phase:1,
    intro:'Turok bows slightly. "We have heard of the Atreides. The Harkonnen are our enemies too."' },
  { id:2, name:'Cave of Birds',      x:175, y:255, leader:'Jamis',     emoji:'⚔️', fremen:55, phase:2,
    intro:'"Jamis challenges any outsider," the Fremen warn. After a ritual knife fight, respect is earned.' },
  { id:3, name:'Red Chasm',          x:305, y:195, leader:'Otheym',    emoji:'🌅', fremen:65, phase:2,
    intro:'Otheym greets you warmly. "Muad\'Dib\'s reputation precedes him. We will fight with you."' },
  { id:4, name:'Habbanya Ridge',     x:90,  y:282, leader:'Chani',     emoji:'👁️', fremen:70, phase:3,
    intro:'Chani\'s blue eyes study you. "You dream the future, Paul-Muad\'Dib. Lead us to that future."' },
  { id:5, name:'Sietch Gara Kulon',  x:258, y:130, leader:'Liet-Kynes',emoji:'🌱', fremen:90, phase:3,
    intro:'The planetologist smiles. "Arrakis shall be green one day. But first, it must be free."' },
];

const CHARACTERS = [
  { id:'leto',    name:'Duke Leto',     title:'Head of House Atreides', emoji:'⚜️',
    color:'#3A6020', availUntilDay:16, availFromDay:1,
    dialogs: [
      'We have arrived on Arrakis, my son. The spice must flow — the Emperor demands it. Find the Fremen people. They are the key to our survival here.',
      'Our position grows stronger. But the Harkonnen watch us closely. Every sietch you bring to our cause weakens them.',
      'I have heard whispers of a traitor in our midst. Be vigilant, Paul. Trust your instincts above all.',
      '"Paul..." the Duke\'s voice is low. "If something should happen to me — your mother will guide you. The Fremen will shelter you. Become one of them."',
    ]
  },
  { id:'jessica', name:'Lady Jessica',  title:'Bene Gesserit',          emoji:'🌙',
    color:'#402060', availFromDay:1,
    dialogs: [
      'Listen to the desert, Paul. The Fremen have survived here for thousands of years. Their ways are not primitive — they are perfect.',
      'The Voice can bend others to your will. But use it sparingly. True leadership comes from within, not compulsion.',
      'You are the Kwisatz Haderach, though you may not yet believe it. The desert will awaken what sleeps inside you.',
      'Grief is a storm that passes. Your father\'s sacrifice was not in vain. Channel your pain into purpose.',
      'The Bene Gesserit have planned for generations. You are the culmination of that plan, Paul. Do not waste it.',
    ]
  },
  { id:'duncan',  name:'Duncan Idaho',  title:'Swordmaster of the Ginaz', emoji:'⚔️',
    color:'#203040', availFromDay:1, availUntilDay:22,
    dialogs: [
      'I have scouted the northern ridges. There are Fremen settlements beyond the shield wall — more than the Harkonnen suspect.',
      'The Fremen fight like nothing I have ever seen. Faster than thought. If we earn their trust, we\'ll have an unstoppable army.',
      'Watch the eastern approaches, my lord. The Harkonnen have thopters patrolling at dusk. We must move carefully.',
    ]
  },
  { id:'gurney',  name:'Gurney Halleck', title:'Warmaster',              emoji:'🎵',
    color:'#304020', availFromDay:5,
    dialogs: [
      '"Mood\'s a thing for cattle and loveplay, not fighting!" We need more Fremen trained in weapons. Assign them to military duty.',
      'The Atreides sword style combined with Fremen desert tactics — nothing in the Known Universe can match it.',
      'Every sietch you rally adds to our strength. The Harkonnen\'s advantage lies in numbers. We must match them.',
      'Your training progresses well. I see the Atreides in you — and something more. Something the desert is shaping.',
    ]
  },
  { id:'stilgar', name:'Stilgar',        title:'Naib of Sietch Tabr',    emoji:'🏜️',
    color:'#402810', availFromDay:15,
    dialogs: [
      '"Usul" — this is your sietch name. It means the base of the pillar. You are now one of us, Paul-Muad\'Dib.',
      'The worms are ours to call. Learn to read the desert\'s heartbeat and the maker will answer you.',
      'We have waited for Muad\'Dib. The prophecy speaks of one who will lead us to freedom. I believe that one is you.',
      'Our water discipline is absolute. Every drop is sacred. This is the Fremen way — nothing is wasted.',
    ]
  },
  { id:'chani',   name:'Chani',          title:"Liet-Kynes' daughter",   emoji:'👁️',
    color:'#302808', availFromDay:30,
    dialogs: [
      'I dreamed of you before you came, Paul-Muad\'Dib. The desert speaks in dreams, and you were in mine.',
      'The sandworms feel fear when Muad\'Dib rides. You have a gift — the desert accepts you.',
      'Lead all the sietches united and the Harkonnen will crumble. They are outsiders here. We are the desert.',
    ]
  },
];

const INTRO_SLIDES = [
  'A long time ago, in a galaxy not so different from our own...\n\nThe desert planet Arrakis — called Dune — is the only source of the most precious substance in the universe: the Spice Melange.',
  'House Atreides has been assigned stewardship of Arrakis by the Emperor Shaddam IV.\n\nBut this assignment is a trap. The Harkonnen — ancient enemies of House Atreides — lurk in the shadows.',
  'You are Paul Atreides, son of Duke Leto.\n\nYou have arrived on Arrakis. The desert stretches before you — vast, deadly, and full of secrets.',
  'To survive, you must unite the Fremen tribes.\nTo triumph, you must become their leader.\n\nThe Spice must flow... but Arrakis must be free.',
];

// ── STATE ─────────────────────────────────────────────

const S = {
  screen: 'title',
  day: 1,
  phase: 1,
  spice: 0,
  spiceDemand: 80,
  missedDemands: 0,
  military: 0,
  harkStrength: 100,
  introIdx: 0,
  currentSietch: null,
  currentChar: null,
  dialogIdx: {},    // charId -> dialog index
  discoveredSietches: new Set(),
  ornX: 235, ornY: 55,
  fuel: 5,
  pendingBattle: false,
  battleResult: null,
  mapAnimFrame: null,
  phaseNames: ['Arrival on Arrakis', 'Duke Leto is Dead — Flee!', 'Rise of Muad\'Dib', 'Final Mobilization'],
};

// ── UTILS ─────────────────────────────────────────────

function $(id) { return document.getElementById(id); }
function show(id) { $(id).classList.remove('hidden'); }
function hide(id) { $(id).classList.add('hidden'); }

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  show('screen-' + name);
  S.screen = name;
  updateHUD();
}

function updateHUD() {
  const onTitle = S.screen === 'title' || S.screen === 'intro';
  if (onTitle) { hide('hud'); return; }
  show('hud');
  $('hud-day').textContent = 'Day ' + S.day;
  $('hud-spice').textContent = '⬡ Spice: ' + S.spice;
  $('hud-demand').textContent = 'Demand: ' + S.spiceDemand;
  $('hud-military').textContent = '⚔ Military: ' + S.military;
  $('hud-phase').textContent = S.phaseNames[S.phase - 1] || '';
}

function totalProduction() {
  return [...S.discoveredSietches].reduce((sum, id) => {
    const si = SIETCHES[id];
    return sum + (si.mining || 0) * 2;
  }, 0);
}

function updatePhase() {
  if (S.day >= 15 && S.phase < 2) S.phase = 2;
  if (S.day >= 35 && S.phase < 3) S.phase = 3;
  if (S.day >= 60 && S.phase < 4) S.phase = 4;
}

// ── GAME OBJECT ───────────────────────────────────────

const Game = {

  // ── TITLE ──────────────────────────────────────────
  start() {
    S.introIdx = 0;
    showScreen('intro');
    $('intro-text').textContent = INTRO_SLIDES[0];
  },

  // ── INTRO ──────────────────────────────────────────
  introNext() {
    S.introIdx++;
    if (S.introIdx >= INTRO_SLIDES.length) {
      this.goPalace();
    } else {
      $('intro-text').textContent = INTRO_SLIDES[S.introIdx];
    }
  },

  // ── PALACE ─────────────────────────────────────────
  goPalace() {
    showScreen('palace');
    this.renderPalace();
  },

  renderPalace() {
    const container = $('palace-characters');
    container.innerHTML = '';
    CHARACTERS.forEach(ch => {
      const avail = this.isCharAvailable(ch);
      const card = document.createElement('div');
      card.className = 'char-card' + (avail ? '' : ' unavailable');
      card.innerHTML = `
        <div class="char-portrait" style="border-color:${ch.color}">
          <div class="char-initials">${ch.emoji}</div>
        </div>
        <div class="char-name">${ch.name}</div>
        <div class="char-role">${ch.title}</div>
      `;
      if (avail) card.onclick = () => Game.talkTo(ch.id);
      container.appendChild(card);
    });
  },

  isCharAvailable(ch) {
    if (ch.availFromDay && S.day < ch.availFromDay) return false;
    if (ch.availUntilDay && S.day >= ch.availUntilDay) return false;
    if (ch.id === 'stilgar' && !S.discoveredSietches.has(0)) return false;
    if (ch.id === 'chani'   && !S.discoveredSietches.has(4)) return false;
    return true;
  },

  // ── DIALOG ─────────────────────────────────────────
  talkTo(charId) {
    const ch = CHARACTERS.find(c => c.id === charId);
    if (!ch) return;
    S.currentChar = charId;
    if (!S.dialogIdx[charId]) S.dialogIdx[charId] = 0;

    showScreen('dialog');

    $('dialog-portrait').textContent = ch.emoji;
    $('dialog-portrait').style.fontSize = '60px';
    $('dialog-char-name').textContent = ch.name;
    $('dialog-char-title').textContent = ch.title;

    const idx = Math.min(S.dialogIdx[charId], ch.dialogs.length - 1);
    $('dialog-text').textContent = ch.dialogs[idx];

    // Advance dialog index for next visit (cycle through)
    S.dialogIdx[charId] = (idx + 1) % ch.dialogs.length;

    $('dialog-choices').innerHTML = `
      <button class="dialog-choice" onclick="Game.goPalace()">Return to Great Hall</button>
      <button class="dialog-choice" onclick="Game.goMap()">Fly to the Desert</button>
    `;
  },

  // ── MAP ────────────────────────────────────────────
  goMap() {
    showScreen('map');
    this.drawMap();
    this.setupMapEvents();
    $('fuel-val').textContent = S.fuel;
  },

  drawMap() {
    const canvas = $('map-canvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    // Background sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.15);
    skyGrad.addColorStop(0, '#050C20');
    skyGrad.addColorStop(1, '#0A1228');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H * 0.15);

    // Desert base gradient
    const desertGrad = ctx.createLinearGradient(0, H * 0.15, 0, H);
    desertGrad.addColorStop(0,   '#C8A040');
    desertGrad.addColorStop(0.3, '#D4A843');
    desertGrad.addColorStop(0.7, '#B88428');
    desertGrad.addColorStop(1,   '#8A6018');
    ctx.fillStyle = desertGrad;
    ctx.fillRect(0, H * 0.15, W, H);

    // Dune ridges / sand patterns
    ctx.fillStyle = 'rgba(180,130,30,0.25)';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const y = H * 0.25 + i * 30;
      ctx.moveTo(0, y);
      for (let x = 0; x <= W; x += 40) {
        ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * 8);
      }
      ctx.lineTo(W, y + 20);
      ctx.lineTo(0, y + 20);
      ctx.closePath();
      ctx.fill();
    }

    // Northern shield wall / rocky plateau
    ctx.fillStyle = '#5A3818';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W, 0);
    ctx.lineTo(W, 52);
    ctx.lineTo(410, 38);
    ctx.lineTo(370, 58);
    ctx.lineTo(340, 42);
    ctx.lineTo(290, 60);
    ctx.lineTo(250, 44);
    ctx.lineTo(200, 58);
    ctx.lineTo(155, 40);
    ctx.lineTo(110, 52);
    ctx.lineTo(70,  38);
    ctx.lineTo(30,  50);
    ctx.lineTo(0,   42);
    ctx.closePath();
    ctx.fill();

    // Rocky outcrops
    const rocks = [[60,130,40,22],[200,90,30,18],[340,155,45,20],[100,210,35,18],[380,100,30,16]];
    rocks.forEach(([rx,ry,rw,rh]) => {
      ctx.fillStyle = '#4A2E14';
      ctx.beginPath();
      ctx.ellipse(rx, ry, rw, rh, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Spice patches (orange shimmer)
    ctx.fillStyle = 'rgba(255,120,0,0.15)';
    [[160,190,50,25],[280,240,60,20],[80,260,40,18],[350,210,45,20]].forEach(([sx,sy,sw,sh]) => {
      ctx.beginPath();
      ctx.ellipse(sx, sy, sw, sh, 0.3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Harkonnen territory (northeast) - darker red tint
    ctx.fillStyle = 'rgba(100,0,0,0.18)';
    ctx.beginPath();
    ctx.moveTo(320, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 130); ctx.lineTo(340, 110); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,0,0,0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4,4]);
    ctx.beginPath();
    ctx.moveTo(340, 0); ctx.lineTo(330, 50); ctx.lineTo(320, 80); ctx.lineTo(340, 110);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── Draw locations ──

    // Arrakeen palace
    this.drawMapIcon(ctx, 235, 55, '■', '#FFD700', 'Arrakeen', true);

    // Carthag (Harkonnen capital)
    this.drawMapIcon(ctx, 375, 60, '✖', '#CC2200', 'Carthag (Harkonnen)', false, true);

    // Sietches
    SIETCHES.forEach(si => {
      const found = S.discoveredSietches.has(si.id);
      this.drawMapIcon(ctx, si.x, si.y, '▲', found ? '#44AAFF' : '#4A3820', found ? si.name : '???', false, false, !found);
    });

    // Ornithopter
    this.drawOrn(ctx, S.ornX, S.ornY);
  },

  drawMapIcon(ctx, x, y, symbol, color, label, isHome, isDanger, isUnknown) {
    ctx.save();
    ctx.font = isHome ? 'bold 14px monospace' : '12px monospace';
    ctx.fillStyle = isUnknown ? 'rgba(100,80,40,0.5)' : color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, x, y);
    if (!isUnknown) {
      ctx.font = '9px monospace';
      ctx.fillStyle = isDanger ? '#FF6666' : (isHome ? '#FFD700' : '#AADDFF');
      ctx.fillText(label, x, y + 14);
    }
    ctx.restore();
  },

  drawOrn(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '11px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✈', x, y - 18);
    ctx.restore();
  },

  setupMapEvents() {
    const canvas = $('map-canvas');
    const tooltip = $('map-tooltip');

    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      let hit = null;
      // Check Arrakeen
      if (Math.hypot(mx - 235, my - 55) < 20) hit = 'Fly to Arrakeen (Palace)';
      // Check sietches
      SIETCHES.forEach(si => {
        if (Math.hypot(mx - si.x, my - si.y) < 20) {
          hit = S.discoveredSietches.has(si.id) ? 'Visit ' + si.name : 'Explore unknown region';
        }
      });
      if (hit) {
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX - canvas.getBoundingClientRect().left + 10) + 'px';
        tooltip.style.top  = (e.clientY - canvas.getBoundingClientRect().top  + 10) + 'px';
        tooltip.textContent = hit;
        canvas.style.cursor = 'pointer';
      } else {
        tooltip.style.display = 'none';
        canvas.style.cursor = 'crosshair';
      }
    };

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      // Arrakeen
      if (Math.hypot(mx - 235, my - 55) < 22) {
        S.ornX = 235; S.ornY = 55;
        this.goPalace(); return;
      }

      // Sietches
      for (const si of SIETCHES) {
        if (Math.hypot(mx - si.x, my - si.y) < 22) {
          if (si.phase > S.phase) {
            this.mapMessage('This region is too dangerous to reach yet.'); return;
          }
          if (S.fuel <= 0) {
            this.mapMessage('Not enough fuel. Return to Arrakeen to refuel.'); return;
          }
          S.fuel--;
          $('fuel-val').textContent = S.fuel;
          S.ornX = si.x; S.ornY = si.y;
          if (!S.discoveredSietches.has(si.id)) {
            S.discoveredSietches.add(si.id);
            SIETCHES[si.id].mining    = 0;
            SIETCHES[si.id].military  = 0;
          }
          S.currentSietch = si.id;
          this.drawMap();
          setTimeout(() => this.goSietch(si.id), 300);
          return;
        }
      }
    };
  },

  mapMessage(msg) {
    const tooltip = $('map-tooltip');
    tooltip.style.display = 'block';
    tooltip.textContent = msg;
    tooltip.style.left = '50%';
    tooltip.style.top  = '50%';
    setTimeout(() => tooltip.style.display = 'none', 2000);
  },

  // ── SIETCH ─────────────────────────────────────────
  goSietch(id) {
    const si = SIETCHES[id];
    S.currentSietch = id;
    showScreen('sietch');

    $('sietch-name-title').textContent = si.name;
    $('sietch-leader-line').textContent = 'Leader: ' + si.leader + ' · ' + si.fremen + ' Fremen';
    $('sietch-portrait').textContent = si.emoji;
    $('sietch-dialog-text').textContent = si.intro;

    this.renderSietchStats();
  },

  renderSietchStats() {
    const si = SIETCHES[S.currentSietch];
    const mining   = si.mining   || 0;
    const military = si.military || 0;
    const idle     = si.fremen - mining - military;
    $('sstat-fremen').textContent   = si.fremen;
    $('sstat-mining').textContent   = mining;
    $('sstat-military').textContent = military;
    $('sstat-spice').textContent    = (mining * 2) + ' kg/day';
    $('assign-mining-val').textContent    = mining;
    $('assign-military-val').textContent  = military;
    $('assign-idle').textContent          = Math.max(0, idle);
  },

  adjustSietch(type, delta) {
    const si = SIETCHES[S.currentSietch];
    const cur = si[type] || 0;
    const other = type === 'mining' ? (si.military || 0) : (si.mining || 0);
    const newVal = Math.max(0, Math.min(si.fremen - other, cur + delta));
    si[type] = newVal;
    this.renderSietchStats();
  },

  // ── COMMAND ────────────────────────────────────────
  goCommand() {
    showScreen('command');
    this.renderCommand();
  },

  renderCommand() {
    const prod = totalProduction();
    $('cmd-day').textContent       = S.day;
    $('cmd-spice').textContent     = S.spice;
    $('cmd-demand').textContent    = S.spiceDemand;
    $('cmd-production').textContent = prod + '/day';
    $('cmd-military').textContent  = S.military;
    $('cmd-harkonnen').textContent = S.harkStrength;

    const spicePct = Math.min(100, (S.spice / S.spiceDemand) * 100);
    $('bar-spice').style.width = spicePct + '%';

    const milPct = Math.min(100, (S.military / Math.max(1, S.harkStrength)) * 100);
    $('bar-military').style.width = milPct + '%';

    const tbody = $('sietch-tbody');
    tbody.innerHTML = '';
    SIETCHES.forEach(si => {
      const found = S.discoveredSietches.has(si.id);
      const tr = document.createElement('tr');
      tr.className = found ? '' : 'undiscovered';
      tr.innerHTML = `
        <td>${found ? si.name : '???'}</td>
        <td>${found ? si.leader : '—'}</td>
        <td>${found ? si.fremen : '—'}</td>
        <td>${found ? (si.mining   || 0) : '—'}</td>
        <td>${found ? (si.military || 0) : '—'}</td>
        <td>${found ? (si.mining || 0) * 2 + '/day' : '—'}</td>
      `;
      if (found) tr.onclick = () => { S.currentSietch = si.id; Game.goSietch(si.id); };
      tbody.appendChild(tr);
    });
  },

  // ── END DAY ────────────────────────────────────────
  endDay() {
    const events = [];

    // Produce spice
    const prod = totalProduction();
    S.spice += prod;
    if (prod > 0) events.push({ text:`Spice harvested: +${prod} kg (total: ${S.spice} kg)`, cls:'good' });

    // Compute military strength
    S.military = [...S.discoveredSietches].reduce((sum, id) => sum + (SIETCHES[id].military || 0), 0);

    // Refuel ornithopter when at palace
    S.fuel = Math.min(5, S.fuel + 1);

    // Emperor demand check (every 10 days)
    if (S.day % 10 === 0) {
      if (S.spice >= S.spiceDemand) {
        S.spice -= S.spiceDemand;
        S.missedDemands = 0;
        events.push({ text:`Emperor's demand met: ${S.spiceDemand} kg shipped. He is... satisfied.`, cls:'good' });
        S.spiceDemand = Math.floor(S.spiceDemand * 1.15);
        events.push({ text:`The Emperor now demands ${S.spiceDemand} kg next cycle.`, cls:'warn' });
      } else {
        S.missedDemands++;
        events.push({ text:`DEMAND NOT MET! Shipped only ${S.spice} kg of ${S.spiceDemand} required. The Emperor is furious!`, cls:'bad' });
        events.push({ text:`WARNING: ${3 - S.missedDemands} more failures will end your mission.`, cls:'bad' });
        S.spice = 0;
      }
    }

    // Harkonnen attack (random, scales with day)
    const attackChance = S.day > 10 ? 0.25 + (S.day / 200) : 0;
    if (Math.random() < attackChance) {
      S.pendingBattle = true;
      events.push({ text:'⚔ HARKONNEN ATTACK INCOMING — Your forces must defend!', cls:'bad' });
    }

    // Phase events
    if (S.day === 16 && S.phase < 2) {
      events.push({ text:'TRAGEDY — Duke Leto has been murdered by the Harkonnens! Paul and Jessica flee to the desert!', cls:'bad' });
      events.push({ text:'You are now in the hands of the Fremen. Stilgar will shelter you.', cls:'info' });
    }
    if (S.day === 20 && !S.discoveredSietches.has(0)) {
      events.push({ text:'TIP: Visit Sietch Tabr on the map — Stilgar\'s people will be crucial allies.', cls:'info' });
    }
    if (S.day === 35) {
      events.push({ text:'Paul-Muad\'Dib\'s legend spreads across the sietches. Fremen numbers swell.', cls:'info' });
    }

    // Auto-discover sietches that should be reachable but aren't found
    if (S.day === 10 && !S.discoveredSietches.has(1)) {
      events.push({ text:'TIP: Tuono Sietch has been spotted northwest of Arrakeen. Investigate with the ornithopter.', cls:'info' });
    }

    S.day++;
    updatePhase();

    this.showReport(events);
  },

  showReport(events) {
    showScreen('report');
    $('rep-day').textContent = S.day - 1;
    const container = $('report-events');
    container.innerHTML = '';
    if (events.length === 0) {
      events.push({ text:'A quiet day on Arrakis. The spice accumulates.', cls:'info' });
    }
    events.forEach(ev => {
      const div = document.createElement('div');
      div.className = 'report-event ' + (ev.cls || '');
      div.textContent = ev.text;
      container.appendChild(div);
    });
  },

  afterReport() {
    // Check game over
    if (S.missedDemands >= 3) {
      this.gameOver('The Emperor\'s patience has run out. Without spice shipments, House Atreides loses all standing. The Harkonnens reclaim Arrakis. The dream of Muad\'Dib fades into desert sand.');
      return;
    }

    // Check military game over
    if (S.harkStrength > 100 && S.military < 10) {
      this.gameOver('The Harkonnen onslaught overwhelms the scattered Fremen. Without sufficient military strength, resistance crumbles. The desert reclaims your bones.');
      return;
    }

    // Check win
    if (S.day > 70 && S.discoveredSietches.size >= 5 && S.military >= 80) {
      this.win();
      return;
    }

    if (S.pendingBattle) {
      S.pendingBattle = false;
      this.showBattle();
      return;
    }

    this.goPalace();
  },

  // ── BATTLE ─────────────────────────────────────────
  showBattle() {
    showScreen('battle');
    const harkForce = Math.floor(20 + S.day * 1.2 + Math.random() * 20);
    S.battleResult = { harkForce };

    $('battle-desc').textContent =
      `A Harkonnen raiding force of approximately ${harkForce} soldiers has been spotted ` +
      `approaching a sietch. Your ${S.military} Fremen warriors stand ready.`;

    const milPct = Math.min(100, (S.military / Math.max(1, harkForce)) * 100);
    const hrkPct = Math.min(100, (harkForce / Math.max(1, S.military + harkForce)) * 100);
    $('battle-bar-fremen').style.width = milPct + '%';
    $('battle-bar-hark').style.width   = hrkPct + '%';
    $('battle-fremen-val').textContent = S.military;
    $('battle-hark-val').textContent   = harkForce;
    $('battle-result').textContent     = '';
    $('battle-btn').textContent        = 'Fight!';
    $('battle-btn').onclick            = () => Game.resolveBattle();
  },

  resolveBattle() {
    const { harkForce } = S.battleResult;
    const ratio = S.military / Math.max(1, harkForce);
    let resultText;

    if (ratio >= 1.5) {
      resultText = '✓ VICTORY! The Fremen drive back the Harkonnen with minimal losses. Fear of Muad\'Dib spreads.';
      S.harkStrength = Math.max(0, S.harkStrength - 15);
    } else if (ratio >= 0.8) {
      const lost = Math.floor(harkForce * 0.1);
      resultText = `⚡ HARD FOUGHT. The Harkonnen are repelled but losses were taken (${lost} Fremen fell).`;
      S.harkStrength = Math.max(0, S.harkStrength - 8);
      // Reduce fremen in a random sietch
      if (S.discoveredSietches.size > 0) {
        const arr = [...S.discoveredSietches];
        const id = arr[Math.floor(Math.random() * arr.length)];
        SIETCHES[id].fremen = Math.max(10, SIETCHES[id].fremen - lost);
        SIETCHES[id].mining   = Math.min(SIETCHES[id].mining   || 0, SIETCHES[id].fremen);
        SIETCHES[id].military = Math.min(SIETCHES[id].military || 0, SIETCHES[id].fremen);
      }
    } else {
      resultText = '✗ DEFEAT! The Harkonnen overrun a sietch. Spice stores and Fremen are lost!';
      S.harkStrength = Math.min(150, S.harkStrength + 10);
      S.spice = Math.max(0, S.spice - 30);
      if (S.discoveredSietches.size > 0) {
        const arr = [...S.discoveredSietches];
        const id = arr[Math.floor(Math.random() * arr.length)];
        const loss = Math.floor(SIETCHES[id].fremen * 0.3);
        SIETCHES[id].fremen   = Math.max(5, SIETCHES[id].fremen - loss);
        SIETCHES[id].mining   = Math.min(SIETCHES[id].mining   || 0, SIETCHES[id].fremen);
        SIETCHES[id].military = Math.min(SIETCHES[id].military || 0, SIETCHES[id].fremen);
      }
    }

    $('battle-result').textContent = resultText;
    $('battle-btn').textContent    = 'Continue';
    $('battle-btn').onclick        = () => Game.goPalace();
  },

  // ── WIN / GAME OVER ────────────────────────────────
  win() {
    showScreen('win');
    $('win-text').innerHTML =
      `On Day ${S.day}, Paul-Muad'Dib leads the united Fremen tribes in a final assault.<br><br>` +
      `${S.military} warriors sweep across Arrakis. The Harkonnen forces crumble before the desert storm.<br><br>` +
      `The Emperor is forced to yield. House Atreides assumes control of Arrakis.<br><br>` +
      `The Spice continues to flow — but now, for the Fremen and their liberator.<br><br>` +
      `<em>"The mystery of life isn't a problem to solve, but a reality to experience."</em><br>— Frank Herbert`;
  },

  gameOver(reason) {
    showScreen('gameover');
    $('gameover-text').textContent = reason;
    $('gameover-stats').innerHTML  =
      `Days survived: ${S.day} &nbsp;&bull;&nbsp; ` +
      `Sietches found: ${S.discoveredSietches.size} / ${SIETCHES.length} &nbsp;&bull;&nbsp; ` +
      `Peak military: ${S.military}`;
  },

  // ── RESTART ────────────────────────────────────────
  restart() {
    Object.assign(S, {
      screen:'title', day:1, phase:1, spice:0, spiceDemand:80,
      missedDemands:0, military:0, harkStrength:100,
      introIdx:0, currentSietch:null, currentChar:null,
      dialogIdx:{}, discoveredSietches:new Set(),
      ornX:235, ornY:55, fuel:5, pendingBattle:false, battleResult:null,
    });
    SIETCHES.forEach(si => { si.mining = 0; si.military = 0; });
    showScreen('title');
  },
};

// ── BOOT ─────────────────────────────────────────────
window.addEventListener('load', () => {
  hide('hud');
  showScreen('title');
});
