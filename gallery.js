/* Loon Request Script: synthesize a local album page. */
(function () {
  let db = { version: 2, groups: [] };
  let failed = false;
  try {
    const raw = $persistentStore.read("ninemonsters.album.v2");
    if (raw) db = JSON.parse(raw);
    if (!db || !Array.isArray(db.groups)) throw new Error("Invalid data");
  } catch (error) {
    console.log("相册读取失败：" + (error && error.message ? error.message : String(error)));
    db = { version: 2, groups: [] };
    failed = true;
  }

  const payload = JSON.stringify(db)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  const html = `<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="referrer" content="no-referrer"><title>我的图片相册</title>
<style>
:root{color-scheme:light dark;font-family:system-ui,-apple-system,sans-serif}body{max-width:1000px;margin:auto;padding:20px;background:#15171b;color:#f2f2f2}header{display:flex;align-items:center;gap:16px;justify-content:space-between}h1{font-size:24px}button,input{font:inherit;border:1px solid #555;border-radius:10px;background:#252830;color:inherit;padding:10px}input{box-sizing:border-box;width:100%;margin:14px 0}p,time{color:#aaa}summary{cursor:pointer;padding:18px 0;overflow-wrap:anywhere}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}.grid a{display:block;aspect-ratio:1;background:#252830;border-radius:10px;overflow:hidden}.grid img{width:100%;height:100%;object-fit:cover}details{border-bottom:1px solid #34363b;padding-bottom:12px}dialog{border:0;padding:0;max-width:96vw;max-height:96vh;background:#15171b;color:white;border-radius:12px}dialog::backdrop{background:#000c}dialog img{display:block;max-width:94vw;max-height:78vh;object-fit:contain}.actions{display:flex;gap:16px;align-items:center;justify-content:space-between;padding:12px}.actions a{color:#b6d5ff}
</style>
<header><h1>我的图片相册</h1><button onclick="location.reload()">刷新</button></header>
<p id="stats"></p><input id="search" type="search" placeholder="按组名搜索" aria-label="按组名搜索">
<main id="groups"></main><dialog id="viewer"><img id="full" alt="原图"><div class="actions"><a id="original" target="_blank" rel="noopener noreferrer">打开原图</a><button id="close">关闭</button></div></dialog>
<script>
const db=${payload};
const prefix='https://cdn.ninemonsters.com/images/album/private/';
const groups=db.groups.slice().sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
const total=groups.reduce((n,g)=>n+(Array.isArray(g.images)?g.images.length:0),0);
document.getElementById('stats').textContent=${failed}?'读取相册失败，请查看 Loon 日志。':groups.length+' 组 · '+total+' 张。抓取后点刷新查看；图片由原 CDN 加载。';
const root=document.getElementById('groups');
const viewer=document.getElementById('viewer');
document.getElementById('close').onclick=()=>viewer.close();
function render(){
  root.replaceChildren();
  const term=document.getElementById('search').value.toLocaleLowerCase();
  const shown=groups.filter(g=>String(g.name||'').toLocaleLowerCase().includes(term));
  if(!shown.length){root.textContent=groups.length?'没有匹配的分组':'还没有图片。请先打开目标 App，加载图片列表后回来刷新。';return;}
  shown.forEach(g=>{
    const section=document.createElement('details');
    const summary=document.createElement('summary');
    summary.textContent=g.name+' · '+g.images.length+' 张 · '+new Date(g.updatedAt).toLocaleString();
    section.append(summary);
    section.addEventListener('toggle',()=>{
      if(!section.open||section.dataset.built)return;
      section.dataset.built='yes';
      const grid=document.createElement('div');grid.className='grid';
      g.images.slice().reverse().forEach(item=>{
        const url=prefix+encodeURIComponent(item.id).replace(/%2F/g,'/');
        const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';
        const img=document.createElement('img');img.src=url;img.alt=g.name;img.loading='lazy';img.decoding='async';
        img.onerror=()=>{img.alt='图片加载失败，点击打开原图';};
        link.append(img);link.onclick=event=>{
          if(typeof viewer.showModal!=='function')return;
          event.preventDefault();document.getElementById('full').src=url;
          document.getElementById('original').href=url;viewer.showModal();
        };grid.append(link);
      });section.append(grid);
    });root.append(section);
  });
}
document.getElementById('search').addEventListener('input',render);render();
</script></html>`;

  $done({ response: {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src https://cdn.ninemonsters.com; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
    },
    body: html
  } });
})();

