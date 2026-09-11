(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const syncNavigationProductContext = () => {
    const handle = document.querySelector('[data-navigation-product-handle]')?.dataset.navigationProductHandle;
    if (!handle) return;
    document.querySelectorAll('[data-ingredients-link]').forEach((link) => {
      const url = new URL(link.href, window.location.origin);
      url.searchParams.set('product', handle);
      link.href = `${url.pathname}${url.search}`;
    });
  };

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

  const initializeNavigationBubbles = (root = document) => {
    root.querySelectorAll('[data-navigation-links]:not([data-navigation-ready])').forEach((navigation) => {
      navigation.dataset.navigationReady = 'true';
      const bubble = navigation.querySelector('[data-navigation-bubble]');
      const items = [...navigation.querySelectorAll('[data-navigation-item]')];
      const activeItem = navigation.querySelector('[data-navigation-active]');
      if (!bubble || items.length === 0) return;

      const moveBubble = (item) => {
        if (!item) {
          bubble.classList.remove('is-visible');
          return;
        }
        const navigationBox = navigation.getBoundingClientRect();
        const itemBox = item.getBoundingClientRect();
        bubble.style.setProperty('--nav-bubble-x', `${itemBox.left - navigationBox.left}px`);
        bubble.style.setProperty('--nav-bubble-width', `${itemBox.width}px`);
        bubble.classList.add('is-visible');
      };

      items.forEach((item) => {
        item.addEventListener('pointerenter', () => moveBubble(item));
        item.addEventListener('focusin', () => moveBubble(item));
      });
      navigation.addEventListener('pointerleave', () => moveBubble(activeItem));
      navigation.addEventListener('focusout', (event) => {
        if (!navigation.contains(event.relatedTarget)) moveBubble(activeItem);
      });
      window.addEventListener('resize', () => moveBubble(activeItem), { passive: true });
      window.requestAnimationFrame(() => moveBubble(activeItem));
    });
  };

  syncNavigationProductContext();
  reveal();
  initializeNavigationBubbles();

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

  document.addEventListener('shopify:section:load', (event) => {
    reveal(event.target);
    initializeNavigationBubbles(event.target);
  });
  document.addEventListener('click', closeDisclosures);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDisclosures(event);
  });
})();
