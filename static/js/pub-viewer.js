/* Visor de publicaciones del Club Ford T.
   Convierte la lista .pub-index (oculta por CSS) en un desplegable "Ir a página",
   sincronizado con los botones Anterior/Siguiente. Un solo archivo para todas las
   publicaciones: cada página solo aporta su nav y su array window.pubPages_<prefijo>. */

function pubShow(imgId, linkId, src) {
  var img = document.getElementById(imgId);
  if (img) { img.src = src; }
  var l = document.getElementById(linkId);
  if (l) { l.href = src; }
}

function pubShowIndex(prefix, i) {
  var pages = window['pubPages_' + prefix];
  if (!pages) { return; }
  if (i < 0) { i = 0; }
  if (i > pages.length - 1) { i = pages.length - 1; }
  window['pubIndex_' + prefix] = i;
  pubShow('pub-img-' + prefix, 'pub-link-' + prefix, pages[i]);
  var nav = document.getElementById('pub-index-' + prefix);
  if (nav) {
    for (var k = 0; k < nav.children.length; k++) {
      nav.children[k].className = (k === i) ? 'active' : '';
    }
  }
  var prevBtn = document.getElementById('pub-prev-' + prefix);
  var nextBtn = document.getElementById('pub-next-' + prefix);
  if (prevBtn) { prevBtn.disabled = (i <= 0); }
  if (nextBtn) { nextBtn.disabled = (i >= pages.length - 1); }
  var sel = document.getElementById('pub-select-' + prefix);
  if (sel) { sel.value = i; }
}

function pubNext(prefix) {
  var cur = window['pubIndex_' + prefix];
  if (cur === undefined) { cur = 0; }
  pubShowIndex(prefix, cur + 1);
}

/* Lupa / lightbox: agranda la página dentro del mismo sitio (sin abrir ventana). */
function pubEnsureLightbox() {
  var lb = document.getElementById('pub-lightbox');
  if (lb) { return lb; }
  lb = document.createElement('div');
  lb.id = 'pub-lightbox';
  lb.className = 'pub-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  var img = document.createElement('img');
  img.id = 'pub-lightbox-img';
  img.alt = '';
  var close = document.createElement('button');
  close.className = 'pub-lightbox__close';
  close.setAttribute('type', 'button');
  close.setAttribute('aria-label', 'Cerrar');
  close.innerHTML = '&times;';
  lb.appendChild(img);
  lb.appendChild(close);
  document.body.appendChild(lb);
  function hide() {
    lb.classList.remove('is-open', 'is-zoomed');
    img.style.width = '';
    document.body.style.overflow = '';
  }
  close.addEventListener('click', hide);
  lb.addEventListener('click', function (e) {
    if (e.target === img) {
      // Zoom real: al doble del tamaño en que se ve (o al tamaño natural si es
      // mayor), centrado en el punto donde se hizo clic. Antes pasaba al tamaño
      // natural de la imagen (1024 px), que en pantallas grandes es el mismo
      // tamaño con que ya se veía: parecía que la lupa no hacía nada.
      if (!lb.classList.contains('is-zoomed')) {
        var r = img.getBoundingClientRect();
        var fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
        var ancho = Math.max(img.naturalWidth || 0, r.width * 2);
        lb.classList.add('is-zoomed');
        img.style.width = ancho + 'px';
        lb.scrollLeft = Math.max(0, ancho * fx - lb.clientWidth / 2);
        lb.scrollTop = Math.max(0, img.offsetHeight * fy - lb.clientHeight / 2);
      } else {
        lb.classList.remove('is-zoomed');
        img.style.width = '';
        lb.scrollTop = 0;
        lb.scrollLeft = 0;
      }
    } else {
      hide();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) { hide(); }
  });
  return lb;
}

function pubOpenLightbox(src) {
  var lb = pubEnsureLightbox();
  document.getElementById('pub-lightbox-img').src = src;
  lb.classList.remove('is-zoomed');
  document.getElementById('pub-lightbox-img').style.width = '';
  lb.classList.add('is-open');
  lb.scrollTop = 0;
  lb.scrollLeft = 0;
  document.body.style.overflow = 'hidden';
}

function pubPrev(prefix) {
  var cur = window['pubIndex_' + prefix];
  if (cur === undefined) { cur = 0; }
  pubShowIndex(prefix, cur - 1);
}

(function () {
  function build(nav) {
    var prefix = nav.id.replace('pub-index-', '');
    var viewer = nav.closest('.pub-viewer');
    if (!viewer) { return; }
    var sel = document.getElementById('pub-select-' + prefix);
    if (!sel) {
      var controls = document.createElement('div');
      controls.className = 'pub-controls';
      var label = document.createElement('label');
      label.className = 'pub-jump';
      var span = document.createElement('span');
      span.textContent = 'Ir a página:';
      sel = document.createElement('select');
      sel.id = 'pub-select-' + prefix;
      label.appendChild(span);
      label.appendChild(sel);
      controls.appendChild(label);
      var image = viewer.querySelector('.pub-image');
      if (image) { viewer.insertBefore(controls, image); }
      else { viewer.appendChild(controls); }
    }
    if (!sel.options.length) {
      for (var k = 0; k < nav.children.length; k++) {
        var opt = document.createElement('option');
        opt.value = k;
        opt.textContent = nav.children[k].textContent;
        sel.appendChild(opt);
      }
    }
    sel.addEventListener('change', function () {
      pubShowIndex(prefix, parseInt(this.value, 10));
    });
    // la imagen ya no abre el JPG en una ventana nueva: la agranda con la lupa
    // dentro del mismo sitio, mostrando siempre la página que se está viendo
    var link = document.getElementById('pub-link-' + prefix);
    var pageImg = document.getElementById('pub-img-' + prefix);
    if (link) {
      link.removeAttribute('target');
      link.addEventListener('click', function (e) {
        e.preventDefault();
        pubOpenLightbox(pageImg ? pageImg.src : link.href);
      });
    }
    pubShowIndex(prefix, pubIndexFromHash(prefix));
  }
  // Enlace directo a una vista: .../manual/#manserv=150 abre esa vista.
  // Lo usa el buscador del Manual de Servicio (y Celeste, en sus enlaces).
  function pubIndexFromHash(prefix) {
    var m = location.hash.match(new RegExp('[#&]' + prefix + '=(\\d+)'));
    return m ? parseInt(m[1], 10) : 0;
  }
  function initAll() {
    var navs = document.querySelectorAll('nav.pub-index[id^="pub-index-"]');
    for (var i = 0; i < navs.length; i++) { build(navs[i]); }
  }
  window.addEventListener('hashchange', function () {
    var navs = document.querySelectorAll('nav.pub-index[id^="pub-index-"]');
    for (var i = 0; i < navs.length; i++) {
      var prefix = navs[i].id.replace('pub-index-', '');
      if (location.hash.indexOf(prefix + '=') !== -1) { pubShowIndex(prefix, pubIndexFromHash(prefix)); }
    }
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
