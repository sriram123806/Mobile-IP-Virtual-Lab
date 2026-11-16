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
var LETTERS=['A','B','C','D'];

function load(){try{return JSON.parse(localStorage.getItem(KEY))||[];}catch(e){return [];}}
function save(h){try{localStorage.setItem(KEY,JSON.stringify(h.slice(-50)));}catch(e){}}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}

function renderHistory(){
  var h=load();
  if(!h.length){hist.innerHTML='<p class="mip-empty" style="color:#64748b;font-style:italic;">No quiz attempts recorded yet.</p>';return;}
  hist.innerHTML='<table class="mip-hist"><thead><tr><th>#</th><th>Date &amp; Time</th><th>Score</th></tr></thead><tbody>'+
    h.slice().reverse().map(function(x,i){
      return '<tr><td>'+(h.length-i)+'</td><td>'+esc(new Date(x.date).toLocaleString())+'</td><td><b>'+x.score+' / 5</b></td></tr>';
    }).join('')+'</tbody></table><p style="margin-top:14px;"><button class="lab-btn" id="mip-clear" type="button" style="background:#64748b;font-size:0.8rem;padding:6px 16px;">Clear History</button></p>';
  document.getElementById('mip-clear').onclick=function(){save([]);renderHistory();};
}

function start(){run={qs:build(BANK,load()),i:0};renderQ();}

function renderQ(){
  var q=run.qs[run.i],last=run.i===run.qs.length-1;
  var pct=((run.i)/5)*100;
  
  box.innerHTML=
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'+
      '<span style="font-weight:700;color:#2563eb;font-size:0.95rem;text-transform:uppercase;letter-spacing:0.06em;">Question '+(run.i+1)+' of 5</span>'+
      '<span style="font-size:0.85rem;color:#64748b;">Progress: '+(run.i)+'/5 Completed</span>'+
    '</div>'+
    '<div class="mip-progress"><i style="width:'+pct+'%"></i></div>'+
    '<h2 style="font-size:1.25rem;color:#0f172a;margin:16px 0 20px;line-height:1.45;">'+(run.i+1)+'. '+esc(q.q)+'</h2>'+
    '<div class="mip-opts" role="radiogroup" aria-label="Answer options">'+
      q.options.map(function(o,k){
        var isSel = (q.chosen===o);
        return '<button type="button" role="radio" aria-checked="'+isSel+'" class="mip-opt'+(isSel?' mip-sel':'')+'" data-k="'+k+'">'+
          '<span class="opt-badge">'+LETTERS[k]+'</span>'+
          '<span class="opt-text">'+esc(o)+'</span>'+
          (isSel ? '<span class="opt-check">✓ Selected</span>' : '')+
        '</button>';
      }).join('')+
    '</div>'+
    '<div style="margin-top:24px;display:flex;justify-content:flex-end;">'+
      '<button class="lab-btn" id="mip-next" type="button" '+(q.chosen===null?'disabled':'')+' style="font-size:0.95rem;padding:12px 28px;">'+
        (last ? 'Submit Quiz &rarr;' : 'Next Question &rarr;')+
      '</button>'+
    '</div>';

  Array.prototype.forEach.call(box.querySelectorAll('.mip-opt'),function(b){
    b.onclick=function(){
      q.chosen=q.options[+b.getAttribute('data-k')];
      renderQ();
    };
  });

  document.getElementById('mip-next').onclick=function(){
    if(last) finish();
    else { run.i++; renderQ(); }
  };
}

function finish(){
  var s=score(run.qs),h=load();
  h.push({date:new Date().toISOString(),score:s,combo:comboKey(run.qs.map(function(q){return q.id;}))});
  save(h);

  var scoreColor = (s >= 4) ? '#10b981' : ((s >= 3) ? '#f59e0b' : '#ef4444');
  var feedbackMsg = (s === 5) ? 'Outstanding! Perfect score on Mobile IP concepts!' :
                    (s >= 4) ? 'Great job! Strong understanding of tunneling & agents.' :
                    (s >= 3) ? 'Good effort! Review the study cases and theory to master Mobile IP.' :
                    'Needs review. Please revisit the Theory and Procedure pages before retaking.';

  box.innerHTML=
    '<div style="text-align:center;padding:10px 0 24px;">'+
      '<h2 style="font-size:1.4rem;color:#0f172a;margin-bottom:8px;">Quiz Results</h2>'+
      '<p class="mip-score" style="color:'+scoreColor+';font-size:3rem;font-weight:900;margin:6px 0;">'+s+' / 5</p>'+
      '<p style="font-size:1rem;color:#334155;font-weight:600;margin-bottom:14px;">'+feedbackMsg+'</p>'+
      '<div class="mip-progress"><i style="width:100%;background:'+scoreColor+'"></i></div>'+
    '</div>'+
    '<h3 style="color:#0f172a;margin-bottom:12px;font-size:1.1rem;border-bottom:1.5px solid #e2e8f0;padding-bottom:6px;">Detailed Question Review:</h3>'+
    run.qs.map(function(q,n){
      var ok=q.chosen===q.correct;
      return '<div class="mip-rev '+(ok?'mip-right':'')+'">'+
        '<div style="font-weight:700;color:#0f172a;margin-bottom:4px;">'+(n+1)+'. '+esc(q.q)+'</div>'+
        '<div style="font-size:0.9rem;margin-bottom:2px;"><b>Your answer:</b> '+esc(q.chosen)+' <span style="font-weight:700;color:'+(ok?'#16a34a':'#dc2626')+';">('+(ok?'Correct':'Incorrect')+')</span></div>'+
        (ok?'':'<div style="font-size:0.9rem;color:#16a34a;margin-bottom:2px;"><b>Correct answer:</b> '+esc(q.correct)+'</div>')+
        '<div class="mip-note" style="color:#475569;font-size:0.86rem;margin-top:4px;"><b>Explanation:</b> '+esc(q.e)+'</div>'+
      '</div>';
    }).join('')+
    '<div style="text-align:center;margin-top:24px;">'+
      '<button class="lab-btn" id="mip-retake" type="button" style="font-size:1rem;padding:12px 32px;">Retake Quiz</button>'+
    '</div>';

  document.getElementById('mip-retake').onclick=start;
  renderHistory();
  box.scrollIntoView({behavior:'smooth',block:'start'});
}

renderHistory();
start();
})(typeof window!=='undefined'?window:globalThis);
