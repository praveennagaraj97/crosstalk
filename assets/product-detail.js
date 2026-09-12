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
    const quantityMinus = section.querySelector('[data-quantity-minus]');
    const quantityPlus = section.querySelector('[data-quantity-plus]');
    const optionGroups = [...section.querySelectorAll('[data-option-group]')];
    const priceTargets = [...section.querySelectorAll('[data-product-price], [data-floating-price]')];
    const comparePrice = section.querySelector('[data-compare-price]');
    const addButtons = [...section.querySelectorAll('[data-add-to-cart]')];
    const primaryAddButton = section.querySelector('[data-add-to-cart]');
    const floatingAddButton = section.querySelector('[data-floating-add]');
    const floatingAddLabel = floatingAddButton?.querySelector('[data-floating-add-label]');
    const floatingCart = section.querySelector('[data-floating-cart]');
    const primaryPurchase = section.querySelector('[data-primary-purchase]');
    const stockTargets = [...section.querySelectorAll('[data-inventory-status], [data-floating-stock]')];
    const currency = window.Shopify?.currency?.active || 'USD';
    const addLabel = section.querySelector('[data-add-label]')?.textContent.trim() || 'Add to Cart';
    const checkoutLabel = section.dataset.checkoutLabel || 'Checkout';
    const soldOutLabel = section.dataset.soldOutLabel || 'Sold out';
    const inCartLabel = section.dataset.inCartLabel || 'In Cart';
    const cartUrl = section.dataset.cartUrl || '/cart';
    const cartVariantIds = new Set(JSON.parse(section.querySelector('[data-cart-variant-ids]')?.textContent || '[]').map(String));
    const galleryStage = section.querySelector('[data-gallery-stage]');
    const galleryThumbs = [...section.querySelectorAll('[data-gallery-thumb]')];
    let quantity = 1;
    let currentVariant;
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

    const quantityLimit = (variant) => {
      if (!variant) return 1;
      const ruleMax = Number(variant.quantity_rule?.max) || Infinity;
      const inventoryMax = variant.inventory_management && variant.inventory_policy === 'deny'
        ? Math.max(0, Number(variant.inventory_quantity) || 0)
        : Infinity;
      return Math.min(ruleMax, inventoryMax);
    };

    const syncQuantity = () => {
      const minimum = Number(currentVariant?.quantity_rule?.min) || 1;
      const maximum = quantityLimit(currentVariant);
      quantity = Math.min(maximum, Math.max(minimum, quantity));
      if (quantityInput) quantityInput.value = quantity;
      if (quantityOutput) quantityOutput.textContent = quantity;
      if (quantityMinus) quantityMinus.disabled = quantity <= minimum;
      if (quantityPlus) quantityPlus.disabled = quantity >= maximum;
    };

    const syncPurchaseState = (variant) => {
      const inCart = cartVariantIds.has(String(variant.id));
      addButtons.forEach((button) => {
        button.disabled = !variant.available;
        button.dataset.inCart = String(inCart);
        (button.querySelector('[data-add-label]') || button).textContent = !variant.available ? soldOutLabel : inCart ? inCartLabel : addLabel;
      });
      if (floatingAddButton) {
        floatingAddButton.disabled = !variant.available;
        floatingAddButton.dataset.inCart = String(inCart);
      }
      if (floatingAddLabel) floatingAddLabel.textContent = !variant.available ? soldOutLabel : inCart ? inCartLabel : checkoutLabel;
    };

    const selectVariant = () => {
      const selected = optionGroups.map((group) => group.querySelector('.is-selected')?.dataset.optionValue);
      const variant = variants.find((candidate) => candidate.options.every((value, index) => value === selected[index]));
      if (!variant) {
        addButtons.forEach((button) => { button.disabled = true; });
        if (floatingAddButton) floatingAddButton.disabled = true;
        return;
      }
      currentVariant = variant;
      if (idInput) idInput.value = variant.id;
      priceTargets.forEach((target) => { target.textContent = formatMoney(variant.price, currency); });
      if (comparePrice) {
        comparePrice.hidden = !(variant.compare_at_price > variant.price);
        comparePrice.textContent = variant.compare_at_price ? formatMoney(variant.compare_at_price, currency) : '';
      }
      syncPurchaseState(variant);
      syncQuantity();
      stockTargets.forEach((target) => { target.textContent = variant.available ? 'In Stock' : soldOutLabel; });
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
      quantity = next;
      syncQuantity();
    };
    quantityMinus?.addEventListener('click', () => setQuantity(quantity - (Number(currentVariant?.quantity_rule?.increment) || 1)));
    quantityPlus?.addEventListener('click', () => setQuantity(quantity + (Number(currentVariant?.quantity_rule?.increment) || 1)));

    form?.addEventListener('submit', (event) => {
      if (primaryAddButton?.dataset.inCart === 'true') {
        event.preventDefault();
        event.stopPropagation();
        window.location.assign(cartUrl);
      }
    }, true);

    floatingAddButton?.addEventListener('click', () => {
      if (floatingAddButton.dataset.inCart === 'true') {
        window.location.assign(cartUrl);
        return;
      }
      if (!primaryAddButton || primaryAddButton.disabled) return;
      form?.requestSubmit(primaryAddButton);
    });

    document.addEventListener('cart:updated', (event) => {
      cartVariantIds.clear();
      event.detail?.items?.forEach((item) => cartVariantIds.add(String(item.variant_id)));
      if (currentVariant) syncPurchaseState(currentVariant);
    });

    window.addEventListener('pageshow', async () => {
      try {
        const cart = await fetch('/cart.js', { headers: { Accept: 'application/json' } }).then((response) => response.json());
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
      } catch (error) {
        console.error(error);
      }
    });

    if (floatingCart && primaryPurchase) {
      let scrollFrame;
      const syncFloatingCart = () => {
        scrollFrame = undefined;
        const visible = primaryPurchase.getBoundingClientRect().bottom < 0;
        floatingCart.classList.toggle('is-visible', visible);
        floatingCart.setAttribute('aria-hidden', String(!visible));
      };
      const queueFloatingCartSync = () => {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(syncFloatingCart);
      };
      window.addEventListener('scroll', queueFloatingCartSync, { passive: true });
      window.addEventListener('resize', queueFloatingCartSync, { passive: true });
      syncFloatingCart();
    }

    selectVariant();

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
