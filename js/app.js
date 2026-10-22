/* Tablero PP Inclusión para Personas con Discapacidad · Tenjo */
(function(){
'use strict';

/* ======================= DATOS ======================= */
const PAL={
  light:{verde:'#055B2A',verde2:'#0B7A3B',amarillo:'#E8BE07',azul:'#1F6FB2',tinta:'#15201A',gris:'#5B6670',axis:'#DDE5DF',grid:'#EEF2EF',track:'#EEF3EF',bd:'#FFFFFF',dim:'#C9DCCF',acc:'#055B2A',amTxt:'#8F7200',sa:['#FAFCFB','#F2F7F4'],
    ej:[['#055B2A','#E3F0E7'],['#8F7200','#FBF1C7'],['#17588F','#E1EDF8']]},
  dark:{verde:'#2E9E5B',verde2:'#3DB56F',amarillo:'#E8BE07',azul:'#4C95D6',tinta:'#E4EEE7',gris:'#A7B6AD',axis:'#2A3D32',grid:'#1F3027',track:'#1C2B23',bd:'#121E17',dim:'#2B4436',acc:'#7CD39B',amTxt:'#F2D35B',sa:['#121E17','#16251C'],
    ej:[['#7CD39B','#173A24'],['#F2D35B','#3A3210'],['#7DB6E8','#14304A']]}};
let TEMA=document.documentElement.dataset.theme==='dark'?'dark':'light';
const C=Object.assign({},PAL[TEMA]);
const EJES=[
  {id:1,corto:'Salud',nombre:'Salud y rehabilitación',largo:'Salud, habilitación y rehabilitación integral',icono:'fa-hand-holding-medical',c:C.verde,ct:'#055B2A',cbg:'#E3F0E7',peso:38.79,nAcc:9},
  {id:2,corto:'Educación',nombre:'Educación e inclusión',largo:'Fortalecimiento a la educación e inclusión social',icono:'fa-graduation-cap',c:C.amarillo,ct:C.amTxt,cbg:'#FBF1C7',peso:26.72,nAcc:5},
  {id:3,corto:'Participación',nombre:'Participación y derechos',largo:'Acceso, inclusión laboral, participación y justicia',icono:'fa-people-arrows',c:C.azul,ct:'#17588F',cbg:'#E1EDF8',peso:34.48,nAcc:8}
];
function aplicarPaleta(){Object.assign(C,PAL[TEMA]);EJES.forEach((e,i)=>{e.c=[C.verde,C.amarillo,C.azul][i];e.ct=C.ej[i][0];e.cbg=C.ej[i][1]});
  if(typeof POB!=='undefined')POB.grupos.forEach((g,i)=>g.c=[C.verde,C.amarillo,C.azul,'#7FA48C'][i])}
const VIGS=[2024,2025,2026];
const ACCN={'1.3.1':'Detección temprana','1.3.2':'Reducción de NBI','1.3.3':'Afiliación en salud','1.3.4':'Registro y certificación','1.3.5':'Acceso a rehabilitación','1.3.6':'Equipo de la UAI','1.3.7':'Satisfacción de usuarios','1.3.8':'Accesibilidad y atención educativa','1.3.9':'Entornos y familias',
 '2.1.1':'Acceso y permanencia educativa','2.1.2':'Escuela inclusiva y PIAR','2.1.3':'Formación y cultura inclusiva','2.1.4':'Deporte y sensibilización','2.1.5':'Difusión y participación social',
 '3.1.1':'Deporte y familias','3.1.2':'Comités y accesibilidad','3.1.3':'Mesas y certificación','3.1.4':'Convocatorias y RLCPD','3.1.5':'Capacitación en inclusión','3.1.6':'Atención pedagógica y semana de la discapacidad','3.1.7':'Seguimiento de la política','3.1.8':'Informe anual de la política'};
const VIS=a=>a.c>0;
const ACC_TXT=(window.DATA&&window.DATA.acc)||{};
const ACT=((window.DATA&&window.DATA.act)||[]).map((a,i)=>Object.assign({id:i,cod:a.a+'.'+a.n},a));
const estado=c=>c>=100?'Cumplida':'En avance';
const ESTADOS=[['Cumplida',C.verde],['En avance',C.amarillo]];

/* Agregados por vigencia */
const AGG={};
VIGS.forEach(y=>{
  const acts=ACT.filter(a=>a.y===y);const acc={};
  acts.forEach(a=>{(acc[a.a]=acc[a.a]||{a:a.a,e:a.e,nom:ACCN[a.a]||a.a,txt:ACC_TXT[a.a]||'',acts:[]}).acts.push(a)});
  Object.values(acc).forEach(x=>{x.c=x.acts.reduce((s,a)=>s+a.c,0)/x.acts.length;x.nVis=x.acts.filter(VIS).length});
  const ejes={};EJES.forEach(e=>{const ac=Object.values(acc).filter(x=>x.e===e.id);const sum=ac.reduce((s,x)=>s+x.c,0);
    ejes[e.id]={gest:ac.length,cumpl:ac.length?sum/ac.length:0,pond:sum/e.nAcc,acts:acts.filter(a=>a.e===e.id).length}});
  const all=Object.values(acc);
  AGG[y]={acts,acc,ejes,cumpl:all.reduce((s,x)=>s+x.c,0)/all.length,pond:EJES.reduce((s,e)=>s+e.peso*ejes[e.id].pond/100,0),gest:all.length};
});

const POB={hab:28000,grupos:[
  {g:'Personas con discapacidad',n:340,c:C.verde,i:'fa-wheelchair',d:'243 en la Unidad de Atención Integral, 60 estudiantes con PIAR, 34 solicitudes de certificación y 11 en protección integral (descontando repeticiones).'},
  {g:'Familias y cuidadores',n:300,c:C.amarillo,i:'fa-people-roof',d:'211 padres y cuidadores orientados en educación inclusiva y 174 beneficiarios del subsidio monetario (personas con discapacidad o cuidadores).'},
  {g:'Niñas y niños de 0 a 5 años',n:288,c:C.azul,i:'fa-baby',d:'Tamizaje del neurodesarrollo en CDI, jardines y hogares para la detección temprana.'},
  {g:'Comunidad, docentes y servidores',n:380,c:'#7FA48C',i:'fa-chalkboard-user',d:'27 jornadas de capacitación en inclusión, 40 funcionarios y contratistas y 39 miembros de la comunidad educativa.'}]};
const ATN=[['Niñas y niños con tamizaje',288],['PcD en la Unidad de Atención Integral',243],['Padres y cuidadores orientados',211],['Beneficiarios del subsidio monetario',174],['Encuestas de satisfacción',270],['Estudiantes con PIAR',60],['Funcionarios capacitados',40],['Usuarios en deporte (Inderten)',35],['Solicitudes de certificación',34],['PcD en protección integral',11]];
const CATS=[['Salud y rehabilitación','fa-heart-pulse'],['Protección social','fa-hand-holding-heart'],['Educación inclusiva','fa-graduation-cap'],['Participación y derechos','fa-people-arrows'],['Cultura y deporte','fa-futbol'],['Fortalecimiento institucional','fa-building-columns']];
/* [vigencia, eje, acción, categoría, cifra, unidad, título, texto] */
const LOGROS=[
 [2026,1,'1.3.1','Salud y rehabilitación','288','niñas y niños','Detección temprana del neurodesarrollo','Tamizajes en CDI, jardines y hogares del municipio para intervenir de manera oportuna.'],
 [2026,1,'1.3.6','Salud y rehabilitación','243','personas','Unidad de Atención Integral','Apoyo terapéutico y pedagógico con equipo multidisciplinario para personas con discapacidad y sus familias.'],
 [2026,1,'1.3.2','Protección social','6','entregas','Apoyos nutricionales','Entregas del programa de apoyos nutricionales del primer semestre, con meta anual de 2.400 apoyos.'],
 [2026,1,'1.3.2','Protección social','3','desembolsos','Subsidio monetario','Pagos a personas con discapacidad o sus cuidadores; 174 beneficiarios según el Plan de Desarrollo.'],
 [2026,1,'1.3.5','Protección social','11','personas','Protección integral','Personas con discapacidad en centros de protección con cuidado y atención integral.'],
 [2026,1,'1.3.3','Salud y rehabilitación','12','meses','Aseguramiento en salud','Atención permanente para afiliación al sistema de salud y afiliación de oficio a población migrante regularizada.'],
 [2026,1,'1.3.7','Fortalecimiento institucional','270','encuestas','Satisfacción de usuarios','Encuestas aplicadas para ajustar los servicios a las necesidades de la comunidad.'],
 [2026,1,'1.3.9','Educación inclusiva','211','padres y cuidadores','Familias en educación inclusiva','Orientación sobre trabajo colaborativo y corresponsabilidad entre familia y escuela.'],
 [2026,2,'2.1.2','Educación inclusiva','60','PIAR','Planes Individuales de Ajuste Razonable','Elaboración y seguimiento con informes anuales de competencias para estudiantes con discapacidad.'],
 [2026,2,'2.1.3','Fortalecimiento institucional','40','servidores','Funcionarios capacitados','Funcionarios y contratistas formados en atención y ruta para personas con discapacidad.'],
 [2026,2,'2.1.2','Educación inclusiva','39','personas','Comunidad educativa sensibilizada','Formación para promover una cultura incluyente en las instituciones educativas.'],
 [2026,2,'2.1.3','Cultura y deporte','1','convenio','Formación artística inclusiva','Convenio con el Instituto de Cultura y Turismo para espacios de formación artística y cultural.'],
 [2026,2,'2.1.4','Cultura y deporte','35','usuarios','Deporte adaptado con Inderten','Articulación para el desarrollo deportivo y motriz de la población del programa.'],
 [2026,3,'3.1.5','Fortalecimiento institucional','27','jornadas','Capacitación en inclusión','Jornadas con docentes, orientadores, administración y comunidad en atención a la discapacidad.'],
 [2026,3,'3.1.3','Salud y rehabilitación','34','solicitudes','Certificación de discapacidad','Solicitudes recibidas y revisadas, con valoraciones en convenio con la ESE de Cajicá.'],
 [2026,3,'3.1.2','Participación y derechos','3','sesiones','Comités de participación','Sesiones del Comité Municipal de Discapacidad y del Comité Evaluador del Subsidio.'],
 [2026,3,'3.1.6','Educación inclusiva','10','meses','Atención pedagógica en contrajornada','Acompañamiento pedagógico en la Unidad de Atención Integral según las necesidades de cada estudiante.'],
 [2026,3,'3.1.1','Participación y derechos','6','reuniones','Familias y derechos','Reuniones con padres y cuidadores sobre garantía de derechos y corresponsabilidad.'],
 [2025,1,'1.3.1','Salud y rehabilitación','640','niñas y niños','Detección temprana del neurodesarrollo','Caracterizaciones en CDI, jardines y hogares, y 5 jornadas de valoración multidisciplinaria.'],
 [2025,1,'1.3.2','Protección social','2.400','apoyos','Apoyos nutricionales','12 entregas anuales y 6 desembolsos del subsidio monetario a personas con discapacidad o cuidadores.'],
 [2025,1,'1.3.7','Fortalecimiento institucional','300','encuestas','Satisfacción de usuarios','Encuestas aplicadas y verificadas para ajustar los servicios.'],
 [2025,2,'2.1.2','Educación inclusiva','60','PIAR','Planes Individuales de Ajuste Razonable','Elaboración y seguimiento para estudiantes con discapacidad.'],
 [2025,1,'1.3.9','Educación inclusiva','200','padres y cuidadores','Familias en educación inclusiva','Orientación en corresponsabilidad familia–escuela.'],
 [2025,3,'3.1.3','Salud y rehabilitación','30','solicitudes','Certificación de discapacidad','Solicitudes revisadas y valoraciones para certificación.'],
 [2025,3,'3.1.5','Fortalecimiento institucional','25','jornadas','Capacitación en inclusión','Más de 300 personas formadas entre docentes, orientadores, servidores y comunidad.'],
 [2025,3,'3.1.2','Participación y derechos','8','sesiones','Comités de participación','4 sesiones del Comité Evaluador del Subsidio y 4 del Comité Municipal de Discapacidad.'],
 [2024,1,'1.3.1','Salud y rehabilitación','642','niñas y niños','Detección temprana','Caracterizaciones en CDI, jardines y hogares, y 6 jornadas de valoración con 20 niños valorados.'],
 [2024,1,'1.3.5','Protección social','236','personas','Inscripción al programa','Personas con discapacidad formalmente inscritas en el programa municipal.'],
 [2024,1,'1.3.2','Protección social','2.400','apoyos','Apoyos nutricionales','Entrega al 90 % de la población inscrita en la Unidad de Atención.'],
 [2024,1,'1.3.2','Protección social','155','beneficiarios','Subsidio monetario','Convocatoria anual del subsidio para personas con discapacidad o cuidadores.'],
 [2024,1,'1.3.4','Salud y rehabilitación','48','personas','Certificación de discapacidad','Personas certificadas mediante convenio con la ESE Jorge Cavalier de Cajicá.'],
 [2024,3,'3.1.7','Educación inclusiva','926','atenciones','Atención pedagógica','Atenciones en contrajornada a estudiantes con discapacidad en la UAI.'],
 [2024,2,'2.1.3','Educación inclusiva','487','docentes','Docentes capacitados','14 capacitaciones, 29 articulaciones con directivos y 83 orientaciones a docentes.'],
 [2024,2,'2.1.3','Educación inclusiva','88','PIAR','Planes de ajuste razonable','Apoyo a 88 PIAR y orientación a 280 padres de familia (Decreto 1421 de 2017).'],
 [2024,3,'3.1.6','Cultura y deporte','400','personas','XIII Semana de la Discapacidad','Jornada de integración, foro académico, muestras culturales y rugby en silla de ruedas.']
];
const METAS=[['296','Apoyo terapéutico y pedagógico en la UAI','100 % · 243 personas con discapacidad'],['299','Subsidio monetario','Meta superada · 174 PcD o cuidadores'],['298','Certificación y RLCPD','Dos acciones anuales de registro · 65 PcD'],['300','Semana de la Discapacidad','Sensibilización a toda la comunidad · 243 PcD'],['170','Docentes en DUA y PIAR','Capacitación y acompañamiento · 250 personas'],['268','Salud mental','Estrategia municipal · 6.230 beneficiarios']];

aplicarPaleta();
/* ======================= UTILIDADES ======================= */
const $=s=>document.querySelector(s);
const fmt=(n,d=0)=>Number(n).toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=(n,d=1)=>fmt(n,d)+' %';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ejeDe=id=>EJES[id-1];
const S={vig:2026,eje:0,acc:null,dep:null,ejeModo:'cumpl',logCat:'',logQ:'',actQ:'',actDep:'',actEst:'',sort:['cod',1],page:0};
let charts=[];
const chart=(el,opt)=>{const c=echarts.init(el,null,{renderer:'canvas'});c.setOption(Object.assign({textStyle:{fontFamily:"'Source Sans 3', system-ui, sans-serif",color:C.tinta},animationDuration:900,animationEasing:'cubicOut'},opt));charts.push(c);return c};
const TT={backgroundColor:'#022E15',borderWidth:0,padding:[10,14],textStyle:{color:'#fff',fontSize:13},extraCssText:'border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.25)'};
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('on'),1800)}
function contar(root){root.querySelectorAll('[data-n]').forEach(el=>{const fin=+el.dataset.n,dec=+(el.dataset.d||0),pre=el.dataset.pre||'',suf=el.dataset.suf||'';const t0=performance.now();
  (function p(t){const k=Math.min(1,(t-t0)/1000),e=1-Math.pow(1-k,3);el.textContent=pre+fmt(fin*e,dec)+suf;if(k<1)requestAnimationFrame(p)})(t0)});
  requestAnimationFrame(()=>root.querySelectorAll('[data-w]').forEach(s=>s.style.width=s.dataset.w+'%'))}
const G=()=>AGG[S.vig];
const filtAct=()=>G().acts.filter(a=>VIS(a)&&(!S.eje||a.e===S.eje));
const filtAcc=()=>Object.values(G().acc).filter(x=>(!S.eje||x.e===S.eje)&&x.c>0).sort((a,b)=>a.a.localeCompare(b.a,undefined,{numeric:true}));
function estPill(c){return `<span class="pill ${c>=100?'':'y'}">${estado(c)}</span>`}
function progHTML(c,col){return `<div class="prog"><span data-w="${Math.min(c,100)}" style="width:0;background:${col}"></span></div>`}
const vigTxt=y=>y===2026?'2026 (corte octubre)':String(y);

/* ======================= MARCO ======================= */
const RUTAS={inicio:['Resumen ejecutivo',vInicio],avance:['Avance por eje y acción',vAvance],logros:['Logros obtenidos',vLogros],poblacion:['Población beneficiada',vPoblacion],actividades:['Explorador de actividades',vActividades],dependencias:['Dependencias y Plan de Desarrollo',vDependencias],informes:['Informes PDF',v=>window.vInformes(v)]};
function ruta(){return (location.hash.replace('#/','').split('?')[0])||'inicio'}
function render(){
  const r=RUTAS[ruta()]?ruta():'inicio';
  charts.forEach(c=>c.dispose());charts=[];
  document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===r));
  $('#pageTitle').textContent=RUTAS[r][0];
  $('#crumb').textContent='PP Discapacidad · '+S.vig+(S.eje?' · '+ejeDe(S.eje).corto:'');
  const v=$('#view');v.style.animation='none';v.offsetHeight;v.style.animation='';
  v.innerHTML='';RUTAS[r][1](v);contar(v);
  $('#sb').classList.remove('open');$('#sbBack').classList.remove('open');
}
function barraUI(){
  const f=$('#filtro');f.innerHTML='';
  [{id:0,corto:'Todos',c:'#9AA5AE'},...EJES].forEach(e=>{const b=document.createElement('button');b.className=S.eje===e.id?'on':'';b.title=e.largo||'Todos los ejes';
    b.innerHTML=`<span class="pt" style="background:${e.c}"></span>${e.corto}`;b.onclick=()=>setEje(e.id);f.appendChild(b)});
  const g=$('#vig');g.innerHTML='';
  VIGS.forEach(y=>{const b=document.createElement('button');b.className=S.vig===y?'on':'';b.innerHTML=y+(y===2026?'<small>corte</small>':'');b.onclick=()=>setVig(y);g.appendChild(b)});
}
function setEje(id){S.eje=id;S.acc=null;S.page=0;barraUI();render();if(id)toast('Filtro: '+ejeDe(id).largo)}
function setVig(y){S.vig=y;S.acc=null;S.page=0;barraUI();render();toast('Vigencia '+vigTxt(y))}
function ir(r){location.hash='#/'+r}

/* ======================= MODALES ======================= */
function abrir(html){$('#modalBody').innerHTML=html;$('#modal').classList.add('on');$('#modal').setAttribute('aria-hidden','false');contar($('#modalBody'))}
function cerrar(){$('#modal').classList.remove('on');$('#modal').setAttribute('aria-hidden','true')}
function modalAct(a){const e=ejeDe(a.e);
  abrir(`<span class="pill" style="background:${e.cbg};color:${e.ct}">${e.nombre} · Acción ${a.a} · ${a.y}</span>
  <h2>${esc(a.d)}</h2>
  <div class="grid-kv"><div><b>${a.p==null?'—':fmt(a.p)}</b><small>Programado</small></div><div><b>${fmt(a.s1)}</b><small>Ejecución semestre 1</small></div><div><b>${fmt(a.s2)}</b><small>Ejecución semestre 2</small></div><div><b>${pct(a.c,0)}</b><small>Cumplimiento</small></div></div>
  ${progHTML(a.c,e.c)}
  <div class="blk"><h5>Estado</h5><p>${estPill(a.c)}</p></div>
  <div class="blk"><h5>Responsable</h5><p>${esc(a.r)}</p></div>
  <div class="blk"><h5>Acción ${a.a} · ${esc(ACCN[a.a]||'')}</h5><p>${esc(ACC_TXT[a.a]||'')}</p></div>
  ${a.ev&&a.ev!=='None'?`<div class="blk"><h5>Evidencia</h5><p>${esc(a.ev)}</p></div>`:''}`)}
function detalleAcc(x,click=true){const e=ejeDe(x.e);
  return `<div class="acc"><div class="ah"><b>Acción ${x.a} · ${esc(x.nom)}</b><span style="display:flex;gap:8px;align-items:center"><span class="mini-prog">${progHTML(x.c,e.c)}</span><b style="color:${e.ct}">${pct(x.c,0)}</b></span></div>
   ${x.acts.filter(VIS).map(a=>`<div class="act" ${click?`data-act="${a.id}" style="cursor:pointer"`:''}><span class="t">${esc(a.d)}<br><small style="color:var(--gris)">${esc(a.r)} · ${fmt(a.s1+a.s2)} de ${a.p==null?'—':fmt(a.p)}</small></span>${estPill(a.c)}</div>`).join('')}</div>`}
function modalAcc(x){const e=ejeDe(x.e);
  abrir(`<span class="pill" style="background:${e.cbg};color:${e.ct}">${e.largo} · ${vigTxt(S.vig)}</span><h2>Acción ${x.a} · ${esc(x.nom)}</h2><p style="color:var(--gris);margin:0">${esc(x.txt)}</p>
  <div class="grid-kv"><div><b>${pct(x.c)}</b><small>Cumplimiento</small></div><div><b>${x.nVis}</b><small>Actividades con avance</small></div><div><b>${fmt(x.acts.reduce((s,a)=>s+a.s1+a.s2,0))}</b><small>Unidades ejecutadas</small></div><div><b>${[...new Set(x.acts.map(a=>a.r))].length}</b><small>Dependencias</small></div></div>
  ${detalleAcc(x,true)}`)}
function modalLogro(L){const e=ejeDe(L[1]);const x=AGG[L[0]].acc[L[2]];
  abrir(`<span class="pill" style="background:${e.cbg};color:${e.ct}">${e.nombre} · ${esc(L[3])} · ${L[0]}</span><h2>${esc(L[6])}</h2>
  <div style="font:800 40px Montserrat;color:${e.ct}">${esc(L[4])} <small style="font:600 16px 'Source Sans 3';color:var(--gris)">${esc(L[5])}</small></div>
  <p style="font-size:16px">${esc(L[7])}</p>${x?detalleAcc(x,true):''}`)}

/* ======================= VISTA: INICIO ======================= */
function kpi(cls,ic,n,d,suf,l,w,pre=''){return `<div class="card kpi ${cls}"><i class="fa-solid ${ic} deco"></i><div class="ki"><i class="fa-solid ${ic}"></i></div><div class="n" data-n="${n}" data-d="${d}" data-suf="${suf}" data-pre="${pre}">0</div><div class="l">${l}</div><div class="bar"><span data-w="${Math.min(100,w)}" style="width:0"></span></div></div>`}
function logroCard(L,i){const e=ejeDe(L[1]);const cat=CATS.find(c=>c[0]===L[3]);
  return `<article class="card hov lg" data-lg="${i}" style="--c:${e.c};--ct:${e.ct};--cbg:${e.cbg}"><div class="top2"><span class="ico"><i class="fa-solid ${cat?cat[1]:'fa-star'}"></i></span><span class="pill" style="background:${e.cbg};color:${e.ct}">${e.nombre}</span></div>
  <div class="n">${esc(L[4])}<small>${esc(L[5])}</small></div><h4>${esc(L[6])}</h4><p>${esc(L[7])}</p><span class="more">Ver detalle <i class="fa-solid fa-arrow-right"></i></span></article>`}
function vInicio(v){
  const g=G(),e=S.eje?ejeDe(S.eje):null,ge=e?g.ejes[e.id]:null;
  const cum=e?ge.cumpl:g.cumpl,pond=e?ge.pond:g.pond,gest=e?ge.gest:g.gest,nAct=filtAct().length;
  const pers=POB.grupos.reduce((s,x)=>s+x.n,0);
  v.innerHTML=`
  <div class="row c5">
    ${kpi('hero','fa-chart-line',cum,1,' %','Cumplimiento del plan de acción '+S.vig,cum)}
    ${kpi('y','fa-scale-balanced',pond,1,' %',e?'Avance ponderado del eje':'Avance ponderado con los pesos oficiales',pond)}
    ${kpi('','fa-list-check',gest,0,'',`Acciones gestionadas de ${e?e.nAcc:22}`,gest/(e?e.nAcc:22)*100)}
    ${kpi('','fa-clipboard-check',nAct,0,'','Actividades con avance reportado',100)}
    ${kpi('r','fa-people-group',pers,0,'','Personas vinculadas en 2026 (estimado)',pers/POB.hab*100*10,'≈ ')}
  </div>
  <div class="row c111">
    <div class="card"><div class="ch"><div><h3>Cumplimiento del plan de acción</h3><p>${e?e.largo:'Vigencia '+vigTxt(S.vig)}</p></div></div><div class="chart sm" id="gauge"></div>
      <div class="hint"><i class="fa-solid fa-circle-info"></i>Avance ponderado de la vigencia: <b style="color:var(--verde)">${pct(pond)}</b></div></div>
    <div class="card"><div class="ch"><div><h3>Mapa de la política</h3><p>Ejes y acciones con gestión · tamaño según actividades</p></div><span class="hint"><i class="fa-solid fa-hand-pointer"></i>Clic para detalle</span></div><div class="chart sm" id="sun"></div></div>
    <div class="card"><div class="ch"><div><h3>Trayectoria 2024–2026</h3><p>Cumplimiento del plan de acción por vigencia</p></div><span class="hint"><i class="fa-solid fa-hand-pointer"></i>Clic para cambiar</span></div><div class="chart sm" id="tray"></div></div>
  </div>
  <div class="row c21">
    <div class="card"><div class="ch"><div><h3>Ejecución por semestre · ${vigTxt(S.vig)}</h3><p>Actividades con ejecución reportada en cada semestre, por eje</p></div></div><div class="chart" id="sem"></div></div>
    <div class="card"><div class="ch"><div><h3>Acciones con mejor desempeño</h3><p>Cumplimiento ${vigTxt(S.vig)}</p></div></div><div class="rank" id="rank"></div></div>
  </div>
  <div class="row c4" id="logrosTop"></div>`;

  chart($('#gauge'),{series:[{type:'gauge',startAngle:205,endAngle:-25,min:0,max:100,radius:'100%',center:['50%','60%'],progress:{show:true,width:20,roundCap:true,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:C.amarillo},{offset:1,color:e?e.c:C.verde}])}},
    axisLine:{roundCap:true,lineStyle:{width:20,color:[[1,C.track]]}},axisTick:{show:false},splitLine:{show:false},axisLabel:{show:false},pointer:{show:false},anchor:{show:false},title:{show:false},
    detail:{valueAnimation:true,offsetCenter:[0,'5%'],fontSize:38,fontWeight:800,fontFamily:'Montserrat',color:C.acc,formatter:v=>fmt(v,1)+' %'},data:[{value:+cum.toFixed(1)}]}]});

  const sunData=EJES.filter(x=>!S.eje||x.id===S.eje).map(x=>({name:x.nombre,ejeId:x.id,itemStyle:{color:x.c},
    children:Object.values(g.acc).filter(a=>a.e===x.id&&a.c>0).map(a=>({name:a.a+' '+a.nom,value:Math.max(1,a.nVis),acc:a.a,cum:a.c,itemStyle:{color:x.c,opacity:.55+.45*a.c/100}}))}));
  const sun=chart($('#sun'),{tooltip:Object.assign({formatter:p=>p.data.acc?`<b>Acción ${esc(p.data.name)}</b><br>Cumplimiento: ${pct(p.data.cum)}<br>${p.value} actividades con avance`:`<b>${esc(ejeDe(p.data.ejeId).largo)}</b>`},TT),
    series:[{type:'sunburst',data:sunData,radius:['18%','96%'],sort:null,itemStyle:{borderColor:C.bd,borderWidth:2,borderRadius:4},
      label:{rotate:'radial',fontSize:10.5,color:'#fff',fontWeight:600,minAngle:12,formatter:p=>p.data.acc?p.data.acc:''},
      levels:[{},{r0:'18%',r:'40%',label:{rotate:'tangential',fontSize:10,fontWeight:800,minAngle:30,formatter:p=>'Eje '+p.data.ejeId}},{r0:'40%',r:'96%'}],emphasis:{focus:'ancestor'}}]});
  sun.on('click',p=>{if(p.data&&p.data.acc)modalAcc(g.acc[p.data.acc]);else if(p.data&&p.data.ejeId)setEje(p.data.ejeId)});

  const tv=VIGS.map(y=>e?AGG[y].ejes[e.id].cumpl:AGG[y].cumpl);
  const tray=chart($('#tray'),{tooltip:Object.assign({trigger:'axis',formatter:p=>`<b>Vigencia ${vigTxt(+p[0].name)}</b><br>Cumplimiento: ${pct(p[0].value)}<br>${AGG[+p[0].name].acts.filter(VIS).length} actividades con avance`},TT),
    grid:{left:10,right:16,top:30,bottom:6,containLabel:true},xAxis:{type:'category',data:VIGS.map(String),axisTick:{show:false},axisLine:{lineStyle:{color:C.axis}},axisLabel:{color:C.tinta,fontWeight:700,formatter:v=>v==='2026'?'2026*':v}},
    yAxis:{type:'value',show:false,max:118,min:0},
    series:[{type:'bar',barMaxWidth:46,label:{show:true,position:'top',fontWeight:800,fontFamily:'Montserrat',color:C.tinta,formatter:p=>pct(p.value)},
      data:tv.map((v,i)=>({value:+v.toFixed(1),itemStyle:{borderRadius:[10,10,0,0],color:VIGS[i]===S.vig?(e?e.c:C.verde):C.dim}}))}],
    graphic:[{type:'text',right:6,bottom:0,style:{text:'* corte octubre',fontSize:11,fill:C.gris}}]});
  tray.on('click',p=>setVig(+p.name));

  const ejesV=EJES.filter(x=>!S.eje||x.id===S.eje);
  chart($('#sem'),{tooltip:Object.assign({trigger:'axis',axisPointer:{type:'shadow'}},TT),legend:{top:0,right:0,icon:'roundRect',itemWidth:12,textStyle:{color:C.gris}},
    grid:{left:10,right:10,top:40,bottom:10,containLabel:true},
    xAxis:{type:'category',data:ejesV.map(x=>x.nombre),axisTick:{show:false},axisLine:{lineStyle:{color:C.axis}},axisLabel:{color:C.tinta,fontWeight:600,fontSize:13,interval:0}},
    yAxis:{type:'value',splitLine:{lineStyle:{color:C.grid}},axisLabel:{color:C.gris}},
    series:[{name:'Semestre 1',type:'bar',barMaxWidth:46,itemStyle:{borderRadius:[8,8,0,0],color:C.verde},label:{show:true,position:'top',fontWeight:800,color:C.tinta},data:ejesV.map(x=>g.acts.filter(a=>a.e===x.id&&a.s1>0).length)},
            {name:'Semestre 2',type:'bar',barMaxWidth:46,itemStyle:{borderRadius:[8,8,0,0],color:C.amarillo},label:{show:true,position:'top',fontWeight:800,color:C.tinta},data:ejesV.map(x=>g.acts.filter(a=>a.e===x.id&&a.s2>0).length)}]});

  const top=filtAcc().sort((a,b)=>b.c-a.c||b.nVis-a.nVis).slice(0,6);
  $('#rank').innerHTML=top.map((x,i)=>{const ej=ejeDe(x.e);return `<div class="it" data-acc="${x.a}"><span class="pos" style="background:${ej.c}">${i+1}</span><span class="nm">${x.a} ${esc(x.nom)}<small>${ej.nombre} · ${x.nVis} actividades</small></span><span class="v" style="color:${ej.ct}">${pct(x.c,0)}</span></div>`}).join('');
  $('#rank').onclick=ev=>{const it=ev.target.closest('[data-acc]');if(it)modalAcc(g.acc[it.dataset.acc])};

  const lt=LOGROS.map((L,i)=>[L,i]).filter(([L])=>L[0]===S.vig&&(!S.eje||L[1]===S.eje)).slice(0,4);
  $('#logrosTop').innerHTML=lt.map(([L,i])=>logroCard(L,i)).join('');
  $('#logrosTop').onclick=ev=>{const c=ev.target.closest('[data-lg]');if(c)modalLogro(LOGROS[+c.dataset.lg])};
}

/* ======================= VISTA: AVANCE ======================= */
function vAvance(v){
  const g=G(),accs=filtAcc();
  if(!S.acc||!accs.find(x=>x.a===S.acc))S.acc=accs.length?accs[0].a:null;
  v.innerHTML=`
  <div class="row c3" id="ejesBox"></div>
  <div class="row c32">
    <div class="card"><div class="ch"><div><h3>Cumplimiento por acción · ${vigTxt(S.vig)}</h3><p>Selecciona una barra para ver sus actividades</p></div><span class="hint"><i class="fa-solid fa-hand-pointer"></i>Interactivo</span></div><div class="chart" id="accChart" style="height:${Math.max(260,accs.length*30+20)}px"></div></div>
    <div class="card det"><div id="detA"></div></div>
  </div>
  <div class="row c2">
    <div class="card"><div class="ch"><div><h3>Comparativo por vigencia</h3><p id="subE"></p></div><div class="seg" id="segE"><button data-v="cumpl">Cumplimiento</button><button data-v="pond">Ponderado</button></div></div><div class="chart" id="ejeBar"></div></div>
    <div class="card"><div class="ch"><div><h3>Perfil de las acciones</h3><p>Cumplimiento por acción ${S.eje?'· '+ejeDe(S.eje).nombre:'de los tres ejes'} · ${vigTxt(S.vig)}</p></div></div><div class="chart" id="radar"></div></div>
  </div>`;
  $('#ejesBox').innerHTML=EJES.map(e=>{const s=g.ejes[e.id];return `<div class="card hov eje ${S.eje===e.id?'sel':''}" data-e="${e.id}" style="--c:${e.c};--ct:${e.ct};--cbg:${e.cbg}">
    <div class="eh"><i class="fa-solid ${e.icono}"></i><div><b>${e.nombre}</b><small>${e.largo}</small></div></div>
    <div class="big"><span style="color:var(--gris);font-size:13.5px">Cumplimiento ${S.vig}</span><span class="n" data-n="${s.cumpl}" data-d="1" data-suf=" %">0</span></div>
    <div class="prog"><span data-w="${s.cumpl}" style="width:0"></span></div>
    <div class="kv"><div><b>${s.gest} de ${e.nAcc}</b><small>acciones gestionadas</small></div><div><b>${pct(s.pond)}</b><small>avance ponderado</small></div><div><b>${pct(e.peso,1)}</b><small>peso del eje</small></div></div></div>`}).join('');
  $('#ejesBox').onclick=ev=>{const c=ev.target.closest('[data-e]');if(c)setEje(S.eje===+c.dataset.e?0:+c.dataset.e)};

  const mk=()=>accs.map(x=>({value:+x.c.toFixed(1),acc:x.a,itemStyle:{borderRadius:8,color:ejeDe(x.e).c,opacity:x.a===S.acc?1:.55,borderColor:x.a===S.acc?C.tinta:'transparent',borderWidth:x.a===S.acc?2:0}}));
  const ac=chart($('#accChart'),{tooltip:Object.assign({formatter:p=>{const x=g.acc[p.data.acc];return `<b>Acción ${x.a} · ${esc(x.nom)}</b><br>Cumplimiento: ${pct(x.c)}<br>${x.nVis} actividades con avance`}},TT),
    grid:{left:6,right:56,top:6,bottom:6,containLabel:true},xAxis:{type:'value',max:100,show:false},
    yAxis:{type:'category',inverse:true,data:accs.map(x=>x.a+'  '+x.nom),axisTick:{show:false},axisLine:{show:false},axisLabel:{color:C.tinta,fontWeight:600,fontSize:12.5}},
    series:[{type:'bar',barMaxWidth:22,showBackground:true,backgroundStyle:{color:C.track,borderRadius:8},label:{show:true,position:'right',color:C.tinta,fontWeight:800,color:C.tinta,formatter:p=>fmt(p.value,p.value%1?1:0)+' %'},data:mk()}]});
  ac.on('click',p=>{S.acc=p.data.acc;pintarDet();ac.setOption({series:[{data:mk()}]})});
  function pintarDet(){const x=g.acc[S.acc];if(!x){$('#detA').innerHTML='';return}const e=ejeDe(x.e);
    $('#detA').innerHTML=`<span class="pill" style="background:${e.cbg};color:${e.ct}">${e.nombre} · Acción ${x.a}</span><h4 style="margin-top:8px">${esc(x.nom)}</h4><p class="desc">${esc(x.txt)}</p>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><div style="font:800 34px Montserrat;color:${e.ct}">${pct(x.c)}</div><div style="flex:1">${progHTML(x.c,e.c)}<small style="color:var(--gris)">${x.nVis} actividades con avance</small></div></div>
      <div class="scroll">${detalleAcc(x)}</div>`;contar($('#detA'))}
  pintarDet();
  $('#detA').onclick=ev=>{const a=ev.target.closest('[data-act]');if(a)modalAct(ACT[+a.dataset.act])};

  const eb=chart($('#ejeBar'),{});
  function pintarEje(){const m=S.ejeModo;document.querySelectorAll('#segE button').forEach(b=>b.classList.toggle('on',b.dataset.v===m));
    $('#subE').textContent=m==='cumpl'?'Cumplimiento del plan de acción por eje y vigencia (%)':'Avance ponderado por eje y vigencia (%)';
    eb.setOption({tooltip:Object.assign({trigger:'axis',axisPointer:{type:'shadow'},valueFormatter:v=>pct(v)},TT),legend:{top:0,right:0,icon:'roundRect',itemWidth:12,textStyle:{color:C.gris}},
      grid:{left:10,right:10,top:40,bottom:10,containLabel:true},
      xAxis:{type:'category',data:EJES.map(e=>e.nombre),axisTick:{show:false},axisLine:{lineStyle:{color:C.axis}},axisLabel:{color:C.tinta,fontWeight:600,interval:0}},
      yAxis:{type:'value',show:false,max:118},
      series:VIGS.map((y,i)=>({name:vigTxt(y),type:'bar',barMaxWidth:30,label:{show:true,position:'top',fontSize:11,fontWeight:800,color:C.tinta,formatter:p=>fmt(p.value,0)},
        itemStyle:{borderRadius:[6,6,0,0],color:['#9FC3AC','#4F9A6C',C.verde][i]},
        data:EJES.map(e=>({value:+(m==='cumpl'?AGG[y].ejes[e.id].cumpl:AGG[y].ejes[e.id].pond).toFixed(1),itemStyle:{opacity:!S.eje||S.eje===e.id?1:.3}}))}))},true)}
  document.querySelectorAll('#segE button').forEach(b=>b.onclick=()=>{S.ejeModo=b.dataset.v;pintarEje()});pintarEje();

  const rl=accs.length>=3?accs:Object.values(g.acc).filter(x=>x.c>0);
  chart($('#radar'),{tooltip:Object.assign({},TT),radar:{indicator:rl.map(x=>({name:x.a,max:100})),radius:'70%',splitNumber:4,axisName:{color:C.gris,fontWeight:700},
    splitArea:{areaStyle:{color:C.sa}},splitLine:{lineStyle:{color:C.grid}},axisLine:{lineStyle:{color:C.grid}}},
    series:[{type:'radar',symbolSize:7,data:[{value:rl.map(x=>+x.c.toFixed(1)),name:'Cumplimiento (%)',areaStyle:{color:'rgba(5,91,42,.22)'},lineStyle:{color:S.eje?ejeDe(S.eje).c:C.verde,width:2.5},itemStyle:{color:S.eje?ejeDe(S.eje).c:C.verde}}]}]});
}

/* ======================= VISTA: LOGROS ======================= */
function vLogros(v){
  v.innerHTML=`<div class="tools"><label class="search"><i class="fa-solid fa-magnifying-glass" style="color:var(--gris)"></i><input id="q" type="search" placeholder="Buscar: PIAR, certificación, subsidio, tamizaje…" value="${esc(S.logQ)}"></label>
    <div class="chipset" id="cats"></div></div>
    <div class="row c4" id="lgGrid"></div>
    <div class="row c2"><div class="card"><div class="ch"><div><h3>Logros por categoría · ${vigTxt(S.vig)}</h3><p>Número de logros destacados</p></div></div><div class="chart" id="catChart"></div></div>
    <div class="card"><div class="ch"><div><h3>Personas atendidas por programa · 2026</h3><p>Cifras reportadas en la matriz y en el Plan de Desarrollo</p></div></div><div class="chart" id="cifras"></div></div></div>`;
  const cats=$('#cats');
  cats.innerHTML=[['','fa-border-all']].concat(CATS).map(([n,ic])=>`<button class="chip ${S.logCat===n?'on':''}" data-c="${esc(n)}"><i class="fa-solid ${ic}"></i>${n||'Todas'}</button>`).join('');
  cats.onclick=ev=>{const b=ev.target.closest('[data-c]');if(!b)return;S.logCat=b.dataset.c;cats.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===b));pintar()};
  $('#q').oninput=ev=>{S.logQ=ev.target.value;pintar()};
  function pintar(){const q=S.logQ.trim().toLowerCase();
    const L=LOGROS.map((x,i)=>[x,i]).filter(([x])=>x[0]===S.vig&&(!S.eje||x[1]===S.eje)&&(!S.logCat||x[3]===S.logCat)&&(!q||x.join(' ').toLowerCase().includes(q)));
    $('#lgGrid').innerHTML=L.length?L.map(([x,i])=>logroCard(x,i)).join(''):'<div class="card" style="grid-column:1/-1;text-align:center;color:var(--gris)">No hay logros que coincidan con la búsqueda.</div>'}
  pintar();
  $('#lgGrid').onclick=ev=>{const c=ev.target.closest('[data-lg]');if(c)modalLogro(LOGROS[+c.dataset.lg])};
  const base=LOGROS.filter(x=>x[0]===S.vig&&(!S.eje||x[1]===S.eje));
  const cc=chart($('#catChart'),{tooltip:Object.assign({},TT),grid:{left:6,right:40,top:6,bottom:6,containLabel:true},xAxis:{type:'value',show:false},
    yAxis:{type:'category',inverse:true,data:CATS.map(c=>c[0]),axisTick:{show:false},axisLine:{show:false},axisLabel:{color:C.tinta,fontWeight:600}},
    series:[{type:'bar',barMaxWidth:22,label:{show:true,position:'right',color:C.tinta,fontWeight:800},data:CATS.map((c,i)=>({value:base.filter(x=>x[3]===c[0]).length,itemStyle:{borderRadius:8,color:[C.verde,C.amarillo,C.azul,C.verde2,'#C9A100','#0F4C81'][i]}}))}]});
  cc.on('click',p=>{S.logCat=p.name;render()});
  chart($('#cifras'),{tooltip:Object.assign({valueFormatter:v=>fmt(v)},TT),series:[{type:'treemap',roam:false,nodeClick:false,breadcrumb:{show:false},width:'100%',height:'100%',
    label:{fontWeight:700,fontSize:12.5,formatter:p=>`${p.name}\n${fmt(p.value)}`},itemStyle:{borderColor:C.bd,borderWidth:3,gapWidth:3,borderRadius:8},
    data:ATN.map((x,i)=>({name:x[0],value:x[1],itemStyle:{color:[C.verde,C.verde2,'#2E8B57',C.amarillo,'#C9A100',C.azul,'#0F4C81','#4F9A6C','#7FA48C','#17588F'][i%10]}}))}]});
}

/* ======================= VISTA: POBLACIÓN ======================= */
function vPoblacion(v){
  const tot=POB.grupos.reduce((s,g)=>s+g.n,0);
  v.innerHTML=`
  <div class="row c4">
    <div class="card kpi hero"><i class="fa-solid fa-city deco"></i><div class="ki"><i class="fa-solid fa-city"></i></div><div class="n" data-n="${POB.hab}">0</div><div class="l">Habitantes del municipio</div></div>
    <div class="card kpi"><i class="fa-solid fa-wheelchair deco"></i><div class="ki"><i class="fa-solid fa-wheelchair"></i></div><div class="n" data-n="${POB.grupos[0].n}" data-pre="≈ ">0</div><div class="l">Personas con discapacidad atendidas</div></div>
    <div class="card kpi y"><i class="fa-solid fa-people-roof deco"></i><div class="ki"><i class="fa-solid fa-people-roof"></i></div><div class="n" data-n="${POB.grupos[1].n}" data-pre="≈ ">0</div><div class="l">Familias y cuidadores vinculados</div></div>
    <div class="card kpi r"><i class="fa-solid fa-people-group deco"></i><div class="ki"><i class="fa-solid fa-people-group"></i></div><div class="n" data-n="${tot}" data-pre="≈ ">0</div><div class="l">Personas vinculadas: ${pct(tot/POB.hab*100)} de los habitantes</div></div>
  </div>
  <div class="row c21">
    <div class="card"><div class="ch"><div><h3>Personas vinculadas a la política · 2026</h3><p>Cada figura representa 10 personas · pasa el cursor para ver el grupo</p></div></div>
      <div class="picto" id="picto"></div></div>
    <div class="card"><div class="ch"><div><h3>Composición</h3><p>≈ ${fmt(tot)} personas vinculadas</p></div></div><div class="chart md" id="comp"></div></div>
  </div>
  <div class="row c2">
    <div class="card"><div class="ch"><div><h3>Personas atendidas por programa</h3><p>Cifras reportadas · un mismo beneficiario puede estar en varios programas</p></div></div><div class="chart md" id="prog"></div></div>
    <div class="card"><div class="ch"><div><h3>Grupos atendidos</h3><p>Detalle de la estimación</p></div></div><div id="grupos"></div></div>
  </div>
  <div class="card" style="font-size:13.5px;color:var(--gris)"><i class="fa-solid fa-calculator" style="color:var(--verde)"></i> <b>Cómo se estima:</b> se parte de una población municipal de cerca de 28.000 habitantes y de las cifras reportadas en la matriz 2026 y en el Plan de Desarrollo (metas 296, 298 y 299). Como una misma persona participa en varios programas, se toma la población atendida de mayor cobertura en cada grupo y se suman los grupos distintos. Resultado: ≈ ${fmt(tot)} personas vinculadas, el ${pct(tot/POB.hab*100)} de los habitantes.</div>`;
  let k=0;
  $('#picto').innerHTML=POB.grupos.map(g=>{const n=Math.round(g.n/10);let ic='';for(let i=0;i<n;i++)ic+=`<i class="fa-solid ${g.i} on" title="${esc(g.g)}" style="color:${g.c};transition-delay:${(k++)*4}ms"></i>`;
    return `<div class="pg"><div class="pgh"><b style="color:${g.c===C.amarillo?C.amTxt:g.c}">${esc(g.g)}</b><span>≈ ${fmt(g.n)} personas</span></div><div class="pgi" style="grid-template-columns:repeat(17,1fr)">${ic}</div></div>`}).join('');
  chart($('#comp'),{tooltip:Object.assign({formatter:p=>`<b>${esc(p.name)}</b><br>≈ ${fmt(p.value)} personas (${fmt(p.percent,0)} %)`},TT),legend:{bottom:0,icon:'circle',itemWidth:9,textStyle:{color:C.gris}},
    series:[{type:'pie',radius:['44%','70%'],center:['50%','38%'],itemStyle:{borderColor:C.bd,borderWidth:3,borderRadius:8},label:{show:true,position:'inside',formatter:'{d}%',color:'#fff',fontWeight:800},
      data:POB.grupos.map(g=>({name:g.g,value:g.n,itemStyle:{color:g.c}}))}],
    graphic:[{type:'text',left:'center',top:'31%',style:{text:'≈ '+fmt(tot),fontSize:24,fontWeight:800,fontFamily:'Montserrat',fill:C.acc}},{type:'text',left:'center',top:'41%',style:{text:'personas',fontSize:12,fill:C.gris}}]});
  chart($('#prog'),{tooltip:Object.assign({valueFormatter:v=>fmt(v)},TT),grid:{left:6,right:50,top:6,bottom:6,containLabel:true},xAxis:{type:'value',show:false},
    yAxis:{type:'category',inverse:true,data:ATN.map(x=>x[0]),axisTick:{show:false},axisLine:{show:false},axisLabel:{color:C.tinta,fontWeight:600}},
    series:[{type:'bar',barMaxWidth:20,label:{show:true,position:'right',color:C.tinta,fontWeight:800,formatter:p=>fmt(p.value)},data:ATN.map((x,i)=>({value:x[1],itemStyle:{borderRadius:8,color:i%2?C.azul:C.verde}}))}]});
  $('#grupos').innerHTML=POB.grupos.map(g=>`<div class="meta"><span class="cod" style="background:${g.c};${g.c===C.amarillo?'color:#15201A':''}"><i class="fa-solid ${g.i}"></i></span><div><b>${esc(g.g)} · ≈ ${fmt(g.n)}</b><span>${esc(g.d)}</span></div></div>`).join('');
}

/* ======================= VISTA: ACTIVIDADES ======================= */
function vActividades(v){
  const deps=[...new Set(G().acts.map(a=>a.r))].sort();
  v.innerHTML=`<div class="tools">
    <label class="search"><i class="fa-solid fa-magnifying-glass" style="color:var(--gris)"></i><input id="aq" type="search" placeholder="Buscar actividad, código o responsable" value="${esc(S.actQ)}"></label>
    <select class="sel" id="adep" aria-label="Dependencia"><option value="">Todas las dependencias</option>${deps.map(d=>`<option ${S.actDep===d?'selected':''}>${esc(d)}</option>`).join('')}</select>
    <div class="stat-pills" id="ests"></div></div>
    <div class="card" style="padding:0"><div class="tbl-wrap"><table class="tbl"><thead><tr>
      <th data-s="cod">Código<i class="fa-solid fa-sort"></i></th><th data-s="d">Actividad ${S.vig}<i class="fa-solid fa-sort"></i></th><th data-s="r">Responsable<i class="fa-solid fa-sort"></i></th>
      <th data-s="p" class="num">Prog.<i class="fa-solid fa-sort"></i></th><th data-s="s1" class="num">Sem. 1<i class="fa-solid fa-sort"></i></th><th data-s="s2" class="num">Sem. 2<i class="fa-solid fa-sort"></i></th>
      <th data-s="c">Cumplimiento<i class="fa-solid fa-sort"></i></th><th data-s="est">Estado</th></tr></thead><tbody id="tb"></tbody></table></div></div>
    <div class="pager"><span id="pinfo"></span><div class="btns"><button id="prev"><i class="fa-solid fa-chevron-left"></i> Anterior</button><button id="next">Siguiente <i class="fa-solid fa-chevron-right"></i></button></div></div>`;
  const PS=12;
  function base(){const q=S.actQ.trim().toLowerCase();return filtAct().filter(a=>(!S.actDep||a.r===S.actDep)&&(!q||(a.cod+' '+a.d+' '+a.r+' '+(ACCN[a.a]||'')).toLowerCase().includes(q)))}
  function pintar(){
    const b=base();const cnt=ESTADOS.map(([n])=>b.filter(a=>estado(a.c)===n).length);
    $('#ests').innerHTML=`<button class="${!S.actEst?'on':''}" data-e=""><b>${b.length}</b><small>Todas</small></button>`+ESTADOS.map(([n,c],i)=>`<button class="${S.actEst===n?'on':''}" data-e="${n}"><b style="color:${c===C.amarillo?C.amTxt:c}">${cnt[i]}</b><small>${n}</small></button>`).join('');
    let rows=b.filter(a=>!S.actEst||estado(a.c)===S.actEst);
    const [k,dir]=S.sort;const key=a=>k==='est'?estado(a.c):a[k];
    rows.sort((x,y)=>{const A=key(x),B=key(y);if(typeof A==='number'||typeof B==='number')return((A??-1)-(B??-1))*dir;return String(A).localeCompare(String(B),'es',{numeric:true})*dir});
    const pages=Math.max(1,Math.ceil(rows.length/PS));S.page=Math.min(S.page,pages-1);
    const pr=rows.slice(S.page*PS,S.page*PS+PS);
    $('#tb').innerHTML=pr.length?pr.map(a=>{const e=ejeDe(a.e);return `<tr data-id="${a.id}"><td class="cod">${a.cod}</td><td>${esc(a.d)}<br><small style="color:var(--gris)">Acción ${a.a} · ${esc(ACCN[a.a]||'')}</small></td><td>${esc(a.r)}</td>
      <td class="num">${a.p==null?'—':fmt(a.p)}</td><td class="num">${fmt(a.s1)}</td><td class="num">${fmt(a.s2)}</td>
      <td><div class="cbar">${progHTML(a.c,e.c)}<b>${pct(a.c,0)}</b></div></td><td>${estPill(a.c)}</td></tr>`}).join(''):'<tr><td colspan="8" style="text-align:center;color:var(--gris);padding:30px">No hay actividades con estos filtros.</td></tr>';
    $('#pinfo').textContent=`Mostrando ${rows.length?S.page*PS+1:0}–${S.page*PS+pr.length} de ${rows.length} actividades · vigencia ${vigTxt(S.vig)}`;
    $('#prev').disabled=S.page===0;$('#next').disabled=S.page>=pages-1;
    document.querySelectorAll('.tbl th[data-s]').forEach(th=>{const i=th.querySelector('i');if(i)i.className='fa-solid '+(S.sort[0]===th.dataset.s?(S.sort[1]>0?'fa-sort-up':'fa-sort-down'):'fa-sort')});
    contar($('#tb'));
  }
  $('#aq').oninput=ev=>{S.actQ=ev.target.value;S.page=0;pintar()};
  $('#adep').onchange=ev=>{S.actDep=ev.target.value;S.page=0;pintar()};
  $('#ests').onclick=ev=>{const b=ev.target.closest('[data-e]');if(b){S.actEst=b.dataset.e;S.page=0;pintar()}};
  document.querySelectorAll('.tbl th[data-s]').forEach(th=>th.onclick=()=>{S.sort=[th.dataset.s,S.sort[0]===th.dataset.s?-S.sort[1]:1];pintar()});
  $('#prev').onclick=()=>{S.page--;pintar()};$('#next').onclick=()=>{S.page++;pintar()};
  $('#tb').onclick=ev=>{const tr=ev.target.closest('[data-id]');if(tr)modalAct(ACT[+tr.dataset.id])};
  pintar();
}

/* ======================= VISTA: DEPENDENCIAS ======================= */
function vDependencias(v){
  const fa=filtAct();const deps=[...new Set(fa.map(a=>a.r))].map(d=>{const xs=fa.filter(a=>a.r===d);return {d,n:xs.length,c:xs.reduce((s,a)=>s+a.c,0)/xs.length,ejes:[...new Set(xs.map(a=>a.e))].sort(),acc:new Set(xs.map(a=>a.a)).size}}).sort((a,b)=>b.n-a.n);
  if(!S.dep||!deps.find(d=>d.d===S.dep))S.dep=deps[0]&&deps[0].d;
  v.innerHTML=`<div class="row c2">
    <div class="card"><div class="ch"><div><h3>Actividades por dependencia · ${vigTxt(S.vig)}</h3><p>Selecciona una dependencia para ver su gestión</p></div><span class="hint"><i class="fa-solid fa-hand-pointer"></i>Interactivo</span></div><div class="chart" id="dep" style="height:${Math.max(240,deps.length*44+20)}px"></div></div>
    <div class="card"><div id="depDet"></div></div></div>
    <div class="row c12">
      <div class="card"><div class="ch"><div><h3>Plan de Desarrollo Territorial</h3><p>Metas de producto articuladas con la política</p></div></div>
        <div class="tri"><div style="background:var(--verde)"><span class="n">13</span><small>metas articuladas con la política</small></div><div style="background:var(--azul)"><span class="n">11</span><small>metas al 100 % de su meta anual</small></div><div style="background:var(--amarillo);color:var(--tinta)"><span class="n" style="font-size:18px;white-space:nowrap">$2.447 M</span><small>recursos asociados</small></div></div></div>
      <div class="card"><div class="ch"><div><h3>Metas cumplidas destacadas</h3><p>Metas del PDT que respaldan la atención a personas con discapacidad</p></div></div><div class="row c2" style="margin:0;gap:0 24px">${METAS.map(m=>`<div class="meta"><span class="cod">Meta ${m[0]}</span><div><b>${m[1]}</b><span>${m[2]}</span></div></div>`).join('')}</div></div>
    </div>`;
  const dc=chart($('#dep'),{});
  function pintarChart(){dc.setOption({tooltip:Object.assign({formatter:p=>{const d=deps[p.dataIndex];return `<b>${esc(d.d)}</b><br>${d.n} actividades · ${d.acc} acciones<br>Cumplimiento promedio: ${pct(d.c)}`}},TT),
    grid:{left:6,right:40,top:6,bottom:6,containLabel:true},xAxis:{type:'value',show:false},
    yAxis:{type:'category',inverse:true,data:deps.map(d=>d.d),axisTick:{show:false},axisLine:{show:false},axisLabel:{color:C.tinta,fontWeight:600,width:190,overflow:'break'}},
    series:[{type:'bar',barMaxWidth:22,label:{show:true,position:'right',color:C.tinta,fontWeight:800},
      data:deps.map((d,i)=>({value:d.n,itemStyle:{borderRadius:8,color:[C.verde,C.amarillo,C.azul][i%3],opacity:d.d===S.dep?1:.45,borderColor:d.d===S.dep?C.tinta:'transparent',borderWidth:d.d===S.dep?2:0}}))}]},true)}
  pintarChart();
  dc.on('click',p=>{S.dep=deps[p.dataIndex].d;pintarChart();pintarDet()});
  function pintarDet(){const d=deps.find(x=>x.d===S.dep);if(!d){$('#depDet').innerHTML='';return}const xs=fa.filter(a=>a.r===d.d);
    $('#depDet').innerHTML=`<span class="pill">Dependencia corresponsable · ${S.vig}</span><h3 style="margin:8px 0 0;font:800 20px Montserrat;color:var(--verde)">${esc(d.d)}</h3>
      <div class="dep-kpis"><div><b data-n="${d.n}">0</b><small>actividades</small></div><div><b data-n="${d.c}" data-d="1" data-suf=" %">0</b><small>cumplimiento promedio</small></div><div><b>${d.ejes.map(e=>`<span title="${ejeDe(e).largo}" style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${ejeDe(e).c};margin-right:4px"></span>`).join('')}</b><small>ejes en los que participa</small></div></div>
      <div class="scroll" style="max-height:330px">${xs.map(a=>`<div class="act" data-act="${a.id}" style="cursor:pointer"><span class="cod" style="font:700 12px Montserrat;color:var(--verde);min-width:52px">${a.cod}</span><span class="t">${esc(a.d)}</span>${estPill(a.c)}</div>`).join('')}</div>`;
    contar($('#depDet'))}
  pintarDet();
  $('#depDet').onclick=ev=>{const a=ev.target.closest('[data-act]');if(a)modalAct(ACT[+a.dataset.act])};
}

/* ======================= EVENTOS ======================= */
window.TABLERO={AGG,EJES,ACCN,ACC_TXT,LOGROS,POB,ATN,METAS,VIGS,S,PAL,ACT,VIS,fmt,pct,estado,vigTxt,ejeDe,toast};
barraUI();
addEventListener('hashchange',render);
addEventListener('resize',()=>charts.forEach(c=>c.resize()));
$('#cerrar').onclick=cerrar;$('#modal').onclick=ev=>{if(ev.target.id==='modal')cerrar()};
addEventListener('keydown',ev=>{if(ev.key==='Escape')cerrar()});
$('#modalBody').addEventListener('click',ev=>{const a=ev.target.closest('[data-act]');if(a)modalAct(ACT[+a.dataset.act])});
$('#burger').onclick=()=>{$('#sb').classList.add('open');$('#sbBack').classList.add('open')};
$('#sbBack').onclick=()=>{$('#sb').classList.remove('open');$('#sbBack').classList.remove('open')};
function iconoTema(){const b=$('#tema');b.innerHTML=`<i class="fa-solid ${TEMA==='dark'?'fa-sun':'fa-moon'}"></i>`;b.title=TEMA==='dark'?'Cambiar a tema claro':'Cambiar a tema oscuro'}
$('#tema').onclick=()=>{TEMA=TEMA==='dark'?'light':'dark';document.documentElement.dataset.theme=TEMA;try{localStorage.setItem('tema',TEMA)}catch(e){}
  aplicarPaleta();iconoTema();barraUI();render();toast(TEMA==='dark'?'Tema oscuro activado':'Tema claro activado')};
iconoTema();
$('#fs').onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();else document.exitFullscreen()};
if(!location.hash)history.replaceState(null,'','#/inicio');
render();
})();
