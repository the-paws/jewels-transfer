const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

// Navigation
const nav = $('.site-nav');
window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 18), {passive:true});

const menuBtn = $('.menu-btn');
const navLinks = $('.nav-links');
menuBtn?.addEventListener('click', () => navLinks?.classList.toggle('open'));
$$('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks?.classList.remove('open')));

// Reveal on scroll
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    });
  }, {threshold:.12});
  revealItems.forEach(el => observer.observe(el));
} else revealItems.forEach(el => el.classList.add('in'));

// Active page link
const page = document.body.dataset.page;
if (page) $$('.nav-links a').forEach(a => {
  if (a.dataset.page === page) a.classList.add('active');
});

// Hero object moves subtly with scroll + pointer. This gives the 3D feeling without a framework.
const orb = $('.floating-orb');
if (orb) {
  let px = 0, py = 0;
  window.addEventListener('pointermove', (e) => {
    px = (e.clientX / window.innerWidth - .5) * 18;
    py = (e.clientY / window.innerHeight - .5) * 12;
  }, {passive:true});
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, 700);
    orb.style.transform = `translate3d(${px}px, ${py - y * .05}px, 0) rotate(${y * .045}deg) scale(${.98 + y/6000})`;
  }, {passive:true});
}

// Load a real personal photo when assets/avatar.jpg is added. Otherwise keep AM fallback.
const avatarWrap = $('.photo-placeholder');
const avatar = $('.photo-placeholder img');
if (avatar && avatarWrap) avatar.addEventListener('load', () => avatarWrap.classList.add('loaded'));

// Contact: copy to clipboard
$$('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const value = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      showToast('Скопировано: ' + value);
    } catch {
      showToast(value);
    }
  });
});

function showToast(message) {
  const toast = $('.toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

// Tiny command palette: press / anywhere.
const palette = $('.command-palette');
const paletteInput = $('.palette-head input');
const paletteRoutes = {
  '/': 'index.html',
  'home': 'index.html',
  'главная': 'index.html',
  'about': 'about.html',
  'обо мне': 'about.html',
  'skills': 'skills.html',
  'навыки': 'skills.html',
  'contact': 'contact.html',
  'contacts': 'contact.html',
  'контакты': 'contact.html'
};
function openPalette(){
  palette?.classList.add('open');
  palette?.setAttribute('aria-hidden', 'false');
  if (paletteInput) { paletteInput.value = ''; setTimeout(()=>paletteInput.focus(), 20); }
}
function closePalette(){
  palette?.classList.remove('open');
  palette?.setAttribute('aria-hidden', 'true');
}
function goFromPalette(){
  const value = (paletteInput?.value || '').trim().toLowerCase();
  if (!value) return;
  const route = paletteRoutes[value] || paletteRoutes[value.replace(/^\//, '')];
  if (route) { window.location.href = route; return; }
  showToast('Не найдено. Попробуй: about, skills или contact');
  paletteInput?.select();
}
paletteInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); goFromPalette(); }
  if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
});
palette?.addEventListener('click', (e) => { if (e.target === palette) closePalette(); });
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') { e.preventDefault(); openPalette(); }
  if (e.key === 'Escape') closePalette();
  // Easter egg: type RIMURU anywhere outside inputs.
  if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
    window.__keys = ((window.__keys || '') + e.key.toLowerCase()).slice(-6);
    if (window.__keys === 'rimuru') document.body.classList.toggle('slime-mode');
  }
});

// Stylized 'slime mode' Easter egg.
const style = document.createElement('style');
style.textContent = `
body.slime-mode { --cyan:#c9ff8f; --blue:#9effd5; }
body.slime-mode .brand-mark { border-color:rgba(201,255,143,.5); box-shadow:0 0 30px rgba(201,255,143,.15); }
body.slime-mode .floating-orb { filter:saturate(1.3) hue-rotate(35deg); }
`;
document.head.appendChild(style);
