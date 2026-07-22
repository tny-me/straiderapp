// UDSG — comportamiento compartido del sitio (revelado en scroll, paralaje, enlace activo)
(function () {
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

  // paralaje sutil del diagrama del hero al mover el mouse (solo escritorio, respeta reduced-motion)
  const schematic = document.querySelector('.hero-schematic');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (schematic && !reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const panel = document.querySelector('.hero-panel');
    panel.addEventListener('mousemove', (e) => {
      const r = panel.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      schematic.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
    });
    panel.addEventListener('mouseleave', () => {
      schematic.style.transform = '';
    });
  }
})();
