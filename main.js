const videoDirectory = 'assets/videos/';

const generalizationDemos = [
  {
    id: 'distractor',
    title: 'Distractor',
    description: 'Extra buttons, fruits, or unrelated objects are placed near task targets, testing whether execution stays bound to the instructed objects.',
    videos: [
      ['LexiconVLA', 'distractor-ours.mp4'],
      ['BridgeVLA', 'distractor-bridge.mp4'],
      ['π₀.₅', 'distractor-pi.mp4']
    ]
  },
  {
    id: 'category',
    title: 'Category',
    description: 'The drawer-placement task replaces the demonstrated wooden block with unseen object categories, including an orange or a lemon.',
    videos: [
      ['LexiconVLA', 'category-ours.mp4'],
      ['BridgeVLA', 'category-bridge.mp4'],
      ['π₀.₅', 'category-pi.mp4']
    ]
  },
  {
    id: 'instruction',
    title: 'Instruction',
    description: 'A paraphrased drawer-opening instruction tests whether the task can still be resolved into familiar atomic actions.',
    videos: [
      ['LexiconVLA', 'instruction-ours.mp4'],
      ['BridgeVLA', 'instruction-bridge.mp4'],
      ['π₀.₅', 'instruction-pi.mp4']
    ]
  },
  {
    id: 'height',
    title: 'Height',
    description: 'Objects in the pouring task are raised on supports, changing the grasp and pour poses.',
    videos: [
      ['LexiconVLA', 'height-ours.mp4'],
      ['BridgeVLA', 'height-bridge.mp4'],
      ['π₀.₅', 'height-pi.mp4']
    ]
  },
  {
    id: 'human',
    title: 'Human Interference',
    description: 'A person disrupts an ongoing task. The available clips show recovery and baseline behavior in two intervention scenarios.',
    groups: [
      {
        title: 'Drawer disturbed during execution',
        videos: [
          ['LexiconVLA', 'recovery-drawer-ours.mp4'],
          ['BridgeVLA', 'recovery-drawer-bridge.mp4']
        ]
      },
      {
        title: 'Object removed during grasp',
        videos: [
          ['LexiconVLA', 'recovery-block-ours.mp4'],
          ['π₀.₅', 'recovery-block-pi.mp4']
        ]
      }
    ]
  }
];

const additionalDemos = [
  {
    id: 'pouring',
    title: 'Real-only task · Pouring',
    description: 'A comparison on a task with no simulation counterpart.',
    videos: [
      ['LexiconVLA', 'pour-ours.mp4'],
      ['BridgeVLA', 'pour-bridge.mp4'],
      ['π₀.₅', 'pour-pi.mp4']
    ]
  },
  {
    id: 'self-recovery',
    title: 'Recovery from an execution error',
    description: 'A separate LexiconVLA rollout showing local recovery after its own mistake.',
    videos: [['LexiconVLA', 'self-recovery-ours.mp4']]
  }
];

const demoContainer = document.getElementById('demo-sections');
const videos = [];

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function makeVideoCard(model, file, scenario) {
  const card = element('article', `video-card${model === 'LexiconVLA' ? ' ours' : ''}`);
  const frame = element('div', 'video-frame');
  const outcome = model === 'LexiconVLA' ? 'success' : 'failure';
  const badge = element('span', `outcome-badge ${outcome}`, outcome === 'success' ? 'Success' : 'Failure');

  const video = document.createElement('video');
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  video.preload = 'metadata';
  video.playsInline = true;
  video.defaultPlaybackRate = 3;
  video.playbackRate = 3;
  video.setAttribute('aria-label', `${model} — ${scenario} real-robot demonstration`);
  video.dataset.src = `${videoDirectory}${file}`;
  video.addEventListener('loadedmetadata', () => {
    video.playbackRate = 3;
    if (video.dataset.userPaused !== 'true' && video.dataset.inViewport !== 'false') video.play().catch(() => {});
  });
  video.addEventListener('play', () => {
    video.playbackRate = 3;
    if (video.dataset.inViewport === 'false' || video.dataset.userPaused === 'true') video.pause();
  });
  video.addEventListener('ratechange', () => {
    if (video.playbackRate !== 3) video.playbackRate = 3;
  });
  videos.push(video);

  const toggle = element('button', 'video-toggle', 'Pause');
  toggle.type = 'button';
  toggle.setAttribute('aria-label', `Pause ${model} ${scenario} video`);
  toggle.addEventListener('click', () => {
    if (video.paused) {
      video.dataset.userPaused = 'false';
      video.playbackRate = 3;
      video.play().catch(() => {});
      toggle.textContent = 'Pause';
      toggle.setAttribute('aria-label', `Pause ${model} ${scenario} video`);
    } else {
      video.dataset.userPaused = 'true';
      video.pause();
      toggle.textContent = 'Play';
      toggle.setAttribute('aria-label', `Play ${model} ${scenario} video`);
    }
  });
  const caption = element('div', 'video-caption');
  caption.append(element('strong', '', model), element('span', '', '3× SPEED · LOOP'));
  frame.append(video, badge, toggle);
  card.append(frame, caption);
  return card;
}

function makeVideoGrid(items, scenario) {
  const grid = element('div', `video-grid${items.length === 2 ? ' pair' : items.length === 1 ? ' single' : ''}`);
  for (const [model, file] of items) grid.append(makeVideoCard(model, file, scenario));
  return grid;
}

function makeDemoSection(demo, index, additional = false) {
  const section = element('section', 'demo-section');
  section.id = `demo-${demo.id}`;
  const heading = element('div', 'demo-heading');
  const headingText = element('div');
  headingText.append(
    element('span', 'demo-eyebrow', additional ? 'MORE ROBOT ROLLOUTS' : 'UNSEEN GENERALIZATION'),
    element('h3', '', demo.title),
    element('p', '', demo.description)
  );
  heading.append(headingText, element('span', 'demo-number', String(index + 1).padStart(2, '0')));
  section.append(heading);
  if (demo.groups) {
    for (const group of demo.groups) {
      const subgroup = element('div', 'demo-subgroup');
      subgroup.append(element('h4', '', group.title), makeVideoGrid(group.videos, `${demo.title}: ${group.title}`));
      section.append(subgroup);
    }
    section.append(element('p', 'demo-disclaimer', 'These human-disturbance clips are qualitative and are excluded from the aggregate success rates. The supplied set has different baseline clips for the two interventions.'));
  } else {
    section.append(makeVideoGrid(demo.videos, demo.title));
  }
  return section;
}

generalizationDemos.forEach((demo, index) => demoContainer.append(makeDemoSection(demo, index)));
const moreHeading = element('div', 'section-intro additional-heading');
moreHeading.append(element('div', 'section-label', 'More demonstrations'), element('h2', 'section-title', 'Additional rollouts'));
demoContainer.append(moreHeading);
additionalDemos.forEach((demo, index) => demoContainer.append(makeDemoSection(demo, index, true)));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.dataset.inViewport = 'true';
        if (!video.src) video.src = video.dataset.src;
        if (video.dataset.userPaused !== 'true') {
          video.playbackRate = 3;
          video.play().catch(() => {});
        }
      } else {
        video.dataset.inViewport = 'false';
        video.pause();
      }
    }
  }, { rootMargin: '120px', threshold: 0.01 });
  videos.forEach(video => observer.observe(video));
} else {
  videos.forEach(video => { video.src = video.dataset.src; video.play().catch(() => {}); });
}

const menuButton = document.querySelector('.mobile-menu');
const navLinks = document.getElementById('nav-links');
menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}));
