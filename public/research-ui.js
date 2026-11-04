(function () {
  const header = document.querySelector('.masthead');
  if (header) {
    new ResizeObserver(function () {
      const offset = Math.ceil(header.getBoundingClientRect().height) + 8;
      document.documentElement.style.setProperty('--masthead-offset', offset + 'px');
      const target = document.getElementById('research');
      const top = target && target.getBoundingClientRect().top;
      if (location.hash === '#research' && top >= 0 && top < offset) {
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    }).observe(header);
  }
  const library = document.getElementById('research');
  const filter = library && library.querySelector('[data-research-filter]');
  if (!filter) return;
  filter.addEventListener('change', function () {
    library.querySelectorAll('[data-paper]').forEach(function (row) {
      row.hidden = Boolean(filter.value && row.dataset.system !== filter.value);
    });
  });
}());
