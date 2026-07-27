import { chromium } from 'playwright-core';
const b=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
for (const name of process.argv.slice(2)) {
  const p=await b.newPage({viewport:{width:1280,height:1050}});
  await p.goto('http://localhost:4173/kids-stuff/#/play',{waitUntil:'networkidle'}).catch(()=>{});
  await p.waitForTimeout(1400);
  try{
    await p.getByRole('button',{name:new RegExp('Play '+name,'i')}).click({timeout:8000});
    await p.waitForTimeout(1600);
    await p.screenshot({path:`/tmp/uxshots/sel-${name.toLowerCase().replace(/[^a-z]+/g,'-')}.png`});
    console.log('shot',name);
  }catch(e){ console.log('skip',name,e.message.slice(0,60)); }
  await p.close();
}
await b.close();
