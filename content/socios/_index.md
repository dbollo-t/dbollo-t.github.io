---
title: "Socios"
description: "Consulta de cuotas y credencial de socio del Primer Club del Ford T de Argentina"
---
<div class="consulta-cuotas">
<iframe id="iframe-consulta-cuotas" src="https://script.google.com/macros/s/AKfycbxg9jd9YqETDZcrL-PLgWncncTeuD8wwIZcSKOTYkls9dE361r57UNn3i1UzWWfEfpq/exec" title="Consulta del estado de tu cuota social" style="display:block;width:100%;height:250px;border:0;overflow:hidden;transition:height .2s ease" scrolling="no" loading="lazy"></iframe>
</div>
<script>
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
    if (!isFinite(alto) || alto < 80 || alto > 3000) return;
    iframe.style.height = alto + 'px';
  }, false);
})();
</script>
<hr class="emision-credencial__divisor">
<div class="emision-credencial">
<h2 class="emision-credencial__titulo">Emisión de credencial</h2>
<p>Si estás al día con tu cuota social, podés pedir tu credencial de socio del Club. Te vamos a pedir una foto tipo carnet.</p>
<div id="credencial-confirmar">
  <button id="credencial-si" class="emision-credencial__boton">Sí, quiero mi credencial</button>
</div>
<div id="credencial-paso-documento" style="display:none;">
<label class="emision-credencial__label" for="credencial-documento">Documento, cédula o pasaporte</label>
<div class="emision-credencial__fila">
<input type="text" id="credencial-documento" placeholder="Documento, cédula o pasaporte">
<button id="credencial-verificar" class="emision-credencial__boton">Verificar</button>
</div>
<p id="credencial-verificar-estado" class="emision-credencial__estado"></p>
</div>
<div id="credencial-formulario" style="display:none;">
<label class="emision-credencial__label" for="credencial-foto">Tu foto</label>
  <ul>
    <li>Formato JPG o PNG, hasta 2 MB</li>
    <li>Vertical, en lo posible proporción 3:4</li>
  </ul>
<input type="file" id="credencial-foto" accept="image/jpeg,image/png">
<button id="credencial-enviar" class="emision-credencial__boton">Enviar</button>
<p id="credencial-estado" class="emision-credencial__estado"></p>
</div>
<div id="credencial-compartir" style="display:none;">
<p>Tu credencial ya está lista.</p>
<div class="emision-credencial__compartir-imgs">
<a id="credencial-link-frente" href="#" target="_blank"><img id="credencial-img-frente" src="" alt="Frente de tu credencial"></a>
<a id="credencial-link-dorso" href="#" target="_blank"><img id="credencial-img-dorso" src="" alt="Dorso de tu credencial"></a>
</div>
<button id="credencial-compartir-boton" class="emision-credencial__boton emision-credencial__boton--compartir">
<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"></line><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"></line></svg>
<span>Compartir</span>
</button>
</div>
</div>
<p>Ejemplo</p>
<div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin:1rem 0;">
  <img src="/images/socios/credencial-ejemplo-frente.jpg" alt="Frente de la credencial de socio" style="max-width:100%;width:420px;border:1px solid #ddd;border-radius:8px;">
  <img src="/images/socios/credencial-ejemplo-dorso.jpg" alt="Dorso de la credencial de socio" style="max-width:100%;width:420px;border:1px solid #ddd;border-radius:8px;">
</div>
<script>
var CREDENCIAL_URL = 'https://script.google.com/macros/s/AKfycbxg9jd9YqETDZcrL-PLgWncncTeuD8wwIZcSKOTYkls9dE361r57UNn3i1UzWWfEfpq/exec';
document.getElementById('credencial-si').addEventListener('click', function () {
  document.getElementById('credencial-confirmar').style.display = 'none';
  document.getElementById('credencial-paso-documento').style.display = 'block';
});
document.getElementById('credencial-verificar').addEventListener('click', function () {
  var doc = document.getElementById('credencial-documento').value.trim();
  var estado = document.getElementById('credencial-verificar-estado');
  if (!doc) { estado.textContent = 'Ingresá tu documento.'; return; }
  estado.textContent = 'Consultando...';
  var nombreCallback = 'credencialCallback_' + Date.now();
  var script = document.createElement('script');
  window[nombreCallback] = function (data) {
    delete window[nombreCallback];
    script.parentNode.removeChild(script);
    if (data.ok && data.aptoParaCredencial) {
      estado.textContent = '';
      window.CREDENCIAL_NUMERO_SOCIO = data.numeroSocio;
      window.CREDENCIAL_DOCUMENTO = doc;
      document.getElementById('credencial-verificar').disabled = true;
      document.getElementById('credencial-documento').disabled = true;
      document.getElementById('credencial-formulario').style.display = 'block';
    } else {
      estado.textContent = data.error || 'No estás en condiciones de recibir la credencial (debe estar al día y ser socio Activo, Fundador o Vitalicio).';
    }
  };
  script.src = CREDENCIAL_URL + '?documento=' + encodeURIComponent(doc) + '&callback=' + nombreCallback;
  script.onerror = function () { estado.textContent = 'Hubo un error de conexión. Probá de nuevo.'; };
  document.body.appendChild(script);
});
document.getElementById('credencial-enviar').addEventListener('click', function () {
  var doc = document.getElementById('credencial-documento').value.trim();
  var input = document.getElementById('credencial-foto');
  var estado = document.getElementById('credencial-estado');
  if (!input.files.length) { estado.textContent = 'Elegí una foto.'; return; }
  var file = input.files[0];
  if (file.size > 2 * 1024 * 1024) { estado.textContent = 'La foto pesa más de 2 MB.'; return; }
  estado.textContent = 'Enviando...';
  var reader = new FileReader();
  reader.onload = function () {
    var base64 = reader.result.split(',')[1];
    fetch(CREDENCIAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      mode: 'no-cors',
      body: JSON.stringify({ documento: doc, imagenBase64: base64, mimeType: file.type })
    }).then(function () {
      estado.textContent = 'Foto recibida. Armando tu credencial...';
      buscarCredencialLista(window.CREDENCIAL_NUMERO_SOCIO, estado, 0);
    }).catch(function () {
      estado.textContent = 'Hubo un error de conexión. Probá de nuevo.';
    });
  };
  reader.readAsDataURL(file);
});
function base64AJpgBlob(b64) {
  var binario = atob(b64);
  var bytes = new Uint8Array(binario.length);
  for (var i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return new Blob([bytes], { type: 'image/jpeg' });
}
function buscarCredencialLista(numeroSocio, estado, intento) {
  var nombreCallback = 'credencialListaCallback_' + Date.now();
  var script = document.createElement('script');
  window[nombreCallback] = function (data) {
    delete window[nombreCallback];
    script.parentNode.removeChild(script);
    if (data.ok) {
      estado.textContent = '';
      var frenteBlob = base64AJpgBlob(data.frenteBase64);
      var dorsoBlob = base64AJpgBlob(data.dorsoBase64);
      var frenteUrl = URL.createObjectURL(frenteBlob);
      var dorsoUrl = URL.createObjectURL(dorsoBlob);
      document.getElementById('credencial-img-frente').src = frenteUrl;
      document.getElementById('credencial-img-dorso').src = dorsoUrl;
      document.getElementById('credencial-link-frente').href = frenteUrl;
      document.getElementById('credencial-link-dorso').href = dorsoUrl;
      window.CREDENCIAL_ARCHIVOS = [
        new File([frenteBlob], 'credencial-frente.jpg', { type: 'image/jpeg' }),
        new File([dorsoBlob], 'credencial-dorso.jpg', { type: 'image/jpeg' })
      ];
      document.getElementById('credencial-compartir').style.display = 'block';
    } else if (intento < 6) {
      setTimeout(function () { buscarCredencialLista(numeroSocio, estado, intento + 1); }, 5000);
    } else {
      estado.textContent = 'Tu foto se guardó bien, pero la credencial está tardando más de lo normal. Volvé a esta página en unos minutos.';
    }
  };
  // El documento va junto con el número de socio: el backend verifica que uno corresponda al otro antes de entregar la credencial.
  script.src = CREDENCIAL_URL + '?buscarCredencial=' + encodeURIComponent(numeroSocio) + '&documento=' + encodeURIComponent(window.CREDENCIAL_DOCUMENTO || '') + '&callback=' + nombreCallback;
  document.body.appendChild(script);
}
document.getElementById('credencial-compartir-boton').addEventListener('click', function () {
  var archivos = window.CREDENCIAL_ARCHIVOS || [];
  if (navigator.canShare && navigator.canShare({ files: archivos })) {
    navigator.share({ files: archivos, title: 'Mi credencial de socio', text: 'Primer Club del Ford T de Argentina' }).catch(function () {});
  } else {
    // El celular/navegador no soporta compartir archivos: se descargan las dos imágenes.
    archivos.forEach(function (archivo) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(archivo);
      a.download = archivo.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
});
</script>
