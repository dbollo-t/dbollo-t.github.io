---
title: "Manual de Lubricación"
date: 2010-04-08
description: "Manual de lubricación del Ford T, con índice de páginas"
categories: ["Técnica"]
url: "/tecnica/publicaciones/manuales/manual-lubricacion/"
pager: false
build:
  list: never
---

<div class="pub-viewer">
  <nav class="pub-index" id="pub-index-lubricante">
    <a href="#" class="active" onclick="pubShowIndex('lubricante',0);return false;">Tapa</a>
    <a href="#" onclick="pubShowIndex('lubricante',1);return false;">Tapa reverso</a>
    <a href="#" onclick="pubShowIndex('lubricante',2);return false;">Página 2</a>
    <a href="#" onclick="pubShowIndex('lubricante',3);return false;">Página 3</a>
    <a href="#" onclick="pubShowIndex('lubricante',4);return false;">Página 4</a>
    <a href="#" onclick="pubShowIndex('lubricante',5);return false;">Página 5</a>
    <a href="#" onclick="pubShowIndex('lubricante',6);return false;">Página 6</a>
    <a href="#" onclick="pubShowIndex('lubricante',7);return false;">Página 7</a>
    <a href="#" onclick="pubShowIndex('lubricante',8);return false;">Página 8</a>
    <a href="#" onclick="pubShowIndex('lubricante',9);return false;">Página 9</a>
    <a href="#" onclick="pubShowIndex('lubricante',10);return false;">Página 10</a>
    <a href="#" onclick="pubShowIndex('lubricante',11);return false;">Página 11</a>
    <a href="#" onclick="pubShowIndex('lubricante',12);return false;">Página 12</a>
    <a href="#" onclick="pubShowIndex('lubricante',13);return false;">Página 13</a>
    <a href="#" onclick="pubShowIndex('lubricante',14);return false;">Página 14</a>
    <a href="#" onclick="pubShowIndex('lubricante',15);return false;">Página 15</a>
    <a href="#" onclick="pubShowIndex('lubricante',16);return false;">Página 16</a>
    <a href="#" onclick="pubShowIndex('lubricante',17);return false;">Página 17</a>
    <a href="#" onclick="pubShowIndex('lubricante',18);return false;">Página 18</a>
    <a href="#" onclick="pubShowIndex('lubricante',19);return false;">Página 19</a>
    <a href="#" onclick="pubShowIndex('lubricante',20);return false;">Página 20</a>
    <a href="#" onclick="pubShowIndex('lubricante',21);return false;">Página 21</a>
    <a href="#" onclick="pubShowIndex('lubricante',22);return false;">Página 22</a>
  </nav>
  <div class="pub-image">
    <a id="pub-link-lubricante" href="/images/publicaciones/lubricante/tapa.jpg" target="_blank" rel="noopener">
      <img id="pub-img-lubricante" src="/images/publicaciones/lubricante/tapa.jpg" alt="Manual de Lubricación">
    </a>
    <div class="pub-nav-buttons">
      <button type="button" id="pub-prev-lubricante" onclick="pubPrev('lubricante')" disabled>&larr; Anterior</button>
      <button type="button" id="pub-next-lubricante" onclick="pubNext('lubricante')">Siguiente &rarr;</button>
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
window.pubPages_lubricante=[
  '/images/publicaciones/lubricante/tapa.jpg',
  '/images/publicaciones/lubricante/tapa2.jpg',
  '/images/publicaciones/lubricante/002.jpg',
  '/images/publicaciones/lubricante/003.jpg',
  '/images/publicaciones/lubricante/004.jpg',
  '/images/publicaciones/lubricante/005.jpg',
  '/images/publicaciones/lubricante/006.jpg',
  '/images/publicaciones/lubricante/007.jpg',
  '/images/publicaciones/lubricante/008.jpg',
  '/images/publicaciones/lubricante/009.jpg',
  '/images/publicaciones/lubricante/010.jpg',
  '/images/publicaciones/lubricante/011.jpg',
  '/images/publicaciones/lubricante/012.jpg',
  '/images/publicaciones/lubricante/013.jpg',
  '/images/publicaciones/lubricante/014.jpg',
  '/images/publicaciones/lubricante/015.jpg',
  '/images/publicaciones/lubricante/016.jpg',
  '/images/publicaciones/lubricante/017.jpg',
  '/images/publicaciones/lubricante/018.jpg',
  '/images/publicaciones/lubricante/019.jpg',
  '/images/publicaciones/lubricante/020.jpg',
  '/images/publicaciones/lubricante/021.jpg',
  '/images/publicaciones/lubricante/022.jpg'
];
window.pubIndex_lubricante=0;
</script>
