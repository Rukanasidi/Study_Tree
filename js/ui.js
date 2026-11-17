// App shell: sidebar, top bar, bottom tabs, search.
(()=>{const E=PT.esc,I={
grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
book:'<path d="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M8 9h6"/>',
cal:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
chart:'<path d="M5 20V10M12 20V4M19 20v-7"/>',
heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'};
const ni=n=>`<a class=ni href="#${n.id}" data-id="${n.id}"><svg viewBox="0 0 24 24">${I[n.icon]||''}</svg>${E(n.label)}</a>`;
$('#sb').innerHTML=`<div class=logo><svg viewBox="0 0 100 100"><circle cx="50" cy="38" r="36" fill="#F4C84E"/><rect x="43" y="66" width="14" height="28" rx="4" fill="#F4C84E"/></svg><span>${CONFIG.LOGO_LINES.map(E).join('<br>')}</span></div>${CONFIG.NAV.map(ni).join('')}<div class=sp></div>${CONFIG.NAV_BOTTOM.map(ni).join('')}`;
$('#top').innerHTML=`<button id=mb class=ghost aria-label="Menu">☰</button><div class=g><h1 id=gh></h1><div class=sub id=gs></div></div><input id=q type=search placeholder="Search activities" aria-label="Search activities"><span id=stars>⭐ 0</span><div class=pf><div class=av id=av></div><div class=who><b id=pn></b><div class=sub style="font-size:13px">Saved on this device</div></div></div>`;
$('#tabs').innerHTML=['home:Home','learn:Learn','progress:Progress','settings:Settings'].map(x=>{const[i,t]=x.split(':');return`<a href="#${i}" data-id="${i}">${t}</a>`}).join('');
PT.top=()=>{const n=(window.ptName&&ptName())||'Learner',kids=window.ptMode&&ptMode()=='kids',h=new Date().getHours();
 $('#gh').textContent=kids?`Hello, ${n}! 🌈`:`${h<12?'Good morning':h<18?'Good afternoon':'Good evening'}, ${n}!`;
 $('#gs').innerHTML=kids?'Ready to play?':'What do you want to <b>learn</b> today?';$('#pn').textContent=n;$('#av').textContent=n[0].toUpperCase()};
PT.nav=id=>{const k=id=='home'||id=='progress'||id=='settings'||id=='support'||id=='learn'?id:id=='cal'||/^cd\d+$/.test(id)?'cal':'learn';
 document.querySelectorAll('[data-id]').forEach(a=>a.classList.toggle('on',a.dataset.id==k));$('#sb').classList.remove('open')};
$('#q').oninput=e=>{const s=e.target.value.trim().toLowerCase();if(!s)return show();const st=$('#st'),m=Object.keys(A).filter(x=>!A[x][4]&&(A[x][0]+' '+A[x][3]).toLowerCase().includes(s));
 st.className='pg';st.innerHTML=PT.head('Search results')+(m.length?`<div class=hm>${m.map(x=>`<a href="#${x}"><span>${A[x][2]}</span>${E(A[x][0])}</a>`).join('')}</div>`:'<p class=mut>No matches.</p>')};
$('#mb').onclick=()=>$('#sb').classList.toggle('open');
document.addEventListener('click',e=>{if(!e.target.closest('#sb,#mb'))$('#sb').classList.remove('open')});
PT.top();
})();
