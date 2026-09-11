(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const reveal = (root = document) => {
    const groups = root.querySelectorAll('[data-reveal-group]:not([data-reveal-ready])');

    groups.forEach((group) => {
      group.dataset.revealReady = 'true';

      if (!('IntersectionObserver' in window) || reducedMotion.matches) {
        group.classList.add('is-revealed');
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        group.classList.add('is-revealed');
        observer.disconnect();
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });

      observer.observe(group);
    });
  };

  const closeMobileMenu = (details) => {
    if (!details.open || details.classList.contains('is-closing')) return;
    if (reducedMotion.matches) {
      details.open = false;
      return;
    }

    details.classList.add('is-closing');
    window.setTimeout(() => {
      details.open = false;
      details.classList.remove('is-closing');
    }, 300);
  };

  const closeDisclosures = (event) => {
    document.querySelectorAll('[data-product-flyout][open], [data-mobile-menu][open]').forEach((details) => {
      if (event.type !== 'keydown' && details.contains(event.target)) return;
      if (details.matches('[data-mobile-menu]')) closeMobileMenu(details);
      else details.removeAttribute('open');
    });
  };

  reveal();

  document.querySelectorAll('[data-product-flyout]').forEach((details) => {
    const desktop = window.matchMedia('(min-width: 64rem)');
    details.addEventListener('mouseenter', () => {
      if (desktop.matches) details.open = true;
    });
    details.addEventListener('mouseleave', () => {
      if (desktop.matches && !details.contains(document.activeElement)) details.open = false;
    });
    details.addEventListener('focusin', () => {
      if (desktop.matches) details.open = true;
    });
    details.addEventListener('focusout', (event) => {
      if (desktop.matches && !details.contains(event.relatedTarget)) details.open = false;
    });
  });

  document.querySelectorAll('[data-mobile-menu]').forEach((details) => {
    const summary = details.querySelector(':scope > summary');
    if (!summary) return;

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (details.open) closeMobileMenu(details);
      else details.open = true;
    });
  });

  document.querySelectorAll('[data-search-clear]').forEach((button) => {
    const input = button.closest('form')?.querySelector('input[type="search"]');
    if (!input) return;

    const syncClearButton = () => {
      button.hidden = input.value.length === 0;
    };

    input.addEventListener('input', syncClearButton);
    button.addEventListener('click', () => {
      input.value = '';
      syncClearButton();
      input.focus();
    });
    syncClearButton();
  });

  document.addEventListener('shopify:section:load', (event) => reveal(event.target));
  document.addEventListener('click', closeDisclosures);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDisclosures(event);
  });
})();
