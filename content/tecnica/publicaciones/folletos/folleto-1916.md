---
title: "Folleto de Venta Ilustrado 1916"
date: 2010-04-08
description: "Folleto de venta ilustrado del Ford T, edición 1916 (colaboración de Stratta Hnos, Gesler, Santa Fe)"
categories: ["Técnica"]
url: "/tecnica/publicaciones/folletos/folleto-1916/"
pager: false
build:
  list: never
---

<div class="pub-viewer">
  <nav class="pub-index" id="pub-index-folleto1916">
    <a href="#" class="active" onclick="pubShowIndex('folleto1916',0);return false;">Tapa</a>
    <a href="#" onclick="pubShowIndex('folleto1916',1);return false;">Página 2-3</a>
    <a href="#" onclick="pubShowIndex('folleto1916',2);return false;">Página 4-5</a>
    <a href="#" onclick="pubShowIndex('folleto1916',3);return false;">Página 6-7</a>
    <a href="#" onclick="pubShowIndex('folleto1916',4);return false;">Página 8-9</a>
    <a href="#" onclick="pubShowIndex('folleto1916',5);return false;">Página 10-11</a>
    <a href="#" onclick="pubShowIndex('folleto1916',6);return false;">Página 12-13</a>
    <a href="#" onclick="pubShowIndex('folleto1916',7);return false;">Página 14-15</a>
    <a href="#" onclick="pubShowIndex('folleto1916',8);return false;">Página 16-17</a>
    <a href="#" onclick="pubShowIndex('folleto1916',9);return false;">Página 18-19</a>
    <a href="#" onclick="pubShowIndex('folleto1916',10);return false;">Página 20-21</a>
    <a href="#" onclick="pubShowIndex('folleto1916',11);return false;">Página 22-23</a>
    <a href="#" onclick="pubShowIndex('folleto1916',12);return false;">Página 24-25</a>
  </nav>
  <div class="pub-image">
    <a id="pub-link-folleto1916" href="/images/publicaciones/folletos/folleto-1916/tapa.jpg" target="_blank" rel="noopener">
      <img id="pub-img-folleto1916" src="/images/publicaciones/folletos/folleto-1916/tapa.jpg" alt="Folleto de Venta Ilustrado 1916">
    </a>
    <div class="pub-nav-buttons">
      <button type="button" id="pub-prev-folleto1916" onclick="pubPrev('folleto1916')" disabled>&larr; Anterior</button>
      <button type="button" id="pub-next-folleto1916" onclick="pubNext('folleto1916')">Siguiente &rarr;</button>
    </div>
  </div>
</div>

<style>
.pub-viewer{display:flex;gap:1.2rem;align-items:flex-start;margin:1rem 0;}
.pub-index{flex:0 0 100px;max-height:640px;overflow-y:auto;border-right:1px solid #ddd;padding-right:.6rem;display:flex;flex-direction:column;gap:.2rem;}
.pub-index a{font-size:.85rem;color:#333;text-decoration:none;padding:3px 6px;border-radius:3px;white-space:nowrap;}
.pub-index a:hover{background:#eee;}
.pub-index a.active{background:#8B0000;color:#fff;}
.pub-image{flex:1;text-align:center;min-width:0;}
.pub-image img{max-width:100%;height:auto;border:1px solid #ddd;cursor:zoom-in;}
.pub-nav-buttons{display:flex;justify-content:center;gap:1rem;margin-top:.8rem;}
.pub-nav-buttons button{background:#8B0000;color:#fff;border:none;padding:.5rem 1.1rem;border-radius:4px;font-size:.95rem;cursor:pointer;}
.pub-nav-buttons button:disabled{background:#ccc;cursor:not-allowed;}
.pub-nav-buttons button:hover:not(:disabled){background:#6e0000;}
@media (max-width:700px){
  .pub-viewer{flex-direction:column;}
  .pub-index{flex-direction:row;flex-wrap:wrap;max-height:none;border-right:none;border-bottom:1px solid #ddd;padding-bottom:.6rem;width:100%;}
}
</style>

<script>
function pubShow(imgId,linkId,src){
  document.getElementById(imgId).src=src;
  var l=document.getElementById(linkId);
  if(l){l.href=src;}
}
function pubShowIndex(prefix,i){
  var pages=window['pubPages_'+prefix];
  if(!pages){return;}
  if(i<0){i=0;}
  if(i>pages.length-1){i=pages.length-1;}
  window['pubIndex_'+prefix]=i;
  pubShow('pub-img-'+prefix,'pub-link-'+prefix,pages[i]);
  var nav=document.getElementById('pub-index-'+prefix);
  if(nav){
    for(var k=0;k<nav.children.length;k++){
      nav.children[k].className=(k===i)?'active':'';
    }
  }
  var prevBtn=document.getElementById('pub-prev-'+prefix);
  var nextBtn=document.getElementById('pub-next-'+prefix);
  if(prevBtn){prevBtn.disabled=(i<=0);}
  if(nextBtn){nextBtn.disabled=(i>=pages.length-1);}
}
function pubNext(prefix){
  var cur=window['pubIndex_'+prefix];
  if(cur===undefined){cur=0;}
  pubShowIndex(prefix,cur+1);
}
function pubPrev(prefix){
  var cur=window['pubIndex_'+prefix];
  if(cur===undefined){cur=0;}
  pubShowIndex(prefix,cur-1);
}
window.pubPages_folleto1916=[
  '/images/publicaciones/folletos/folleto-1916/tapa.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag02.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag04.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag06.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag08.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag10.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag12.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag14.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag16.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag18.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag20.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag22.jpg',
  '/images/publicaciones/folletos/folleto-1916/pag24.jpg'
];
window.pubIndex_folleto1916=0;
</script>
