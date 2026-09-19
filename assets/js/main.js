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
