(() => {
  const revealTargets = document.querySelectorAll('[data-reveal-once]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!revealTargets.length || reduceMotion || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);
  document.documentElement.classList.add('motion-ready');

  revealTargets.forEach((target) => {
    window.ScrollTrigger.create({
      trigger: target,
      start: 'top 85%',
      once: true,
      onEnter: () => target.classList.add('is-visible')
    });
  });
})();
