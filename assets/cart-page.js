(() => {
  const root = document.querySelector('[data-main-cart]');
  if (!root) return;

  const formatMoney = (cents, currency) => new Intl.NumberFormat(document.documentElement.lang || 'en', {
    style: 'currency',
    currency: currency || window.Shopify?.currency?.active || 'USD',
    minimumFractionDigits: 2,
  }).format(cents / 100);

  const updateGlobalCount = (count) => {
    document.querySelectorAll('[data-cart-count-badge]').forEach((badge) => {
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    });
  };

  const renderCart = (cart, article) => {
    const line = cart.items.find((item) => item.key === article.dataset.lineKey);
    if (!line) article.remove();
    else {
      const input = article.querySelector('input[type="number"]');
      const linePrice = article.querySelector('[data-cart-page-line-price]');
      if (input) input.value = line.quantity;
      if (linePrice) linePrice.textContent = formatMoney(line.final_line_price, cart.currency);
    }
    const subtotal = root.querySelector('[data-cart-page-subtotal]');
    const total = root.querySelector('[data-cart-page-total]');
    const count = root.querySelector('[data-cart-page-count]');
    if (subtotal) subtotal.textContent = formatMoney(cart.items_subtotal_price, cart.currency);
    if (total) total.textContent = formatMoney(cart.total_price, cart.currency);
    if (count) count.textContent = `${cart.item_count} ${cart.item_count === 1 ? 'Item' : 'Items'}`;
    updateGlobalCount(cart.item_count);
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
    if (cart.item_count === 0) window.location.replace(root.dataset.cartUrl || '/cart');
  };

  const changeQuantity = async (article, quantity) => {
    if (article.dataset.updating === 'true') return;
    article.dataset.updating = 'true';
    article.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: article.dataset.lineKey, quantity }),
      });
      if (!response.ok) throw new Error('Cart update failed');
      renderCart(await response.json(), article);
    } catch (error) {
      console.error(error);
      const cart = await fetch('/cart.js', { headers: { Accept: 'application/json' } }).then((response) => response.json());
      renderCart(cart, article);
    } finally {
      delete article.dataset.updating;
      article.removeAttribute('aria-busy');
    }
  };

  root.querySelectorAll('[data-cart-page-quantity]').forEach((control) => {
    const article = control.closest('[data-cart-page-item]');
    const input = control.querySelector('input[type="number"]');
    const minus = control.querySelector('[data-cart-page-minus]');
    const plus = control.querySelector('[data-cart-page-plus]');
    if (!input || !minus || !plus) return;

    const sync = (next) => {
      const min = Number(input.min || 0);
      const max = input.max === '' ? Infinity : Number(input.max);
      const step = Number(input.step || 1);
      const value = Math.min(max, Math.max(min, next));
      input.value = value;
      minus.disabled = value <= min;
      plus.disabled = value >= max;
    };

    const commit = (next) => {
      sync(next);
      changeQuantity(article, Number(input.value));
    };
    minus.addEventListener('click', () => commit(Number(input.value) - Number(input.step || 1)));
    plus.addEventListener('click', () => commit(Number(input.value) + Number(input.step || 1)));
    input.addEventListener('change', () => commit(Number(input.value)));
    sync(Number(input.value));
  });

  root.querySelectorAll('[data-cart-page-remove]').forEach((remove) => {
    remove.addEventListener('click', (event) => {
      event.preventDefault();
      changeQuantity(remove.closest('[data-cart-page-item]'), 0);
    });
  });
})();
