const GR=[['letters','🔤','Letters & Sounds',['Letter Sounds','Letter Families']],['cvc','🌱','CVC Words',['CVC Words','CVC Booklet','Phase 2 Booklet']],['tricky','⭐','Tricky Words',['High Frequency Words','Exception Words']],['days','📅','Everyday Words',['Days of the Week']]];
const BR=Object.fromEntries(G.map(([n,i,k])=>[n,[i,k]])),GI=id=>GR.find(g=>g[0]==id),grOf=id=>{const b=G.find(b=>b[2].includes(id));return b&&GR.find(g=>g[3].includes(b[0]))};

// Group page: the activities inside one topic.
function grp(el,g){el.innerHTML=`<p class=mut style="font-size:15px"><a href="#learn">My learning</a> › ${g[2]}</p><h1 class=pt>${g[1]} ${g[2]}</h1>${g[3].map(bn=>{const[bi,bk]=BR[bn];return `<h3>${bi} ${bn}</h3><div class=hm>${bk.map(x=>`<a href="#${x}"><span>${A[x][2]}</span>${A[x][0]}</a>`).join('')}</div>`}).join('')}`}
// Router. A[id]=[title, render, icon, description, 'page'?]. Entries marked 'page' render full-width with their own heading.
function show(){const id=location.hash.slice(1)||'home',a=A[id]||dayA(id),g=!a&&id.startsWith('g-')&&GI(id.slice(2)),st=$('#st');
 $('#q').value='';
 if(a&&a[4]=='page'){st.className='pg';a[1](st)}
 else if(a){st.className='act';const gr=grOf(id),b=G.find(b=>b[2].includes(id));
  st.innerHTML=`<p class=mut style="font-size:15px">${gr?`<a href="#learn">My learning</a> › <a href="#g-${gr[0]}">${gr[2]}</a> › ${b[0]}`:id=='cal'?'<a href="#home">Dashboard</a>':'<a href="#cal">Calendar</a>'}</p><h2>${a[2]} ${a[0]}</h2><p class=mut>${a[3]}</p><div id=ac></div>`;a[1]($('#ac'))}
 else if(g){st.className='pg';grp(st,g)}
 else{location.hash='home';return}
 PT.nav(id);$('main').scrollTop=0}
