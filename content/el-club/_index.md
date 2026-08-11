---
title: "El Club"
description: "Información sobre el Primer Club del Ford T de Argentina"
---
<div class="consulta-cuotas">
<iframe id="iframe-consulta-cuotas" src="https://script.google.com/macros/s/AKfycbxg9jd9YqETDZcrL-PLgWncncTeuD8wwIZcSKOTYkls9dE361r57UNn3i1UzWWfEfpq/exec" title="Consulta del estado de tu cuota social" style="display:block;width:100%;height:250px;border:0;overflow:hidden;transition:height .2s ease" scrolling="no" loading="lazy"></iframe>
</div>
<script>
/* El iframe es cross-origin: el navegador no nos deja medir su contenido desde
   acá. Por eso la página de Apps Script nos avisa su alto por postMessage cada
   vez que el contenido cambia (al mostrar el "consultando..." o el resultado),
   y acá simplemente ajustamos el height. Así el widget arranca compacto y crece
   sólo lo necesario, en vez de reservar un alto fijo que deja un hueco en
   blanco al principio.
   Se valida el origen del mensaje: Apps Script sirve el contenido del usuario
   desde *.googleusercontent.com, no desde script.google.com. */
(function () {
  var iframe = document.getElementById('iframe-consulta-cuotas');
  if (!iframe) return;
  function origenConfiable(origen) {
    return origen === 'https://script.google.com' ||
           /^https:\/\/[a-z0-9-]+\.googleusercontent\.com$/.test(origen);
  }
  window.addEventListener('message', function (ev) {
    if (!origenConfiable(ev.origin)) return;
    var datos = ev.data;
    if (!datos || datos.tipo !== 'fordt-alto-consulta-cuotas') return;
    var alto = parseInt(datos.alto, 10);
    if (!isFinite(alto) || alto < 80 || alto > 3000) return; // Descarta valores absurdos.
    iframe.style.height = alto + 'px';
  }, false);
})();
</script>
