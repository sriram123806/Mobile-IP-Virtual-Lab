(function(){
'use strict';
/* Replace the empty url values with real links, or enter them on the page. */
var LINKS=[{key:'mip_ref_video_url',title:'Project demonstration video',desc:'Paste the video URL (YouTube, Drive, etc.).',url:''},
{key:'mip_ref_site_url',title:'Final hosted website',desc:'Paste the final GitHub Pages / hosted URL.',url:''}];
var box=document.getElementById('mip-project-links');
function get(l){try{return localStorage.getItem(l.key)||l.url;}catch(e){return l.url;}}
function valid(u){try{var x=new URL(u);return x.protocol==='https:'||x.protocol==='http:';}catch(e){return false;}}
function render(l,card){var u=get(l);card.innerHTML='<b>'+l.title+'</b><p>'+l.desc+'</p><p>'+(u?'<a href="'+encodeURI(u)+'" target="_blank" rel="noopener noreferrer">'+u.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</a>':'<span class="mip-empty">URL not supplied yet.</span>')+'</p><div class="mip-edit"><input type="url" placeholder="https://..." value="'+(u||'').replace(/"/g,'&quot;')+'" aria-label="'+l.title+' URL"><button class="mip-btn" type="button">Save link</button></div><p class="mip-msg" role="status"></p>';
  var inp=card.querySelector('input'),msg=card.querySelector('.mip-msg');
  card.querySelector('button').onclick=function(){var v=inp.value.trim();if(v&&!valid(v)){msg.textContent='Enter a full URL starting with https://';msg.className='mip-msg mip-err';return;}
    try{if(v)localStorage.setItem(l.key,v);else localStorage.removeItem(l.key);}catch(e){}l.url=v;render(l,card);};}
LINKS.forEach(function(l){var c=document.createElement('div');c.className='mip-ref';box.appendChild(c);render(l,c);});
})();
