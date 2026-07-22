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

  // hero de video a todo el ancho: un clip a la vez, en carrusel con crossfade;
  // con reduced-motion se queda en el primer poster, sin reproducir ni rotar
  const heroVideos = document.querySelectorAll('.hero-mosaic .deck-video');
  const heroDots = document.querySelectorAll('.hero-dots span');
  if (heroVideos.length) {
    const showSlide = (i) => {
      const v = heroVideos[i];
      if (v.readyState === 0) v.load();
      v.play().catch(() => {});
      v.classList.add('is-active');
      if (heroDots[i]) heroDots[i].classList.add('is-active');
    };
    showSlide(0);
    if (heroVideos.length > 1 && !reduceMotion) {
      let active = 0;
      setInterval(() => {
        const prev = active;
        active = (active + 1) % heroVideos.length;
        showSlide(active);
        heroVideos[prev].classList.remove('is-active');
        if (heroDots[prev]) heroDots[prev].classList.remove('is-active');
        setTimeout(() => heroVideos[prev].pause(), 1700);
      }, 5500);
    }
  }
})();
