---
title: "Catálogo de Repuestos 1922"
date: 2010-04-08
description: "Catálogo de repuestos del Ford T, edición 1922, con índice de páginas"
categories: ["Técnica"]
url: "/tecnica/publicaciones/manuales/catalogo-repuestos-1922/"
pager: false
build:
  list: never
---

<div class="pub-viewer">
  <nav class="pub-index" id="pub-index-repuestos22">
    <a href="#" class="active" onclick="pubShowIndex('repuestos22',0);return false;">Tapa</a>
    <a href="#" onclick="pubShowIndex('repuestos22',1);return false;">Pág. 2-3</a>
    <a href="#" onclick="pubShowIndex('repuestos22',2);return false;">Pág. 4-5</a>
    <a href="#" onclick="pubShowIndex('repuestos22',3);return false;">Pág. 6-7</a>
    <a href="#" onclick="pubShowIndex('repuestos22',4);return false;">Pág. 8-9</a>
    <a href="#" onclick="pubShowIndex('repuestos22',5);return false;">Pág. 10-11</a>
    <a href="#" onclick="pubShowIndex('repuestos22',6);return false;">Pág. 12-13</a>
    <a href="#" onclick="pubShowIndex('repuestos22',7);return false;">Pág. 14-15</a>
    <a href="#" onclick="pubShowIndex('repuestos22',8);return false;">Pág. 16-17</a>
    <a href="#" onclick="pubShowIndex('repuestos22',9);return false;">Pág. 18-19</a>
    <a href="#" onclick="pubShowIndex('repuestos22',10);return false;">Pág. 20-21</a>
    <a href="#" onclick="pubShowIndex('repuestos22',11);return false;">Pág. 22-23</a>
    <a href="#" onclick="pubShowIndex('repuestos22',12);return false;">Pág. 24-25</a>
    <a href="#" onclick="pubShowIndex('repuestos22',13);return false;">Pág. 26-27</a>
    <a href="#" onclick="pubShowIndex('repuestos22',14);return false;">Pág. 28-29</a>
    <a href="#" onclick="pubShowIndex('repuestos22',15);return false;">Pág. 30-31</a>
    <a href="#" onclick="pubShowIndex('repuestos22',16);return false;">Pág. 32-33</a>
    <a href="#" onclick="pubShowIndex('repuestos22',17);return false;">Pág. 34-35</a>
    <a href="#" onclick="pubShowIndex('repuestos22',18);return false;">Pág. 36-37</a>
    <a href="#" onclick="pubShowIndex('repuestos22',19);return false;">Pág. 38-39</a>
    <a href="#" onclick="pubShowIndex('repuestos22',20);return false;">Pág. 40-41</a>
    <a href="#" onclick="pubShowIndex('repuestos22',21);return false;">Pág. 42-43</a>
    <a href="#" onclick="pubShowIndex('repuestos22',22);return false;">Pág. 44</a>
  </nav>
  <div class="pub-image">
    <a id="pub-link-repuestos22" href="/images/publicaciones/catrepuestos22/repuestos0.jpg" target="_blank" rel="noopener">
      <img id="pub-img-repuestos22" src="/images/publicaciones/catrepuestos22/repuestos0.jpg" alt="Catálogo de repuestos 1922">
    </a>
    <div class="pub-nav-buttons">
      <button type="button" id="pub-prev-repuestos22" onclick="pubPrev('repuestos22')" disabled>&larr; Anterior</button>
      <button type="button" id="pub-next-repuestos22" onclick="pubNext('repuestos22')">Siguiente &rarr;</button>
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
window.pubPages_repuestos22=[
  '/images/publicaciones/catrepuestos22/repuestos0.jpg',
  '/images/publicaciones/catrepuestos22/repuestos1.jpg',
  '/images/publicaciones/catrepuestos22/repuestos2.jpg',
  '/images/publicaciones/catrepuestos22/repuestos3.jpg',
  '/images/publicaciones/catrepuestos22/repuestos4.jpg',
  '/images/publicaciones/catrepuestos22/repuestos5.jpg',
  '/images/publicaciones/catrepuestos22/repuestos6.jpg',
  '/images/publicaciones/catrepuestos22/repuestos7.jpg',
  '/images/publicaciones/catrepuestos22/repuestos8.jpg',
  '/images/publicaciones/catrepuestos22/repuestos9.jpg',
  '/images/publicaciones/catrepuestos22/repuestos10.jpg',
  '/images/publicaciones/catrepuestos22/repuestos11.jpg',
  '/images/publicaciones/catrepuestos22/repuestos12.jpg',
  '/images/publicaciones/catrepuestos22/repuestos13.jpg',
  '/images/publicaciones/catrepuestos22/repuestos14.jpg',
  '/images/publicaciones/catrepuestos22/repuestos15.jpg',
  '/images/publicaciones/catrepuestos22/repuestos16.jpg',
  '/images/publicaciones/catrepuestos22/repuestos17.jpg',
  '/images/publicaciones/catrepuestos22/repuestos18.jpg',
  '/images/publicaciones/catrepuestos22/repuestos19.jpg',
  '/images/publicaciones/catrepuestos22/repuestos20.jpg',
  '/images/publicaciones/catrepuestos22/repuestos21.jpg',
  '/images/publicaciones/catrepuestos22/repuestos22.jpg'
];
window.pubIndex_repuestos22=0;
</script>
