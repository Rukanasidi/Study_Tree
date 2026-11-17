function done(el,sc,n,again){el.innerHTML=`<div class=big>🎉</div><h2>Well done!</h2><p>You got ${sc} of ${n} first time.</p><button class=btn id=ag>Play again</button>`;$('#ag').onclick=again;say('Well done!')}
function quiz(el,items,mk){let i=0,sc=0;const n=items.length;(function go(){
 if(i>=n)return done(el,sc,n,()=>quiz(el,S(items).slice(0,n),mk));
 const q=mk(items[i]);let w=0;
 el.innerHTML=`<p class=mut>Question ${i+1} of ${n}</p><div class=big>${q.big}</div><div class=opts>${q.o.map(x=>`<button class=opt>${x}</button>`).join('')}</div>${q.say?'<button class=ghost id=sp>🔊 Hear it</button>':''}`;
 if(q.say){say(q.say);$('#sp').onclick=()=>say(q.say)}
 el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
  if(b.textContent===q.a){b.classList.add('ok');star();try{ptTrack(q.a,!w)}catch(e){}if(!w)sc++;say(q.say||q.a);setTimeout(()=>{i++;go()},800)}
  else{w++;if(w>1)ptHint(el,q.a);try{ptTrack(q.a,false,true)}catch(e){}b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),500)}})})()}

function ispy(el){let L=R(SL),up=0;const draw=()=>{
 const ch=x=>up?x.toUpperCase():x,t=ch(L),n=8+(Math.random()*3|0),f0=0;let f=0;
 const cells=S([...Array(n).fill(t),...Array.from({length:18-n},()=>ch(R(ALL.filter(x=>x!=L))))]);
 el.innerHTML=`<div class=chips>${SL.map(x=>`<button class="chip ${x==L?'on':''}" data-l=${x}>${ch(x)}</button>`).join('')}<button class=chip id=cs>Aa</button></div><p>Find every <b>${t}</b>! <b id=cnt>0</b>/${n}</p><div class=grid>${cells.map(c=>`<button class=bub>${c}</button>`).join('')}</div><button class=ghost id=nw>New round</button>`;
 el.querySelectorAll('.chip[data-l]').forEach(b=>b.onclick=()=>{L=b.dataset.l;draw()});
 $('#cs').onclick=()=>{up=!up;draw()};$('#nw').onclick=draw;
 el.querySelectorAll('.bub').forEach(b=>b.onclick=()=>{
  if(b.textContent==t){if(b.classList.contains('ok'))return;b.classList.add('ok');f++;$('#cnt').textContent=f;say(P[L]);if(f==n){star();setTimeout(()=>say('You found them all!'),600);$('#nw').textContent='🎉 All found! New round'}}
  else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),400)}})};draw()}

function trace(el){let ch='s';const TL=[...ALL,...'jqvwxyz',...DG];const draw=()=>{
 el.innerHTML=`<div class=chips>${TL.map(x=>`<button class="chip ${x==ch?'on':''}">${x}</button>`).join('')}</div><canvas id=cv width=600 height=600></canvas><p class=mut id=tm></p><div><button class=ghost id=cl>🧽 Clear</button><button class=ghost id=hr>🔊 Sound</button><button class=btn id=dn>✅ Done</button></div>`;
 const c=$('#cv'),x=c.getContext('2d'),ink=document.createElement('canvas');ink.width=ink.height=600;const ix=ink.getContext('2d');
 const base=()=>{x.clearRect(0,0,600,600);x.lineWidth=3;x.strokeStyle='#8886';x.setLineDash([10,10]);[175,250].forEach(y=>{x.beginPath();x.moveTo(0,y);x.lineTo(600,y);x.stroke()});x.setLineDash([]);x.beginPath();x.moveTo(0,400);x.lineTo(600,400);x.stroke();
  x.fillStyle='rgba(128,128,128,.3)';x.textAlign='center';x.font=`bold ${ch.length>1?230:300}px "Comic Neue","Comic Sans MS",sans-serif`;x.fillText(ch,300,400);x.drawImage(ink,0,0)};
 base();if(document.fonts)document.fonts.ready.then(base);
 let d=0;const pt=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*600/r.width,(e.clientY-r.top)*600/r.height]};
 c.onpointerdown=e=>{d=1;c.setPointerCapture(e.pointerId);const[a,b]=pt(e);[x,ix].forEach(k=>{k.strokeStyle='#e8590c';k.lineWidth=24;k.lineCap=k.lineJoin='round';k.setLineDash([]);k.beginPath();k.moveTo(a,b);k.lineTo(a+.1,b);k.stroke()})};
 c.onpointermove=e=>{if(!d)return;const[a,b]=pt(e);[x,ix].forEach(k=>{k.lineTo(a,b);k.stroke()})};
 c.onpointerup=c.onpointercancel=()=>d=0;
 $('#cl').onclick=()=>{ix.clearRect(0,0,600,600);base();$('#tm').textContent=''};$('#hr').onclick=()=>say(P[ch]||ch);
 $('#dn').onclick=()=>{const g=f=>{const m=document.createElement('canvas');m.width=m.height=600;const k=m.getContext('2d');k.font=x.font;k.textAlign='center';k.fillStyle=k.strokeStyle='#000';k.lineJoin='round';f(k);return k.getImageData(0,0,600,600).data};
  const L=g(k=>k.fillText(ch,300,400)),W=g(k=>{k.lineWidth=80;k.strokeText(ch,300,400);k.fillText(ch,300,400)}),N=ix.getImageData(0,0,600,600).data;
  let lp=0,cv=0,ip=0,out=0;for(let yy=0;yy<600;yy+=3)for(let xx=0;xx<600;xx+=3){const i=(yy*600+xx)*4+3;if(L[i]>128){lp++;if(N[i]>0)cv++}if(N[i]>0){ip++;if(W[i]<30)out++}}
  const tm=$('#tm');
  if(ip<30){tm.textContent='Trace the letter first, then press Done!';return}
  if(cv/lp>.5&&out/ip<.45){star();tm.textContent='🌟 Great tracing! Next letter…';say('Great tracing!');setTimeout(()=>{ch=TL[(TL.indexOf(ch)+1)%TL.length];draw()},1300)}
  else{tm.textContent='Nearly! Follow the grey letter, then press Done again.';say('Try again')}};
 el.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{ch=b.textContent;draw()})};draw()}

const missing=el=>quiz(el,S(M).slice(0,10),([w,a,e])=>{const pool=a.length>1?DG:ALL;return{big:`${e}<div class=word>${w.replace(a,'_')}</div>`,o:S([a,...S(pool.filter(x=>x!=a)).slice(0,2)]),a,say:w}});
const pick=el=>quiz(el,S(C).slice(0,10),([e,r,w])=>({big:e,o:S([r,w]),a:r}));
const listen=el=>quiz(el,S(C).slice(0,10),([e,r,w])=>{let x;do{x=R(C)[1]}while(x==r||x==w);return{big:'👂',o:S([r,w,x]),a:r,say:r}});

function mem(el){const ls=S(ALL).slice(0,6);const cs=S(ls.flatMap(l=>[{l,t:l},{l,t:l.toUpperCase()}]));let open=[],m=0,lock=0;
 el.innerHTML=`<p>Match each little letter with its big letter. <b id=cnt>0</b>/6</p><div class=mg>${cs.map(()=>'<button class=card>?</button>').join('')}</div><button class=ghost id=nw>New game</button>`;
 $('#nw').onclick=()=>mem(el);
 el.querySelectorAll('.card').forEach((b,i)=>b.onclick=()=>{
  if(lock||b.classList.contains('up')||b.classList.contains('ok'))return;
  b.textContent=cs[i].t;b.classList.add('up');open.push(i);say(P[cs[i].l]);
  if(open.length==2){const[p,q]=open;open=[];const B=el.querySelectorAll('.card');
   if(cs[p].l==cs[q].l){B[p].className=B[q].className='card ok';m++;$('#cnt').textContent=m;if(m==6){star();say('You matched them all!')}}
   else{lock=1;setTimeout(()=>{[p,q].forEach(k=>{B[k].className='card';B[k].textContent='?'});lock=0},800)}}})}

function blend(el,X){const go=()=>{const[e,r]=R(X||C);
 el.innerHTML=`<div class=big id=pic>❓</div><div class=tiles>${[...r].map(c=>`<button class=tile>${c}</button>`).join('')}</div><p class=mut>Tap each letter to hear its sound, then blend them together.</p><button class=btn id=bl>▶ Blend</button><button class=ghost id=nx>Next word</button>`;
 const T=el.querySelectorAll('.tile');T.forEach(t=>t.onclick=()=>{t.classList.add('lit');setTimeout(()=>t.classList.remove('lit'),500);say(P[t.textContent])});
 $('#nx').onclick=go;
 $('#bl').onclick=()=>{T.forEach((t,i)=>{setTimeout(()=>{T.forEach(z=>z.classList.remove('lit'));t.classList.add('lit');say(P[t.textContent],.7)},i*800)});
  setTimeout(()=>{T.forEach(z=>z.classList.remove('lit'));say(r);$('#pic').textContent=e;star()},T.length*800+200)}};go()}

function build(el){const go=()=>{const[e,r]=R(C);let pos=0;
 el.innerHTML=`<div class=big>${e}</div><div class=tiles>${[...r].map(()=>'<div class=slot></div>').join('')}</div><div class=tiles>${S([...r]).map(c=>`<button class=tile>${c}</button>`).join('')}</div><p class=mut id=msg>Tap the letters in order to spell the word.</p><button class=ghost id=nx>Next word</button>`;
 const sl=el.querySelectorAll('.slot');$('#nx').onclick=go;
 el.querySelectorAll('.tile').forEach(t=>t.onclick=()=>{
  if(t.textContent==r[pos]){sl[pos].textContent=t.textContent;t.disabled=true;say(P[t.textContent]);pos++;
   if(pos==r.length){star();$('#msg').textContent='🎉 You spelled '+r+'!';setTimeout(()=>say(r),500)}}
  else{t.classList.add('bad');t.style.animation='sh .4s';setTimeout(()=>t.style.animation='',500)}})};go()}

const MT=[[['🍳','pan'],['🧘','sat'],['🏃','run'],['🚰','tap']],[['😢','sad'],['👨','man'],['😴','nap'],['🥫','tin']],[['⛏️','dig'],['🐶','dog'],['👨‍👧','dad'],['🏷️','tag']],[['🧒','kid'],['🐟','cod'],['🐱','cat'],['🧢','cap']],[['🥅','net'],['🖊️','pen'],['🧷','peg'],['🐰','pet']]];
function match(el,X){X=X||MT;let k=0;const go=()=>{const s=X[k%X.length];let sel=null,m=0;
 el.innerHTML=`<p class=mut>Tap a picture, then its word.</p><div class=opts id=pl>${s.map(([e,w],i)=>`<button class=opt data-w=${i}>${e}</button>`).join('')}</div><div class=opts id=wl>${S(s.map((p,i)=>[p[1],i])).map(([w,i])=>`<button class=opt data-w=${i}>${w}</button>`).join('')}</div>`;
 const A1=[...el.querySelectorAll('#pl .opt')],W=[...el.querySelectorAll('#wl .opt')];
 A1.forEach(b=>b.onclick=()=>{if(b.classList.contains('ok'))return;A1.forEach(x=>x.style.outline='');sel=b;b.style.outline='4px solid var(--ac)'});
 W.forEach(b=>b.onclick=()=>{if(!sel||b.classList.contains('ok'))return;
  if(sel.dataset.w==b.dataset.w){sel.classList.add('ok');b.classList.add('ok');sel.style.outline='';say(b.textContent);sel=null;m++;if(m==s.length){star();k++;setTimeout(go,1300)}}
  else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),400)}})};go()}
const MZ=[['🔟','ten','cam'],['🗺️','map','sut'],['🚰','tap','hud'],['👱‍♀️','wig','dem'],['🦇','bat','deg'],['🖊️','pen','gut'],['😴','nap','hud'],['🏷️','tag','hib'],['📌','pin','bud'],['👨','man','sdt'],['🐖','pig','ahd'],['🛖','hut','bes'],['🥅','net','gud'],['👩‍🍼','mum','len'],['☕','cup','reb'],['🎈','pop','biy'],['🍵','mug','jod'],['🧷','peg','tum'],['🐰','pet','cuk'],['🤗','hug','mal'],['🐶','dog','hep'],['🪭','fan','sed'],['🛏️','bed','nip'],['🚌','bus','hod']];
function maze(el){const go=()=>{const[e,w,d]=R(MZ);let i=0;
 el.innerHTML=`<div class=big>${e}</div><div class=tiles>${[0,1,2].map(c=>`<div>${S([w[c],d[c]]).map(l=>`<button class=tile data-c=${c}>${l}</button>`).join('<br>')}</div>`).join('')}</div><p class=mut id=ms>Tap the right letter in each column, left to right.</p><button class=ghost id=nx>Next</button>`;
 $('#nx').onclick=go;
 el.querySelectorAll('.tile').forEach(t=>t.onclick=()=>{if(+t.dataset.c!=i)return;
  if(t.textContent==w[i]){t.classList.add('lit');say(P[w[i]]);i++;if(i==3){star();$('#ms').textContent='🎉 '+w+'!';setTimeout(()=>say(w),500)}}
  else{t.style.animation='sh .4s';setTimeout(()=>t.style.animation='',500)}})};go()}
const RW=[['🧘','sat'],['☀️','sun'],['🍵','mug'],['🖊️','pen'],['🔟','ten'],['🐔','hen']];
function rsws(el){const go=()=>{const[e,w]=R(RW.concat(C.map(([e,r])=>[e,r])));
 el.innerHTML=`<div class=big>${e}</div><div class=word id=wd>${w}</div><p class=mut id=mm>Read it. Say it. Then hide it and type it!</p><button class=ghost id=sy>🔊 Say it</button><button class=ghost id=hd>🙈 Hide it</button><div><input id=ty size=6 autocomplete=off style="font:inherit;font-size:34px;text-align:center;border:3px solid var(--ln);border-radius:14px;background:var(--card);color:var(--tx);padding:6px"><button class=btn id=ck>Check</button></div><button class=ghost id=nx>Next word</button>`;
 $('#sy').onclick=()=>say(w);$('#hd').onclick=()=>{$('#wd').textContent='• • •'};$('#nx').onclick=go;
 $('#ck').onclick=()=>{if($('#ty').value.trim().toLowerCase()==w){$('#wd').textContent=w;$('#mm').textContent='🎉 Perfect!';star();say(w)}else{$('#mm').textContent='Not quite. Have a peek and try again!';$('#wd').textContent=w}}};go()}
function wsearch(el){const g='sitojrzksupetzgiujamyebox',ws=['pet','jam','box','sit','jug'],fd=[];let sel=[];
 const draw=()=>{el.innerHTML=`<div class=mg style="grid-template-columns:repeat(5,1fr);max-width:340px;margin:12px auto">${[...g].map((c,i)=>`<button class="card ${fd.includes(i)?'ok':sel.includes(i)?'up':''}" data-i=${i}>${c}</button>`).join('')}</div><p>Find: ${ws.map(w=>`<b>${w}</b>`).join(' · ')}</p><p class=mut>Tap the letters of a word in order.</p><button class=ghost id=cl>Clear</button>`;
  if(fd.length==15)el.insertAdjacentHTML('beforeend','<h2>🎉 All found!</h2>');
  el.querySelectorAll('.card').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(fd.includes(i))return;sel.includes(i)?sel=sel.filter(x=>x!=i):sel.push(i);const t=sel.map(k=>g[k]).join('');
   if(ws.includes(t)){fd.push(...sel);sel=[];say(t);if(fd.length==15)star()}draw()});
  $('#cl').onclick=()=>{sel=[];draw()}};draw()}
function rdraw(el,X){const WS=X||['mum','hot','big','bed','mug','cat','bug','leg','mud','bus','rug','hug'];let col='#e8590c';const go=()=>{const w=R(WS);
 el.innerHTML=`<div class=word style="font-size:${w.length>6?28:44}px">${w}</div><p class=mut>Read it, then draw a picture of it.</p><canvas id=cv width=600 height=600></canvas><div class=chips>${['#e8590c','#0a8fd0','#2f9e63','#d9363e','#8e44ad','#7a7a8a'].map(c=>`<button class=chip style="background:${c};min-width:36px;height:36px" data-c=${c}></button>`).join('')}</div><button class=ghost id=cl>🧽 Clear</button><button class=btn id=dn>✅ Done</button>`;
 const c=$('#cv'),x=c.getContext('2d');let d=0;x.lineCap=x.lineJoin='round';x.lineWidth=14;
 const pt=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*600/r.width,(e.clientY-r.top)*600/r.height]};
 c.onpointerdown=e=>{d=1;c.setPointerCapture(e.pointerId);const[a,b]=pt(e);x.strokeStyle=col;x.beginPath();x.moveTo(a,b);x.lineTo(a+.1,b);x.stroke()};
 c.onpointermove=e=>{if(!d)return;const[a,b]=pt(e);x.lineTo(a,b);x.stroke()};c.onpointerup=()=>d=0;
 el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>col=b.dataset.c);
 $('#cl').onclick=()=>x.clearRect(0,0,600,600);$('#dn').onclick=()=>{star();say('Lovely drawing!');go()}};go()}
const HF='the that not look put and with then don’t could a all were come house to we go will old said can little into too in are as back by he up no from day I had mum children made of my one him time it her them was what do get if you there me just help they out down now on this dad came called she have big oh here is went when about off for be it’s got asked at like see their saw his some looked people make but so very your an'.split(' ');
const hflisten=(el,X=HF)=>quiz(el,S(X).slice(0,10),w=>{const o=new Set([w]);while(o.size<3)o.add(R(X));return{big:'👂',o:S([...o]),a:w,say:w}});
function hfflash(el,X=HF){let d=S(X),i=0,k=0;const go=()=>{el.innerHTML=`<p class=mut>Card ${i+1} of ${d.length} · ⭐ ${k} known</p><div class=big style="font-size:70px">${d[i]}</div><button class=ghost id=sy>🔊 Say it</button><div><button class=ghost id=pv>◀ Back</button><button class=btn id=kn>I know it ✓</button><button class=ghost id=nx>Next ▶</button></div>`;
 const mv=n=>{i=(i+n+d.length)%d.length;go()};$('#sy').onclick=()=>say(d[i]);$('#pv').onclick=()=>mv(-1);$('#nx').onclick=()=>mv(1);$('#kn').onclick=()=>{k++;star();mv(1)};say(d[i])};go()}
function hfbuild(el,X=HF){const go=()=>{const w=R(X.filter(x=>x.length>2&&x.length<(X===HF?8:10)));let p=0;
 el.innerHTML=`<div class=tiles style="flex-wrap:wrap">${[...w].map(()=>'<div class=slot style="width:48px;height:60px;font-size:30px"></div>').join('')}</div><div class=tiles style="flex-wrap:wrap">${S([...w]).map(c=>`<button class=tile style="width:56px;height:64px;font-size:34px">${c}</button>`).join('')}</div><button class=ghost id=sy>🔊 Hear word</button><p class=mut id=msg>Tap the letters in order to spell the word.</p><button class=ghost id=nx>Next word</button>`;
 const sl=el.querySelectorAll('.slot');say(w);$('#sy').onclick=()=>say(w);$('#nx').onclick=go;
 el.querySelectorAll('.tile').forEach(t=>t.onclick=()=>{if(t.disabled)return;if(t.textContent==w[p]){sl[p].textContent=t.textContent;t.disabled=true;p++;if(p==w.length){star();$('#msg').textContent='🎉 '+w;say(w)}}else{t.style.animation='sh .4s';setTimeout(()=>t.style.animation='',500)}})};go()}
function hftrace(el,X=HF){let w=R(X);const go=()=>{el.innerHTML=`<p class=mut>Trace the word, then press Done.</p><canvas id=cv width=600 height=300 style="aspect-ratio:2/1;width:min(100%,560px)"></canvas><p class=mut id=tm></p><button class=ghost id=cl>🧽 Clear</button><button class=ghost id=hr>🔊 Say it</button><button class=btn id=dn>✅ Done</button>`;
 const c=$('#cv'),x=c.getContext('2d'),ink=document.createElement('canvas');ink.width=600;ink.height=300;const ix=ink.getContext('2d');
 const font=`bold ${Math.min(170,560/(w.length*.6))}px "Comic Neue","Comic Sans MS",sans-serif`;
 const base=()=>{x.clearRect(0,0,600,300);x.lineWidth=3;x.strokeStyle='#8886';x.beginPath();x.moveTo(0,200);x.lineTo(600,200);x.stroke();x.fillStyle='rgba(128,128,128,.3)';x.textAlign='center';x.font=font;x.fillText(w,300,200);x.drawImage(ink,0,0)};
 base();if(document.fonts)document.fonts.ready.then(base);
 let d=0;const pt=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*600/r.width,(e.clientY-r.top)*300/r.height]};
 c.onpointerdown=e=>{d=1;c.setPointerCapture(e.pointerId);const[a,b]=pt(e);[x,ix].forEach(k=>{k.strokeStyle='#e8590c';k.lineWidth=20;k.lineCap=k.lineJoin='round';k.setLineDash([]);k.beginPath();k.moveTo(a,b);k.lineTo(a+.1,b);k.stroke()})};
 c.onpointermove=e=>{if(!d)return;const[a,b]=pt(e);[x,ix].forEach(k=>{k.lineTo(a,b);k.stroke()})};c.onpointerup=c.onpointercancel=()=>d=0;
 $('#cl').onclick=()=>{ix.clearRect(0,0,600,300);base();$('#tm').textContent=''};$('#hr').onclick=()=>say(w);
 const g=f=>{const m=document.createElement('canvas');m.width=600;m.height=300;const k=m.getContext('2d');k.font=font;k.textAlign='center';k.fillStyle=k.strokeStyle='#000';k.lineJoin='round';f(k);return k.getImageData(0,0,600,300).data};
 $('#dn').onclick=()=>{const L=g(k=>k.fillText(w,300,200)),W=g(k=>{k.lineWidth=70;k.strokeText(w,300,200);k.fillText(w,300,200)}),N=ix.getImageData(0,0,600,300).data;let lp=0,cv=0,ip=0,out=0;
  for(let yy=0;yy<300;yy+=3)for(let xx=0;xx<600;xx+=3){const i=(yy*600+xx)*4+3;if(L[i]>128){lp++;if(N[i]>0)cv++}if(N[i]>0){ip++;if(W[i]<30)out++}}
  const tm=$('#tm');if(ip<30){tm.textContent='Trace the word first, then press Done!';return}
  if(cv/lp>.4&&out/ip<.5){star();tm.textContent='🌟 Great tracing! Next word…';say(w);setTimeout(()=>{w=R(X);go()},1300)}
  else{tm.textContent='Nearly! Follow the grey word, then press Done again.';say('Try again')}}};go()}
MZ.push(['🚰','tap','sin'],['🛏️','cot','fas'],['🍰','bun','dor'],['⛏️','dig','fan'],['🧷','peg','kak'],['🥅','net','god']);
C.push(['🐕','dog','dig'],['🚌','bus','bud'],['📦','box','bag'],['🪑','sit','sat'],['🕳️','pit','pat']);
const IR=[['🚰','tap'],['👜','bag'],['🥫','tin'],['👨','man'],['🛏️','cot'],['🥅','net'],['🏷️','tag'],['🐕','dog'],['☀️','sun'],['🧹','mop'],['🍳','pan'],['🗺️','map'],['🧢','cap'],['🐖','pig'],['🧷','peg'],['🟧','mat']];
function ispyread(el){const go=()=>{const t=R(IR);
 el.innerHTML=`<p class=mut>Read the word, then tap its picture.</p><div class=word>${t[1]}</div><button class=ghost id=sy>🔊 Hear it</button><div class=grid>${S(IR).map(([e,w])=>`<button class=bub data-w=${w}>${e}</button>`).join('')}</div>`;
 $('#sy').onclick=()=>say(t[1]);
 el.querySelectorAll('.bub').forEach(b=>b.onclick=()=>{if(b.dataset.w==t[1]){b.classList.add('ok');star();say(t[1]);setTimeout(go,900)}else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),400)}})};go()}
const IS2=[['sun','☀️'],['apple','🍎'],['tomato','🍅'],['pig','🐖'],['igloo','🧊'],['nose','👃'],['mouse','🐭'],['dog','🐕'],['goat','🐐'],['orange','🍊'],['cat','🐱'],['key','🔑'],['hen','🐔'],['elephant','🐘'],['umbrella','☂️']];
const initial=el=>quiz(el,S(IS2).slice(0,10),([w,e])=>({big:e,o:S([w[0],...S(ALL.filter(x=>x!=w[0])).slice(0,2)]),a:w[0],say:w}));
const FM=[['sun','s','☀️'],['cat','c','🐱'],['dog','d','🐕'],['egg','e','🥚'],['pig','p','🐖'],['log','l','🪵'],['rat','r','🐀'],['duck','d','🦆']];
const farm=el=>quiz(el,S(FM),([w,a,e])=>({big:`${e}<div class=word>${w.replace(a,'_')}</div>`,o:S([a,...S(ALL.filter(x=>x!=a)).slice(0,2)]),a,say:w}));
const CP=[['🗺️📌','a pin on a map'],['🧔','a sad man'],['🎩🐱','a cat in a hat'],['🐶','pat a dog'],['😴🍼','a nap in a cot'],['🍳','pots and pans'],['🚌','get off the bus'],['🐱🛏️','a cat on a bed'],['👜🖊️','pack a pen in a bag'],['🐱🐀','a cat and a big fat rat'],['🪆','a doll in a cot']];
const caption=el=>{const g=S(CP);match(el,[g.slice(0,4),g.slice(4,8),g.slice(8)])};
const sdraw=el=>rdraw(el,['Mum can dig the mud.','The ham is in the pan.','The man at the top had a hat on.','A rat sat on the sack.']);
const RV=[['🪑','sit'],['🍳','pan'],['📌','pin'],['🥫','tin'],['🚰','tap'],['🕳️','pit'],['😴','nap'],['🐕','pat']];
const reveal=el=>blend(el,RV);
const DW=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const EW='the a do to today of said says are were was is his has I you your they be he me she we no go so by my here there where love come some one once ask friend school put push pull full house our'.split(' ');
const LW='can cub cot ant at as dot dim dad go get gag quack quick egg elm eel sit sat sud fit fab fed on off odd lid lab lot if is ill tab tell tot up us urn jam jet job yum yet yard rub rip red bat bell bib nod nut neck hem hat hill man met mum kick kid keg pit peg pop van vet verb wag wet will fox box zip zap zigzag'.split(' ');
const FAM=[['Curly Caterpillar','🐛','cadgqesfo'],['Ladder','🪜','litujy'],['One-armed Robot','🤖','rbnhmkp'],['Zigzag Monster','👾','vwxz']];
const family=el=>quiz(el,S([...'cadgqesfolitujyrbnhmkpvwxz']).slice(0,12),l=>{const f=FAM.find(f=>f[2].includes(l));return{big:l,o:FAM.map(f=>f[1]+' '+f[0]),a:f[1]+' '+f[0],say:P[l]}});
function dayorder(el){let p=0;el.innerHTML=`<p class=mut>Tap the days in order, starting with Monday.</p><div class=opts>${S(DW).map(d=>`<button class=opt style="font-size:24px">${d}</button>`).join('')}</div><p id=ms class=mut></p><button class=ghost id=nx>Shuffle</button>`;$('#nx').onclick=()=>dayorder(el);
 el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(b.classList.contains('ok'))return;if(b.textContent==DW[p]){b.classList.add('ok');say(DW[p]);p++;if(p==7){star();$('#ms').textContent='🎉 You know the whole week!'}}else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),400)}})}
const daynext=el=>quiz(el,S(DW),d=>{const n=DW[(DW.indexOf(d)+1)%7],o=new Set([n]);while(o.size<3)o.add(R(DW));return{big:`<span style="font-size:34px">What comes after <b>${d}</b>?</span>`,o:S([...o]),a:n,say:d}});
const ewlisten=el=>hflisten(el,EW),ewflash=el=>hfflash(el,EW),ewbuild=el=>hfbuild(el,EW),ewtrace=el=>hftrace(el,EW),dwtrace=el=>hftrace(el,DW),dwbuild=el=>hfbuild(el,DW),lwtrace=el=>hftrace(el,LW),lwbuild=el=>hfbuild(el,LW);
