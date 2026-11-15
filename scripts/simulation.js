/* Mobile IP simulation engine. State-driven: every displayed value derives from MIP.state. */
(function(root){
'use strict';
var ADDR={HA:'192.0.2.1',MNH:'192.0.2.50',FA:'198.51.100.1',CN:'203.0.113.10'}; // RFC 5737 documentation ranges
var DUR=[2400,3200,2800,4800,2800,3200]; // ms per stage
var STAGES=['Packet Generation at CN','Packet Interception at HA','Encapsulation at HA','Forward Tunneling to FA','Decapsulation at FA','Final Delivery to Mobile Node'];

function toBinary(msg){var out=[];for(var i=0;i<msg.length;i++){var c=msg.charCodeAt(i);if(c>127)return {error:'Only ASCII characters (code 0 to 127) are supported. Replace "'+msg.charAt(i)+'".'};
  out.push({ch:msg.charAt(i),code:c,bin:('00000000'+c.toString(2)).slice(-8)});}return {chars:out};}
function toBytes(chars){return chars.map(function(c){return c.code;});}
function ipBytes(ip){return ip.split('.').map(Number);}
function checksum(b){var s=0;for(var i=0;i<b.length;i+=2)s+=(b[i]<<8)+(b[i+1]||0);while(s>>16)s=(s&0xffff)+(s>>16);return (~s)&0xffff;}
function hex(n,w){return '0x'+('0000'+n.toString(16).toUpperCase()).slice(-w);}
function header(src,dst,proto,ttl,total,id){
  var b=[0x45,0,total>>8,total&255,id>>8,id&255,0,0,ttl,proto,0,0].concat(ipBytes(src),ipBytes(dst));
  var ck=checksum(b);
  return {'Version / IHL':'4 / 5 (20 bytes)','Total length':total+' bytes','Identification':hex(id,4),'TTL':String(ttl),'Protocol':proto+(proto===4?' (IP-in-IP)':' (experimental)'),'Checksum':hex(ck,4),'Source':src,'Destination':dst};}
/* Packet headers for a stage index (0..5). inner TTL: 64 at CN, 63 after HA encapsulation, 62 once FA forwards to MN. */
function packetFor(stage,n){
  var inTotal=20+n, ttl=stage<=1?64:(stage<=4?63:62);
  var inner=header(ADDR.CN,ADDR.MNH,253,ttl,inTotal,0x1A2B);
  var outer=(stage===2||stage===3)?header(ADDR.HA,ADDR.FA,4,64,20+inTotal,0x3C4D):null;
  return {inner:inner,outer:outer};}
function pickDescribe(i,sel,msg){
  var s=sel;var t=[
  'CN ('+s.cn+') builds an IP datagram. Source = CN '+ADDR.CN+', destination = mobile node home address '+ADDR.MNH+'. The payload carries your '+msg.length+'-byte message. CN does not know the MN has moved.',
  'The datagram is routed to the home network because '+ADDR.MNH+' belongs there. HA ('+s.ha+', '+ADDR.HA+') intercepts it on behalf of the absent MN (proxy ARP) and finds the MN\'s care-of address '+ADDR.FA+' in its mobility binding.',
  'HA prepends a new outer IP header (source '+ADDR.HA+', destination care-of address '+ADDR.FA+', protocol 4). The original datagram becomes the payload. Its TTL is decremented to 63 (RFC 2003).',
  'The encapsulated packet travels through the tunnel HA to FA ('+s.ha+' to '+s.fa+'). Routers on the way see only the outer header and forward it toward '+ADDR.FA+'.',
  'FA ('+s.fa+') receives the packet addressed to its own care-of address, removes the outer header and recovers the original datagram unchanged (CN to '+ADDR.MNH+').',
  'FA delivers the inner datagram to the MN on its visited link using the MN\'s home address. TTL is now 62. The MN receives the message: "'+msg+'".'];return t[i];}

var MIP={ADDR:ADDR,STAGES:STAGES,toBinary:toBinary,toBytes:toBytes,checksum:checksum,header:header,packetFor:packetFor};
root.MIP_SIM=MIP;
if(typeof document==='undefined')return;

var $=function(id){return document.getElementById(id);};
var S={sel:null,chars:null,stage:-1,t:0,running:false,done:false,raf:0,last:0,hot:-1};
MIP.state=S;
var DATA=root.MIP_MAP,svgNS='http://www.w3.org/2000/svg';
function el(tag,attrs,parent,text){var e=document.createElementNS(svgNS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;if(parent)parent.appendChild(e);return e;}
function say(id,txt,cls){var e=$(id);e.textContent=txt;e.className='mip-msg'+(cls?' '+cls:'');}

/* ---------- selectors ---------- */
['ha','cn','fa'].forEach(function(k){var s=$('mip-sel-'+k);s.innerHTML='<option value="">Select location</option>'+DATA.cities.map(function(c,i){return '<option value="'+i+'">'+c.n+'</option>';}).join('');});

/* ---------- map ---------- */
var map=$('mip-map'),layers={};
function buildMap(){
  map.innerHTML='';
  el('polygon',{points:DATA.outline.map(function(p){var q=DATA.project(p[1],p[0]);return q.x+','+q.y;}).join(' '),fill:'#fff',opacity:.85,stroke:'#9478E8','stroke-width':3,'stroke-linejoin':'round'},map);
  DATA.cities.forEach(function(c){var p=DATA.project(c.lat,c.lon);el('circle',{cx:p.x,cy:p.y,r:3,fill:'#56B8E8',opacity:.7},map);el('text',{x:p.x+6,y:p.y+3,'font-size':9,fill:'#4a5578'},map,c.n.split(' (')[0]);});
  layers.tunnel=el('g',{},map);layers.links=el('g',{},map);layers.mark=el('g',{},map);layers.pkt=el('g',{},map);
  if(S.sel)drawSelection();
}
function pos(i){return DATA.project(DATA.cities[i].lat,DATA.cities[i].lon);}
function drawSelection(){
  var P={cn:pos(S.sel.cnI),ha:pos(S.sel.haI),fa:pos(S.sel.faI)};P.mn={x:P.fa.x+(P.fa.x>300?-34:34),y:P.fa.y+(P.fa.y>560?-30:30)};S.P=P;
  layers.tunnel.innerHTML='';layers.links.innerHTML='';layers.mark.innerHTML='';
  var dx=P.fa.x-P.ha.x,dy=P.fa.y-P.ha.y,L=Math.hypot(dx,dy)||1,ang=Math.atan2(dy,dx)*180/Math.PI;
  el('line',{x1:P.cn.x,y1:P.cn.y,x2:P.ha.x,y2:P.ha.y,stroke:'#56B8E8','stroke-width':2.5,'stroke-dasharray':'2 5','stroke-linecap':'round'},layers.links);
  el('line',{x1:P.fa.x,y1:P.fa.y,x2:P.mn.x,y2:P.mn.y,stroke:'#68E0E0','stroke-width':2.5,'stroke-dasharray':'2 5','stroke-linecap':'round'},layers.links);
  el('line',{x1:P.ha.x,y1:P.ha.y,x2:P.fa.x,y2:P.fa.y,stroke:'#9478E8','stroke-width':20,opacity:.25,'stroke-linecap':'round'},layers.tunnel);
  [-9,9].forEach(function(o){var nx=-dy/L*o,ny=dx/L*o;el('line',{x1:P.ha.x+nx,y1:P.ha.y+ny,x2:P.fa.x+nx,y2:P.fa.y+ny,stroke:'#9478E8','stroke-width':2},layers.tunnel);});
  S.flow=el('line',{x1:P.ha.x,y1:P.ha.y,x2:P.fa.x,y2:P.fa.y,stroke:'#fff','stroke-width':3,'stroke-dasharray':'10 8',opacity:.9},layers.tunnel);
  [.25,.5,.75].forEach(function(f){var x=P.ha.x+dx*f,y=P.ha.y+dy*f;el('path',{d:'M-7,-6L7,0L-7,6z',fill:'#9478E8',transform:'translate('+x+','+y+') rotate('+ang+')'},layers.tunnel);});
  el('text',{x:(P.ha.x+P.fa.x)/2+12,y:(P.ha.y+P.fa.y)/2-10,'font-size':11,'font-weight':700,fill:'#101A35'},layers.tunnel,'Tunnel HA to FA');
  [['CN',P.cn,'#56B8E8'],['HA',P.ha,'#9478E8'],['FA',P.fa,'#68E0E0']].forEach(function(m){
    el('circle',{cx:m[1].x,cy:m[1].y,r:15,fill:m[2],stroke:'#101A35','stroke-width':2.5},layers.mark);
    el('text',{x:m[1].x,y:m[1].y+4,'font-size':11,'font-weight':800,fill:'#101A35','text-anchor':'middle'},layers.mark,m[0]);
    el('text',{x:m[1].x,y:m[1].y-21,'font-size':11,'font-weight':700,fill:'#101A35','text-anchor':'middle'},layers.mark,S.sel[m[0].toLowerCase()].split(' (')[0]);});
  el('rect',{x:P.mn.x-13,y:P.mn.y-10,width:26,height:20,rx:5,fill:'#C7B8F5',stroke:'#101A35','stroke-width':2},layers.mark);
  el('text',{x:P.mn.x,y:P.mn.y+4,'font-size':10,'font-weight':800,fill:'#101A35','text-anchor':'middle'},layers.mark,'MN');
}

/* ---------- confirm locations ---------- */
$('mip-loc-ok').onclick=function(){
  var v={ha:$('mip-sel-ha').value,cn:$('mip-sel-cn').value,fa:$('mip-sel-fa').value};
  if(v.ha===''||v.cn===''||v.fa===''){say('mip-loc-msg','Select a location for HA, CN and FA first.','mip-err');return;}
  if(new Set([v.ha,v.cn,v.fa]).size<3){say('mip-loc-msg','Choose three different locations so the path is visible.','mip-err');return;}
  hardReset();var n=function(i){return DATA.cities[+i].n;};
  S.sel={ha:n(v.ha),cn:n(v.cn),fa:n(v.fa),haI:+v.ha,cnI:+v.cn,faI:+v.fa};
  drawSelection();say('mip-loc-msg','Locations confirmed: CN '+S.sel.cn+', HA '+S.sel.ha+', FA '+S.sel.fa+'.','mip-good');updateAll();};

/* ---------- message ---------- */
$('mip-msg-ok').onclick=submitMsg;$('mip-input').addEventListener('keydown',function(e){if(e.key==='Enter')submitMsg();});
function submitMsg(){
  var m=$('mip-input').value;if(!m.length){say('mip-text-msg','Enter a message first.','mip-err');return;}
  var r=toBinary(m);if(r.error){say('mip-text-msg',r.error,'mip-err');return;}
  hardReset();S.chars=r.chars;S.msg=m;
  $('mip-bits').innerHTML=r.chars.map(function(c,i){return '<div class="mip-bit" data-i="'+i+'"><b>'+(c.ch===' '?'&#9251;':c.ch.replace(/&/g,'&amp;').replace(/</g,'&lt;'))+'</b>'+c.bin+'<br><small>ASCII '+c.code+'</small></div>';}).join('');
  say('mip-text-msg','Message "'+m+'" converted: '+r.chars.length+' bytes, '+r.chars.length*8+' bits.','mip-good');
  $('mip-wave-note').textContent='Showing '+r.chars.length*8+' bits. Cyan = already transmitted.';updateAll();}

/* ---------- animation engine (single rAF loop) ---------- */
function ready(){if(!S.sel){say('mip-run-msg','Confirm HA, CN and FA locations first.','mip-err');return false;}
  if(!S.chars){say('mip-run-msg','Confirm a message first.','mip-err');return false;}return true;}
function ease(t){return t*t*(3-2*t);}
function frame(ts){
  S.raf=0;if(!S.running)return;
  var dt=Math.min(ts-S.last,100);S.last=ts;S.t+=dt/DUR[S.stage];
  if(S.t>=1){if(S.stage===5){S.t=1;S.running=false;S.done=true;updateAll();return;}S.stage++;S.t=0;}
  updateAll();S.raf=requestAnimationFrame(frame);}
function loop(){if(S.raf)return;S.last=performance.now();S.raf=requestAnimationFrame(frame);}
$('mip-start').onclick=function(){if(!ready())return;if(S.raf){cancelAnimationFrame(S.raf);S.raf=0;}S.stage=0;S.t=0;S.done=false;S.running=true;say('mip-run-msg','Simulation running.','mip-good');updateAll();loop();};
$('mip-pause').onclick=function(){if(!S.running)return;S.running=false;if(S.raf){cancelAnimationFrame(S.raf);S.raf=0;}say('mip-run-msg','Paused at stage '+(S.stage+1)+'.');updateAll();};
$('mip-resume').onclick=function(){if(S.running||S.done||S.stage<0)return;S.running=true;say('mip-run-msg','Resumed from stage '+(S.stage+1)+'.','mip-good');updateAll();loop();};
function hardReset(){if(S.raf){cancelAnimationFrame(S.raf);S.raf=0;}S.running=false;S.done=false;S.stage=-1;S.t=0;S.hot=-1;say('mip-run-msg','');}
$('mip-reset').onclick=function(){hardReset();say('mip-run-msg','Simulation reset. Press START to run again.');updateAll();};

/* ---------- rendering ---------- */
function lerp(a,b,t){return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
function drawPacket(){
  layers.pkt.innerHTML='';if(!S.sel||S.stage<0)return;var P=S.P,st=S.stage,t=ease(Math.min(S.t,1)),p,ring=0;
  if(st===0){p=P.cn;}else if(st===1)p=lerp(P.cn,P.ha,t);else if(st===2){p=P.ha;ring=t;}else if(st===3){p=lerp(P.ha,P.fa,t);ring=1;}
  else if(st===4){p=P.fa;ring=1-t;}else p=lerp(P.fa,P.mn,t);
  if(st===0){el('circle',{cx:p.x,cy:p.y,r:16+22*S.t,fill:'none',stroke:'#56B8E8','stroke-width':3,opacity:1-S.t},layers.pkt);}
  if(ring>0)el('rect',{x:p.x-17-ring*3,y:p.y-14-ring*3,width:34+ring*6,height:28+ring*6,rx:7,fill:'rgba(148,120,232,.35)',stroke:'#9478E8','stroke-width':2.5},layers.pkt);
  el('rect',{x:p.x-11,y:p.y-8,width:22,height:16,rx:4,fill:'#fff',stroke:'#56B8E8','stroke-width':2.5},layers.pkt);
  el('rect',{x:p.x-7,y:p.y-3,width:14,height:6,rx:2,fill:'#68E0E0'},layers.pkt);
  if(S.flow)S.flow.setAttribute('stroke-dashoffset',String(-(S.stage===3?S.t*DUR[3]/40:0)));
}
function layerHTML(cls,title,obj){return '<div class="mip-layer '+cls+'"><h4>'+title+'</h4><div class="mip-fields">'+Object.keys(obj).map(function(k){return '<span>'+k+'</span><span>'+obj[k]+'</span>';}).join('')+'</div></div>';}
function renderInfo(){
  var st=S.stage,box=$('mip-step-info'),pk=$('mip-packet');
  if(st<0||!S.sel||!S.chars){box.innerHTML='<p class="mip-empty">Confirm locations and a message, then press START.</p>';
    pk.innerHTML='<p class="mip-empty">No packet yet.</p>';return;}
  var dir=['at CN','CN to HA','at HA','HA to FA (forward tunnel)','at FA','FA to MN'][st];
  box.innerHTML='<p><b>Stage '+(st+1)+' of 6: '+STAGES[st]+'</b></p><p>'+pickDescribe(st,S.sel,S.msg)+'</p><p><b>Packet position:</b> '+dir+(S.done?' (finished)':'')+'</p><p><b>Payload bytes:</b> '+S.chars.length+' ('+S.chars.length*8+' bits)</p><p><b>Care-of address:</b> '+ADDR.FA+' | <b>MN home address:</b> '+ADDR.MNH+'</p>';
  var h=packetFor(st,S.chars.length),pay={'Content':S.msg,'Length':S.chars.length+' bytes','First byte':S.chars[0].bin};
  pk.innerHTML=(h.outer?layerHTML('','Outer IP header (added by HA, removed by FA)',h.outer):'<p class="mip-empty">No outer header at this stage.'+(st>=4?' It was removed by the FA.':'')+'</p>')+layerHTML('mip-inner','Original inner IP header',h.inner)+layerHTML('mip-payload','Payload (ASCII message)',pay)+'<p class="mip-note">'+(h.outer?'Encapsulated: the whole original datagram is the payload of the outer packet.':'Plain datagram: addressed CN to the MN home address.')+' Protocol 253 (experimental) is used so total length = 20 + message bytes exactly.</p>';
}
function transmitting(){return S.stage===1||S.stage===3||S.stage===5;}
function cursor(){if(!S.chars)return 0;if(S.stage<0)return 0;if(transmitting())return Math.min(S.t,1);return S.stage>5||S.done?1:(S.stage>=4&&!transmitting()?1:0);}
function drawWave(){
  var c=$('mip-wave'),dpr=window.devicePixelRatio||1,w=c.clientWidth||600,h=150;c.width=w*dpr;c.height=h*dpr;var g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);
  if(!S.chars)return;var bits=S.chars.map(function(x){return x.bin;}).join(''),n=bits.length,bw=(w-20)/n,cur=cursor()*n,hi=22,lo=h-26;
  g.strokeStyle='rgba(255,255,255,.08)';for(var b=0;b<=n;b+=8){var gx=10+b*bw;g.beginPath();g.moveTo(gx,8);g.lineTo(gx,h-8);g.stroke();}
  g.lineWidth=2.2;g.lineJoin='round';var prev=null;
  for(var i=0;i<n;i++){var y=bits[i]==='1'?hi:lo,x0=10+i*bw,x1=x0+bw;g.strokeStyle=i<cur?'#68E0E0':'#C7B8F5';g.beginPath();if(prev!==null&&prev!==y)g.moveTo(x0,prev);else g.moveTo(x0,y);g.lineTo(x0,y);g.lineTo(x1,y);g.stroke();prev=y;}
  if(S.stage>=0&&transmitting()){g.strokeStyle='#fff';g.setLineDash([4,4]);g.beginPath();g.moveTo(10+cur*bw,6);g.lineTo(10+cur*bw,h-6);g.stroke();g.setLineDash([]);}
  g.fillStyle='#C7B8F5';g.font='11px sans-serif';g.fillText('1',2,hi+4);g.fillText('0',2,lo+4);}
function updateBits(){var cur=Math.floor(cursor()*S.chars.length+ (cursor()>=1?0:0));if(cursor()>=1)cur=S.chars.length;if(cur===S.hot)return;S.hot=cur;
  var nodes=$('mip-bits').children;for(var i=0;i<nodes.length;i++)nodes[i].classList.toggle('mip-hot',i<cur);}
var lastKey='';
function updateAll(){
  var items=$('mip-stages').children;for(var i=0;i<items.length;i++){items[i].classList.toggle('mip-active',i===S.stage&&!S.done);items[i].classList.toggle('mip-done',S.stage>=0&&(i<S.stage||(S.done&&i===S.stage)));}
  var started=S.stage>=0,paused=started&&!S.running&&!S.done;
  $('mip-start').disabled=S.running;$('mip-pause').disabled=!S.running;$('mip-resume').disabled=!paused;$('mip-reset').disabled=!started&&!S.done;
  var key=S.stage+'|'+S.done+'|'+!!S.sel+'|'+(S.msg||'');if(key!==lastKey){lastKey=key;renderInfo();if(S.done)say('mip-run-msg','Delivered: the MN received "'+S.msg+'".','mip-good');}
  drawPacket();if(S.chars){updateBits();drawWave();}
}
window.addEventListener('resize',function(){drawWave();});
buildMap();updateAll();
})(typeof window!=='undefined'?window:globalThis);
