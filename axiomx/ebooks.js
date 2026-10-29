// Reading-room-only publications. Keep the shared systems catalogue unchanged.
(function () {
  const shared = Array.isArray(window.AXIOM_SYSTEMS) ? window.AXIOM_SYSTEMS : [];
  const lastNumber = shared.reduce(function (max, system) {
    return Math.max(max, Number(system.idx) || 0);
  }, 0);
  window.AXIOM_EBOOKS = [
    {
      id: 'mean',
      name: 'What I Mean When I Say',
      cat: 'Personal Lexicon',
      lede: 'Dr Non\'s personal dictionary across Thai, English, and Chinese. Read alphabetically, search for a word, or return for the daily entry: definitions as jokes, arguments, and confessions.',
      href: 'https://mean.nonarkara.org/'
    },
    {
      id: 'ninja',
      name: 'Ninja Innovation',
      cat: 'Public-Sector Practice',
      lede: 'A people-centric practice for the AI era. Manifesto, field notes, and toolkit: how public data, useful proxies, and small working systems can help a public servant solve a problem before the procurement cycle ends.',
      href: 'https://ninja.nonarkara.org/'
    },
    {
      id: 'slowdown',
      name: 'The Things You Can See Only When You Slow Down',
      cat: 'Essays and Art',
      lede: 'Ten movements on attention, solitude, making, and the discipline of doing less. Short essays, aphorisms, and public-domain art by Dr Non, to read in any order and at your own pace.',
      href: 'https://slowdown.nonarkara.org/'
    },
    {
      id: '100days',
      name: '100 Days of Solitude',
      cat: 'Memoir and Essays',
      lede: 'One hundred movements on solitude, memory, wanderings, and deliberate living by Dr Non. Short essays, reflections, and field notes written across Shanghai, Bangkok, and along the river.',
      href: 'https://100days.nonarkara.org/'
    },
    {
      id: '100',
      name: 'Two Layers · 100 Days of Non',
      cat: 'Speculative Fiction',
      lede: 'One layer is recorded, one layer is invented. A 44-year-old Bangkok architect in 2026 begins to suspect his world is rendered, while an archivist in 3026 re-enters the simulation to sit near him.',
      href: 'https://100.nonarkara.org/'
    }
  ].map(function (book, index) {
    return Object.assign({
      cluster: 'E-books', idx: String(lastNumber + index + 1),
      status: 'Live', cta: 'Read the e-book', img: null, alt: '',
      edition: null, arch: null
    }, book);
  });
}());
