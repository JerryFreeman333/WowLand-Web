import { createRequire } from 'node:module';
import path from 'node:path';
const require=createRequire(import.meta.url);
const { chromium }=require('/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright/index.js');
const root='/Users/jerryzheng/Desktop/WowLand网站设计/wowland-neon';
const browser=await chromium.launch({headless:true, executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const url='file:///Users/jerryzheng/Desktop/WowLand%E7%BD%91%E7%AB%99%E8%AE%BE%E8%AE%A1/wowland-neon/index.html';
for(const [name,width,height,mobile] of [['desktop',1440,960,false],['tablet',900,1000,false],['mobile',390,844,true]]){
 const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:mobile?2:1,isMobile:mobile,hasTouch:mobile});
 const page=await ctx.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto(url,{waitUntil:'networkidle',timeout:60000});
 // Disable smooth scrolling so programmatic scroll actually moves the viewport and triggers IntersectionObserver.
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
 // Scroll through the page to trigger all reveal animations.
 await page.evaluate(async()=>{for(let y=0;y<=document.body.scrollHeight;y+=Math.round(innerHeight*.6)){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}scrollTo(0,0)});
 // Wait for reveal transitions (0.95s max + up to 0.18s stagger) to finish.
 await page.waitForTimeout(1800);
 const motion=await page.evaluate(()=>{
   const rev=[...document.querySelectorAll('.reveal')];
   return {reveal:rev.length,entered:rev.filter(e=>e.classList.contains('in')).length,
           fxDone:rev.filter(e=>e.classList.contains('fx-done')).length,
           ticker:!!document.querySelector('.ticker'),
           circuit:!!document.querySelector('.hero-circuit'),
           corners:document.querySelectorAll('.cyber-corners').length,
           cursorReady:document.body.classList.contains('cursor-ready'),
           hud:!!document.querySelector('.hud-status'),
           sectors:document.querySelectorAll('.sector-art').length,
           logWave:document.querySelectorAll('#logWave i').length,
           cardFx:document.querySelectorAll('.card-fx').length};
 });
 console.log('motion:',JSON.stringify(motion));
 // Force-decode every image so full-page captures never miss a raster.
 await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
 await page.waitForTimeout(200);
 await page.screenshot({path:path.join(root,'screenshots',`${name}-hero.png`)});
 if(name==='desktop'){
   await page.locator('.qr-open').first().click();
   await page.waitForTimeout(2000);
   await page.screenshot({path:path.join(root,'screenshots','desktop-qr.png')});
   await page.keyboard.press('Escape');
   await page.waitForTimeout(300);
 }
 await page.locator('#brands').scrollIntoViewIfNeeded();await page.waitForTimeout(700);await page.screenshot({path:path.join(root,'screenshots',`${name}-brands.png`)});
 // Mobile full-page captures exceed Chromium's texture height at DPR 2; use a 1x pass below.
 if(!mobile) await page.screenshot({path:path.join(root,'screenshots',`${name}.png`),fullPage:true});
 const dbg=await page.evaluate(()=>({body:document.body.className,brand:document.querySelectorAll('#brandWrap .brand-card').length,path:document.querySelectorAll('.step').length,site:!!window.SITE,materials:document.querySelectorAll('#materialWrap .material').length,docs:document.querySelectorAll('#docWrap .doc').length,imgOk:[...document.querySelectorAll('#materialWrap img')].map(i=>i.naturalWidth), dataErr:window.__dataError||null}));
 console.log(name,errors,JSON.stringify(dbg));
 await ctx.close();
}
// Full-page mobile preview at 1x avoids the >16384px screenshot-stitch artifact.
{
 const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const page=await ctx.newPage();
 await page.goto(url,{waitUntil:'networkidle',timeout:60000});
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
 await page.evaluate(async()=>{for(let y=0;y<=document.body.scrollHeight;y+=Math.round(innerHeight*.6)){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}scrollTo(0,0)});
 await page.waitForTimeout(1800);
 await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
 await page.screenshot({path:path.join(root,'screenshots','mobile.png'),fullPage:true});
 await ctx.close();
}
await browser.close();
