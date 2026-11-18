// Doubles and halves, sharing, shapes, patterns, smallest/largest. Three levels each. Load after maths4.js.
(()=>{
const rnd=n=>Math.random()*n|0;
const near=(a,d)=>S([...new Set(d.map(x=>a+x).filter(v=>v>=0&&v!==a))]).slice(0,2).map(String);
const opts=(a,d)=>S([String(a),...near(a,d)]);
const sm=(h,f=.6)=>`<span style="font-size:${f}em;line-height:1.4;display:block">${h}</span>`;
const lvl=make=>el=>{el.innerHTML=`<p class=mut>Pick a level</p><div class=opts>${['⭐ Easier','⭐⭐ Middle','⭐⭐⭐ Harder'].map((t,i)=>`<button class=opt data-l=${i} style="font-size:26px;padding:16px 22px">${t}</button>`).join('')}</div>`;say('Pick a level.');
 el.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>quiz(el,Array(8).fill(0),make(+b.dataset.l)))};
// 1. doubles and halves
const dh=l=>()=>{const m=[5,10,20][l],dbl=rnd(2)==0;
 if(dbl){const n=1+rnd(m);return{big:sm(`Double <b>${n}</b>`,.8),o:opts(2*n,[2,-2,1,-1,n]),a:String(2*n),say:`What is double ${n}?`}}
 const n=2*(1+rnd(m));return{big:sm(`Half of <b>${n}</b>`,.8),o:opts(n/2,[1,-1,2,-2]),a:String(n/2),say:`What is half of ${n}?`}};
// 2. sharing and groups
const IT=['🍎','🍋','🥕','🍊'],PL=[[2],[2,5],[2,3,4,5,10]];
const share=l=>()=>{const p=R(PL[l]),each=1+rnd(l<2?5:10),tot=p*each,e=R(IT),asEach=rnd(2)==0,pics=tot<=20?`<span style="font-size:.5em;display:block">${e.repeat(tot)}</span>`:'';
 return asEach?{big:pics+sm(`${tot} shared equally between <b>${p}</b> plates.<br>How many on each plate?`,.5),o:opts(each,[1,-1,2,-2]),a:String(each),say:`${tot} are shared equally between ${p} plates. How many on each plate?`}
  :{big:pics+sm(`Put ${tot} into groups of <b>${p}</b>.<br>How many groups?`,.5),o:opts(each,[1,-1,2,-2]),a:String(each),say:`Put ${tot} into groups of ${p}. How many groups do you get?`}};
// 3. shapes (original drawings)
const K='stroke="#3b3b3b" stroke-width="4" stroke-linejoin="round"',sv=b=>`<svg viewBox="0 0 100 100" style="height:130px">${b}</svg>`;
const poly=(n,c,r=40)=>`<polygon ${K} fill="${c}" points="${Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return(50+r*Math.cos(a)).toFixed(1)+','+(54+r*Math.sin(a)).toFixed(1)}).join(' ')}"/>`;
const SH={
 circle:sv(`<circle ${K} fill="#e4572e" cx="50" cy="50" r="40"/>`),
 square:sv(`<rect ${K} fill="#2e86de" x="12" y="12" width="76" height="76"/>`),
 rectangle:sv(`<rect ${K} fill="#4caf50" x="6" y="26" width="88" height="48"/>`),
 triangle:sv(poly(3,'#f4d03f')),pentagon:sv(poly(5,'#9b59b6')),hexagon:sv(poly(6,'#e84393')),
 sphere:sv(`<circle ${K} fill="#e4572e" cx="50" cy="50" r="40"/><ellipse cx="38" cy="36" rx="10" ry="6" fill="#fff" opacity=".6" transform="rotate(-30 38 36)"/>`),
 cube:sv(`<polygon ${K} fill="#7fb8f0" points="14,32 50,12 86,32 50,52"/><polygon ${K} fill="#2e86de" points="14,32 50,52 50,92 14,72"/><polygon ${K} fill="#1f5fa8" points="86,32 50,52 50,92 86,72"/>`),
 cuboid:sv(`<polygon ${K} fill="#9be29b" points="4,40 40,24 96,44 60,62"/><polygon ${K} fill="#4caf50" points="4,40 60,62 60,86 4,64"/><polygon ${K} fill="#2e8b3a" points="96,44 60,62 60,86 96,68"/>`),
 cylinder:sv(`<rect x="16" y="24" width="68" height="52" fill="#f5a623"/><line x1="16" y1="24" x2="16" y2="76" stroke="#3b3b3b" stroke-width="4"/><line x1="84" y1="24" x2="84" y2="76" stroke="#3b3b3b" stroke-width="4"/><ellipse ${K} fill="#f5a623" cx="50" cy="76" rx="34" ry="12"/><rect x="18" y="24" width="64" height="50" fill="#f5a623"/><ellipse ${K} fill="#fbc864" cx="50" cy="24" rx="34" ry="12"/>`),
 cone:sv(`<polygon ${K} fill="#e84393" points="50,8 86,76 14,76"/><ellipse ${K} fill="#e84393" cx="50" cy="76" rx="36" ry="12"/>`),
 pyramid:sv(`<polygon ${K} fill="#f4d03f" points="50,8 90,74 50,90 10,74"/><polyline ${K} fill="none" points="50,8 50,90"/>`)};
const D2=['circle','square','triangle','rectangle','pentagon','hexagon'],D3=['sphere','cube','cuboid','cylinder','cone','pyramid'],SIDES={triangle:3,square:4,rectangle:4,pentagon:5,hexagon:6};
const shapes=l=>()=>{const pool=l==0?D2.slice(0,4):l==1?D2:D3,n=R(pool);return{big:SH[n],o:S([n,...S(pool.filter(x=>x!=n)).slice(0,2)]),a:n,say:'What is the name of this shape?'}};
const sides=l=>()=>{const pool=l==0?['triangle','square']:Object.keys(SIDES),n=R(pool),c=SIDES[n];return{big:SH[n],o:opts(c,[1,-1,2,-2]),a:String(c),say:'How many sides does this shape have?'}};
// 4. shape patterns: say what comes next
const pat=l=>()=>{const t=S(D2.slice(0,5)).slice(0,l==2?3:2),[a,b,c]=t,seqs=[[a,b,a,b,a,b],[a,a,b,a,a,b],[a,b,c,a,b,c]],s=seqs[l==0?0:l==1?rnd(2):2],nx=s[4];
 const mini=n=>SH[n].replace('height:130px','height:70px');
 return{big:s.slice(0,4).map(mini).join('')+`<svg viewBox="0 0 100 100" style="height:70px"><text x="50" y="72" font-size="80" text-anchor="middle" fill="#c75b00">?</text></svg>`,o:S([nx,...S(D2.filter(x=>x!=nx)).slice(0,2)]),a:nx,say:'Look at the pattern. What shape comes next?'}};
// 5. smallest or largest of three numbers
const MX=[10,20,100];
const order=l=>()=>{const m=MX[l],ns=[...new Set(Array.from({length:3},()=>rnd(m+1)))];while(ns.length<3){const v=rnd(m+1);if(!ns.includes(v))ns.push(v)}
 const small=rnd(2)==0,a=small?Math.min(...ns):Math.max(...ns);return{big:sm(ns.join(' &nbsp; '),.9)+sm(`Which is the <b>${small?'smallest':'largest'}</b>?`,.5),o:S(ns.map(String)),a:String(a),say:`${ns.join(', ')}. Which is the ${small?'smallest':'largest'} number?`}};
const reg=(id,t,ic,d,f)=>{A[id]=[t,lvl(f),ic,d];return id};
const grp=[['Doubles, Halves and Sharing','✌️',[reg('m-dh','Doubles and Halves','✌️','Double it or halve it.',dh),reg('m-share','Sharing and Groups','🍽️','Share equally or make groups.',share)]],
 ['Shapes and Patterns','🔷',[reg('m-shape','Name the Shape','🔷','What is this shape called?',shapes),reg('m-sides','Count the Sides','📐','How many sides?',sides),reg('m-pat','Shape Patterns','🔁','What shape comes next?',pat)]],
 ['Putting in Order','📊',[reg('m-order','Smallest and Largest','📊','Find the smallest or largest number.',order)]]];
grp.forEach(([n,i,k])=>{G.push([n,i,k]);BR[n]=[i,k]});
const m=GR.find(g=>g[0]=='maths');grp.forEach(g=>m[3].push(g[0]));
})();