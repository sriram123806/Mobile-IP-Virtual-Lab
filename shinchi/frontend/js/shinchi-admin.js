(function(){"use strict";
var $=function(i){return document.getElementById(i)};var EXT=[".pdf",".docx",".txt",".md",".markdown",".html",".htm"];var STAGES=["validating","extracting","cleaning","chunking","embedding","indexing","done"];
function st(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){return null}}
$("api").value=st("shinchi.api")||"";$("tok").value=st("shinchi.tok")||"";
function base(){return $("api").value.trim().replace(/\/+$/,"")}
function H(){return{Authorization:"Bearer "+$("tok").value.trim()}}
function esc(s){var d=document.createElement("div");d.textContent=s==null?"":String(s);return d.innerHTML}
function msg(box,cls,t){var d=document.createElement("div");d.className="msg "+cls;d.textContent=t;box.appendChild(d);return d}
async function call(path,opt){opt=opt||{};opt.headers=Object.assign(H(),opt.headers||{});var r=await fetch(base()+path,opt);var j={};try{j=await r.json()}catch(e){}
 if(!r.ok){var m=r.status===401?"Wrong or missing admin token.":r.status===503?"Admin API is disabled on the server. Set ADMIN_TOKEN (8+ characters) in its environment.":(j.detail||("Request failed ("+r.status+")"));var e=new Error(m);e.status=r.status;throw e}return j}
async function refresh(){var c=$("conn");c.textContent="";
 try{var h=await (await fetch(base()+"/api/health")).json();$("health").textContent="LLM: "+(h.llm.enabled?h.llm.provider+" / "+h.llm.model:"none (extractive mode)")+" | embeddings: "+h.embeddings.model+" | chunks: "+h.index.chunks+(h.index.needs_rebuild?" | REBUILD NEEDED":"");
 if(h.index.needs_rebuild)msg(c,"warn","The embedding model changed since these documents were indexed. Click 'Rebuild full index'.")}catch(e){$("health").textContent="";msg(c,"err","Can't reach the server at "+(base()||"this origin")+".");return}
 try{var d=await call("/api/admin/documents");render(d)}catch(e){msg(c,"err",e.message)}}
function render(d){var t='<table><tr><th>Title / source</th><th>Category</th><th>Status</th><th>Chunks</th><th>Pages</th><th>Size</th><th>Updated</th><th></th></tr>';
 d.documents.forEach(function(x){t+="<tr><td><b>"+esc(x.title)+"</b><br><span class='small'>"+esc(x.source)+"</span>"+(x.error?"<div class='msg err'>"+esc(x.error)+"</div>":"")+(x.warnings||[]).map(function(w){return "<div class='msg warn'>"+esc(w)+"</div>"}).join("")+"</td><td>"+esc(x.category)+"</td><td><span class='b "+esc(x.status)+"'>"+esc(x.status)+"</span> "+(x.doc_status==="starter"?"<span class='b starter'>starter</span>":"")+"</td><td>"+x.chunks+"</td><td>"+(x.pages||"")+"</td><td>"+Math.round(x.size_bytes/1024)+" KB</td><td>"+esc((x.updated_at||"").slice(0,16).replace("T"," "))+"</td><td><button class='danger' data-del='"+esc(x.source)+"'>Delete</button></td></tr>"});
 $("docs").innerHTML=t+"</table><div class='small'>Total chunks: "+d.total_chunks+" | embedder: "+esc(d.embedder)+"</div>"}
$("docs").addEventListener("click",async function(e){var s=e.target.getAttribute&&e.target.getAttribute("data-del");if(!s)return;if(!confirm("Delete "+s+" from the knowledge base? The file is removed too."))return;
 try{await call("/api/admin/documents?source="+encodeURIComponent(s),{method:"DELETE"});refresh()}catch(x){msg($("conn"),"err",x.message)}});
function stepper(job){var i=STAGES.indexOf(job.stage);return "<div class='steps'>"+STAGES.map(function(s,k){return "<span class='"+(job.status==="done"||k<i?"done":(k===i?"on":""))+"'>"+s+"</span>"}).join("")+"</div><progress max='1' value='"+(job.progress||0)+"'></progress>"}
async function poll(id,box,label){var d=document.createElement("div");d.className="msg";box.appendChild(d);
 for(;;){var j;try{j=await call("/api/admin/jobs/"+id)}catch(e){d.className="msg err";d.textContent=label+": "+e.message;return}
  d.innerHTML="<b>"+esc(label)+"</b> - "+esc(j.message||"")+stepper(j);
  if(j.status==="done"){d.className="msg ok";d.innerHTML="<b>"+esc(label)+"</b> - "+esc(j.message)+(j.warnings||[]).map(function(w){return "<div class='small'>Warning: "+esc(w)+"</div>"}).join("");refresh();return}
  if(j.status==="failed"){d.className="msg err";d.innerHTML="<b>"+esc(label)+"</b> failed: "+esc(j.error||"unknown error");refresh();return}
  await new Promise(function(r){setTimeout(r,700)})}}
async function upload(f){var box=$("uploads");var ext=(f.name.match(/\.[^.]+$/)||[""])[0].toLowerCase();
 if(EXT.indexOf(ext)<0){msg(box,"err",f.name+": unsupported type. Allowed: "+EXT.join(" "));return}
 var fd=new FormData();fd.append("file",f);
 try{var j=await call("/api/admin/upload",{method:"POST",body:fd});poll(j.job_id,box,f.name)}catch(e){msg(box,"err",f.name+": "+e.message)}}
$("connect").onclick=function(){st("shinchi.api",$("api").value);st("shinchi.tok",$("tok").value);refresh()};
$("forget").onclick=function(){st("shinchi.tok",null);$("tok").value="";$("docs").innerHTML=""};
$("pick").onclick=function(){$("file").click()};$("file").onchange=function(e){[].forEach.call(e.target.files,upload);e.target.value=""};
var dz=$("drop");["dragover","dragenter"].forEach(function(n){dz.addEventListener(n,function(e){e.preventDefault();dz.classList.add("over")})});
["dragleave","drop"].forEach(function(n){dz.addEventListener(n,function(e){e.preventDefault();dz.classList.remove("over")})});
dz.addEventListener("drop",function(e){[].forEach.call(e.dataTransfer.files,upload)});
async function reindex(mode){try{var j=await call("/api/admin/reindex",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:mode})});poll(j.job_id,$("idxjob"),mode==="rebuild"?"Rebuild":"Sync")}catch(e){msg($("idxjob"),"err",e.message)}}
$("sync").onclick=function(){reindex("sync")};$("rebuild").onclick=function(){if(confirm("Wipe the vector index and re-embed every document? This can take a while."))reindex("rebuild")};
refresh()})();
