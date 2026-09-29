(() => {
  const widgetSelector = '[id^="shopify-block-"][id*="judge_me_reviews_review_widget"]';

  const applyResponsiveContainer = () => {
    document.querySelectorAll(widgetSelector).forEach((widget) => {
      if (widget.parentElement?.classList.contains('jdgm-theme-container')) return;

      const container = document.createElement('div');
      container.className = 'jdgm-theme-container container mx-auto px-4';
      widget.parentNode.insertBefore(container, widget);
      container.append(widget);
    });
  };

  applyResponsiveContainer();

  new MutationObserver(applyResponsiveContainer).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
