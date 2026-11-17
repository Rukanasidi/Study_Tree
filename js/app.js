// Start-up.
addEventListener('pointerdown',()=>{try{speechSynthesis.speak(new SpeechSynthesisUtterance(''))}catch(e){}},{once:true});
addEventListener('hashchange',show);
upd();show();
if('serviceWorker' in navigator&&location.protocol!='file:')navigator.serviceWorker.register('sw.js');
