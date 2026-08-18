document.querySelector('[data-year]').textContent = new Date().getFullYear();

const navigationLinks = [...document.querySelectorAll('.side-nav a')];
const observedSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  navigationLinks.forEach((link) => {
    link.classList.toggle('is-current', link.getAttribute('href') === `#${visible.target.id}`);
  });
}, { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.15, 0.4] });

observedSections.forEach((section) => sectionObserver.observe(section));
