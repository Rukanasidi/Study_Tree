// Maths: counting in steps, times tables, adding to 20. Every question is read aloud, with a 🔊 Hear it button.
(()=>{
const STEPS=[2,3,4,5,8,10],TABLES=[2,3,4,5,10];
const rnd=n=>Math.random()*n|0;
const near=(a,d)=>S([...new Set(d.map(x=>a+x).filter(v=>v>0&&v!==a))]).slice(0,2).map(String);
const opts=(a,d)=>S([String(a),...near(a,d)]);
// Counting in steps: find the missing number
const skipQ=step=>{const len=5+rnd(2),start=step*(1+rnd(3)),seq=Array.from({length:len},(_,k)=>start+k*step),b=1+rnd(len-1);
 return{big:`<span style="font-size:.55em">${seq.map((n,k)=>k==b?'<b style="color:var(--ac2,#c75b00)">?</b>':n).join(' , ')}</span>`,o:opts(seq[b],[step,-step,1,-1,2*step]),a:String(seq[b]),say:`Count in ${step}s. ${seq.map((n,k)=>k==b?'what number is missing':n).join(', ')}`}};
const skip=step=>el=>quiz(el,Array(8).fill(step),skipQ);
// Times tables
const timesQ=([t,m])=>({big:`${t} × ${m} = ?`,o:opts(t*m,[t,-t,1,-1,2*t]),a:String(t*m),say:`${t} times ${m}`});
const times=t=>el=>quiz(el,S(Array.from({length:12},(_,i)=>[t,i+1])).slice(0,10),timesQ);
// Adding to 20
const addQ=([a,b])=>({big:`${a} + ${b} = ?`,o:opts(a+b,[1,-1,2,-2,10]),a:String(a+b),say:`${a} plus ${b}`});
const add=el=>quiz(el,Array.from({length:10},()=>{const a=1+rnd(19);return[a,1+rnd(20-a)]}),addQ);
// Tap the numbers in order (skip counting out loud)
function tap(el){const step=R(STEPS),seq=Array.from({length:8},(_,k)=>step*(k+1));let at=0;
 el.innerHTML=`<p class=mut>Tap the numbers in order. Count in ${step}s.</p><div class=opts>${S(seq).map(n=>`<button class=opt style="font-size:32px">${n}</button>`).join('')}</div><p class=mut id=tm></p><button class=ghost id=th>🔊 Hear it</button><button class=ghost id=tn>New numbers</button>`;
 say(`Count in ${step}s. Tap the numbers in order, starting with ${step}.`);
 $('#th').onclick=()=>say(`Count in ${step}s. Tap ${seq[at]||'the next number'}.`);$('#tn').onclick=()=>tap(el);
 el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(+b.textContent==seq[at]){b.classList.add('ok');say(b.textContent);at++;if(at==seq.length){star();$('#tm').textContent='🎉 You counted in '+step+'s!'}}else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),500);$('#tm').textContent='Look for '+seq[at]}})}
const ids=[];
const reg=(id,t,ic,d,f)=>{A[id]=[t,f,ic,d];return id};
const g1=STEPS.map(s=>reg('m-skip'+s,'Count in '+s+'s','🔢','Which number is missing?',skip(s)));g1.push(reg('m-tap','Tap in Order','👆','Tap the numbers in order.',tap));
const g2=TABLES.map(t=>reg('m-tt'+t,t+' Times Table','✖️','Answer the '+t+' times table.',times(t)));
const g3=[reg('m-add20','Adding to 20','➕','Add the two numbers.',add)];
[['Counting in Steps','🔢',g1],['Times Tables','✖️',g2],['Adding to 20','➕',g3]].forEach(([n,i,k])=>{G.push([n,i,k]);BR[n]=[i,k]});
GR.push(['maths','🔢','Maths',['Counting in Steps','Times Tables','Adding to 20']]);
})();