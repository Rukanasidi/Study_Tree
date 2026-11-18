// "Today" plan: 6 hours a day across five subjects. Time is counted automatically while she is actively using an activity.
// Change the default goals in SUBJ (minutes). She can also change them on the Today page. Load AFTER subjects.js and dashboard.js.
(()=>{
const K='pp-plan',IDLE=180,BLOCK=1800;
const SUBJ=[['english','📖','Literacy (English)',120],['maths','🔢','Maths',60],['science','🔬','Science',60],['history','🏛️','History',60],['social','🌍','Social Studies',60]];
const KEYMAP={letters:'english',cvc:'english',tricky:'english',days:'english',reading:'english',maths:'maths',science:'science',history:'history',social:'social'};
const HOME={english:'subj-english',maths:'g-maths',science:'g-science',history:'g-history',social:'g-social'};
let D={goals:{},days:{},fin:{}};try{D=Object.assign(D,JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(D))}catch(e){}};
const info=s=>SUBJ.find(x=>x[0]==s);
const goal=s=>(D.goals[s]==null?info(s)[3]:D.goals[s])*60;
const day=(k=PT.ymd())=>D.days[k]||(D.days[k]={});
const fmt=sec=>{const m=Math.floor(sec/60),h=Math.floor(m/60);return h?(m%60?`${h} h ${m%60} min`:`${h} h`):`${m} min`};
const done=(d=day())=>SUBJ.reduce((a,x)=>a+Math.min(d[x[0]]||0,goal(x[0])),0),target=()=>SUBJ.reduce((a,x)=>a+goal(x[0]),0);
const subjOf=id=>{if(!id||/^(home|learn|progress|settings|support|cal|dash)$/.test(id)||/^(g|subj)-/.test(id))return null;if(/^cd\d+$/.test(id))return'english';const g=grOf(id);return g&&KEYMAP[g[0]]||null};
// the day's list of 30-minute blocks, mixing the subjects
function blocks(){const left={},out=[];SUBJ.forEach(x=>left[x[0]]=Math.ceil(goal(x[0])/BLOCK));const n={};
 while(SUBJ.some(x=>left[x[0]]>0))SUBJ.forEach(x=>{const s=x[0];if(left[s]>0){left[s]--;n[s]=(n[s]||0)+1;out.push({s,need:Math.min(goal(s),n[s]*BLOCK),mins:Math.min(BLOCK,goal(s)-(n[s]-1)*BLOCK)/60})}});return out}
// ---------- clock ----------
let lastAct=Date.now(),brk=false,cont=0,n=0;
['pointerdown','keydown','touchstart','wheel','input'].forEach(e=>addEventListener(e,()=>{lastAct=Date.now()},{passive:true}));
const toast=t=>{let x=document.getElementById('pttoast');if(!x){x=document.createElement('div');x.id='pttoast';document.body.appendChild(x)}x.textContent=t;x.style.display='block';clearTimeout(x._t);x._t=setTimeout(()=>x.style.display='none',10000);x.onclick=()=>x.style.display='none'};
const speaking=()=>{try{return speechSynthesis.speaking}catch(e){return false}};
function bar(){let b=document.getElementById('ptbar');if(!b){b=document.createElement('div');b.id='ptbar';document.body.appendChild(b);b.onclick=e=>{const t=e.target.closest('button');if(t){if(t.dataset.a=='brk'){brk=true;cont=0;save();bar()}else if(t.dataset.a=='back'){brk=false;lastAct=Date.now();bar()}}else if(!brk)location.hash='#home'}}
 const s=subjOf(location.hash.slice(1)||'home'),live=!brk&&(Date.now()-lastAct<IDLE*1e3||speaking());
 b.className=brk?'brk':'';
 const h=brk?`☕ On break. The clock is stopped. <button data-a=back>I’m back</button>`:`⏱ ${fmt(done())} of ${fmt(target())} <span class=st>${!live?'· paused, tap to continue':s?'· counting '+info(s)[2]:'· open an activity to count'}</span> <button data-a=brk>☕ Break</button>`;if(b._h!==h){b._h=h;b.innerHTML=h}}
function finished(s){toast(`🎉 ${info(s)[2]} is done for today!`);star();const all=SUBJ.every(x=>(day()[x[0]]||0)>=goal(x[0]));if(all){toast('🎉 All of today’s work is done. Well done! Now you can relax.');say('All of today\'s work is done. Well done!')}}
setInterval(()=>{const s=subjOf(location.hash.slice(1)||'home'),live=!brk&&document.visibilityState=='visible'&&(Date.now()-lastAct<IDLE*1e3||speaking());
 if(live&&s){const d=day(),b4=d[s]||0;d[s]=b4+1;cont++;n++;if(b4<goal(s)&&b4+1>=goal(s))finished(s);if(cont>=BLOCK){cont=0;toast('You have worked for 30 minutes. Stand up, stretch and drink some water. Press ☕ Break when you are ready.');say('You have worked for thirty minutes. Please stand up, stretch and drink some water.')}if(n%10==0)save()}
 else if(!live)cont=0;
 bar()},1000);
document.addEventListener('visibilitychange',save);addEventListener('pagehide',save);
// ---------- pages ----------
const E=s=>PT.esc(s);
function plan(el){const d=day(),bl=blocks(),next=bl.find(b=>(d[b.s]||0)<b.need),T=target(),Dn=done(),pct=T?Math.round(Dn/T*100):0,wk=[];
 for(let i=6;i>=0;i--){const k=PT.ymd(Date.now()-i*864e5),dd=D.days[k]||{};wk.push([new Date(k+'T00:00').toLocaleDateString('en',{weekday:'short'}),SUBJ.reduce((a,x)=>a+(dd[x[0]]||0),0)])}
 const mx=Math.max(T,...wk.map(x=>x[1]),1);
 const cards=SUBJ.map(([s,ic,nm])=>{const g=goal(s),v=d[s]||0,ok=v>=g;return`<a href="#${HOME[s]}"><span>${ic}</span>${E(nm)}<small style="display:block;margin-top:4px">${ok?'✅ Done · ':''}${Math.floor(v/60)} of ${Math.round(g/60)} min</small><div class=pb style="margin-top:8px"><i style="width:${g?Math.min(100,v/g*100):100}%"></i></div></a>`}).join('');
 let list='',k=0;bl.forEach((b,i)=>{const ok=(d[b.s]||0)>=b.need;list+=`<div class=li><span style="font-size:22px">${ok?'✅':'⬜'}</span><span>${info(b.s)[1]} ${E(info(b.s)[2])}</span><span class=sp></span><span class=mut>${Math.round(b.mins)} min</span></div>`;if(i%2==1&&i<bl.length-1)list+=`<div class=li style="opacity:.7"><span style="font-size:22px">☕</span><span>Rest. Drink water and stretch.</span></div>`});
 el.innerHTML=`<h1 class=pt>Today’s plan</h1><p class=mut>${new Date().toLocaleDateString('en',{weekday:'long',day:'numeric',month:'long'})} · Goal: ${fmt(T)}. Go at your own pace. Rest whenever you need to.</p>
 <div class=panel><div class=cr style="display:flex;justify-content:space-between"><b style="font-size:22px">${fmt(Dn)} of ${fmt(T)}</b><b>${pct}%</b></div><div class=pb style="height:16px;margin:10px 0"><i style="width:${pct}%"></i></div>
 ${next?`<p style="font-size:20px;margin:14px 0 8px">Next: <b>${info(next.s)[1]} ${E(info(next.s)[2])}</b> (${Math.round(next.mins)} min)</p><button class=go data-go="${HOME[next.s]}" style="font-size:22px;padding:14px 28px">▶ Start</button>`:`<p style="font-size:22px;margin:14px 0 0">🎉 You have finished everything for today. Well done!</p>`}
 <p class=mut style="font-size:15px;margin-top:14px">Physio, check-ups, meals, the bathroom: press <b>☕ Break</b> at the bottom of the screen. The clock stops until you come back.</p></div>
 <div class=hm>${cards}</div>
 <div class=panel style="margin-top:18px"><div class=ph><h2>Today’s list</h2></div>${list}</div>
 <div class=panel style="margin-top:18px"><div class=ph><h2>This week</h2></div><div style="display:flex;gap:8px;align-items:flex-end;height:130px">${wk.map(([l,v])=>`<div style="flex:1;text-align:center"><div style="height:${Math.round(v/mx*100)}px;background:var(--pri);border-radius:6px 6px 0 0;min-height:2px"></div><div style="font-size:13px">${l}</div><div class=mut style="font-size:12px">${Math.round(v/60)}m</div></div>`).join('')}</div></div>
 <details class=panel style="margin-top:18px"><summary style="cursor:pointer;font-weight:700">Change the daily goals</summary><p class=mut>Minutes per day. Use 0 for a rest day.</p>${SUBJ.map(([s,ic,nm])=>`<div class=li><span>${ic} ${E(nm)}</span><span class=sp></span><input type=number min=0 max=240 step=15 value="${Math.round(goal(s)/60)}" data-g="${s}" style="width:90px;font-size:18px;padding:6px"></div>`).join('')}<button class=ghost id=gsave style="margin-top:12px">Save goals</button> <button class=ghost id=grst style="margin-top:12px">Restart today’s clock</button></details>
 <p style="margin-top:18px"><a href="#dash">Open the old dashboard</a></p>`;
 el.onclick=e=>{const g=e.target.closest('[data-go]');if(g)location.hash=g.dataset.go};
 $('#gsave').onclick=()=>{el.querySelectorAll('[data-g]').forEach(i=>{D.goals[i.dataset.g]=Math.max(0,+i.value||0)});save();plan(el)};
 $('#grst').onclick=()=>{if(confirm('Set today’s time back to zero?')){D.days[PT.ymd()]={};save();plan(el)}}}
function english(el){el.innerHTML=`<p class=mut style="font-size:15px"><a href="#home">Today’s plan</a> › Literacy</p><h1 class=pt>📖 Literacy (English)</h1><p class=mut>Choose what to practise. Reading, sounds and spelling all count.</p><div class=hm>${GR.filter(g=>KEYMAP[g[0]]=='english').map(g=>`<a href="#g-${g[0]}"><span>${g[1]}</span>${E(g[2])}</a>`).join('')}</div>`}
const oldHome=A.home;A.dash=['Dashboard',oldHome[1],'🏡','','page'];A.home=['Today',plan,'📋','','page'];A['subj-english']=['Literacy',english,'📖','','page'];
// sidebar and tab labels
const sl=document.querySelector('#sb [data-id=home]');if(sl&&sl.lastChild)sl.lastChild.textContent='Today';const tl=document.querySelector('#tabs [data-id=home]');if(tl)tl.textContent='Today';
// style
const st=document.createElement('style');st.textContent=`#ptbar{position:fixed;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:50;background:#232323;color:#fff;border-radius:999px;padding:10px 12px 10px 18px;font-size:16px;font-weight:700;box-shadow:0 4px 16px rgba(0,0,0,.3);display:flex;gap:10px;align-items:center;cursor:pointer;max-width:calc(100vw - 24px)}#ptbar .st{font-weight:400;opacity:.8;font-size:14px}#ptbar button{border:0;border-radius:999px;padding:8px 14px;font-size:15px;font-weight:800;background:#f4c84e;color:#222;cursor:pointer}#ptbar.brk{background:#c75b00}#pttoast{display:none;position:fixed;left:50%;transform:translateX(-50%);top:16px;z-index:60;background:#fff;color:#222;border:3px solid #f4c84e;border-radius:16px;padding:14px 20px;font-size:20px;font-weight:700;max-width:min(560px,92vw);box-shadow:0 6px 24px rgba(0,0,0,.3);cursor:pointer}@media(max-width:900px){#ptbar{bottom:calc(76px + env(safe-area-inset-bottom))}}`;document.head.appendChild(st);
bar();
})();