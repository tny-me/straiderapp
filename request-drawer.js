// UDSG — panel lateral de "Iniciar un proyecto" (reemplaza la página /solicitar/)
(function () {
  const overlay = document.getElementById('reqOverlay');
  const drawer = document.getElementById('reqDrawer');
  if (!overlay || !drawer) return;

  const closeBtn = document.getElementById('reqClose');
  const fOrg = document.getElementById('fOrg');
  const fMail = document.getElementById('fMail');
  const fTipo = document.getElementById('fTipo');
  const fUrg = document.getElementById('fUrg');
  const fDesc = document.getElementById('fDesc');
  const count = document.getElementById('reqCount');
  const send = document.getElementById('reqSend');
  const msg = document.getElementById('reqMsg');

  function openDrawer(e) {
    if (e) e.preventDefault();
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => fOrg && fOrg.focus(), 350);
  }

  function closeDrawer() {
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.js-open-request').forEach(el => {
    el.addEventListener('click', openDrawer);
  });
  overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  if (fDesc && count) {
    fDesc.addEventListener('input', () => {
      count.textContent = fDesc.value.length + ' / 400';
    });
  }

  function mark(el, bad) { el.closest('.req-field').classList.toggle('err', bad); }

  if (send) {
    send.addEventListener('click', () => {
      const badOrg = !fOrg.value.trim();
      const badMail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fMail.value.trim());
      const badDesc = fDesc.value.trim().length < 20;
      mark(fOrg, badOrg); mark(fMail, badMail); mark(fDesc, badDesc);
      if (badOrg || badMail) { msg.style.color = '#FF6B6B'; msg.textContent = '> Revisa los campos marcados.'; return; }
      if (badDesc) { msg.style.color = '#FF6B6B'; msg.textContent = '> Describe tu necesidad con un poco más de detalle (mín. 20 caracteres).'; return; }
      send.disabled = true; send.textContent = 'Transmitiendo...';
      const folio = 'UDSG-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
      const subject = encodeURIComponent('Solicitud de proyecto — ' + fOrg.value.trim() + ' (' + folio + ')');
      const bodyText = 'Folio: ' + folio + '\n' +
        'Organización / Nombre: ' + fOrg.value.trim() + '\n' +
        'Correo de contacto: ' + fMail.value.trim() + '\n' +
        'Tipo de necesidad: ' + fTipo.value + '\n' +
        'Urgencia: ' + fUrg.value + '\n\n' +
        'Descripción de la necesidad:\n' + fDesc.value.trim();
      window.location.href = 'mailto:anthoniomoreno1@gmail.com?subject=' + subject + '&body=' + encodeURIComponent(bodyText);
      setTimeout(() => {
        msg.style.color = '#3DDC84';
        msg.textContent = '> Solicitud registrada con folio ' + folio + '. Te contactaremos pronto.';
        send.textContent = 'Solicitud enviada';
      }, 900);
    });
  }
})();
