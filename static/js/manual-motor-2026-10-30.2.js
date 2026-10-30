/* Motor de búsqueda del Manual de Servicio Ford T — Club del Ford T de Argentina.
 *
 * Reglas de búsqueda compartidas entre la web (manual-buscador.js) y Celeste (n8n).
 * No toca la página, no hace llamadas de red y no guarda nada: recibe los datos
 * ya descargados y devuelve resultados. Ver P1 y C4 en la documentación del Club
 * (Drive > Claude > Club Ford T > Celeste – contratos).
 *
 * Uso:
 *   var m = ManualMotor.crear({ datos, dueno, sinonimos, glosario, MiniSearch });
 *     datos = /datos/manual-servicio.json; dueno = /datos/manual-dueno.json (opcional, 2026-10-29.1):
 *     los dos manuales se buscan juntos y compiten por relevancia, sin prioridad de uno sobre otro.
 *   Notas técnicas (opcional, 2026-10-30.1): opc.indice = /index.json del sitio y opc.notas =
 *     /datos/buscador-notas.json (lista de direcciones). El texto sale del índice del sitio, así que
 *     si se edita una nota, el buscador la toma en la próxima publicación.
 *   m.buscar('ajuste tapa de cilindros', { max: 5, desde: 0 });
 *   m.foro('ajuste de bandas de freno');
 *   m.tema('regular bobina');                 // con opc.temas (/datos/manual-temas.json)
 *   ManualMotor.esHiloForo(url);
 *   var w = ManualMotor.crearSitio({ indice, sinonimos, MiniSearch });  // /index.json del sitio
 *   w.buscar('quién integra la comisión directiva', { max: 5 });
 *
 * Si cambia una regla, subir VERSION. Antes de publicar, aviso previo a ChatGPT (canal P2) y copia fija
 * /js/manual-motor-<VERSION>.js. Ver API más abajo.
 */
(function (raizGlobal, fabrica) {
  var api = fabrica();
  if (typeof module === 'object' && module && module.exports) { module.exports = api; }
  if (raizGlobal) { raizGlobal.ManualMotor = api; }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this), function () {
  'use strict';

  var VERSION = '2026-10-30.2';
  // Compatibilidad (2026-10-30.2): API sube solo si se quita o renombra un campo o cambia un parámetro.
  // Agregar campos o funciones no la cambia. Celeste (n8n) valida API, no VERSION. Cada VERSION queda
  // publicada también como /js/manual-motor-<VERSION>.js (versión fija), y producción usa una fija.
  // API 1 = hasta 2026-10-28.3 (solo Manual de Servicio, sin la constante). API 2 = desde 2026-10-29.1:
  // los resultados pueden ser del Manual de Servicio, del Dueño o de una nota (campo fuente).
  var API = 2;
  var SITIO = 'https://fordt.org.ar';
  var VISOR = '/tecnica/restauracion/manual-de-servicio/manual/';
  var FORO = 'https://search.brave.com/search?q=' + encodeURIComponent('site:mtfca.com') + '+';

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

  // Raíces de una acción para compararla con títulos: la palabra, sus sinónimos y la raíz
  // de ACCIONES que le corresponde ("quitar" -> "quit", así encuentra "quita").
  function raicesAccion(x) {
    var out = x.g.slice();
    for (var i = 0; i < ACCIONES.length; i++) { if (x.w.indexOf(ACCIONES[i]) === 0 && out.indexOf(ACCIONES[i]) === -1) { out.push(ACCIONES[i]); } }
    return out;
  }

  function escaparRegex(x) { return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  // Busca r como COMIENZO de palabra (no en medio): así "regular" no encuentra
  // "irregular" ni "irregularidad" (corregido en 2026-10-28.1).
  function posPalabra(t, r, desde) {
    var p = desde || 0;
    while ((p = t.indexOf(r, p)) !== -1) {
      if (p === 0 || !/[a-z0-9ñ]/.test(t.charAt(p - 1))) { return p; }
      p++;
    }
    return -1;
  }
  function tienePalabra(t, r) { return posPalabra(t, r, 0) !== -1; }

  // Zona de ~280 caracteres donde aparecen juntas más palabras de la búsqueda
  // (o sus sinónimos). Si está la pieza compuesta ("eje delantero"), se centra ahí.
  function rangoFragmento(texto, grupos, frases) {
    var plano = sinTildes(texto);
    var todas = [];
    grupos.forEach(function (g) { g.forEach(function (r) { if (r.length >= 3) { todas.push(r); } }); });
    var mejor = 0, mejorN = -1;
    todas.forEach(function (r) {
      var pos = -1;
      while ((pos = posPalabra(plano, r, pos + 1)) !== -1) {
        var v = plano.slice(Math.max(0, pos - 60), pos + 200);
        var n = grupos.filter(function (g) { return g.some(function (x) { return tienePalabra(v, x); }); }).length;
        if (n > mejorN) { mejorN = n; mejor = pos; }
      }
    });
    (frases || []).some(function (re) { var m = re.exec(plano); if (m) { mejor = m.index; return true; } return false; });
    var desde = Math.max(0, mejor - 80);
    var hasta = Math.min(texto.length, desde + 280);
    return { desde: desde, hasta: hasta, resaltar: todas };
  }

  function fragmentoTexto(texto, rango) {
    return (rango.desde > 0 ? '… ' : '') + texto.slice(rango.desde, rango.hasta) + (rango.hasta < texto.length ? ' …' : '');
  }

  // Solo hilos concretos del foro del MTFCA: el actual (phpBB3, con número de
  // tema t= o de mensaje p=) y el archivo viejo (discus/messages/<n>/<n>.html).
  // Una URL de viewtopic.php sin número no es un hilo (corregido en 2026-10-25.1).
  function esHiloForo(url) {
    var u = String(url || '');
    return /^https?:\/\/(www\.)?mtfca\.com\/phpBB3\/viewtopic\.php\?(?:[^#]*&)?[tp]=\d+(?:[&#]|$)/i.test(u) ||
      /^https?:\/\/(www\.)?mtfca\.com\/discus\/messages\/\d+\/\d+\.html(?:[?#]|$)/i.test(u);
  }

  function crear(opc) {
    opc = opc || {};
    var datos = opc.datos;
    var MS = opc.MiniSearch;
    if (!datos || !datos.items) { throw new Error('ManualMotor: faltan los datos del manual'); }
    if (!MS) { throw new Error('ManualMotor: falta MiniSearch'); }
    var sin = opc.sinonimos || {};
    var glosario = opc.glosario || {};

    // Manual del Dueño (2026-10-29.1): cada respuesta es un registro. La pregunta va
    // en el mismo campo que el índice del libro del Manual de Servicio (idx), así
    // los dos manuales tienen el mismo peso y gana el que mejor coincide.
    var duenoItems = (opc.dueno && opc.dueno.items) || [];
    // Notas técnicas: cada nota se parte en tramos de ~1200 caracteres (como las páginas largas del
    // sitio); el título va en idx. En los resultados queda solo el mejor tramo de cada nota.
    var notasItems = [];
    var listaNotas = (opc.notas && (opc.notas.notas || opc.notas)) || [];
    if (opc.indice && opc.indice.paginas && listaNotas.length) {
      var quiero = {};
      listaNotas.forEach(function (u) { if (typeof u === 'string') { quiero[u.replace(/^https?:\/\/[^/]+/, '')] = true; } });
      opc.indice.paginas.forEach(function (pg, k) {
        var ruta = String(pg.url || '').replace(/^https?:\/\/[^/]+/, '');
        if (!quiero[ruta] || pg.texto_disponible === false || !pg.texto) { return; }
        tramos(pg.texto, 1200).forEach(function (t, j) {
          notasItems.push({ id: 'N' + k + ':' + j, nota: ruta, titulo: pg.titulo || '', idx: [pg.titulo || ''],
            cap: pg.seccion_titulo || '', url: pg.url, fecha_modificacion: pg.fecha_modificacion || '', texto: t });
        });
      });
    }
    var todos = datos.items.map(function (it) { return { it: it, fuente: 'servicio' }; })
      .concat(duenoItems.map(function (it) { return { it: it, fuente: 'dueno' }; }))
      .concat(notasItems.map(function (it) { return { it: it, fuente: 'nota' }; }));
    function textoDe(it) { return it.pregunta ? it.pregunta + ' ' + it.texto : it.texto; }

    var vocab = {};
    todos.forEach(function (x) {
      var it = x.it;
      [textoDe(it), (it.idx || []).join(' '), it.pregunta || '', it.cap || ''].join(' ').split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+/).forEach(function (w) {
        var p = w && procesar(w); if (p) { vocab[p] = true; }
      });
    });
    var indice = new MS({
      fields: ['texto', 'idx', 'cap'],
      storeFields: ['id'],
      processTerm: procesar,
      searchOptions: {
        boost: { idx: 3, cap: 1.5 },
        // Tolerancia a errores de tipeo solo para palabras que NO están en el
        // manual: "bobina" existe, así que no trae "bocina" (2026-10-28.1).
        fuzzy: function (t) { return t.length >= 5 && !vocab[t] ? 1 : 0; },
        prefix: function (t) { return t.length >= 4; },
        processTerm: procesar
      }
    });
    indice.addAll(todos.map(function (x) {
      var it = x.it;
      return { id: it.id, texto: textoDe(it), idx: x.fuente === 'dueno' ? (it.pregunta || '') : (it.idx || []).join(' · '), cap: it.cap || '' };
    }));
    var porId = {}, fuenteDe = {};
    todos.forEach(function (x) { porId[x.it.id] = x.it; fuenteDe[x.it.id] = x.fuente; });

    function grupoDe(w) {
      var g = [raiz(w)];
      (sin[w] || sin[raiz(w)] || []).forEach(function (x) { var r = raiz(sinTildes(x)); if (g.indexOf(r) === -1) { g.push(r); } });
      return g;
    }

    // Resultado completo y ordenado (lo usa la web para paginar de a 5).
    function analizar(q) {
      q = String(q || '').trim();
      // 1) Palabras y sinónimos. Cada palabra forma un grupo con sus sinónimos.
      var crudas = sinTildes(q).split(/[^a-z0-9ñ]+/).filter(Boolean);
      // 2) Sujetos compuestos: "tapa de cilindros" (con "de") o "eje delantero" (seguidas).
      var items = [], compuestos = [], pendienteDe = false;
      for (var c = 0; c < crudas.length; c++) {
        var w = crudas[c];
        if (w === 'de' || w === 'del') { pendienteDe = items.length > 0; continue; }
        if (w === 'la' || w === 'las' || w === 'los' || w === 'el') { continue; }
        if (w.length < 3 || vacias[w]) { pendienteDe = false; continue; }
        var prevItem = items.length ? items[items.length - 1] : null;
        var juntoAnterior = prevItem && crudas[c - 1] === prevItem.w;
        items.push({ w: w, g: grupoDe(w), accion: esAccion(w) });
        if (pendienteDe) { compuestos.push([items.length - 2, items.length - 1, 'de']); }
        else if (juntoAnterior && !prevItem.accion && !esAccion(w)) { compuestos.push([items.length - 2, items.length - 1, 'junto']); }
        pendienteDe = false;
      }
      if (!items.length) { items.push({ w: sinTildes(q), g: [sinTildes(q)], accion: false }); }
      // 3) Los sujetos son obligatorios; las acciones solo suman puntos.
      var sujetos = items.filter(function (x) { return !x.accion; });
      var acciones = items.filter(function (x) { return x.accion; });
      if (!sujetos.length) { sujetos = items; acciones = []; }
      var grupos = items.map(function (x) { return x.g; });
      function consulta(lista, modo) {
        return { combineWith: modo, queries: lista.map(function (x) { return x.g.length === 1 ? x.g[0] : { combineWith: 'OR', queries: x.g }; }) };
      }
      var res = indice.search(consulta(sujetos, 'AND'));
      var modo = 'todas', faltan = [];
      if (!res.length) {
        // Alguna pieza no figura en todo el manual ("tren"): se la deja de lado y
        // se buscan las demás, avisando. Recién si eso tampoco da, cualquier palabra.
        faltan = sujetos.filter(function (x) { return !indice.search(consulta([x], 'AND')).length; });
        var quedan = sujetos.filter(function (x) { return faltan.indexOf(x) === -1; });
        if (faltan.length && quedan.length) {
          res = indice.search(consulta(quedan, 'AND'));
          if (res.length) { modo = 'sin'; sujetos = quedan; }
        }
        if (!res.length) { res = indice.search(consulta(sujetos, 'OR')); modo = 'alguna'; }
        if (!res.length) { res = indice.search(consulta(items, 'OR')); modo = 'alguna'; }
      }
      function alternativa(g) { return '(?:' + g.map(escaparRegex).join('|') + ')[a-z0-9ñ]*'; }
      var frases = compuestos.map(function (par) {
        // "junto" admite hasta dos palabras en el medio: "eje o puente trasero"
        var medio = par[2] === 'de' ? '\\s+(?:de|del)\\s+(?:(?:la|las|los|el)\\s+)?' : '(?:\\s+\\S+){0,2}?\\s+';
        return new RegExp(alternativa(items[par[0]].g) + medio + alternativa(items[par[1]].g));
      });
      if (!res.length) { modo = 'ninguno'; }
      // 4) Puntaje: frase compuesta ×4 (hasta ×6 si se repite); sujetos cerca (~60 caracteres) ×2;
      //    alguna acción presente ×1,3.
      res.forEach(function (r) {
        var t = sinTildes(textoDe(porId[r.id]));
        frases.forEach(function (re) {
          var n = (t.match(new RegExp(re.source, 'g')) || []).length;
          if (n) { r.score *= Math.min(6, 3 + n); }
        });
        if (sujetos.length > 1) {
          var cerca = sujetos[0].g.some(function (r0) {
            var p0 = -1;
            while ((p0 = posPalabra(t, r0, p0 + 1)) !== -1) {
              var v = t.slice(Math.max(0, p0 - 60), p0 + 60 + r0.length);
              if (sujetos.every(function (x) { return x.g.some(function (y) { return tienePalabra(v, y); }); })) { return true; }
            }
            return false;
          });
          if (cerca) { r.score *= 2; }
        }
        // Acción presente: ×1,3. Si la pregunta del Dueño o una entrada del índice del libro
        // tiene la acción Y alguna pieza buscada («¿Cómo se limpia el radiador?»), ×2,5 (2026-10-29.2).
        var it0 = porId[r.id];
        var titulos = [it0.pregunta || ''].concat(it0.idx || []).map(sinTildes);
        var enTitulo = titulos.some(function (ti) {
          return ti && acciones.some(function (x) { return raicesAccion(x).some(function (y) { return tienePalabra(ti, y); }); }) &&
            sujetos.some(function (x) { return x.g.some(function (y) { return tienePalabra(ti, y); }); });
        });
        if (enTitulo) { r.score *= 2.5; }
        else if (acciones.some(function (x) { return x.g.some(function (y) { return tienePalabra(t, y); }); })) { r.score *= 1.3; }
      });
      res.sort(function (a, b) { return b.score - a.score; });
      // De cada nota técnica, solo su mejor tramo.
      var notaVista = {};
      res = res.filter(function (r) {
        var n = porId[r.id].nota;
        if (!n) { return true; }
        if (notaVista[n]) { return false; }
        notaVista[n] = true; return true;
      });
      return {
        consulta: q,
        modo: modo,
        faltan: faltan.map(function (x) { return x.w; }),
        ordenados: res.map(function (r) { return { id: r.id, puntaje: r.score }; }),
        grupos: grupos,
        frases: frases
      };
    }

    // Lo que usa n8n: resultados listos, de a `max`, con fragmento en texto plano.
    function buscar(q, o) {
      o = o || {};
      var max = o.max || 5, desde = o.desde || 0;
      var a = analizar(q);
      var resultados = a.ordenados.slice(desde, desde + max).map(function (r) {
        var it = porId[r.id];
        var rango = rangoFragmento(it.texto, a.grupos, a.frases);
        if (fuenteDe[r.id] === 'nota') {
          return {
            id: it.id,
            fuente: 'nota',
            manual: 'Nota técnica',
            titulo: it.titulo,
            cap: it.cap || '',
            url: it.url,
            fecha_modificacion: it.fecha_modificacion,
            fragmento: fragmentoTexto(it.texto, rango),
            puntaje: Math.round(r.puntaje * 1000) / 1000
          };
        }
        if (fuenteDe[r.id] === 'dueno') {
          return {
            id: it.id,
            fuente: 'dueno',
            manual: 'Manual del Dueño',
            resp: it.resp || null,
            pregunta: it.pregunta || '',
            pag: it.pag,
            cap: it.cap || '',
            url: it.url || null,
            fragmento: fragmentoTexto(it.texto, rango),
            puntaje: Math.round(r.puntaje * 1000) / 1000
          };
        }
        return {
          id: it.id,
          fuente: 'servicio',
          manual: 'Manual de Servicio',
          visorPag: it.visorPag || null,
          parr: it.parr || [],
          figs: it.figs || [],
          cap: it.cap || '',
          url: (it.visor !== null && it.visor !== undefined) ? SITIO + VISOR + '#manserv=' + it.visor : (it.url || null),
          fragmento: fragmentoTexto(it.texto, rango),
          puntaje: Math.round(r.puntaje * 1000) / 1000
        };
      });
      return { version: VERSION, consulta: a.consulta, modo: a.modo, faltan: a.faltan, total: a.ordenados.length, desde: desde, resultados: resultados };
    }

    // Traduce la búsqueda al inglés del Model T con el glosario (primero frases de
    // tres y dos palabras, después palabra por palabra) y arma el enlace al foro.
    function foro(q) {
      var w = sinTildes(q).split(/[^a-z0-9ñ]+/).filter(Boolean), out = [], sinTraducir = [];
      for (var i = 0; i < w.length; i++) {
        var t3 = w.slice(i, i + 3).join(' '), t2 = w.slice(i, i + 2).join(' ');
        var hit = glosario[t3] ? [t3, 3] : glosario[t2] ? [t2, 2] : glosario[w[i]] ? [w[i], 1] : null;
        if (hit) { if (out.indexOf(glosario[hit[0]]) === -1) { out.push(glosario[hit[0]]); } i += hit[1] - 1; }
        else if (w[i].length >= 3 && !vacias[w[i]]) { sinTraducir.push(w[i]); }
      }
      if (!out.length) { return null; }
      var terminos = out.join(' ');
      return { terminos: terminos, sinTraducir: sinTraducir, url: FORO + encodeURIComponent(terminos).replace(/%20/g, '+') };
    }

    // ---- Índice de temas (2026-10-28.2) ----
    // Un tema aparece si TODAS las palabras de la consulta (o sus sinónimos) están
    // en su título o en sus frases. Se compara por comienzo de palabra (raíz).
    var temasLista = (opc.temas && (opc.temas.temas || opc.temas)) || [];
    var temasVoc = temasLista.map(function (t) {
      var txt = sinTildes([t.tema].concat(t.frases || []).join(' '));
      var ws = txt.split(/[^a-z0-9ñ]+/).filter(function (w) { return w.length >= 3 && !vacias[w]; }).map(raiz);
      var frases = (t.frases || []).map(function (f) { return palabrasConsulta(f).join(' '); });
      return { ws: ws, frases: frases, primera: palabrasConsulta(t.tema)[0] || '' };
    });
    function palabrasConsulta(q) {
      return sinTildes(q).split(/[^a-z0-9ñ]+/).filter(function (w) { return w.length >= 3 && !vacias[w] && w !== 'del'; }).map(raiz);
    }
    function coincide(a, b) {
      if (a === b) { return true; }
      var c = Math.min(a.length, b.length);
      return c >= 4 && (a.indexOf(b) === 0 || b.indexOf(a) === 0);
    }
    function tema(q, o) {
      o = o || {};
      var max = o.max || 2;
      var pq = palabrasConsulta(q);
      if (!pq.length) { return []; }
      var conj = pq.join(' ');
      var res = [];
      temasVoc.forEach(function (v, k) {
        var ok = pq.every(function (w) {
          var alts = [w].concat((sin[w] || []).map(function (x) { return raiz(sinTildes(x)); }));
          return alts.some(function (a) { return v.ws.some(function (b) { return coincide(a, b); }); });
        });
        if (!ok) { return; }
        // Una sola palabra ("bobina", "aceite") es muy general: solo si es una de
        // las frases del tema o la primera palabra de su título.
        if (pq.length === 1 && v.frases.indexOf(conj) === -1 && !coincide(pq[0], v.primera)) { return; }
        var puntos = pq.length;
        if (v.frases.indexOf(conj) !== -1) { puntos += 10; }
        else if (v.frases.some(function (f) { return f.indexOf(conj) !== -1; })) { puntos += 5; }
        res.push({ k: k, puntos: puntos - v.ws.length / 1000 });
      });
      res.sort(function (a, b) { return b.puntos - a.puntos; });
      return res.slice(0, max).map(function (r) {
        var t = temasLista[r.k];
        return { tema: t.tema, visorPag: t.visorPag, parr: t.parr, url: t.url };
      });
    }

    return {
      version: VERSION,
      api: API,
      tema: tema,
      analizar: analizar,
      buscar: buscar,
      foro: foro,
      registro: function (id) { return porId[id] || null; },
      fuente: function (id) { return fuenteDe[id] || null; },
      rangoFragmento: rangoFragmento
    };
  }

  // ===================== Búsqueda en todo el sitio (index.json, contrato C0) =====================
  // Mismas reglas que el Manual (tildes, raíces, sinónimos, palabra entera, tolerancia a errores
  // solo para palabras que no existen). Las páginas largas se parten en tramos de ~1200
  // caracteres para que el fragmento salga del lugar correcto. Agregado en 2026-10-28.3.
  var VACIAS_SITIO = ('quien quienes cual cuales cuanto cuanta cuantos cuantas ocurrio paso pasa hubo hay fue fueron ' +
    'integra integran participo participaron tiene tienen dice dicen saber quiero quisiera necesito informacion info ' +
    'podes puedo puede decime dime contame sobre acerca me te nos mi mis tu tus hago hacer hace sale cuesta vale').split(' ');
  var vaciasSitio = {};
  for (var vs = 0; vs < VACIAS_SITIO.length; vs++) { vaciasSitio[VACIAS_SITIO[vs]] = true; }

  function tramos(texto, largo) {
    var out = [], t = String(texto || '');
    if (t.length <= largo * 1.3) { return [t]; }
    var i = 0;
    while (i < t.length) {
      var fin = Math.min(t.length, i + largo);
      if (fin < t.length) { var p = t.lastIndexOf('. ', fin); if (p > i + largo / 2) { fin = p + 1; } }
      out.push(t.slice(i, fin).trim());
      i = fin;
    }
    return out;
  }

  var UNID = ['', 'primer primero', 'segundo', 'tercer tercero', 'cuarto', 'quinto', 'sexto', 'septimo', 'octavo', 'noveno'];
  var DEC = { 10: 'decimo', 20: 'vigesimo', 30: 'trigesimo' };
  var ESP = { 11: 'undecimo decimoprimero', 12: 'duodecimo decimosegundo' };
  function ordinal(n) {
    if (ESP[n]) { return ESP[n]; }
    var d = Math.floor(n / 10) * 10, u = n % 10;
    if (!d) { return UNID[u]; }
    if (!u) { return DEC[d]; }
    return UNID[u].split(' ').map(function (x) { return DEC[d] + ' ' + x + ' ' + DEC[d] + x; }).join(' ');
  }
  function romano(r) {
    var v = { I: 1, V: 5, X: 10, L: 50 }, n = 0;
    for (var i = 0; i < r.length; i++) { var a = v[r[i]], b = v[r[i + 1]] || 0; n += a < b ? -a : a; }
    return n;
  }
  // "XXX Encuentro Internacional" -> palabras "30 trigesimo 30º": así se encuentra con
  // "trigésimo encuentro", "encuentro 30" o "primer encuentro".
  function edicion(titulo) {
    var m = /^([IVXL]+)\s+Encuentro/i.exec(titulo || '');
    if (!m) { return ''; }
    var n = romano(m[1].toUpperCase());
    return n > 0 && n < 40 ? n + ' ' + ordinal(n) + ' ' + m[1].toLowerCase() : '';
  }

  function crearSitio(opc) {
    opc = opc || {};
    var MS = opc.MiniSearch, ind = opc.indice;
    if (!ind || !ind.paginas) { throw new Error('ManualMotor.crearSitio: falta el índice del sitio (index.json)'); }
    if (!MS) { throw new Error('ManualMotor.crearSitio: falta MiniSearch'); }
    var sin = {};
    [].concat(opc.sinonimos || []).forEach(function (dic) { for (var k in dic) { if (k.charAt(0) !== '_') { sin[k] = (sin[k] || []).concat(dic[k]); } } });
    var docs = [], paginas = ind.paginas;
    paginas.forEach(function (pg, k) {
      var ts = pg.texto_disponible === false ? [''] : tramos(pg.texto, 1200);
      ts.forEach(function (t, j) {
        docs.push({ id: k + ':' + j, pag: k, titulo: pg.titulo || '', desc: pg.descripcion || '', ed: edicion(pg.titulo),
          jer: (pg.jerarquia || []).concat(pg.categorias || []).join(' · '), texto: t });
      });
    });
    function procesarS(term) {
      var t = sinTildes(term);
      if (t.length < 2 || vacias[t] || vaciasSitio[t]) { return null; }
      if (/^\d+$/.test(t)) { return t; }
      return raiz(t);
    }
    var vocabS = {};
    docs.forEach(function (d) {
      [d.titulo, d.desc, d.jer, d.ed, d.texto].join(' ').split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+/).forEach(function (w) {
        var p = w && procesarS(w); if (p) { vocabS[p] = true; }
      });
    });
    var porDoc = {};
    docs.forEach(function (d) { porDoc[d.id] = d; });
    var idx = new MS({
      fields: ['titulo', 'desc', 'jer', 'ed', 'texto'],
      storeFields: ['id'],
      processTerm: procesarS,
      searchOptions: {
        boost: { titulo: 4, ed: 5, desc: 2, jer: 1.5 },
        fuzzy: function (t) { return t.length >= 5 && !vocabS[t] ? 1 : 0; },
        prefix: function (t) { return t.length >= 4; },
        processTerm: procesarS
      }
    });
    idx.addAll(docs);

    function palabras(q) {
      return sinTildes(q).split(/[^a-z0-9ñ]+/).filter(function (w) {
        return w.length >= 2 && !vacias[w] && !vaciasSitio[w] && w !== 'del';
      });
    }
    function grupo(w) {
      var g = [raiz(w)];
      (sin[w] || sin[raiz(w)] || []).forEach(function (x) {
        sinTildes(x).split(/\s+/).forEach(function (y) { var r = raiz(y); if (r && g.indexOf(r) === -1) { g.push(r); } });
      });
      return g;
    }
    function consulta(gs, modo) {
      return { combineWith: modo, queries: gs.map(function (g) { return g.length === 1 ? g[0] : { combineWith: 'OR', queries: g }; }) };
    }
    function fragmentoDe(texto, gs) {
      var plano = sinTildes(texto), mejor = 0, mejorN = -1;
      var todas = [];
      gs.forEach(function (g) { g.forEach(function (r) { if (r.length >= 3) { todas.push(r); } }); });
      todas.forEach(function (r) {
        var pos = -1;
        while ((pos = posPalabra(plano, r, pos + 1)) !== -1) {
          var v = plano.slice(Math.max(0, pos - 80), pos + 220);
          var n = gs.filter(function (g) { return g.some(function (x) { return tienePalabra(v, x); }); }).length;
          if (n > mejorN) { mejorN = n; mejor = pos; }
        }
      });
      var desde = Math.max(0, mejor - 100), hasta = Math.min(texto.length, desde + 320);
      return (desde > 0 ? '… ' : '') + texto.slice(desde, hasta).trim() + (hasta < texto.length ? ' …' : '');
    }

    function buscar(q, o) {
      o = o || {};
      var max = o.max || 5;
      var ws = palabras(q);
      var vacio = { version: VERSION, consulta: q, modo: 'ninguno', faltan: [], total: 0, resultados: [] };
      if (!ws.length) { return vacio; }
      var gs = ws.map(grupo), modo = 'todas', faltan = [];
      var res = idx.search(consulta(gs, 'AND'));
      if (!res.length) {
        var quedan = [];
        gs.forEach(function (g, i) { if (idx.search(consulta([g], 'AND')).length) { quedan.push(g); } else { faltan.push(ws[i]); } });
        if (faltan.length && quedan.length) { res = idx.search(consulta(quedan, 'AND')); if (res.length) { modo = 'sin'; gs = quedan; } }
        if (!res.length) { res = idx.search(consulta(gs, 'OR')); modo = 'alguna'; }
      }
      if (!res.length) { vacio.faltan = faltan; return vacio; }
      var mejorPorPag = {}, orden = [];
      res.forEach(function (r) {
        var d = porDoc[r.id];
        if (!mejorPorPag.hasOwnProperty(d.pag)) { mejorPorPag[d.pag] = r; orden.push(d.pag); }
      });
      var resultados = orden.slice(0, max).map(function (k) {
        var pg = paginas[k], d = porDoc[mejorPorPag[k].id];
        return {
          titulo: pg.titulo, url: pg.url, seccion: pg.seccion_titulo || pg.seccion || '',
          descripcion: pg.descripcion || '', fecha_modificacion: pg.fecha_modificacion || '',
          limitaciones: pg.limitaciones || [],
          fragmento: d.texto ? fragmentoDe(d.texto, gs) : '',
          puntaje: Math.round(mejorPorPag[k].score * 1000) / 1000
        };
      });
      return { version: VERSION, consulta: q, modo: modo, faltan: faltan, total: orden.length, resultados: resultados };
    }
    return { version: VERSION, api: API, buscar: buscar, generado: ind.generado || '' };
  }

  return {
    VERSION: VERSION,
    API: API,
    crear: crear,
    crearSitio: crearSitio,
    esHiloForo: esHiloForo,
    sinTildes: sinTildes,
    raiz: raiz
  };
});
