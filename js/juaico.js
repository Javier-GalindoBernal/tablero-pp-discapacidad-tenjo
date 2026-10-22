/* JUAICO · asistente conversacional del tablero de la PP de Discapacidad · Tenjo
   Motor de comprensión de lenguaje basado en reglas: identifica la intención y las entidades
   (vigencia, eje, línea, acción, dependencia, tema) y responde calculando sobre los datos del tablero. */
(function(){
'use strict';
const T=()=>window.TABLERO;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[¿?¡!,;:()"]/g,' ').replace(/(\d)\.(?=\d)/g,'$1§').replace(/\./g,' ').replace(/§/g,'.').replace(/\s+/g,' ').trim();
const NOMBRE='JUAICO';

/* ======================= BIBLIOTECA DE PREGUNTAS ======================= */
const PREGUNTAS=[
 ['Avance general','fa-gauge-high',['¿Cómo va la política en 2026?','Dame el resumen de 2025','Compara el avance de 2024, 2025 y 2026','¿Cuál es el avance ponderado de la política?']],
 ['Ejes y líneas','fa-layer-group',['Dame el avance de la línea estratégica 1.3','¿Cómo va el eje de educación e inclusión?','¿Qué eje tiene mayor cumplimiento?','¿Cuál es el peso de cada eje?']],
 ['Acciones','fa-list-check',['¿Cuáles son las acciones más rezagadas?','Dame las 5 acciones con mejor desempeño','¿Cómo va la acción 1.3.2?','¿Qué acciones mejoraron frente a 2025?','¿Qué acciones no tienen actividades programadas?']],
 ['Actividades','fa-clipboard-check',['¿Cuántas actividades están cumplidas?','¿Qué actividades siguen en avance?','¿Cómo fue la ejecución por semestre?','Busca actividades sobre subsidio monetario','¿Qué se ha hecho en certificación de discapacidad?']],
 ['Población','fa-people-group',['¿Cuál es la población beneficiada?','¿Cuántas personas con discapacidad se atienden?','¿Cuántos cuidadores se benefician?','¿Cuántos niños tuvieron tamizaje?']],
 ['Dependencias y PDT','fa-sitemap',['¿Qué dependencia tiene más actividades?','¿Cómo va la Línea de Educación Inclusiva?','¿Qué metas del Plan de Desarrollo se cumplieron?','¿Cuántos recursos tiene asociados la política?']],
 ['Logros y gestión','fa-trophy',['¿Cuáles son los principales logros de 2026?','Logros del eje de participación','¿Qué recomiendas priorizar?','¿Cómo se calcula el avance?','¿Qué es la política y cómo está organizada?','Genera el informe en PDF']]
];

/* ======================= ENTIDADES ======================= */
const TEMAS=[['subsidio','subsidio'],['piar','piar'],['certificac','certificaci'],['tamizaje','caracterizaci'],['caracterizac','caracterizaci'],['nutricion','nutricional'],['apoyos nutricionales','nutricional'],['deport','deport'],['inderten','inderten'],['cultura','cultur'],['artistic','artistic'],['capacitac','capacit'],['comite','comit'],['encuesta','encuesta'],['satisfaccion','satisfacci'],['aseguramiento','aseguramiento'],['afiliac','afiliaci'],['convenio','convenio'],['auditiva','auditiva'],['padres','padres'],['cuidador','cuidador'],['rlcpd','rlcpd'],['registro','registro'],['unidad de atencion','unidad de atenci'],['uai','uai'],['migrante','migrante'],['proteccion integral','protecci'],['institucionaliz','institucionaliz'],['docente','docente'],['funcionario','funcionario'],['pedagogic','pedag'],['semana de la discapacidad','semana de la discapacidad'],['neurodesarrollo','neurodesarrollo'],['valoracion','valoraci'],['difusion','difusi']];
const DEPS=[['educacion inclusiva','Línea de Educación Inclusiva'],['proteccion social','Protección Social · Programa de Discapacidad'],['programa de discapacidad','Protección Social · Programa de Discapacidad'],['aseguramiento','Aseguramiento en Salud'],['prensa','Prensa y Comunicaciones'],['comunicaciones','Prensa y Comunicaciones'],['planeacion','Planeación y Protección Social'],['infraestructura','Infraestructura y Obra Pública']];
function entidades(q){
  const e={};const m=q.match(/\b(2024|2025|2026)\b/g);if(m){e.vigs=[...new Set(m.map(Number))];e.vig=e.vigs[e.vigs.length-1]}
  let r=q.match(/\b([123])\.([13])\.(\d)\b/);if(r)e.acc=r[0];
  r=q.match(/\blinea( estrategica)?\s*(1\.3|2\.1|3\.1)\b/)||q.match(/\b(1\.3|2\.1|3\.1)\b(?!\.\d)/);if(r){const c=r[2]||r[1];e.eje=+c[0];e.linea=c}
  r=q.match(/\beje\s*(1|2|3|uno|dos|tres)\b/);if(r)e.eje={uno:1,dos:2,tres:3}[r[1]]||+r[1];
  if(!e.eje){if(/salud|rehabilit|habilitac/.test(q)&&!/aseguramiento|mental/.test(q))e.ejeK=1;else if(/educaci(o)?n e inclusion|eje de educacion|inclusion social|educacion/.test(q)&&!/educacion inclusiva/.test(q))e.ejeK=2;else if(/participacion|derecho|justicia|laboral/.test(q))e.ejeK=3}
  for(const [k,v] of DEPS)if(q.includes(k)){e.dep=v;break}
  r=q.match(/\b(top|primeras|principales)?\s*(\d{1,2})\s*(acciones|actividades|principales|primeras|mejores|logros)/)||q.match(/\btop\s*(\d{1,2})/);
  if(r){const n=+(r[2]||r[1]);if(n>0&&n<=22)e.n=n}
  e.temas=TEMAS.filter(([k])=>q.includes(k)).map(t=>t[1]);
  if(/cuidador|familia/.test(q))e.grupo=1;else if(/nin(o|a)s?|tamizaje|menores|infancia/.test(q))e.grupo=2;else if(/comunidad|docente|servidor|funcionario/.test(q))e.grupo=3;else if(/personas con discapacidad|pcd/.test(q))e.grupo=0;
  return e}

/* ======================= INTENCIONES ======================= */
const INT=[
 ['saludo',[['hola',3],['buenos dias',3],['buenas',3],['saludos',3],['gracias',3],['que tal',2]]],
 ['ayuda',[['ayuda',4],['que puedes',4],['que sabes',4],['que preguntas',4],['como funciona',3],['quien eres',4],['que eres',3]]],
 ['informe',[['informe',4],['pdf',5],['descargar',3],['reporte',3],['imprimir',3]]],
 ['metodologia',[['como se calcula',6],['metodologia',6],['formula',5],['calculo',4],['como se mide',6],['ponderad',2],['peso',3],['pesos',3]]],
 ['estructura',[['que es la politica',6],['estructura',5],['organizada',5],['cuantos ejes',6],['cuantas acciones',4],['componentes',4],['objetivo de la politica',5]]],
 ['tendencia',[['compara',5],['comparar',5],['comparativo',5],['evolucion',5],['tendencia',5],['trayectoria',5],['historico',5],['vigencias',3],[' vs ',4],['frente a',2],['entre 2024',4]]],
 ['mejora',[['mejoraron',7],['mejoro',7],['crecieron',6],['subieron',6],['aumentaron',6],['variacion',6],['cambio',3],['cambiaron',5]]],
 ['rezagadas',[['rezag',9],['menor avance',7],['menor cumplimiento',7],['mas bajo',6],['mas baja',6],['peor',6],['atrasad',7],['critica',5],['debil',5],['bajo desempeno',7],['retras',6],['menos avance',7],['oportunidad de mejora',6],['alerta',5]]],
 ['sinprog',[['sin actividades',8],['sin programacion',8],['no tienen actividades',8],['no programad',7],['sin gestion',7],['no gestionad',7],['faltan',4],['sin programar',8]]],
 ['mejores',[['mejor desempeno',7],['mejores',6],['mayor avance',6],['mas avanzad',6],['destacadas',4],['mayor cumplimiento',6],['lider',4],['al 100',5],['cien por ciento',5]]],
 ['recomendacion',[['recomiend',7],['recomendacion',7],['priorizar',7],['prioridad',6],['que hacer',5],['sugier',5],['siguientes pasos',6],['proximos pasos',6],['plan de choque',6]]],
 ['poblacion',[['poblacion',6],['beneficiad',6],['beneficiari',6],['personas',3],['cuantos',2],['cuantas personas',5],['atendid',4],['cobertura',4],['cuidador',4],['ninos',2],['tamizaje',3],['vinculad',4]]],
 ['pdt',[['plan de desarrollo',7],['pdt',7],['meta de producto',7],['metas',4],['recursos',6],['presupuesto',6],['inversion',6],['dinero',5]]],
 ['dependencia',[['dependencia',9],['secretaria',4],['responsable',5],['quien ejecuta',6],['entidades',4],['quienes',3]]],
 ['semestre',[['semestre',7],['primer semestre',8],['segundo semestre',8]]],
 ['logros',[['logro',8],['resultados',4],['hitos',6],['que se ha hecho',5],['que se logro',7],['avances destacados',6]]],
 ['actividades',[['actividad',4],['actividades',4],['cumplidas',3],['en avance',4],['pendientes',4],['en ejecucion',4],['cuantas actividades',6]]],
 ['accion',[['accion',4],['acciones',2]]],
 ['eje',[['eje',4],['ejes',4],['linea estrategica',6],['linea',3]]],
 ['resumen',[['avance ponderado',8],['resumen',6],['como va',5],['avance general',7],['avance de la politica',7],['estado',3],['balance',5],['cumplimiento',3],['avance',2],['general',2],['panorama',5]]]
];
function intencion(q,e){
  const sc={};INT.forEach(([id,kw])=>{sc[id]=kw.reduce((s,[k,w])=>s+(q.includes(k)?w:0),0)});
  if(e.acc)sc.accion+=6;
  if(e.eje&&!e.acc)sc.eje+=3;
  if(e.dep)sc.dependencia+=7;
  if(e.ejeK&&/eje|linea/.test(q))sc.eje+=3;
  if(e.temas.length&&/que se ha hecho|que se hizo|en que va|que hay de|que se hace/.test(q))sc.buscar=(sc.buscar||0)+8;
  if(e.temas.length&&!sc.poblacion)sc.buscar=(sc.buscar||0)+4;
  if(/(busca|buscar|sobre|relacionad|tema de)/.test(q)&&e.temas.length)sc.buscar=(sc.buscar||0)+5;
  if(/que eje/.test(q)&&/(mayor|mejor|mas)/.test(q)){sc.eje+=6;sc.mejores=0}
  let best=null,mx=0;Object.entries(sc).forEach(([k,v])=>{if(v>mx){mx=v;best=k}});
  return mx>=2?best:null}

/* ======================= COMPONENTES DE RESPUESTA ======================= */
const pct=(v,d=1)=>T().pct(v,d), fmt=(v,d=0)=>T().fmt(v,d);
const vigTxt=y=>T().vigTxt(y);
const ejeCol=id=>T().EJES[id-1].c;
const kpis=arr=>`<div class="ia-kpis">${arr.map(([v,l])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')}</div>`;
const barras=rows=>`<div class="ia-bars">${rows.map(([l,v,c,extra])=>`<div class="ia-bar"><span class="ia-bl">${l}</span><span class="ia-bt"><i style="width:${Math.max(2,Math.min(100,v))}%;background:${c}"></i></span><b>${pct(v,v%1?1:0)}</b>${extra?`<small>${extra}</small>`:''}</div>`).join('')}</div>`;
const nota=t=>`<p class="ia-nota"><i class="fa-solid fa-circle-info"></i> ${t}</p>`;
const ctxVig=y=>`<span class="ia-ctx">Vigencia ${vigTxt(y)}</span>`;
const accNom=a=>`${a} ${esc(T().ACCN[a]||'')}`;

/* ======================= RESPUESTAS ======================= */
const H={
 saludo(){return {html:`<p>¡Hola! Soy <b>${NOMBRE}</b>, el asistente del tablero de la Política Pública de Inclusión para Personas con Discapacidad de Tenjo. Puedo contarte el avance por vigencia, eje, línea o acción, la población beneficiada, los logros, las dependencias y las metas del Plan de Desarrollo.</p>`,chips:['¿Cómo va la política en 2026?','¿Cuáles son las acciones más rezagadas?','¿Cuál es la población beneficiada?']}},
 ayuda(){return {html:`<p>Soy <b>${NOMBRE}</b>. Respondo preguntas sobre el contenido del tablero calculando directamente con los datos de la matriz de seguimiento (vigencias 2024, 2025 y 2026). Puedes preguntarme, por ejemplo:</p><ul class="ia-ul">${PREGUNTAS.map(c=>`<li><b>${c[0]}:</b> ${esc(c[2][0])}</li>`).join('')}</ul><p>Si no indicas la vigencia, uso la que está seleccionada en el tablero.</p>`,chips:['Ver todas las preguntas'],todas:true}},
 resumen(e){const y=e.vig,g=T().AGG[y];const v=g.acts.filter(T().VIS);const cumplidas=v.filter(a=>a.c>=100).length;
  const ord=T().EJES.map(x=>({x,c:g.ejes[x.id].cumpl})).sort((a,b)=>b.c-a.c);
  return {html:`${ctxVig(y)}<p>En <b>${vigTxt(y)}</b> el plan de acción alcanza un cumplimiento de <b>${pct(g.cumpl)}</b>, con <b>${g.gest} de 22</b> acciones gestionadas y <b>${v.length}</b> actividades con avance; <b>${cumplidas}</b> de ellas ya están al 100 %.</p>
   ${kpis([[pct(g.cumpl),'cumplimiento'],[pct(g.pond),'avance ponderado'],[`${g.gest}/22`,'acciones'],[String(v.length),'actividades']])}
   ${barras(T().EJES.map(x=>[x.nombre,g.ejes[x.id].cumpl,x.c]))}
   <p>El eje con mayor cumplimiento es <b>${ord[0].x.largo}</b> (${pct(ord[0].c)}).</p>${y===2026?nota('La vigencia 2026 tiene corte a octubre; varias actividades del segundo semestre siguen en ejecución.'):''}`,
   chips:['Compara el avance de 2024, 2025 y 2026','¿Cuáles son las acciones más rezagadas?','¿Cuáles son los principales logros de '+y+'?'],ir:{label:'Ver resumen en el tablero',vig:y,ruta:'inicio'}}},
 eje(e){const y=e.vig,g=T().AGG[y];const id=e.eje||e.ejeK;
  if(!id){const ord=T().EJES.map(x=>({x,s:g.ejes[x.id]})).sort((a,b)=>b.s.cumpl-a.s.cumpl);
   return {html:`${ctxVig(y)}<p>Así va cada eje (y su línea estratégica) en <b>${vigTxt(y)}</b>. El de mayor cumplimiento es <b>${ord[0].x.largo}</b> con <b>${pct(ord[0].s.cumpl)}</b>.</p>
    <table class="ia-tbl"><tr><th>Eje · línea</th><th>Peso</th><th>Acciones</th><th>Cumpl.</th></tr>${T().EJES.map(x=>{const s=g.ejes[x.id];return `<tr><td><span class="ia-dot" style="background:${x.c}"></span>${x.id}. ${esc(x.nombre)} · L${['1.3','2.1','3.1'][x.id-1]}</td><td>${pct(x.peso,1)}</td><td>${s.gest}/${x.nAcc}</td><td><b>${pct(s.cumpl)}</b></td></tr>`}).join('')}</table>`,
    chips:['Dame el avance de la línea estratégica 1.3','¿Cómo va el eje de educación e inclusión?','¿Cuál es el peso de cada eje?']}}
  const x=T().ejeDe(id),s=g.ejes[id];const accs=Object.values(g.acc).filter(a=>a.e===id).sort((a,b)=>a.a.localeCompare(b.a,undefined,{numeric:true}));
  const tray=T().VIGS.map(v=>`${vigTxt(v)}: <b>${pct(T().AGG[v].ejes[id].cumpl)}</b>`).join(' · ');
  return {html:`${ctxVig(y)}<p><b>Eje ${id} · ${esc(x.largo)}</b> (línea estratégica ${['1.3','2.1','3.1'][id-1]}): cumplimiento de <b>${pct(s.cumpl)}</b>, con ${s.gest} de ${x.nAcc} acciones gestionadas y un avance ponderado de ${pct(s.pond)}. Peso en la política: ${pct(x.peso,1)}.</p>
   ${barras(accs.map(a=>[accNom(a.a),a.c,x.c]))}<p class="ia-sub">Trayectoria: ${tray}</p>`,
   chips:[`¿Cuáles son las acciones más rezagadas del eje ${id}?`,`Logros del eje ${id} en ${y}`,'¿Qué eje tiene mayor cumplimiento?'],ir:{label:'Ver eje en el tablero',vig:y,eje:id,ruta:'avance'}}},
 accion(e){const y=e.vig,g=T().AGG[y];
  if(!e.acc)return H.eje(e);
  const a=g.acc[e.acc];const txt=T().ACC_TXT[e.acc];
  if(!a)return {html:`${ctxVig(y)}<p>La acción <b>${accNom(e.acc)}</b> no tiene actividades programadas en ${vigTxt(y)}.</p>${txt?`<p class="ia-sub">${esc(txt)}</p>`:''}`,chips:T().VIGS.filter(v=>v!==y).map(v=>`¿Cómo va la acción ${e.acc} en ${v}?`)};
  const prev=T().VIGS.filter(v=>v<y&&T().AGG[v].acc[e.acc]).pop();
  return {html:`${ctxVig(y)}<p><b>Acción ${accNom(e.acc)}</b> · cumplimiento <b>${pct(a.c)}</b>${prev?` (en ${prev}: ${pct(T().AGG[prev].acc[e.acc].c)})`:''}.</p><p class="ia-sub">${esc(txt)}</p>
   <ul class="ia-acts">${a.acts.map(x=>`<li><span>${esc(x.d)}</span><small>${esc(x.r)} · ${fmt(x.s1+x.s2)} de ${x.p==null?'—':fmt(x.p)} · <b>${pct(x.c,0)}</b> · ${T().estado(x.c)}</small></li>`).join('')}</ul>`,
   chips:['¿Cuáles son las acciones más rezagadas?','Dame las 5 acciones con mejor desempeño'],accion:{y,acc:e.acc}}},
 rezagadas(e){const y=e.vig,g=T().AGG[y];const id=e.eje||e.ejeK;const n=e.n||5;
  const L=Object.values(g.acc).filter(a=>(!id||a.e===id)&&a.c<100).sort((a,b)=>a.c-b.c).slice(0,n);
  if(!L.length)return {html:`${ctxVig(y)}<p>¡Buenas noticias! En ${vigTxt(y)}${id?' el eje '+id:''} todas las acciones gestionadas están al 100 %.</p>`,chips:['¿Qué acciones no tienen actividades programadas?']};
  const pend=g.acts.filter(a=>(!id||a.e===id)&&a.c<100).length;
  return {html:`${ctxVig(y)}<p>Estas son las <b>${L.length}</b> acciones con menor cumplimiento en <b>${vigTxt(y)}</b>${id?' en el eje '+id:''} (mayor oportunidad de avance):</p>
   ${barras(L.map(a=>[accNom(a.a),a.c,ejeCol(a.e),`${a.acts.filter(x=>x.c<100).length} actividad(es) en avance`]))}
   <p>En total hay <b>${pend}</b> actividades por debajo del 100 %.</p>${y===2026?nota('Al corte de octubre, buena parte de estas actividades tiene programado el segundo semestre; su cumplimiento debería subir al cierre de la vigencia.'):''}`,
   chips:[`¿Cómo va la acción ${L[0].a}?`,'¿Qué recomiendas priorizar?','¿Qué actividades siguen en avance?'],ir:{label:'Ver acciones en el tablero',vig:y,eje:id||0,ruta:'avance'}}},
 mejores(e){const y=e.vig,g=T().AGG[y];const id=e.eje||e.ejeK;const n=e.n||5;
  const L=Object.values(g.acc).filter(a=>(!id||a.e===id)&&a.c>0).sort((a,b)=>b.c-a.c||b.nVis-a.nVis).slice(0,n);
  const al100=Object.values(g.acc).filter(a=>(!id||a.e===id)&&a.c>=100).length;
  return {html:`${ctxVig(y)}<p>Las <b>${L.length}</b> acciones con mejor desempeño en <b>${vigTxt(y)}</b>${id?' en el eje '+id:''}. En total, <b>${al100}</b> acciones están al 100 %.</p>${barras(L.map(a=>[accNom(a.a),a.c,ejeCol(a.e),`${a.nVis} actividad(es)`]))}`,
   chips:['¿Cuáles son las acciones más rezagadas?','¿Cuáles son los principales logros de '+y+'?']}},
 sinprog(e){const y=e.vig,g=T().AGG[y];const todas=Object.keys(T().ACCN);const L=todas.filter(a=>!g.acc[a]);
  return {html:`${ctxVig(y)}${L.length?`<p>En <b>${vigTxt(y)}</b> hay <b>${L.length}</b> acción(es) sin actividades programadas:</p><ul class="ia-ul">${L.map(a=>`<li><b>${accNom(a)}</b><br><small>${esc(T().ACC_TXT[a]||'')}</small></li>`).join('')}</ul><p>Programarlas en la siguiente vigencia aumentaría el avance ponderado de la política.</p>`:`<p>En ${vigTxt(y)} todas las 22 acciones tienen actividades programadas.</p>`}`,
   chips:['¿Qué recomiendas priorizar?','¿Cuál es el avance ponderado de la política?']}},
 tendencia(e){const id=e.eje||e.ejeK;const V=T().VIGS;
  const row=v=>id?T().AGG[v].ejes[id]:T().AGG[v];
  return {html:`<p>Evolución del cumplimiento ${id?'del eje '+id+' · '+esc(T().ejeDe(id).nombre):'de la política'}:</p>
   <table class="ia-tbl"><tr><th>Vigencia</th><th>Cumplimiento</th><th>Ponderado</th><th>Acciones</th></tr>${V.map(v=>{const r=row(v);return `<tr><td>${vigTxt(v)}</td><td><b>${pct(r.cumpl)}</b></td><td>${pct(r.pond)}</td><td>${r.gest}</td></tr>`}).join('')}</table>
   ${id?'':barras(V.map(v=>[vigTxt(v),T().AGG[v].cumpl,v===2026?'#055B2A':'#7FA48C']))}
   ${nota('2025 cerró con 100 % de cumplimiento. 2026 tiene corte a octubre y aún se ejecuta el segundo semestre.')}`,
   chips:['¿Qué acciones mejoraron frente a 2025?','¿Qué eje tiene mayor cumplimiento?']}},
 mejora(e){const fr=e.q.match(/frente a(l)?( ano)? (20\d\d)/);let p,y;if(fr){p=+fr[3];const o=(e.vigs||[]).filter(v=>v!==p);y=o.length?Math.max(...o):(T().S.vig>p?T().S.vig:p+1)}else{y=e.vig===2024?2025:e.vig;p=(e.vigs&&e.vigs.length>1)?Math.min(...e.vigs):y-1}if(y>2026)y=2026;const A=T().AGG[y].acc,B=T().AGG[p]&&T().AGG[p].acc;
  if(!B)return {html:'<p>No tengo una vigencia anterior para comparar.</p>'};
  const L=Object.keys(A).filter(k=>B[k]).map(k=>({a:k,d:A[k].c-B[k].c,c:A[k].c,o:B[k].c,e:A[k].e}));
  const up=L.filter(x=>x.d>0.05).sort((a,b)=>b.d-a.d),same=L.filter(x=>Math.abs(x.d)<=0.05&&x.c>=100);
  let extra='';if(!up.length&&p>2024&&T().AGG[2024]){const C2=T().AGG[2024].acc;const u2=Object.keys(A).filter(k=>C2[k]&&A[k].c-C2[k].c>0.05).map(k=>({a:k,o:C2[k].c,c:A[k].c,d:A[k].c-C2[k].c})).sort((a,b)=>b.d-a.d);
    if(u2.length)extra=`<p>Frente a <b>2024</b>, <b>${u2.length}</b> acciones aumentaron su cumplimiento:</p><ul class="ia-ul">${u2.map(x=>`<li><b>${accNom(x.a)}</b>: ${pct(x.o,0)} → <b>${pct(x.c,0)}</b> (+${fmt(x.d,1)} pts)</li>`).join('')}</ul>`}
  return {html:`<p>Comparación de <b>${vigTxt(y)}</b> frente a <b>${p}</b>:</p>${up.length?`<p><b>${up.length}</b> acciones aumentaron su cumplimiento:</p><ul class="ia-ul">${up.map(x=>`<li><b>${accNom(x.a)}</b>: ${pct(x.o,0)} → <b>${pct(x.c,0)}</b> (+${fmt(x.d,1)} pts)</li>`).join('')}</ul>`:(p===2025?'<p>2025 cerró con todas sus acciones gestionadas al 100 %, por lo que no hay aumentos frente a esa vigencia.</p>':'<p>No hay acciones con aumento de cumplimiento en esta comparación.</p>')}${extra}
   <p><b>${same.length}</b> acciones se mantuvieron al 100 % en ambas vigencias.</p>${y===2026?nota('2026 tiene corte a octubre: las variaciones negativas frente a 2025 corresponden sobre todo a actividades del segundo semestre aún en ejecución.'):''}`,
   chips:['Compara el avance de 2024, 2025 y 2026','¿Cuáles son las acciones más rezagadas?']}},
 recomendacion(e){const y=e.vig,g=T().AGG[y];const low=Object.values(g.acc).filter(a=>a.c<100).sort((a,b)=>a.c-b.c).slice(0,3);
  const sin=Object.keys(T().ACCN).filter(a=>!g.acc[a]);const s2=g.acts.filter(a=>a.c<100&&!a.s2).length;
  const items=[];
  if(low.length)items.push(`<b>Acelerar las acciones con menor cumplimiento:</b> ${low.map(a=>`${accNom(a.a)} (${pct(a.c,0)})`).join(', ')}.`);
  if(y===2026&&s2)items.push(`<b>Registrar la ejecución del segundo semestre</b> en ${s2} actividades que aún no la reportan, para reflejar el avance real al cierre.`);
  if(sin.length)items.push(`<b>Programar actividades</b> para ${sin.map(a=>accNom(a)).join(', ')}, que no tienen acciones en ${vigTxt(y)}.`);
  items.push('<b>Mantener las acciones al 100 %</b> como subsidio monetario, aseguramiento en salud, PIAR y capacitación en inclusión, que sostienen el resultado de la política.');
  items.push('<b>Actualizar la caracterización (RLCPD)</b> para estimar la cobertura frente al total de personas con discapacidad del municipio.');
  return {html:`${ctxVig(y)}<p>Con base en los datos de ${vigTxt(y)}, sugiero priorizar:</p><ol class="ia-ul">${items.map(i=>`<li>${i}</li>`).join('')}</ol>${nota('Son sugerencias automáticas a partir de los datos del tablero; deben validarse con el equipo de la política.')}`,
   chips:['¿Cuáles son las acciones más rezagadas?','¿Qué actividades siguen en avance?']}},
 poblacion(e){const P=T().POB;const tot=P.grupos.reduce((s,g)=>s+g.n,0);
  if(e.grupo!=null){const g=P.grupos[e.grupo];return {html:`<p><b>${esc(g.g)}:</b> aproximadamente <b>${fmt(g.n)}</b> personas en 2026.</p><p class="ia-sub">${esc(g.d)}</p>${nota('Estimación que descuenta la participación de una misma persona en varios programas.')}`,chips:['¿Cuál es la población beneficiada?','¿Cuántas personas con discapacidad se atienden?']}}
  return {html:`<p>En 2026 la política vincula aproximadamente a <b>${fmt(tot)} personas</b>, el <b>${pct(tot/P.hab*100)}</b> de los ${fmt(P.hab)} habitantes de Tenjo:</p>
   ${kpis(P.grupos.map(g=>['≈ '+fmt(g.n),g.g]))}
   <p class="ia-sub">Programas con mayor alcance: ${T().ATN.slice(0,5).map(x=>`${esc(x[0])} (${fmt(x[1])})`).join(', ')}.</p>${nota('Estimación con base en la matriz 2026 y en las metas 296, 298 y 299 del Plan de Desarrollo.')}`,
   chips:['¿Cuántos cuidadores se benefician?','¿Cuántos niños tuvieron tamizaje?'],ir:{label:'Ver población en el tablero',ruta:'poblacion'}}},
 dependencia(e){const y=e.vig,g=T().AGG[y];const V=g.acts.filter(T().VIS);
  const deps=[...new Set(V.map(a=>a.r))].map(d=>{const xs=V.filter(a=>a.r===d);return {d,n:xs.length,c:xs.reduce((s,a)=>s+a.c,0)/xs.length,xs}}).sort((a,b)=>b.n-a.n);
  if(e.dep){const d=deps.find(x=>x.d===e.dep);if(!d)return {html:`${ctxVig(y)}<p>${esc(e.dep)} no tiene actividades con avance en ${vigTxt(y)}.</p>`};
   return {html:`${ctxVig(y)}<p><b>${esc(d.d)}</b>: ${d.n} actividades con avance y un cumplimiento promedio de <b>${pct(d.c)}</b>.</p><ul class="ia-acts">${d.xs.map(x=>`<li><span>${esc(x.d)}</span><small>${x.cod} · ${pct(x.c,0)} · ${T().estado(x.c)}</small></li>`).join('')}</ul>`,chips:['¿Qué dependencia tiene más actividades?'],ir:{label:'Ver dependencias',vig:y,ruta:'dependencias'}}}
  return {html:`${ctxVig(y)}<p>La dependencia con más actividades en ${vigTxt(y)} es <b>${esc(deps[0].d)}</b> (${deps[0].n}).</p><table class="ia-tbl"><tr><th>Dependencia</th><th>Activ.</th><th>Cumpl.</th></tr>${deps.map(d=>`<tr><td>${esc(d.d)}</td><td>${d.n}</td><td><b>${pct(d.c)}</b></td></tr>`).join('')}</table>`,
   chips:['¿Cómo va la Línea de Educación Inclusiva?','¿Cómo va Aseguramiento en Salud?'],ir:{label:'Ver dependencias',vig:y,ruta:'dependencias'}}},
 semestre(e){const y=e.vig,g=T().AGG[y];
  const r=T().EJES.map(x=>[x,g.acts.filter(a=>a.e===x.id&&a.s1>0).length,g.acts.filter(a=>a.e===x.id&&a.s2>0).length]);
  const t1=r.reduce((s,x)=>s+x[1],0),t2=r.reduce((s,x)=>s+x[2],0);
  return {html:`${ctxVig(y)}<p>En <b>${vigTxt(y)}</b>, <b>${t1}</b> actividades reportan ejecución en el primer semestre y <b>${t2}</b> en el segundo.</p><table class="ia-tbl"><tr><th>Eje</th><th>Sem. 1</th><th>Sem. 2</th></tr>${r.map(([x,a,b])=>`<tr><td><span class="ia-dot" style="background:${x.c}"></span>${esc(x.nombre)}</td><td>${a}</td><td>${b}</td></tr>`).join('')}</table>${y===2026?nota('El segundo semestre de 2026 está en curso (corte octubre).'):''}`,chips:['¿Qué actividades siguen en avance?']}},
 actividades(e){const y=e.vig,g=T().AGG[y];const id=e.eje||e.ejeK;const V=g.acts.filter(a=>T().VIS(a)&&(!id||a.e===id));
  const c=V.filter(a=>a.c>=100),p=V.filter(a=>a.c<100);const q=e.q;
  const wantP=/avance|pendiente|ejecucion|faltan|curso/.test(q);
  const lista=(wantP?p:c).slice(0,8);
  return {html:`${ctxVig(y)}<p>En <b>${vigTxt(y)}</b>${id?' (eje '+id+')':''} hay <b>${V.length}</b> actividades con avance: <b>${c.length}</b> cumplidas y <b>${p.length}</b> en avance.</p>
   ${kpis([[String(c.length),'cumplidas'],[String(p.length),'en avance'],[pct(V.length?c.length/V.length*100:0,0),'cumplidas del total']])}
   <p class="ia-sub">${wantP?'Actividades en avance':'Algunas actividades cumplidas'}:</p><ul class="ia-acts">${lista.map(x=>`<li><span>${esc(x.d)}</span><small>${x.cod} · ${esc(x.r)} · <b>${pct(x.c,0)}</b></small></li>`).join('')}</ul>`,
   chips:[wantP?'¿Cuántas actividades están cumplidas?':'¿Qué actividades siguen en avance?','¿Cómo fue la ejecución por semestre?'],ir:{label:'Abrir el explorador',vig:y,eje:id||0,ruta:'actividades'}}},
 logros(e){const y=e.vig;const id=e.eje||e.ejeK;let L=T().LOGROS.filter(l=>l[0]===y&&(!id||l[1]===id));
  if(!L.length)L=T().LOGROS.filter(l=>l[0]===y);
  return {html:`${ctxVig(y)}<p>Principales logros de <b>${vigTxt(y)}</b>${id?' en el eje '+id:''}:</p><ul class="ia-logros">${L.slice(0,e.n||6).map(l=>`<li><b style="color:${ejeCol(l[1])}">${esc(l[4])}</b> <small>${esc(l[5])}</small><span>${esc(l[6])}</span></li>`).join('')}</ul>`,
   chips:T().VIGS.filter(v=>v!==y).map(v=>`¿Cuáles son los principales logros de ${v}?`),ir:{label:'Ver logros',vig:y,eje:id||0,ruta:'logros'}}},
 pdt(){return {html:`<p>La política se articula con <b>13 metas de producto</b> del Plan de Desarrollo Territorial; <b>11</b> alcanzaron el 100 % de su meta anual en el último reporte consolidado, con recursos asociados por cerca de <b>$2.447 millones</b>.</p><ul class="ia-ul">${T().METAS.map(m=>`<li><b>Meta ${m[0]} · ${esc(m[1])}:</b> ${esc(m[2])}</li>`).join('')}</ul>`,chips:['¿Qué dependencia tiene más actividades?'],ir:{label:'Ver Dependencias y PDT',ruta:'dependencias'}}},
 metodologia(){return {html:`<p>Así se calcula el avance en el tablero:</p><ol class="ia-ul"><li><b>Actividad:</b> ejecución del semestre 1 + semestre 2 sobre lo programado, con un máximo de 100 %.</li><li><b>Acción:</b> promedio de sus actividades.</li><li><b>Cumplimiento del plan:</b> promedio de las acciones gestionadas en la vigencia.</li><li><b>Avance ponderado:</b> cumplimiento de cada eje (sobre todas sus acciones) multiplicado por su peso oficial: ${T().EJES.map(x=>`${esc(x.nombre)} ${pct(x.peso,2)}`).join(', ')}.</li></ol>`,chips:['¿Cuál es el avance ponderado de la política?']}},
 estructura(){return {html:`<p>La <b>Política Pública de Inclusión para Personas con Discapacidad y sus Familias</b> de Tenjo se organiza en <b>3 ejes</b>, cada uno con una línea estratégica, y <b>22 acciones</b>:</p><ul class="ia-ul">${T().EJES.map(x=>`<li><span class="ia-dot" style="background:${x.c}"></span><b>Eje ${x.id} · ${esc(x.largo)}</b> · línea ${['1.3','2.1','3.1'][x.id-1]} · ${x.nAcc} acciones · peso ${pct(x.peso,1)}</li>`).join('')}</ul><p>El tablero hace seguimiento a las vigencias 2024, 2025 y 2026.</p>`,chips:['Dame el avance de la línea estratégica 2.1','¿Cómo se calcula el avance?']}},
 informe(e){return {html:`<p>Puedo llevarte a la página de <b>Informes PDF</b>, donde eliges vigencia, eje y secciones y descargas el informe de avance en tamaño carta.</p>`,ir:{label:'Ir a Informes PDF',vig:e.vig,ruta:'informes'}}},
 buscar(e){const y=e.vig,g=T().AGG[y];const terms=e.temas.length?e.temas:e.q.split(' ').filter(w=>w.length>4);
  const hit=a=>{const t=norm(a.d+' '+a.r+' '+(T().ACC_TXT[a.a]||''));return terms.some(k=>t.includes(k))};
  let L=g.acts.filter(a=>T().VIS(a)&&hit(a));let yy=y;
  if(!L.length){for(const v of [...T().VIGS].reverse()){const x=T().AGG[v].acts.filter(a=>T().VIS(a)&&hit(a));if(x.length){L=x;yy=v;break}}}
  const lg=T().LOGROS.filter(l=>terms.some(k=>norm(l.join(' ')).includes(k)));
  if(!L.length&&!lg.length)return null;
  return {html:`${ctxVig(yy)}<p>Encontré <b>${L.length}</b> actividad(es) relacionadas en ${vigTxt(yy)}:</p><ul class="ia-acts">${L.slice(0,6).map(x=>`<li><span>${esc(x.d)}</span><small>${x.cod} · ${esc(x.r)} · ${fmt(x.s1+x.s2)} de ${x.p==null?'—':fmt(x.p)} · <b>${pct(x.c,0)}</b></small></li>`).join('')}</ul>${lg.length?`<p class="ia-sub">Logros relacionados: ${lg.slice(0,3).map(l=>`<b>${esc(l[4])} ${esc(l[5])}</b> ${esc(l[6]).toLowerCase()} (${l[0]})`).join('; ')}.</p>`:''}`,
   chips:['¿Cuál es la población beneficiada?','¿Cuáles son las acciones más rezagadas?']}}
};

/* ======================= MOTOR ======================= */
let ctx={};
function responder(texto){
  const q=norm(texto);if(!q)return null;
  if(/ver todas las preguntas|todas las preguntas|lista de preguntas/.test(q))return {html:'<p>Estas son las preguntas que puedes hacerme. Toca cualquiera para enviarla:</p>',todas:true};
  const e=entidades(q);e.q=q;
  const S=T().S;
  let it=intencion(q,e);
  if(!it&&(e.vigs||e.eje||e.acc||e.ejeK)&&ctx.it&&!['saludo','ayuda'].includes(ctx.it)){it=ctx.it;if(!e.vig)e.vig=ctx.vig;if(!e.eje&&!e.ejeK&&ctx.eje&&!e.acc)e.eje=ctx.eje;if(!e.acc&&ctx.acc&&it==='accion')e.acc=ctx.acc}
  if(!e.vig)e.vig=S.vig;
  if(it==='accion'&&!e.acc&&ctx.acc&&/(esa|esta|la misma)/.test(q))e.acc=ctx.acc;
  let r=null;
  if(it&&H[it])r=H[it](e);
  if(!r&&(e.temas.length||q.split(' ').length>1))r=H.buscar(e);
  if(!r)return {html:`<p>No estoy seguro de haber entendido. Puedo responder sobre avance por vigencia, eje, línea o acción, acciones rezagadas o destacadas, población beneficiada, logros, dependencias y metas del Plan de Desarrollo.</p>`,chips:['¿Cómo va la política en 2026?','¿Cuáles son las acciones más rezagadas?','Ver todas las preguntas']};
  ctx={it,vig:e.vig,eje:e.eje||e.ejeK||ctx.eje,acc:e.acc||ctx.acc};
  r._it=it;return r}
window.incluResponder=responder;

/* ======================= INTERFAZ ======================= */
function montar(){
  const fab=document.createElement('button');fab.className='ia-fab';fab.id='iaFab';fab.setAttribute('aria-label','Abrir el asistente '+NOMBRE);
  fab.innerHTML=`<img src="assets/juaico.svg" alt=""><span class="ia-fab-txt"><b>Pregúntale a ${NOMBRE}</b><small>Asistente del tablero</small></span>`;
  const pnl=document.createElement('section');pnl.className='ia-pnl';pnl.id='iaPnl';pnl.setAttribute('aria-label','Asistente '+NOMBRE);
  pnl.innerHTML=`<header class="ia-h"><img src="assets/juaico.svg" alt=""><div><b>${NOMBRE}</b><small><span class="ia-on"></span>Asistente de la PP de Discapacidad</small></div>
     <button class="ia-hb" id="iaLib" title="Preguntas sugeridas"><i class="fa-solid fa-lightbulb"></i></button><button class="ia-hb" id="iaClr" title="Nueva conversación"><i class="fa-solid fa-rotate-left"></i></button><button class="ia-hb" id="iaX" title="Cerrar"><i class="fa-solid fa-xmark"></i></button></header>
   <div class="ia-msgs" id="iaMsgs" aria-live="polite"></div>
   <div class="ia-lib" id="iaLibBox" hidden></div>
   <form class="ia-in" id="iaForm"><input id="iaQ" autocomplete="off" placeholder="Pregúntale a ${NOMBRE}… ej. avance de la acción 1.3.4" aria-label="Escribe tu pregunta"><button aria-label="Enviar"><i class="fa-solid fa-paper-plane"></i></button></form>
   <div class="ia-foot">Responde con los datos del tablero · no envía información a servidores</div>`;
  document.body.append(fab,pnl);
  const msgs=$('#iaMsgs');
  const abrir=()=>{pnl.classList.add('on');fab.classList.add('off');if(!msgs.children.length)bienvenida();setTimeout(()=>$('#iaQ').focus(),200)};
  const cerrar=()=>{pnl.classList.remove('on');fab.classList.remove('off')};
  fab.onclick=abrir;$('#iaX').onclick=cerrar;
  $('#iaClr').onclick=()=>{msgs.innerHTML='';ctx={};bienvenida()};
  $('#iaLib').onclick=()=>{const b=$('#iaLibBox');b.hidden=!b.hidden;if(!b.hidden)b.innerHTML=libHTML()};
  $('#iaLibBox').onclick=ev=>{const c=ev.target.closest('[data-q]');if(c){$('#iaLibBox').hidden=true;enviar(c.dataset.q)}};
  $('#iaForm').onsubmit=ev=>{ev.preventDefault();const v=$('#iaQ').value.trim();if(v){$('#iaQ').value='';enviar(v)}};
  msgs.onclick=ev=>{const c=ev.target.closest('[data-q]');if(c)return enviar(c.dataset.q);const g=ev.target.closest('[data-go]');if(g)irA(JSON.parse(g.dataset.go));const a=ev.target.closest('[data-acc]');if(a){const d=JSON.parse(a.dataset.acc);const x=T().AGG[d.y].acc[d.acc];if(x){T().setVig(d.y);T().modalAcc(x)}}};
  addEventListener('keydown',ev=>{if(ev.key==='Escape'&&pnl.classList.contains('on')&&!document.querySelector('.modal.on'))cerrar()});
  document.querySelectorAll('[data-ia-open]').forEach(a=>a.addEventListener('click',ev=>{ev.preventDefault();abrir()}));
  try{if(!sessionStorage.getItem('iaHola')){setTimeout(()=>fab.classList.add('hola'),1800);setTimeout(()=>fab.classList.remove('hola'),9000);sessionStorage.setItem('iaHola','1')}}catch(e){}
  function libHTML(){return PREGUNTAS.map(([c,ic,qs])=>`<div class="ia-cat"><h6><i class="fa-solid ${ic}"></i>${c}</h6>${qs.map(q=>`<button data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>`).join('')}
  function bienvenida(){bot({html:`<p>¡Hola! Soy <b>${NOMBRE}</b> 👋, el asistente del tablero de la Política Pública de Inclusión para Personas con Discapacidad de Tenjo.</p><p>Pregúntame por el avance de una vigencia, eje, línea o acción, por la población beneficiada, los logros o las dependencias.</p>`,chips:['¿Cómo va la política en 2026?','Dame el avance de la línea estratégica 1.3','¿Cuáles son las acciones más rezagadas?','¿Cuál es la población beneficiada?','Ver todas las preguntas']},true)}
  function user(t){const d=document.createElement('div');d.className='ia-m u';d.innerHTML=`<div class="ia-b">${esc(t)}</div>`;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight}
  function bot(r,inst){const d=document.createElement('div');d.className='ia-m b';
    const tools=`${r.ir?`<button class="ia-go" data-go='${esc(JSON.stringify(r.ir))}'><i class="fa-solid fa-arrow-up-right-from-square"></i>${esc(r.ir.label)}</button>`:''}${r.accion?`<button class="ia-go" data-acc='${esc(JSON.stringify(r.accion))}'><i class="fa-solid fa-magnifying-glass-chart"></i>Ver ficha de la acción</button>`:''}`;
    d.innerHTML=`<img src="assets/juaico.svg" alt=""><div class="ia-b">${r.html}${r.todas?`<div class="ia-libin">${libHTML()}</div>`:''}${tools?`<div class="ia-tools">${tools}</div>`:''}${r.chips&&r.chips.length?`<div class="ia-chips">${r.chips.map(c=>`<button data-q="${esc(c)}">${esc(c)}</button>`).join('')}</div>`:''}</div>`;
    if(inst){msgs.appendChild(d);return}
    const t=document.createElement('div');t.className='ia-m b';t.innerHTML='<img src="assets/juaico.svg" alt=""><div class="ia-b ia-typing"><i></i><i></i><i></i></div>';msgs.appendChild(t);msgs.scrollTop=msgs.scrollHeight;
    setTimeout(()=>{t.replaceWith(d);d.classList.add('in');msgs.scrollTop=msgs.scrollHeight-d.offsetHeight-20},450+Math.random()*350)}
  function enviar(t){user(t);let r;try{r=responder(t)}catch(err){console.error(err);r={html:'<p>Tuve un problema al calcular esa respuesta. Intenta formularla de otra manera.</p>'}}bot(r)}
  function irA(o){if(o.vig&&o.vig!==T().S.vig)T().setVig(o.vig);if(o.eje!=null&&o.eje!==T().S.eje)T().setEje(o.eje);location.hash='#/'+o.ruta;if(innerWidth<760)cerrar()}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montar);else montar();
})();
