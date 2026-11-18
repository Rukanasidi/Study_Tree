// Offline cache. Change V whenever you update any file, so users get the new version.
const V='pt-v12',F=['./','index.html','css/base.css','css/theme.css','js/config.js','js/core.js','js/activities.js','js/curriculum.js','js/nav.js','js/calendar.js','js/reading-data.js','js/reading.js','js/progress.js','js/settings.js','js/dashboard.js','js/ui.js','js/maths.js','js/maths2.js','js/maths3.js','js/maths4.js','js/maths5.js','js/maths6.js','js/pics.js','js/app.js','manifest.json','icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(F))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{if(e.request.method!='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
