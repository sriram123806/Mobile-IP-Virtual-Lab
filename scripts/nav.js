/* Shared navigation. Edit MIP_NAV hrefs when integrating with Part A. */
(function(){
  var MIP_NAV=[
    {key:'aim',label:'AIM',href:'#mip-part-a-aim',partA:true},
    {key:'theory',label:'THEORY',href:'#mip-part-a-theory',partA:true},
    {key:'procedure',label:'PROCEDURE',href:'#mip-part-a-procedure',partA:true},
    {key:'simulation',label:'SIMULATION',href:'simulation.html'},
    {key:'learning',label:'LEARNING',href:'learning.html'},
    {key:'quiz',label:'QUIZ',href:'quiz.html'},
    {key:'references',label:'REFERENCES',href:'references.html'}];
  var host=document.getElementById('mip-nav'); if(!host) return;
  var active=host.getAttribute('data-active');
  host.className='mip-nav'; host.setAttribute('aria-label','Virtual lab sections');
  MIP_NAV.forEach(function(n){
    var a=document.createElement('a'); a.textContent=n.label; a.href=n.href;
    if(n.key===active) a.setAttribute('aria-current','page');
    if(n.partA) a.addEventListener('click',function(e){
      if(a.getAttribute('href').charAt(0)==='#'){e.preventDefault();
        var t=document.createElement('div');t.className='mip-toast';t.setAttribute('role','status');
        t.textContent=n.label+' belongs to Part A. Set its path in scripts/nav.js during integration.';
        document.body.appendChild(t);setTimeout(function(){t.remove();},3200);}});
    host.appendChild(a);});
})();
