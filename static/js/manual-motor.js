/* Motor de búsqueda del Manual de Servicio Ford T — Club del Ford T de Argentina.
 *
 * Reglas de búsqueda compartidas entre la web (manual-buscador.js) y Celeste (n8n).
 * No toca la página, no hace llamadas de red y no guarda nada: recibe los datos
 * ya descargados y devuelve resultados. Ver P1 y C4 en la documentación del Club
 * (Drive > Claude > Club Ford T > Celeste – contratos).
 *
 * Uso:
 *   var m = ManualMotor.crear({ datos, sinonimos, glosario, MiniSearch });
 *   m.buscar('ajuste tapa de cilindros', { max: 5, desde: 0 });
 *   m.foro('ajuste de bandas de freno');
 *   m.tema('regular bobina');                 // con opc.temas (/datos/manual-temas.json)
 *   ManualMotor.esHiloForo(url);
 *
 * Si cambia una regla, subir VERSION: n8n la compara para saber que el motor cambió.
 */
(function (raizGlobal, fabrica) {
  var api = fabrica();
  if (typeof module === 'object' && module && module.exports) { module.exports = api; }
  if (raizGlobal) { raizGlobal.ManualMotor = api; }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this), function () {
  'use strict';

  var VERSION = '2026-10-28.2';
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

    var vocab = {};
    datos.items.forEach(function (it) {
      [it.texto, (it.idx || []).join(' '), it.cap || ''].join(' ').split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+/).forEach(function (w) {
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
    indice.addAll(datos.items.map(function (it) {
      return { id: it.id, texto: it.texto, idx: (it.idx || []).join(' · '), cap: it.cap || '' };
    }));
    var porId = {};
    for (var i = 0; i < datos.items.length; i++) { porId[datos.items[i].id] = datos.items[i]; }

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
        var t = sinTildes(porId[r.id].texto);
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
        if (acciones.some(function (x) { return x.g.some(function (y) { return tienePalabra(t, y); }); })) { r.score *= 1.3; }
      });
      res.sort(function (a, b) { return b.score - a.score; });
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
        return {
          id: it.id,
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
      tema: tema,
      analizar: analizar,
      buscar: buscar,
      foro: foro,
      registro: function (id) { return porId[id] || null; },
      rangoFragmento: rangoFragmento
    };
  }

  return {
    VERSION: VERSION,
    crear: crear,
    esHiloForo: esHiloForo,
    sinTildes: sinTildes,
    raiz: raiz
  };
});
