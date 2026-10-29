import { chromium } from 'playwright';
import { createServer } from 'vite';
import { preview } from 'vite';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const layers=['mark','type','color','layout','hero','motion','copy'];
const inventory=[];
for(const layer of layers) for(const entry of await readdir(path.join(root,'options',layer),{withFileTypes:true})) if(entry.isDirectory()) {try{await readdir(path.join(root,'options',layer,entry.name));const entries=await readdir(path.join(root,'options',layer,entry.name));if(entries.includes('index.ts'))inventory.push({layer,id:entry.name});}catch{}}
const external=process.env.LAB_URL;
const server=external?null:await preview({root,preview:{host:'127.0.0.1',port:4177,strictPort:true}});
const base=external??'http://127.0.0.1:4177';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const results=[];
const instrument=()=>{
  window.__draws=0;
  const original=HTMLCanvasElement.prototype.getContext;
  const seen=new WeakSet();
  HTMLCanvasElement.prototype.getContext=function(...args){const context=original.apply(this,args);if(context&&!seen.has(context)){seen.add(context);for(const name of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced','clear','clearRect','fillRect','drawImage','fill','stroke','putImageData'])if(typeof context[name]==='function'){const fn=context[name];context[name]=function(...xs){if(this.canvas?.isConnected)window.__draws++;return fn.apply(this,xs);};}}return context;};
};
try {
 for(const option of inventory) for(const pageName of ['studio','stack']) for(const width of [390,1440]) for(const theme of ['light','dark']) for(const reduced of option.layer==='motion'?[false,true]:[false]) {
  const label=`${option.layer}/${option.id} ${pageName} ${width} ${theme}${reduced?' reduced':''}`;
  const context=await browser.newContext({viewport:{width,height:width===390?844:900},deviceScaleFactor:width===390?2:1,isMobile:width===390,hasTouch:width===390,colorScheme:theme,reducedMotion:reduced?'reduce':'no-preference'});
  await context.addInitScript(instrument);
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const state={v:1,page:pageName,theme,reducedMotion:reduced,paused:false,picks:Object.fromEntries(layers.map(l=>[l,l===option.layer?option.id:'baseline-'+l])),locks:[]};
  let failure;
  try {
   await page.goto(base+'/preview.html#'+encodeURIComponent(JSON.stringify(state)),{waitUntil:'networkidle'});
   await page.waitForFunction(()=>window.__LAB__?.ready,{timeout:15000});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(180);
   const shape=await page.evaluate(()=>({h1:document.querySelectorAll('h1.hero-title').length,overflow:document.documentElement.scrollWidth>innerWidth+1,width:document.documentElement.scrollWidth,viewport:innerWidth,canvases:document.querySelectorAll('canvas').length}));
   if(shape.h1!==1)errors.push('Expected one h1.hero-title, got '+shape.h1);
   if(shape.overflow)errors.push(`Horizontal overflow: ${shape.width} > ${shape.viewport}`);
   if(reduced){const before=await page.evaluate(()=>window.__draws);await page.waitForTimeout(250);const after=await page.evaluate(()=>window.__draws);if(after!==before)errors.push(`Reduced motion still draws: ${after-before} calls`);}
   await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
   await page.waitForTimeout(160);
   const offscreen=await page.evaluate(()=>{const r=document.querySelector('[data-hero-root]').getBoundingClientRect();return r.bottom<=0||r.top>=innerHeight;});
   const before=await page.evaluate(()=>window.__draws);await page.waitForTimeout(250);const after=await page.evaluate(()=>window.__draws);
   if(offscreen&&after!==before)errors.push(`Offscreen motion still draws: ${after-before} calls`);
   failure=errors.length?errors:undefined;
  } catch(error){failure=[...errors,error.message];}
  results.push({label,pass:!failure,...(failure?{errors:failure}:{})});
  console.log((failure?'FAIL ':'PASS ')+label+(failure?' '+failure.join('; '):''));
  await context.close();
 }
 // The shell itself must stay keyboard-operable, shareable, and fit its viewport.
 const shell=await browser.newPage({viewport:{width:1440,height:900}}),shellErrors=[];
 shell.on('pageerror',e=>shellErrors.push(e.message));
 await shell.goto(base,{waitUntil:'networkidle'});await shell.waitForFunction(()=>window.__LAB__?.ready);
 await shell.locator('[data-action="save"]').click();await shell.locator('[data-action="save"]').click();await shell.locator('[data-action="shortlist"]').click();
 const boxes=shell.locator('[data-compare]');await boxes.nth(0).check();await boxes.nth(1).check();await shell.locator('[data-action="compare"]').click();
 if(await shell.locator('.compare-item').count()!==2)shellErrors.push('Compare did not render two saved combinations');
 await shell.keyboard.press('Escape');await shell.locator('[data-action="spec"]').click();if(!await shell.locator('#panel').isVisible())shellErrors.push('Spec panel not opened');await shell.keyboard.press('Escape');
 const overflow=await shell.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(overflow)shellErrors.push('Shell horizontal overflow at 1440');
 const composition=await shell.evaluate(()=>({desktop:document.querySelector('.desktop .frame-window').getBoundingClientRect().width,viewport:innerWidth}));
 if(composition.desktop<composition.viewport*.65)shellErrors.push(`Desktop preview too small: ${composition.desktop}/${composition.viewport}`);
 await shell.locator('.head-actions [data-action="full"]').click();
 if(await shell.locator('.rail').isVisible())shellErrors.push('Full preview did not hide controls');
 await shell.keyboard.press('Escape');
 const desktopHandle=await shell.locator('#desktop').elementHandle(),desktopFrame=await desktopHandle.contentFrame();
 await desktopFrame.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
 await shell.locator('[data-page="stack"]').click();
 await desktopFrame.waitForFunction(()=>document.documentElement.dataset.page==='stack'&&window.__LAB__?.ready);
 if(await desktopFrame.evaluate(()=>scrollY)!==0)shellErrors.push('Changed page did not start at the top');
 await shell.locator('[data-page="studio"]').click();
 await desktopFrame.waitForFunction(()=>document.documentElement.dataset.page==='studio'&&window.__LAB__?.ready);
 await mkdir(path.join(root,'evidence'),{recursive:true});
 await shell.screenshot({path:path.join(root,'evidence','shell-1440.png'),timeout:20000});
 results.push({label:'shell shortlist + compare + spec',pass:shellErrors.length===0,...(shellErrors.length?{errors:shellErrors}:{})});
} finally {await browser.close();await server?.close();}
const failed=results.filter(r=>!r.pass);
const summary={at:new Date().toISOString(),base,chrome:'Dedicated Google Chrome with SwiftShader, never the relay',inventory,states:results.length,passed:results.length-failed.length,failed:failed.length,results};
await mkdir(path.join(root,'evidence'),{recursive:true});await writeFile(path.join(root,'evidence','smoke.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({states:summary.states,passed:summary.passed,failed:summary.failed,inventory:inventory.length}));
if(failed.length)process.exitCode=1;
