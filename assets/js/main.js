/* Progressive enhancement: content, project code and Q&A work without JavaScript. */
document.documentElement.classList.add('js');
document.getElementById('year').textContent = new Date().getFullYear();
const toggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
if ('IntersectionObserver' in window) {
  const links = [...navigation.querySelectorAll('a')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -60% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.project-card')];
const search = document.getElementById('project-search');
let category = 'All projects';
function filterProjects() {
  const query = search.value.trim().toLocaleLowerCase();
  let count = 0;
  cards.forEach(card => {
    const visible = (category === 'All projects' || card.dataset.category === category) && card.dataset.search.toLocaleLowerCase().includes(query);
    card.hidden = !visible;
    if (visible) count++;
  });
  document.getElementById('project-count').textContent = `${count} of ${cards.length} projects shown`;
  document.getElementById('project-empty').hidden = count > 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  filterProjects();
}));
search.addEventListener('input', filterProjects);
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const code = document.getElementById(button.dataset.copy);
  const status = document.getElementById('copy-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(code.textContent);
    button.textContent = 'Copied!';
    status.textContent = 'Code copied to clipboard.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);
    button.textContent = 'Selected';
    status.textContent = 'Code selected. Use your device’s copy command to copy it.';
  }
  setTimeout(() => { button.textContent = 'Copy'; }, 2200);
}));

if (typeof window.addEventListener === 'function') {
  const progress = document.getElementById('scroll-progress');
  const navBar = document.querySelector('.nav');
  const updateScroll = () => {
    const docEl = document.documentElement;
    const max = docEl.scrollHeight - window.innerHeight;
    if (progress && max > 0) progress.style.width = `${Math.min(100, (window.scrollY / max) * 100)}%`;
    if (navBar) navBar.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
}
if ('IntersectionObserver' in window) {
  const groups = [
    '.stats-grid .stat',
    '.section-heading',
    '.project-card',
    '.ecosystem-card',
    '.about-grid > div',
    '.teach-cols .col',
    '.reach-card',
    '.smart-grid > div',
    '.step',
    '.faq-item',
    '.social-btn'
  ];
  const targets = [];
  groups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      el.classList.add('reveal');
      el.style.setProperty('--d', `${Math.min(idx * 0.06, 0.36)}s`);
      targets.push(el);
    });
  });
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
  targets.forEach(el => revealObserver.observe(el));
}
