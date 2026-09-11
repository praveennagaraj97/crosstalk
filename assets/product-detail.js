(() => {
  const formatMoney = (cents, currency) => new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency, minimumFractionDigits: 2 }).format(cents / 100);

  const initialize = (root) => {
    const section = root.matches?.('[data-main-product]') ? root : root.querySelector?.('[data-main-product]');
    if (!section || section.dataset.productReady) return;
    section.dataset.productReady = 'true';
    const variants = JSON.parse(section.querySelector('[data-product-json]')?.textContent || '[]');
    const form = section.querySelector('[data-product-form]');
    const idInput = form?.querySelector('[data-variant-id]');
    const quantityInput = form?.querySelector('[data-form-quantity]');
    const quantityOutput = form?.querySelector('[data-quantity-output]');
    const optionGroups = [...section.querySelectorAll('[data-option-group]')];
    const priceTargets = [...section.querySelectorAll('[data-product-price], [data-floating-price]')];
    const comparePrice = section.querySelector('[data-compare-price]');
    const addButtons = [...section.querySelectorAll('[data-add-to-cart], [data-floating-add]')];
    const stockTargets = [...section.querySelectorAll('[data-inventory-status], [data-floating-stock]')];
    const currency = window.Shopify?.currency?.active || 'USD';
    const addLabel = section.querySelector('[data-add-label]')?.textContent.trim() || 'Add to Cart';
    const galleryStage = section.querySelector('[data-gallery-stage]');
    const galleryThumbs = [...section.querySelectorAll('[data-gallery-thumb]')];
    let quantity = 1;
    let pointerStartX;

    const showMedia = (id) => {
      if (!id) return;
      section.querySelectorAll('[data-media-id]').forEach((media) => {
        const active = String(media.dataset.mediaId) === String(id);
        media.hidden = !active;
        media.classList.toggle('opacity-0', !active);
        media.classList.toggle('pointer-events-none', !active);
      });
      section.querySelectorAll('[data-gallery-thumb]').forEach((thumb) => {
        const active = String(thumb.dataset.galleryThumb) === String(id);
        thumb.setAttribute('aria-pressed', String(active));
        thumb.classList.toggle('border-bitter-chocolate', active);
        thumb.classList.toggle('border-transparent', !active);
        thumb.classList.toggle('opacity-70', !active);
        if (active) thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      });
    };

    const moveGallery = (direction) => {
      if (!galleryThumbs.length) return;
      const current = galleryThumbs.findIndex((thumb) => thumb.getAttribute('aria-pressed') === 'true');
      const next = (Math.max(current, 0) + direction + galleryThumbs.length) % galleryThumbs.length;
      showMedia(galleryThumbs[next].dataset.galleryThumb);
    };

    const selectVariant = () => {
      const selected = optionGroups.map((group) => group.querySelector('.is-selected')?.dataset.optionValue);
      const variant = variants.find((candidate) => candidate.options.every((value, index) => value === selected[index]));
      if (!variant) return addButtons.forEach((button) => { button.disabled = true; });
      if (idInput) idInput.value = variant.id;
      priceTargets.forEach((target) => { target.textContent = formatMoney(variant.price, currency); });
      if (comparePrice) {
        comparePrice.hidden = !(variant.compare_at_price > variant.price);
        comparePrice.textContent = variant.compare_at_price ? formatMoney(variant.compare_at_price, currency) : '';
      }
      addButtons.forEach((button) => {
        button.disabled = !variant.available;
        (button.querySelector('[data-add-label]') || button).textContent = variant.available ? addLabel : 'Sold out';
      });
      stockTargets.forEach((target) => { target.textContent = variant.available ? '● In stock' : 'Sold out'; });
      showMedia(variant.featured_media?.id);
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    };

    optionGroups.forEach((group) => group.addEventListener('click', (event) => {
      const option = event.target.closest('[data-option-value]');
      if (!option) return;
      group.querySelectorAll('[data-option-value]').forEach((peer) => {
        const active = peer === option;
        peer.classList.toggle('is-selected', active);
        const ring = peer.querySelector('[data-swatch-ring]');
        if (ring) {
          ring.classList.toggle('border-bitter-chocolate', active);
          ring.classList.toggle('border-transparent', !active);
        } else {
          peer.classList.toggle('border-bitter-chocolate', active);
          peer.classList.toggle('bg-pecan-brown/5', active);
          peer.classList.toggle('border-toasted-almond', !active);
        }
        peer.setAttribute('aria-pressed', String(active));
      });
      selectVariant();
    }));
    section.querySelectorAll('[data-gallery-thumb]').forEach((thumb) => thumb.addEventListener('click', () => showMedia(thumb.dataset.galleryThumb)));
    galleryStage?.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      moveGallery(event.key === 'ArrowRight' ? 1 : -1);
    });
    galleryStage?.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointerStartX = event.clientX;
      galleryStage.setPointerCapture?.(event.pointerId);
    });
    galleryStage?.addEventListener('pointerup', (event) => {
      if (pointerStartX === undefined) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = undefined;
      if (Math.abs(distance) >= 45) moveGallery(distance < 0 ? 1 : -1);
    });
    galleryStage?.addEventListener('pointercancel', () => { pointerStartX = undefined; });
    const setQuantity = (next) => {
      quantity = Math.max(1, next);
      if (quantityInput) quantityInput.value = quantity;
      if (quantityOutput) quantityOutput.textContent = quantity;
    };
    section.querySelector('[data-quantity-minus]')?.addEventListener('click', () => setQuantity(quantity - 1));
    section.querySelector('[data-quantity-plus]')?.addEventListener('click', () => setQuantity(quantity + 1));

    const comparison = section.querySelector('[data-comparison-range]');
    comparison?.addEventListener('input', () => {
      const position = Number(comparison.value);
      const after = section.querySelector('[data-comparison-after]');
      const divider = section.querySelector('[data-comparison-divider]');
      if (after) after.style.width = `${100 - position}%`;
      if (divider) divider.style.left = `${position}%`;
    });

    section.querySelectorAll('.pdp-accordion').forEach((details) => {
      const summary = details.querySelector('summary');
      const body = details.querySelector('.pdp-accordion__body');
      let heightAnimation;
      let bodyAnimation;
      let closing = false;
      if (!summary || !body) return;
      summary.addEventListener('click', (event) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        event.preventDefault();
        heightAnimation?.cancel();
        bodyAnimation?.cancel();
        const shouldClose = details.open && !closing;
        const startHeight = `${details.getBoundingClientRect().height}px`;
        if (!shouldClose) {
          closing = false;
          details.open = true;
          details.classList.remove('is-closing');
        } else {
          closing = true;
          details.classList.add('is-closing');
        }
        const endHeight = shouldClose ? `${summary.offsetHeight}px` : `${summary.offsetHeight + body.scrollHeight}px`;
        details.style.overflow = 'hidden';
        heightAnimation = details.animate(
          { height: [startHeight, endHeight] },
          { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        );
        bodyAnimation = body.animate(
          shouldClose
            ? { opacity: [1, 0], transform: ['translateY(0)', 'translateY(-6px)'] }
            : { opacity: [0, 1], transform: ['translateY(-6px)', 'translateY(0)'] },
          { duration: shouldClose ? 220 : 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' },
        );
        heightAnimation.onfinish = () => {
          if (shouldClose) details.open = false;
          closing = false;
          details.classList.remove('is-closing');
          details.style.height = '';
          details.style.overflow = '';
          bodyAnimation?.cancel();
          heightAnimation = undefined;
          bodyAnimation = undefined;
        };
        heightAnimation.oncancel = () => {
          details.style.height = `${details.getBoundingClientRect().height}px`;
        };
      });
    });

  };
  initialize(document);
  document.addEventListener('shopify:section:load', (event) => initialize(event.target));
})();
