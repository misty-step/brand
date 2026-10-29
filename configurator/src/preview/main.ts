import './base.css';
import type { Layer, MarkOption, TypeOption, ColorOption, LayoutOption, HeroOption, MotionOption, CopyOption, MotionCtx, Ctx } from '../contract';
import { LAYERS, loadOption } from '../options';
import { decode, encode, type LabState } from '../state';
import { esc } from '../html';
import { render } from './render';
import { MotionLifecycle } from './motion';
let state=decode(location.hash), serial=0, motion:MotionLifecycle|undefined, entrances:IntersectionObserver|undefined, disposeMark:(()=>void)|undefined;
let current:{mark:MarkOption;type:TypeOption;color:ColorOption;layout:LayoutOption;hero:HeroOption;motion:MotionOption;copy:CopyOption}|undefined;
const root=document.documentElement;
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') parent.postMessage({ type: 'lab:exit-full' }, location.origin);
});
history.scrollRestoration = 'manual';
function style(id:string,css:string){let el=document.getElementById(id) as HTMLStyleElement|null;if(!el){el=document.createElement('style');el.id=id;document.head.append(el);}el.textContent=css;}
function context():Ctx {return {page:state.page,theme:state.theme,reducedMotion:state.reducedMotion,viewport:innerWidth<=700?'phone':'desktop'};}
function motionContext():MotionCtx {const css=getComputedStyle(root),value=(v:string)=>css.getPropertyValue(v).trim();return {...context(),dprCap:1.5,colors:{bg:value('--bg'),ink:value('--ink'),accent:value('--accent'),field1:value('--field-1'),field2:value('--field-2'),field3:value('--field-3')}};}
function updateMark(){if(!current)return;const mark=current.mark as MarkOption & {css?:string};style('lab-mark',mark.css??'');const css=getComputedStyle(root);const svg=mark.svg({size:16,title:current.copy.pages[state.page].brand}).replace(/currentColor/g,css.getPropertyValue('--ink').trim()).replace(/var\((--[\w-]+)\)/g,(_,name:string)=>css.getPropertyValue(name).trim());let icon=document.querySelector<HTMLLinkElement>('link[rel="icon"]');if(!icon){icon=document.createElement('link');icon.rel='icon';icon.type='image/svg+xml';document.head.append(icon);}icon.href='data:image/svg+xml,'+encodeURIComponent(svg);}
function applyTheme(){if(!current)return;root.dataset.theme=state.theme;root.dataset.reducedMotion=state.reducedMotion?'1':'0';root.dataset.paused=state.paused?'1':'0';for(const [k,v] of Object.entries(current.color[state.theme]))root.style.setProperty(k,v);document.querySelector('meta[name="theme-color"]')?.setAttribute('content',getComputedStyle(root).getPropertyValue('--bg').trim());document.querySelector('.theme-toggle')?.setAttribute('aria-label','Switch to '+(state.theme==='dark'?'light':'dark')+' theme');const b=document.querySelector<HTMLButtonElement>('.motion-toggle');if(b){b.textContent=state.paused?'Resume motion':'Pause motion';b.setAttribute('aria-pressed',String(state.paused));}motion?.update(motionContext());motion?.pause(state.paused);if(state.reducedMotion)document.querySelectorAll('[data-enter]').forEach(el=>el.classList.add('is-in'));}
function publish(){updateMark();(window as unknown as {__LAB__:unknown}).__LAB__={ready:true,state,ids:state.picks};parent.postMessage({type:'lab:state',state},location.origin);}
function change(next:LabState){state=next;localStorage.setItem('lab-motion-paused',String(state.paused));history.replaceState(null,'',encode(state));applyTheme();publish();}
async function mount() {
  const ticket = ++serial;
  const loaded = await Promise.all(LAYERS.map(layer => loadOption(layer, state.picks[layer])));
  if (ticket !== serial) return;
  motion?.destroy();
  motion = undefined;
  entrances?.disconnect();
  disposeMark?.();
  disposeMark = undefined;
  current = Object.fromEntries(loaded.map(option => [option.layer, option])) as typeof current;
  const options = current!;
  for (const layer of LAYERS) root.dataset[layer] = state.picks[layer];
  root.dataset.page = state.page;
  for (const [key, value] of Object.entries(options.type.tokens)) root.style.setProperty(key, value);
  style('lab-fonts', options.type.faces.map(face => `@font-face{font-family:${JSON.stringify(face.family)};src:url(${JSON.stringify(face.src)}) format('woff2');font-weight:${face.weight};font-style:${face.style ?? 'normal'};font-display:swap;${face.unicodeRange ? 'unicode-range:' + face.unicodeRange + ';' : ''}}`).join('\n'));
  style('lab-layout', options.layout.css);
  style('lab-hero', options.hero.css);
  style('lab-motion', options.motion.entrance.css + '\n' + (options.motion.interaction?.css ?? ''));
  const page = options.copy.pages[state.page];
  document.title = page.brand + ' · Brand preview';
  const ctx = {
    ...context(), brand: page.brand, content: page.hero,
    mark: (size: number) => options.mark.svg({ size, title: page.brand }),
    wordmark: () => options.mark.wordmark?.({ name: page.brand }) ?? esc(page.brand),
  };
  document.body.id = 'top';
  document.body.innerHTML = render(page, options.hero, ctx, options.mark);
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  applyTheme();
  motion = new MotionLifecycle(options.motion, options.hero, motionContext(), state.paused);
  if (!state.reducedMotion && !state.paused && options.mark.animateIn) {
    disposeMark = options.mark.animateIn(document.querySelector('.brand-mark')!, context());
  }
  entrances = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      entrances?.unobserve(entry.target);
    }
  }), { threshold: .05 });
  document.querySelectorAll('[data-enter]').forEach(element => {
    if (state.reducedMotion || state.paused) element.classList.add('is-in');
    else entrances?.observe(element);
  });
  publish();
}
window.addEventListener('hashchange',()=>{const next=decode(location.hash);const rerender=state.page!==next.page||LAYERS.some(l=>state.picks[l]!==next.picks[l]);state=next;if(rerender)void mount();else{applyTheme();publish();}});
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.data?.type!=='lab:update')return;location.hash=encode(event.data.state);});
document.addEventListener('click',async event=>{const el=event.target as Element;if(el.closest('.theme-toggle')){change({...state,theme:state.theme==='dark'?'light':'dark'});return;}if(el.closest('.motion-toggle')){change({...state,paused:!state.paused});return;}const anchor=el.closest<HTMLAnchorElement>('a[href^="#"]');if(anchor){event.preventDefault();const id=anchor.getAttribute('href')!.slice(1);document.getElementById(id)?.scrollIntoView({behavior:'instant'});if(id==='main')document.getElementById(id)?.focus({preventScroll:true});return;}const tab=el.closest<HTMLButtonElement>('[role="tab"]');if(tab){const section=tab.closest('.s-install')!;section.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach(b=>{const on=b===tab;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;document.getElementById(b.getAttribute('aria-controls')!)!.hidden=!on;});return;}const button=el.closest<HTMLButtonElement>('.copy');if(button){try{await navigator.clipboard.writeText(button.parentElement!.querySelector('code')!.textContent!);button.textContent='Copied';}catch{button.textContent='Select the command to copy';}}});
document.addEventListener('keydown',event=>{const el=event.target as HTMLElement;if(el.getAttribute('role')!=='tab'||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=[...el.parentElement!.querySelectorAll<HTMLButtonElement>('[role="tab"]')];const i=tabs.indexOf(el as HTMLButtonElement);const n=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].click();tabs[n].focus();});
window.addEventListener('pagehide',()=>{motion?.destroy();entrances?.disconnect();disposeMark?.();});
void mount().catch(error=>{console.error(error);document.body.innerHTML='<p>The preview could not load. Choose another combination in the lab.</p>';});
