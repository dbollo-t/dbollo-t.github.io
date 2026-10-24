/* Buscador del Manual de Servicio Ford T — Club del Ford T de Argentina.
 *
 * Busca en /datos/manual-servicio.json (texto del manual obtenido por OCR,
 * un registro por página del PDF de alta definición) con MiniSearch.
 * El mismo JSON lo usa Celeste desde n8n: si cambian los nombres de campo
 * hay que avisar (ver ficha 03 de la documentación del Club).
 *
 * La búsqueda ignora tildes y mayúsculas, tolera una letra de diferencia por
 * palabra (errores del OCR, "laten" encuentra "latón") y premia las páginas
 * cuyos párrafos figuran en el índice alfabético del propio manual bajo esas
 * palabras.
 */
(function () {
  var DATOS = '/datos/manual-servicio.json';
  var SINONIMOS = '/datos/manual-sinonimos.json'; // diccionario editable, compartido con Celeste
  var VISOR = '/tecnica/restauracion/manual-de-servicio/manual/';
  var MAX = 5;

  var VACIAS = ('de la el los las del en y a o u que se con por para al un una unos unas su sus es ' +
    'como lo le les ya no si mas muy este esta estos estas ese esa eso cual cuales cuando donde sobre entre ' +
    'hasta desde sin pues debe deben puede pueden hacer hace ser son fue era tambien cada otro otra otros otras').split(' ');
  var vacias = {};
  for (var i = 0; i < VACIAS.length; i++) { vacias[VACIAS[i]] = true; }

  function sinTildes(s) {
    return String(s || '').toLowerCase()
      .replace(/[áàâä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[íìîï]/g, 'i')
      .replace(/[óòôö]/g, 'o').replace(/[úùûü]/g, 'u').replace(/ñ/g, 'n');
  }

  // Raíz muy simple para el castellano: plural y algunas terminaciones verbales,
  // así "tornillos" encuentra "tornillo" y "ajústense" encuentra "ajuste".
  function raiz(t) {
    if (t.length > 6) { t = t.replace(/(ense|anse|ese|ase|selo|sela|selos|selas)$/, ''); }
    if (t.length > 4) { t = t.replace(/(es|s)$/, ''); }
    return t;
  }

  function procesar(term) {
    var t = sinTildes(term);
    if (t.length < 2 || vacias[t]) { return null; }
    if (/^\d+$/.test(t)) { return t; }
    return raiz(t);
  }

  // Palabras de acción (verbos y sustantivos de operación): pesan menos que el
  // sujeto. Se reconocen por la raíz o por la terminación verbal.
  var ACCIONES = ('ajust regul apriet apret instal quit desarm mont desmont coloc cambi revis limpi ' +
    'repar verific esmeril afloj calibr ensay lubric engras sold rectific alin reemplaz ' +
    'cuid manten insert retir saqu gir').split(' ');
  var NO_ACCION = { carter: 1, collar: 1, lugar: 1, motor: 1, par: 1 };
  function esAccion(w) {
    if (NO_ACCION[w]) { return false; }
    // armar / armado / desarme ("armadura" sola es la del generador: no es acción)
    if (/^(des)?arm(ar|ado|ada|ados|adas|e|en|ese|ense|ando|arse|arlo|arla)$/.test(w) || /^desarm/.test(w)) { return true; }
    for (var i = 0; i < ACCIONES.length; i++) { if (w.indexOf(ACCIONES[i]) === 0 && w.length - ACCIONES[i].length <= 6) { return true; } }
    return /(ando|iendo|ense|anse|arse|erse|irse|ese)$/.test(w) && w.length > 6 || /(ar|er|ir)$/.test(w) && w.length >= 6;
  }

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

  // Fragmento de ~280 caracteres en la zona donde aparecen juntas más palabras
  // de la búsqueda (o sus sinónimos), con resaltado.
  function fragmento(texto, grupos, frases) {
    var plano = sinTildes(texto);
    var todas = [];
    grupos.forEach(function (g) { g.forEach(function (r) { if (r.length >= 3) { todas.push(r); } }); });
    var mejor = 0, mejorN = -1;
    todas.forEach(function (r) {
      var pos = -1;
      while ((pos = plano.indexOf(r, pos + 1)) !== -1) {
        var v = plano.slice(Math.max(0, pos - 60), pos + 200);
        var n = grupos.filter(function (g) { return g.some(function (x) { return v.indexOf(x) !== -1; }); }).length;
        if (n > mejorN) { mejorN = n; mejor = pos; }
      }
    });
    // Si está la pieza compuesta ("eje delantero"), el fragmento se centra ahí.
    (frases || []).some(function (re) { var m = re.exec(plano); if (m) { mejor = m.index; return true; } return false; });
    var desde = Math.max(0, mejor - 80);
    var hasta = Math.min(texto.length, desde + 280);
    var html = escapar(texto.slice(desde, hasta));
    todas.forEach(function (r) {
      html = html.replace(new RegExp('(' + patronResaltado(r) + '[\\wáéíóúüñ]*)', 'gi'), '<mark>$1</mark>');
    });
    html = html.replace(/<mark><mark>/g, '<mark>').replace(/<\/mark><\/mark>/g, '</mark>');
    return (desde > 0 ? '… ' : '') + html + (hasta < texto.length ? ' …' : '');
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
    var motor = null, datos = null, cargando = null;

    function cargar() {
      if (cargando) { return cargando; }
      estado.textContent = 'Cargando el texto del manual…';
      // El diccionario de sinónimos es opcional: si no carga, se busca igual sin él.
      var sinon = fetch(SINONIMOS).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
      cargando = Promise.all([fetch(DATOS).then(function (r) {
        if (!r.ok) { throw new Error('HTTP ' + r.status); }
        return r.json();
      }), sinon]).then(function (todo) {
        var d = todo[0];
        d.sinonimos = todo[1] || {};
        datos = d;
        motor = new MiniSearch({
          fields: ['texto', 'idx', 'cap'],
          storeFields: ['id'],
          processTerm: procesar,
          searchOptions: {
            boost: { idx: 3, cap: 1.5 },
            fuzzy: function (t) { return t.length >= 5 ? 1 : 0; },
            prefix: function (t) { return t.length >= 4; },
            processTerm: procesar
          }
        });
        motor.addAll(d.items.map(function (it) {
          return { id: it.id, texto: it.texto, idx: (it.idx || []).join(' · '), cap: it.cap || '' };
        }));
        estado.textContent = '';
      }).catch(function (e) {
        estado.textContent = 'No se pudo cargar el texto del manual (' + e.message + '). Probá de nuevo en un rato.';
        cargando = null;
        throw e;
      });
      return cargando;
    }

    var mas = caja.querySelector('.manual-buscador__mas button');
    // El enlace a Celeste lleva escrito el comienzo del mensaje y, si hubo una
    // búsqueda, cuál fue: así el registro de sugerencias sabe de qué se trata.
    var celeste = caja.querySelector('.manual-buscador__celeste');
    function enlaceCeleste(q) {
      if (!celeste) { return; }
      var txt = 'Sugerencia para el buscador del Manual' + (q ? ' (busqué: «' + q + '»)' : '') + ': ';
      celeste.href = 'https://wa.me/5493515330212?text=' + encodeURIComponent(txt);
    }
    var mostrados = 0, actuales = null;

    function itemHtml(it, palabras) {
      var ubic = escapar(ubicacion(it));
      var linea = (it.visor !== null && it.visor !== undefined)
        ? '<a class="manual-buscador__ubic" href="' + VISOR + '#manserv=' + it.visor + '" title="Ver la página en el manual">' + ubic + ' &rarr;</a>'
        : '<span class="manual-buscador__ubic">' + ubic + '</span>';
      return '<li class="manual-buscador__item">' + linea +
        (it.cap ? '<div class="manual-buscador__cap">' + escapar(it.cap) + '</div>' : '') +
        '<p class="manual-buscador__frag">' + fragmento(it.texto, palabras, actuales && actuales.frases) + '</p></li>';
    }

    // Muestra los resultados de a MAX: "Ver más resultados" agrega los siguientes.
    function mostrarMas() {
      if (!actuales) { return; }
      var html = '';
      var hasta = Math.min(actuales.res.length, mostrados + MAX);
      for (var k = mostrados; k < hasta; k++) {
        html += itemHtml(actuales.porId[actuales.res[k].id], actuales.palabras);
      }
      salida.insertAdjacentHTML('beforeend', html);
      mostrados = hasta;
      var faltan = actuales.res.length - mostrados;
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
      if (q.length < 3) { estado.textContent = 'Escribí al menos una palabra de 3 letras.'; return; }
      cargar().then(function () {
        // 1) Palabras y sinónimos. Cada palabra forma un grupo con sus sinónimos
        //    (diccionario /datos/manual-sinonimos.json): "tapa" busca también "culata".
        var crudas = sinTildes(q).split(/[^a-z0-9ñ]+/).filter(Boolean);
        var sin = datos.sinonimos || {};
        function grupoDe(w) {
          var g = [raiz(w)];
          (sin[w] || sin[raiz(w)] || []).forEach(function (x) { var r = raiz(sinTildes(x)); if (g.indexOf(r) === -1) { g.push(r); } });
          return g;
        }
        // 2) Sujetos compuestos: "tapa de cilindros", "freno de mano", "eje del cigüeñal".
        //    Dos palabras unidas por "de" o "del" (con artículo o sin él) valen como una sola cosa.
        var items = [];   // {w, g, accion}
        var compuestos = []; // [índiceA, índiceB]
        var pendienteDe = false;
        for (var c = 0; c < crudas.length; c++) {
          var w = crudas[c];
          if (w === 'de' || w === 'del') { pendienteDe = items.length > 0; continue; }
          if (w === 'la' || w === 'las' || w === 'los' || w === 'el') { continue; }
          if (w.length < 3 || vacias[w]) { pendienteDe = false; continue; }
          var prevItem = items.length ? items[items.length - 1] : null;
          var juntoAnterior = prevItem && crudas[c - 1] === prevItem.w;
          items.push({ w: w, g: grupoDe(w), accion: esAccion(w) });
          // "tapa de cilindros" (con "de") o "eje delantero" (dos piezas seguidas)
          if (pendienteDe) { compuestos.push([items.length - 2, items.length - 1, 'de']); }
          else if (juntoAnterior && !prevItem.accion && !esAccion(w)) { compuestos.push([items.length - 2, items.length - 1, 'junto']); }
          pendienteDe = false;
        }
        if (!items.length) { items.push({ w: sinTildes(q), g: [sinTildes(q)], accion: false }); }
        // 3) Los sujetos (freno, culata, embrague) son obligatorios; las acciones
        //    (ajustar, regular, apriétense) solo suman puntos. Si la búsqueda es
        //    solo de acciones, todas cuentan como obligatorias.
        var sujetos = items.filter(function (x) { return !x.accion; });
        var acciones = items.filter(function (x) { return x.accion; });
        if (!sujetos.length) { sujetos = items; acciones = []; }
        var grupos = items.map(function (x) { return x.g; });
        function consulta(lista, modo) {
          return { combineWith: modo, queries: lista.map(function (x) { return x.g.length === 1 ? x.g[0] : { combineWith: 'OR', queries: x.g }; }) };
        }
        var res = motor.search(consulta(sujetos, 'AND'));
        var modo = 'todas', faltan = [];
        if (!res.length) {
          // Alguna pieza no figura en todo el manual ("tren"): se la deja de lado y
          // se buscan las demás, avisando. Recién si eso tampoco da, cualquier palabra.
          faltan = sujetos.filter(function (x) { return !motor.search(consulta([x], 'AND')).length; });
          var quedan = sujetos.filter(function (x) { return faltan.indexOf(x) === -1; });
          if (faltan.length && quedan.length) {
            res = motor.search(consulta(quedan, 'AND'));
            if (res.length) { modo = 'sin'; sujetos = quedan; }
          }
          if (!res.length) { res = motor.search(consulta(sujetos, 'OR')); modo = 'alguna'; }
          if (!res.length) { res = motor.search(consulta(items, 'OR')); modo = 'alguna'; }
        }
        if (!res.length) {
          estado.textContent = 'No encontramos «' + q + '» en el manual. Probá con otra palabra (por ejemplo, el nombre de la pieza).';
          return;
        }
        var porId = {};
        for (var i = 0; i < datos.items.length; i++) { porId[datos.items[i].id] = datos.items[i]; }
        function alternativa(g) { return '(?:' + g.map(function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')[a-z0-9ñ]*'; }
        var frases = compuestos.map(function (par) {
          // "junto" admite hasta dos palabras en el medio: "eje o puente trasero"
          var medio = par[2] === 'de' ? '\\s+(?:de|del)\\s+(?:(?:la|las|los|el)\\s+)?' : '(?:\\s+\\S+){0,2}?\\s+';
          return new RegExp(alternativa(items[par[0]].g) + medio + alternativa(items[par[1]].g));
        });
        // 4) Puntaje: frase compuesta presente ×4 (hasta ×6 si se repite); todos los sujetos cerca
        //    (a ~60 caracteres) ×2; alguna acción presente ×1,3.
        res.forEach(function (r) {
          var t = sinTildes(porId[r.id].texto);
          frases.forEach(function (re) {
            // ×4 si la pieza compuesta aparece; un poco más si aparece varias veces (tope ×6)
            var n = (t.match(new RegExp(re.source, 'g')) || []).length;
            if (n) { r.score *= Math.min(6, 3 + n); }
          });
          if (sujetos.length > 1) {
            var cerca = sujetos[0].g.some(function (r0) {
              var p0 = -1;
              while ((p0 = t.indexOf(r0, p0 + 1)) !== -1) {
                var v = t.slice(Math.max(0, p0 - 60), p0 + 60 + r0.length);
                if (sujetos.every(function (x) { return x.g.some(function (y) { return v.indexOf(y) !== -1; }); })) { return true; }
              }
              return false;
            });
            if (cerca) { r.score *= 2; }
          }
          if (acciones.some(function (x) { return x.g.some(function (y) { return t.indexOf(y) !== -1; }); })) { r.score *= 1.3; }
        });
        res.sort(function (a, b) { return b.score - a.score; });
        var aviso = modo === 'todas' ? '' :
          modo === 'sin' ? ('«' + faltan.map(function (x) { return x.w; }).join('», «') + '» no figura en el manual; resultados con el resto de la búsqueda. ') :
          'Ninguna página tiene todas las palabras; estas tienen alguna. ';
        estado.textContent = aviso + (res.length === 1 ? '1 página encontrada:' : (res.length + ' páginas encontradas, de la más a la menos relevante:'));
        mostrados = 0;
        actuales = { res: res, porId: porId, palabras: grupos, frases: frases };
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
