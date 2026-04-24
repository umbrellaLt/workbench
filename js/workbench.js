/* Amiga Workbench 1.3 - JavaScript */

// ============================================================
// CLOCK
// ============================================================
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const el = document.getElementById('screen-clock');
  if (el) el.textContent = `${h}:${m}:${s}`;
}

function drawAnalogClock() {
  const canvas = document.getElementById('clock-canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(cx, cy) - 4;

  const now = new Date();
  const hrs = now.getHours() % 12;
  const min = now.getMinutes();
  const sec = now.getSeconds();

  ctx.clearRect(0, 0, w, h);

  // Face
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#FF8800';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Hour marks
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
    const inner = r - 6;
    const outer = r - 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
    ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Hour hand
  const hourAngle = ((hrs + min / 60) * Math.PI * 2) / 12 - Math.PI / 2;
  drawHand(ctx, cx, cy, hourAngle, r * 0.5, 3, '#000000');

  // Minute hand
  const minAngle = ((min + sec / 60) * Math.PI * 2) / 60 - Math.PI / 2;
  drawHand(ctx, cx, cy, minAngle, r * 0.75, 2, '#000000');

  // Second hand
  const secAngle = (sec * Math.PI * 2) / 60 - Math.PI / 2;
  drawHand(ctx, cx, cy, secAngle, r * 0.85, 1, '#FF8800');

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();
}

function drawHand(ctx, cx, cy, angle, length, width, color) {
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

setInterval(() => {
  updateClock();
  drawAnalogClock();
}, 1000);
updateClock();

// ============================================================
// WINDOWS
// ============================================================
let zCounter = 100;

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'flex';
  bringToFront(win);

  if (id === 'clock-window') {
    setTimeout(drawAnalogClock, 50);
  }
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (win) win.style.display = 'none';
  updateActiveWindow();
}

function bringToFront(win) {
  zCounter++;
  win.style.zIndex = zCounter;
  document.querySelectorAll('.wb-window').forEach(w => w.classList.remove('active'));
  win.classList.add('active');
}

function depthWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  const allWindows = [...document.querySelectorAll('.wb-window[style*="flex"]')];
  if (allWindows.length < 2) return;
  const maxZ = Math.max(...allWindows.map(w => parseInt(w.style.zIndex) || 0));
  if (parseInt(win.style.zIndex) >= maxZ) {
    const minZ = Math.min(...allWindows.map(w => parseInt(w.style.zIndex) || 0));
    win.style.zIndex = minZ - 1;
  } else {
    bringToFront(win);
  }
  updateActiveWindow();
}

function updateActiveWindow() {
  const allWindows = [...document.querySelectorAll('.wb-window')].filter(
    w => w.style.display !== 'none'
  );
  if (allWindows.length === 0) return;
  const topWin = allWindows.reduce((prev, cur) =>
    (parseInt(cur.style.zIndex) || 0) > (parseInt(prev.style.zIndex) || 0) ? cur : prev
  );
  document.querySelectorAll('.wb-window').forEach(w => w.classList.remove('active'));
  topWin.classList.add('active');
}

// ============================================================
// WINDOW DRAGGING
// ============================================================
let dragState = null;

document.addEventListener('mousedown', e => {
  const titleBar = e.target.closest('.wb-window-title-bar');
  if (!titleBar) return;

  const win = titleBar.closest('.wb-window');
  if (!win) return;

  // Don't drag on gadget clicks
  if (e.target.closest('.wb-gadget')) return;

  bringToFront(win);

  const startX = e.clientX;
  const startY = e.clientY;
  const startLeft = parseInt(win.style.left) || 0;
  const startTop = parseInt(win.style.top) || 0;

  dragState = { win, startX, startY, startLeft, startTop };
  e.preventDefault();
});

document.addEventListener('mousemove', e => {
  if (!dragState) return;
  const dx = e.clientX - dragState.startX;
  const dy = e.clientY - dragState.startY;
  const newLeft = Math.max(0, dragState.startLeft + dx);
  const newTop = Math.max(0, dragState.startTop + dy);
  dragState.win.style.left = newLeft + 'px';
  dragState.win.style.top = newTop + 'px';
});

document.addEventListener('mouseup', () => {
  dragState = null;
});

// ============================================================
// WINDOW RESIZING
// ============================================================
let resizeState = null;

document.addEventListener('mousedown', e => {
  const gadget = e.target.closest('.wb-window-resize-gadget');
  if (!gadget) return;

  const winId = gadget.dataset.window;
  const win = document.getElementById(winId);
  if (!win) return;

  bringToFront(win);

  resizeState = {
    win,
    startX: e.clientX,
    startY: e.clientY,
    startW: win.offsetWidth,
    startH: win.offsetHeight
  };
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener('mousemove', e => {
  if (!resizeState) return;
  const dx = e.clientX - resizeState.startX;
  const dy = e.clientY - resizeState.startY;
  const newW = Math.max(120, resizeState.startW + dx);
  const newH = Math.max(80, resizeState.startH + dy);
  resizeState.win.style.width = newW + 'px';
  resizeState.win.style.height = newH + 'px';
});

document.addEventListener('mouseup', () => {
  resizeState = null;
});

// ============================================================
// DESKTOP ICON SELECTION
// ============================================================
document.querySelectorAll('.wb-icon').forEach(icon => {
  icon.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelectorAll('.wb-icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
  });
});

document.getElementById('desktop').addEventListener('click', () => {
  document.querySelectorAll('.wb-icon').forEach(i => i.classList.remove('selected'));
});

// Bring window to front on click
document.addEventListener('mousedown', e => {
  const win = e.target.closest('.wb-window');
  if (win) bringToFront(win);
});

// ============================================================
// MENUS
// ============================================================
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', e => {
    const menuId = item.dataset.menu;
    const menuEl = document.getElementById('menu-' + menuId);
    const overlay = document.getElementById('menu-overlay');

    // Position menu below the menu item
    const rect = item.getBoundingClientRect();
    if (menuEl) {
      menuEl.style.left = rect.left + 'px';
      const isVisible = menuEl.style.display !== 'none';
      closeMenus();
      if (!isVisible) {
        menuEl.style.display = 'block';
        overlay.classList.add('active');
        item.classList.add('active');
      }
    }
    e.stopPropagation();
  });
});

function closeMenus() {
  document.querySelectorAll('.wb-menu').forEach(m => m.style.display = 'none');
  document.getElementById('menu-overlay').classList.remove('active');
  document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
}

// ============================================================
// SHELL
// ============================================================
const shellCommands = {
  help: () => [
    'Available commands:',
    '  dir       - List directory',
    '  cls       - Clear screen',
    '  date      - Show current date',
    '  version   - Show Workbench version',
    '  echo      - Print text',
    '  avail     - Show memory',
  ],
  dir: () => [
    'Directory of Workbench1.3:',
    '',
    'Prefs       <dir>',
    'Shell       <executable>',
    'System      <dir>',
    'Utilities   <dir>',
    'WBStartup   <dir>',
    '',
    '4 directories, 1 file, 188K free.',
  ],
  cls: () => { clearShell(); return []; },
  date: () => [new Date().toString()],
  version: () => ['Workbench 1.3, Kickstart 1.3 (34.5)', 'AmigaOS Copyright © 1985-1990 Commodore-Amiga, Inc.'],
  avail: () => [
    'Type    Total    Used    Free    Largest',
    'chip    524288   102400  421888  420000',
    'fast   1572864  65536  1507328  1500000',
    'total  2097152  167936  1929216  1500000',
  ],
};

function clearShell() {
  const lines = document.getElementById('shell-lines');
  if (lines) lines.innerHTML = '';
}

function addShellLine(text, className) {
  const lines = document.getElementById('shell-lines');
  if (!lines) return;
  const div = document.createElement('div');
  div.textContent = text;
  if (className) div.className = className;
  lines.appendChild(div);
  const output = document.getElementById('shell-output');
  if (output) output.scrollTop = output.scrollHeight;
}

const shellInput = document.getElementById('shell-input');
if (shellInput) {
  shellInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cmd = shellInput.value.trim();
      shellInput.value = '';

      addShellLine('1.Workbench:> ' + cmd);

      if (!cmd) return;

      const parts = cmd.split(' ');
      const name = parts[0].toLowerCase();

      if (name === 'echo') {
        addShellLine(parts.slice(1).join(' '));
      } else if (shellCommands[name]) {
        const output = shellCommands[name]();
        if (output) output.forEach(line => addShellLine(line));
      } else {
        addShellLine(`Unknown command "${cmd}" - type HELP for list`);
      }
    }
  });

  document.getElementById('cli-window').addEventListener('click', () => {
    shellInput.focus();
  });
}

// ============================================================
// MISC
// ============================================================
function formatDisk() {
  alert('Format Disk\n\nNo disk in drive.');
}

// Open workbench window by default on load
window.addEventListener('load', () => {
  openWindow('workbench-window');
  updateClock();
  setTimeout(drawAnalogClock, 100);
});
