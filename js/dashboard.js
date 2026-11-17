// Dashboard and the simple pages. To add a widget: write a function that returns HTML and place it inside dash().
(()=>{const {esc}=PT,go=(id,t,c='go')=>`<button class="${c}" data-go="${id}">${t}</button>`;
const grName=x=>(grOf(x)||[,,'Calendar'])[2];
function mini(){const n=new Date(),y=n.getFullYear(),m=n.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,len=new Date(y,m+1,0).getDate(),D=PT.days();
 let c=['M','T','W','T','F','S','S'].map(d=>`<b>${d}</b>`).join('')+'<span></span>'.repeat(first);
 for(let d=1;d<=len;d++){const k=PT.ymd(new Date(y,m,d)),cl=(D[k]?'p ':'')+(d==n.getDate()?'t':'');c+=`<span class="${cl}">${d}</span>`}
 return`<div class=panel><div class=ph><h2>${n.toLocaleString('en',{month:'long',year:'numeric'})}</h2></div><div class=mc>${c}</div><p class=mut style="font-size:14px;margin-top:10px">Yellow days are days you practised.</p></div>`}
function dash(el){
 const s=PT.stats(),gs=GR.map(g=>({g,p:PT.groupProg(g)})),nx=PT.allIds().filter(x=>!PT.seen(x)),rv=s.review,
 open=gs.filter(x=>x.p.tried<x.p.total).sort((a,b)=>(PT.seen(b.p.last)||0)-(PT.seen(a.p.last)||0)),
 shown=(PT.tab=='done'?gs.filter(x=>x.p.total&&x.p.tried==x.p.total):open).slice(0,3);
 const cards=shown.map(({g,p})=>`<div class=cc><div class=cr><span class=tag>${esc(g[2])}</span><span class=ic>${g[1]}</span></div><div class=t>${p.last?'Last: '+esc(A[p.last][0]):'Not started yet'}</div><div class=cr><span class=mut>Progress</span><b>${p.tried}/${p.total}</b></div><div class=pb><i style="width:${p.total?p.tried/p.total*100:0}%"></i></div>${go(p.last||'g-'+g[0],p.last?'Continue':'Start')}</div>`).join('')||`<p class=mut>${PT.tab=='done'?'Topics you finish will appear here.':'Nice work: every topic has been tried.'}</p>`;
 const f=rv.length?{ic:'🔁',t:'Review your tricky items',d:'These need another try: '+rv.slice(0,5).map(esc).join(' · ')+'.',id:PT.last()||nx[0]||'learn',b:'Practise'}
  :nx.length?{ic:A[nx[0]][2],t:'Try '+A[nx[0]][0],d:A[nx[0]][3],id:nx[0],b:'Start'}
  :{ic:'🎉',t:'You have tried every activity',d:'Pick any activity to repeat it. Repetition helps.',id:'learn',b:'Choose'};
 const skip=f.id==nx[0]?1:0,sug=nx.slice(skip,skip+3).map(x=>`<div class=cc><span class=tag>${esc(grName(x))}</span><div class=t>${esc(A[x][0])}</div><div class=cr><span class=mut>${A[x][2]}</span>${go(x,'Explore','go sm')}</div></div>`).join('')||'<p class=mut>Nothing new to suggest.</p>';
 const rec=Object.entries(PT.days()).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,3).map(([d,n])=>`<div class=li><span>${new Date(d+'T00:00').toLocaleDateString('en',{weekday:'short',day:'numeric',month:'short'})}</span><span class=sp></span><span class=sc>${n} ⭐</span></div>`).join('')||'<p class=mut>Your practice days will appear here.</p>';
 const rvl=rv.map(w=>`<div class=li><span>${esc(w)}</span></div>`).join('')||'<p class=mut>Nothing to review yet.</p>';
 el.innerHTML=`<div class=dg><div class=dl><div class=panel><div class=ph><h2>My learning</h2><button class="pill ${PT.tab!='done'?'on':''}" data-tab=prog>In progress</button><button class="pill ${PT.tab=='done'?'on':''}" data-tab=done>Completed</button><span class=sp></span><a href="#learn">View all</a></div><div class=ml><div class=cards>${cards}</div><div class=promo><span>Help keep this learning space free for everyone who needs it.</span>${go('support','Support us')}</div></div></div>
 <div class=panel><div class=fc><div class=fi>${f.ic}</div><div class=fb><span class=tag>Today's focus</span><h2>${f.t}</h2><p>${f.d}</p>${go(f.id,f.b)}</div></div></div>
 <div class=rowb><div class=panel><div class=ph><h2>Items to review</h2></div>${rvl}</div><div class=panel><div class=ph><h2>Recent practice</h2></div>${rec}</div></div></div>
 <div class=dr>${mini()}<div class=panel><div class=ph><h2>Suggested next</h2></div><div class=sg>${sug}</div></div></div></div>`;
 el.onclick=e=>{const t=e.target.closest('[data-tab]');if(t){PT.tab=t.dataset.tab;return dash(el)}const g=e.target.closest('[data-go]');if(g)location.hash=g.dataset.go}}
function learn(el){el.innerHTML=PT.head('My learning','Choose a topic. Every topic starts at the beginning, and you can return to any activity.')+`<div class=hm>${GR.map(g=>{const p=PT.groupProg(g);return`<a href="#g-${g[0]}"><span>${g[1]}</span>${esc(g[2])}<small>${p.tried} of ${p.total} tried</small></a>`}).join('')}</div>`}
function progress(el){const s=PT.stats();
 el.innerHTML=PT.head('My progress','Based on what you can do, not on how fast you go.')+`<div class=rowb style="grid-template-columns:repeat(3,1fr)"><div class=panel><span class=mut>Stars today</span><h2 style="font-size:34px">⭐ ${s.today}</h2></div><div class=panel><span class=mut>Days practised this week</span><h2 style="font-size:34px">${s.week} of 7</h2></div><div class=panel><span class=mut>Items you know</span><h2 style="font-size:34px">${s.known}</h2></div></div>
 <div class=panel style="margin-top:18px"><div class=ph><h2>Topics</h2></div>${GR.map(g=>{const p=PT.groupProg(g);return`<div style="margin:12px 0"><div class=cr><span>${g[1]} ${esc(g[2])}</span><b>${p.tried}/${p.total} tried</b></div><div class=pb><i style="width:${p.total?p.tried/p.total*100:0}%"></i></div></div>`}).join('')}</div>
 <div class=panel style="margin-top:18px"><div class=ph><h2>Items to review</h2></div><p>${s.review.length?s.review.map(esc).join(' · '):'Nothing to review yet. Keep practising!'}</p></div>
 <button class=ghost id=rs style="margin-top:18px">Reset progress</button>`;
 $('#rs').onclick=()=>{if(confirm('Erase all progress on this device?')){PT.reset();progress(el)}}}
function support(el){el.innerHTML=PT.head('Support this project','Help keep it free for learners who need it.')+`<div class=panel><p>This is a learning aid for people relearning to read and spell, and for children. Donations help cover hosting, recorded voices and new activities.</p>${CONFIG.DONATE_URL?`<a class=go style="text-decoration:none;display:inline-block;margin-top:14px" href="${esc(CONFIG.DONATE_URL)}" target=_blank rel=noopener>Donate</a>`:'<p class=mut>Donations are not set up yet.</p>'}</div><div class=panel style="margin-top:18px"><h3 style="margin-top:0">Good to know</h3><p>Progress and settings stay on this device. This is a learning aid, not a medical treatment.</p></div>`}
A.home=['Dashboard',dash,'🏡','','page'];A.learn=['My learning',learn,'📚','','page'];A.progress=['My progress',progress,'📊','','page'];A.support=['Support',support,'♥','','page'];
})();
