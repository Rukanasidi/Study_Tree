// Time, days and months, digit values, tens sums, digit cards, more/less puzzles, money. Three levels. Load after maths5.js.
(()=>{
const rnd=n=>Math.random()*n|0;
const near=(a,d)=>S([...new Set(d.map(x=>a+x).filter(v=>v>=0&&v!==a))]).slice(0,2).map(String);
const opts=(a,d)=>S([String(a),...near(a,d)]);
const three=(a,pool)=>S([a,...S([...new Set(pool)].filter(x=>x!==a)).slice(0,2)]);
const sm=(h,f=.6)=>`<span style="font-size:${f}em;line-height:1.4;display:block">${h}</span>`;
const lvl=make=>el=>{el.innerHTML=`<p class=mut>Pick a level</p><div class=opts>${['⭐ Easier','⭐⭐ Middle','⭐⭐⭐ Harder'].map((t,i)=>`<button class=opt data-l=${i} style="font-size:26px;padding:16px 22px">${t}</button>`).join('')}</div>`;say('Pick a level.');
 el.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>quiz(el,Array(8).fill(0),make(+b.dataset.l)))};
// 1. clock
const clockSvg=(h,m)=>{const hx=(h%12)*30+m*.5,mx=m*6,P=(a,r)=>`${(50+r*Math.sin(a*Math.PI/180)).toFixed(1)} ${(50-r*Math.cos(a*Math.PI/180)).toFixed(1)}`;
 let s=`<svg viewBox="0 0 100 100" style="height:170px"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#3b3b3b" stroke-width="4"/>`;
 for(let i=1;i<=12;i++){const a=i*30*Math.PI/180;s+=`<text x="${(50+36*Math.sin(a)).toFixed(1)}" y="${(54-36*Math.cos(a)).toFixed(1)}" font-size="11" font-weight="700" text-anchor="middle" fill="#3b3b3b">${i}</text>`}
 return s+`<path d="M50 50L${P(mx,34)}" stroke="#2e86de" stroke-width="3" stroke-linecap="round"/><path d="M50 50L${P(hx,24)}" stroke="#e4572e" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="50" r="3.5" fill="#3b3b3b"/></svg>`};
const nm=(h,t)=>t==0?`${h} o'clock`:t==1?`half past ${h}`:t==2?`quarter past ${h}`:`quarter to ${h==12?1:h+1}`;
const clock=l=>()=>{const h=1+rnd(12),ts=l==0?[0]:l==1?[0,1]:[0,1,2,3],t=R(ts),m=[0,30,15,45][t],pool=[];
 for(let k=0;k<12;k++)pool.push(nm(1+rnd(12),R(ts)));pool.push(nm(h%12+1,t),nm((h+10)%12+1,t));const a=nm(h,t);
 const hh=t==3?(h==12?1:h+1):h;return{big:clockSvg(t==3?h:h,m),o:three(a,pool),a,say:'What time is shown on the clock?'}};
// 2. days and months
const D=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],M=['January','February','March','April','May','June','July','August','September','October','November','December'];
const dm=l=>()=>{const months=l>0&&rnd(2)==0,L=months?M:D,n=L.length,i=rnd(n),back=l==2&&rnd(2)==0;
 if(l==0||rnd(2)==0&&l==1){const a=L[(i+n-1)%n],b=L[i],c=L[(i+1)%n];return{big:sm(`${a}, ${b}, <b style="color:#c75b00">?</b>`,.7),o:three(c,L),a:c,say:`What comes next? ${a}, ${b}`}}
 const t=L[i],a=back?L[(i+n-1)%n]:L[(i+1)%n];return{big:sm(`What comes <b>${back?'before':'after'}</b> ${t}?`,.6),o:three(a,L),a,say:`What ${months?'month':'day'} comes ${back?'before':'after'} ${t}?`}};
// 3. which is the shortest / longest time
const U=['a second','a minute','an hour','a day','a week','a month','a year'],UL=[4,6,7];
const tu=l=>()=>{const p=U.slice(0,UL[l]),t=S(p).slice(0,3),sh=rnd(2)==0,a=t.sort((x,y)=>U.indexOf(x)-U.indexOf(y))[sh?0:2];return{big:sm(`Which is the <b>${sh?'shortest':'longest'}</b> time?`,.6),o:S(t),a,say:`Which is the ${sh?'shortest':'longest'} time? ${t.join(', or ')}`}};
// 4. what is the underlined digit worth?
const dig=l=>()=>{const n=l==0?11+rnd(40):l==1?11+rnd(89):101+rnd(899),s=String(n),i=rnd(s.length),v=+s[i]*10**(s.length-1-i),vals=[v,...s.split('').map((d,k)=>+d*10**(s.length-1-k)),+s[i]];
 const html=s.split('').map((d,k)=>k==i?`<u>${d}</u>`:d).join('');return{big:html,o:three(String(v),vals.concat([v+1,v+10,v*10,v+100]).map(String)),a:String(v),say:`What is the underlined digit worth in the number ${n.toString().split('').join(' ')}?`.replace(/ /g,' ')}};
// 5. tens sums and teen facts
const tens=l=>()=>{const k=rnd(l==2?4:3);
 if(k==0){const a=10*(1+rnd(l?6:3)),b=10*(1+rnd(l?(10-a/10-1)||1:2));return{big:sm(`${a} + ${b} =`,.8),o:opts(a+b,[10,-10,1,-1]),a:String(a+b),say:`${a} plus ${b}`}}
 if(k==1){const a=10*(3+rnd(l?7:3)),b=10*(1+rnd(a/10-1));return{big:sm(`${a} − ${b} =`,.8),o:opts(a-b,[10,-10,1,-1]),a:String(a-b),say:`${a} take away ${b}`}}
 if(k==2||l<2){const o=1+rnd(9),x=2+rnd(9);const a=`10 + ${x}`;return{big:sm(`If ${10+o} = 10 + ${o},<br>what is ${10+x}?`,.55),o:three(a,[`10 + ${o}`,`10 + ${x+1}`,`10 + ${Math.max(1,x-1)}`,`${10+x} + 10`]),a,say:`If ${10+o} equals 10 plus ${o}, then ${10+x} equals what?`}}
 const a=50+10*rnd(5),b=10*(1+rnd(2)),c=10*(1+rnd(2));return{big:sm(`${a} − ${b} − ${c} =`,.8),o:opts(a-b-c,[10,-10,20]),a:String(a-b-c),say:`${a} take away ${b} take away ${c}`}};
// 6. make the highest / lowest number with the cards
const cards=l=>()=>{const n=[3,4,5][l],ds=S([1,2,3,4,5,6,7,8,9]).slice(0,n),hi=rnd(2)==0,srt=[...ds].sort((x,y)=>hi?y-x:x-y),a=srt.join('');
 const wr=new Set();while(wr.size<2){const p=S(ds).join('');if(p!==a)wr.add(p)}
 return{big:`<span style="font-size:.9em">${ds.map(d=>`<span style="display:inline-block;border:3px solid #3b3b3b;border-radius:10px;padding:0 12px;margin:4px;background:#fff">${d}</span>`).join('')}</span>`+sm(`Make the <b>${hi?'highest':'lowest'}</b> number. Use each card once.`,.45),o:S([a,...wr]),a,say:`Make the ${hi?'highest':'lowest'} number you can with these cards. Use each card once.`}};
// 7. more / less puzzles
const MX=[10,20,100];
const rel=l=>()=>{const m=MX[l],k=1+rnd(l==2?10:l==1?6:4),n=k+1+rnd(m-k),kind=rnd(4);
 if(kind==0)return{big:sm(`Which number is ${k} more than ${n-k}?`,.55),o:opts(n,[1,-1,k,-k]),a:String(n),say:`Which number is ${k} more than ${n-k}?`};
 if(kind==1)return{big:sm(`${n} is ${k} more than <b style="color:#c75b00">?</b>`,.7),o:opts(n-k,[1,-1,k,-k]),a:String(n-k),say:`${n} is ${k} more than what number?`};
 if(kind==2)return{big:sm(`What number is ${k} less than ${n}?`,.55),o:opts(n-k,[1,-1,k,-k]),a:String(n-k),say:`What number is ${k} less than ${n}?`};
 return{big:sm(`<b style="color:#c75b00">?</b> − ${k} = ${n-k}`,.8),o:opts(n,[1,-1,k,-k]),a:String(n),say:`What number take away ${k} makes ${n-k}?`}};
// 8. money stories
const NMS=['Michael','Mia','Ola','Sam','Amina','Ben'];
const money=l=>()=>{const [n]=S(NMS),m=[8,15,40][l],kind=rnd(3);
 if(kind==0){const a=1+rnd(m-2),b=1+rnd(m-a);return{big:sm(`${n} has £${a} and is given £${b} more.<br>How much does he have now?`,.5),o:S([a+b,...near(a+b,[1,-1,2,-2])].map(x=>'£'+x)),a:'£'+(a+b),say:`${n} has ${a} pounds and is given ${b} pounds more. How much does he have now?`}}
 if(kind==1){const a=3+rnd(m-2),b=1+rnd(a-1);return{big:sm(`${n} has £${a}. He spends £${b}.<br>How much is left?`,.5),o:S([a-b,...near(a-b,[1,-1,2,-2])].map(x=>'£'+x)),a:'£'+(a-b),say:`${n} has ${a} pounds. He spends ${b} pounds. How much is left?`}}
 const p=R(l==0?[2]:l==1?[2,5]:[2,5,10]),c=2+rnd(l==2?8:4),t=p*c;return{big:sm(`A sweet costs ${p}p.<br>How many sweets can I buy for ${t}p?`,.5),o:opts(c,[1,-1,2,-2]),a:String(c),say:`A sweet costs ${p} pence. How many sweets can I buy for ${t} pence?`}};
const reg=(id,t,ic,d,f)=>{A[id]=[t,lvl(f),ic,d];return id};
const grp=[['Telling the Time','🕒',[reg('m-clock','What Time Is It?','🕒','Read the clock.',clock),reg('m-dm','Days and Months','📅','Which day or month comes next?',dm),reg('m-tu','Shortest and Longest Time','⏳','Which takes the shortest or longest?',tu)]],
 ['Bigger Numbers','🔢',[reg('m-dig','What Is the Digit Worth?','🔍','Find the value of the underlined digit.',dig),reg('m-tens','Tens and Teens','🔟','Add and take away tens.',tens),reg('m-cards','Make the Number','🃏','Make the highest or lowest number.',cards),reg('m-rel','More or Less Puzzles','🧮','Work out the missing number.',rel)]],
 ['Money Stories','💷',[reg('m-money','Money Stories','💷','Pounds and pence problems.',money)]]];
grp.forEach(([n,i,k])=>{G.push([n,i,k]);BR[n]=[i,k]});
const m=GR.find(g=>g[0]=='maths');grp.forEach(g=>m[3].push(g[0]));
})();