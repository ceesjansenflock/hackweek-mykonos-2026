'use strict';

/* ---------------- Navigation ---------------- */
const views = document.querySelectorAll('.view');
const navBtns = document.querySelectorAll('#nav button');
const subLabels = {
  home:'Mykonos · Samen beter', programma:'Het dagprogramma', info:'Alles wat je moet weten',
  paklijst:'Vink af & vertrek', spel:'Puzzelen — samen beter'
};
function showView(name){
  views.forEach(v=>v.classList.toggle('active', v.id==='view-'+name));
  navBtns.forEach(b=>b.classList.toggle('active', b.dataset.view===name));
  document.getElementById('appbar-sub').textContent = subLabels[name]||'';
  window.scrollTo({top:0});
  try{ localStorage.setItem('hw_view', name); }catch(e){}
}
navBtns.forEach(b=>b.addEventListener('click', ()=>showView(b.dataset.view)));

/* ---------------- Countdown ---------------- */
const START = new Date('2026-09-19T00:00:00');
const END   = new Date('2026-09-26T23:59:59');
function renderCountdown(){
  const el = document.getElementById('countdown');
  const now = new Date();
  let target, label;
  if(now < START){ target = START; label='tot vertrek'; }
  else if(now <= END){
    el.innerHTML = '<div class="cd" style="min-width:auto;padding:12px 18px"><b>🎉</b><span>We zijn er! Samen beter</span></div>';
    return;
  } else { el.innerHTML='<div class="cd" style="min-width:auto;padding:12px 18px"><b>❤️</b><span>Tot de volgende hackweek</span></div>'; return; }
  let diff = Math.max(0, target - now);
  const d = Math.floor(diff/86400000); diff-=d*86400000;
  const h = Math.floor(diff/3600000); diff-=h*3600000;
  const m = Math.floor(diff/60000); diff-=m*60000;
  const s = Math.floor(diff/1000);
  const box=(v,l)=>`<div class="cd"><b>${v}</b><span>${l}</span></div>`;
  el.innerHTML = box(d,'dagen')+box(h,'uur')+box(m,'min')+box(s,'sec')+
    `<div class="cd" style="display:none">${label}</div>`;
}
setInterval(renderCountdown, 1000); renderCountdown();

/* ---------------- Quotes ---------------- */
const QUOTES = [
  ['Coming together is a beginning, staying together is progress, working together is success.','Henry Ford'],
  ['Alleen ga je sneller, samen kom je verder.','Afrikaans spreekwoord'],
  ['None of us is as smart as all of us.','Ken Blanchard'],
  ['Great things in business are never done by one person; they\'re done by a team.','Steve Jobs'],
  ['Ένας κούκος δεν φέρνει την άνοιξη — één koekoek maakt de lente niet.','Grieks spreekwoord'],
];
function rotateQuote(){
  const [q,by] = QUOTES[Math.floor(Math.random()*QUOTES.length)];
  document.getElementById('quote').innerHTML = '“'+q+'” <span class="by">— '+by+'</span>';
}
rotateQuote(); setInterval(rotateQuote, 8000);

/* ---------------- Program: collapse + today ---------------- */
document.querySelectorAll('.day > button').forEach(btn=>{
  btn.addEventListener('click', ()=> btn.parentElement.classList.toggle('open'));
});
(function highlightToday(){
  const today = new Date().toISOString().slice(0,10);
  document.querySelectorAll('.day').forEach(day=>{
    if(day.dataset.date===today){
      day.classList.add('today','open');
      const t=day.querySelector('.dtitle');
      if(t && !t.querySelector('.badge-today')) t.insertAdjacentHTML('beforeend',' <span class="badge-today">VANDAAG</span>');
    }
  });
})();

/* ---------------- Paklijst ---------------- */
const PACK = [
  ['📄 Reisdocumenten & geld', ['Paspoort of ID (geldig!)','Boarding pass / e-ticket','Pinpas + wat contant geld (euro)','Gegevens reisverzekering','Zorgpas / EHIC']],
  ['👕 Kleding', ['Zwemkleding','Slippers / sandalen','Lichte kleding voor overdag','Iets warmers voor de avond','Net setje voor het uitgaan','Zonnebril + pet of hoed']],
  ['☀️ Zon & strand', ['Zonnebrand factor 30+','Aftersun','Strandhanddoek','Herbruikbare waterfles']],
  ['💻 Tech (voor het hacken)', ['Laptop + oplader','Adapter (type C/F — meestal niet nodig, toch checken)','Koptelefoon','Powerbank','Muis en extra kabels']],
  ['🤝 Samen beter (niet vergeten!)', ['Goed humeur en teamspirit','Je beste bug-verhalen','Zin om anderen te helpen','Een openingszin in het Grieks']],
];
let pkState = {};
try{ pkState = JSON.parse(localStorage.getItem('hw_pk')||'{}'); }catch(e){ pkState={}; }
function savePk(){ try{ localStorage.setItem('hw_pk', JSON.stringify(pkState)); }catch(e){} }
function renderPack(){
  const root = document.getElementById('pklist'); root.innerHTML=''; let total=0, done=0;
  PACK.forEach((cat,ci)=>{
    const h=document.createElement('div'); h.className='pkcat'; h.textContent=cat[0]; root.appendChild(h);
    cat[1].forEach((item,ii)=>{
      const id='c'+ci+'i'+ii; total++;
      const on=!!pkState[id]; if(on) done++;
      const row=document.createElement('div'); row.className='check'+(on?' done':'');
      row.innerHTML='<div class="box">'+(on?'✓':'')+'</div><div class="txt">'+item+'</div>';
      row.addEventListener('click', ()=>{
        pkState[id]=!pkState[id]; savePk(); renderPack();
      });
      root.appendChild(row);
    });
  });
  document.getElementById('pk-count').textContent = done+' / '+total;
  document.getElementById('pk-bar').style.width = (total? Math.round(done/total*100):0)+'%';
}
document.getElementById('pk-reset').addEventListener('click', ()=>{
  if(confirm('Alle vinkjes wissen?')){ pkState={}; savePk(); renderPack(); }
});
renderPack();

/* ---------------- Crosswords ---------------- */
const CW = JSON.parse(document.getElementById('cwdata').textContent);
let curCw = 'griekenland';

function cwKey(){ return 'hw_cw_'+curCw; }
function loadEntries(){ try{ return JSON.parse(localStorage.getItem(cwKey())||'{}'); }catch(e){ return {}; } }
function saveEntries(o){ try{ localStorage.setItem(cwKey(), JSON.stringify(o)); }catch(e){} }

function renderCrossword(){
  const p = CW[curCw];
  const mount = document.getElementById('cwmount');
  const entries = loadEntries();
  const byKey = {};
  p.cells.forEach(c=> byKey[c.r+','+c.c]=c);

  const wrap = document.createElement('div'); wrap.className='gridwrap';
  const grid = document.createElement('div'); grid.className='cwgrid';
  grid.style.gridTemplateColumns = 'repeat('+p.cols+', 30px)';
  for(let r=0;r<p.rows;r++){
    for(let c=0;c<p.cols;c++){
      const cell = byKey[r+','+c];
      const div = document.createElement('div');
      div.className = 'cwcell'+(cell?'':' block');
      if(cell){
        if(cell.n){ const n=document.createElement('span'); n.className='num'; n.textContent=cell.n; div.appendChild(n); }
        const inp=document.createElement('input');
        inp.setAttribute('maxlength','1'); inp.setAttribute('inputmode','latin');
        inp.setAttribute('autocapitalize','characters'); inp.autocomplete='off';
        inp.dataset.r=r; inp.dataset.c=c;
        const v = entries[r+','+c]; if(v) inp.value=v;
        inp.addEventListener('input', e=>{
          inp.value = inp.value.toUpperCase().replace(/[^A-ZΑ-Ω]/g,'');
          inp.classList.remove('good','bad');
          const en=loadEntries(); en[r+','+c]=inp.value; saveEntries(en);
          if(inp.value){ focusNext(r,c); }
        });
        inp.addEventListener('keydown', e=>{
          if(e.key==='Backspace' && !inp.value){ focusPrev(r,c); }
        });
        div.appendChild(inp);
      }
      grid.appendChild(div);
    }
  }
  wrap.appendChild(grid); mount.innerHTML=''; mount.appendChild(wrap);
  renderClues();
}
function getInput(r,c){ return document.querySelector('#cwmount input[data-r="'+r+'"][data-c="'+c+'"]'); }
function focusNext(r,c){ const n=getInput(r,c+1)||getInput(r+1,0); if(n) n.focus(); }
function focusPrev(r,c){ let n=getInput(r,c-1); if(n){ n.focus(); } }

function renderClues(){
  const p = CW[curCw];
  const el = document.getElementById('cwclues');
  const list = arr => '<ol>'+arr.map(x=>'<li><b>'+x.num+'.</b> '+x.clue+'</li>').join('')+'</ol>';
  el.innerHTML = '<h3>➡️ Horizontaal</h3>'+list(p.across)+'<h3>⬇️ Verticaal</h3>'+list(p.down);
}

document.querySelectorAll('.cwtabs button').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.cwtabs button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); curCw=b.dataset.cw; renderCrossword();
  });
});
document.getElementById('cw-check').addEventListener('click', ()=>{
  const p=CW[curCw]; const byKey={}; p.cells.forEach(c=>byKey[c.r+','+c.c]=c);
  document.querySelectorAll('#cwmount input').forEach(inp=>{
    const cell=byKey[inp.dataset.r+','+inp.dataset.c]; inp.classList.remove('good','bad');
    if(inp.value){ inp.classList.add(inp.value===cell.a?'good':'bad'); }
  });
});
document.getElementById('cw-reveal').addEventListener('click', ()=>{
  if(!confirm('Hele oplossing tonen?')) return;
  const p=CW[curCw]; const en={};
  p.cells.forEach(c=> en[c.r+','+c.c]=c.a);
  saveEntries(en); renderCrossword();
  document.querySelectorAll('#cwmount input').forEach(i=>i.classList.add('good'));
});
document.getElementById('cw-clear').addEventListener('click', ()=>{
  if(!confirm('Dit rooster leegmaken?')) return;
  saveEntries({}); renderCrossword();
});
renderCrossword();

/* ---------------- Restore last view ---------------- */
try{ const v=localStorage.getItem('hw_view'); if(v) showView(v); }catch(e){}

/* ---------------- Service worker (offline) ---------------- */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=> navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
