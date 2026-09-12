(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const path = location.pathname.toLowerCase();
  const page = path.includes('playbook') ? 'playbook'
    : path.includes('laboratorio') ? 'laboratorio'
    : path.includes('privacidade') ? 'privacidade'
    : path.includes('cadeia') ? 'cadeia'
    : path.includes('radar') ? 'radar'
    : path.includes('index') || path.endsWith('/') ? 'home'
    : 'home';

  const data = {
    home: {
      eyebrow:'00 / PORTAL CYBERSHIELD', title:'Entre no <em>universo.</em>',
      body:'Uma cidade digital viva. Cinco caminhos conduzem a diferentes formas de perceber, proteger e responder.',
      image:'cybershield-city.jpg', audio:'cybershield-home.mp3',
      chips:[['RADAR','radar.html'],['PLAYBOOK','playbook.html'],['LABORATÓRIO','laboratorio.html'],['PRIVACIDADE','privacidade.html'],['CADEIA','cadeia-ataque.html']],
      spots:[
        {x:24,y:55,n:'01',t:'RADAR',d:'Observe sinais antes de transformar ruído em alarme.',href:'radar.html'},
        {x:42,y:40,n:'02',t:'PLAYBOOK',d:'Transforme conhecimento em protocolo.',href:'playbook.html'},
        {x:62,y:57,n:'03',t:'LABORATÓRIO',d:'Manipule evidências e teste suas decisões.',href:'laboratorio.html'},
        {x:76,y:35,n:'04',t:'PRIVACIDADE',d:'Acompanhe a vida de um dado do nascimento ao fim.',href:'privacidade.html'},
        {x:87,y:65,n:'05',t:'CADEIA DE ATAQUE',d:'Encontre o ponto em que o movimento pode ser interrompido.',href:'cadeia-ataque.html'}
      ]
    },
    playbook: {
      eyebrow:'02 / ARQUIVO VIVO', title:'Conhecimento em <em>movimento.</em>',
      body:'Os princípios deixam de ser uma lista. Eles circulam como protocolos que podem ser interrompidos, examinados e incorporados.',
      image:'cybershield-archive.jpg', audio:'cybershield-playbook.mp3',
      spots:[
        {x:32,y:26,n:'GV',t:'GOVERNAR',d:'Decidir responsabilidades, políticas e prioridades.'},
        {x:67,y:24,n:'ID',t:'IDENTIFICAR',d:'Entender ativos, riscos, pessoas e contexto.'},
        {x:26,y:61,n:'PR',t:'PROTEGER',d:'Reduzir exposição com controles concretos.'},
        {x:72,y:61,n:'DE',t:'DETECTAR',d:'Perceber sinais e desvios relevantes.'},
        {x:43,y:79,n:'RS',t:'RESPONDER',d:'Conter, comunicar e preservar evidências.'},
        {x:64,y:82,n:'RC',t:'RECUPERAR',d:'Restaurar confiança, operação e aprendizado.'}
      ]
    },
    laboratorio: {
      eyebrow:'02 / MESA DE EVIDÊNCIAS', title:'Não leia o caso.<br><em>Toque nele.</em>',
      body:'A imagem vira cenário: evidências, dispositivo, mensagem e origem ocupam o mesmo campo de investigação.',
      image:'cybershield-laboratorio.jpg', audio:'cybershield-laboratorio.mp3',
      spots:[
        {x:24,y:57,n:'01',t:'MENSAGEM',d:'Observe remetente, domínio, urgência e canal.'},
        {x:43,y:70,n:'02',t:'EVIDÊNCIA',d:'Uma pista isolada raramente conta a história inteira.'},
        {x:63,y:50,n:'03',t:'ORIGEM',d:'Confirme de onde veio o evento antes de agir.'},
        {x:83,y:34,n:'04',t:'DISPOSITIVO',d:'O contexto do dispositivo altera a leitura do risco.'}
      ]
    },
    privacidade: {
      eyebrow:'02 / FLUXO DOS DADOS', title:'Siga a <em>vida</em> de um dado.',
      body:'Uma partícula nasce, atravessa sistemas, ganha valor, pode ser compartilhada e finalmente precisa desaparecer.',
      image:'cybershield-privacidade.jpg', audio:'cybershield-privacidade.mp3',
      spots:[
        {x:23,y:50,n:'01',t:'COLETA',d:'O dado entra porque alguma finalidade o tornou necessário.'},
        {x:42,y:41,n:'02',t:'PROCESSAMENTO',d:'Finalidade e contexto definem como a informação pode ser usada.'},
        {x:62,y:58,n:'03',t:'PROTEÇÃO',d:'Acesso, minimização e controles reduzem exposição.'},
        {x:81,y:46,n:'04',t:'ELIMINAÇÃO',d:'Retenção não é infinita: o ciclo precisa terminar.'}
      ]
    },
    cadeia: {
      eyebrow:'02 / MÁQUINA DE CAUSA E EFEITO', title:'Interrompa o <em>movimento.</em>',
      body:'Os sete estágios não são caixas isoladas. Eles formam uma cadeia: quando um elo cede, o próximo ganha caminho.',
      image:'cybershield-cadeia-seven-stages-ptbr.png', audio:'cybershield-cadeia.mp3',
      spots:[
        {x:11,y:54,n:'01',t:'RECONHECIMENTO',d:'O atacante aprende o terreno antes de agir.'},
        {x:24,y:48,n:'02',t:'ARMAMENTIZAÇÃO',d:'Capacidade e intenção são preparadas para a entrega.'},
        {x:37,y:54,n:'03',t:'ENTREGA',d:'O vetor encontra o usuário, sistema ou serviço.'},
        {x:49,y:48,n:'04',t:'EXPLORAÇÃO',d:'Uma fraqueza vira oportunidade de execução.'},
        {x:62,y:54,n:'05',t:'INSTALAÇÃO',d:'Persistência ou capacidade adicional ganha espaço.'},
        {x:75,y:48,n:'06',t:'COMANDO E CONTROLE',d:'O atacante estabelece comunicação e direção.'},
        {x:89,y:54,n:'07',t:'AÇÕES NOS OBJETIVOS',d:'O impacto aparece no ativo ou processo final.'}
      ]
    },
    radar: {
      eyebrow:'02 / OBSERVATÓRIO', title:'O espaço está <em>escutando.</em>',
      body:'O radar mostra o invisível como um organismo: pontos surgem, se aproximam, se correlacionam e mudam a decisão.',
      image:'cybershield-radar.jpg', audio:'cybershield-radar.mp3',
      spots:[
        {x:36,y:35,n:'A',t:'SINAL FRACO',d:'Ruído pode ser o começo de um padrão.'},
        {x:65,y:28,n:'B',t:'ANOMALIA',d:'A distância do comportamento habitual chama atenção.'},
        {x:72,y:64,n:'C',t:'CORRELAÇÃO',d:'Múltiplos eventos dão peso ao cenário.'},
        {x:49,y:71,n:'D',t:'RISCO',d:'O centro da decisão não é o ponto: é o contexto.'}
      ]
    }
  }[page];

  const main = document.querySelector('main');
  if (!main || !data) return;

  // Remove any previous V42 section if a navigation system reinjects scripts.
  main.querySelectorAll('.sp42-art-chapter').forEach(n => n.remove());

  const firstSection = main.querySelector(':scope > section');
  const section = document.createElement('section');
  section.className = 'sp42-art-chapter';
  section.setAttribute('aria-labelledby', `sp42-${page}-title`);
  section.innerHTML = `
    <div class="sp42-art-bg"><img src="assets/superproduction-v41/${data.image}" alt="" loading="eager" decoding="async"></div>
    <div class="sp42-art-shade"></div>
    <div class="sp42-grain" aria-hidden="true"></div>
    <div class="sp42-art-inner">
      <div class="sp42-art-copy">
        <span class="sp42-eyebrow">${data.eyebrow}</span>
        <h2 id="sp42-${page}-title">${data.title}</h2>
        <p>${data.body}</p>
        <div class="sp42-art-actions">
          <button class="sp42-explore" type="button">EXPLORAR CENÁRIO <span>↗</span></button>
          ${page === 'cadeia' ? '<span class="sp42-note">MAPA CANÔNICO · PORTUGUÊS</span>' : '<span class="sp42-note">ARTWORK · INTERAÇÃO VIVA</span>'}
        </div>
      </div>
      <div class="sp42-art-stage" data-art-stage>
        <div class="sp42-stage-frame"><img src="assets/superproduction-v41/${data.image}" alt="${page === 'cadeia' ? 'Mapa visual em português dos sete estágios da cadeia de ataque' : 'Artwork cinematográfico do universo CyberShield'}" loading="eager"></div>
        <div class="sp42-stage-ui"><span>CYBERSHIELD / ARTWORK</span><b data-sp42-readout>01</b></div>
        ${data.spots.map((s,i)=>`
          <button class="sp42-hotspot ${i===0?'is-active':''}" type="button" style="left:${s.x}%;top:${s.y}%" data-index="${i}" aria-label="${s.t}">
            <span>${s.n}</span><i></i>
          </button>`).join('')}
      </div>
      <aside class="sp42-art-detail" aria-live="polite">
        <div class="sp42-detail-kicker">LEITURA</div>
        <h3 data-sp42-detail-title>${data.spots[0].t}</h3>
        <p data-sp42-detail-body>${data.spots[0].d}</p>
        <div class="sp42-detail-route"><span data-sp42-index>01</span><span>·</span><span>${data.spots.length.toString().padStart(2,'0')} pontos</span></div>
      </aside>
    </div>
    <div class="sp42-progress" aria-hidden="true"><i></i></div>
  `;
  if (firstSection) firstSection.insertAdjacentElement('afterend', section); else main.prepend(section);

  const bg = section.querySelector('.sp42-art-bg img');
  const stageImage = section.querySelector('.sp42-stage-frame img');
  const hotspots = [...section.querySelectorAll('.sp42-hotspot')];
  const detailTitle = section.querySelector('[data-sp42-detail-title]');
  const detailBody = section.querySelector('[data-sp42-detail-body]');
  const detailIndex = section.querySelector('[data-sp42-index]');
  const readout = section.querySelector('[data-sp42-readout]');
  const progress = section.querySelector('.sp42-progress i');
  const explore = section.querySelector('.sp42-explore');

  function selectSpot(i, focus=false) {
    const idx = Math.max(0, Math.min(data.spots.length - 1, i));
    const s = data.spots[idx];
    hotspots.forEach((h,k)=>h.classList.toggle('is-active',k===idx));
    detailTitle.textContent = s.t;
    detailBody.textContent = s.d;
    detailIndex.textContent = String(idx+1).padStart(2,'0');
    readout.textContent = `${String(idx+1).padStart(2,'0')} / ${String(data.spots.length).padStart(2,'0')}`;
    section.dataset.focus=String(idx+1);
    if (!reduce) {
      detailTitle.animate([{opacity:.2,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'});
      stageImage.animate([{transform:'scale(1.025)'},{transform:'scale(1.0)'}],{duration:420,easing:'cubic-bezier(.2,.75,.2,1)'});
    }
    if (focus) section.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
  }
  hotspots.forEach((h,i)=>h.addEventListener('click',()=>selectSpot(i)));
  section.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'){e.preventDefault();selectSpot((Number(detailIndex.textContent)-1+1)%data.spots.length);}
    if(e.key==='ArrowLeft'){e.preventDefault();selectSpot((Number(detailIndex.textContent)-1-1+data.spots.length)%data.spots.length);}
  });
  explore.addEventListener('click',()=>{hotspots[0]?.focus();selectSpot(0,true)});

  if (!reduce && !coarse) {
    let raf=0, tx=0, ty=0;
    section.addEventListener('pointermove',e=>{
      const r=section.getBoundingClientRect();
      tx=(e.clientX-r.left)/r.width-.5; ty=(e.clientY-r.top)/r.height-.5;
      if(raf) return;
      raf=requestAnimationFrame(()=>{raf=0; section.style.setProperty('--sp42-px',`${tx*10}px`);section.style.setProperty('--sp42-py',`${ty*7}px`);});
    },{passive:true});
  }

  const io = new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting) section.classList.add('is-in-view');
  }),{threshold:.16});
  io.observe(section);

  const progressIO = new IntersectionObserver(entries=>entries.forEach(entry=>{
    const ratio=Math.max(0,Math.min(1,entry.intersectionRatio));
    progress.style.transform=`scaleX(${ratio})`;
  }),{threshold:[0,.2,.4,.6,.8,1]});
  progressIO.observe(section);

  // Page-specific ambient soundtrack. User activation is required for playback.
  const audio=document.createElement('audio');
  audio.src=`assets/superproduction-v41/${data.audio}`;
  audio.loop=true; audio.preload='metadata'; audio.setAttribute('aria-hidden','true'); audio.className='sp42-audio';
  document.body.appendChild(audio);
  const nativeSound = document.querySelector('#sound-toggle,.sound,.ps-sound,#privacy-sound');
  if(nativeSound) nativeSound.classList.add('sp42-native-sound-hidden');
  const button=document.createElement('button');
  button.type='button'; button.className='sp42-audio-toggle'; button.setAttribute('aria-pressed','false'); button.innerHTML='<span class="dot"></span><span>SOM DO UNIVERSO · OFF</span>';
  document.body.appendChild(button);
  let active=false;
  button.addEventListener('click',async()=>{
    try {
      if(!active){ audio.volume=.11; await audio.play(); active=true; }
      else { audio.pause(); active=false; }
      button.setAttribute('aria-pressed',String(active));
      button.querySelector('span:last-child').textContent=active?'SOM DO UNIVERSO · ATIVO':'SOM DO UNIVERSO · OFF';
      button.classList.toggle('is-active',active);
    } catch(_) {}
  });

  // Gentle cross-page transition cue without hijacking navigation.
  document.querySelectorAll('a[href$=".html"]').forEach(a=>{
    a.addEventListener('click',()=>document.documentElement.classList.add('sp42-leaving'));
  });

  // Home-specific navigation chips can appear in the art chapter when appropriate.
  if (data.chips) {
    const chips=document.createElement('div'); chips.className='sp42-home-paths';
    data.chips.forEach(([label,href])=>{const a=document.createElement('a');a.href=href;a.textContent=label;chips.appendChild(a)});
    section.querySelector('.sp42-art-copy').appendChild(chips);
  }
})();
