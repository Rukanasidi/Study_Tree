// Word Wheels: pick a word family (like -at) and tap a letter around the wheel to make a new word.
// Add a family: add a line to RIMES: ['at','c h b m p r s f'] (the letters that make real words).
(()=>{
const E=s=>PT.esc(s);
const RIMES=[['at','c h b m p r s f v'],['an','c f m p r t v b'],['ap','c g l m n r t s z'],['ig','b d f p w j r'],['og','d f h j l b c'],['ug','b d h j l m r t p'],['op','c h m p t b l'],['ip','d h l n p r s t z'],['en','b d h m p t y'],['ed','b f l n r w'],['ot','c d g h j l n p r t'],['un','b f g n p r s'],['ut','b c g h j n r']].map(([r,o])=>[r,o.split(' ')]);
const wheel=el=>{el.innerHTML=`<p class=mut>Pick a word family.</p><div class=opts>${RIMES.map((r,i)=>`<button class=opt data-r=${i} style="font-size:30px">-${r[0]}</button>`).join('')}</div>`;
 el.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>spin(el,+b.dataset.r))};
function spin(el,ri){const [rime,ons]=RIMES[ri],n=ons.length,R0=138;let goal=null,got=0;
 const pos=i=>{const a=-Math.PI/2+i*2*Math.PI/n;return[170+R0*Math.cos(a),170+R0*Math.sin(a)]};
 el.innerHTML=`<p class=mut><a href="#" id=wb>← Other families</a></p><div style="position:relative;width:340px;height:340px;margin:0 auto;border-radius:50%;background:var(--card);border:4px solid var(--ln)">
  <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center"><div class=big style="font-size:44px;line-height:1">-${rime}</div><div id=wd style="font-size:32px;font-weight:800;min-height:1.3em"></div></div>
  ${ons.map((o,i)=>{const[x,y]=pos(i);return`<button class=opt data-o="${o}" style="position:absolute;left:${x-28}px;top:${y-28}px;width:56px!important;min-width:0!important;height:56px;padding:0;border-radius:50%;font-size:28px;box-sizing:border-box">${o}</button>`}).join('')}</div>
  <div class=rcbar><button class=ghost id=wh>🔊 Hear it</button><button class=btn id=wg>🎯 Give me a word</button></div><p class=mut id=wm style="text-align:center;font-size:20px"></p>`;
 $('#wb').onclick=e=>{e.preventDefault();wheel(el)};
 let cur='';$('#wh').onclick=()=>cur&&say(cur);
 $('#wg').onclick=()=>{goal=R(ons);$('#wm').textContent='Which letter makes “'+goal+rime+'”?';$('#wd').textContent='';say(goal+rime)};
 el.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const w=b.dataset.o+rime;cur=w;$('#wd').textContent=w;say(w);
  if(goal){if(b.dataset.o==goal){b.classList.add('ok');star();got++;$('#wm').textContent='🌟 Yes! '+w+'.'+(got?' ('+got+' found)':'');goal=null}else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),500);$('#wm').textContent='That makes “'+w+'”. Try another letter.'}}})}
A['wheel']=['Word Wheels',wheel,'🎡','Spin the wheel to make new words.'];
G.push(['Word Wheels','🎡',['wheel']]);BR['Word Wheels']=['🎡',['wheel']];
GR.find(g=>g[0]=='cvc')[3].push('Word Wheels');
})();