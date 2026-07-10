---
title: "Diario La Razón - 75° Aniversario de Ford"
date: 2010-04-08
description: "Suplemento del diario La Razón, 29/9/1979, por los 75 años de Ford (colaboración de Daniel Misano, Córdoba)"
categories: ["Técnica"]
url: "/tecnica/publicaciones/folletos/diario-la-razon-75-anos/"
pager: false
build:
  list: never
---

<div class="pub-viewer">
  <nav class="pub-index" id="pub-index-larazon75">
    <a href="#" class="active" onclick="pubShowIndex('larazon75',0);return false;">Tapa</a>
    <a href="#" onclick="pubShowIndex('larazon75',1);return false;">Página 2</a>
    <a href="#" onclick="pubShowIndex('larazon75',2);return false;">Página 3</a>
    <a href="#" onclick="pubShowIndex('larazon75',3);return false;">Página 4</a>
    <a href="#" onclick="pubShowIndex('larazon75',4);return false;">Página 5</a>
    <a href="#" onclick="pubShowIndex('larazon75',5);return false;">Página 6</a>
    <a href="#" onclick="pubShowIndex('larazon75',6);return false;">Página 7</a>
    <a href="#" onclick="pubShowIndex('larazon75',7);return false;">Página 8</a>
    <a href="#" onclick="pubShowIndex('larazon75',8);return false;">Página 9</a>
    <a href="#" onclick="pubShowIndex('larazon75',9);return false;">Página 10</a>
    <a href="#" onclick="pubShowIndex('larazon75',10);return false;">Página 11</a>
    <a href="#" onclick="pubShowIndex('larazon75',11);return false;">Página 12</a>
    <a href="#" onclick="pubShowIndex('larazon75',12);return false;">Página 13</a>
    <a href="#" onclick="pubShowIndex('larazon75',13);return false;">Página 14</a>
    <a href="#" onclick="pubShowIndex('larazon75',14);return false;">Página 15</a>
    <a href="#" onclick="pubShowIndex('larazon75',15);return false;">Página 16</a>
    <a href="#" onclick="pubShowIndex('larazon75',16);return false;">Página 17</a>
    <a href="#" onclick="pubShowIndex('larazon75',17);return false;">Página 18</a>
    <a href="#" onclick="pubShowIndex('larazon75',18);return false;">Página 19</a>
    <a href="#" onclick="pubShowIndex('larazon75',19);return false;">Página 20</a>
    <a href="#" onclick="pubShowIndex('larazon75',20);return false;">Página 21</a>
    <a href="#" onclick="pubShowIndex('larazon75',21);return false;">Página 22</a>
    <a href="#" onclick="pubShowIndex('larazon75',22);return false;">Página 23</a>
    <a href="#" onclick="pubShowIndex('larazon75',23);return false;">Página 24</a>
    <a href="#" onclick="pubShowIndex('larazon75',24);return false;">Página 25</a>
    <a href="#" onclick="pubShowIndex('larazon75',25);return false;">Página 26</a>
    <a href="#" onclick="pubShowIndex('larazon75',26);return false;">Página 27</a>
    <a href="#" onclick="pubShowIndex('larazon75',27);return false;">Página 28</a>
    <a href="#" onclick="pubShowIndex('larazon75',28);return false;">Página 29</a>
    <a href="#" onclick="pubShowIndex('larazon75',29);return false;">Ampliación 1</a>
    <a href="#" onclick="pubShowIndex('larazon75',30);return false;">Ampliación 2</a>
    <a href="#" onclick="pubShowIndex('larazon75',31);return false;">Ampliación 3</a>
    <a href="#" onclick="pubShowIndex('larazon75',32);return false;">Ampliación 4</a>
    <a href="#" onclick="pubShowIndex('larazon75',33);return false;">Ampliación 5</a>
    <a href="#" onclick="pubShowIndex('larazon75',34);return false;">Ampliación 6</a>
    <a href="#" onclick="pubShowIndex('larazon75',35);return false;">Ampliación 7</a>
    <a href="#" onclick="pubShowIndex('larazon75',36);return false;">Ampliación 8</a>
  </nav>
  <div class="pub-image">
    <a id="pub-link-larazon75" href="/images/publicaciones/folletos/la-razon-75-anos/la-tapa.JPG" target="_blank" rel="noopener">
      <img id="pub-img-larazon75" src="/images/publicaciones/folletos/la-razon-75-anos/la-tapa.JPG" alt="Diario La Razón - 75° Aniversario de Ford">
    </a>
    <div class="pub-nav-buttons">
      <button type="button" id="pub-prev-larazon75" onclick="pubPrev('larazon75')" disabled>&larr; Anterior</button>
      <button type="button" id="pub-next-larazon75" onclick="pubNext('larazon75')">Siguiente &rarr;</button>
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
window.pubPages_larazon75=[
  '/images/publicaciones/folletos/la-razon-75-anos/la-tapa.JPG',
  '/images/publicaciones/folletos/la-razon-75-anos/pag02.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag03.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag04.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag05.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag06.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag07.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag08.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag09.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag10.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag11.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag12.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag13.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag14.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag15.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag16.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag17.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag18.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag19.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag20.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag21.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag22.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag23.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag24.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag25.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag26.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag27.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag28.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/pag29.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/ampliaciones/p7180023.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/ampliaciones/p7180024.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/ampliaciones/p7180025.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/ampliaciones/p7180026.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/ampliaciones/p7180027.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/ampliaciones/p7180029.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/ampliaciones/p7180030.jpg',
  '/images/publicaciones/folletos/la-razon-75-anos/ampliaciones/p7180031.jpg'
];
window.pubIndex_larazon75=0;
</script>
