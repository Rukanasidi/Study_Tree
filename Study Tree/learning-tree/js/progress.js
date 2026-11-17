// Progress data (stored on this device only). Other files read it through PT.
(()=>{const K='pp-progress';
let D={words:{},days:{},seen:{},last:''};
try{D=Object.assign(D,JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(D))}catch(e){}};
const ymd=(t=Date.now())=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const review=()=>Object.entries(D.words).filter(([,r])=>r.miss>0&&r.ok<=r.miss*2).sort((a,b)=>b[1].t-a[1].t).slice(0,8).map(x=>x[0]);
Object.assign(PT,{esc,ymd,review,tab:'prog',days:()=>D.days,last:()=>D.last,seen:x=>D.seen[x],
 head:(t,s='')=>`<h1 class=pt>${t}</h1>${s?`<p class=mut>${s}</p>`:''}`,
 allIds:()=>GR.flatMap(g=>g[3].flatMap(bn=>BR[bn][1])),
 stats(){let w=0;for(let i=0;i<7;i++)if(D.days[ymd(Date.now()-i*864e5)])w++;
  return{today:D.days[ymd()]||0,week:w,known:Object.values(D.words).filter(r=>r.ok>=2&&r.ok>=r.miss).length,review:review(),tried:Object.keys(D.seen).length}},
 groupProg(g){const ids=g[3].flatMap(bn=>BR[bn][1]),tried=ids.filter(x=>D.seen[x]),last=[...tried].sort((a,b)=>D.seen[b]-D.seen[a])[0];return{ids,total:ids.length,tried:tried.length,last}},
 reset(){D={words:{},days:{},seen:{},last:''};save()}});
window.ptTrack=(w,first,miss)=>{const r=D.words[w]||(D.words[w]={ok:0,miss:0});if(miss)r.miss++;else if(first)r.ok++;r.t=Date.now();save()};
window.ptStar=()=>{D.days[ymd()]=(D.days[ymd()]||0)+1;save()};
window.ptHint=(el,a)=>{const b=[...el.querySelectorAll('.opt')].find(x=>x.textContent===a);if(b)b.classList.add('hint')};
addEventListener('hashchange',()=>{const id=location.hash.slice(1),k=A[id]&&!A[id][4]?id:/^cd\d+$/.test(id)?'cal':null;if(k){D.seen[k]=Date.now();D.last=k;save()}});
})();
