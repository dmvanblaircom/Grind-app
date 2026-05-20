const CACHE='forge-v2';
const ASSETS=['./', './index.html','./manifest.json','./icon-512.svg','./icon-192.svg','./apple-touch-icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(fresh=>{
      const copy=fresh.clone();
      caches.open(CACHE).then(c=>c.put('./index.html',copy));
      return fresh;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(cached=>{
    if(cached){
      fetch(req).then(fresh=>{if(fresh&&fresh.status===200)caches.open(CACHE).then(c=>c.put(req,fresh));}).catch(()=>{});
      return cached;
    }
    return fetch(req);
  }));
});
