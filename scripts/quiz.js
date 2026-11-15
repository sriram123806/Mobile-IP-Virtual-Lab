(function(root){
'use strict';
var KEY='mip_quiz_history_v1';
/* a = correct answer (always first in the bank; options are shuffled at run time and checked by identity) */
var BANK=[
{id:1,q:'What is the main purpose of Mobile IP?',a:'To let a device keep its IP address while moving between networks',w:['To encrypt all traffic on a wireless link','To assign a new IP address at every location','To replace DNS name resolution'],e:'Mobile IP keeps a permanent home address so connections survive movement.'},
{id:2,q:'Which node is the device that changes its point of attachment in Mobile IP?',a:'Mobile Node',w:['Home Agent','Correspondent Node','Foreign Agent'],e:'The Mobile Node (MN) is the moving host.'},
{id:3,q:'What does the Correspondent Node (CN) do?',a:'Communicates with the Mobile Node using its home address',w:['Stores the care-of address of every router','Removes the outer IP header','Assigns IP addresses on the visited network'],e:'The CN is the peer and normally sends to the MN home address, unaware of movement.'},
{id:4,q:'Which entity keeps the mobility binding between the home address and the care-of address?',a:'Home Agent',w:['Foreign Agent','Correspondent Node','Default gateway of the CN'],e:'The Home Agent maintains the binding and tunnels packets.'},
{id:5,q:'What is the main job of the Foreign Agent?',a:'Decapsulate tunneled packets and deliver them to the Mobile Node',w:['Intercept packets on the home network','Generate packets for the Correspondent Node','Encapsulate packets at the home network'],e:'The FA serves visiting nodes: it decapsulates and delivers.'},
{id:6,q:'What is a care-of address (CoA)?',a:'The tunnel endpoint address for the Mobile Node at its current location',w:['The permanent address of the Mobile Node','The address of the Correspondent Node','The broadcast address of the home network'],e:'Tunneled packets are addressed to the CoA, for example the FA address.'},
{id:7,q:'What happens during encapsulation at the Home Agent?',a:'The original datagram is placed inside a new IP packet with an outer header',w:['The payload is encrypted with a shared key','The original header is replaced and discarded','The packet is split into 8-bit characters'],e:'IP-in-IP (RFC 2003) adds an outer header, leaving the original datagram intact as payload.'},
{id:8,q:'What happens during decapsulation at the Foreign Agent?',a:'The outer IP header is removed to recover the original datagram',w:['A second outer header is added','The care-of address is deleted from the HA','The inner header source address is changed to the FA'],e:'Removing the outer header exposes the original datagram for delivery.'},
{id:9,q:'In forward tunneling, in which direction does the tunneled packet travel?',a:'From the Home Agent to the Foreign Agent',w:['From the Foreign Agent to the Home Agent','From the Mobile Node to the Correspondent Node','From the Correspondent Node to the Foreign Agent'],e:'Forward tunneling carries packets addressed to the MN from HA to FA (care-of address).'},
{id:10,q:'Which sequence correctly describes packet delivery to a visiting Mobile Node?',a:'CN, then HA (encapsulates), then tunnel, then FA (decapsulates), then MN',w:['CN, then FA, then HA, then MN','CN, then MN directly, then HA','HA, then CN, then FA, then MN'],e:'The CN sends to the home address; the HA tunnels to the FA, which delivers to the MN.'}];
function shuffle(arr,rng){var a=arr.slice();rng=rng||Math.random;for(var i=a.length-1;i>0;i--){var j=Math.floor(rng()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function comboKey(ids){return ids.slice().sort(function(a,b){return a-b;}).join('-');}
function pick(bank,history,rng){var used={};(history||[]).forEach(function(h){used[h.combo]=1;});var chosen;
  for(var i=0;i<500;i++){chosen=shuffle(bank,rng).slice(0,5);if(!used[comboKey(chosen.map(function(q){return q.id;}))])break;}return chosen;}
function build(bank,history,rng){return pick(bank,history,rng).map(function(q){return {id:q.id,q:q.q,e:q.e,correct:q.a,options:shuffle([q.a].concat(q.w),rng),chosen:null};});}
function score(qs){return qs.filter(function(q){return q.chosen===q.correct;}).length;}
root.MIP_QUIZ={BANK:BANK,shuffle:shuffle,comboKey:comboKey,pick:pick,build:build,score:score,KEY:KEY};
if(typeof document==='undefined')return;
var box=document.getElementById('mip-quiz-box'),hist=document.getElementById('mip-history'),run;
function load(){try{return JSON.parse(localStorage.getItem(KEY))||[];}catch(e){return [];}}
function save(h){try{localStorage.setItem(KEY,JSON.stringify(h.slice(-50)));}catch(e){}}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function renderHistory(){var h=load();if(!h.length){hist.innerHTML='<p class="mip-empty">No attempts yet.</p>';return;}
  hist.innerHTML='<table class="mip-hist"><tr><th>#</th><th>Date</th><th>Score</th></tr>'+h.slice().reverse().map(function(x,i){return '<tr><td>'+(h.length-i)+'</td><td>'+esc(new Date(x.date).toLocaleString())+'</td><td>'+x.score+' / 5</td></tr>';}).join('')+'</table><p><button class="mip-btn mip-btn-alt" id="mip-clear" type="button">Clear history</button></p>';
  document.getElementById('mip-clear').onclick=function(){save([]);renderHistory();};}
function start(){run={qs:build(BANK,load()),i:0};renderQ();}
function renderQ(){var q=run.qs[run.i],last=run.i===run.qs.length-1;
  box.innerHTML='<p><b>Question '+(run.i+1)+' of 5</b></p><div class="mip-progress"><i style="width:'+(run.i/5*100)+'%"></i></div><h2>'+esc(q.q)+'</h2><div class="mip-opts" role="radiogroup" aria-label="Answer options">'+q.options.map(function(o,k){return '<button type="button" role="radio" aria-checked="'+(q.chosen===o)+'" class="mip-opt'+(q.chosen===o?' mip-sel':'')+'" data-k="'+k+'">'+esc(o)+'</button>';}).join('')+'</div><button class="mip-btn" id="mip-next" type="button" '+(q.chosen===null?'disabled':'')+'>'+(last?'Submit quiz':'Next')+'</button>';
  Array.prototype.forEach.call(box.querySelectorAll('.mip-opt'),function(b){b.onclick=function(){q.chosen=q.options[+b.getAttribute('data-k')];renderQ();box.querySelector('.mip-sel').focus();};});
  document.getElementById('mip-next').onclick=function(){if(last)finish();else{run.i++;renderQ();}};}
function finish(){var s=score(run.qs),h=load();h.push({date:new Date().toISOString(),score:s,combo:comboKey(run.qs.map(function(q){return q.id;}))});save(h);
  box.innerHTML='<h2>Result</h2><p class="mip-score">'+s+' / 5</p><div class="mip-progress"><i style="width:100%"></i></div>'+run.qs.map(function(q,n){var ok=q.chosen===q.correct;
    return '<div class="mip-rev '+(ok?'mip-right':'')+'"><b>'+(n+1)+'. '+esc(q.q)+'</b><br>Your answer: '+esc(q.chosen)+' ('+(ok?'correct':'incorrect')+')'+(ok?'':'<br>Correct answer: <b>'+esc(q.correct)+'</b>')+'<br><span class="mip-note">'+esc(q.e)+'</span></div>';}).join('')+'<button class="mip-btn" id="mip-retake" type="button">Retake Quiz</button>';
  document.getElementById('mip-retake').onclick=start;renderHistory();box.scrollIntoView({block:'start'});}
renderHistory();start();
})(typeof window!=='undefined'?window:globalThis);
