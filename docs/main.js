/* ================= Data ================= */

// Simulation clips (RLBench). One clip per kind per task; `ep` is the evaluation episode,
// so a BridgeVLA failure with the same `ep` as a recovery clip starts from the same scene.
// Success rates are LexiconVLA (BridgeVLA) vs. BridgeVLA from Tables 15–16 of the paper.
const SIM_TASKS = [
  // ---- policy-unseen ----
  { id: 'put_knife_on_chopping_board', name: 'Put knife on chopping board', split: 'unseen', group: 'Object transport & placement', sr: [4.0, 8.0],
    clips: { success: { ep: 16 }, retry: { ep: 18, retry: 1 }, replan: { ep: 1, retry: 2, gemini: true }, bridgevla: { ep: 18 } } },
  { id: 'basketball_in_hoop', name: 'Basketball in hoop', split: 'unseen', group: 'Object transport & placement', sr: [9.3, 36.0],
    clips: { success: { ep: 3 }, retry: { ep: 7, retry: 1 }, replan: { ep: 6, retry: 1, sd: true }, bridgevla: { ep: 7 } } },
  { id: 'lamp_on', name: 'Lamp on', split: 'unseen', group: 'Switch operation', sr: [2.7, 56.0],
    clips: { success: { ep: 0 }, replan: { ep: 8, retry: 1, gemini: true }, bridgevla: { ep: 8 } } },
  { id: 'pick_up_cup', name: 'Pick up cup', split: 'unseen', group: 'Object transport & placement', sr: [57.3, 82.7],
    clips: { success: { ep: 10 }, retry: { ep: 19, retry: 2 }, bridgevla: { ep: 19 } } },
  { id: 'phone_on_base', name: 'Phone on base', split: 'unseen', group: 'Object transport & placement', sr: [4.0, 24.0],
    clips: { success: { ep: 0 }, retry: { ep: 23, retry: 2 }, bridgevla: { ep: 23 } } },
  { id: 'close_drawer', name: 'Close drawer', split: 'unseen', group: 'Articulated-object manipulation', sr: [44.0, 61.3],
    clips: { success: { ep: 5 }, bridgevla: { ep: 12 } } },
  { id: 'press_switch', name: 'Press switch', split: 'unseen', group: 'Switch operation', sr: [12.0, 5.3],
    clips: { success: { ep: 22, sd: true }, bridgevla: { ep: 21 } } },
  // ---- seen: LexiconVLA one-pass successes only ----
  { id: 'light_bulb_in', name: 'Light bulb in', split: 'seen', sr: [97.3, 92.0], clips: { success: { ep: 0 } } },
  { id: 'place_shape_in_shape_sorter', name: 'Place shape in shape sorter', split: 'seen', sr: [70.7, 57.3], clips: { success: { ep: 21 } } },
  { id: 'put_item_in_drawer', name: 'Put item in drawer', split: 'seen', sr: [97.3, 96.0], clips: { success: { ep: 1, sd: true } } },
  { id: 'stack_cups', name: 'Stack cups', split: 'seen', sr: [70.7, 56.0], clips: { success: { ep: 13 } } },
  { id: 'place_cups', name: 'Place cups', split: 'seen', sr: [45.3, 54.7], clips: { success: { ep: 7 } } },
  { id: 'put_groceries_in_cupboard', name: 'Put groceries in cupboard', split: 'seen', sr: [84.0, 85.3], clips: { success: { ep: 4 } } },
  { id: 'stack_blocks', name: 'Stack blocks', split: 'seen', sr: [77.3, 76.0], clips: { success: { ep: 7 } } },
  { id: 'insert_onto_square_peg', name: 'Insert onto square peg', split: 'seen', sr: [98.7, 85.3], clips: { success: { ep: 1 } } },
  { id: 'meat_off_grill', name: 'Meat off grill', split: 'seen', sr: [100.0, 100.0], clips: { success: { ep: 6 } } },
  { id: 'push_buttons', name: 'Push buttons', split: 'seen', sr: [100.0, 100.0], clips: { success: { ep: 0 } } },
  { id: 'put_money_in_safe', name: 'Put money in safe', split: 'seen', sr: [98.7, 100.0], clips: { success: { ep: 4 } } },
  { id: 'close_jar', name: 'Close jar', split: 'seen', sr: [100.0, 100.0], clips: { success: { ep: 0 } } },
  { id: 'open_drawer', name: 'Open drawer', split: 'seen', sr: [96.0, 96.0], clips: { success: { ep: 0 } } },
  { id: 'place_wine_at_rack_location', name: 'Place wine at rack location', split: 'seen', sr: [90.7, 93.3], clips: { success: { ep: 0 } } },
  { id: 'reach_and_drag', name: 'Reach and drag', split: 'seen', sr: [100.0, 100.0], clips: { success: { ep: 0 } } },
  { id: 'slide_block_to_color_target', name: 'Slide block to color target', split: 'seen', sr: [97.3, 92.0], clips: { success: { ep: 2 } } },
  { id: 'sweep_to_dustpan_of_size', name: 'Sweep to dustpan of size', split: 'seen', sr: [100.0, 100.0], clips: { success: { ep: 0 } } },
  { id: 'turn_tap', name: 'Turn tap', split: 'seen', sr: [92.0, 90.7], clips: { success: { ep: 0 } } }
];

const PI = 'π₀.₅';
const REAL_DEMOS = [
  { id: 'distractor', label: 'Distractor', kicker: 'Generalization · Push buttons',
    desc: 'An extra button and unrelated fruits are placed among the targets. Execution has to stay bound to the instructed buttons.',
    sr: [60, 40, 40], note: 'On the second distractor task, place fruits on the plate: 20 / 0 / 0.',
    videos: [['LexiconVLA', 'distractor-ours'], ['BridgeVLA', 'distractor-bridge'], [PI, 'distractor-pi']] },
  { id: 'category', label: 'Category', kicker: 'Generalization · Put item in drawer',
    desc: 'The wooden block from the demonstrations is replaced by unseen object categories — an orange or a lemon — that differ in shape, size, and surface.',
    sr: [40, 0, 0],
    videos: [['LexiconVLA', 'category-ours'], ['BridgeVLA', 'category-bridge'], [PI, 'category-pi']] },
  { id: 'instruction', label: 'Instruction', kicker: 'Generalization · Open drawer',
    desc: 'The training instruction is replaced by a procedural command (“Grasp the handle of the drawer and pull it outward…”) or a conversational request (“Could you open the drawer?”).',
    sr: [80, 40, 20],
    videos: [['LexiconVLA', 'instruction-ours'], ['BridgeVLA', 'instruction-bridge'], [PI, 'instruction-pi']] },
  { id: 'height', label: 'Height', kicker: 'Generalization · Pour water into the bowl',
    desc: 'The manipulated objects are raised on supports of two different heights, shifting the grasping and pouring poses away from the demonstrations.',
    sr: [80, 0, 0],
    videos: [['LexiconVLA', 'height-ours'], ['BridgeVLA', 'height-bridge'], [PI, 'height-pi']] },
  { id: 'pour', label: 'Real-only task', kicker: 'Standard · Pour water into the bowl',
    desc: 'A task with no simulation counterpart: grasp the cup, carry it to the bowl, and tilt it to pour without knocking it over.',
    sr: [40, 20, 0],
    videos: [['LexiconVLA', 'pour-ours'], ['BridgeVLA', 'pour-bridge'], [PI, 'pour-pi']] },
  { id: 'human', label: 'Human disturbance', kicker: 'Qualitative · Recovery',
    desc: 'A person disrupts the ongoing task. LexiconVLA detects the failure from visual feedback, issues RETRY, and resumes from the failed step.',
    note: 'Human-disturbance rollouts are qualitative and not included in the reported success rates.',
    groups: [
      { title: 'Drawer disturbed during execution', videos: [['LexiconVLA', 'recovery-drawer-ours', 'recovered'], ['BridgeVLA', 'recovery-drawer-bridge']] },
      { title: 'Object removed during grasp', videos: [['LexiconVLA', 'recovery-block-ours', 'recovered'], [PI, 'recovery-block-pi']] }
    ] },
  { id: 'self-recovery', label: 'Self-recovery', kicker: 'Qualitative · Recovery',
    desc: 'LexiconVLA recovers locally after its own execution error, re-executing only the failed subtask.',
    note: 'Qualitative rollout; not included in the reported success rates.',
    videos: [['LexiconVLA', 'self-recovery-ours', 'recovered']] }
];

const UNSEEN_BACKBONES = [
  { name: 'BridgeVLA', base: 16.67, ours: 34.17 },
  { name: 'BridgeVLA++', base: 19.17, ours: 26.83 },
  { name: 'RVT', base: 11.83, ours: 14.50 },
  { name: 'RVT-2', base: 18.00, ours: 19.83 },
  { name: 'PerAct', base: 19.00, ours: 19.33 }
];
const STRONGEST_BASELINE = 28.67;

const ABLATION = [
  ['LexiconVLA (full)', 34.17, true], ['w/o Detail Codebook', 29.50], ['w/o Planner', 28.50],
  ['w/o Global Codebook', 26.50], ['w/o V3A', 26.50], ['w/o Codebooks', 26.00]
];
const REAL_SUMMARY = [
  ['Standard', [['LexiconVLA', 62.0, true], [PI, 28.0], ['BridgeVLA', 26.0]]],
  ['Generalization', [['LexiconVLA', 56.0, true], ['BridgeVLA', 16.0], [PI, 12.0]]]
];

/* ================= Helpers ================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'style') node.style.cssText = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c != null) node.append(c);
  return node;
}

// Model names may contain π₀.₅; render it as π<sub>0.5</sub> instead of Unicode subscripts.
function modelName(tag, cls, name) {
  const node = el(tag, { class: cls });
  if (name === PI) node.append('π', el('sub', { text: '0.5' }));
  else node.textContent = name;
  return node;
}

const ICONS = {
  pause: '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
  expand: '<svg viewBox="0 0 24 24"><path d="M4 9V5a1 1 0 0 1 1-1h4v2H6v3zm11-5h4a1 1 0 0 1 1 1v4h-2V6h-3zM6 15v3h3v2H5a1 1 0 0 1-1-1v-4zm12 0h2v4a1 1 0 0 1-1 1h-4v-2h3z"/></svg>'
};

/* ================= Video manager ================= */

const speeds = { sim: 1, real: 4 };

const videoObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const { target: v, isIntersecting } of entries) {
    v._inView = isIntersecting;
    if (isIntersecting) {
      if (!v.getAttribute('src')) v.src = v.dataset.src;
      if (!v._userPaused) playVideo(v);
    } else {
      v.pause();
    }
  }
}, { rootMargin: '200px 0px', threshold: 0.01 }) : null;

function playVideo(v) {
  const rate = speeds[v.dataset.group] || 1;
  v.defaultPlaybackRate = rate;
  v.playbackRate = rate;
  v.play().catch(() => {});
}

function makeVideo({ src, poster, group, label, ratio }) {
  const v = el('video', { muted: true, loop: true, playsinline: true, preload: 'none', poster, 'aria-label': label });
  v.muted = true;
  v.dataset.src = src;
  v.dataset.group = group;
  // Browsers may reset the rate when a source loads; keep it pinned to the section speed.
  v.addEventListener('loadedmetadata', () => { v.playbackRate = speeds[group]; });
  v.addEventListener('play', () => { if (v.playbackRate !== speeds[group]) v.playbackRate = speeds[group]; });
  if (videoObserver) videoObserver.observe(v);
  else { v.src = src; playVideo(v); }
  return v;
}

function releaseVideos(root) {
  for (const v of $$('video', root)) {
    videoObserver?.unobserve(v);
    v.pause();
    v.removeAttribute('src');
    v.load();
  }
}

function videoCard({ src, poster, group, ratio, badge, badgeText, title, tag, text, same, ours }) {
  const video = makeVideo({ src, poster, group, label: `${title} — ${badgeText}` });
  const toggle = el('button', { type: 'button', 'aria-label': 'Pause video' });
  toggle.innerHTML = ICONS.pause;
  toggle.addEventListener('click', () => {
    if (video.paused) {
      video._userPaused = false;
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      playVideo(video);
      toggle.innerHTML = ICONS.pause; toggle.setAttribute('aria-label', 'Pause video');
    } else {
      video._userPaused = true;
      video.pause();
      toggle.innerHTML = ICONS.play; toggle.setAttribute('aria-label', 'Play video');
    }
  });
  const expand = el('button', { type: 'button', 'aria-label': 'Enlarge video' });
  expand.innerHTML = ICONS.expand;
  expand.addEventListener('click', () => openLightbox({ video: src, rate: speeds[group], label: title }));

  const meta = el('div', { class: 'vmeta' },
    el('div', { class: 'vmeta-top' }, modelName('strong', null, title), tag ? el('span', { class: 'vmeta-tag', text: tag }) : null),
    text ? el('p', { text }) : null,
    same ? el('span', { class: 'same', text: same }) : null
  );
  return el('article', { class: `vcard${ours ? ' ours' : ''}` },
    el('div', { class: 'vframe', style: `--ar:${ratio}` },
      video,
      el('span', { class: `vbadge ${badge}`, text: badgeText }),
      el('div', { class: 'vctrl' }, toggle, expand)
    ),
    meta
  );
}

function setupSpeed(groupName) {
  const box = $(`[data-speed-group="${groupName}"]`);
  if (!box) return;
  box.addEventListener('click', e => {
    const btn = e.target.closest('button[data-speed]');
    if (!btn) return;
    speeds[groupName] = Number(btn.dataset.speed);
    $$('button', box).forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    for (const v of $$(`video[data-group="${groupName}"]`)) {
      v.defaultPlaybackRate = speeds[groupName];
      v.playbackRate = speeds[groupName];
    }
  });
}

/* ================= Segmented controls & tabs ================= */

function placePill(seg) {
  let pill = $('.seg-pill', seg);
  if (!pill) { pill = el('span', { class: 'seg-pill', 'aria-hidden': 'true' }); seg.prepend(pill); }
  const active = $('[aria-selected="true"]', seg);
  if (!active) return;
  pill.style.left = active.offsetLeft + 'px';
  pill.style.width = active.offsetWidth + 'px';
}

function tablist(container, onSelect) {
  container.addEventListener('click', e => {
    const btn = e.target.closest('[role="tab"]');
    if (!btn || !container.contains(btn)) return;
    select(btn);
  });
  container.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const tabs = $$('[role="tab"]', container);
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus();
    select(tabs[next]);
  });
  function select(btn) {
    for (const t of $$('[role="tab"]', container)) {
      const on = t === btn;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    }
    if (container.classList.contains('seg')) placePill(container);
    // Keep the active chip visible inside a horizontally scrolling strip (mobile).
    if (container.scrollWidth > container.clientWidth) {
      container.scrollTo({ left: btn.offsetLeft - container.clientWidth / 2 + btn.offsetWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    onSelect(btn);
  }
  return select;
}

/* ================= Simulation explorer ================= */

const KIND_ORDER = ['success', 'retry', 'replan', 'bridgevla'];

function simClipCard(task, kind) {
  const c = task.clips[kind];
  const name = `${task.id}-${kind}`;
  const base = { src: `assets/videos/sim/${name}.mp4`, poster: `assets/posters/sim/${name}.jpg`, group: 'sim', ratio: '16/9' };
  const sd = c.sd ? ' Low-resolution recording.' : '';
  if (kind === 'success') {
    return videoCard({ ...base, ours: true, badge: 'success', badgeText: 'Success', title: 'LexiconVLA', tag: 'ONE PASS',
      text: 'Completed without any RETRY or REPLAN.' + sd });
  }
  if (kind === 'retry') {
    return videoCard({ ...base, ours: true, badge: 'recovered', badgeText: 'Recovered · RETRY', title: 'LexiconVLA', tag: `RETRY ×${c.retry}`,
      text: `A subtask fails; the planner issues RETRY${c.retry > 1 ? ` ${c.retry} times` : ''} and the task is completed.` + sd });
  }
  if (kind === 'replan') {
    const extra = c.retry ? ` together with ${c.retry} RETRY` : '';
    const planner = c.gemini ? ' Recorded with the Gemini-3.8-Flash planner from the planner ablation.' : '';
    return videoCard({ ...base, ours: true, badge: 'recovered', badgeText: 'Recovered · REPLAN', title: 'LexiconVLA', tag: c.retry ? `REPLAN + RETRY ×${c.retry}` : 'REPLAN',
      text: `The planner issues REPLAN and reorders the subtasks${extra}, then completes the task.` + planner + sd });
  }
  const pair = ['retry', 'replan'].find(k => task.clips[k] && !task.clips[k].noPair && task.clips[k].ep === c.ep);
  return videoCard({ ...base, badge: 'failure', badgeText: 'Failure', title: 'BridgeVLA', tag: 'BASELINE',
    text: 'The base policy without the lexicon fails this episode.' + sd,
    same: pair ? `Same initial scene as the ${pair.toUpperCase()} clip` : null });
}

function orderedKinds(task) {
  const kinds = KIND_ORDER.filter(k => task.clips[k]);
  // With four clips in a 2×2 grid, put the same-scene recovery next to the BridgeVLA failure.
  if (kinds.length === 4) {
    const fail = task.clips.bridgevla;
    const pair = ['retry', 'replan'].find(k => !task.clips[k].noPair && task.clips[k].ep === fail.ep);
    if (pair) {
      const other = pair === 'retry' ? 'replan' : 'retry';
      return ['success', other, pair, 'bridgevla'];
    }
  }
  return kinds;
}

function videoGrid(cards) {
  return el('div', { class: 'vgrid', 'data-n': String(cards.length) }, cards);
}

function renderSimTask(task) {
  const stage = $('#sim-stage');
  releaseVideos(stage);
  stage.replaceChildren();
  const kinds = orderedKinds(task);
  const split = task.split === 'unseen' ? `Policy-unseen task${task.group ? ' · ' + task.group : ''}` : 'Seen task';
  const better = task.sr[1] > task.sr[0];
  stage.append(
    el('div', { class: 'stage-head' },
      el('div', {},
        el('span', { class: 'stage-kicker', text: split }),
        el('h3', { text: task.name })
      ),
      el('div', { class: 'sr-box', 'aria-label': 'Per-task success rate' },
        el('div', { class: 'sr' }, el('span', { text: 'BridgeVLA' }), el('strong', { text: task.sr[0].toFixed(1) + '%' })),
        el('div', { class: `sr${better ? ' is-ours' : ''}` }, el('span', { text: 'LexiconVLA' }), el('strong', { text: task.sr[1].toFixed(1) + '%' })),
        el('span', { class: 'sr-note', text: 'Task success rate · 3 seeds × 25 episodes' })
      )
    ),
    videoGrid(kinds.map(k => simClipCard(task, k)))
  );
  restartSwap(stage);
}

function setupSim() {
  const chips = $('#sim-tasks');
  const splitSeg = $('#sim-split');
  let split = 'unseen';

  function renderChips() {
    $('#sim-explorer .dot-legend').hidden = split !== 'unseen';
    chips.replaceChildren(...SIM_TASKS.filter(t => t.split === split).map((t, i) => {
      const dots = split === 'unseen'
        ? el('span', { class: 'chip-dots', 'aria-hidden': 'true' }, KIND_ORDER.filter(k => t.clips[k]).map(k => el('i', { class: `k-${k}` })))
        : null;
      return el('button', { class: 'chip', role: 'tab', 'aria-selected': String(i === 0), tabindex: i === 0 ? '0' : '-1', 'data-task': t.id }, t.name, dots);
    }));
    renderSimTask(SIM_TASKS.find(t => t.split === split));
  }
  tablist(chips, btn => renderSimTask(SIM_TASKS.find(t => t.id === btn.dataset.task)));
  tablist(splitSeg, btn => { split = btn.dataset.split; renderChips(); });
  placePill(splitSeg);
  renderChips();
  setupSpeed('sim');
}

/* ================= Real-robot explorer ================= */

function realCard([model, file, outcome], ratio = '4/3') {
  const ours = model === 'LexiconVLA';
  const state = outcome || (ours ? 'success' : 'failure');
  const badge = state === 'recovered' ? 'recovered' : state;
  const badgeText = state === 'recovered' ? 'Recovered' : state === 'success' ? 'Success' : 'Failure';
  return videoCard({ src: `assets/videos/${file}.mp4`, poster: `assets/posters/real/${file}.jpg`, group: 'real', ratio,
    ours, badge, badgeText, title: model, tag: null });
}

function renderReal(demo) {
  const stage = $('#real-stage');
  releaseVideos(stage);
  stage.replaceChildren();
  const head = el('div', { class: 'stage-head' },
    el('div', {}, el('span', { class: 'stage-kicker', text: demo.kicker }), el('h3', { text: demo.label }), el('p', { text: demo.desc }))
  );
  if (demo.sr) {
    head.append(el('div', { class: 'sr-box', 'aria-label': 'Success rate over 10 trials' },
      el('div', { class: 'sr is-ours' }, el('span', { text: 'LexiconVLA' }), el('strong', { text: demo.sr[0] + '%' })),
      el('div', { class: 'sr' }, el('span', { text: 'BridgeVLA' }), el('strong', { text: demo.sr[1] + '%' })),
      el('div', { class: 'sr' }, modelName('span', null, PI), el('strong', { text: demo.sr[2] + '%' })),
      el('span', { class: 'sr-note', text: 'Success over 10 trials (Table 3)' })
    ));
  }
  stage.append(head);
  if (demo.groups) {
    for (const g of demo.groups) {
      stage.append(el('div', { class: 'vgroup' }, el('h4', { class: 'vgroup-title', text: g.title }),
        videoGrid(g.videos.map(v => realCard(v)))));
    }
  } else {
    stage.append(videoGrid(demo.videos.map(v => realCard(v))));
  }
  if (demo.note) stage.append(el('p', { class: 'stage-note', text: demo.note }));
  restartSwap(stage);
}

function setupReal() {
  const tabs = $('#real-tabs');
  tabs.replaceChildren(...REAL_DEMOS.map((d, i) =>
    el('button', { class: 'chip', role: 'tab', 'aria-selected': String(i === 0), tabindex: i === 0 ? '0' : '-1', 'data-demo': d.id }, d.label)));
  tablist(tabs, btn => renderReal(REAL_DEMOS.find(d => d.id === btn.dataset.demo)));
  renderReal(REAL_DEMOS[0]);
  setupSpeed('real');
}

function restartSwap(stage) {
  if (reduceMotion) return;
  stage.classList.remove('swap');
  void stage.offsetWidth;
  stage.classList.add('swap');
}

/* ================= Charts ================= */

function buildDumbbell() {
  const root = $('#dumbbell');
  const max = 40;
  const pct = v => (v / max) * 100 + '%';
  const tip = el('div', { class: 'tooltip', role: 'presentation' });
  const rows = UNSEEN_BACKBONES.map((r, i) => {
    const gain = r.ours - r.base;
    const plot = el('div', { class: 'db-plot' },
      [0, 10, 20, 30, 40].map(t => el('span', { class: 'db-grid', style: `left:${pct(t)}` })),
      el('span', { class: 'db-ref', style: `left:${pct(STRONGEST_BASELINE)}` }),
      el('span', { class: 'db-line', style: `left:${pct(r.base)};width:${pct(gain)}` }),
      el('span', { class: 'db-dot base', style: `left:${pct(r.base)}` }),
      el('span', { class: 'db-dot ours', style: `left:${pct(r.base)}`, 'data-to': pct(r.ours) })
    );
    const row = el('div', { class: `db-row${i === 0 ? ' is-top' : ''}`, tabindex: '0',
      'aria-label': `${r.name}: ${r.base.toFixed(2)}% to ${r.ours.toFixed(2)}% with LexiconVLA, plus ${gain.toFixed(2)} points` },
      el('span', { class: 'db-name', text: r.name }), plot, el('span', { class: 'db-gain', text: `+${gain.toFixed(2)}` }));
    const show = () => {
      tip.innerHTML = `<b>${r.name}</b><br>Base ${r.base.toFixed(2)}% → <b>${r.ours.toFixed(2)}%</b> with LexiconVLA`;
      tip.style.left = `calc(${row.offsetLeft}px + 168px)`;
      tip.style.top = row.offsetTop - 56 + 'px';
      tip.classList.add('show');
    };
    row.addEventListener('mouseenter', show);
    row.addEventListener('focus', show);
    row.addEventListener('mouseleave', () => tip.classList.remove('show'));
    row.addEventListener('blur', () => tip.classList.remove('show'));
    return row;
  });
  const axis = el('div', { class: 'db-axis', 'aria-hidden': 'true' }, el('span'),
    el('div', { class: 'db-axis-inner' }, [0, 10, 20, 30, 40].map(t => el('span', { style: `left:${pct(t)}`, text: t + (t === 40 ? '%' : '') }))), el('span'));
  root.append(...rows, axis, tip);
}

function animateDumbbell() {
  $$('#dumbbell .db-row').forEach((row, i) => {
    setTimeout(() => {
      $('.db-line', row).style.transform = 'scaleX(1)';
      const dot = $('.db-dot.ours', row);
      dot.style.left = dot.dataset.to;
    }, reduceMotion ? 0 : 150 + i * 120);
  });
}

function hbar([name, value, ours], max = 100) {
  return el('div', { class: `hb${ours ? ' is-ours' : ''}` },
    modelName('span', 'hb-name', name),
    el('div', { class: 'hb-track', role: 'img', 'aria-label': `${name === PI ? 'π0.5' : name}: ${value.toFixed(2)}%` },
      el('span', { class: 'hb-bar', style: `width:${(value / max) * 100}%` }),
      el('span', { class: 'hb-val', style: `left:${(value / max) * 100}%`, text: value.toFixed(value % 1 ? 2 : 1) })
    ));
}

function buildBars() {
  $('#ablation').append(...ABLATION.map(r => hbar(r, 40)));
  const real = $('#real-summary');
  for (const [group, rows] of REAL_SUMMARY) {
    real.append(el('div', { class: 'hb-group', text: group }), ...rows.map(r => hbar(r, 100)));
  }
}

function setupResultTabs() {
  const seg = $('#sim-results .seg');
  tablist(seg, btn => {
    const view = btn.dataset.view;
    $('#view-chart').hidden = view !== 'chart';
    $('#view-table').hidden = view !== 'table';
  });
  placePill(seg);
}

/* ================= Lightbox ================= */

const lightbox = $('#lightbox');
let lastFocus = null;

function openLightbox({ image, video, rate = 1, label = '' }) {
  lastFocus = document.activeElement;
  const body = $('.lightbox-body', lightbox);
  releaseVideos(body);
  body.replaceChildren();
  if (image) body.append(el('img', { src: image, alt: label }));
  if (video) {
    const v = el('video', { src: video, controls: true, autoplay: true, muted: true, loop: true, playsinline: true });
    v.muted = true;
    v.addEventListener('loadedmetadata', () => { v.playbackRate = rate; });
    body.append(v);
  }
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => lightbox.classList.add('open'));
  $('.lightbox-close', lightbox).focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    releaseVideos(lightbox);
    lightbox.hidden = true;
    $('.lightbox-body', lightbox).replaceChildren();
    lastFocus?.focus();
  }, reduceMotion ? 0 : 280);
}

lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target.closest('.lightbox-close')) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });
$$('[data-zoom]').forEach(btn => btn.addEventListener('click', () =>
  openLightbox({ image: btn.dataset.zoom, label: $('img', btn)?.alt || '' })));

/* ================= Scroll effects ================= */

function setupReveal() {
  const items = $$('.reveal');
  // Stagger siblings that enter together.
  const byParent = new Map();
  for (const it of items) {
    const list = byParent.get(it.parentElement) || [];
    list.push(it);
    byParent.set(it.parentElement, list);
  }
  for (const list of byParent.values()) list.forEach((it, i) => it.style.setProperty('--d', `${Math.min(i, 5) * 0.08}s`));

  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(it => it.classList.add('in'));
    countUp(true); animateDumbbell();
    return;
  }
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      io.unobserve(e.target);
      if (e.target.classList.contains('stat')) countUp();
      if (e.target.id === 'sim-results') animateDumbbell();
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  items.forEach(it => io.observe(it));
}

let counted = false;
function countUp(instant = false) {
  if (counted) return;
  counted = true;
  for (const node of $$('[data-count]')) {
    const target = Number(node.dataset.count);
    const decimals = Number(node.dataset.decimals || 0);
    const prefix = node.dataset.prefix || '';
    const fmt = v => prefix + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (instant) { node.textContent = fmt(target); continue; }
    const start = performance.now();
    const dur = 1600;
    const tick = now => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 4);
      node.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

function setupScroll() {
  const header = $('.site-header');
  const bar = $('.scroll-progress span');
  const links = $$('.nav-links a[href^="#"]');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle('scrolled', y > 24);
    let current = null;
    for (const s of sections) if (s.getBoundingClientRect().top <= innerHeight * 0.35) current = s;
    links.forEach(a => a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', () => $$('.seg').forEach(placePill));
  update();
}

function setupMenu() {
  const btn = $('.menu-toggle');
  const nav = $('#nav-links');
  const set = open => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => set(false)));
}

function setupCopy() {
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const text = $(btn.dataset.copy).textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const range = document.createRange();
      range.selectNodeContents($(btn.dataset.copy));
      getSelection().removeAllRanges();
      getSelection().addRange(range);
      document.execCommand('copy');
    }
    btn.textContent = 'Copied';
    btn.classList.add('done');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1800);
  }));
}

/* ================= Init ================= */

buildDumbbell();
buildBars();
setupResultTabs();
setupSim();
setupReal();
setupMenu();
setupCopy();
setupScroll();
setupReveal();
if (document.fonts) document.fonts.ready.then(() => $$('.seg').forEach(placePill));
