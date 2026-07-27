import { chromium } from 'playwright-core';
const base='http://localhost:4173/kids-stuff/#/make';
const want=process.argv.slice(2);
const b=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
for (const name of want) {
  const p=await b.newPage({viewport:{width:1280,height:1050}});
  await p.goto(base,{waitUntil:'networkidle'}).catch(()=>{});
  await p.waitForTimeout(1500);
  try {
    await p.getByRole('button',{name:new RegExp('Open '+name,'i')}).click({timeout:8000});
    await p.waitForTimeout(1200);
    await p.screenshot({path:`/tmp/uxshots/tool-${name.toLowerCase().replace(/[^a-z]+/g,'-')}.png`});
    console.log('shot', name);
  } catch(e){ console.log('skip', name, e.message.slice(0,60)); }
  await p.close();
}
await b.close();
