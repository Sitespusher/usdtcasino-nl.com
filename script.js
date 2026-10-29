(() => {
  const isPolish = document.documentElement.lang.toLowerCase().startsWith('pl');
  const locale = isPolish ? 'pl-PL' : 'nl-NL';

  const updateJsonLdDates = (value, iso) => {
    if (Array.isArray(value)) {
      value.forEach((item) => updateJsonLdDates(item, iso));
      return;
    }
    if (!value || typeof value !== 'object') return;
    Object.keys(value).forEach((key) => {
      if (key === 'dateModified') value[key] = iso;
      else updateJsonLdDates(value[key], iso);
    });
  };

  const refreshDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const iso = `${year}-${month}-${day}`;
    const readable = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(now);
    const monthYear = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric'
    }).format(now);
    const titleMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

    document.querySelectorAll('[data-live-date]').forEach((node) => {
      node.textContent = readable;
      node.setAttribute('datetime', iso);
    });
    document.querySelectorAll('[data-live-year]').forEach((node) => {
      node.textContent = String(year);
    });
    document.querySelectorAll('meta[name="date"], meta[name="last-modified"]').forEach((node) => {
      node.setAttribute('content', iso);
    });
    document.querySelectorAll('meta[property="og:updated_time"], meta[property="article:modified_time"]').forEach((node) => {
      node.setAttribute('content', now.toISOString());
    });

    document.title = document.title.replace(/\|\s[^|]*\d{4}\s*$/, `| ${titleMonthYear}`);

    document.querySelectorAll('script[type="application/ld+json"]').forEach((node) => {
      try {
        const data = JSON.parse(node.textContent);
        updateJsonLdDates(data, iso);
        node.textContent = JSON.stringify(data);
      } catch (error) {
        /* Static JSON-LD remains valid if a browser cannot rewrite it. */
      }
    });
  };

  refreshDate();
  window.setInterval(refreshDate, 60000);

  const catchfish = document.querySelector('#bonus-catchfish');
  const closeCatchfish = catchfish?.querySelector('.bonus-catchfish-close');
  if (catchfish) {
    window.setTimeout(() => {
      catchfish.classList.add('is-visible');
      catchfish.setAttribute('aria-hidden', 'false');
    }, 5000);
  }
  closeCatchfish?.addEventListener('click', () => {
    catchfish.classList.remove('is-visible');
    catchfish.classList.add('is-closing');
    catchfish.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => catchfish.remove(), 450);
  });
})();
