import { FRAME_CONTEXT } from './assets/hexad/storyboard/frame-context.js';
const app=document.querySelector('#hx71');
const rail=document.querySelector('#hx82-film-rail');
const play=document.querySelector('#hx82-rail-play');
const inspect=document.querySelector('#hx82-rail-inspect');
const lens=document.querySelector('#hx82-rail-lens');
const compare=document.querySelector('#hx82-rail-compare');
const lensPanel=document.querySelector('#hx82-lens-panel');
const lensClose=document.querySelector('#hx82-lens-close');
const lensGrid=document.querySelector('#hx82-lens-grid');
const lensContext=document.querySelector('#hx82-lens-context');
const lensDetail=document.querySelector('#hx82-lens-detail p');
const actLabel=document.querySelector('#hx82-rail-act');
const frameLabel=document.querySelector('#hx82-rail-frame');
const range=document.querySelector('#hx71-frame-scrub');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const acts=[
['O VAZIO','A imagem constrói a origem antes que a informação tenha forma.','O vazio é o estado anterior à definição.'],
['O NASCIMENTO','O fragmento encontra estrutura e passa a carregar possibilidade.','A informação ganha contexto, conexões e reconhecimento.'],
['AS SEIS FORÇAS','A mesma informação passa a depender de seis condições.','As propriedades são condições do mesmo sistema.'],
['O EQUILÍBRIO','A estabilidade existe, mas pode oscilar sem romper de imediato.','Uma pequena diferença pode mudar o caminho.'],
['A AMEAÇA','O sistema observa uma aproximação e uma assinatura que não corresponde.','Acesso, identidade e confiança tornam-se acontecimentos.'],
['O COLAPSO','Uma propriedade falha e o impacto se espalha pela arquitetura.','O sistema não explode: perde coerência, função e confiança.'],
['A INVESTIGAÇÃO','O dano passa a ser tratado como evidência.','Comparação, rastros e estados reduzem a incerteza.'],
['A RESTAURAÇÃO','O sistema reconstrói capacidade sem apagar o histórico.','Detectar, isolar, reparar, verificar, restaurar e estabilizar.'],
['A SÍNTESE','As relações retornam ao equilíbrio com compreensão maior.','A informação permanece viva porque as seis condições funcionam em relação.']];
const props=[['Confidencialidade','somente quem deve ver alcança a informação'],['Posse / Controle','a informação permanece sob controle legítimo'],['Integridade','o conteúdo continua correto'],['Autenticidade','a origem continua verificável'],['Disponibilidade','a informação é alcançável quando necessária'],['Utilidade','o dado continua cumprindo seu propósito']];
const getId=()=>Number(range?.value||1); const getCtx=()=>FRAME_CONTEXT.find(x=>x.id===getId())||FRAME_CONTEXT[0];
function update(){const c=getCtx(),a=acts[c.chapter]||acts[0]; actLabel.textContent=`ATO ${String(c.chapter+1).padStart(2,'0')} · ${a[0]}`; frameLabel.textContent=`${String(c.id).padStart(3,'0')} / 098`; play.textContent=document.body.classList.contains('hx71-film-mode')?'Ⅱ':'▶'; if(document.body.classList.contains('hx71-film-mode')) rail.classList.add('is-visible'); else rail.classList.remove('is-visible');}
function openLens(){const c=getCtx(),a=acts[c.chapter]||acts[0]; lensContext.textContent=`${a[1]} · ${c.title}`; lensGrid.innerHTML=''; props.forEach(([n,desc])=>{const b=document.createElement('button');b.type='button';b.className='hx82-lens-chip';b.innerHTML=`<span>${n}</span><small>${desc}</small>`;b.onclick=()=>{lensGrid.querySelectorAll('button').forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');lensDetail.textContent=`${n}: ${desc}. ${a[2]}`};lensGrid.appendChild(b)});lensGrid.querySelector('button')?.classList.add('is-active');lensDetail.textContent=a[2];lensPanel.classList.add('is-open');lensPanel.setAttribute('aria-hidden','false');lensClose.focus();}
function closeLens(){lensPanel.classList.remove('is-open');lensPanel.setAttribute('aria-hidden','true');lens.focus();}
play?.addEventListener('click',()=>document.querySelector('#hx71-film')?.click());
inspect?.addEventListener('click',()=>{
  const id=getId();
  if(window.__hexadUX?.inspectFrame) window.__hexadUX.inspectFrame(id);
  else document.querySelector('#hx71-frame-current')?.click();
});
compare?.addEventListener('click',()=>{
  const id=getId();
  if(window.__hexadUX?.compareFrame) window.__hexadUX.compareFrame(id);
  else document.querySelector('#hx71-frame-current')?.click();
});
lens?.addEventListener('click',openLens);
lensClose?.addEventListener('click',closeLens);
let sx=0,sy=0; app.addEventListener('touchstart',e=>{if(!document.body.classList.contains('hx71-film-mode'))return;const t=e.changedTouches[0];sx=t.clientX;sy=t.clientY},{passive:true});
app.addEventListener('touchend',e=>{if(!document.body.classList.contains('hx71-film-mode'))return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.2)return;const n=Math.max(1,Math.min(98,getId()+(dx<0?1:-1)));range.value=String(n);range.dispatchEvent(new Event('input',{bubbles:true}));},{passive:true});
let raf=0;
function scheduleUpdate(){
  if(raf)return;
  raf=requestAnimationFrame(()=>{raf=0;update()});
}
const mo=new MutationObserver(scheduleUpdate);
mo.observe(document.body,{attributes:true,attributeFilter:['class']});
window.addEventListener('scroll',scheduleUpdate,{passive:true});
window.addEventListener('resize',scheduleUpdate,{passive:true});
window.addEventListener('load',scheduleUpdate,{once:true});
update();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lensPanel.classList.contains('is-open'))closeLens(); if((e.key==='l'||e.key==='L')&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){e.preventDefault();openLens();}});
