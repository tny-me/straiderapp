// UDSG — comportamiento compartido del sitio (revelado en scroll, video decks, enlace activo)
(function () {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // resaltar el enlace de la página actual en el pie
  const here = location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  document.querySelectorAll('.footer-links a[href]').forEach(a => {
    const target = a.getAttribute('href').replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    if (target === here) a.classList.add('on');
  });

  // revelado de secciones al hacer scroll (progressive enhancement:
  // el contenido es visible por defecto; solo se oculta si esto logra correr)
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
    // red de seguridad: si algo queda sin revelar, lo mostramos igual
    setTimeout(() => reveals.forEach(el => el.classList.add('in')), 4000);
  }

  // videos de los "decks": solo reproducen mientras están visibles (ahorra datos/batería);
  // con reduced-motion se quedan en el poster, sin reproducir nunca
  const deckVideos = document.querySelectorAll('.deck-video');
  if (deckVideos.length && !reduceMotion) {
    if ('IntersectionObserver' in window) {
      const vio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const v = entry.target;
          if (entry.isIntersecting) {
            if (v.readyState === 0) v.load();
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      }, { threshold: 0.3 });
      deckVideos.forEach(v => vio.observe(v));
    } else {
      deckVideos.forEach(v => v.play().catch(() => {}));
    }
  }
})();
