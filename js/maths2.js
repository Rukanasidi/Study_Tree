// More maths: counting objects to 10, number-line jumps, place value, fruit shop. Load after maths.js.
(()=>{
const rnd=n=>Math.random()*n|0;
const near=(a,d)=>S([...new Set(d.map(x=>a+x).filter(v=>v>=0&&v!==a))]).slice(0,2).map(String);
const opts=(a,d)=>S([String(a),...near(a,d)]);
const W=['one','two','three','four','five','six','seven','eight','nine','ten'];
// 1. Count the pictures (1 to 10)
const THINGS=[['🍎','apples'],['🎈','balloons'],['🐝','bees'],['🌻','flowers'],['🍋','lemons'],['🥕','carrots'],['🐦','birds'],['🍊','oranges'],['🐢','turtles'],['🥚','eggs']];
const countQ=([e,name])=>{const n=1+rnd(10);return{big:`<span style="font-size:.5em;line-height:1.4;display:block;max-width:560px;margin:0 auto">${e.repeat(n)}</span>`,o:opts(n,[1,-1,2,-2]),a:String(n),say:`How many ${name} can you count?`}};
const count=el=>quiz(el,THINGS.slice().sort(()=>Math.random()-.5).concat(THINGS.slice(0,2)).slice(0,8),countQ);
// 2. Jumps on a number line
const lineQ=()=>{const st=R([2,3,4,5,10]),k=3+rnd(4),X=i=>40+i*(620/k);
 let s=`<svg viewBox="0 0 700 150" style="width:100%;max-width:640px" font-family="inherit" font-size="26" text-anchor="middle"><line x1="20" y1="100" x2="680" y2="100" stroke="#3b3b3b" stroke-width="4"/>`;
 for(let i=0;i<=k;i++){s+=`<line x1="${X(i)}" y1="92" x2="${X(i)}" y2="108" stroke="#3b3b3b" stroke-width="4"/><text x="${X(i)}" y="138" fill="${i==k?'#c75b00':'currentColor'}" font-weight="${i==k?800:400}">${i==k?'?':i*st}</text>`;
  if(i<k)s+=`<path d="M${X(i)} 96 Q${(X(i)+X(i+1))/2} 30 ${X(i+1)} 96" fill="none" stroke="#2e86de" stroke-width="4"/>`}
 return{big:s+'</svg>',o:opts(k*st,[st,-st,1,-1,2*st]),a:String(k*st),say:`Start at 0. Jump in ${st}s. You jump ${k} times. Which number do you land on?`}};
const line=el=>quiz(el,Array(8).fill(0),lineQ);
// 3. Place value
const pvQ=()=>{const n=11+rnd(89),t=n/10|0,o=n%10,kind=rnd(3);
 if(kind==0)return{big:`<span style="font-size:.6em">How many <b>tens</b> in <b>${n}</b>?</span>`,o:opts(t,[1,-1,2]),a:String(t),say:`How many tens are in ${n}?`};
 if(kind==1)return{big:`<span style="font-size:.6em">How many <b>ones</b> in <b>${n}</b>?</span>`,o:opts(o,[1,-1,2,-2,3]),a:String(o),say:`How many ones are in ${n}?`};
 return{big:`<span style="font-size:.6em"><b>${t}</b> tens and <b>${o}</b> ones =</span>`,o:opts(n,[10,-10,1,-1,9]),a:String(n),say:`${t} tens and ${o} ones make what number?`}};
const pv=el=>quiz(el,Array(8).fill(0),pvQ);
// 4. Fruit shop: groups of 2, 5 or 10
const FR=[['🍎','apples'],['🍌','bananas'],['🍊','oranges'],['🍋','lemons']];
const shopQ=()=>{const p=R([2,5,10]),g=2+rnd(4),[e,name]=R(FR),chip=p<=5?e.repeat(p):`<b>${p}</b>`,bag=`<span style="display:inline-block;border:3px solid #3b3b3b;border-radius:16px;padding:4px 10px;margin:4px;background:#fff">${chip}</span>`;
 return{big:`<span style="font-size:.45em;line-height:1.5;display:block">${bag.repeat(g)}</span>`,o:opts(p*g,[p,-p,1,-1,2*p]),a:String(p*g),say:`There are ${g} bags with ${p} ${name} in each bag. Count in ${p}s. How many altogether?`}};
const shop=el=>quiz(el,Array(8).fill(0),shopQ);
const reg=(id,t,ic,d,f)=>{A[id]=[t,f,ic,d];return id};
const grp=[['Count to 10','👀',[reg('m-count','Count the Pictures','👀','Count them, then tap the number.',count)]],
 ['Number Lines','↔️',[reg('m-line','Jumps on a Number Line','↔️','Count the jumps. Where do you land?',line)]],
 ['Place Value','🔟',[reg('m-pv','Tens and Ones','🔟','How many tens and ones?',pv)]],
 ['Fruit Shop','🍎',[reg('m-shop','Fruit Shop','🛒','Count the bags in 2s, 5s or 10s.',shop)]]];
grp.forEach(([n,i,k])=>{G.push([n,i,k]);BR[n]=[i,k]});
const m=GR.find(g=>g[0]=='maths');grp.forEach(g=>m[3].push(g[0]));
})();