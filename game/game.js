(()=>{
const $=id=>document.getElementById(id),cv=$('c'),x=cv.getContext('2d'),W=960,H=540,GY=450;

let USER_MSG = (function() {
  try {
    const p = new URLSearchParams(window.location.search).get('msg');
    if (p && p.trim()) return p.trim();
    const s = sessionStorage.getItem('packet_dash_msg');
    if (s && s.trim()) return s.trim();
  } catch(e) {}
  return "Hello, I'm Sriram!";
})();

function msgToAscii(str) {
  return Array.from(str).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

function updateMsgUI() {
  const ascii = msgToAscii(USER_MSG);
  const hm = $('hud-msg'); if (hm) hm.textContent = USER_MSG.length > 18 ? USER_MSG.slice(0, 16) + '…' : USER_MSG;
  const cp = $('cut-payload'); if (cp) cp.textContent = '📩 ' + USER_MSG;
  const cb = $('cut-bits'); if (cb) cb.textContent = 'ASCII: ' + (ascii.length > 36 ? ascii.slice(0, 36) + '…' : ascii);
  const em = $('end-received-msg'); if (em) em.textContent = USER_MSG;
  const eb = $('end-received-bits'); if (eb) eb.textContent = 'Payload (ASCII 8-bit): ' + ascii;
}

window.addEventListener('message', e => {
  if (e.data && e.data.type === 'SET_MESSAGE' && e.data.msg) {
    USER_MSG = e.data.msg.trim();
    try { sessionStorage.setItem('packet_dash_msg', USER_MSG); } catch(err) {}
    updateMsgUI();
  }
});

const sh=(id,v=true)=>$(id).classList.toggle('hide',!v);
const ST=[
{t:'run',name:'Packet Journey Begins',msg:'A packet is travelling towards a Mobile Node.',len:4200,spd:260,pal:'sky',end:'HA',it:'🏠 The Home Agent',ix:'The Mobile Node is away from home, but its packets still go to the Home Agent first. The Home Agent forwards them to where the Mobile Node is now.'},
{t:'cut',name:'Home Agent: Encapsulation',pal:'sky'},
{t:'run',name:'Tunnel Adventure',msg:'Forward Tunnel: HA → FA',len:5000,spd:330,pal:'tun',ring:1,end:'FA',pre:['🚇 Tunneling','The wrapped packet now travels through a private "tunnel" straight from the Home Agent to the Foreign Agent. Its outer address is the Care-of Address.'],it:'🏢 The Foreign Agent',ix:'The Foreign Agent sits in the network the Mobile Node is visiting. It receives tunnelled packets and passes them on to the Mobile Node.'},
{t:'cut',name:'Foreign Agent: Decapsulation',pal:'tun'},
{t:'run',name:'Successful Delivery',msg:'Almost there. The Mobile Node is waiting!',len:2000,spd:260,pal:'sky2',end:'MN'}];
const PAL={sky:['#16235c','#5a3fb5','#e58fd0'],tun:['#070a26','#2a1466','#0b4a6e'],sky2:['#0f3a5c','#2fb5c9','#b8f0d0']};
const GOAL={HA:['#c06bff','Home Agent'],FA:['#4de0ff','Foreign Agent'],MN:['#7dffb0','Mobile Node']};
let st='menu',paused=false,si=0,score=0,d=0,sd=0,gap=450,ents=[],parts=[],trail=[],goal=null,t=0,invul=0,shake=0,fade=1,bg=0,muted=false,combo=0,cutT=[],lives=3,slowT=0,sm=1,flash=0,decapT=0,box={k:0,a:0,dis:0};
const P={x:150,y:GY-22,vy:0,g:true},keys={};
const bits=Array.from({length:36},()=>({x:Math.random()*W,y:Math.random()*400,s:.1+Math.random()*.5,c:Math.random()<.5?'0':'1'}));
let ac;
function snd(f,dur=.1,type='sine',vol=.07,f2){if(muted)return;try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime;o.type=type;o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+dur);g.gain.setValueAtTime(vol,n);g.gain.exponentialRampToValueAtTime(.001,n+dur);o.connect(g);g.connect(ac.destination);o.start();o.stop(n+dur)}catch(e){}}
function toast(m,ms=3200){$('toast').textContent=m;sh('toast');clearTimeout(toast.h);toast.h=setTimeout(()=>sh('toast',0),ms)}
function info(a,b,cb){st='modal';$('it').textContent=a;$('ix').textContent=b;sh('info');$('ib').onclick=()=>{sh('info',0);snd(660,.12,'triangle');cb()}}
function setLives(lost){$('lv').innerHTML=[0,1,2].map(i=>'<span class="hrt'+(i<lives?'':' off')+(lost&&i==lives?' hit':'')+'">♥</span>').join('')}
function dissolve(){box.k=2;box.dis=0;snd(900,.5,'triangle',.1,300);
 for(let i=0;i<44;i++){const a=i/44*Math.PI*2,ex=Math.max(-38,Math.min(38,Math.cos(a)*60)),ey=Math.max(-36,Math.min(36,Math.sin(a)*60));parts.push({x:P.x+ex,y:P.y+ey,vx:ex*6+(Math.random()-.5)*90,vy:ey*6-30+(Math.random()-.5)*90,l:.7+Math.random()*.6,c:i%3?'#7dffb0':'#e8fff2',r:i%2,g:0})}
 toast('✨ Outer IP header removed! The original packet continues unchanged.',3800)}
function gameOver(){st='over';sh('tag',0);sh('toast',0);snd(300,.7,'sawtooth',.08,70);cutT.push(setTimeout(()=>{$('fo').textContent=score;sh('over')},800))}
function burst(px,py,c,n=10,g=0){for(let i=0;i<n;i++)parts.push({x:px,y:py,vx:(Math.random()-.5)*300,vy:(Math.random()-.8)*300,l:.6+Math.random()*.5,c,g})}
function startStage(i){si=i;const s=ST[i];sh('tag',!!s.ring&&s.t=='run');
 if(s.t=='cut'){cut(i==1?'enc':'dec',()=>startStage(i+1));return}
 const go=()=>{st='run';d=sd=0;gap=450;ents=[];goal=null;fade=1;P.x=150;P.y=GY-22;P.vy=0;P.g=true;trail=[];invul=0;slowT=0;sm=1;decapT=0;box.k=0;box.a=0;box.dis=0;if(s.ring||i==4){box.k=1;if(i==4)decapT=1.4;snd(500,.4,'triangle',.1,900)}toast(s.msg)};
 s.pre?info(s.pre[0],s.pre[1],go):go()}
function cut(kind,next){st='modal';const pk=$('pk'),q=(f,ms)=>cutT.push(setTimeout(f,ms)),enc=kind=='enc';
 const fin=()=>{sh('cb');snd(880,.25,'sine',.1,1320)};
 $('ct').textContent=enc?'Home Agent: Encapsulation':'Foreign Agent: Decapsulation';sh('cb',0);sh('cut');
 if(enc){pk.className='noouter';$('cx').textContent='The packet enters the Home Agent with its original IP header and payload…';
  q(()=>{pk.className='';$('cx').textContent='A new outer IP header appears around it. The original packet stays inside!';snd(500,.4,'triangle',.1,900)},2300);
  q(()=>{$('cx').innerHTML='The Home Agent adds a new outer IP header around the original packet. This process is called <b>ENCAPSULATION</b>.';fin()},5200)}
 else{pk.className='';$('cx').textContent='The encapsulated packet enters the Foreign Agent…';
  q(()=>{pk.className='scan';$('cx').textContent='The Foreign Agent spots the outer IP header.';snd(700,.3,'square',.04)},2000);
  q(()=>{pk.className='gone';snd(900,.4,'triangle',.1,300);$('cx').textContent='The outer header comes off. The original header and payload are unchanged.'},4000);
  q(()=>{$('cx').innerHTML='The Foreign Agent removes the outer IP header. This process is called <b>DECAPSULATION</b>.';fin()},6500)}
 $('cb').onclick=()=>{sh('cut',0);snd(660,.12,'triangle');next()}}
function finish(){st='end';sh('tag',0);updateMsgUI();$('fs').textContent=score;sh('end');[523,659,784,1047].forEach((f,i)=>setTimeout(()=>snd(f,.3,'triangle',.1),i*140))}
function reset(){updateMsgUI();cutT.forEach(clearTimeout);cutT=[];['info','cut','end','intro','how','over'].forEach(i=>sh(i,0));lives=3;slowT=0;sm=1;flash=0;box.k=0;setLives();sh('hud');sh('prog');paused=false;$('bp').textContent='⏸';sh('toast',0);score=0;parts=[];startStage(0)}
function jump(){if(st=='run'&&P.g&&!paused){P.vy=-640;P.g=false;snd(520,.18,'square',.04,900)}}
function spawn(){const X=W+60;if(Math.random()<.6){const h=44+(Math.random()*16|0);ents.push({k:'o',x:X,w:40,h});for(let i=0;i<5;i++)ents.push({k:'f',x:X-40+i*26,y:GY-100-Math.sin(i/4*Math.PI)*50})}
 else{const y=GY-40-(Math.random()*70|0);for(let i=0;i<4;i++)ents.push({k:'f',x:X+i*34,y})}}
function update(dt){t+=dt;slowT=Math.max(0,slowT-dt);flash=Math.max(0,flash-dt*2.5);{const tg=slowT>0?.55:1;sm=tg<sm?Math.max(tg,sm-dt*3):Math.min(1,sm+dt*.6)}
 const s=ST[si],run=st=='run'||st=='arrive',spd=run?s.spd*sm:0;
 if(box.k==1){box.a=Math.min(1,box.a+dt*2.5);if(decapT>0&&st=='run'){decapT-=dt;if(decapT<=0)dissolve()}}else if(box.k==2){box.dis+=dt*1.8;if(box.dis>=1)box.k=0}
 if(st=='over'&&P.y<GY-22){P.vy+=1800*dt;P.y=Math.min(GY-22,P.y+P.vy*dt)}
 bg+=(run?(goal&&goal.stop?60:spd):50)*dt;invul=Math.max(0,invul-dt);
 if(run){ents.forEach(e=>e.x-=spd*dt);ents=ents.filter(e=>e.x>-120&&!e.got);
  trail.forEach(q=>q.x-=spd*dt);trail.push({x:P.x,y:P.y});if(trail.length>16)trail.shift();
  P.vy+=1800*dt;P.y+=P.vy*dt;if(P.y>=GY-22){P.y=GY-22;P.vy=0;P.g=true}}
 if(st=='run'){const m=(keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0);P.x=Math.max(90,Math.min(560,P.x+m*300*dt));
  d+=spd*dt;sd+=spd*dt;if(sd>=gap&&d<s.len-600){sd=0;gap=400+Math.random()*220;spawn()}
  for(const e of ents){if(e.k=='o'){if(invul<=0&&P.x+16>e.x+4&&P.x-16<e.x+e.w-4&&P.y+20>GY-e.h+4){invul=1.3;combo=0;score=Math.max(0,score-5);P.vy=-320;P.g=false;shake=1;snd(160,.3,'sawtooth',.08,60);burst(P.x,P.y,'#ff7ad9',14);lives--;setLives(1);flash=1;slowT=3;if(lives<=0)gameOver();else toast('💥 Interference! −1 life. Slowing down… speed recovers soon.',3500)}}
   else if(Math.hypot(P.x-e.x,P.y-e.y)<30){e.got=1;score+=10;combo++;snd(780+Math.min(combo,8)*50,.12,'sine',.07);burst(e.x,e.y,'#7dffb0',8)}}
  if(st=='run'&&d>=s.len){st='arrive';goal={x:W+140,stop:0,k:s.end}}}
 if(st=='arrive'){if(!goal.stop){goal.x-=spd*dt;if(goal.x<=W-230)goal.stop=1}
  else{P.x+=220*dt;if(P.x>=goal.x-70){fade-=dt*2.5;if(fade<=0&&st=='arrive'){fade=0;st='modal';burst(goal.x,GY-60,GOAL[goal.k][0],30);snd(880,.3,'triangle',.1,1320);const g=ST[si];si==4?finish():info(g.it,g.ix,()=>startStage(si+1))}}}}
 if(st=='end'&&Math.random()<.6)parts.push({x:Math.random()*W,y:-10,vx:(Math.random()-.5)*80,vy:100+Math.random()*150,l:5,g:20,c:['#4de0ff','#ff7ad9','#7dffb0','#c06bff','#ffe36b'][Math.random()*5|0],r:1});
 parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.g||0)*dt*3;p.l-=dt});parts=parts.filter(p=>p.l>0);
 $('pf').style.width=((si+(st=='run'?d/s.len:(st=='arrive'?1:0)))/5*100)+'%';$('sc').textContent=score;$('stg').textContent='Stage '+(si+1)+'/5 · '+s.name}
function rr(a,b,w,h,r){x.beginPath();x.roundRect(a,b,w,h,r)}
function city(pal){x.fillStyle='rgba(255,255,255,.07)';for(let i=0;i<12;i++){const tx=((i*140-bg*.35)%1680+1680)%1680-140,th=120+(i*53)%110;x.fillRect(tx,GY-th,70,th);x.fillStyle='rgba(255,255,255,.2)';for(let j=0;j<th/26-1|0;j++)x.fillRect(tx+12,GY-th+14+j*26,8,10),x.fillRect(tx+44,GY-th+14+j*26,8,10);x.fillStyle='rgba(255,255,255,.07)'}
 x.strokeStyle='rgba(160,240,255,.25)';x.fillStyle='rgba(160,240,255,.6)';const L=W+170;let pr;
 for(let i=0;i<9;i++){const nx=((i*170-bg*.15)%L+L)%L-85,ny=170+Math.sin(i*2.1)*60;if(pr){x.beginPath();x.moveTo(pr[0],pr[1]);x.lineTo(nx,ny);x.stroke()}x.beginPath();x.arc(nx,ny,7,0,7);x.fill();pr=nx>pr?.[0]||!pr?[nx,ny]:null}}
function tunnel(){x.lineWidth=4;for(let i=0;i<9;i++){const rx=((i*130-bg*.9)%1170+1170)%1170-100;x.strokeStyle=i%2?'rgba(77,224,255,.55)':'rgba(255,122,217,.55)';x.shadowColor=x.strokeStyle;x.shadowBlur=14;x.beginPath();x.ellipse(rx,250,36,215,0,0,7);x.stroke()}
 x.shadowBlur=0;x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=2;for(let i=0;i<9;i++){const y=60+i*44,lx=((-bg*(1.4+i%3*.4)+i*211)%W+W)%W;x.beginPath();x.moveTo(lx,y);x.lineTo(lx+90,y);x.stroke()}
 x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,W,40)}
function drawGoal(){const g=goal,c=GOAL[g.k][0],gx=g.x;x.save();x.shadowColor=c;x.shadowBlur=26;x.strokeStyle=c;x.lineWidth=3;
 if(g.k=='MN'){x.fillStyle='#0e1642';rr(gx-45,GY-190,90,190,18);x.fill();x.stroke();x.fillStyle='#173a7a';rr(gx-35,GY-175,70,150,8);x.fill();x.fillStyle='#fff';x.font='40px serif';x.textAlign='center';x.fillText('📱',gx,GY-90)}
 else{x.fillStyle='rgba(20,30,90,.85)';x.fillRect(gx-50,GY-270,100,270);x.strokeRect(gx-50,GY-270,100,270);x.beginPath();x.moveTo(gx,GY-270);x.lineTo(gx,GY-310);x.stroke();x.fillStyle=c;x.beginPath();x.arc(gx,GY-314,7+Math.sin(t*6)*2,0,7);x.fill();
  x.shadowBlur=0;for(let r=0;r<6;r++)for(let k=0;k<3;k++){x.fillStyle=(r+k+(t*2|0))%3?'rgba(255,255,255,.18)':c;x.fillRect(gx-34+k*26,GY-255+r*32,16,16)}
  x.shadowBlur=26;x.fillStyle=c+'55';x.beginPath();x.ellipse(gx,GY-34,26,38,0,0,7);x.fill();x.stroke()}
 x.shadowBlur=0;x.fillStyle='#fff';x.font='bold 22px "Trebuchet MS",sans-serif';x.textAlign='center';x.fillText(GOAL[g.k][1],gx,GY+34);x.restore()}
function drawPlayer(){if(fade<=0||st=='menu')return;const s=ST[si];x.save();
 trail.forEach((q,i)=>{x.globalAlpha=fade*i/trail.length*.4;x.fillStyle='#6ff3ff';x.beginPath();x.arc(q.x,q.y,15*i/trail.length,0,7);x.fill()});
 x.globalAlpha=fade*(invul>0&&(t*14|0)%2?.4:1);x.translate(P.x,P.y+(P.g&&st=='run'?Math.sin(t*18)*2:(st=='menu'?Math.sin(t*3)*5:0)));const sq=P.g?1+Math.sin(t*16)*.05:1.1;x.scale(2-sq,sq);
 if(box.k){const e=box.k==1?1-Math.pow(1-box.a,3):1,dz=box.k==2?box.dis:0,sc=(1+(1-e)*.6)*(1+dz*.45);x.save();x.globalAlpha*=e*(1-dz);x.scale(sc,sc);
  x.shadowColor='#5dffb0';x.shadowBlur=22;const f=x.createLinearGradient(-38,-36,38,36);f.addColorStop(0,'rgba(93,255,176,.30)');f.addColorStop(.5,'rgba(93,255,176,.10)');f.addColorStop(1,'rgba(93,255,176,.24)');
  x.fillStyle=f;rr(-38,-36,76,72,12);x.fill();x.strokeStyle='rgba(125,255,190,.95)';x.lineWidth=3;x.stroke();x.shadowBlur=0;
  x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=1.5;x.lineCap='round';x.beginPath();x.moveTo(-28,-30);x.lineTo(-8,-30);x.stroke();
  x.fillStyle='rgba(12,60,48,.9)';rr(-31,-53,62,16,6);x.fill();x.strokeStyle='rgba(125,255,190,.9)';x.lineWidth=1.5;x.stroke();x.fillStyle='#c9ffe0';x.font='bold 10px "Trebuchet MS",sans-serif';x.textAlign='center';x.fillText('OUTER IP',0,-41.5);x.restore()}
 x.shadowColor='#6ff3ff';x.shadowBlur=26;const g=x.createLinearGradient(-22,-22,22,22);g.addColorStop(0,'#6ff3ff');g.addColorStop(1,'#a77bff');x.fillStyle=g;rr(-22,-22,44,44,14);x.fill();x.shadowBlur=0;
 x.fillStyle='#fff';[-8,8].forEach(e=>{x.beginPath();x.arc(e,-4,5.5,0,7);x.fill()});x.fillStyle='#16235c';[-8,8].forEach(e=>{x.beginPath();x.arc(e+1.5,-3,2.6,0,7);x.fill()});
 x.strokeStyle='#fff';x.lineWidth=3;x.lineCap='round';x.beginPath();x.arc(0,4,8,.15*Math.PI,.85*Math.PI);x.stroke();x.restore()}
function draw(){const s=ST[si],p=PAL[s.pal];x.save();if(shake>0){x.translate((Math.random()-.5)*shake*10,(Math.random()-.5)*shake*10);shake-=.05}
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,p[0]);g.addColorStop(.6,p[1]);g.addColorStop(1,p[2]);x.fillStyle=g;x.fillRect(-20,-20,W+40,H+40);
 x.font='14px monospace';x.fillStyle='rgba(200,240,255,.35)';bits.forEach(b=>x.fillText(b.c,((b.x-bg*b.s)%W+W)%W,b.y+Math.sin(t+b.x)*6));
 s.pal=='tun'?tunnel():city();
 x.fillStyle='rgba(8,12,44,.88)';x.fillRect(-20,GY,W+40,H-GY+20);x.strokeStyle=s.pal=='tun'?'#ff7ad9':'#4de0ff';x.shadowColor=x.strokeStyle;x.shadowBlur=14;x.lineWidth=3;x.beginPath();x.moveTo(-20,GY);x.lineTo(W+20,GY);x.stroke();x.shadowBlur=0;
 x.strokeStyle='rgba(160,200,255,.22)';x.lineWidth=1;for(let i=0;i<24;i++){const gx=((i*64-bg)%1536+1536)%1536-100;x.beginPath();x.moveTo(gx,GY);x.lineTo(gx+(gx-W/2)*.7,H);x.stroke()}
 if(si==0&&st!='menu'){const cx=150-d*1;if(cx>-120){x.fillStyle='#0e1642';x.strokeStyle='#4de0ff';x.lineWidth=3;rr(cx-45,GY-120,90,64,8);x.fill();x.stroke();x.fillStyle='#173a7a';x.fillRect(cx-36,GY-112,72,48);x.fillStyle='#4de0ff';x.fillRect(cx-6,GY-56,12,22);x.fillRect(cx-26,GY-36,52,6);x.fillStyle='#fff';x.font='bold 18px "Trebuchet MS",sans-serif';x.textAlign='center';x.fillText('Correspondent Node',cx,GY+34)}}
 if(goal)drawGoal();
 for(const e of ents){if(e.k=='o'){x.save();x.shadowColor='#ff5fa2';x.shadowBlur=18;x.fillStyle='#ff5fa2';const n=2,w=e.w/n;for(let i=0;i<n;i++){x.beginPath();x.moveTo(e.x+i*w,GY);x.lineTo(e.x+i*w+w/2,GY-e.h+(i%2)*10);x.lineTo(e.x+(i+1)*w,GY);x.fill()}x.restore()}
  else{x.save();x.translate(e.x,e.y+Math.sin(t*4+e.x*.02)*3);x.rotate(t*2);x.shadowColor='#7dffb0';x.shadowBlur=14;x.fillStyle='#7dffb0';x.fillRect(-7,-7,14,14);x.fillStyle='#e8fff2';x.fillRect(-3,-3,6,6);x.restore()}}
 drawPlayer();
 parts.forEach(q=>{x.globalAlpha=Math.min(1,q.l*2);x.fillStyle=q.c;q.r?x.fillRect(q.x,q.y,8,5):(x.beginPath(),x.arc(q.x,q.y,3,0,7),x.fill())});x.globalAlpha=1;if(flash>0){const r=x.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.95);r.addColorStop(0,'rgba(255,95,162,0)');r.addColorStop(1,'rgba(255,95,162,'+flash*.6+')');x.fillStyle=r;x.fillRect(-20,-20,W+40,H+40)}x.restore()}
let last=0;function loop(ts){const dt=Math.min(.033,(ts-last)/1000||0);last=ts;if(!paused)update(dt);draw();requestAnimationFrame(loop)}
function pause(){if(st=='menu'||st=='end'||st=='over')return;paused=!paused;$('bp').textContent=paused?'▶':'⏸';paused?toast('Paused. Press P or ▶ to resume.',9e5):sh('toast',0)}
function mute(){muted=!muted;$('bm').textContent=muted?'🔇':'🔊'}
addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys[e.code]=1;
 if((e.code=='Space'||e.code=='ArrowUp'||e.code=='KeyW')&&!e.repeat)jump();if(!$('how').classList.contains('hide')){if(e.code=='Escape')sh('how',0);return}if(e.code=='KeyP'||e.code=='Escape')pause();if(e.code=='KeyM')mute()});
addEventListener('keyup',e=>keys[e.code]=0);addEventListener('blur',()=>{for(const k in keys)keys[k]=0});
const hold=(id,k)=>{const b=$(id);b.onpointerdown=e=>{e.preventDefault();keys[k]=1};['pointerup','pointerleave','pointercancel'].forEach(v=>b.addEventListener(v,()=>keys[k]=0))};
hold('tl','ArrowLeft');hold('tr','ArrowRight');$('tj').onpointerdown=e=>{e.preventDefault();jump()};
$('go').onclick=()=>{snd(440,.25,'triangle',.1,880);try{const r=document.documentElement.requestFullscreen;r&&!document.fullscreenElement&&r.call(document.documentElement).catch(()=>{})}catch(e){}reset()};
$('hw').onclick=()=>{snd(660,.12,'triangle');sh('how')};$('hb').onclick=()=>{snd(500,.12,'triangle');sh('how',0)};$('ra').onclick=reset;setLives();$('again').onclick=reset;$('br').onclick=reset;$('bp').onclick=pause;$('bm').onclick=mute;
const exitGame = () => {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'EXIT_GAME' }, '*');
  } else {
    window.location.href = '../pages/game.html';
  }
};
const bx = $('bx'); if (bx) bx.onclick = exitGame;
const ee = $('end-exit-btn'); if (ee) ee.onclick = exitGame;
const nm = $('new-msg-btn');
if (nm) {
  nm.onclick = () => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'CHANGE_MESSAGE' }, '*');
    } else {
      const input = prompt('Enter new message for data packet:', USER_MSG);
      if (input && input.trim()) {
        USER_MSG = input.trim();
        try { sessionStorage.setItem('packet_dash_msg', USER_MSG); } catch(err) {}
        updateMsgUI();
        reset();
      }
    }
  };
}
updateMsgUI();
requestAnimationFrame(loop);
})();
