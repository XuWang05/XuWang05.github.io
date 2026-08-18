const root = document.documentElement;
const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-theme-toggle]');
const themeKey = 'xu-wang-theme';

const storedTheme = localStorage.getItem(themeKey);
if (storedTheme === 'dark' || storedTheme === 'light') {
  root.dataset.theme = storedTheme;
}

toggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = nextTheme;
  localStorage.setItem(themeKey, nextTheme);
});

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 18);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

revealItems.forEach((item) => revealObserver.observe(item));

const sections = document.querySelectorAll('main section[id]');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const navObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
  });
}, { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.15, 0.4] });

sections.forEach((section) => navObserver.observe(section));

document.querySelector('[data-year]').textContent = new Date().getFullYear();
