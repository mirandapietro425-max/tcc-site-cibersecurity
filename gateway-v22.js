(function(){
  const section=document.querySelector('#gateway');
  if(!section) return;
  const sequence=document.querySelector('#gateway-sequence');
  const shots=[...document.querySelectorAll('.gateway-sequence-shot')];
  const doors=document.querySelectorAll('.gateway-door');
  const setAudio=(id,vol)=>{const a=document.getElementById(id); if(!a)return; try{a.currentTime=0;a.volume=vol;a.play().catch(()=>{});}catch(e){}};
  let committed=false;

  // A esquerda usa os frames antigos; a direita usa exclusivamente os 2 novos frames.
  // Os dois primeiros frames são compartilhados pelos dois caminhos.
  const paths={
    left:[
      'assets/gateway/cybersecurity_sequence_01_arrival.png',
      'assets/gateway/cybersecurity_sequence_02_decision_point.png',
      'assets/gateway/cybersecurity_sequence_03_turning_left.png',
      'assets/gateway/cybersecurity_sequence_04_approach_investigate.png'
    ],
    right:[
      'assets/gateway/cybersecurity_sequence_01_arrival.png',
      'assets/gateway/cybersecurity_sequence_02_decision_point.png',
      'assets/gateway/cybersecurity_sequence_03_turning_right.png',
      'assets/gateway/cybersecurity_sequence_04_approach_investigate_right.png'
    ]
  };

  function setSequenceImages(direction){
    const frames=paths[direction] || paths.left;
    shots.forEach((shot,i)=>{
      const img=shot.querySelector('img');
      if(!img) return;
      img.src='';
      img.removeAttribute('src');
      img.setAttribute('data-src',frames[i] || '');
      img.alt='';
    });
  }

  function resetSequence(){
    shots.forEach((shot,i)=>shot.classList.toggle('is-current',i===0));
  }

  function loadSequenceImages(){
    const jobs=shots.map(shot=>new Promise(resolve=>{
      const img=shot.querySelector('img[data-src]');
      if(!img) return resolve();
      const src=img.dataset.src;
      if(!src) return resolve();
      const done=()=>{ img.removeAttribute('data-src'); resolve(); };
      img.addEventListener('load',done,{once:true});
      img.addEventListener('error',done,{once:true});
      img.src=src;
    }));
    return Promise.all(jobs);
  }

  function playEntrySequence(target){
    if(committed) return;
    committed=true;

    // O botão da direita = caminho para a direita; o da esquerda = caminho para a esquerda.
    const direction=target==='protect'?'right':'left';
    setSequenceImages(direction);
    resetSequence();
    setAudio('sfx-click',.12);
    section.classList.add('is-transitioning');
    sequence?.setAttribute('aria-hidden','false');
    requestAnimationFrame(()=>sequence?.classList.add('is-playing'));

    loadSequenceImages();

    const frameCount=4;
    const frameDelay=500;
    for(let i=0;i<frameCount;i++){
      setTimeout(()=>{
        shots.forEach((shot,j)=>shot.classList.toggle('is-current',j===i));
      },i*frameDelay);
    }

    setTimeout(()=>setAudio('sfx-transition',.22),760);
    setTimeout(()=>{
      window.location.href=target==='investigate'?'radar.html':'playbook.html';
    },2200);
  }

  doors.forEach(btn=>{
    btn.addEventListener('mouseenter',()=>{
      section.classList.remove('hover-investigate','hover-protect');
      section.classList.add(btn.dataset.target==='investigate'?'hover-investigate':'hover-protect');
      setAudio('sfx-click',.06);
    });
    btn.addEventListener('mouseleave',()=>section.classList.remove('hover-investigate','hover-protect'));
    btn.addEventListener('focus',()=>section.classList.add(btn.dataset.target==='investigate'?'hover-investigate':'hover-protect'));
    btn.addEventListener('blur',()=>section.classList.remove('hover-investigate','hover-protect'));
    btn.addEventListener('click',()=>playEntrySequence(btn.dataset.target));
  });
})();