// Phase 2 extras: 60 Second Reads (timed reading), Read and Match, Snowman Game, Word Cards by letter set.
// Load AFTER maths6.js (anywhere before pics.js). Edit the lists below to add words or passages.
(()=>{
const E=s=>PT.esc(s),rnd=n=>Math.random()*n|0;
// ---------- 1. 60 Second Reads ----------
const READS=[
['dogs','Dogs','A dog can run. A dog can dig. A dog can sit. A dog can nap. A dog can get a bun. Dogs can pant. A dog can hug.'],
['cats','Cats','A cat can sit on a mat. A cat can nap in a bed. A cat can hiss. A cat can lick a cup. A cat can get a rat.'],
['pigs','Pigs','A pig can dig. A pig is pink. A pig can nap in the mud. A pig can run fast. Pigs can hum and grunt.'],
['hens','Hens','A hen can sit on an egg. A hen can peck. A hen can run. The hen is in a pen. A hen can not swim.'],
['frogs','Frogs','A frog can hop and jump. A frog sits on a log in the pond. It can catch a fly with its long tongue. Frogs like to swim in the rain.'],
['ducks','Ducks','Ducks can swim and quack. A duck has a flat bill and webbed feet. The feet help it to paddle in the pond. A duck dips its head in the water to find food.'],
['owls','Owls','Owls hunt at night. An owl has big eyes and sharp claws. It can turn its head to look behind it. Owls fly very quietly, so a mouse cannot hear them.'],
['elephants','Elephants','An elephant is the largest animal on land. It uses its long trunk to drink, smell and pick up food. Elephants live in groups, and the babies stay close to their mothers.']
['pup','The Pup','A pup is in the mud. The pup can dig. The pup got a bug. The pup is not a big pup. It is fun in the mud. Mum can see the pup. The pup is in the tub.'],
['hill','The Hill','At the top of the hill is a hen. The hen can see a pig. The pig is in the pen. A cat can sit on a log. The sun is hot. I can run up the hill.'],
['dig','Dig, Dig','I can dig in the sand. I can dig a pit. A bug is in the pit. I can get a pot. I put the bug in the pot. Then I dig and dig.'],
['ican','I Can','I can tap a cap. I can sit on a mat. I can hop on a log. I can pat a pup. I can nap in a bed. I can hug Mum.']];

const f60=([id,title,txt])=>el=>{const W=txt.split(/\s+/);let left=60,iv=null,at=-1,run=false,t0=0;
 const key='pp-60-'+id,best=()=>{try{return+localStorage.getItem(key)||0}catch(e){return 0}};
 el.innerHTML=`<p class=mut>Read the words out loud. Tap each word as you read it, or tap the last word you reached when the time is up. Your best so far: <b id=fb>${best()||'none yet'}</b> words.</p><div class=rctext id=fx style="font-size:30px;line-height:1.9">${W.map((w,i)=>`<span class=sn data-i=${i}>${E(w)}</span>`).join(' ')}</div><div class=rcbar><button class=btn id=f1 style="font-size:22px;padding:14px 22px">▶ Start 60 seconds</button><button class=ghost id=f2>🔊 Listen first</button><button class=ghost id=f3>⏹ Finish</button></div><h2 id=ft style="text-align:center;min-height:1.4em"></h2><p id=fr style="text-align:center;font-size:20px"></p>`;
 const sp=[...el.querySelectorAll('.sn')],mark=i=>{at=i;sp.forEach((s,k)=>s.classList.toggle('on',k<=i))};
 const end=()=>{clearInterval(iv);if(!run)return;run=false;const secs=Math.max(1,Math.min(60,Math.round((Date.now()-t0)/1000))),n=at+1,wpm=Math.round(n*60/secs);
  $('#ft').textContent=n?`You read ${n} words in ${secs} seconds`:'Tap the words as you read them';
  if(n){$('#fr').textContent=`That is about ${wpm} words a minute.`+(n>best()?' 🌟 A new best!':'');if(n>best())try{localStorage.setItem(key,n);$('#fb').textContent=n}catch(e){}star()}
  $('#f1').textContent='▶ Try again'};
 sp.forEach(s=>s.onclick=()=>{if(run)mark(+s.dataset.i);else say(s.textContent)});
 $('#f1').onclick=()=>{try{speechSynthesis.cancel()}catch(e){}at=-1;mark(-1);left=60;run=true;t0=Date.now();$('#fr').textContent='';$('#ft').textContent='60';clearInterval(iv);$('#f1').textContent='▶ Restart';iv=setInterval(()=>{left--;$('#ft').textContent=left;if(left<=0){$('#ft').textContent='Time is up!';end()}},1000)};
 $('#f2').onclick=()=>say(txt);$('#f3').onclick=end};
// ---------- 2. Read and Match ----------
const SEN=[['It is a hat.','🎩'],['The pig is big.','🐖'],['A hen sat in a nest.','🐔'],['The sun is hot.','☀️'],['I can see a bug.','🐞'],['Dad has a map.','🗺️'],['It is a tin.','🥫'],['The cat is on the mat.','🐱'],['I got a bag.','🎒'],['Get the net.','🥅'],['A van can go fast.','🚐'],['The dog can bark.','🐶'],['Sit on a log.','🪵'],['I can see a web.','🕸️'],['It is a red apple.','🍎'],['The egg is in the cup.','🥚'],['A bee can sting.','🐝'],['The kite is up.','🪁'],['It is a big bed.','🛏️'],['The elephant is big.','🐘']];
function match(el){const set=S(SEN).slice(0,8);let i=0,ok=0;
 const go=()=>{if(i>=set.length){el.innerHTML=`<p class=big style="font-size:60px;text-align:center">🎉</p><p style="text-align:center;font-size:22px">All ${set.length} done.</p><p style="text-align:center"><button class=ghost id=ag>Play again</button></p>`;star();$('#ag').onclick=()=>match(el);return}
  const [s,pic]=set[i],opts=S([pic,...S(SEN.filter(x=>x[1]!=pic)).slice(0,2).map(x=>x[1])]);
  el.innerHTML=`<h3 style="text-align:center">Sentence ${i+1} of ${set.length}</h3><p class=big style="font-size:44px;text-align:center;line-height:1.3">${E(s)}</p><p style="text-align:center"><button class=ghost id=ml>🔊 Hear it</button></p><p class=mut style="text-align:center">Which picture matches?</p><div class=opts>${opts.map((p,k)=>`<button class=opt data-p="${k}" style="font-size:64px;padding:10px 24px">${p}</button>`).join('')}</div><p class=mut id=mm style="text-align:center"></p>`;
  $('#ml').onclick=()=>say(s);say(s);
  el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(opts[+b.dataset.p]==pic){b.classList.add('ok');star();say('Well done');setTimeout(()=>{i++;go()},900)}else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),500);$('#mm').textContent='Read the sentence again.'}})};
 go()}
// ---------- word sets (letters and sounds order) ----------
const SETS=[
 ['Set 1: s a t p','at as sat pat tap sap taps pats'],
 ['Set 2: i n m d','it is in an am and sit sip tip pit pip nip pan pin tin tan nap man mat map mad dad sad did dim dip din pad'],
 ['Set 3: g o c k','got dog cot cat can cap kid kit gap gas pig dig tag pot top pop mop cod cop dot tot not nod'],
 ['Set 4: ck e u r','neck peck deck duck sock pick kick tick rock pen net get men ten red run sun cup mug nut gum rat rip rug up mum'],
 ['Set 5: h b f l ff ll ss','hat hot hen hug hit bat bed big bug bus fan fin fit fun fog leg lip lot log huff puff off cuff bell doll hill fill kiss miss moss mess hiss fell tell well pill bull']].map(([n,w])=>[n,w.split(' ')]);
// ---------- 3. Snowman game ----------
const K='stroke="#3b3b3b" stroke-width="3" stroke-linejoin="round"';
const PARTS=[`<circle ${K} fill="#fff" cx="100" cy="195" r="52"/>`,`<circle ${K} fill="#fff" cx="100" cy="125" r="38"/>`,`<circle ${K} fill="#fff" cx="100" cy="68" r="28"/>`,`<circle fill="#3b3b3b" cx="90" cy="62" r="3.5"/><circle fill="#3b3b3b" cx="110" cy="62" r="3.5"/>`,`<path ${K} fill="#f5842a" d="M100 70l26 5-26 6z"/>`,`<rect ${K} fill="#3b3b3b" x="78" y="30" width="44" height="26" rx="3"/><rect ${K} fill="#3b3b3b" x="68" y="52" width="64" height="8" rx="3"/>`,`<path ${K} fill="#e4572e" d="M70 90q30 14 60 0l-4 14q-26 10-52 0z"/>`,`<circle fill="#3b3b3b" cx="100" cy="125" r="4"/><circle fill="#3b3b3b" cx="100" cy="145" r="4"/><path ${K} fill="none" stroke-linecap="round" d="M64 118L28 96M136 118l36-22"/>`];
function snow(el){const pool=SETS.flatMap(s=>s[1]).filter(w=>w.length>=2&&w.length<=4);let n=0,word='';
 const q=()=>{word=R(pool);const o=S([word,...S(pool.filter(w=>w!=word&&w[0]!=word[0])).slice(0,2)]);
  el.innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center;align-items:center"><svg viewBox="0 0 200 260" style="height:260px"><rect x="0" y="236" width="200" height="14" rx="7" fill="#dbe9f6"/>${PARTS.slice(0,n).join('')}</svg><div style="text-align:center"><p class=mut>Part ${Math.min(n+1,PARTS.length)} of ${PARTS.length}. Listen, then tap the word you hear.</p><p><button class=btn id=sh style="font-size:22px">🔊 Hear the word</button></p><div class=opts>${o.map(w=>`<button class=opt data-w="${w}" style="font-size:34px">${w}</button>`).join('')}</div><p class=mut id=sm></p></div></div>`;
  $('#sh').onclick=()=>say(word);setTimeout(()=>say(word),300);
  el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(b.dataset.w==word){b.classList.add('ok');star();n++;setTimeout(()=>n>=PARTS.length?fin():q(),600)}else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),500);$('#sm').textContent='Listen again and try another word.'}})};
 const fin=()=>{el.innerHTML=`<div style="text-align:center"><svg viewBox="0 0 200 260" style="height:260px"><rect x="0" y="236" width="200" height="14" rx="7" fill="#dbe9f6"/>${PARTS.join('')}</svg><h2>⛄ Your snowman is finished!</h2><button class=ghost id=sa>Build another</button></div>`;say('Your snowman is finished. Well done!');$('#sa').onclick=()=>snow(el)};
 q()}
// ---------- 4. Word cards by letter set ----------
const PH={ck:'kuh',ff:'fff',ll:'lll',ss:'sss'};
const sounds=w=>{const o=[];for(let i=0;i<w.length;i++){const d=w.slice(i,i+2);if(PH[d]){o.push(PH[d]);i++}else o.push(P[w[i]]||w[i])}return o};
function cards(el){el.innerHTML=`<p class=mut>Pick a set of letters.</p><div class=opts>${SETS.map((s,i)=>`<button class=opt data-s=${i} style="font-size:22px">${s[0]}</button>`).join('')}</div>`;
 el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>deck(el,+b.dataset.s))}
function deck(el,si){const ws=S(SETS[si][1]);let i=0,known=0;
 const show=()=>{if(i>=ws.length){el.innerHTML=`<p class=big style="font-size:60px;text-align:center">🎉</p><p style="text-align:center;font-size:22px">You read ${ws.length} words. You knew ${known} at once.</p><p style="text-align:center"><button class=ghost id=d1>Again</button> <button class=ghost id=d2>Choose another set</button></p>`;star();$('#d1').onclick=()=>deck(el,si);$('#d2').onclick=()=>cards(el);return}
  const w=ws[i];
  el.innerHTML=`<p class=mut style="text-align:center">${SETS[si][0]} · word ${i+1} of ${ws.length}</p><p class=big style="font-size:110px;text-align:center;margin:10px 0">${w}</p><div class=rcbar><button class=btn id=dh style="font-size:22px">🔊 Hear it</button><button class=ghost id=ds>🔤 Sound it out</button></div><div class=rcbar><button class=ghost id=dk style="font-size:22px">✅ I knew it</button><button class=ghost id=dn style="font-size:22px">Next ➜</button></div>`;
  $('#dh').onclick=()=>say(w);
  $('#ds').onclick=()=>{const sd=sounds(w);sd.forEach((s,k)=>setTimeout(()=>say(s,.7),k*900));setTimeout(()=>say(w),sd.length*900+200)};
  $('#dk').onclick=()=>{known++;star();i++;show()};$('#dn').onclick=()=>{i++;show()}};
 show()}
const reg=(id,t,ic,d,f)=>{A[id]=[t,f,ic,d];return id};
const g60=READS.map(r=>reg('m60-'+r[0],r[1],'⏱️','60 second read. How many words can you read?',f60(r)));
const gp=[reg('p2-match','Read and Match','🖼️','Read the sentence, then pick the picture.',match),reg('p2-snow','Snowman Game','⛄','Hear the word, tap it, build the snowman.',snow),reg('p2-cards','Word Cards by Letter Set','🃏','Read words made from the letters you know.',cards)];
G.push(['60 Second Reads','⏱️',g60]);BR['60 Second Reads']=['⏱️',g60];
G.push(['Phase 2 Practice','❄️',gp]);BR['Phase 2 Practice']=['❄️',gp];
const rd=GR.find(g=>g[0]=='reading');rd[3].push('60 Second Reads');const cv=GR.find(g=>g[0]=='cvc');cv[3].push('Phase 2 Practice');
})();