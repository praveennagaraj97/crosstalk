(() => {
  const drawer = document.querySelector('[data-cart-drawer]');
  if (!drawer || drawer.dataset.cartDrawerReady) return;
  drawer.dataset.cartDrawerReady = 'true';

  const panel = drawer.querySelector('.cart-drawer__panel');
  const itemsTarget = drawer.querySelector('[data-cart-items]');
  const emptyTarget = drawer.querySelector('[data-cart-empty]');
  const summaryTarget = drawer.querySelector('[data-cart-summary]');
  const countTarget = drawer.querySelector('[data-cart-count]');
  const subtotalTarget = drawer.querySelector('[data-cart-subtotal]');
  const totalTarget = drawer.querySelector('[data-cart-total]');
  const statusTarget = drawer.querySelector('[data-cart-status]');
  const currency = drawer.dataset.currency || window.Shopify?.currency?.active || 'USD';
  const rootUrl = window.Shopify?.routes?.root || '/';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let trigger = null;
  let closeTimer;
  let busy = false;

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  const formatMoney = (cents) => new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency, minimumFractionDigits: 2 }).format(cents / 100);
  const itemCountLabel = (count) => `${count} ${count === 1 ? 'Item' : 'Items'}`;

  const itemMarkup = (item, index) => {
    const image = item.image ? `<img class="size-full object-cover mix-blend-multiply" src="${escapeHtml(item.image)}&width=240" width="200" height="250" alt="${escapeHtml(item.product_title)}">` : '';
    const variant = item.variant_title && item.variant_title !== 'Default Title' ? `<p class="cart-drawer__variant">${escapeHtml(item.variant_title)}</p>` : '';
    return `<article class="cart-drawer__item" data-cart-line="${index + 1}">
      <a class="cart-drawer__media" href="${escapeHtml(item.url)}" tabindex="-1">${image}</a>
      <div class="cart-drawer__item-content">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0"><h3 class="cart-drawer__item-title"><a href="${escapeHtml(item.url)}">${escapeHtml(item.product_title)}</a></h3>${variant}</div>
          <button class="cart-drawer__remove" type="button" data-cart-remove aria-label="${escapeHtml(drawer.dataset.removeLabel)} ${escapeHtml(item.product_title)}"><span aria-hidden="true">×</span>${escapeHtml(drawer.dataset.removeLabel)}</button>
        </div>
        <div class="flex items-center justify-between gap-4">
          <div class="cart-drawer__quantity" aria-label="Quantity"><button type="button" data-cart-quantity="${Math.max(0, item.quantity - 1)}" aria-label="Decrease ${escapeHtml(item.product_title)} quantity">−</button><output>${item.quantity}</output><button type="button" data-cart-quantity="${item.quantity + 1}" aria-label="Increase ${escapeHtml(item.product_title)} quantity">+</button></div>
          <strong class="cart-drawer__line-price">${formatMoney(item.final_line_price)}</strong>
        </div>
      </div>
    </article>`;
  };

  const render = (cart) => {
    itemsTarget.innerHTML = cart.items.map(itemMarkup).join('');
    countTarget.textContent = itemCountLabel(cart.item_count);
    subtotalTarget.textContent = formatMoney(cart.items_subtotal_price);
    totalTarget.textContent = formatMoney(cart.total_price);
    emptyTarget.classList.toggle('hidden', cart.item_count > 0);
    summaryTarget.classList.toggle('hidden', cart.item_count === 0);
    statusTarget.textContent = itemCountLabel(cart.item_count);
    document.querySelectorAll('[data-cart-count-badge]').forEach((badge) => {
      badge.textContent = cart.item_count;
      badge.classList.toggle('hidden', cart.item_count === 0);
      const cartLink = badge.closest('a[href]');
      if (cartLink) cartLink.setAttribute('aria-label', `Cart, ${itemCountLabel(cart.item_count)}`);
    });
  };

  const fetchCart = async () => {
    const response = await fetch(`${rootUrl}cart.js`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Cart request failed');
    return response.json();
  };

  const refreshCart = async () => {
    try {
      render(await fetchCart());
    } catch (error) {
      statusTarget.textContent = drawer.dataset.errorMessage;
    }
  };

  const show = (source, refresh = true) => {
    trigger = source || document.activeElement;
    window.clearTimeout(closeTimer);
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('cart-drawer-open');
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      drawer.dataset.state = 'open';
      panel.focus({ preventScroll: true });
    }));
    if (refresh) {
      drawer.setAttribute('aria-busy', 'true');
      refreshCart().finally(() => drawer.removeAttribute('aria-busy'));
    }
  };

  const hide = () => {
    if (drawer.hidden) return;
    drawer.dataset.state = 'closing';
    document.documentElement.classList.remove('cart-drawer-open');
    const finish = () => {
      drawer.hidden = true;
      drawer.setAttribute('aria-hidden', 'true');
      delete drawer.dataset.state;
      trigger?.focus?.({ preventScroll: true });
    };
    if (reducedMotion.matches) finish();
    else closeTimer = window.setTimeout(finish, 310);
  };

  const changeLine = async (line, quantity) => {
    if (busy) return;
    busy = true;
    drawer.classList.add('is-busy');
    try {
      const response = await fetch(`${rootUrl}cart/change.js`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ line, quantity }) });
      if (!response.ok) throw new Error('Cart update failed');
      render(await response.json());
    } catch (error) {
      statusTarget.textContent = drawer.dataset.errorMessage;
    } finally {
      busy = false;
      drawer.classList.remove('is-busy');
    }
  };

  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-cart-drawer-trigger]');
    if (opener) { event.preventDefault(); show(opener); return; }
    if (event.target.closest('[data-cart-drawer-close]')) { hide(); return; }
    const line = event.target.closest('[data-cart-line]');
    if (!line) return;
    const quantityButton = event.target.closest('[data-cart-quantity]');
    const removeButton = event.target.closest('[data-cart-remove]');
    if (quantityButton) changeLine(Number(line.dataset.cartLine), Number(quantityButton.dataset.cartQuantity));
    if (removeButton) changeLine(Number(line.dataset.cartLine), 0);
  });

  document.addEventListener('submit', async (event) => {
    const addButton = event.submitter?.closest?.('[data-add-to-cart]');
    if (!addButton) return;
    event.preventDefault();
    if (busy) return;
    busy = true;
    addButton.disabled = true;
    drawer.classList.add('is-busy');
    drawer.setAttribute('aria-busy', 'true');
    show(addButton, false);
    try {
      const response = await fetch(`${rootUrl}cart/add.js`, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(event.target) });
      if (!response.ok) throw new Error('Cart add failed');
      await refreshCart();
    } catch (error) {
      statusTarget.textContent = drawer.dataset.errorMessage;
    } finally {
      busy = false;
      addButton.disabled = false;
      drawer.classList.remove('is-busy');
      drawer.removeAttribute('aria-busy');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (drawer.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); hide(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...drawer.querySelectorAll('a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])')].filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
