// Comfort settings: name, look, text size, speech speed, motion.
(()=>{const K='pp-settings';let S={name:'',mode:'adult',size:18,speed:.8,theme:'auto',calm:false};
try{S=Object.assign(S,JSON.parse(localStorage.getItem(K))||{})}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
function apply(){const h=document.documentElement;h.dataset.mode=S.mode;S.theme=='auto'?h.removeAttribute('data-theme'):h.dataset.theme=S.theme;h.style.setProperty('--fs',S.size+'px');h.classList.toggle('calm',S.calm);window.SPEED=S.speed;save();PT.top&&PT.top()}
window.ptMode=()=>S.mode;window.ptName=()=>S.name;
function view(el){const o=(k,v,t)=>`<button class="chip ${S[k]==v?'on':''}" data-k=${k} data-v="${v}">${t}</button>`;
 el.innerHTML=PT.head('Settings','Make learning comfortable for you.')+`<div class=panel><h3>Your name</h3><input id=nm class=fld maxlength=24 placeholder="Learner" value="${PT.esc(S.name)}"><h3>Look</h3><div class=chips>${o('mode','adult','Adult (calm)')}${o('mode','kids','Kids (playful)')}</div><div class=chips>${o('theme','auto','Auto')}${o('theme','light','Light')}${o('theme','dark','Dark')}</div><h3>Text size</h3><div class=chips>${o('size',16,'Smaller')}${o('size',18,'Normal')}${o('size',22,'Larger')}${o('size',26,'Largest')}</div><h3>Speech speed</h3><div class=chips>${o('speed',.6,'Slow')}${o('speed',.8,'Normal')}${o('speed',1,'Faster')}</div><h3>Motion</h3><div class=chips>${o('calm',false,'Normal')}${o('calm',true,'Calm (no shaking)')}</div></div>`;
 el.oninput=e=>{if(e.target.id=='nm'){S.name=e.target.value.slice(0,24);save();PT.top&&PT.top()}};
 el.onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k,v=b.dataset.v;S[k]=v=='true'?true:v=='false'?false:isNaN(v)?v:+v;apply();view(el)}}
A.settings=['Settings',view,'⚙️','','page'];apply();
})();
