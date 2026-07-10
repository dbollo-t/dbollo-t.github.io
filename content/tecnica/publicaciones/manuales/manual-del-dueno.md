---
title: "Manual del Dueño"
date: 2010-04-08
description: "Manual del dueño del Ford T, con índice de páginas"
categories: ["Técnica"]
url: "/tecnica/publicaciones/manuales/manual-del-dueno/"
pager: false
build:
  list: never
---

<div class="pub-viewer">
  <nav class="pub-index" id="pub-index-mandueno">
    <a href="#" class="active" onclick="pubShowIndex('mandueno',0);return false;">Tapa</a>
    <a href="#" onclick="pubShowIndex('mandueno',1);return false;">Pág. 1</a>
    <a href="#" onclick="pubShowIndex('mandueno',2);return false;">Pág. 2</a>
    <a href="#" onclick="pubShowIndex('mandueno',3);return false;">Pág. 4</a>
    <a href="#" onclick="pubShowIndex('mandueno',4);return false;">Pág. 6</a>
    <a href="#" onclick="pubShowIndex('mandueno',5);return false;">Pág. 8</a>
    <a href="#" onclick="pubShowIndex('mandueno',6);return false;">Pág. 10</a>
    <a href="#" onclick="pubShowIndex('mandueno',7);return false;">Pág. 12</a>
    <a href="#" onclick="pubShowIndex('mandueno',8);return false;">Pág. 14</a>
    <a href="#" onclick="pubShowIndex('mandueno',9);return false;">Pág. 16</a>
    <a href="#" onclick="pubShowIndex('mandueno',10);return false;">Pág. 18</a>
    <a href="#" onclick="pubShowIndex('mandueno',11);return false;">Pág. 20</a>
    <a href="#" onclick="pubShowIndex('mandueno',12);return false;">Pág. 22</a>
    <a href="#" onclick="pubShowIndex('mandueno',13);return false;">Pág. 24</a>
    <a href="#" onclick="pubShowIndex('mandueno',14);return false;">Pág. 26</a>
    <a href="#" onclick="pubShowIndex('mandueno',15);return false;">Pág. 28</a>
    <a href="#" onclick="pubShowIndex('mandueno',16);return false;">Pág. 30</a>
    <a href="#" onclick="pubShowIndex('mandueno',17);return false;">Pág. 32</a>
    <a href="#" onclick="pubShowIndex('mandueno',18);return false;">Pág. 34</a>
    <a href="#" onclick="pubShowIndex('mandueno',19);return false;">Pág. 36</a>
    <a href="#" onclick="pubShowIndex('mandueno',20);return false;">Pág. 38</a>
    <a href="#" onclick="pubShowIndex('mandueno',21);return false;">Pág. 40</a>
    <a href="#" onclick="pubShowIndex('mandueno',22);return false;">Pág. 42</a>
    <a href="#" onclick="pubShowIndex('mandueno',23);return false;">Pág. 44</a>
    <a href="#" onclick="pubShowIndex('mandueno',24);return false;">Pág. 46</a>
    <a href="#" onclick="pubShowIndex('mandueno',25);return false;">Pág. 48</a>
    <a href="#" onclick="pubShowIndex('mandueno',26);return false;">Pág. 50</a>
    <a href="#" onclick="pubShowIndex('mandueno',27);return false;">Pág. 52</a>
    <a href="#" onclick="pubShowIndex('mandueno',28);return false;">Pág. 54</a>
    <a href="#" onclick="pubShowIndex('mandueno',29);return false;">Pág. 56</a>
    <a href="#" onclick="pubShowIndex('mandueno',30);return false;">Pág. 58</a>
    <a href="#" onclick="pubShowIndex('mandueno',31);return false;">Pág. 60</a>
  </nav>
  <div class="pub-image">
    <a id="pub-link-mandueno" href="/images/publicaciones/mandueno/mandueno0.jpg" target="_blank" rel="noopener">
      <img id="pub-img-mandueno" src="/images/publicaciones/mandueno/mandueno0.jpg" alt="Manual del dueño">
    </a>
    <div class="pub-nav-buttons">
      <button type="button" id="pub-prev-mandueno" onclick="pubPrev('mandueno')" disabled>&larr; Anterior</button>
      <button type="button" id="pub-next-mandueno" onclick="pubNext('mandueno')">Siguiente &rarr;</button>
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
window.pubPages_mandueno=[
  '/images/publicaciones/mandueno/mandueno0.jpg',
  '/images/publicaciones/mandueno/mandueno1.jpg',
  '/images/publicaciones/mandueno/mandueno2.jpg',
  '/images/publicaciones/mandueno/mandueno3.jpg',
  '/images/publicaciones/mandueno/mandueno4.jpg',
  '/images/publicaciones/mandueno/mandueno5.jpg',
  '/images/publicaciones/mandueno/mandueno6.jpg',
  '/images/publicaciones/mandueno/mandueno7.jpg',
  '/images/publicaciones/mandueno/mandueno8.jpg',
  '/images/publicaciones/mandueno/mandueno9.jpg',
  '/images/publicaciones/mandueno/mandueno10.jpg',
  '/images/publicaciones/mandueno/mandueno11.jpg',
  '/images/publicaciones/mandueno/mandueno12.jpg',
  '/images/publicaciones/mandueno/mandueno13.jpg',
  '/images/publicaciones/mandueno/mandueno14.jpg',
  '/images/publicaciones/mandueno/mandueno15.jpg',
  '/images/publicaciones/mandueno/mandueno16.jpg',
  '/images/publicaciones/mandueno/mandueno17.jpg',
  '/images/publicaciones/mandueno/mandueno18.jpg',
  '/images/publicaciones/mandueno/mandueno19.jpg',
  '/images/publicaciones/mandueno/mandueno20.jpg',
  '/images/publicaciones/mandueno/mandueno21.jpg',
  '/images/publicaciones/mandueno/mandueno22.jpg',
  '/images/publicaciones/mandueno/mandueno23.jpg',
  '/images/publicaciones/mandueno/mandueno24.jpg',
  '/images/publicaciones/mandueno/mandueno25.jpg',
  '/images/publicaciones/mandueno/mandueno26.jpg',
  '/images/publicaciones/mandueno/mandueno27.jpg',
  '/images/publicaciones/mandueno/mandueno28.jpg',
  '/images/publicaciones/mandueno/mandueno29.jpg',
  '/images/publicaciones/mandueno/mandueno30.jpg',
  '/images/publicaciones/mandueno/mandueno31.jpg'
];
window.pubIndex_mandueno=0;
</script>
