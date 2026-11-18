// Maths with three levels (Easier / Middle / Harder), like the Lower / Medium / Higher mats. Load after maths3.js.
(()=>{
const rnd=n=>Math.random()*n|0;
const near=(a,d)=>S([...new Set(d.map(x=>a+x).filter(v=>v>=0&&v!==a))]).slice(0,2).map(String);
const opts=(a,d)=>S([String(a),...near(a,d)]);
const sm=(h,f=.6)=>`<span style="font-size:${f}em;line-height:1.4;display:block">${h}</span>`;
const RG=[10,20,100];
// every activity here first asks for a level
const lvl=make=>el=>{el.innerHTML=`<p class=mut>Pick a level</p><div class=opts>${['⭐ Easier','⭐⭐ Middle','⭐⭐⭐ Harder'].map((t,i)=>`<button class=opt data-l=${i} style="font-size:26px;padding:16px 22px">${t}</button>`).join('')}</div>`;say('Pick a level.');
 el.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>quiz(el,Array(8).fill(0),make(+b.dataset.l)))};
// 1. one more / one less / 2 more
const more=l=>()=>{const n=1+rnd(RG[l]-2),s=l?R([1,2]):1,up=rnd(2)==0,a=up?n+s:Math.max(0,n-s);
 return{big:sm(`${n} → ${s} ${up?'more':'less'}`,.8),o:opts(a,[1,-1,2,-2,10]),a:String(a),say:`What is ${s} ${up?'more':'less'} than ${n}?`}};
// 2. even or odd
const eo=l=>()=>{const n=1+rnd(RG[l]);return{big:String(n),o:['even','odd'],a:n%2?'odd':'even',say:`Is ${n} even or odd?`}};
// 3. what comes next (counting on and back)
const SQ=[[1,2],[2,5,10],[2,3,5,10]];
const seq=l=>()=>{const st=R(SQ[l]),down=l>0&&rnd(2)==0,len=3,top=RG[l]>20?100:RG[l],start=down?st*(len+1+rnd(Math.max(1,(top/st|0)-len-1))):rnd(Math.max(1,top/2|0)),s=Array.from({length:len+1},(_,k)=>down?start-k*st:start+k*st);
 return{big:sm(s.slice(0,len).join(' , ')+' , <b style="color:#c75b00">?</b>',.75),o:opts(s[len],[st,-st,1,-1,2*st]),a:String(s[len]),say:`What number comes next? ${s.slice(0,len).join(', ')}`}};
// 4. what did I start with?
const NM=['Archie','Mia','Ola','Sam','Amina','Ben'],FD=['sausages','biscuits','apples','sweets'];
const start=l=>()=>{const top=l?20:10,left=1+rnd(top-2),gone=1+rnd(Math.min(9,top-left)),[n]=S(NM),f=R(FD),tot=left+gone;
 return{big:sm(`${n} has eaten ${gone} ${f}.<br>He has ${left} left.<br><b>How many did he start with?</b>`,.5),o:opts(tot,[1,-1,2,-2,gone]),a:String(tot),say:`${n} has eaten ${gone} ${f}. He has ${left} left. How many did he start with?`}};
// 5. lots of
const LT=[[2,'🍎'],[3,'🐝'],[4,'🍋'],[5,'✋'],[10,'']],chip=(p,e)=>`<span style="display:inline-block;border:3px solid #3b3b3b;border-radius:16px;padding:4px 10px;margin:4px;background:#fff">${e?e.repeat(p):`<b>${p}</b>`}</span>`;
const PS=[[2,5],[2,5,10],[2,3,4,5,10]];
const lots=l=>()=>{const p=R(PS[l]),k=2+rnd(l?5:2),e=LT.find(x=>x[0]==p)[1];
 return{big:`<span style="font-size:.45em;line-height:1.5;display:block">${chip(p,e).repeat(k)}<br><b>${k} lots of ${p}</b></span>`,o:opts(k*p,[p,-p,1,-1,2*p]),a:String(k*p),say:`${k} lots of ${p}. Count in ${p}s. How many altogether?`}};
// 6. tens and ones blocks
const RB=[20,50,99];
const blocks=l=>()=>{const n=11+rnd(RB[l]-10),t=n/10|0,o=n%10,W=t*22+(o?50:0)+10;let s=`<svg viewBox="0 0 ${Math.max(W,60)} 150" style="height:150px;max-width:100%">`;
 for(let i=0;i<t;i++){s+=`<rect x="${6+i*22}" y="6" width="18" height="140" fill="#e4572e" stroke="#3b3b3b" stroke-width="2"/>`;for(let j=1;j<10;j++)s+=`<line x1="${6+i*22}" x2="${24+i*22}" y1="${6+j*14}" y2="${6+j*14}" stroke="#3b3b3b" stroke-width="1.5"/>`}
 for(let k=0;k<o;k++)s+=`<rect x="${t*22+10+(k%2)*22}" y="${6+(k>>1)*22}" width="18" height="18" fill="#2e86de" stroke="#3b3b3b" stroke-width="2"/>`;
 return{big:s+'</svg>',o:opts(n,[1,-1,10,-10,9]),a:String(n),say:'Count the tens and the ones. What number do you see?'}};
// 7. longer / shorter, and how many cubes taller
const cmp=l=>()=>{const tall=l&&rnd(2)==0;
 if(!tall){const a=3+rnd(8);let b=3+rnd(8);if(b==a)b=a+2;const short=rnd(2)==0,ans=(a<b)==short?'A':'B';
  return{big:`<svg viewBox="0 0 400 110" style="width:100%;max-width:420px"><text x="4" y="32" font-size="24">A</text><rect x="34" y="12" width="${a*34}" height="26" rx="13" fill="#e4572e" stroke="#3b3b3b" stroke-width="3"/><text x="4" y="92" font-size="24">B</text><rect x="34" y="72" width="${b*34}" height="26" rx="13" fill="#2e86de" stroke="#3b3b3b" stroke-width="3"/></svg>`,o:['A','B'],a:ans,say:`Which is the ${short?'shortest':'longest'}? A or B?`}}
 const a=2+rnd(6),d=1+rnd(4),b=a+d,tw=(h,c,x)=>Array.from({length:h},(_,i)=>`<rect x="${x}" y="${160-(i+1)*14}" width="22" height="14" fill="${c}" stroke="#3b3b3b" stroke-width="2"/>`).join('');
 return{big:`<svg viewBox="0 0 120 170" style="height:170px">${tw(a,'#f5842a',20)}${tw(b,'#2e86de',70)}</svg>`,o:opts(d,[1,-1,2,-2]),a:String(d),say:'How many cubes taller is the blue tower than the orange tower?'}};
const reg=(id,t,ic,d,f)=>{A[id]=[t,lvl(f),ic,d];return id};
const grp=[['Number Sense','🧠',[reg('m-more','One More, One Less','➕','1 or 2 more or less.',more),reg('m-eo','Even or Odd','🎯','Is the number even or odd?',eo),reg('m-seq','What Comes Next?','🔜','Count on or back.',seq),reg('m-blocks','Tens and Ones Blocks','🧱','Count the blocks.',blocks)]],
 ['Maths Problems','🧩',[reg('m-start','What Did I Start With?','🌭','Work out how many there were at first.',start),reg('m-lots','Lots Of','✋','Count the groups.',lots),reg('m-cmp','Longer and Taller','📏','Compare the lengths.',cmp)]]];
grp.forEach(([n,i,k])=>{G.push([n,i,k]);BR[n]=[i,k]});
const m=GR.find(g=>g[0]=='maths');grp.forEach(g=>m[3].push(g[0]));
})();