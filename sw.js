// アプリ本体は最新を優先し、オフライン時のみキャッシュを利用します。
const CACHE='quiet-camera-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('quiet-camera-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});}
      return response;
    }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
  }else{
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
  }
});
