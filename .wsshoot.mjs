import { chromium } from 'playwright-core';
const base='http://localhost:4173/kids-stuff/';
const b=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage({viewport:{width:1280,height:1000}});
await p.goto(base+'#/make',{waitUntil:'networkidle'}).catch(()=>{});
await p.waitForTimeout(1800);
await p.screenshot({path:'/tmp/uxshots/ws-bench.png'});
console.log('shot bench');
try{
  await p.getByRole('button',{name:/Open The Number Mill/i}).click({timeout:8000});
  await p.waitForTimeout(800);
  // bolt a couple of blocks so the stage has something in it
  await p.getByRole('button',{name:'times',exact:true}).click(); await p.waitForTimeout(300);
  await p.getByRole('button',{name:'add',exact:true}).click(); await p.waitForTimeout(600);
  await p.screenshot({path:'/tmp/uxshots/ws-mill.png'}); console.log('shot mill');
}catch(e){ console.log('mill skip:', e.message.slice(0,90)); }
await b.close();
