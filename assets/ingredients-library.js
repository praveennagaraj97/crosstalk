(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const initialize = (root) => {
    const library = root.matches?.('[data-ingredients-library]') ? root : root.querySelector?.('[data-ingredients-library]');
    if (!library || library.dataset.ingredientsReady) return;
    library.dataset.ingredientsReady = 'true';

    const datasets = [...library.querySelectorAll('[data-product-dataset]')];
    const chooser = library.querySelector('[data-product-chooser]');
    const controls = library.querySelector('[data-library-controls]');
    const emptyState = library.querySelector('[data-library-empty]');
    const count = library.querySelector('[data-result-count]');
    const searchInputs = [...library.querySelectorAll('[data-ingredient-search]')];
    const searchClearButtons = [...library.querySelectorAll('[data-ingredient-search-clear]')];
    const filters = [...library.querySelectorAll('[data-ingredient-filter]')];
    const letters = [...library.querySelectorAll('[data-letter]')];
    const dialog = library.querySelector('[data-ingredient-dialog]');
    const dialogPanel = dialog?.querySelector('[data-dialog-panel]');
    let activeDataset = null;
    let activeFilter = 'all';
    let lastTrigger = null;
    let lockedScrollY = 0;

    const params = new URLSearchParams(window.location.search);
    const requestedHandle = params.get('product') || '';
    activeDataset = datasets.find((dataset) => dataset.dataset.productDataset === requestedHandle) || null;

    datasets.forEach((dataset) => { dataset.hidden = dataset !== activeDataset; });
    if (chooser) chooser.hidden = Boolean(activeDataset);
    if (controls) controls.hidden = !activeDataset;

    const normalize = (value) => (value || '').toLocaleLowerCase().trim();

    const applyFilters = () => {
      if (!activeDataset) return;
      const query = normalize(searchInputs[0]?.value);
      const cards = [...activeDataset.querySelectorAll('[data-ingredient-card]')];
      const visibleLetters = new Set();
      let visibleCount = 0;

      cards.forEach((card) => {
        const categoryMatch = activeFilter === 'all' || normalize(card.dataset.categories).split('|').includes(activeFilter);
        const searchMatch = !query || normalize(card.dataset.search).includes(query);
        const visible = categoryMatch && searchMatch;
        card.hidden = !visible;
        if (visible) {
          visibleCount += 1;
          visibleLetters.add(card.dataset.letter);
        }
      });

      activeDataset.querySelectorAll('[data-letter-group]').forEach((group) => {
        group.hidden = !visibleLetters.has(group.dataset.letterGroup);
      });

      letters.forEach((letter) => {
        const enabled = visibleLetters.has(letter.dataset.letter);
        letter.disabled = !enabled;
        letter.setAttribute('aria-disabled', String(!enabled));
      });

      if (count) count.textContent = `${visibleCount} ingredient${visibleCount === 1 ? '' : 's'}`;
      if (emptyState) emptyState.hidden = visibleCount !== 0;
    };

    const syncSearchControls = () => {
      searchClearButtons.forEach((button) => { button.hidden = !searchInputs.some((input) => input.value.length > 0); });
    };

    searchInputs.forEach((input) => {
      input.addEventListener('input', () => {
        searchInputs.forEach((peer) => { if (peer !== input) peer.value = input.value; });
        syncSearchControls();
        applyFilters();
      });
    });

    searchClearButtons.forEach((button) => {
      button.addEventListener('click', () => {
        searchInputs.forEach((input) => { input.value = ''; });
        syncSearchControls();
        applyFilters();
        button.closest('label')?.querySelector('[data-ingredient-search]')?.focus();
      });
    });

    filters.forEach((filter) => {
      filter.addEventListener('click', () => {
        activeFilter = filter.dataset.ingredientFilter;
        filters.forEach((peer) => {
          const active = peer === filter;
          peer.setAttribute('aria-pressed', String(active));
          peer.classList.toggle('is-active', active);
        });
        applyFilters();
      });
    });

    letters.forEach((letter) => {
      letter.addEventListener('click', () => {
        if (letter.disabled || !activeDataset) return;
        const target = activeDataset.querySelector(`[data-letter-group="${letter.dataset.letter}"]`);
        target?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
        target?.querySelector('h2')?.focus({ preventScroll: true });
      });
    });

    const closeDialog = () => {
      if (!dialog?.open || dialog.classList.contains('is-closing')) return;
      if (reducedMotion.matches) {
        dialog.close();
        document.body.classList.remove('ingredient-dialog-open');
        window.scrollTo({ top: lockedScrollY, behavior: 'auto' });
        lastTrigger?.focus({ preventScroll: true });
        return;
      }
      dialog.classList.add('is-closing');
      window.setTimeout(() => {
        dialog.close();
        dialog.classList.remove('is-closing');
        document.body.classList.remove('ingredient-dialog-open');
        window.scrollTo({ top: lockedScrollY, behavior: 'auto' });
        lastTrigger?.focus({ preventScroll: true });
      }, 300);
    };

    const populateDialog = (card) => {
      if (!dialog) return;
      const fields = ['name', 'categories-label', 'about', 'works', 'source', 'image'];
      fields.forEach((field) => {
        const target = dialog.querySelector(`[data-dialog-${field}]`);
        const source = card.querySelector(`[data-card-${field}]`);
        if (!target || !source) return;
        if (field === 'image') {
          target.src = source.currentSrc || source.src;
          target.alt = source.alt;
        } else {
          target.textContent = source.textContent.trim();
        }
      });
      const foundIn = dialog.querySelector('[data-dialog-products]');
      const references = card.querySelector('[data-card-products]');
      if (foundIn && references) foundIn.innerHTML = references.innerHTML;
      const science = dialog.querySelector('[data-dialog-science]');
      const scienceLinks = card.querySelector('[data-card-science]');
      if (science && scienceLinks) science.innerHTML = scienceLinks.innerHTML;
    };

    library.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-open-ingredient]');
      if (trigger) {
        event.preventDefault();
        const card = trigger.closest('[data-ingredient-card]');
        if (!card || !dialog) return;
        lastTrigger = trigger;
        lockedScrollY = window.scrollY;
        populateDialog(card);
        dialog.showModal();
        document.body.classList.add('ingredient-dialog-open');
        dialog.querySelector('[data-dialog-close]')?.focus({ preventScroll: true });
        window.scrollTo({ top: lockedScrollY, behavior: 'auto' });
        return;
      }
      if (event.target.matches('[data-dialog-close]') || event.target === dialog) closeDialog();
    });

    dialog?.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeDialog();
    });

    dialog?.querySelector('[data-dialog-close]')?.addEventListener('click', closeDialog);

    dialog?.addEventListener('close', () => {
      document.body.classList.remove('ingredient-dialog-open');
    });

    if (dialogPanel) {
      dialogPanel.addEventListener('click', (event) => event.stopPropagation());
    }

    syncSearchControls();
    applyFilters();
  };

  initialize(document);
  document.addEventListener('shopify:section:load', (event) => initialize(event.target));
})();
