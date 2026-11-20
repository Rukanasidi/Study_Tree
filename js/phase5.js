// Phase 5 vowel digraphs (ay ou ie oy ir ue ea aw ew oe au ey) + Fractions for maths.
// Load AFTER maths6.js and phase2.js, before pics.js. Add words: add them to the DG lists below.
(()=>{
const E=s=>PT.esc(s),rnd=n=>Math.random()*n|0;
const DG={ay:'hay say pay ray bay day stay tray play crayon maybe',ou:'couch house mouth sound found count round cloud ground',ie:'tie pie die lie flies fries fried cried tried spied',oy:'royal boy soy toy joy loyal enjoy oyster annoyed destroy',ir:'sir girl bird firm dirt skirt shirt first birth thirst',ue:'glue argue true blue tissue rescue statue',ea:'bead speak read meat leaf peak lead beak heat treat',aw:'saw paw jaw law raw lawn straw crawl yawn claws',ew:'pew jewel dew few stew drew chew grew screw threw news',oe:'heroes toe doe foe potatoes tomatoes dominoes',au:'haunted because autumn author sauce pause august haul',ey:'key monkey donkey honey turkey money trolley valley'};
const KEYS=Object.keys(DG),W=k=>DG[k].split(' ');
const hi=(w,d)=>E(w).replace(d,`<b style="color:var(--ac2,#d9480f)">${d}</b>`);
// 1. Read the words
function read(el){el.innerHTML=`<p class=mut>Pick the letters. Then tap each word to hear it.</p><div class=opts>${KEYS.map(k=>`<button class=opt data-k=${k} style="font-size:34px">${k}</button>`).join('')}</div><div id=pw></div>`;
 el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;say(k);
  $('#pw').innerHTML=`<p class=big style="text-align:center;font-size:60px;margin:14px 0 4px">${k}</p><div class=opts>${W(k).map(w=>`<button class=opt data-w="${w}" style="font-size:30px">${hi(w,k)}</button>`).join('')}</div>`;
  el.querySelectorAll('[data-w]').forEach(x=>x.onclick=()=>{say(x.dataset.w);x.classList.add('ok')});star()})}
// 2/3. Which letters? (see the word) and Listen and choose (hear the word)
const mk=hear=>()=>{const k=R(KEYS),w=R(W(k).filter(x=>x.split(k).length==2)),others=S(KEYS.filter(o=>o!=k&&!w.includes(o))).slice(0,2);
 const big=hear?`<span style="font-size:.6em;display:block">Listen. Which letters make the sound?</span>`:`<span style="font-size:1.3em">${E(w.replace(k,'_ _'))}</span>`;
 return{big,o:S([k,...others]),a:k,say:hear?w:`${w}. Which letters are missing?`}};
const quizA=hear=>el=>quiz(el,Array(8).fill(0),mk(hear));
// ---------- Fractions ----------
const NM=['','whole','half','third','quarter','fifth','sixth','seventh','eighth'];
const say2=(k,n)=>n==2?(k==1?'one half':k+' halves'):(k==1?'one ':k+' ')+NM[n]+(k==1?'':'s');
const K='stroke="#3b3b3b" stroke-width="3" stroke-linejoin="round"',SH='#f4a259',WH='#fff';
const circle=(n,k,attr=(i)=>'')=>{const pt=(i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[50+42*Math.cos(a),50+42*Math.sin(a)]};
 return`<svg viewBox="0 0 100 100" style="height:140px">${Array.from({length:n},(_,i)=>{const[x1,y1]=pt(i),[x2,y2]=pt(i+1);return`<path ${attr(i)} ${K} fill="${i<k?SH:WH}" d="M50 50 L${x1.toFixed(1)} ${y1.toFixed(1)} A42 42 0 ${n==2?0:0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z"/>`}).join('')}</svg>`};
const bar=(n,k,attr=(i)=>'')=>`<svg viewBox="0 0 160 60" style="height:80px">${Array.from({length:n},(_,i)=>`<rect ${attr(i)} ${K} fill="${i<k?SH:WH}" x="${5+i*150/n}" y="5" width="${150/n}" height="50"/>`).join('')}</svg>`;
const shape=(n,k,at)=>(n==2||n==4||n==3||n==6||n==8)&&rnd(2)?circle(n,k,at):bar(n,k,at);
const sm=(h,f=.55)=>`<span style="font-size:${f}em;line-height:1.4;display:block">${h}</span>`;
const lvl=make=>el=>{el.innerHTML=`<p class=mut>Pick a level</p><div class=opts>${['⭐ Easier','⭐⭐ Middle','⭐⭐⭐ Harder'].map((t,i)=>`<button class=opt data-l=${i} style="font-size:26px;padding:16px 22px">${t}</button>`).join('')}</div>`;say('Pick a level.');
 el.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>quiz(el,Array(8).fill(0),make(+b.dataset.l)))};
const DEN=[[2,4],[2,3,4],[2,3,4,5,6,8]];
const fopts=(k,n)=>{const p=new Set([`${k}/${n}`]);let g=0;while(p.size<3&&g++<50){const kk=Math.max(1,Math.min(n-1,k+(rnd(2)?1:-1)*(1+rnd(2)))),nn=rnd(2)?n:n+(rnd(2)?1:-1);if(nn>=2&&kk<nn)p.add(`${kk}/${nn}`)}return S([...p])};
const shaded=l=>()=>{const n=R(DEN[l]),k=l==0?1:1+rnd(n-1);
 return{big:shape(n,k)+sm('What fraction is shaded?'),o:fopts(k,n),a:`${k}/${n}`,say:'What fraction is shaded?'}};
const setq=l=>()=>{const n=R([[2,3,4],[3,4,5,6],[4,5,6,8]][l]),k=1+rnd(n-1),dots=Array.from({length:n},(_,i)=>`<circle cx="${14+i*24}" cy="16" r="10" ${K} fill="${i<k?'#e4572e':'#4a90d9'}"/>`).join('');
 return{big:`<svg viewBox="0 0 ${n*24+4} 32" style="height:60px">${dots}</svg>`+sm(`What fraction of the counters are <b>red</b>?`),o:fopts(k,n),a:`${k}/${n}`,say:'What fraction of the counters are red?'}};
const cmp=l=>()=>{const n=R(DEN[l].filter(x=>x>2).concat(l?[]:[4])),a=1+rnd(n-1);let b=1+rnd(n-1);while(b==a)b=1+rnd(n-1);const big=rnd(2)==0,ans=big?Math.max(a,b):Math.min(a,b);
 return{big:`<span style="display:block">${bar(n,a)}<br><b style="font-size:.6em">${a}/${n}</b></span><span style="display:block">${bar(n,b)}<br><b style="font-size:.6em">${b}/${n}</b></span>`+sm(`Which is <b>${big?'bigger':'smaller'}</b>?`),o:S([`${a}/${n}`,`${b}/${n}`]),a:`${ans}/${n}`,say:`Which fraction is ${big?'bigger':'smaller'}?`}};
const ord=l=>()=>{const n=R([[4,5],[4,5,6,8],[6,8]][l]),ks=S([...Array(n-1)].map((_,i)=>i+1)).slice(0,3),up=[...ks].sort((a,b)=>a-b),f=a=>a.map(k=>`${k}/${n}`).join(', '),lst=new Set([f(up)]);let g=0;while(lst.size<3&&g++<30)lst.add(f(S([...up])));
 return{big:sm(`Put these in order, smallest first:<br><b>${S([...ks]).map(k=>k+'/'+n).join(' &nbsp; ')}</b>`,.55),o:S([...lst]),a:f(up),say:'Put these fractions in order, smallest first.'}};
// Colour the fraction (tap the parts)
function colour(el){let r=0,ok=0;const N=6;
 const go=()=>{if(r>=N){el.innerHTML=`<p class=big style="text-align:center;font-size:60px">🎉</p><p style="text-align:center;font-size:22px">${ok} out of ${N} right.</p><p style="text-align:center"><button class=ghost id=ag>Play again</button></p>`;$('#ag').onclick=()=>{r=0;ok=0;go()};return}
  const n=R([2,3,4,6,8]),k=1+rnd(n-1),sel=new Set(),circ=rnd(2)==0&&n!=8||n==8&&rnd(2),at=i=>`data-i=${i} style="cursor:pointer"`;
  el.innerHTML=`<p class=mut style="text-align:center">Round ${r+1} of ${N}</p><p class=big style="text-align:center;font-size:30px;margin:6px">Colour <b>${k}/${n}</b></p><div id=cs style="text-align:center;font-size:150px">${circ?circle(n,0,at):bar(n,0,at)}</div><div class=rcbar><button class=ghost id=ch>🔊 Hear</button><button class=btn id=ck>✔ Check</button></div><p id=cm style="text-align:center;font-size:20px;min-height:1.5em"></p>`;
  el.querySelector('svg').style.height='170px';
  const say_=()=>say(`Colour ${say2(k,n)}.`);say_();$('#ch').onclick=say_;
  el.querySelectorAll('[data-i]').forEach(p=>p.onclick=()=>{const i=+p.dataset.i;sel.has(i)?sel.delete(i):sel.add(i);p.setAttribute('fill',sel.has(i)?SH:WH)});
  $('#ck').onclick=()=>{if(sel.size==k){ok++;star();$('#cm').textContent='🌟 Yes!';say('Yes!');r++;setTimeout(go,900)}else{$('#cm').textContent=`You coloured ${sel.size}. You need ${k} out of ${n} parts.`;say(`You coloured ${sel.size}. You need ${k}.`)}}};
 go()}
const reg=(id,t,ic,d,f)=>{A[id]=[t,f,ic,d];return id};
const g5=[reg('p5-read','Digraph Words','📖','Pick the letters and read the words.',read),reg('p5-see','Which Letters?','🔤','Find the missing letters.',quizA(false)),reg('p5-hear','Listen and Choose','👂','Hear the word, pick the letters.',quizA(true))];
G.push(['Phase 5 Vowel Digraphs','🌈',g5]);BR['Phase 5 Vowel Digraphs']=['🌈',g5];
GR.find(g=>g[0]=='cvc')[3].push('Phase 5 Vowel Digraphs');
const gf=[reg('m-fr-sh','What Fraction is Shaded?','🍕','Halves, thirds, quarters and more.',lvl(shaded)),reg('m-fr-set','Fraction of a Set','🔴','What fraction of the counters are red?',lvl(setq)),reg('m-fr-col','Colour the Fraction','🖍️','Tap the parts to colour the fraction.',colour),reg('m-fr-cmp','Bigger or Smaller','⚖️','Compare fractions with the same bottom number.',lvl(cmp)),reg('m-fr-ord','Fractions in Order','📊','Put fractions in order.',lvl(ord))];
G.push(['Fractions','🍕',gf]);BR['Fractions']=['🍕',gf];
GR.find(g=>g[0]=='maths')[3].push('Fractions');
})();