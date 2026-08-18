document.querySelector('[data-year]').textContent = new Date().getFullYear();

const navigationLinks = [...document.querySelectorAll('.side-nav a')];
const sections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const setCurrentSections = (currentSections) => {
  const currentIds = new Set(currentSections.map((section) => section.id));
  navigationLinks.forEach((link) => {
    const isCurrent = currentIds.has(link.getAttribute('href').slice(1));
    link.classList.toggle('is-current', isCurrent);
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};

const updateNavigation = () => {
  // Use a narrow reading line so the active item changes where the eye is
  // actually reading, instead of switching early because a large card is
  // merely visible somewhere in the viewport.
  const bandTop = Math.max(88, Math.min(window.innerHeight * 0.32, 220));
  const bandBottom = bandTop + 14;
  const visibleSections = sections.filter((section) => {
    const { top, bottom } = section.getBoundingClientRect();
    return top < bandBottom && bottom > bandTop;
  });

  if (visibleSections.length) {
    setCurrentSections(visibleSections);
    return;
  }

  const nearest = sections.reduce((closest, section) => {
    const distance = Math.abs(section.getBoundingClientRect().top - bandTop);
    return !closest || distance < closest.distance ? { section, distance } : closest;
  }, null);
  if (nearest) setCurrentSections([nearest.section]);
};

let updatePending = false;
const requestNavigationUpdate = () => {
  if (updatePending) return;
  updatePending = true;
  window.requestAnimationFrame(() => {
    updatePending = false;
    updateNavigation();
  });
};

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) setCurrentSections([target]);
  });
});

window.addEventListener('scroll', requestNavigationUpdate, { passive: true });
window.addEventListener('resize', requestNavigationUpdate);
updateNavigation();
