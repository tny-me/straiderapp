// UDSG — panel lateral de "Iniciar un proyecto" (reemplaza la página /solicitar/)
(function () {
  const overlay = document.getElementById('reqOverlay');
  const drawer = document.getElementById('reqDrawer');
  if (!overlay || !drawer) return;

  const closeBtn = document.getElementById('reqClose');
  const fOrg = document.getElementById('fOrg');
  const fMail = document.getElementById('fMail');
  const fPhone = document.getElementById('fPhone');
  const fTipo = document.getElementById('fTipo');
  const fUrg = document.getElementById('fUrg');
  const fDesc = document.getElementById('fDesc');
  const count = document.getElementById('reqCount');
  const send = document.getElementById('reqSend');
  const msg = document.getElementById('reqMsg');
  const success = document.getElementById('reqSuccess');
  const successFolio = document.getElementById('reqSuccessFolio');

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

  function resetForm() {
    [fOrg, fMail, fPhone, fDesc].forEach(el => { if (el) { el.value = ''; el.closest('.req-field').classList.remove('err'); } });
    if (fTipo) fTipo.selectedIndex = 0;
    if (fUrg) fUrg.selectedIndex = 0;
    if (count) count.textContent = '0 / 400';
    msg.textContent = '';
    send.disabled = false;
    send.textContent = 'Enviar solicitud';
    if (success) success.classList.remove('is-active');
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

  const API_URL = 'https://udsg-admin-api.udsg.workers.dev/api/solicitudes';

  if (send) {
    send.addEventListener('click', async () => {
      const badOrg = !fOrg.value.trim();
      const badMail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fMail.value.trim());
      const badPhone = !fPhone || !fPhone.value.trim();
      const badDesc = fDesc.value.trim().length < 20;
      mark(fOrg, badOrg); mark(fMail, badMail); if (fPhone) mark(fPhone, badPhone); mark(fDesc, badDesc);
      if (badOrg || badMail || badPhone) { msg.style.color = '#B3261E'; msg.textContent = '> Revisa los campos marcados.'; return; }
      if (badDesc) { msg.style.color = '#B3261E'; msg.textContent = '> Describe tu necesidad con un poco más de detalle (mín. 20 caracteres).'; return; }
      send.disabled = true; send.textContent = 'Transmitiendo...';
      msg.style.color = '#8A8A86'; msg.textContent = '';
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            org: fOrg.value.trim(),
            mail: fMail.value.trim(),
            phone: fPhone ? fPhone.value.trim() : '',
            tipo: fTipo.value,
            urgencia: fUrg.value,
            desc: fDesc.value.trim(),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || 'Error al enviar.');
        if (successFolio) successFolio.textContent = 'Folio ' + data.folio;
        if (success) success.classList.add('is-active');
        setTimeout(() => {
          closeDrawer();
          setTimeout(resetForm, 450);
        }, 1900);
      } catch (err) {
        msg.style.color = '#B3261E';
        msg.textContent = '> No se pudo enviar. Intenta de nuevo o escríbenos a acceso@udsg.dev.';
        send.disabled = false; send.textContent = 'Enviar solicitud';
      }
    });
  }
})();
