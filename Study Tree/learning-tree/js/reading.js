// Reading comprehension. Add your own passages to RC (level: 'KS1', 'LKS2' or 'UKS2'). Options are shuffled; a = index of the right answer in o.
(()=>{const RC=[...RCJ,
{id:'rc-snow',level:'KS1',title:'The Snowy Walk',
 text:['Sam put on his red hat and his big boots.','He went out into the snow with his dog, Max.','Max ran fast and jumped in the deep snow. Sam laughed.','Then they went home for hot soup.'],
 qs:[{q:'What colour was Sam’s hat?',o:['red','blue','green'],a:0},{q:'Who went out with Sam?',o:['his dog','his dad','his friend'],a:0},{q:'What did they have at home?',o:['hot soup','cold milk','a cake'],a:0}]},
{id:'rc-bus',level:'UKS2',title:'The Last Bus',
 text:['The streetlights flickered on as Priya reached the empty bus stop. Her phone buzzed: no signal.','She checked the timetable twice. The last bus had left at six, and it was now almost seven.','A cold wind pulled at her coat. Behind her, a door creaked open and warm yellow light spilled onto the pavement.','“You look like you could use a hot drink,” called an old woman from the doorway of the café.'],
 qs:[{q:'How do we know Priya has missed the bus?',o:['The timetable says the last bus left at six','The bus stop is full of people','Her phone rang'],a:0},{q:'Which word best describes how Priya probably feels?',o:['worried','excited','bored'],a:0},{q:'What does “spilled” suggest about the light?',o:['It spread out across the pavement','It was dirty','It was very dim'],a:0}]}];
let tok=0;const stopRead=()=>{tok++;try{speechSynthesis.cancel()}catch(e){}};
function readFrom(spans,i,onStep,onDone){const my=++tok,syn=speechSynthesis;try{syn.cancel()}catch(e){}
 const next=()=>{if(my!==tok)return;if(i>=spans.length){onDone();return}onStep(i);const u=new SpeechSynthesisUtterance(spans[i].textContent);u.rate=window.SPEED||.8;u.volume=1;const v=VO.find(v=>/en-GB/i.test(v.lang))||VO.find(v=>/^en/i.test(v.lang));if(v){u.voice=v;u.lang=v.lang}else u.lang='en-GB';i++;u.onend=()=>setTimeout(next,250);u.onerror=()=>{if(my===tok)setTimeout(next,250)};syn.speak(u)};
 setTimeout(next,100)}
addEventListener('hashchange',stopRead);
const sents=p=>p.match(/[^.!?]+[.!?]+[”"]?/g)||[p];
function view(el,t){stopRead();const E=PT.esc;let i=0,miss=0;
 el.innerHTML=`<p class=mut>Tap a sentence to hear it. Read as many times as you like.</p><div class=rctext>${t.text.map(p=>`<p>${sents(p).map(s=>`<span class=sn>${E(s.trim())}</span>`).join(' ')}</p>`).join('')}</div><div class=rcbar><button class=btn id=rl style="font-size:22px;padding:14px 22px">🔊 Read it to me</button><button class=ghost id=rs>⏹ Stop</button><button class=ghost id=rsl>🐢 Slower</button><button class=ghost id=rf>🐇 Faster</button><button class=ghost id=tm>A−</button><button class=ghost id=tp>A+</button></div><p class=mut id=rinfo style="font-size:15px"></p><div id=rq></div>`;
 el.querySelectorAll('.sn').forEach(s=>s.onclick=()=>{stopRead();el.querySelectorAll('.sn.on').forEach(x=>x.classList.remove('on'));s.classList.add('on');say(s.textContent)});
 const sp=[...el.querySelectorAll('.sn')],box=el.querySelector('.rctext');let at=0,sz=+(localStorage.getItem('pp-rcsz')||0)||24;const fit=()=>{box.style.fontSize=sz+'px';try{localStorage.setItem('pp-rcsz',sz)}catch(e){}};fit();const spd=()=>{$('#rinfo').textContent='Reading speed: '+Math.round((window.SPEED||.8)*100)+'%'};spd();
 $('#rl').onclick=()=>readFrom(sp,at>=sp.length?0:at,k=>{sp.forEach(x=>x.classList.remove('on'));sp[k].classList.add('on');sp[k].scrollIntoView({block:'nearest'});at=k},()=>{sp.forEach(x=>x.classList.remove('on'));at=0});
 $('#rs').onclick=()=>stopRead();
 $('#rsl').onclick=()=>{window.SPEED=Math.max(.4,+((window.SPEED||.8)-.1).toFixed(1));spd()};$('#rf').onclick=()=>{window.SPEED=Math.min(1.2,+((window.SPEED||.8)+.1).toFixed(1));spd()};
 $('#tm').onclick=()=>{sz=Math.max(18,sz-4);fit()};$('#tp').onclick=()=>{sz=Math.min(48,sz+4);fit()};
 const ask=()=>{const q=t.qs[i],right=q.o[q.a];miss=0;
  $('#rq').innerHTML=`<h3 style="text-align:center">Question ${i+1} of ${t.qs.length}</h3><p style="font-size:1.1em">${E(q.q)}</p><button class=ghost id=hq>🔊 Hear the question and answers</button><div class=opts>${S(q.o).map(o=>`<button class=opt style="font-size:22px">${E(o)}</button>`).join('')}</div><p class=mut id=hn></p>`;
  $('#hq').onclick=()=>{stopRead();const os=[...$('#rq').querySelectorAll('.opt')].map(b=>b.textContent);say(q.q+' ... '+os.join(' ... or ... '))};$('#rq').querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
   if(b.textContent==right){b.classList.add('ok');star();setTimeout(()=>{if(++i<t.qs.length)ask();else $('#rq').innerHTML=`<p class=big style="font-size:60px">🎉</p><p>All ${t.qs.length} questions done.</p><button class=ghost id=ag>Read it again</button>`,$('#ag').onclick=()=>view(el,t)},800)}
   else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),500);miss++;$('#hn').textContent='Look back at the text and try again.';
    if(miss>1)[...$('#rq').querySelectorAll('.opt')].find(x=>x.textContent==right).classList.add('hint')}})};
 ask()}
RC.forEach(t=>{A[t.id]=[t.title,el=>view(el,t),'📖',t.level+' · '+t.qs.length+' questions']});
const L=['KS1','LKS2','UKS2'].filter(l=>RC.some(t=>t.level==l));
L.forEach(l=>{const ids=RC.filter(t=>t.level==l).map(t=>t.id);G.push(['Reading '+l,'📗',ids]);BR['Reading '+l]=['📗',ids]});
GR.push(['reading','📖','Reading',L.map(l=>'Reading '+l)]);
})();