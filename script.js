(() => {
  const monthNames = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${day}`;
  const readable = `${day} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  const titleMonth = monthNames[now.getMonth()].charAt(0).toUpperCase() + monthNames[now.getMonth()].slice(1);
  document.title = document.title.replace(/\|\s[^|]*\d{4}\s*$/, `| ${titleMonth} ${now.getFullYear()}`);
  document.querySelectorAll('[data-live-date]').forEach((node) => {
    node.textContent = readable;
    node.setAttribute('datetime', iso);
  });
  document.querySelectorAll('[data-live-year]').forEach((node) => { node.textContent = String(now.getFullYear()); });
  document.querySelectorAll('meta[name="date"], meta[property="og:updated_time"]').forEach((node) => node.setAttribute('content', iso));
  const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
  jsonLd.forEach((node) => {
    try {
      const data = JSON.parse(node.textContent);
      if (data.dateModified) { data.dateModified = iso; node.textContent = JSON.stringify(data); }
    } catch (error) { /* Static JSON-LD remains valid even when a browser cannot rewrite it. */ }
  });
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
