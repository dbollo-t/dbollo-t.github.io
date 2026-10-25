/* Buscador del Manual de Servicio Ford T — Club del Ford T de Argentina.
 *
 * Busca en /datos/manual-servicio.json (texto del manual obtenido por OCR,
 * un registro por página del PDF de alta definición) con MiniSearch.
 * El mismo JSON lo usa Celeste desde n8n: si cambian los nombres de campo
 * hay que avisar (ver ficha 03 de la documentación del Club).
 *
 * Esta página solo dibuja: las reglas de búsqueda (tildes, raíces, sinónimos,
 * compuestos, puntajes y traducción para el foro) están en manual-motor.js,
 * el mismo archivo que usa Celeste. Cargar antes minisearch.min.js y manual-motor.js.
 */
(function () {
  // Las reglas de búsqueda viven en manual-motor.js, compartido con Celeste (n8n).
  var DATOS = '/datos/manual-servicio.json';
  var SINONIMOS = '/datos/manual-sinonimos.json'; // diccionario editable, compartido con Celeste
  var INGLES = '/datos/manual-ingles.json';       // glosario para buscar opiniones de otros usuarios (foro en inglés)
  var VISOR = '/tecnica/restauracion/manual-de-servicio/manual/';
  var MAX = 5;

  function escapar(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function patronResaltado(p) {
    return p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/a/g, '[aáàâä]').replace(/e/g, '[eéèêë]').replace(/i/g, '[iíìîï]')
      .replace(/o/g, '[oóòôö]').replace(/u/g, '[uúùûü]').replace(/n/g, '[nñ]');
  }

  // Fragmento de ~280 caracteres (la zona la elige el motor), con resaltado.
  function fragmento(texto, rango) {
    var html = escapar(texto.slice(rango.desde, rango.hasta));
    rango.resaltar.forEach(function (r) {
      html = html.replace(new RegExp('(' + patronResaltado(r) + '[\\wáéíóúüñ]*)', 'gi'), '<mark>$1</mark>');
    });
    html = html.replace(/<mark><mark>/g, '<mark>').replace(/<\/mark><\/mark>/g, '</mark>');
    return (rango.desde > 0 ? '… ' : '') + html + (rango.hasta < texto.length ? ' …' : '');
  }

  function rango(a) {
    if (!a || !a.length) { return ''; }
    return a.length === 1 ? ('Párrafo ' + a[0]) : ('Párrafos ' + a[0] + '–' + a[a.length - 1]);
  }

  // Se muestra la página del visor del sitio (la que ve el público); la del PDF
  // de alta definición queda en el JSON como "pag" pero no coincide con el visor.
  function ubicacion(it) {
    var partes = [it.visorPag || 'Sin página en el visor del sitio'];
    var r = rango(it.parr);
    if (r) { partes.push(r); }
    if (it.figs && it.figs.length) {
      partes.push(it.figs.length === 1 ? ('Fig. ' + it.figs[0]) : ('Figs. ' + it.figs.slice(0, 4).join(', ') + (it.figs.length > 4 ? '…' : '')));
    }
    return partes.join(' · ');
  }

  function iniciar(caja) {
    var form = caja.querySelector('form');
    var input = caja.querySelector('input[type="search"]');
    var salida = caja.querySelector('.manual-buscador__resultados');
    var estado = caja.querySelector('.manual-buscador__estado');
    var motor = null, cargando = null;

    function cargar() {
      if (cargando) { return cargando; }
      estado.textContent = 'Cargando el texto del manual…';
      // El diccionario de sinónimos y el glosario son opcionales: si no cargan, se busca igual.
      var sinon = fetch(SINONIMOS).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
      var ingl = fetch(INGLES).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
      cargando = Promise.all([fetch(DATOS).then(function (r) {
        if (!r.ok) { throw new Error('HTTP ' + r.status); }
        return r.json();
      }), sinon, ingl]).then(function (todo) {
        motor = ManualMotor.crear({ datos: todo[0], sinonimos: todo[1] || {}, glosario: todo[2] || {}, MiniSearch: MiniSearch });
        estado.textContent = '';
      }).catch(function (e) {
        estado.textContent = 'No se pudo cargar el texto del manual (' + e.message + '). Probá de nuevo en un rato.';
        cargando = null;
        throw e;
      });
      return cargando;
    }

    var mas = caja.querySelector('.manual-buscador__mas button');
    var foro = caja.querySelector('.manual-buscador__foro');
    function enlaceForo(q) {
      if (!foro) { return; }
      var f = motor.foro(q);
      foro.hidden = !f;
      if (f) { foro.href = f.url; }
    }
    // El enlace a Celeste lleva escrito el comienzo del mensaje y, si hubo una
    // búsqueda, cuál fue: así el registro de sugerencias sabe de qué se trata.
    var celeste = caja.querySelector('.manual-buscador__celeste');
    function enlaceCeleste(q) {
      if (!celeste) { return; }
      var txt = 'Sugerencia para el buscador del Manual' + (q ? ' (busqué: «' + q + '»)' : '') + ': ';
      celeste.href = 'https://wa.me/5493515330212?text=' + encodeURIComponent(txt);
    }
    var mostrados = 0, actuales = null;

    function itemHtml(it) {
      var ubic = escapar(ubicacion(it));
      var linea = (it.visor !== null && it.visor !== undefined)
        ? '<a class="manual-buscador__ubic" href="' + VISOR + '#manserv=' + it.visor + '" title="Ver la página en el manual">' + ubic + ' &rarr;</a>'
        : '<span class="manual-buscador__ubic">' + ubic + '</span>';
      return '<li class="manual-buscador__item">' + linea +
        (it.cap ? '<div class="manual-buscador__cap">' + escapar(it.cap) + '</div>' : '') +
        '<p class="manual-buscador__frag">' + fragmento(it.texto, motor.rangoFragmento(it.texto, actuales.grupos, actuales.frases)) + '</p></li>';
    }

    // Muestra los resultados de a MAX: "Ver más resultados" agrega los siguientes.
    function mostrarMas() {
      if (!actuales) { return; }
      var html = '';
      var hasta = Math.min(actuales.ordenados.length, mostrados + MAX);
      for (var k = mostrados; k < hasta; k++) {
        html += itemHtml(motor.registro(actuales.ordenados[k].id));
      }
      salida.insertAdjacentHTML('beforeend', html);
      mostrados = hasta;
      var faltan = actuales.ordenados.length - mostrados;
      if (mas) {
        mas.hidden = faltan <= 0;
        mas.textContent = 'Ver ' + Math.min(MAX, faltan) + ' resultados más (quedan ' + faltan + ')';
      }
    }
    if (mas) { mas.addEventListener('click', mostrarMas); }

    function buscar(q) {
      q = (q || '').trim();
      enlaceCeleste(q);
      salida.innerHTML = '';
      actuales = null;
      if (mas) { mas.hidden = true; }
      if (foro) { foro.hidden = true; }
      if (q.length < 3) { estado.textContent = 'Escribí al menos una palabra de 3 letras.'; return; }
      cargar().then(function () {
        var a = motor.analizar(q);
        if (a.modo === 'ninguno') {
          estado.textContent = 'No encontramos «' + q + '» en el manual. Probá con otra palabra (por ejemplo, el nombre de la pieza).';
          return;
        }
        var n = a.ordenados.length;
        var aviso = a.modo === 'todas' ? '' :
          a.modo === 'sin' ? ('«' + a.faltan.join('», «') + '» no figura en el manual; resultados con el resto de la búsqueda. ') :
          'Ninguna página tiene todas las palabras; estas tienen alguna. ';
        estado.textContent = aviso + (n === 1 ? '1 página encontrada:' : (n + ' páginas encontradas, de la más a la menos relevante:'));
        enlaceForo(q);
        mostrados = 0;
        actuales = a;
        mostrarMas();
        try { history.replaceState(null, '', '#buscar=' + encodeURIComponent(q)); } catch (e) { /* no crítico */ }
      });
    }

    form.addEventListener('submit', function (e) { e.preventDefault(); buscar(input.value); });
    input.addEventListener('focus', function () { cargar().catch(function () {}); }, { once: true });

    var m = location.hash.match(/^#buscar=(.+)$/);
    if (m) {
      try { input.value = decodeURIComponent(m[1]); } catch (e) { input.value = m[1]; }
      buscar(input.value);
    }
  }

  function initAll() {
    var cajas = document.querySelectorAll('.manual-buscador');
    for (var i = 0; i < cajas.length; i++) { iniciar(cajas[i]); }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initAll); }
  else { initAll(); }
})();
