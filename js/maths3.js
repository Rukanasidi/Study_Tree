// Even more maths: number bonds, take away, number names, 10 more/less, + and - symbols, coins. Load after maths2.js.
(()=>{
const rnd=n=>Math.random()*n|0;
const near=(a,d)=>S([...new Set(d.map(x=>a+x).filter(v=>v>=0&&v!==a))]).slice(0,2).map(String);
const opts=(a,d)=>S([String(a),...near(a,d)]);
const sm=(h,f=.6)=>`<span style="font-size:${f}em">${h}</span>`;
// 1. Number bonds: ? + 7 = 10 / 13 + ? = 20
const bond=t=>el=>quiz(el,Array(8).fill(0),()=>{const a=rnd(t+1),b=t-a,left=rnd(2)==0;
 return{big:sm(left?`<b style="color:#c75b00">?</b> + ${b} = ${t}`:`${a} + <b style="color:#c75b00">?</b> = ${t}`,.8),o:opts(left?a:b,[1,-1,2,-2,3]),a:String(left?a:b),say:left?`What number plus ${b} makes ${t}?`:`${a} plus what number makes ${t}?`}});
// 2. Take away, and small story problems
const take=el=>quiz(el,Array(8).fill(0),()=>{const a=3+rnd(18),b=1+rnd(a-1);return{big:sm(`${a} − ${b} = ?`,.8),o:opts(a-b,[1,-1,2,-2]),a:String(a-b),say:`${a} take away ${b}`}});
const WH=[['biscuits','packet'],['stickers','sheet'],['apples','bag'],['sweets','jar']],NM=['Sam','Mia','Ben','Ola','Amina','Tom'];
const story=el=>quiz(el,Array(8).fill(0),()=>{const [w,c]=R(WH),T=10+rnd(11),a=1+rnd(5),b=1+rnd(5),[n1,n2]=S(NM);
 return{big:sm(`There are ${T} ${w} in a ${c}.<br>${n1} takes ${a}. ${n2} takes ${b}.<br><b>How many are left?</b>`,.45),o:opts(T-a-b,[1,-1,2,-2]),a:String(T-a-b),say:`There are ${T} ${w} in a ${c}. ${n1} takes ${a}. ${n2} takes ${b}. How many are left?`}});
// 3. Number names
const NA='zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split(' '),TN={30:'thirty',40:'forty',50:'fifty',60:'sixty',70:'seventy',80:'eighty',90:'ninety',100:'one hundred'};
const nm=n=>n<=20?NA[n]:TN[n],pool=[...Array(21).keys()].concat(Object.keys(TN).map(Number));
const names=el=>quiz(el,Array(8).fill(0),()=>{const n=R(pool),toWord=rnd(2)==0,wrong=S(pool.filter(x=>x!=n)).slice(0,2);
 return toWord?{big:String(n),o:S([n,...wrong].map(nm)),a:nm(n),say:'Which word is this number?'}:{big:sm(nm(n),.8),o:S([n,...wrong].map(String)),a:String(n),say:nm(n)}});
// 4. 10 more, 10 less
const ten=el=>quiz(el,Array(8).fill(0),()=>{const n=(2+rnd(9))*10-(rnd(2)?0:rnd(9)),more=rnd(2)==0,a=more?n+10:n-10;
 return{big:sm(`${n} → 10 ${more?'more':'less'}`,.7),o:opts(a,[10,-10,1,-1,20]),a:String(a),say:`What is 10 ${more?'more':'less'} than ${n}?`}});
// 5. Pick + or −
const sym=el=>quiz(el,Array(8).fill(0),()=>{const a=2+rnd(15),b=1+rnd(a-1),add=rnd(2)==0,c=add?a+b:a-b;
 return{big:sm(`${a} <b style="color:#c75b00">?</b> ${b} = ${c}`,.8),o:['+','−'],a:add?'+':'−',say:`${a} ${add?'plus':'take away'} ${b}? equals ${c}. Do you add or take away?`}});
// 6. Coins
const CO=[1,2,5,10],coin=p=>`<span style="display:inline-flex;width:58px;height:58px;border-radius:50%;background:${p<5?'#d98e4f':'#d5dde6'};border:3px solid #3b3b3b;align-items:center;justify-content:center;font-size:22px;font-weight:800;margin:4px;color:#222">${p}p</span>`;
const coins=el=>quiz(el,Array(8).fill(0),()=>{let cs=[],t=0;const k=2+rnd(3);while(cs.length<k){const p=R(CO);if(t+p<=20){cs.push(p);t+=p}else if(cs.length)break}
 if(cs.length<2){cs=[5,2];t=7}return{big:cs.map(coin).join(''),o:opts(t,[1,-1,2,-2,5]),a:String(t),say:'How much money is this? Add the coins.'}});
const reg=(id,t,ic,d,f)=>{A[id]=[t,f,ic,d];return id};
const grp=[['Number Bonds','🤝',[reg('m-bond10','Number Bonds to 10','🤝','Which number makes 10?',bond(10)),reg('m-bond20','Number Bonds to 20','🤝','Which number makes 20?',bond(20))]],
 ['Take Away','➖',[reg('m-take','Take Away','➖','Take the number away.',take),reg('m-story','What Is Left?','🍪','Read the story. How many are left?',story)]],
 ['Number Names','🔤',[reg('m-names','Numbers and Words','🔤','Match the number to its word.',names)]],
 ['10 More, 10 Less','🔼',[reg('m-ten','10 More, 10 Less','🔼','Add or take away 10.',ten)]],
 ['Plus or Minus','➕',[reg('m-sym','Plus or Minus?','➕','Which sign completes the sum?',sym)]],
 ['Coins','🪙',[reg('m-coins','Count the Coins','🪙','How much money is there?',coins)]]];
grp.forEach(([n,i,k])=>{G.push([n,i,k]);BR[n]=[i,k]});
const m=GR.find(g=>g[0]=='maths');grp.forEach(g=>m[3].push(g[0]));
})();