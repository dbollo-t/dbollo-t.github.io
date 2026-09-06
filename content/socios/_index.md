---
title: "Socios"
description: "Consulta de cuotas, credencial de socio y Documento de Identidad T del Primer Club del Ford T de Argentina"
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
<h2 class="emision-credencial__titulo">Emisión de credencial de socio</h2>
<p>Si estás al día con tu cuota social, podés pedir tu credencial de socio del Club. Te vamos a pedir una foto tipo carnet.</p>
<div id="credencial-confirmar">
  <button id="credencial-si" class="emision-credencial__boton">Sí, quiero mi credencial de socio</button>
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
<!-- ==== MÓDULO DEL DNI T — OCULTO HASTA EL LANZAMIENTO ====
     No se borró nada. Para publicarlo, borrá esta línea de apertura
     del div y su cierre, marcados con DNIT-OCULTO. -->
<div id="dnit-modulo" style="display:none"><!-- DNIT-OCULTO: quitar este div para lanzarlo -->
<hr class="emision-credencial__divisor">
<div class="emision-credencial">
<h2 class="emision-credencial__titulo">Emisión de Documento de Identidad T</h2>
<p>El DNI T es el documento de tu Ford T: lleva su nombre de bautismo, su número de identidad y su historia. Si estás al día con tu cuota social podés emitirlo. Te vamos a pedir una foto del auto.</p>
<div id="dnit-confirmar">
  <button id="dnit-si" class="emision-credencial__boton">Sí, quiero el DNI T de mi Ford T</button>
</div>
<div id="dnit-paso-documento" style="display:none;">
<label class="emision-credencial__label" for="dnit-documento">Documento, cédula o pasaporte</label>
<div class="emision-credencial__fila">
<input type="text" id="dnit-documento" placeholder="Documento, cédula o pasaporte">
<button id="dnit-verificar" class="emision-credencial__boton">Verificar</button>
</div>
<p id="dnit-verificar-estado" class="emision-credencial__estado"></p>
</div>
<div id="dnit-paso-auto" style="display:none;">
<label class="emision-credencial__label" for="dnit-auto">Tenés más de un Ford T registrado. ¿Para cuál querés el documento?</label>
<select id="dnit-auto"></select>
<button id="dnit-elegir" class="emision-credencial__boton">Continuar</button>
</div>
<div id="dnit-formulario" style="display:none;">
<p id="dnit-intro"></p>
<div class="dnit-campos">
<p><span class="dnit-fijo">Propietario:</span> <strong id="dnit-propietario"></strong></p>
<p><span class="dnit-fijo">Socio Nº:</span> <strong id="dnit-socio"></strong></p>
<p><span class="dnit-fijo">Localidad:</span> <strong id="dnit-localidad"></strong></p>
<p><span class="dnit-fijo">Nº de motor:</span> <strong id="dnit-motor"></strong></p>
<p><span class="dnit-fijo">Nacido el:</span> <strong id="dnit-nacido"></strong></p>
<p class="dnit-nota">Esos datos los lleva la tesorería del Club. Si alguno está mal, escribinos y lo corregimos.</p>
<label class="emision-credencial__label" for="dnit-nombre">Nombre de bautismo del auto</label>
<input type="text" id="dnit-nombre" maxlength="40" placeholder="Por ejemplo: El Caminante">
<label class="emision-credencial__label" for="dnit-carroceria">Tipo de carrocería</label>
<select id="dnit-carroceria">
<option value="">Elegí una…</option>
<option>Touring</option>
<option>Runabout / Roadster</option>
<option>Speedster</option>
<option>Torpedo</option>
<option>Coupé</option>
<option>Sedan Tudor</option>
<option>Sedan Fordor</option>
<option>Landaulet</option>
<option>Town Car</option>
<option>Woody</option>
<option>Pick-up</option>
<option>C-Cab</option>
<option>Camión</option>
<option>Delivery</option>
<option>Chasis</option>
<option>Solo motor</option>
</select>
<p><span class="dnit-fijo">Uso:</span> <strong id="dnit-uso">—</strong> <span class="dnit-nota">(se determina por la carrocería)</span></p>
<label class="emision-credencial__label" for="dnit-foto">Foto de tu Ford T</label>
  <ul>
    <li>Formato JPG o PNG, hasta 2 MB</li>
    <li>Apaisada, en lo posible el auto completo y de perfil</li>
    <li>La vamos a virar a sepia para el documento</li>
  </ul>
<input type="file" id="dnit-foto" accept="image/jpeg,image/png">
<button id="dnit-enviar" class="emision-credencial__boton">Confirmar y emitir</button>
<p id="dnit-estado" class="emision-credencial__estado"></p>
</div>
</div>
<div id="dnit-compartir" style="display:none;">
<p>Tu Documento de Identidad T ya está listo.</p>
<div class="emision-credencial__compartir-imgs">
<a id="dnit-link-frente" href="#" target="_blank"><img id="dnit-img-frente" src="" alt="Anverso de tu DNI T"></a>
<a id="dnit-link-dorso" href="#" target="_blank"><img id="dnit-img-dorso" src="" alt="Reverso de tu DNI T"></a>
</div>
<button id="dnit-compartir-boton" class="emision-credencial__boton emision-credencial__boton--compartir">
<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"></line><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"></line></svg>
<span>Compartir</span>
</button>
</div>
</div>
<p>Ejemplo</p>
<div style="margin:1rem 0;text-align:center;">
  <a href="/images/socios/dni-t-ejemplo.jpg" target="_blank" rel="noopener">
    <img src="/images/socios/dni-t-ejemplo.jpg" alt="Ejemplo del Documento de Identidad T: tapa, interior izquierda, interior derecha y contratapa" style="max-width:100%;width:860px;border:1px solid #ddd;border-radius:8px;">
  </a>
  <p class="dnit-nota" style="margin-top:0.5rem;">Se emite como librito de cuatro caras. Los datos del ejemplo son del Ford T número quince millones, el último de la serie. Tocá la imagen para verla en grande.</p>
</div>
<script>
var DNIT_URL = 'https://script.google.com/macros/s/AKfycbxg9jd9YqETDZcrL-PLgWncncTeuD8wwIZcSKOTYkls9dE361r57UNn3i1UzWWfEfpq/exec';
var DNIT = {};
function dnitEl(id) { return document.getElementById(id); }
function dnitJsonp(url, alListo, alError) {
  var cb = 'dnitCb_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  var script = document.createElement('script');
  window[cb] = function (data) { delete window[cb]; if (script.parentNode) script.parentNode.removeChild(script); alListo(data); };
  script.onerror = function () { delete window[cb]; if (script.parentNode) script.parentNode.removeChild(script); if (alError) alError(); };
  script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + cb;
  document.body.appendChild(script);
}
// El uso sale de la carrocería: los utilitarios son comerciales, el resto particular.
// Chasis y Solo motor no tienen carrocería, así que no tienen uso.
function dnitUso(carroceria) {
  var c = (carroceria || '').toLowerCase();
  if (!c) return '—';
  var sinUso = ['chasis', 'solo motor'];
  for (var j = 0; j < sinUso.length; j++) { if (c.indexOf(sinUso[j]) !== -1) return '—'; }
  var comercial = ['pick-up', 'pickup', 'camión', 'camion', 'delivery', 'woody', 'c-cab', 'c cab', 'tt'];
  for (var i = 0; i < comercial.length; i++) { if (c.indexOf(comercial[i]) !== -1) return 'Comercial'; }
  return 'Particular';
}
function dnitRefrescarUso() { dnitEl('dnit-uso').textContent = dnitUso(dnitEl('dnit-carroceria').value); }
dnitEl('dnit-carroceria').addEventListener('change', dnitRefrescarUso);
dnitEl('dnit-si').addEventListener('click', function () {
  dnitEl('dnit-confirmar').style.display = 'none';
  dnitEl('dnit-paso-documento').style.display = 'block';
});
dnitEl('dnit-verificar').addEventListener('click', function () {
  var doc = dnitEl('dnit-documento').value.trim();
  var estado = dnitEl('dnit-verificar-estado');
  if (!doc) { estado.textContent = 'Ingresá tu documento.'; return; }
  estado.textContent = 'Consultando...';
  dnitJsonp(DNIT_URL + '?dnit=1&documento=' + encodeURIComponent(doc), function (data) {
    if (!data.ok) { estado.textContent = data.error || 'No pudimos verificar tus datos.'; return; }
    if (!data.aptoParaCredencial) {
      estado.textContent = 'Para emitir el DNI T tenés que estar al día con la cuota social.';
      return;
    }
    estado.textContent = '';
    DNIT.documento = doc;
    DNIT.socio = data;
    dnitEl('dnit-verificar').disabled = true;
    dnitEl('dnit-documento').disabled = true;
    var autos = data.autos || [];
    if (autos.length > 1) {
      var sel = dnitEl('dnit-auto');
      sel.innerHTML = '';
      for (var i = 0; i < autos.length; i++) {
        var o = document.createElement('option');
        o.value = String(i);
        o.textContent = (autos[i].nombre || 'Sin nombre') + ' — motor ' + autos[i].motor + (autos[i].carroceria ? ' — ' + autos[i].carroceria : '');
        sel.appendChild(o);
      }
      dnitEl('dnit-paso-auto').style.display = 'block';
    } else {
      dnitMostrarFormulario(autos.length === 1 ? autos[0] : null);
    }
  }, function () { estado.textContent = 'Hubo un error de conexión. Probá de nuevo.'; });
});
dnitEl('dnit-elegir').addEventListener('click', function () {
  var i = parseInt(dnitEl('dnit-auto').value, 10) || 0;
  dnitEl('dnit-paso-auto').style.display = 'none';
  dnitMostrarFormulario(DNIT.socio.autos[i]);
});
function dnitMostrarFormulario(auto) {
  DNIT.auto = auto || {};
  DNIT.original = { nombre: DNIT.auto.nombre || '', carroceria: DNIT.auto.carroceria || '' };
  var s = DNIT.socio;
  dnitEl('dnit-propietario').textContent = s.nombre || '';
  dnitEl('dnit-socio').textContent = s.numeroSocio || '';
  dnitEl('dnit-localidad').textContent = s.localidad || '';
  dnitEl('dnit-motor').textContent = DNIT.auto.motor || '(no registrado)';
  dnitEl('dnit-nacido').textContent = DNIT.auto.nacido
    ? (DNIT.auto.nacido + (DNIT.auto.hora ? (' a las ' + DNIT.auto.hora) : ''))
    : '(no registrado)';
  dnitEl('dnit-nombre').value = DNIT.auto.nombre || '';
  dnitEl('dnit-carroceria').value = DNIT.auto.carroceria || '';
  dnitRefrescarUso();
  var puede = !!(DNIT.auto.motor && DNIT.auto.nacido);
  dnitEl('dnit-intro').textContent = puede
    ? 'Revisá los datos de tu Ford T. Corregí lo que haga falta y confirmá.'
    : 'Todavía no tenemos registrado tu Ford T. Cargá lo que sepas y lo damos de alta; el número de motor y la fecha de nacimiento los completa la tesorería, y después vas a poder emitir el documento.';
  dnitEl('dnit-foto').style.display = puede ? '' : 'none';
  dnitEl('dnit-enviar').textContent = puede ? 'Confirmar y emitir' : 'Enviar los datos a la tesorería';
  dnitEl('dnit-formulario').style.display = 'block';
}
dnitEl('dnit-enviar').addEventListener('click', function () {
  var estado = dnitEl('dnit-estado');
  var nombre = dnitEl('dnit-nombre').value.trim();
  var carroceria = dnitEl('dnit-carroceria').value;
  var puede = !!(DNIT.auto.motor && DNIT.auto.nacido);
  if (!nombre) { estado.textContent = 'Poné el nombre de bautismo de tu Ford T.'; return; }
  if (!carroceria) { estado.textContent = 'Elegí el tipo de carrocería.'; return; }
  var input = dnitEl('dnit-foto');
  var file = input.files.length ? input.files[0] : null;
  if (puede && !file) { estado.textContent = 'Elegí una foto de tu Ford T.'; return; }
  if (file && file.size > 2 * 1024 * 1024) { estado.textContent = 'La foto pesa más de 2 MB.'; return; }
  var cambios = [];
  if (nombre !== DNIT.original.nombre) cambios.push({ campo: 'Nombre del vehículo', antes: DNIT.original.nombre, ahora: nombre });
  if (carroceria !== DNIT.original.carroceria) cambios.push({ campo: 'Tipo de carrocería', antes: DNIT.original.carroceria, ahora: carroceria });
  estado.textContent = 'Enviando...';
  function enviar(base64, mime) {
    fetch(DNIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      mode: 'no-cors',
      body: JSON.stringify({ tipo: 'dnit', documento: DNIT.documento, motor: DNIT.auto.motor || '',
                             nombre: nombre, carroceria: carroceria, uso: dnitUso(carroceria),
                             cambios: cambios, imagenBase64: base64 || '', mimeType: mime || '' })
    }).then(function () {
      if (!puede) { estado.textContent = 'Listo, recibimos los datos. La tesorería va a completar el registro y te avisamos.'; return; }
      estado.textContent = 'Datos recibidos. Armando tu documento...';
      dnitBuscarListo(DNIT.auto.motor, estado, 0);
    }).catch(function () { estado.textContent = 'Hubo un error de conexión. Probá de nuevo.'; });
  }
  if (file) {
    var reader = new FileReader();
    reader.onload = function () { enviar(reader.result.split(',')[1], file.type); };
    reader.readAsDataURL(file);
  } else { enviar('', ''); }
});
function dnitBuscarListo(motor, estado, intento) {
  dnitJsonp(DNIT_URL + '?buscarDnit=' + encodeURIComponent(motor) + '&documento=' + encodeURIComponent(DNIT.documento), function (data) {
    if (data.ok) {
      estado.textContent = '';
      var fr = base64AJpgBlob(data.frenteBase64);
      var dr = base64AJpgBlob(data.dorsoBase64);
      var fu = URL.createObjectURL(fr), du = URL.createObjectURL(dr);
      dnitEl('dnit-img-frente').src = fu; dnitEl('dnit-link-frente').href = fu;
      dnitEl('dnit-img-dorso').src = du; dnitEl('dnit-link-dorso').href = du;
      window.DNIT_ARCHIVOS = [ new File([fr], 'dni-t-anverso.jpg', { type: 'image/jpeg' }),
                               new File([dr], 'dni-t-reverso.jpg', { type: 'image/jpeg' }) ];
      dnitEl('dnit-compartir').style.display = 'block';
    } else if (intento < 6) {
      setTimeout(function () { dnitBuscarListo(motor, estado, intento + 1); }, 5000);
    } else {
      estado.textContent = 'Tus datos se guardaron bien, pero el documento está tardando más de lo normal. Volvé a esta página en unos minutos.';
    }
  }, function () {
    if (intento < 6) { setTimeout(function () { dnitBuscarListo(motor, estado, intento + 1); }, 5000); }
    else { estado.textContent = 'Hubo un error de conexión. Volvé a intentar en unos minutos.'; }
  });
}
dnitEl('dnit-compartir-boton').addEventListener('click', function () {
  var archivos = window.DNIT_ARCHIVOS || [];
  if (navigator.canShare && navigator.canShare({ files: archivos })) {
    navigator.share({ files: archivos, title: 'El DNI T de mi Ford T', text: 'Primer Club del Ford T de Argentina' }).catch(function () {});
  } else {
    archivos.forEach(function (archivo) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(archivo);
      a.download = archivo.name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
  }
});
</script>
</div><!-- DNIT-OCULTO: fin -->
<hr class="emision-credencial__divisor">
<div class="emision-credencial">
<h2 class="emision-credencial__titulo">¿Cuándo nació tu Ford T?</h2>
<p>Con el número de motor te decimos el día en que salió de fábrica, y hasta a qué hora, más o menos.</p>
<div id="nac-paso-documento">
<label class="emision-credencial__label" for="nac-documento">Documento, cédula o pasaporte</label>
<div class="emision-credencial__fila">
<input type="text" id="nac-documento" placeholder="Documento, cédula o pasaporte">
<button id="nac-verificar" class="emision-credencial__boton">Verificar</button>
</div>
<p id="nac-verificar-estado" class="emision-credencial__estado"></p>
</div>
<div id="nac-paso-motor" style="display:none;">
<p id="nac-saludo"></p>
<label class="emision-credencial__label" for="nac-motor">Número de motor</label>
<div class="emision-credencial__fila">
<input type="text" id="nac-motor" placeholder="Por ejemplo: 12901937" inputmode="numeric">
<button id="nac-buscar" class="emision-credencial__boton">Buscar</button>
</div>
<p class="dnit-nota">Va sin la «T» de adelante y sin letras. Los puntos no molestan.</p>
<p id="nac-estado" class="emision-credencial__estado"></p>
<div id="nac-resultado" class="dnit-campos" style="display:none;">
<p id="nac-mensaje"></p>
<p id="nac-detalle" class="dnit-nota"></p>
</div>
</div>
</div>
<script>
var NAC_URL = 'https://script.google.com/macros/s/AKfycbxg9jd9YqETDZcrL-PLgWncncTeuD8wwIZcSKOTYkls9dE361r57UNn3i1UzWWfEfpq/exec';
var NAC = {};
function nacEl(id) { return document.getElementById(id); }
function nacJsonp(url, alListo, alError) {
  var cb = 'nacCb_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  var script = document.createElement('script');
  window[cb] = function (data) { delete window[cb]; if (script.parentNode) script.parentNode.removeChild(script); alListo(data); };
  script.onerror = function () { delete window[cb]; if (script.parentNode) script.parentNode.removeChild(script); if (alError) alError(); };
  script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + cb;
  document.body.appendChild(script);
}
nacEl('nac-verificar').addEventListener('click', function () {
  var doc = nacEl('nac-documento').value.trim();
  var estado = nacEl('nac-verificar-estado');
  if (!doc) { estado.textContent = 'Ingresá tu documento.'; return; }
  estado.textContent = 'Consultando...';
  nacJsonp(NAC_URL + '?nacimiento=1&documento=' + encodeURIComponent(doc), function (data) {
    if (!data.ok) { estado.textContent = data.error || 'No pudimos verificar tus datos.'; return; }
    estado.textContent = '';
    NAC.documento = doc;
    nacEl('nac-documento').disabled = true;
    nacEl('nac-verificar').disabled = true;
    nacEl('nac-saludo').textContent = data.saludo
      ? ('Hola ' + data.saludo + '. Decinos el número de motor y te contamos cuándo nació.')
      : 'Decinos el número de motor y te contamos cuándo nació.';
    nacEl('nac-paso-motor').style.display = 'block';
    nacEl('nac-motor').focus();
  }, function () { estado.textContent = 'Hubo un error de conexión. Probá de nuevo.'; });
});
function nacBuscar() {
  var motor = nacEl('nac-motor').value.trim();
  var estado = nacEl('nac-estado');
  var caja = nacEl('nac-resultado');
  if (!motor) { estado.textContent = 'Escribí el número de motor.'; return; }
  caja.style.display = 'none';
  estado.textContent = 'Buscando en la tabla de producción...';
  nacJsonp(NAC_URL + '?nacimiento=1&documento=' + encodeURIComponent(NAC.documento) + '&motor=' + encodeURIComponent(motor), function (data) {
    if (!data.ok) { estado.textContent = data.error || 'No pudimos hacer la consulta.'; return; }
    estado.textContent = '';
    nacEl('nac-mensaje').textContent = data.mensaje;
    var det = nacEl('nac-detalle');
    det.textContent = data.detalle || '';
    det.style.display = data.detalle ? 'block' : 'none';
    caja.style.display = 'block';
  }, function () { estado.textContent = 'Hubo un error de conexión. Probá de nuevo.'; });
}
nacEl('nac-buscar').addEventListener('click', nacBuscar);
nacEl('nac-motor').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); nacBuscar(); } });
nacEl('nac-documento').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); nacEl('nac-verificar').click(); } });
</script>
