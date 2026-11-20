// Skills: (1) activities grouped into skill families, (2) a Today list that rotates activities,
// (3) spaced repetition (skills come back after 1, 2, 4, 7, 14 days), (4) a warm-up first and a stretch last.
// Load AFTER plan.js and before pics.js. To move an activity group to another skill, edit the SK list below.
(()=>{
const E=s=>PT.esc(s),K='pp-sk',KD='pp-sk-day',INT=[1,1,2,4,7,14],CH=15,WARM=5,IDLE=180e3;
const DEF={english:120,maths:60,science:60,history:60,social:60};
const SUBJ=[['english','📖','Literacy (English)'],['maths','🔢','Maths'],['science','🔬','Science'],['history','🏛️','History'],['social','🌍','Social Studies']];
// [id, icon, name, subject, [activity group names]]. Order = the order new skills are introduced.
const SK=[['sounds','🔤','Letter sounds','english',['Letter Sounds','Letter Families']],
['cvc','🐱','Reading short words','english',['CVC Words','CVC Booklet','Phase 2 Practice','Word Wheels']],
['tricky','⭐','Tricky words','english',['High Frequency Words','Exception Words']],
['caps','🖼️','Words and sentences','english',['Phase 2 Booklet']],
['days','📅','Days of the week','english',['Days of the Week']],
['read1','📘','Reading: Level 1','english',['Reading KS1']],
['fast','⏱️','60 second reads','english',['60 Second Reads']],
['digraph','🌈','Vowel digraphs','english',['Phase 5 Vowel Digraphs']],
['read2','📗','Reading: Level 2','english',['Reading LKS2']],
['read3','📙','Reading: Level 3','english',['Reading UKS2']],
['count','🔢','Counting and number lines','maths',['Count to 10','Number Lines','Number Names','Counting in Steps']],
['add','➕','Adding and taking away','maths',['Adding to 20','Number Bonds','Take Away','Plus or Minus']],
['place','🧱','Place value and bigger numbers','maths',['Place Value','10 More, 10 Less','Number Sense','Putting in Order','Bigger Numbers']],
['money','🪙','Money','maths',['Coins','Fruit Shop','Money Stories']],
['time','🕐','Telling the time','maths',['Telling the Time']],
['shapes','🔷','Shapes and patterns','maths',['Shapes and Patterns']],
['times','✖️','Times tables, doubles and sharing','maths',['Times Tables','Doubles, Halves and Sharing']],
['fractions','🍕','Fractions','maths',['Fractions']],
['mprob','🧩','Maths problems','maths',['Maths Problems']],
['sci-r','🔬','Science reading','science',['Science Reading']],['sci-q','❓','Science quiz','science',['Science Quiz']],
['his-r','🏛️','History reading','history',['History Reading']],['his-q','❓','History quiz','history',['History Quiz']],
['soc-r','🌍','Social Studies reading','social',['Social Studies Reading']],['soc-q','❓','Social Studies quiz','social',['Social Studies Quiz']]
].map(([id,ic,nm,s,g])=>({id,ic,nm,s,g}));
const rd=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}},wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let ST=rd(K,{});
const sk=id=>ST[id]||(ST[id]={box:0,n:0,due:'',last:'',seen:{},up:''});
const today=()=>PT.ymd(),plus=d=>PT.ymd(Date.now()+d*864e5);
const ids=k=>[...new Set(k.g.flatMap(gn=>{const g=G.find(x=>x[0]==gn);return g?g[2]:[]}).filter(i=>A[i]))];
const sub=s=>SK.filter(k=>k.s==s&&ids(k).length);
let AM=null;const skillOf=id=>{if(!AM){AM={};SK.forEach(k=>ids(k).forEach(i=>{if(!AM[i])AM[i]=k}))}return AM[id]};
const diff=d=>Math.round((new Date(d+'T00:00')-new Date(today()+'T00:00'))/864e5);
const strength=k=>{const s=sk(k.id);return s.n?'●'.repeat(s.box)+'○'.repeat(5-s.box):'Not started yet'};
const status=k=>{const s=sk(k.id);if(!s.n)return'New';const d=diff(s.due);return d<=0?'Time to review':d==1?'Review tomorrow':'Review in '+d+' days'};
// ---------- tracking ----------
let cur=null,la=Date.now();
['pointerdown','keydown','touchstart','wheel','input'].forEach(e=>addEventListener(e,()=>{la=Date.now()},{passive:true}));
const speaking=()=>{try{return speechSynthesis.speaking}catch(e){return false}};
function record(k,act,secs,stars){const s=sk(k.id),t=today(),q=stars>=6?2:stars>=3?1:secs>=120?1:0;
 s.n++;s.last=t;s.seen[act]=(s.seen[act]||0)+1;s.q=q;
 if(s.up!=t){if(q==2)s.box=Math.min(5,s.box+1);else if(q==1)s.box=Math.max(1,s.box);else s.box=Math.max(0,s.box-1);s.up=t}
 s.due=plus(INT[s.box]);wr(K,ST)}
function flush(){if(!cur)return;if(cur.secs>=60||cur.stars>=3)record(cur.k,cur.id,cur.secs,cur.stars);cur.secs=0;cur.stars=0}
const begin=()=>{const id=location.hash.slice(1),k=skillOf(id);cur=k?{id,k,secs:0,stars:0}:null};
addEventListener('hashchange',()=>{flush();begin()});addEventListener('pagehide',flush);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState!='visible')flush()});
setInterval(()=>{if(cur&&document.visibilityState=='visible'&&(Date.now()-la<IDLE||speaking())){cur.secs++;if(cur.secs>=300)flush()}},1000);
const os=window.ptStar;window.ptStar=function(){if(os)os.apply(this,arguments);if(cur)cur.stars++};
begin();
// ---------- today's list ----------
const gm=s=>window.PTPLAN?window.PTPLAN.goal(s):DEF[s];
const sig=()=>SUBJ.map(x=>gm(x[0])).join(',')+'/'+SK.map(k=>ids(k).length).join('');
function gen(){const t=today(),used={},newT={},usedAct=new Set(),items=[];const MAXNEW={english:3};
 const pickAct=k=>{const l=ids(k),f=l.filter(i=>!usedAct.has(i)),L=f.length?f:l,s=sk(k.id).seen,m=Math.min(...L.map(i=>s[i]||0));return R(L.filter(i=>(s[i]||0)==m))};
 const pickSkill=(s,j,last)=>{const all=sub(s);if(!all.length)return null;
  for(const cap of[1,2,99]){const ok=k=>(used[k.id]||0)<cap&&k.id!=last,
   rev=all.filter(k=>sk(k.id).n&&sk(k.id).due<=t&&ok(k)).sort((a,b)=>sk(a.id).due<sk(b.id).due?-1:1),
   prog=all.filter(k=>sk(k.id).n&&sk(k.id).box<=1&&ok(k)&&!rev.includes(k)),nw=(newT[s]||0)<(MAXNEW[s]||2)?all.filter(k=>!sk(k.id).n&&ok(k)):[],
   order=j%3==2?[[rev,'review'],[prog,'keep'],[nw,'new']]:[[prog,'keep'],[nw,'new'],[rev,'review']];
   for(const[l,kd]of order)if(l.length)return[l[0],kd]}
  const pool=all.filter(k=>k.id!=last),L=pool.length?pool:all,td=L.filter(k=>used[k.id]).sort((a,b)=>used[a.id]-used[b.id]);if(td.length)return[td[0],'keep'];return[L.sort((a,b)=>(sk(a.id).last||'')<(sk(b.id).last||'')?-1:1)[0],'review']};
 // chunks of time per subject (the English list starts with a short warm-up)
 const ch={};SUBJ.forEach(([s])=>{let m=gm(s);const a=[];if(!m||!sub(s).length)return;if(s=='english'&&m>=WARM){a.push({mins:WARM,warm:1});m-=WARM}while(m>0){const c=Math.min(CH,m);a.push({mins:c});m-=c}ch[s]=a});
 const seq=[];const pos={};SUBJ.forEach(([s])=>pos[s]=0);while(SUBJ.some(([s])=>ch[s]&&pos[s]<ch[s].length))SUBJ.forEach(([s])=>{if(!ch[s])return;for(let n=0;n<2&&pos[s]<ch[s].length;n++)seq.push({s,c:ch[s][pos[s]++]})});
 const cum={},last={},jn={};
 seq.forEach((q,i)=>{const{s,c}=q;cum[s]=(cum[s]||0)+c.mins;let k,kind;
  if(c.warm){const e=sub('english');k=e.filter(x=>sk(x.id).n&&sk(x.id).box>=2).sort((a,b)=>sk(b.id).box-sk(a.id).box)[0]||e.filter(x=>sk(x.id).n)[0]||e[0];kind=sk(k.id).n?'warm':'new';if(kind=='new')newT[s]=(newT[s]||0)+1}
  else if(i==seq.length-1&&seq.length>2){const st=sub(s);k=st.filter(x=>sk(x.id).n).sort((a,b)=>sk(a.id).box-sk(b.id).box)[0];if(!k||sk(k.id).box>=3)k=(newT[s]<(MAXNEW[s]||2)&&st.find(x=>!sk(x.id).n))||(last[s]&&kOf(last[s]))||k||st[0];kind='stretch'}
  else{const j=jn[s]=(jn[s]||0);jn[s]++;const r=pickSkill(s,j,last[s]);if(!r)return;[k,kind]=r;if(kind=='new')newT[s]=(newT[s]||0)+1}
  const act=pickAct(k);usedAct.add(act);if(kind!='warm')used[k.id]=(used[k.id]||0)+1;last[s]=k.id;
  items.push({s,mins:c.mins,need:cum[s]*60,kind,skill:k.id,act})});
 return{d:t,sig:sig(),items}}
const getDay=force=>{let D=rd(KD,null);if(force||!D||D.d!=today()||D.sig!=sig()||D.items.some(i=>!A[i.act])){D=gen();wr(KD,D)}return D};
const KI={warm:'🔥',new:'✨',keep:'➡️',review:'🔁',stretch:'🚀'},KL={warm:'Warm-up: something you know',new:'New',keep:'Keep going',review:'Review',stretch:'Stretch: a little harder'};
const kOf=id=>SK.find(k=>k.id==id);
function patch(el){const D=getDay(),tm=window.PTPLAN?window.PTPLAN.day():{},nx=D.items.find(i=>(tm[i.s]||0)<i.need);
 const lp=[...el.querySelectorAll('.panel')].find(p=>/Today.s list/.test(p.textContent.slice(0,40)));if(!lp)return;
 lp.innerHTML=`<div class=ph id=skl><h2>Today’s list</h2></div>`+D.items.map(i=>{const k=kOf(i.skill),ok=(tm[i.s]||0)>=i.need;return`<div class=li><span style="font-size:22px">${ok?'✅':'⬜'}</span><span style="flex:1"><b>${KI[i.kind]} ${E(k.nm)}</b><small style="display:block;opacity:.75">${E(A[i.act][0])} · ${KL[i.kind]}</small></span><span class=mut>${i.mins} min</span><button class=ghost data-go="${i.act}" style="margin-left:8px">▶</button></div>`}).join('')+
  `<p style="margin-top:12px"><a href="#skills">🧩 Browse by skill</a> &nbsp; <button class=ghost id=skn>🔄 New list</button></p>`;
 $('#skn').onclick=()=>{getDay(1);patch(el)};
 const b=el.querySelector('button.go');if(b&&nx){const k=kOf(nx.skill);b.dataset.go=nx.act;const p=b.previousElementSibling;if(p&&p.tagName=='P')p.innerHTML=`Next: <b>${KI[nx.kind]} ${E(k.nm)}</b> (${nx.mins} min)<small style="display:block;opacity:.75;font-size:15px">${E(A[nx.act][0])} · ${KL[nx.kind]}</small>`}}
if(A.home){const hp=A.home[1];A.home[1]=el=>{hp(el);patch(el);new MutationObserver(()=>{if(!el.querySelector('#skl'))patch(el)}).observe(el,{childList:true})}}
// ---------- skill pages ----------
const go=el=>{el.onclick=e=>{const g=e.target.closest('[data-go]');if(g)location.hash=g.dataset.go}};
function best(k){const l=ids(k),s=sk(k.id).seen,m=Math.min(...l.map(i=>s[i]||0));return R(l.filter(i=>(s[i]||0)==m))}
function skillsPage(el){el.innerHTML=`<p class=mut style="font-size:15px"><a href="#home">Today’s plan</a> › Skills</p><h1 class=pt>🧩 Skills</h1><p class=mut>Each skill has several activities. ●●●○○ shows how well you know it. The ones that say “Time to review” will appear in your list.</p>`+
 SUBJ.map(([s,ic,nm])=>{const l=sub(s);return l.length?`<h2 style="margin-top:18px">${ic} ${E(nm)}</h2><div class=hm>${l.map(k=>`<a href="#sk-${k.id}"><span>${k.ic}</span>${E(k.nm)}<small style="display:block;margin-top:4px">${strength(k)}</small><small style="display:block">${status(k)} · ${ids(k).length} activities</small></a>`).join('')}</div>`:''}).join('')}
SK.forEach(k=>{A['sk-'+k.id]=[k.nm,el=>{const l=ids(k),s=sk(k.id);
 el.innerHTML=`<p class=mut style="font-size:15px"><a href="#home">Today’s plan</a> › <a href="#skills">Skills</a> › ${E(k.nm)}</p><h1 class=pt>${k.ic} ${E(k.nm)}</h1><p style="font-size:22px;margin:6px 0">${strength(k)}</p><p class=mut>${status(k)}${s.n?' · practised '+s.n+' times':''}</p>
 <p><button class=go data-go="${best(k)}" style="font-size:22px;padding:14px 28px">▶ Practise now</button></p>
 <div class=panel><div class=ph><h2>All activities</h2></div>${l.map(i=>`<div class=li><span style="flex:1">${E(A[i][0])}</span><span class=mut>${s.seen[i]?'✓ '+s.seen[i]+'×':'new'}</span><button class=ghost data-go="${i}" style="margin-left:8px">▶</button></div>`).join('')}</div>`;go(el)},k.ic,'','page']});
A.skills=['Skills',el=>{skillsPage(el);go(el)},'🧩','','page'];
window.PTSK={SK,ST:()=>ST,gen,getDay,record};
})();