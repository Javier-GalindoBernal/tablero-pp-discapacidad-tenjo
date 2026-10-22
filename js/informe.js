/* Generador de informes de avance en PDF · PP Discapacidad · Tenjo */
(function(){
'use strict';
const G='#055B2A',Y='#E8BE07',A='#1F6FB2',TX='#15201A',GR='#5B6670';
const RGB={verde:[5,91,42],amarillo:[232,190,7],azul:[31,111,178],tinta:[21,32,26],gris:[91,102,112],suave:[244,248,245],borde:[220,229,223]};
const EJC=[G,Y,A];
const SECC=[
  ['resumen','Resumen ejecutivo','Indicadores clave y síntesis de la vigencia','fa-gauge-high'],
  ['avance','Avance por eje y acción','Gráficos y tablas de cumplimiento','fa-chart-column'],
  ['logros','Logros obtenidos','Resultados destacados de la vigencia','fa-trophy'],
  ['poblacion','Población beneficiada','Personas vinculadas por grupo (estimación 2026)','fa-people-group'],
  ['actividades','Actividades con avance','Detalle de programado, ejecutado y cumplimiento','fa-table-list'],
  ['dependencias','Dependencias y PDT','Gestión por dependencia y metas del Plan de Desarrollo','fa-sitemap']
];
const PRESET={ejecutivo:['resumen','avance','logros'],completo:SECC.map(s=>s[0])};
const txt=s=>String(s??'').replace(/≈\s?/g,'aprox. ').replace(/[≥]/g,'>=').replace(/ /g,' ');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------------- Vista ---------------- */
window.vInformes=function(v){
  const T=window.TABLERO;const st={vig:T.S.vig,eje:T.S.eje,sec:new Set(PRESET.completo)};
  v.innerHTML=`
  <div class="row c32">
    <div class="card">
      <div class="ch"><div><h3>Configura el informe de avance</h3><p>El PDF se genera en tu navegador con los datos del tablero</p></div><span class="pill"><i class="fa-solid fa-file-pdf"></i> PDF</span></div>
      <div class="inf-grid">
        <label class="inf-f"><span>Vigencia</span><select class="sel" id="iVig">${T.VIGS.map(y=>`<option value="${y}" ${y===st.vig?'selected':''}>${T.vigTxt(y)}</option>`).join('')}</select></label>
        <label class="inf-f"><span>Eje</span><select class="sel" id="iEje"><option value="0">Todos los ejes</option>${T.EJES.map(e=>`<option value="${e.id}" ${e.id===st.eje?'selected':''}>Eje ${e.id} · ${esc(e.largo)}</option>`).join('')}</select></label>
      </div>
      <div class="inf-pre"><span>Tipo de informe:</span><button class="chip" data-p="ejecutivo"><i class="fa-solid fa-bolt"></i>Ejecutivo</button><button class="chip on" data-p="completo"><i class="fa-solid fa-book-open"></i>Completo</button></div>
      <div class="inf-sec" id="iSec">${SECC.map(s=>`<label class="inf-chk"><input type="checkbox" value="${s[0]}" checked><i class="fa-solid ${s[3]}"></i><span><b>${s[1]}</b><small>${s[2]}</small></span></label>`).join('')}</div>
      <button class="btn-pdf" id="iGo"><i class="fa-solid fa-file-arrow-down"></i> Descargar informe en PDF</button>
      <p class="hint" id="iMsg" style="margin-top:10px"><i class="fa-solid fa-circle-info"></i>Tamaño carta, con encabezado institucional y numeración de páginas.</p>
    </div>
    <div class="card">
      <div class="ch"><div><h3>Informes rápidos</h3><p>Informe completo de cada vigencia, todos los ejes</p></div></div>
      <div class="inf-quick">${T.VIGS.map(y=>{const g=T.AGG[y];return `<button class="inf-q" data-y="${y}"><span class="inf-yr">${y}</span><span><b>Informe de avance ${T.vigTxt(y)}</b><small>Cumplimiento ${T.pct(g.cumpl)} · ${g.gest} acciones gestionadas</small></span><i class="fa-solid fa-download"></i></button>`}).join('')}</div>
      <div class="nota-inf"><i class="fa-solid fa-shield-halved"></i> Los informes se generan sin enviar información a ningún servidor.</div>
    </div>
  </div>`;
  const syncChecks=()=>v.querySelectorAll('#iSec input').forEach(c=>c.checked=st.sec.has(c.value));
  v.querySelectorAll('.inf-pre .chip').forEach(b=>b.onclick=()=>{v.querySelectorAll('.inf-pre .chip').forEach(x=>x.classList.toggle('on',x===b));st.sec=new Set(PRESET[b.dataset.p]);syncChecks()});
  v.querySelector('#iSec').onchange=ev=>{const c=ev.target;if(c.checked)st.sec.add(c.value);else st.sec.delete(c.value);v.querySelectorAll('.inf-pre .chip').forEach(x=>x.classList.remove('on'))};
  v.querySelector('#iVig').onchange=ev=>st.vig=+ev.target.value;
  v.querySelector('#iEje').onchange=ev=>st.eje=+ev.target.value;
  const run=async(o,btn)=>{if(!o.sec.size){T.toast('Selecciona al menos una sección');return}
    const old=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Generando…';
    try{const name=await generar(o);T.toast('Informe descargado');$msg(`<i class="fa-solid fa-circle-check" style="color:var(--verde)"></i>Se descargó <b>${esc(name)}</b>`)}
    catch(e){console.error(e);$msg('<i class="fa-solid fa-triangle-exclamation"></i>No fue posible generar el PDF. Recarga la página e intenta de nuevo.')}
    finally{btn.disabled=false;btn.innerHTML=old}};
  const $msg=h=>{v.querySelector('#iMsg').innerHTML=h};
  v.querySelector('#iGo').onclick=ev=>run({vig:st.vig,eje:st.eje,sec:new Set(st.sec)},ev.currentTarget);
  v.querySelectorAll('.inf-q').forEach(b=>b.onclick=()=>run({vig:+b.dataset.y,eje:0,sec:new Set(PRESET.completo)},b));
};

/* ---------------- Utilidades PDF ---------------- */
async function imgData(src){const r=await fetch(src);const b=await r.blob();return await new Promise((ok,ko)=>{const fr=new FileReader();fr.onload=()=>ok(fr.result);fr.onerror=ko;fr.readAsDataURL(b)})}
function chartImg(option,w,h){
  const div=document.createElement('div');div.style.cssText=`position:fixed;left:-10000px;top:0;width:${w}px;height:${h}px`;document.body.appendChild(div);
  const c=echarts.init(div,null,{renderer:'canvas'});
  c.setOption(Object.assign({animation:false,textStyle:{fontFamily:'Helvetica, Arial, sans-serif',color:TX}},option));
  const url=c.getDataURL({type:'png',pixelRatio:2,backgroundColor:'#ffffff'});c.dispose();div.remove();return url}

async function generar(o){
  const T=window.TABLERO;const {jsPDF}=window.jspdf;
  const doc=new jsPDF({unit:'mm',format:'letter',compress:true});
  const W=215.9,H=279.4,M=16,CW=W-2*M;let y=0;
  const g=T.AGG[o.vig],e=o.eje?T.ejeDe(o.eje):null;
  const [esc64,sec64,ga64]=await Promise.all([imgData('assets/escudo-tenjo.png'),imgData('assets/secretaria-planeacion.jpg'),imgData('assets/global-analitik.png')]);
  const hoy=new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'});

  const nueva=()=>{doc.addPage();cabMini();y=30};
  const espacio=h=>{if(y+h>H-20)nueva()};
  function cabMini(){doc.setFillColor(...RGB.verde);doc.rect(0,0,W,16,'F');doc.addImage(esc64,'PNG',M,2.5,10,11.2,'escudo','FAST');
    doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(9.5);doc.text('Informe de avance · PP Inclusión para Personas con Discapacidad',M+14,7.5);
    doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text(txt(`Alcaldía de Tenjo · Vigencia ${T.vigTxt(o.vig)}${e?' · Eje '+e.id:''}`),M+14,12);
    franja(W-M-30,7,30)}
  function franja(x,yy,w){[RGB.verde,RGB.amarillo,RGB.azul].forEach((c,i)=>{doc.setFillColor(...c);doc.roundedRect(x+i*w/3,yy,w/3-1.5,1.6,.8,.8,'F')})}
  function h2(t,sub){espacio(18);doc.setTextColor(...RGB.verde);doc.setFont('helvetica','bold');doc.setFontSize(14);doc.text(txt(t),M,y);
    doc.setFillColor(...RGB.amarillo);doc.roundedRect(M,y+2.2,14,1.4,.7,.7,'F');y+=8;
    if(sub){doc.setTextColor(...RGB.gris);doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text(txt(sub),M,y);y+=5}y+=1}
  function para(t,size=10,color=RGB.tinta){doc.setFont('helvetica','normal');doc.setFontSize(size);doc.setTextColor(...color);
    const L=doc.splitTextToSize(txt(t),CW);const lh=size*0.42;espacio(L.length*lh+2);doc.text(L,M,y);y+=L.length*lh+3}
  let nImg=0;function img(url,h){espacio(h+4);doc.addImage(url,'PNG',M,y,CW,h,'graf'+(nImg++),'FAST');y+=h+4}
  function tabla(head,body,opt={}){espacio(24);doc.autoTable(Object.assign({startY:y,head:[head],body,margin:{left:M,right:M,top:30,bottom:20},theme:'grid',
    rowPageBreak:'avoid',styles:{font:'helvetica',fontSize:8.2,cellPadding:2,textColor:RGB.tinta,lineColor:RGB.borde,lineWidth:.2,valign:'middle'},
    headStyles:{fillColor:RGB.verde,textColor:255,fontStyle:'bold',fontSize:8.2},alternateRowStyles:{fillColor:RGB.suave},
    didDrawPage:()=>{if(doc.internal.getCurrentPageInfo().pageNumber>1)cabMini()}},opt));
    y=doc.lastAutoTable.finalY+7}

  /* ---------- Portada ---------- */
  doc.setFillColor(...RGB.verde);doc.rect(0,0,W,62,'F');
  doc.setFillColor(4,64,31);doc.rect(0,62,W,3,'F');
  doc.addImage(esc64,'PNG',M,12,30,33.6,'escudo','FAST');
  doc.setTextColor(253,229,138);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text('ALCALDÍA DE TENJO · INFORME DE AVANCE',M+36,17);
  doc.setTextColor(255,255,255);doc.setFontSize(17);doc.text(doc.splitTextToSize('Política Pública de Inclusión para Personas con Discapacidad y sus Familias',110),M+36,25);
  doc.setFont('helvetica','normal');doc.setFontSize(11);doc.text(txt(`Vigencia ${T.vigTxt(o.vig)}${e?' · Eje '+e.id+': '+e.largo:''}`),M+36,47);
  doc.addImage(sec64,'JPEG',W-M-44,13,44,22.4,'secretaria','FAST');
  franja(W-M-44,40,44);
  doc.setTextColor(...RGB.gris);doc.setFontSize(8.5);doc.text(txt(`Generado el ${hoy} · Tablero de seguimiento de la política`),M,72);
  doc.setFontSize(7.5);doc.text('Desarrollado por',W-M-44,72,{align:'right'});doc.addImage(ga64,'PNG',W-M-42,67.2,42,13.3,'global','FAST');
  y=82;

  const cum=e?g.ejes[e.id].cumpl:g.cumpl,pond=e?g.ejes[e.id].pond:g.pond,gest=e?g.ejes[e.id].gest:g.gest,tot=e?e.nAcc:22;
  const actsV=g.acts.filter(a=>T.VIS(a)&&(!e||a.e===e.id));
  const accs=Object.values(g.acc).filter(x=>(!e||x.e===e.id)&&x.c>0).sort((a,b)=>a.a.localeCompare(b.a,undefined,{numeric:true}));

  /* ---------- Resumen ---------- */
  if(o.sec.has('resumen')){
    h2('Resumen ejecutivo',`Vigencia ${T.vigTxt(o.vig)}${e?' · '+e.largo:' · Todos los ejes'}`);
    const pers=T.POB.grupos.reduce((s,x)=>s+x.n,0);
    const k=[[T.pct(cum),'Cumplimiento del plan de acción'],[T.pct(pond),'Avance ponderado con pesos oficiales'],[`${gest} de ${tot}`,'Acciones gestionadas'],[String(actsV.length),'Actividades con avance'],['aprox. '+T.fmt(pers),'Personas vinculadas (2026)']];
    const bw=(CW-4*3)/5;espacio(26);
    k.forEach((it,i)=>{const x=M+i*(bw+3);if(i===0){doc.setFillColor(...RGB.verde)}else{doc.setFillColor(...RGB.suave)}doc.roundedRect(x,y,bw,23,2.5,2.5,'F');
      doc.setTextColor(...(i===0?[255,255,255]:RGB.verde));doc.setFont('helvetica','bold');doc.setFontSize(i===4?11:14);doc.text(txt(it[0]),x+3,y+9);
      doc.setFont('helvetica','normal');doc.setFontSize(7.4);doc.setTextColor(...(i===0?[220,240,226]:RGB.gris));doc.text(doc.splitTextToSize(txt(it[1]),bw-6),x+3,y+14.5)});
    y+=29;
    const ejesOrd=T.EJES.map(x=>({x,c:g.ejes[x.id].cumpl})).sort((a,b)=>b.c-a.c);
    let s1=`En la vigencia ${T.vigTxt(o.vig)}, el plan de acción ${e?'del eje '+e.largo:'de la Política Pública de Inclusión para Personas con Discapacidad y sus Familias'} alcanzó un cumplimiento de ${T.pct(cum)}, con ${gest} de ${tot} acciones gestionadas y ${actsV.length} actividades con avance reportado. El avance ponderado con los pesos oficiales es de ${T.pct(pond)}.`;
    if(!e)s1+=` El eje con mayor cumplimiento es ${ejesOrd[0].x.largo} (${T.pct(ejesOrd[0].c)}).`;
    const cumplidas=actsV.filter(a=>a.c>=100).length;
    s1+=` ${cumplidas} actividades alcanzaron el 100 % de lo programado.`;
    if(o.vig===2026)s1+=' La vigencia 2026 tiene corte a octubre, por lo que varias actividades continúan en ejecución durante el segundo semestre.';
    para(s1);
    const tray=T.VIGS.map(yy=>e?T.AGG[yy].ejes[e.id].cumpl:T.AGG[yy].cumpl);
    para(`Trayectoria del cumplimiento: ${T.VIGS.map((yy,i)=>`${T.vigTxt(yy)}: ${T.pct(tray[i])}`).join(' · ')}.`,9,RGB.gris);
  }

  /* ---------- Avance ---------- */
  if(o.sec.has('avance')){
    h2('Avance por eje y acción','Cumplimiento del plan de acción por eje en las tres vigencias');
    const ej=e?[e]:T.EJES;
    img(chartImg({legend:{top:0,right:0,itemWidth:12,textStyle:{color:GR,fontSize:12}},grid:{left:10,right:10,top:36,bottom:10,containLabel:true},
      xAxis:{type:'category',data:ej.map(x=>x.nombre),axisTick:{show:false},axisLine:{lineStyle:{color:'#DDE5DF'}},axisLabel:{color:TX,fontWeight:'bold',fontSize:13}},
      yAxis:{type:'value',show:false,max:118},
      series:T.VIGS.map((yy,i)=>({name:T.vigTxt(yy),type:'bar',barMaxWidth:40,itemStyle:{borderRadius:[5,5,0,0],color:['#9FC3AC','#4F9A6C',G][i]},
        label:{show:true,position:'top',color:TX,fontWeight:'bold',fontSize:12,formatter:p=>T.fmt(p.value,1)+' %'},data:ej.map(x=>+T.AGG[yy].ejes[x.id].cumpl.toFixed(1))}))},900,360),CW*360/900);
    tabla(['Eje','Peso oficial','Acciones gestionadas','Cumplimiento '+o.vig,'Avance ponderado'],
      ej.map(x=>{const s=g.ejes[x.id];return [`${x.id}. ${x.largo}`,T.pct(x.peso,1),`${s.gest} de ${x.nAcc}`,T.pct(s.cumpl),T.pct(s.pond)]}),
      {columnStyles:{0:{cellWidth:78},1:{halign:'center'},2:{halign:'center'},3:{halign:'center',fontStyle:'bold'},4:{halign:'center'}}});
    if(accs.length){
      espacio(20);doc.setTextColor(...RGB.tinta);doc.setFont('helvetica','bold');doc.setFontSize(10.5);doc.text(txt(`Cumplimiento por acción · ${T.vigTxt(o.vig)}`),M,y);y+=4;
      const hh=Math.max(220,accs.length*26+30);
      img(chartImg({grid:{left:6,right:60,top:6,bottom:6,containLabel:true},xAxis:{type:'value',max:100,show:false},
        yAxis:{type:'category',inverse:true,data:accs.map(x=>x.a+'  '+T.ACCN[x.a]),axisTick:{show:false},axisLine:{show:false},axisLabel:{color:TX,fontSize:12.5}},
        series:[{type:'bar',barMaxWidth:18,showBackground:true,backgroundStyle:{color:'#F1F5F2',borderRadius:6},label:{show:true,position:'right',color:TX,fontWeight:'bold',formatter:p=>T.fmt(p.value,0)+' %'},
          data:accs.map(x=>({value:+x.c.toFixed(1),itemStyle:{borderRadius:6,color:EJC[x.e-1]}}))}]},900,hh),CW*hh/900);
      tabla(['Código','Acción','Eje','Actividades con avance','Cumplimiento'],accs.map(x=>[x.a,T.ACCN[x.a],String(x.e),String(x.nVis),T.pct(x.c)]),
        {columnStyles:{0:{cellWidth:18,fontStyle:'bold',textColor:RGB.verde},2:{halign:'center',cellWidth:14},3:{halign:'center',cellWidth:32},4:{halign:'center',cellWidth:26,fontStyle:'bold'}}});
    }
  }

  /* ---------- Logros ---------- */
  if(o.sec.has('logros')){
    const L=T.LOGROS.filter(x=>x[0]===o.vig&&(!e||x[1]===e.id));
    if(L.length){
      h2('Logros obtenidos',`Resultados destacados · ${T.vigTxt(o.vig)}`);
      const cw=(CW-6)/2;let col=0,rowH=0,y0=y;
      L.forEach((l,i)=>{doc.setFont('helvetica','normal');doc.setFontSize(8.3);const lines=doc.splitTextToSize(txt(l[7]),cw-8);const h=17+lines.length*3.6;
        if(col===0){espacio(h);y0=y;rowH=h}else rowH=Math.max(rowH,h);
        const x=M+col*(cw+6);const c=EJC[l[1]-1];
        doc.setFillColor(...RGB.suave);doc.roundedRect(x,y0,cw,h,2.5,2.5,'F');
        doc.setFillColor(...(l[1]===1?RGB.verde:l[1]===2?RGB.amarillo:RGB.azul));doc.circle(x+5,y0+6,1.6,'F');
        doc.setTextColor(...(l[1]===2?[143,114,0]:l[1]===3?[23,88,143]:RGB.verde));doc.setFont('helvetica','bold');doc.setFontSize(14);doc.text(txt(l[4]),x+9,y0+7.6);
        const wN=doc.getTextWidth(txt(l[4]));doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(...RGB.gris);doc.text(txt(l[5]),x+11+wN,y0+7.6);
        doc.setTextColor(...RGB.tinta);doc.setFont('helvetica','bold');doc.setFontSize(9.3);doc.text(doc.splitTextToSize(txt(l[6]),cw-8)[0],x+4,y0+13);
        doc.setFont('helvetica','normal');doc.setFontSize(8.3);doc.setTextColor(...RGB.gris);doc.text(lines,x+4,y0+17.5);
        if(col===1||i===L.length-1){y=y0+rowH+4;col=0}else col=1});
      y+=2;
    }
  }

  /* ---------- Población ---------- */
  if(o.sec.has('poblacion')){
    const P=T.POB,tot2=P.grupos.reduce((s,x)=>s+x.n,0);
    h2('Población beneficiada','Estimación de personas vinculadas a la política · vigencia 2026');
    para(`Sobre una población municipal de cerca de ${T.fmt(P.hab)} habitantes, la política vinculó aproximadamente a ${T.fmt(tot2)} personas (${T.pct(tot2/P.hab*100)} de los habitantes), entre personas con discapacidad, familias y cuidadores, niñas y niños en tamizaje y miembros de la comunidad capacitados.`);
    const cols=[G,Y,A,'#7FA48C'];
    const pie=chartImg({legend:{orient:'vertical',right:10,top:'middle',itemWidth:12,textStyle:{color:TX,fontSize:14}},
      series:[{type:'pie',radius:['45%','75%'],center:['30%','50%'],itemStyle:{borderColor:'#fff',borderWidth:3},label:{show:true,position:'inside',color:'#fff',fontWeight:'bold',fontSize:13,formatter:'{d}%'},
        data:P.grupos.map((x,i)=>({name:`${x.g}: aprox. ${T.fmt(x.n)}`,value:x.n,itemStyle:{color:cols[i]}}))}]},900,300);
    img(pie,CW*300/900);
    tabla(['Grupo','Personas (aprox.)','Detalle'],P.grupos.map(x=>[x.g,T.fmt(x.n),txt(x.d)]),{columnStyles:{0:{cellWidth:44,fontStyle:'bold'},1:{halign:'center',cellWidth:26}}});
    tabla(['Programa','Personas atendidas'],T.ATN.map(x=>[x[0],T.fmt(x[1])]),{columnStyles:{1:{halign:'center',cellWidth:40}}});
    para('Nota: una misma persona puede participar en varios programas; las cifras por grupo descuentan estas repeticiones.',8.5,RGB.gris);
  }

  /* ---------- Actividades ---------- */
  if(o.sec.has('actividades')&&actsV.length){
    h2('Actividades con avance',`${actsV.length} actividades · ${T.vigTxt(o.vig)}`);
    const rows=actsV.slice().sort((a,b)=>a.cod.localeCompare(b.cod,undefined,{numeric:true}));
    tabla(['Código','Actividad','Responsable','Prog.','Sem. 1','Sem. 2','Cumpl.','Estado'],
      rows.map(a=>[a.cod,txt(a.d),txt(a.r),a.p==null?'-':T.fmt(a.p),T.fmt(a.s1),T.fmt(a.s2),T.pct(a.c,0),T.estado(a.c)]),
      {styles:{fontSize:7.4,cellPadding:1.6,font:'helvetica',textColor:RGB.tinta,lineColor:RGB.borde,lineWidth:.2,valign:'top'},
       columnStyles:{0:{cellWidth:15,fontStyle:'bold',textColor:RGB.verde},1:{cellWidth:72},2:{cellWidth:28},3:{halign:'right',cellWidth:12},4:{halign:'right',cellWidth:12},5:{halign:'right',cellWidth:12},6:{halign:'center',cellWidth:14,fontStyle:'bold'},7:{cellWidth:18}},
       didParseCell:d=>{if(d.section==='body'&&d.column.index===7){d.cell.styles.textColor=d.cell.raw==='Cumplida'?RGB.verde:[143,114,0];d.cell.styles.fontStyle='bold'}}});
  }

  /* ---------- Dependencias y PDT ---------- */
  if(o.sec.has('dependencias')){
    h2('Dependencias y Plan de Desarrollo',`Gestión por dependencia · ${T.vigTxt(o.vig)}`);
    const deps=[...new Set(actsV.map(a=>a.r))].map(d=>{const xs=actsV.filter(a=>a.r===d);return [d,xs.length,new Set(xs.map(a=>a.a)).size,xs.reduce((s,a)=>s+a.c,0)/xs.length]}).sort((a,b)=>b[1]-a[1]);
    if(deps.length)tabla(['Dependencia','Actividades','Acciones','Cumplimiento promedio'],deps.map(d=>[d[0],String(d[1]),String(d[2]),T.pct(d[3])]),
      {columnStyles:{1:{halign:'center',cellWidth:24},2:{halign:'center',cellWidth:22},3:{halign:'center',cellWidth:38,fontStyle:'bold'}}});
    para('La política se articula con 13 metas de producto del Plan de Desarrollo Territorial; 11 alcanzaron el 100 % de su meta anual en el último reporte consolidado, con recursos asociados por cerca de $2.447 millones.');
    tabla(['Meta','Descripción','Resultado'],T.METAS.map(m=>['Meta '+m[0],m[1],txt(m[2])]),{columnStyles:{0:{cellWidth:20,fontStyle:'bold',textColor:RGB.verde},2:{cellWidth:62}}});
  }

  /* ---------- Metodología ---------- */
  espacio(30);
  doc.setDrawColor(...RGB.borde);doc.line(M,y,W-M,y);y+=6;
  doc.setTextColor(...RGB.verde);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('Metodología',M,y);y+=5;
  para('Cumplimiento de cada actividad: ejecución de los semestres 1 y 2 sobre la cantidad programada, con un máximo de 100 %. Cumplimiento de cada acción: promedio de sus actividades. Cumplimiento del plan: promedio de las acciones gestionadas en la vigencia. Avance ponderado: cumplimiento de cada eje ponderado con los pesos oficiales de la matriz (38,79 %, 26,72 % y 34,48 %). Fuente: matriz de seguimiento de la política y relación con el Plan de Desarrollo Territorial.',8.5,RGB.gris);

  espacio(26);y+=4;doc.setDrawColor(...RGB.borde);doc.line(M,y,W-M,y);y+=6;doc.setTextColor(...RGB.gris);doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.text('Tablero e informe desarrollados por Global Analitik SAS · le damos valor a sus datos.',M,y+5);doc.addImage(ga64,'PNG',W-M-44,y-1,44,14,'global','FAST');y+=18;

  /* ---------- Pie de página ---------- */
  const n=doc.getNumberOfPages();
  for(let i=1;i<=n;i++){doc.setPage(i);doc.setDrawColor(...RGB.borde);doc.line(M,H-13,W-M,H-13);
    doc.setFont('helvetica','normal');doc.setFontSize(7.8);doc.setTextColor(...RGB.gris);
    doc.text(txt('Alcaldía de Tenjo · Secretaría de Planeación y Desarrollo Territorial · Tablero de seguimiento PP Discapacidad'),M,H-8);
    doc.text(`Página ${i} de ${n}`,W-M,H-8,{align:'right'})}

  const name=`Informe_Avance_PP_Discapacidad_Tenjo_${o.vig}${e?'_Eje'+e.id:''}.pdf`;
  doc.save(name);return name;
}
window.generarInformePDF=generar;
})();
