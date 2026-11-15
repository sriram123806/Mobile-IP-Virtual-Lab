/* Study cases. Each flow step: q = Yes/No question, fix = corrective action taken when answer is No. */
(function(root){
'use strict';
var CASES=[
{id:'ha-no-mn',title:'Home Agent Cannot Find the Mobile Node',
 problem:'Packets reach the home network but the Home Agent has no valid mobility binding for the Mobile Node, so it cannot tunnel them.',
 causes:['Registration never reached the HA or was rejected','Binding lifetime expired and was not renewed','HA does not intercept packets for the MN home address (proxy ARP missing)','Wrong MN home address or HA address configured'],
 diag:['Check the HA mobility binding table for the MN home address','Check the binding lifetime and remaining time','Confirm the HA answers ARP for the MN home address','Verify registration messages in the HA log'],
 flow:[{q:'Does the HA binding table contain an entry for the MN home address?',fix:'Re-register the MN (Registration Request to HA) and check the HA log for a reply code.'},{q:'Is the binding lifetime still valid?',fix:'Renew the registration before the lifetime expires.'},{q:'Does the HA intercept packets for the MN (proxy ARP active)?',fix:'Enable proxy ARP / gratuitous ARP for the MN home address on the home link.'}],
 fixes:['Re-register the MN with a correct care-of address','Renew the binding lifetime','Enable interception on the home network'],
 result:'The HA finds the binding, intercepts the packet and tunnels it to the care-of address.'},
{id:'fa-reg-fail',title:'Foreign Agent Registration Failure',
 problem:'The MN is in a foreign network but the FA does not relay its Registration Request, so the HA never learns the care-of address.',
 causes:['No Agent Advertisement received by the MN','Authentication failure (wrong shared key / SPI)','FA refuses service (busy, policy, unsupported options)','Firewall blocks UDP port 434'],
 diag:['Verify the MN receives Agent Advertisements','Inspect the Registration Reply code','Compare security association settings on MN, FA and HA','Check that UDP port 434 is permitted'],
 flow:[{q:'Does the MN receive Agent Advertisements from the FA?',fix:'Enable agent advertisements on the FA or send an Agent Solicitation from the MN.'},{q:'Is UDP port 434 reachable between MN, FA and HA?',fix:'Open UDP port 434 in firewalls along the path.'},{q:'Do the authentication keys and SPI match on MN and HA?',fix:'Correct the shared key / SPI on both ends.'},{q:'Does the FA accept the request (Reply code 0 or 1)?',fix:'Free FA resources or adjust FA policy, then retry registration.'}],
 fixes:['Fix advertisement and port reachability','Align authentication settings','Retry the registration'],
 result:'The FA relays the request, the HA replies with an accepted code and a binding is created.'},
{id:'encap-fail',title:'Encapsulation Failure at Home Agent',
 problem:'The HA intercepts the packet but cannot build or send the IP-in-IP packet, so nothing enters the tunnel.',
 causes:['Packet larger than tunnel MTU with DF bit set','No route from HA to the care-of address','Tunnel interface down or not configured','TTL of the original datagram is 1'],
 diag:['Compare inner packet size + 20 bytes with the outgoing MTU','Check the HA route to the care-of address','Check tunnel interface status','Read the inner TTL'],
 flow:[{q:'Is the inner packet TTL greater than 1?',fix:'The datagram must be discarded (ICMP Time Exceeded). Fix the sender or routing loop.'},{q:'Is the HA tunnel interface up and configured?',fix:'Create or enable the IP-in-IP tunnel interface toward the care-of address.'},{q:'Does the HA have a route to the care-of address?',fix:'Add or correct the route to the FA network.'},{q:'Does inner size + 20 bytes fit the MTU (or is fragmentation allowed)?',fix:'Allow fragmentation, lower MSS, or return ICMP Fragmentation Needed so the CN reduces size.'}],
 fixes:['Bring up tunnel interface and routes','Handle MTU (fragment or ICMP feedback)'],
 result:'The HA adds the outer header (protocol 4, source HA, destination CoA) and forwards the packet into the tunnel.'},
{id:'decap-fail',title:'Decapsulation Failure at Foreign Agent',
 problem:'Tunneled packets arrive at the FA but the original datagram is never delivered to the MN.',
 causes:['Protocol 4 (IP-in-IP) packets blocked or not processed','Outer destination is not the FA care-of address','Inner destination (MN home address) has no visitor entry','Corrupted packet (bad outer checksum)'],
 diag:['Capture traffic at the FA for protocol 4','Check outer destination equals the FA care-of address','Check the FA visitor list for the MN','Verify header checksums'],
 flow:[{q:'Do protocol 4 packets reach the FA (not filtered)?',fix:'Permit IP protocol 4 through firewalls and ACLs.'},{q:'Is the outer destination address the FA care-of address?',fix:'Correct the care-of address registered at the HA.'},{q:'Is the MN in the FA visitor list?',fix:'Repeat registration so the FA creates a visitor entry.'},{q:'Is the outer header checksum valid?',fix:'Inspect the link for corruption; the FA must discard bad packets and the sender retransmits.'}],
 fixes:['Allow IP-in-IP traffic','Correct CoA and visitor entry'],
 result:'The FA strips the outer header, recovers the inner datagram and delivers it to the MN link.'},
{id:'mn-moves',title:'Mobile Node Changes Network During Transmission',
 problem:'The MN moves to a new foreign network mid-transfer, so packets tunneled to the old care-of address are lost.',
 causes:['New registration not yet processed by the HA','HA still tunnels to the old FA','Old FA does not forward in-flight packets','Registration lifetime or timing too long'],
 diag:['Check whether the MN detected the new agent advertisement','Compare HA binding CoA with the new FA address','Check whether registration reply was received','Measure the handoff delay'],
 flow:[{q:'Did the MN detect the new FA (new advertisement)?',fix:'Reduce advertisement interval or trigger a solicitation on link change.'},{q:'Did the MN send a new Registration Request via the new FA?',fix:'Send registration immediately after detecting movement.'},{q:'Did the HA update the binding to the new care-of address?',fix:'Check authentication and reply code; retry until accepted.'},{q:'Does the old FA forward in-flight packets (smooth handoff)?',fix:'Enable previous-FA notification or accept loss and rely on transport retransmission (TCP).'}],
 fixes:['Register fast after movement','Verify binding update','Rely on retransmission for lost packets'],
 result:'The HA tunnels new packets to the new care-of address and the transfer continues after a short interruption.'}];
root.MIP_CASES=CASES;
if(typeof document==='undefined')return;
var cards=document.getElementById('mip-cases'),det=document.getElementById('mip-detail');
function li(a,o){return (o?'<ol>':'<ul>')+a.map(function(x){return '<li>'+x+'</li>';}).join('')+(o?'</ol>':'</ul>');}
function flowHTML(c){
  return '<div class="mip-flow" role="group" aria-label="Diagnostic flowchart"><div class="mip-fend" style="background:#e6ddfb;border-color:#9478E8">Start: '+c.title+'</div>'+c.flow.map(function(s,i){
    return '<div class="mip-fyes" style="background:#e6ddfb;color:#18233B">Next check</div><div class="mip-fline"><div class="mip-fq">'+(i+1)+'. '+s.q+'</div><div class="mip-fno"><em>No</em><div class="mip-fact">'+s.fix+'</div></div></div><div class="mip-fyes">Yes</div>';}).join('')+'<div class="mip-fend">Fault not in these checks: escalate or review logs, otherwise the path is healthy</div></div>';}
function show(c,btn){
  Array.prototype.forEach.call(cards.children,function(x){x.classList.remove('mip-open');});btn.parentNode.classList.add('mip-open');
  det.hidden=false;det.innerHTML='<h2>'+c.title+'</h2><div class="mip-detail-grid mip-detail"><div><h3>Problem description</h3><p>'+c.problem+'</p><h3>Possible causes</h3>'+li(c.causes)+'<h3>Diagnostic steps</h3>'+li(c.diag,1)+'</div><div><h3>Decision flowchart</h3>'+flowHTML(c)+'</div></div><div class="mip-detail-grid mip-detail"><div><h3>Corrective actions</h3>'+li(c.fixes)+'</div><div><h3>Expected result</h3><p>'+c.result+'</p></div></div><button class="mip-btn mip-btn-alt" id="mip-close" type="button">Close case</button>';
  document.getElementById('mip-close').onclick=function(){det.hidden=true;btn.parentNode.classList.remove('mip-open');btn.focus();};
  det.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
CASES.forEach(function(c,i){var d=document.createElement('div');d.className='mip-case-card';d.setAttribute('data-case',c.id);
  d.innerHTML='<span>'+(i+1)+'. '+c.title+'</span>';var b=document.createElement('button');b.type='button';b.className='mip-btn';b.textContent='View';b.setAttribute('aria-label','View case: '+c.title);
  b.onclick=function(){show(c,b);};d.appendChild(b);cards.appendChild(d);});
})(typeof window!=='undefined'?window:globalThis);
