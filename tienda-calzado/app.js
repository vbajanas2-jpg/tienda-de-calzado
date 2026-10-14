/* ---------- almacenamiento seguro ---------- */
const mem={};
const LS={get(k){try{return localStorage.getItem(k)}catch(e){return mem['l'+k]??null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){mem['l'+k]=v}}};
const SS={get(k){try{return sessionStorage.getItem(k)}catch(e){return mem['s'+k]??null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){mem['s'+k]=v}}};
const KEY='calzado_proto_db_v2', SKEY='calzado_proto_sess_v1', GKEY='calzado_proto_guest_v1', DKEY='calzado_proto_draft_v1';

/* ---------- fechas y días hábiles ---------- */
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fromYmd=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c)};
const realToday=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const today=()=>S.demoToday?fromYmd(S.demoToday):realToday();
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const fmt=s=>fromYmd(s).toLocaleDateString('es-EC',{weekday:'short',day:'numeric',month:'short'});
const fmtL=s=>fromYmd(s).toLocaleDateString('es-EC',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const fmtTs=iso=>new Date(iso).toLocaleString('es-EC',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const holiday=d=>DB.holidays.find(h=>h.d===ymd(d));
const isBiz=d=>d.getDay()!==0&&d.getDay()!==6&&!holiday(d);
function bizList(from,n){const out=[];let d=new Date(from);while(out.length<n){d=addDays(d,1);if(isBiz(d))out.push(new Date(d))}return out}
const minDate=from=>bizList(from,4)[3];
function bizLeft(fecha){const t=realToday(),f=fromYmd(fecha);if(f<=t)return 0;let c=0,d=new Date(t);while(d<f){d=addDays(d,1);if(isBiz(d))c++}return c}

/* ---------- catálogo base ---------- */
const COLORS={nude:['Nude','#d9b49a'],negro:['Negro','#262124'],cereza:['Rojo cereza','#9e1f3a'],perla:['Blanco perla','#efe9e0'],oliva:['Verde oliva','#6b7046'],noche:['Azul noche','#28395c'],rosa:['Rosa palo','#e5a9b4'],camel:['Camel','#b07a45']};
const SOLES={natural:['Natural','#c9a77e'],negra:['Negra','#1f1c1e'],blanca:['Blanca','#ebe6df']};
const TYPES={sandalia:'Sandalias',tacon:'Tacones',plano:'Planos',plataforma:'Plataformas',mule:'Mules',botin:'Botines'};
const TYPE1={sandalia:'Sandalia',tacon:'Tacón',plano:'Plano',plataforma:'Plataforma',mule:'Mule',botin:'Botín'};
const OCC={fiesta:'Fiesta y eventos',diario:'Día a día',oficina:'Oficina',viaje:'Viaje'};
const full=m=>`${m.name} - ${TYPE1[m.type]}`;
const SIZES=[34,35,36,37,38,39,40];
const SIZE_CM={34:22.0,35:22.7,36:23.3,37:24.0,38:24.7,39:25.3,40:26.0};
const FLOW=['Recibido','En fabricación','Control de calidad','Enviado','Entregado'];
const WHO={'Recibido':'Sistema, al aprobarse el pago','En fabricación':'Proveedor','Control de calidad':'Proveedor, al entregar el par a la marca','Enviado':'Marca, al despachar','Entregado':'Marca, al recibirlo la usuaria'};

function seed(){
  const t=realToday();
  const models=[
    {id:'luna',name:'Luna',type:'sandalia',style:'tiras',heel:0,soleT:8,price:34,occ:['diario','viaje'],tag:'Más vendido',order:2,desc:'Sandalia plana de tiras cruzadas con tobillera. Cómoda para el día y para viajes.',colors:['nude','negro','rosa','camel','perla'],soles:['natural','negra','blanca'],active:true},
    {id:'aurora',name:'Aurora',type:'tacon',style:'cerrado',heel:58,soleT:6,price:48,occ:['fiesta'],tag:'Más vendido',order:5,desc:'Stiletto de punta suave y 9 cm de tacón. Pensado para fiestas, grados y eventos.',colors:['negro','cereza','nude','noche'],soles:['negra','natural'],active:true},
    {id:'clara',name:'Clara',type:'plano',style:'cerrado',heel:0,soleT:7,price:30,occ:['oficina','diario'],tag:null,order:1,desc:'Flat cerrado de horma amplia. Para oficina o clases, todo el día.',colors:['rosa','perla','negro','oliva','nude'],soles:['natural','negra','blanca'],active:true},
    {id:'brisa',name:'Brisa',type:'plataforma',style:'tiras',heel:22,soleT:18,price:42,occ:['viaje','diario'],tag:'Nuevo',order:7,desc:'Sandalia de plataforma liviana con altura de 6 cm sin perder estabilidad.',colors:['camel','perla','negro','oliva'],soles:['natural','blanca'],active:true},
    {id:'serena',name:'Serena',type:'mule',style:'mule',heel:22,soleT:7,price:38,occ:['oficina','fiesta'],tag:null,order:3,desc:'Mule destalonado con tacón bajo de 4 cm. Fácil de poner y quitar.',colors:['nude','cereza','oliva','negro'],soles:['natural','negra'],active:true},
    {id:'noche',name:'Noche',type:'botin',style:'botin',heel:32,soleT:8,price:56,occ:['fiesta','diario'],tag:'Nuevo',order:8,desc:'Botín al tobillo con tacón cuadrado de 5 cm. Para noches frescas.',colors:['negro','camel','noche','oliva'],soles:['negra','natural'],active:true},
    {id:'coral',name:'Coral',type:'sandalia',style:'tiras',heel:46,soleT:6,price:44,occ:['fiesta'],tag:'Edición limitada',order:6,desc:'Sandalia de tiras finas con tacón de 7 cm. Para bodas, grados y cenas.',colors:['cereza','perla','nude','rosa'],soles:['natural','negra'],active:true},
    {id:'lia',name:'Lía',type:'plano',style:'mule',heel:0,soleT:8,price:29,occ:['diario','viaje'],tag:'Nuevo',order:4,desc:'Slide plano y suave, para salir rápido sin renunciar al estilo.',colors:['oliva','camel','negro','rosa'],soles:['natural','blanca'],active:true}];
  const accs=[
    {id:'ninguno',name:'Sin accesorio',price:0,kind:null,tone:null,active:true},
    {id:'hebilla_d',name:'Hebilla dorada',price:4,kind:'hebilla',tone:'#c9a24a',active:true},
    {id:'hebilla_p',name:'Hebilla plateada',price:4,kind:'hebilla',tone:'#b8bec7',active:true},
    {id:'perla',name:'Adorno de perlas',price:5,kind:'perla',tone:'#f7f2ea',active:true},
    {id:'pulsera',name:'Pulsera de tobillo',price:6,kind:'pulsera',tone:'#c9a24a',active:true}];
  const holidays=[
    ['2026-01-01','Año Nuevo'],['2026-02-16','Carnaval'],['2026-02-17','Carnaval'],['2026-04-03','Viernes Santo'],['2026-05-01','Día del Trabajo'],['2026-05-25','Batalla de Pichincha'],['2026-08-10','Primer Grito de Independencia'],['2026-09-17','Cantonización de Milagro'],['2026-10-09','Independencia de Guayaquil'],['2026-11-02','Día de Difuntos'],['2026-11-03','Independencia de Cuenca'],['2026-12-25','Navidad'],['2027-01-01','Año Nuevo'],['2027-02-08','Carnaval'],['2027-02-09','Carnaval']].map(([d,name])=>({d,name}));
  const users=[
    {name:'María Pérez',email:'maria@ejemplo.com',pass:'123456',phone:'0991234567',address:'Cdla. Las Piñas, Mz. 4 Villa 12, Milagro'},
    {name:'Ana Torres',email:'ana@ejemplo.com',pass:'123456',phone:'0987654321',address:'Av. García Moreno y 9 de Octubre, Milagro'}];
  DB={models,accs,holidays,users,orders:[],carts:{},envio:3.5,seq:1040};
  const it=(mid,size,color,sole,acc)=>{const m=DB.models.find(x=>x.id===mid),a=DB.accs.find(x=>x.id===acc);return{modelId:mid,name:full(m),size,color,sole,acc,price:m.price+a.price}};
  const mk=(user,items,createdDaysAgo,estadoIdx,metodo,extraFecha)=>{
    const c=addDays(t,-createdDaysAgo); const fecha=extraFecha||ymd(addDays(minDate(c),0));
    const sub=items.reduce((s,i)=>s+i.price,0); const id='P-'+(++DB.seq);
    const hist=[{e:metodo==='tarjeta'?'Pago aprobado':'Pago verificado',at:c.toISOString(),por:metodo==='tarjeta'?'Pasarela (simulada)':'Marca'}];
    for(let i=0;i<=estadoIdx;i++){const at=addDays(c,Math.min(i,4));at.setHours(9+i*2);hist.push({e:FLOW[i],at:at.toISOString(),por:i===0?'Sistema':i<3?'Proveedor':'Marca'})}
    return{id,user,items,subtotal:sub,envio:DB.envio,total:sub+DB.envio,fecha,creado:ymd(c),pago:{metodo,estado:'aprobado'},estado:FLOW[estadoIdx],historial:hist,visto:true,ejemplo:true};
  };
  DB.orders.push(mk('maria@ejemplo.com',[it('clara',37,'rosa','natural','perla')],24,4,'tarjeta'));
  DB.orders.push(mk('maria@ejemplo.com',[it('aurora',37,'cereza','negra','hebilla_d')],2,1,'tarjeta'));
  const o3=mk('ana@ejemplo.com',[it('luna',36,'camel','natural','pulsera'),it('brisa',36,'perla','blanca','ninguno')],0,0,'tarjeta');o3.visto=false;DB.orders.push(o3);
  const o4=mk('ana@ejemplo.com',[it('noche',38,'negro','negra','hebilla_p')],5,2,'transferencia');DB.orders.push(o4);
  // transferencia pendiente
  const sub=34+4;DB.orders.push({id:'P-'+(++DB.seq),user:'maria@ejemplo.com',items:[it('luna',37,'nude','natural','hebilla_d')],subtotal:sub,envio:DB.envio,total:sub+DB.envio,fecha:ymd(bizList(t,6)[5]),creado:ymd(t),pago:{metodo:'transferencia',estado:'pendiente',comprobante:'comprobante_pichincha.jpg'},estado:'Pago por verificar',historial:[{e:'Comprobante subido',at:new Date().toISOString(),por:'Usuaria'}],visto:false,ejemplo:true});
  DB.carts['maria@ejemplo.com']=[];
}
let DB;
function loadDB(){try{const raw=LS.get(KEY);if(raw){DB=JSON.parse(raw);return}}catch(e){}seed();saveDB()}
function saveDB(){LS.set(KEY,JSON.stringify(DB))}

let S={role:'usuaria',view:'catalogo',filter:'todos',vtab:'3d',rot:-24,zoom:1,mirror:false,ar:{x:50,y:62,s:1,r:0,m:false},paytab:'tarjeta',provFilter:'pendientes',f:{type:[],occ:[],color:[],price:'',tag:''},sort:'destacados',q:'',admTab:'pedidos',admFilter:'todos'};
function loadS(){try{const r=SS.get(SKEY);if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}}
function saveS(){SS.set(SKEY,JSON.stringify(S))}
let DRAFT={};try{DRAFT=JSON.parse(LS.get(DKEY)||'{}')}catch(e){}
const saveDraft=()=>LS.set(DKEY,JSON.stringify(DRAFT));
let arPhoto=null;

/* ---------- utilidades ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'$'+Number(n).toFixed(2);
const model=id=>DB.models.find(m=>m.id===id);
const accOf=id=>DB.accs.find(a=>a.id===id)||DB.accs[0];
const userOf=e=>DB.users.find(u=>u.email===e);
function toast(msg){const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,2600)}
function guestCart(){try{return JSON.parse(LS.get(GKEY)||'[]')}catch(e){return[]}}
function cart(){return S.user?(DB.carts[S.user]||(DB.carts[S.user]=[])):guestCart()}
function setCart(c){if(S.user){DB.carts[S.user]=c;saveDB()}else LS.set(GKEY,JSON.stringify(c))}
function go(v){S.view=v;saveS();render();window.scrollTo({top:0})}
function stTone(e){return{'Pago por verificar':'warn','Pago rechazado':'crit','Recibido':'info','En fabricación':'acc','Control de calidad':'info','Enviado':'info','Entregado':'ok'}[e]||'info'}
const chip=e=>`<span class="st ${stTone(e)}">${esc(e)}</span>`;
const desc=i=>`Talla ${i.size} · ${COLORS[i.color][0]} · suela ${SOLES[i.sole][0].toLowerCase()} · ${accOf(i.acc).name.toLowerCase()}`;

/* ---------- dibujo del calzado ---------- */
function shoeSVG(m,ck,sk,aid){
  const c=(COLORS[ck]||COLORS.nude)[1],s=(SOLES[sk]||SOLES.natural)[1],a=accOf(aid);
  const T=m.soleT,H=m.heel,y0=150-T,yb=150-H,yt=yb-T,yc=yt-30,ol='rgba(0,0,0,.28)';
  const ins=x=>x<=110?y0:x>=232?yt:(()=>{const t=(x-110)/122;return(1-t)*(1-t)*y0+2*(1-t)*t*y0+t*t*yt})();
  let p=`<ellipse cx="150" cy="153" rx="122" ry="5" fill="#000" opacity=".13"/>`;
  if(H>0){const n=H>45;p+=`<path d="M234 ${yb} L262 ${yb} L${n?257:259} 150 L${n?251:243} 150 Z" fill="${s}" stroke="${ol}"/>`}
  p+=`<path d="M30 ${150-T/2} Q30 ${y0} 44 ${y0} L110 ${y0} Q175 ${y0} 232 ${yt} L262 ${yt} L262 ${yb} L232 ${yb} Q175 150 110 150 L44 150 Q30 150 30 ${150-T/2} Z" fill="${s}" stroke="${ol}"/>`;
  p+=`<path d="M40 ${y0} L110 ${y0} Q175 ${y0} 232 ${yt} L260 ${yt}" stroke="rgba(255,255,255,.35)" stroke-width="2" fill="none"/>`;
  const closed=`<path d="M32 ${y0} C29 ${y0-24} 58 ${y0-38} 98 ${y0-40} L126 ${y0-38} C168 ${y0-30} 205 ${yc+4} 248 ${yc} Q262 ${yc} 262 ${yc+12} L262 ${yt} L232 ${yt} Q175 ${y0} 110 ${y0} Z" fill="${c}" stroke="${ol}"/><path d="M128 ${y0-37} C170 ${y0-25} 210 ${yc+11} 252 ${yc+3}" stroke="rgba(0,0,0,.28)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if(m.style==='cerrado')p+=closed;
  if(m.style==='botin'){p+=`<path d="M118 ${y0-38} C138 ${y0-62} 150 56 158 36 L250 32 Q262 32 262 44 L262 ${yt} L226 ${yt} Z" fill="${c}" stroke="${ol}"/>`+closed.split('<path d="M128')[0]+`<path d="M158 37 L250 33" stroke="rgba(0,0,0,.25)" stroke-width="3" stroke-linecap="round"/><path d="M200 40 L204 ${yt-6}" stroke="rgba(0,0,0,.2)" stroke-width="1.5" stroke-dasharray="3 3"/>`}
  if(m.style==='mule')p+=`<path d="M32 ${y0} C29 ${y0-24} 58 ${y0-40} 100 ${y0-42} Q148 ${y0-40} 162 ${ins(162)} L110 ${y0} Z" fill="${c}" stroke="${ol}"/>`;
  if(m.style==='tiras'){const sw=`stroke="${c}" fill="none" stroke-linecap="round"`;
    p+=`<path d="M42 ${y0} Q72 ${y0-46} 106 ${y0}" ${sw} stroke-width="11"/><path d="M118 ${y0} Q152 ${y0-46} 226 ${yt-26}" ${sw} stroke-width="9"/><ellipse cx="240" cy="${yt-26}" rx="21" ry="6" ${sw} stroke-width="7"/><path d="M256 ${yt} L251 ${yt-24}" ${sw} stroke-width="8"/>`}
  if(a.kind==='hebilla'){const [hx,hy]=m.style==='tiras'?[252,yt-32]:m.style==='botin'?[236,60]:[92,y0-50];
    p+=`<rect x="${hx}" y="${hy}" width="18" height="13" rx="3" fill="none" stroke="${a.tone}" stroke-width="3.5"/><line x1="${hx+9}" y1="${hy+1}" x2="${hx+9}" y2="${hy+12}" stroke="${a.tone}" stroke-width="2.5"/>`}
  if(a.kind==='perla'){const [px,py]=m.style==='tiras'?[74,y0-24]:[102,y0-41];
    p+=[[-11,3],[0,-2],[11,3]].map(([dx,dy])=>`<circle cx="${px+dx}" cy="${py+dy}" r="5" fill="${a.tone}" stroke="rgba(0,0,0,.3)"/>`).join('')+`<circle cx="${px}" cy="${py+8}" r="3.5" fill="${a.tone}" stroke="rgba(0,0,0,.3)"/>`}
  if(a.kind==='pulsera'){const cy=m.style==='botin'?26:yt-48;let d='';for(let i=0;i<11;i++){const t=Math.PI*(i/10);d+=`<circle cx="${(240+26*Math.cos(t)).toFixed(1)}" cy="${(cy+7*Math.sin(t)).toFixed(1)}" r="2.7" fill="${a.tone}" stroke="rgba(0,0,0,.25)" stroke-width=".6"/>`}
    p+=`<path d="M214 ${cy} Q240 ${cy+16} 266 ${cy}" stroke="${a.tone}" stroke-width="1" fill="none"/>`+d}
  return `<svg viewBox="0 18 300 142" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(m.name)} en ${COLORS[ck]?.[0]||''}">${p}</svg>`;
}

/* ---------- encabezado ---------- */
const IC={
  search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  user:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  bag:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2" stroke-linecap="round"/></svg>',
  truck:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
  swap:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h14l-3-3M20 16H6l3 3"/></svg>',
  cam:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  cal:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15"/><path d="M4 10h16M9 3v4M15 3v4" stroke-linecap="round"/></svg>'
};
const NAV=[['nuevo','Nuevo'],['sandalia','Sandalias'],['tacon','Tacones'],['plano','Planos'],['plataforma','Plataformas'],['mule','Mules'],['botin','Botines'],['fiesta','Fiesta'],['limitada','Edición limitada']];
function navKey(){const f=S.f;if(S.view!=='tienda')return'';if(f.tag==='Nuevo')return'nuevo';if(f.tag==='Edición limitada')return'limitada';if(f.occ.length===1&&f.occ[0]==='fiesta'&&!f.type.length)return'fiesta';if(f.type.length===1&&!f.occ.length)return f.type[0];return''}
function header(){
  const r=S.role,v=S.view,n=cart().length;
  const util=`<div class="util bleed"><div class="wrap util-in">
      <span class="proto">Prototipo · ver como</span>
      <div class="roles" role="group" aria-label="Ver el prototipo como">${[['usuaria','Usuaria'],['proveedor','Proveedor'],['admin','Administración']].map(([k,l])=>`<button data-act="role" data-v="${k}" aria-pressed="${r===k}">${l}</button>`).join('')}</div>
      ${r==='usuaria'?`<div class="util-links"><button data-act="nav" data-v="pedidos">Seguir mi pedido</button><button data-act="help" data-v="tallas">Guía de tallas</button><button data-act="help" data-v="entregas">Ayuda</button></div>`:''}
    </div></div>`;
  if(r==='usuaria'){
    const nk=navKey();
    return util+`<div class="announce bleed">Entrega programada en Milagro desde 4 días hábiles · Pruébalos en tus pies con realidad aumentada<button data-act="help" data-v="ra">Ver cómo</button></div>
    <header class="top bleed"><div class="wrap top-in">
      <button class="mark" data-act="home" aria-label="Inicio"><b>Tu marca</b><small>Logotipo por definir</small></button>
      <nav class="mainnav" aria-label="Categorías">${NAV.map(([k,l])=>`<button data-act="cat" data-v="${k}" ${nk===k?'aria-current="page"':''} class="${k==='limitada'?'sale':''}">${l}</button>`).join('')}</nav>
      <div class="icons">
        <form class="search" data-form="search" role="search"><input id="q" name="q" placeholder="Buscar modelo" value="${esc(S.q)}" aria-label="Buscar"><button type="submit" aria-label="Buscar">${IC.search}</button></form>
        <button class="ibtn" data-act="nav" data-v="${S.user?'cuenta':'login'}" aria-label="${S.user?'Mi cuenta':'Ingresar'}">${IC.user}</button>
        <button class="ibtn" data-act="nav" data-v="carrito" aria-label="Carrito, ${n} productos">${IC.bag}${n?`<span class="count">${n}</span>`:''}</button>
      </div>
    </div></header>`;
  }
  const sub = r==='proveedor'
    ? (S.prov?`<button data-act="nav" data-v="prov" aria-current="page">Pedidos</button><button class="right" data-act="logoutStaff" data-v="prov">Cerrar sesión del taller</button>`:'')
    : (S.admin?['pedidos','pagos','catalogo','ajustes'].map(t=>{const lbl={pedidos:'Pedidos',pagos:'Pagos por verificar',catalogo:'Catálogo',ajustes:'Envío y feriados'}[t];const c=t==='pagos'?DB.orders.filter(o=>o.estado==='Pago por verificar').length:0;return`<button data-act="admtab" data-v="${t}" ${S.admTab===t?'aria-current="page"':''}>${lbl}${c?`<span class="count">${c}</span>`:''}</button>`}).join('')+`<button class="right" data-act="logoutStaff" data-v="admin">Cerrar sesión</button>`:'');
  return util+`<header class="top bleed"><div class="wrap">
    <div class="top-in" style="grid-template-columns:auto 1fr"><button class="mark" data-act="home" aria-label="Ir a la tienda"><b>Tu marca</b><small>${r==='proveedor'?'Panel del proveedor':'Panel de administración'}</small></button></div>
    ${sub?`<nav class="subnav">${sub}</nav>`:''}</div></header>`;
}

/* ---------- tarjetas de producto ---------- */
function productCard(m){
  const c2=m.colors[1]||m.colors[0];
  return `<button class="card" data-act="open" data-id="${m.id}">
    <div class="stage">${m.tag?`<span class="tag ${m.tag!=='Nuevo'?'hot':''}">${esc(m.tag)}</span>`:''}<span class="ra">RA</span>${shoeSVG(m,m.colors[0],m.soles[0],'ninguno')}<div class="v2" aria-hidden="true">${shoeSVG(m,c2,m.soles[m.soles.length-1],'ninguno')}</div></div>
    <span class="name">${esc(full(m))}</span>
    <span class="price num">${money(m.price)}</span>
    <span class="sqs">${m.colors.map(c=>`<i style="background:${COLORS[c][1]}" title="${COLORS[c][0]}"></i>`).join('')}</span>
    <span class="more">${m.colors.length} colores · personalizable</span>
  </button>`;
}

/* ---------- inicio ---------- */
function vCatalogo(){
  const act=DB.models.filter(m=>m.active);
  const best=act.filter(m=>m.tag==='Más vendido').concat(act.filter(m=>m.tag!=='Más vendido')).slice(0,4);
  const nuevos=act.filter(m=>m.tag==='Nuevo'||m.tag==='Edición limitada').slice(0,4);
  const H=id=>model(id)||act[0];
  const tiles=[['tacon','Lista para la fiesta','Comprar tacones','aurora','cereza','--t3'],['sandalia','Pies libres','Comprar sandalias','luna','camel','--t1'],['plano','Todo el día','Comprar planos','clara','rosa','--t2'],['botin','Noches frescas','Comprar botines','noche','camel','--t4']];
  const insta=[['luna','nude','--t1'],['aurora','negro','--t3'],['brisa','oliva','--t2'],['coral','cereza','--t4'],['serena','nude','--t1'],['noche','noche','--t3']];
  return `<section class="hero bleed">
      <div class="hero-copy">
        <p class="eyebrow">Diseños propios · hechos bajo pedido</p>
        <h1>Tu estilo, a tu medida</h1>
        <p>Elige el modelo, cambia el color y el accesorio, y mira cómo te queda en tus pies antes de comprar. Lo armamos para la fecha que tú programes.</p>
        <div class="actions"><button class="btn primary" data-act="cat" data-v="todo">Ver la colección</button><button class="btn" data-act="open" data-id="aurora" data-ar="1">Probar con RA</button></div>
      </div>
      <div class="hero-art"><div class="a">${shoeSVG(H('aurora'),'cereza','negra','hebilla_d')}</div><div class="b">${shoeSVG(H('coral'),'perla','natural','perla')}</div></div>
    </section>
    <section class="sec">
      <div class="tiles">${tiles.map(([t,h,l,id,c,bg])=>`<button class="tile" data-act="cat" data-v="${t}"><div class="img" style="background:var(${bg})">${shoeSVG(H(id),c,H(id).soles[0],'ninguno')}</div><b>${h}</b><span>${l}</span></button>`).join('')}</div>
    </section>
    <section class="sec">
      <div class="sec-h"><h2>Lo más elegido</h2><button class="btn ghost" data-act="cat" data-v="todo">Ver todo</button></div>
      <div class="grid">${best.map(productCard).join('')}</div>
    </section>
    <section class="how bleed"><div class="wrap how-in">
      <div><i>1</i><b>Elige</b><p>Escoge tu modelo y tu talla con la guía en centímetros.</p></div>
      <div><i>2</i><b>Personaliza</b><p>Cambia el color, la suela y suma un accesorio si quieres.</p></div>
      <div><i>3</i><b>Pruébalo</b><p>Míralo sobre tus pies con realidad aumentada desde el navegador.</p></div>
      <div><i>4</i><b>Programa</b><p>Elige el día de entrega, desde 4 días hábiles después del pago.</p></div>
    </div></section>
    <section class="sec">
      <div class="sec-h"><h2>Recién llegados</h2><button class="btn ghost" data-act="cat" data-v="nuevo">Ver lo nuevo</button></div>
      <div class="grid">${nuevos.map(productCard).join('')}</div>
    </section>
    <section class="sec">
      <h2>Lo que se viene</h2>
      <div class="trend">
        <button data-act="trend" data-v="color:nude">Tonos nude</button><button data-act="trend" data-v="color:cereza">Rojo cereza</button><button data-act="trend" data-v="type:plataforma">Plataformas</button><button data-act="trend" data-v="occ:oficina">Para la oficina</button><button data-act="trend" data-v="occ:viaje">Para viajar</button><button data-act="trend" data-v="price:40">Menos de $40</button>
      </div>
    </section>
    <section class="sec">
      <div class="sec-h"><h2>Síguenos en Instagram</h2><span class="muted">@tumarca · usuario por definir</span></div>
      <div class="insta">${insta.map(([id,c,bg])=>`<div style="background:var(${bg})">${shoeSVG(H(id),c,H(id).soles[0],'ninguno')}</div>`).join('')}</div>
    </section>`;
}

/* ---------- listado ---------- */
function filtered(){
  const f=S.f,q=(S.q||'').trim().toLowerCase();
  let l=DB.models.filter(m=>m.active
    &&(!f.type.length||f.type.includes(m.type))
    &&(!f.occ.length||f.occ.some(o=>(m.occ||[]).includes(o)))
    &&(!f.color.length||f.color.some(c=>m.colors.includes(c)))
    &&(!f.price||m.price<Number(f.price))
    &&(!f.tag||m.tag===f.tag)
    &&(!q||full(m).toLowerCase().includes(q)||TYPES[m.type].toLowerCase().includes(q)));
  const so={destacados:(a,b)=>(a.order||0)-(b.order||0),nuevo:(a,b)=>(b.tag==='Nuevo')-(a.tag==='Nuevo'),'precio-asc':(a,b)=>a.price-b.price,'precio-desc':(a,b)=>b.price-a.price}[S.sort]||(()=>0);
  return l.sort(so);
}
function listTitle(){const f=S.f;if(S.q)return`Resultados para “${esc(S.q)}”`;if(f.tag)return f.tag==='Nuevo'?'Nuevo':f.tag;if(f.type.length===1&&!f.occ.length&&!f.color.length)return TYPES[f.type[0]];if(f.occ.length===1&&!f.type.length)return OCC[f.occ[0]];return 'Toda la colección'}
function vTienda(){
  const f=S.f,l=filtered();
  const chk=(k,v,label,sw)=>`<label class="fchk"><input type="checkbox" data-chg="fset" data-k="${k}" data-v="${v}" ${f[k].includes(v)?'checked':''}>${sw?`<i style="background:${sw}"></i>`:''}${label}</label>`;
  const chips=[...f.type.map(v=>['type',v,TYPES[v]]),...f.occ.map(v=>['occ',v,OCC[v]]),...f.color.map(v=>['color',v,COLORS[v][0]]),...(f.price?[['price',f.price,'Menos de $'+f.price]]:[]),...(f.tag?[['tag',f.tag,f.tag]]:[]),...(S.q?[['q',S.q,'“'+S.q+'”']]:[])];
  return `<div style="display:grid;gap:10px"><div class="crumbs"><button data-act="home">Inicio</button><span>/</span><span>${listTitle()}</span></div><h1>${listTitle()}</h1></div>
  <div class="plp">
    <aside class="filters" aria-label="Filtros">
      <details open><summary>Tipo</summary><div class="opts">${Object.keys(TYPES).map(t=>chk('type',t,TYPES[t])).join('')}</div></details>
      <details open><summary>Ocasión</summary><div class="opts">${Object.keys(OCC).map(o=>chk('occ',o,OCC[o])).join('')}</div></details>
      <details><summary>Color</summary><div class="opts">${Object.keys(COLORS).map(c=>chk('color',c,COLORS[c][0],COLORS[c][1])).join('')}</div></details>
      <details><summary>Precio</summary><div class="opts">${[['','Todos'],['35','Menos de $35'],['40','Menos de $40'],['50','Menos de $50']].map(([v,lb])=>`<label class="fchk"><input type="radio" name="fprice" data-chg="fprice" value="${v}" ${String(f.price||'')===v?'checked':''}>${lb}</label>`).join('')}</div></details>
    </aside>
    <div style="display:grid;gap:18px;min-width:0">
      <div class="plp-bar"><span class="muted">${l.length} ${l.length===1?'modelo':'modelos'}</span>
        <label class="inline" style="font-size:13px;font-weight:700">Ordenar por <select id="sort" data-chg="sort">${[['destacados','Destacados'],['nuevo','Lo más nuevo'],['precio-asc','Precio: menor a mayor'],['precio-desc','Precio: mayor a menor']].map(([v,lb])=>`<option value="${v}" ${S.sort===v?'selected':''}>${lb}</option>`).join('')}</select></label></div>
      ${chips.length?`<div class="active-f">${chips.map(([k,v,lb])=>`<button data-act="unf" data-v="${esc(k)}|${esc(v)}">${esc(lb)} ✕</button>`).join('')}<button class="link" data-act="clearf" style="font-size:12px">Borrar todo</button></div>`:''}
      ${l.length?`<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr))">${l.map(productCard).join('')}</div>`:`<div class="empty"><p>No encontramos modelos con esos filtros.</p><button class="btn" data-act="clearf">Borrar filtros</button></div>`}
    </div>
  </div>`;
}

/* ---------- ficha del modelo ---------- */
function sel(m){const d=DRAFT[m.id]||(DRAFT[m.id]={size:null,color:m.colors[0],sole:m.soles[0],acc:'ninguno'});if(!m.colors.includes(d.color))d.color=m.colors[0];if(!m.soles.includes(d.sole))d.sole=m.soles[0];if(!accOf(d.acc).active)d.acc='ninguno';return d}

function vModelo(){
  const m=model(S.modelId);if(!m)return vCatalogo();const d=sel(m),a=accOf(d.acc);
  const svg=shoeSVG(m,d.color,d.sole,d.acc);
  const viewer=S.vtab==='3d'
    ? `<div class="stage3d" id="stage3d"><div class="spin" id="spin" style="transform:rotateY(${S.rot}deg) scale(${S.zoom})">${svg}</div></div>
       <div class="vctl"><button class="btn sm" data-act="rot" data-v="-45" aria-label="Girar a la izquierda">↺ Girar</button><button class="btn sm" data-act="rot" data-v="180">Otro lado</button><button class="btn sm" data-act="zoom" data-v="0.15" aria-label="Acercar">＋</button><button class="btn sm" data-act="zoom" data-v="-0.15" aria-label="Alejar">－</button><span class="hint">Arrastra para girar</span></div>`
    : `<div class="ar ${arPhoto?'':'sample'}" id="ar" style="${arPhoto?`background-image:url(${arPhoto})`:''}">
         <span class="ar-tag">${arPhoto?'Tu foto':'Escena de ejemplo'} · vista referencial</span>
         <div class="ar-shoe" id="arShoe" style="left:${S.ar.x}%;top:${S.ar.y}%;transform:translate(-50%,-50%) rotate(${S.ar.r}deg) scale(${S.ar.s}) scaleX(${S.ar.m?-1:1})">${svg}</div>
       </div>
       <div class="ar-ctl">
         <label for="arFile">Foto</label><div class="inline"><label class="btn sm" for="arFile" style="cursor:pointer">Subir foto de mis pies</label><input id="arFile" type="file" accept="image/*" data-chg="arfile" hidden>${arPhoto?'<button class="btn sm" data-act="arsample">Quitar foto</button>':''}<button class="btn sm" data-act="armirror">Izq. / Der.</button></div>
         <label for="arS">Tamaño</label><input id="arS" type="range" min="0.5" max="1.8" step="0.02" value="${S.ar.s}" data-inp="arS">
         <label for="arR">Ángulo</label><input id="arR" type="range" min="-60" max="60" step="1" value="${S.ar.r}" data-inp="arR">
       </div>
       <p class="note">Arrastra el calzado sobre tu pie. En el sitio final la cámara del navegador detectará tus pies; en este prototipo la prueba se hace con una foto. El resultado es referencial y no reemplaza la prueba física.</p>`;
  const related=DB.models.filter(x=>x.active&&x.id!==m.id).sort((x,y)=>((y.occ||[]).some(o=>(m.occ||[]).includes(o)))-((x.occ||[]).some(o=>(m.occ||[]).includes(o)))).slice(0,4);
  return `<div class="crumbs"><button data-act="home">Inicio</button><span>/</span><button data-act="cat" data-v="${m.type}">${TYPES[m.type]}</button><span>/</span><span>${esc(m.name)}</span></div>
  <div class="product">
    <div class="viewer">
      <div class="tabs" role="tablist"><button role="tab" data-act="vtab" data-v="3d" aria-selected="${S.vtab==='3d'}">Vista 3D</button><button role="tab" data-act="vtab" data-v="ar" aria-selected="${S.vtab==='ar'}">Pruébalo en tus pies (RA)</button></div>
      ${viewer}
    </div>
    <div class="panel">
      <div class="ptitle">${m.tag?`<span class="eyebrow" style="color:var(--accent)">${esc(m.tag)}</span>`:''}<h1>${esc(full(m))}</h1><span class="pprice num">${money(m.price+a.price)}</span>${a.price?`<span class="muted" style="font-size:13px">Incluye ${esc(a.name.toLowerCase())} (+${money(a.price)})</span>`:''}</div>
      <div class="opt"><div class="opt-h"><b>Color: ${COLORS[d.color][0]}</b></div>
        <div class="swatches">${m.colors.map(c=>`<button class="sw" style="background:${COLORS[c][1]}" data-act="color" data-v="${c}" aria-pressed="${d.color===c}" aria-label="${COLORS[c][0]}" title="${COLORS[c][0]}"></button>`).join('')}</div></div>
      <div class="opt"><div class="opt-h"><b>Suela: ${SOLES[d.sole][0]}</b></div>
        <div class="swatches">${m.soles.map(c=>`<button class="sw" style="background:${SOLES[c][1]}" data-act="sole" data-v="${c}" aria-pressed="${d.sole===c}" aria-label="Suela ${SOLES[c][0]}" title="${SOLES[c][0]}"></button>`).join('')}</div></div>
      <div class="opt">
        <div class="opt-h"><b>Talla${d.size?`: ${d.size} (${SIZE_CM[d.size].toFixed(1)} cm)`:''}</b><button class="link" data-act="guia" style="font-size:13px">Guía de tallas</button></div>
        <div class="sizes" role="group" aria-label="Talla">${SIZES.map(z=>`<button data-act="size" data-v="${z}" aria-pressed="${d.size===z}">${z}</button>`).join('')}</div>
        ${S.sizeErr&&!d.size?'<p class="err">Elige tu talla para continuar.</p>':''}
      </div>
      <div class="opt"><div class="opt-h"><b>Accesorio (opcional)</b></div>
        <div class="accs">${DB.accs.filter(x=>x.active).map(x=>`<button class="acc" data-act="acc" data-v="${x.id}" aria-pressed="${d.acc===x.id}"><span class="tone" style="background:${x.tone||'transparent'}"></span>${esc(x.name)}<span class="p">${x.price?'+'+money(x.price):'—'}</span></button>`).join('')}</div></div>
      <button class="btn primary block" data-act="addcart" style="padding-block:15px">Agregar al carrito · ${money(m.price+a.price)}</button>
      ${S.user?'':'<p class="muted" style="font-size:13px;margin-top:-8px">Tu selección se guarda en este navegador. Al iniciar sesión pasa a tu cuenta.</p>'}
      <div class="perks">
        <div>${IC.cal}<span><b>Entrega programada.</b> Tú eliges el día, desde 4 días hábiles después del pago.</span></div>
        <div>${IC.truck}<span><b>Envío a Milagro y sectores cercanos</b> por ${money(DB.envio)}.</span></div>
        <div>${IC.swap}<span><b>Cambio de talla</b> dentro de 3 días tras la entrega, sin uso.</span></div>
      </div>
      <div class="acd">
        <details open><summary>Descripción</summary><div class="body"><p>${esc(m.desc)}</p><p>Diseño propio de la marca. Se arma bajo pedido con piezas listas, por eso la forma no cambia: tú eliges talla, color, suela y accesorio.</p><p>Ideal para: ${(m.occ||[]).map(o=>OCC[o].toLowerCase()).join(', ')}.</p></div></details>
        <details ${S.guia?'open':''} id="guia"><summary>Guía de tallas</summary><div class="body guide"><p>Párate sobre una hoja, marca el talón y la punta del dedo más largo y mide en centímetros. Si estás entre dos tallas, elige la mayor.</p><table><thead><tr><th>Talla EC</th><th class="num">Largo del pie</th></tr></thead><tbody>${SIZES.map(z=>`<tr><td>${z}</td><td class="num">${SIZE_CM[z].toFixed(1)} cm</td></tr>`).join('')}</tbody></table></div></details>
        <details><summary>Entrega y pago</summary><div class="body"><p>Pagas el pedido completo al confirmar, con tarjeta o transferencia. El taller fabrica tu par en 2 días hábiles, la marca hace el control de calidad y lo entrega en la fecha que elegiste.</p></div></details>
        <details><summary>Cambios y defectos</summary><div class="body"><p>Defecto de fabricación: reponemos el par sin costo. Talla incorrecta: un cambio dentro de los primeros 3 días tras la entrega, con el calzado sin uso.</p></div></details>
      </div>
    </div>
  </div>
  <section class="sec"><h2>También te puede gustar</h2><div class="grid">${related.map(productCard).join('')}</div></section>`;
}

/* ---------- ayuda ---------- */
function vAyuda(){
  return `<div class="crumbs"><button data-act="home">Inicio</button><span>/</span><span>Ayuda</span></div>
  <div class="help">
    <h1>Ayuda</h1>
    <section id="h-entregas"><h2>Entregas y plazos</h2><p>Entregamos en el cantón Milagro y sectores cercanos. Al pagar eliges la fecha en el calendario: la primera disponible es el cuarto día hábil después de la aprobación del pago. Los fines de semana y feriados no cuentan.</p><ul><li>Si pagas un lunes, la primera fecha es el viernes.</li><li>Si pagas un jueves, la primera fecha es el miércoles siguiente.</li><li>Días 1 y 2: fabricación. Día 3: control de calidad y envío. Día 4: entrega.</li></ul></section>
    <section id="h-tallas"><h2>Guía de tallas</h2><p>Mide tu pie del talón a la punta del dedo más largo. Si estás entre dos tallas, elige la mayor.</p><div class="tablewrap"><table><thead><tr><th>Talla EC</th><th class="num">Largo del pie</th></tr></thead><tbody>${SIZES.map(z=>`<tr><td>${z}</td><td class="num">${SIZE_CM[z].toFixed(1)} cm</td></tr>`).join('')}</tbody></table></div></section>
    <section id="h-pagos"><h2>Pagos</h2><p>El pago es completo al confirmar, porque cada par se fabrica después de pagado. Puedes pagar con tarjeta de crédito o débito, o con transferencia o depósito subiendo tu comprobante. Con transferencia, el plazo empieza cuando la marca verifica el pago.</p></section>
    <section id="h-cambios"><h2>Cambios y defectos</h2><ul><li>Defecto de fabricación: reposición del par sin costo.</li><li>Talla incorrecta: un cambio dentro de los primeros 3 días tras la entrega, con el calzado sin uso.</li></ul></section>
    <section id="h-ra"><h2>Realidad aumentada</h2><p>En la ficha de cada modelo, abre “Pruébalo en tus pies”. Verás el calzado con el color y el accesorio que elegiste sobre tus pies. La vista es referencial: te da una idea cercana, pero no reemplaza la prueba física.</p><button class="btn primary" data-act="open" data-id="luna" data-ar="1" style="justify-self:start">Probar un modelo</button></section>
  </div>`;
}

/* ---------- pie de página ---------- */
function foot(){
  if(S.role!=='usuaria')return `<footer class="foot bleed"><div class="wrap foot-b" style="border:0;margin:0;padding:0"><span>Prototipo funcional · datos de ejemplo.</span><span>Abre la página en otra pestaña como Usuaria para ver los cambios de estado.</span></div></footer>`;
  return `<footer class="foot bleed"><div class="wrap">
    <div class="foot-g">
      <div><h4>Atención a clientas</h4><ul><li><button data-act="nav" data-v="pedidos">Seguir mi pedido</button></li><li><button data-act="help" data-v="entregas">Entregas y plazos</button></li><li><button data-act="help" data-v="tallas">Guía de tallas</button></li><li><button data-act="help" data-v="cambios">Cambios y defectos</button></li><li><button data-act="help" data-v="pagos">Pagos</button></li></ul></div>
      <div><h4>Comprar</h4><ul><li><button data-act="cat" data-v="nuevo">Nuevo</button></li><li><button data-act="cat" data-v="todo">Toda la colección</button></li><li><button data-act="cat" data-v="fiesta">Para la fiesta</button></li><li><button data-act="cat" data-v="limitada">Edición limitada</button></li></ul></div>
      <div><h4>Mi cuenta</h4><ul><li><button data-act="nav" data-v="${S.user?'cuenta':'login'}">${S.user?'Mis datos':'Ingresar'}</button></li><li><button data-act="nav" data-v="registro">Crear cuenta</button></li><li><button data-act="nav" data-v="carrito">Carrito</button></li><li><button data-act="help" data-v="ra">Realidad aumentada</button></li></ul></div>
      <div><h4>Entérate primero</h4><p class="muted" style="font-size:14px">Nuevas colecciones y ediciones limitadas en tu correo.</p>
        <form class="news" data-form="news" novalidate><input id="newsmail" name="mail" type="email" placeholder="Tu correo" aria-label="Tu correo"><button class="btn primary" type="submit">Suscribirme</button></form>
        <div class="pays"><span>VISA</span><span>MASTERCARD</span><span>DÉBITO</span><span>TRANSFERENCIA</span></div></div>
    </div>
    <div class="foot-b"><span>© 2026 Tu marca · Milagro, Guayas, Ecuador · Instagram: usuario por definir</span><span>Prototipo funcional para el proyecto de titulación. Datos de ejemplo; pago simulado y sin guardar datos de tarjeta.</span></div>
  </div></footer>`;
}

function itemRow(i,idx,removable){const m=model(i.modelId)||{name:i.name,style:'cerrado',heel:0,soleT:8};
  return `<div class="item"><div class="thumb">${shoeSVG(m,i.color,i.sole,i.acc)}</div><div><h3>${esc(i.name)}</h3><p class="meta">${desc(i)}</p></div><div class="end"><b class="num">${money(i.price)}</b>${removable?`<br><button class="link" data-act="rmcart" data-v="${idx}" style="font-size:13px">Quitar</button>`:''}</div></div>`}

function totals(c){const sub=c.reduce((s,i)=>s+i.price,0);return{sub,env:c.length?DB.envio:0,total:sub+(c.length?DB.envio:0)}}

function vCarrito(){
  const c=cart(),t=totals(c);
  if(!c.length)return `<h2>Tu carrito</h2><div class="empty"><p>Tu carrito está vacío.</p><button class="btn primary" data-act="nav" data-v="catalogo">Ver el catálogo</button></div>`;
  return `<h2>Tu carrito</h2>
  ${S.user?'':`<div class="banner"><span>Tu selección está guardada temporalmente en este navegador. Inicia sesión para guardarla en tu cuenta y programar la entrega.</span><button class="btn sm primary" data-act="tologin">Iniciar sesión</button></div>`}
  <div class="two"><div class="items">${c.map((i,k)=>itemRow(i,k,true)).join('')}</div>
  <div class="summary">
    <div class="kv"><span>Subtotal (${c.length} ${c.length>1?'pares':'par'})</span><span class="num">${money(t.sub)}</span></div>
    <div class="kv"><span>Envío a Milagro y sectores cercanos</span><span class="num">${money(t.env)}</span></div>
    <div class="kv total"><span>Total</span><span class="num">${money(t.total)}</span></div>
    <button class="btn primary block" data-act="programar">Programar entrega</button>
    <p class="muted" style="font-size:13px">El pago es completo al confirmar: cada par se fabrica solo después de pagado.</p>
  </div></div>`;
}

function vProgramar(){
  const c=cart();if(!c.length)return vCarrito();
  const base=today(),min=minDate(base),count=bizList(base,4);
  if(!S.calMonth)S.calMonth=ymd(min).slice(0,7);
  const [y,mo]=S.calMonth.split('-').map(Number),first=new Date(y,mo-1,1),start=(first.getDay()+6)%7,days=new Date(y,mo,0).getDate();
  const countSet=new Set(count.slice(0,3).map(ymd));
  let cells=['lun','mar','mié','jue','vie','sáb','dom'].map(d=>`<div class="dow">${d}</div>`).join('');
  for(let i=0;i<start;i++)cells+='<div></div>';
  for(let dd=1;dd<=days;dd++){const d=new Date(y,mo-1,dd),k=ymd(d),h=holiday(d),wk=d.getDay()===0||d.getDay()===6,ok=d>=min&&!wk&&!h;
    const cls=['day',ok?'ok':'',S.fecha===k?'sel':'',wk?'wk':'',h?'hol':'',countSet.has(k)?'count':'',k===ymd(base)?'today':''].join(' ');
    const why=h?`Feriado: ${h.name}`:wk?'Fin de semana':d<min?'Antes del plazo mínimo':'Disponible';
    cells+=`<button class="${cls}" ${ok?`data-act="pickdate" data-v="${k}"`:'disabled'} title="${esc(why)}" aria-label="${fmtL(k)}: ${esc(why)}">${dd}</button>`}
  const canPrev=S.calMonth>ymd(min).slice(0,7);
  const nextMon=(()=>{let d=addDays(realToday(),1);while(d.getDay()!==1)d=addDays(d,1);return ymd(d)})();
  const nextThu=(()=>{let d=addDays(realToday(),1);while(d.getDay()!==4)d=addDays(d,1);return ymd(d)})();
  return `<button class="btn ghost" data-act="nav" data-v="carrito" style="width:fit-content">← Volver al carrito</button>
  <div class="two">
    <div style="display:grid;gap:16px;min-width:0">
      <div><p class="eyebrow">Paso 1 de 2</p><h2>¿Para qué día necesitas tu calzado?</h2></div>
      <p class="muted">Contamos 4 días hábiles desde que se aprueba el pago (${S.demoToday?'pago simulado el':'hoy,'} ${fmt(ymd(base))}): 2 de fabricación, 1 de control de calidad y envío, y 1 de entrega. Los fines de semana y feriados no cuentan.</p>
      <div class="countlist">${count.map((d,i)=>`<span>${i+1}. ${fmt(ymd(d))}</span>`).join('')}</div>
      <div class="cal">
        <div class="cal-h"><button class="btn sm" data-act="calnav" data-v="-1" ${canPrev?'':'disabled'} aria-label="Mes anterior">‹</button><b>${first.toLocaleDateString('es-EC',{month:'long',year:'numeric'})}</b><button class="btn sm" data-act="calnav" data-v="1" aria-label="Mes siguiente">›</button></div>
        <div class="cal-g">${cells}</div>
        <div class="legend"><span><i style="background:var(--soft)"></i>Disponible</span><span><i style="background:repeating-linear-gradient(135deg,transparent 0 3px,var(--accent) 3px 4px)"></i>Días del plazo</span><span><i style="background:var(--crit);border-radius:50%;width:8px;height:8px"></i>Feriado</span></div>
      </div>
      <details class="demo" ${S.demoToday?'open':''}><summary>Modo demostración: simular el día de pago</summary>
        <p class="muted" style="font-size:13px;margin-top:8px">Sirve para mostrar en la exposición cómo el calendario calcula la primera fecha.</p>
        <div class="chips">
          <button class="chip" data-act="demo" data-v="" aria-pressed="${!S.demoToday}">Hoy</button>
          <button class="chip" data-act="demo" data-v="${nextMon}" aria-pressed="${S.demoToday===nextMon}">Pago un lunes</button>
          <button class="chip" data-act="demo" data-v="${nextThu}" aria-pressed="${S.demoToday===nextThu}">Pago un jueves</button>
          <button class="chip" data-act="demo" data-v="2026-10-29" aria-pressed="${S.demoToday==='2026-10-29'}">Antes de feriados de noviembre</button>
        </div></details>
    </div>
    <div class="summary">
      <p class="eyebrow">Tu entrega</p>
      <div class="kv"><span>Primera fecha disponible</span><span>${fmt(ymd(min))}</span></div>
      <div class="kv"><span>Fecha elegida</span><b>${S.fecha?fmtL(S.fecha):'—'}</b></div>
      <div class="kv total"><span>Total a pagar</span><span class="num">${money(totals(c).total)}</span></div>
      <button class="btn primary block" data-act="topago" ${S.fecha?'':'disabled'}>Continuar al pago</button>
    </div>
  </div>`;
}

function vPago(){
  const c=cart();if(!c.length||!S.fecha)return vProgramar();const t=totals(c),u=userOf(S.user);
  const card=`<form class="f" data-form="card" novalidate>
      <div class="field"><label for="cname">Nombre en la tarjeta</label><input id="cname" name="cname" value="${esc(u?.name)}" autocomplete="off"></div>
      <div class="field"><label for="cnum">Número de tarjeta</label><input id="cnum" name="cnum" inputmode="numeric" placeholder="4111 1111 1111 1111" autocomplete="off"></div>
      <div class="row2"><div class="field"><label for="cexp">Vence (MM/AA)</label><input id="cexp" name="cexp" placeholder="08/28" autocomplete="off"></div><div class="field"><label for="ccvv">CVV</label><input id="ccvv" name="ccvv" inputmode="numeric" placeholder="123" autocomplete="off"></div></div>
      ${S.payErr?`<p class="err">${esc(S.payErr)}</p>`:''}
      <button class="btn primary block" type="submit">Pagar ${money(t.total)}</button>
      <button class="link" type="button" data-act="fillcard" style="justify-self:start;font-size:13px">Usar tarjeta de prueba</button>
      <p class="muted" style="font-size:13px">Pantalla simulada. En el sitio final el cobro lo hará una pasarela segura disponible en Ecuador (PayPhone, Datafast o Kushki) y el sitio no guardará los datos de la tarjeta.</p>
    </form>`;
  const tr=`<form class="f" data-form="transfer" novalidate>
      <div class="summary" style="background:var(--stage);border:0"><p class="eyebrow">Datos para transferir (ejemplo)</p>
        <div class="kv"><span>Banco</span><span>Banco de ejemplo</span></div><div class="kv"><span>Cuenta de ahorros</span><span class="mono">2201 4567 89</span></div><div class="kv"><span>Titular</span><span>Tu marca</span></div><div class="kv"><span>Valor</span><b class="num">${money(t.total)}</b></div></div>
      <div class="field"><label for="proof">Comprobante (foto o captura)</label><input id="proof" name="proof" type="file" accept="image/*,application/pdf"></div>
      ${S.payErr?`<p class="err">${esc(S.payErr)}</p>`:''}
      <button class="btn primary block" type="submit">Enviar comprobante</button>
      <p class="muted" style="font-size:13px">La marca verifica el comprobante desde su panel. El plazo de 4 días hábiles empieza a contar desde esa verificación; si tu fecha queda antes, se mueve a la primera fecha posible.</p>
    </form>`;
  return `<button class="btn ghost" data-act="nav" data-v="programar" style="width:fit-content">← Cambiar fecha</button>
  <div class="two">
    <div style="display:grid;gap:16px;min-width:0">
      <div><p class="eyebrow">Paso 2 de 2</p><h2>Pago completo</h2></div>
      <div class="tabs" role="tablist"><button role="tab" data-act="paytab" data-v="tarjeta" aria-selected="${S.paytab==='tarjeta'}">Tarjeta de crédito o débito</button><button role="tab" data-act="paytab" data-v="transferencia" aria-selected="${S.paytab==='transferencia'}">Transferencia o depósito</button></div>
      ${S.paytab==='tarjeta'?card:tr}
    </div>
    <div class="summary">
      <p class="eyebrow">Resumen del pedido</p>
      ${c.map(i=>`<div class="kv"><span>${esc(i.name)} · T${i.size}</span><span class="num">${money(i.price)}</span></div>`).join('')}
      <div class="kv"><span>Envío</span><span class="num">${money(t.env)}</span></div>
      <div class="kv"><span>Entrega</span><span>${fmt(S.fecha)}</span></div>
      <div class="kv"><span>Dirección</span><span style="text-align:right">${esc(u?.address)}</span></div>
      <div class="kv total"><span>Total</span><span class="num">${money(t.total)}</span></div>
    </div>
  </div>`;
}

function vAprobado(){
  const o=DB.orders.find(x=>x.id===S.lastOrder);if(!o)return vPedidos();const ok=o.pago.estado==='aprobado';
  return `<div class="done">
    <div class="check ${ok?'':'wait'}"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${ok?'<path d="M5 12.5l4.5 4.5L19 7.5"/>':'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2"/>'}</svg></div>
    <h1>${ok?'Pago aprobado':'Comprobante recibido'}</h1>
    <p class="muted">${ok?`Tu pedido <b class="mono">${o.id}</b> pasó al taller. Lo recibirás el <b>${fmtL(o.fecha)}</b>.`:`La marca verificará tu transferencia del pedido <b class="mono">${o.id}</b>. Te avisaremos aquí mismo cuando pase al taller.`}</p>
    <div class="actions"><button class="btn primary" data-act="order" data-id="${o.id}">Ver seguimiento</button><button class="btn" data-act="nav" data-v="catalogo">Seguir mirando</button></div>
  </div>`;
}

function progress(o){const i=FLOW.indexOf(o.estado);return `<div class="bar">${FLOW.map((_,k)=>`<i class="${k<=i?'on':''}"></i>`).join('')}</div>`}

function vPedidos(){
  if(!S.user)return vLogin('Inicia sesión para ver tus pedidos.');
  const list=DB.orders.filter(o=>o.user===S.user).slice().reverse();
  return `<div><h2>Mis pedidos</h2><p class="muted">Los estados se actualizan cuando el taller o la marca avanzan tu pedido.</p></div>
  ${list.length?`<div class="orders">${list.map(o=>`<button class="ord" data-act="order" data-id="${o.id}">
      <div><span class="code">${o.id}${o.ejemplo?' · ejemplo':''}</span><h3 style="font-size:19px">${o.items.map(i=>esc(i.name)).join(' + ')}</h3><span class="muted" style="font-size:13px">Entrega: ${fmtL(o.fecha)}</span></div>
      ${chip(o.estado)}${progress(o)}</button>`).join('')}</div>`:`<div class="empty"><p>Aún no tienes pedidos.</p><button class="btn primary" data-act="nav" data-v="catalogo">Ver el catálogo</button></div>`}`;
}

function timeline(o){
  const idx=FLOW.indexOf(o.estado);
  const pre=o.estado==='Pago por verificar'?`<li class="on cur"><span class="dot">!</span><div><b>Pago por verificar</b><p class="who">La marca está revisando tu comprobante.</p></div></li>`:o.estado==='Pago rechazado'?`<li class="on cur"><span class="dot">×</span><div><b>Pago rechazado</b><p class="who">El comprobante no coincide. Escríbenos desde tu cuenta para revisarlo.</p></div></li>`:'';
  return `<ol class="steps">${pre}${FLOW.map((f,k)=>{const h=o.historial.slice().reverse().find(x=>x.e===f);return `<li class="${k<=idx?'on':''} ${k===idx?'cur':''}"><span class="dot">${k<idx?'✓':k+1}</span><div><b>${f}</b><p class="who">${h?`${fmtTs(h.at)} · ${esc(h.por)}`:esc(WHO[f])}</p></div></li>`}).join('')}</ol>`;
}

function vPedido(){
  const o=DB.orders.find(x=>x.id===S.orderId);if(!o||o.user!==S.user)return vPedidos();
  return `<button class="btn ghost" data-act="nav" data-v="pedidos" style="width:fit-content">← Mis pedidos</button>
  <div class="two">
    <div style="display:grid;gap:18px;min-width:0">
      <div><span class="mono muted">${o.id}</span><h2>Seguimiento</h2><p class="muted">Entrega programada: <b style="color:var(--fg)">${fmtL(o.fecha)}</b>${o.fechaAnterior?` (antes ${fmt(o.fechaAnterior)}; se movió porque el pago se verificó después)`:''}</p></div>
      ${timeline(o)}
    </div>
    <div style="display:grid;gap:12px">
      ${o.items.map(i=>itemRow(i,0,false)).join('')}
      <div class="summary"><div class="kv"><span>Pago</span><span>${o.pago.metodo==='tarjeta'?'Tarjeta':'Transferencia'} · ${o.pago.estado}</span></div><div class="kv"><span>Envío</span><span class="num">${money(o.envio)}</span></div><div class="kv total"><span>Total pagado</span><span class="num">${money(o.total)}</span></div></div>
    </div>
  </div>`;
}

function vLogin(msg){
  return `<div class="authbox">
    <div><p class="eyebrow">Tu cuenta</p><h2>Iniciar sesión</h2>${msg?`<p class="muted" style="margin-top:6px">${esc(msg)}</p>`:''}</div>
    <form class="f" data-form="login" novalidate>
      <div class="field"><label for="lemail">Correo</label><input id="lemail" name="email" type="email" autocomplete="username"></div>
      <div class="field"><label for="lpass">Contraseña</label><input id="lpass" name="pass" type="password" autocomplete="current-password"></div>
      ${S.authErr?`<p class="err">${esc(S.authErr)}</p>`:''}
      <button class="btn primary block" type="submit">Ingresar</button>
    </form>
    <div class="demo-cred"><span>Cuenta de prueba: <b>maria@ejemplo.com</b> · 123456</span><button class="btn sm" data-act="fill" data-v="maria@ejemplo.com|123456" data-id="l">Usar</button></div>
    <p class="muted" style="font-size:14px">¿No tienes cuenta? <button class="link" data-act="nav" data-v="registro">Regístrate</button></p>
  </div>`;
}
function vRegistro(){
  return `<div class="authbox" style="max-width:560px">
    <div><p class="eyebrow">Tu cuenta</p><h2>Crear cuenta</h2><p class="muted" style="margin-top:6px">Guardamos tu carrito y tus pedidos. Si se va la luz o se cierra el navegador, al volver a ingresar todo sigue aquí.</p></div>
    <form class="f" data-form="registro" novalidate>
      <div class="field"><label for="rname">Nombre y apellido</label><input id="rname" name="name" autocomplete="name"></div>
      <div class="row2"><div class="field"><label for="remail">Correo</label><input id="remail" name="email" type="email" autocomplete="email"></div><div class="field"><label for="rphone">Teléfono</label><input id="rphone" name="phone" inputmode="tel" placeholder="09XXXXXXXX" autocomplete="tel"></div></div>
      <div class="field"><label for="raddr">Dirección de entrega</label><input id="raddr" name="address" placeholder="Barrio, calle y referencia en Milagro o sector cercano" autocomplete="street-address"></div>
      <div class="field"><label for="rpass">Contraseña (mínimo 6 caracteres)</label><input id="rpass" name="pass" type="password" autocomplete="new-password"></div>
      ${S.authErr?`<p class="err">${esc(S.authErr)}</p>`:''}
      <button class="btn primary block" type="submit">Crear cuenta</button>
    </form>
    <p class="muted" style="font-size:14px">¿Ya tienes cuenta? <button class="link" data-act="nav" data-v="login">Inicia sesión</button></p>
  </div>`;
}
function vCuenta(){
  const u=userOf(S.user);if(!u)return vLogin();
  return `<div class="authbox" style="max-width:560px"><div><p class="eyebrow">Tu cuenta</p><h2>${esc(u.name)}</h2></div>
    <div class="summary" style="border:0;background:var(--stage)"><div class="kv"><span>Correo</span><span>${esc(u.email)}</span></div><div class="kv"><span>Teléfono</span><span>${esc(u.phone)}</span></div><div class="kv"><span>Dirección</span><span style="text-align:right">${esc(u.address)}</span></div><div class="kv"><span>Pedidos</span><span>${DB.orders.filter(o=>o.user===u.email).length}</span></div></div>
    <div class="actions"><button class="btn" data-act="nav" data-v="pedidos">Ver mis pedidos</button><button class="btn ghost" data-act="logout">Cerrar sesión</button></div></div>`;
}

/* ---------- proveedor ---------- */
function staffLogin(kind){
  const p=kind==='prov';
  return `<div class="authbox"><div><p class="eyebrow">${p?'Panel del proveedor':'Panel de administración'}</p><h2>${p?'Ingreso del taller':'Ingreso de la marca'}</h2></div>
    <form class="f" data-form="${p?'provlogin':'admlogin'}" novalidate>
      <div class="field"><label for="${kind}email">Correo</label><input id="${kind}email" name="email" type="email" autocomplete="username"></div>
      <div class="field"><label for="${kind}pass">Contraseña</label><input id="${kind}pass" name="pass" type="password" autocomplete="current-password"></div>
      ${S.authErr?`<p class="err">${esc(S.authErr)}</p>`:''}
      <button class="btn primary block" type="submit">Ingresar</button></form>
    <div class="demo-cred"><span>Prueba: <b>${p?'taller@ejemplo.com':'admin@ejemplo.com'}</b> · ${p?'taller':'admin'}</span><button class="btn sm" data-act="fill" data-v="${p?'taller@ejemplo.com|taller':'admin@ejemplo.com|admin'}" data-id="${kind}">Usar</button></div></div>`;
}
function urg(o){if(o.estado==='Entregado'||o.estado==='Enviado')return'';const n=bizLeft(o.fecha);const t=n<=1?'crit':n<=2?'warn':'ok';return `<span class="urg ${t}">${n===0?'Entrega hoy o vencida':n+' día'+(n>1?'s':'')+' hábil'+(n>1?'es':'')}</span>`}

function vProv(){
  if(!S.prov)return staffLogin('prov');
  if(S.provOrder)return vProvFicha();
  const all=DB.orders.filter(o=>o.pago.estado==='aprobado');
  const f={pendientes:o=>['Recibido','En fabricación'].includes(o.estado),entregados:o=>!['Recibido','En fabricación'].includes(o.estado),todos:()=>true}[S.provFilter];
  const list=all.filter(f).sort((a,b)=>a.fecha.localeCompare(b.fecha));
  const nuevos=all.filter(o=>!o.visto).length;
  return `<div class="opshead"><div><p class="eyebrow">Panel del proveedor</p><h2>Pedidos para fabricar</h2></div>
    <div class="stats"><div class="stat"><b>${nuevos}</b><span>Nuevos</span></div><div class="stat"><b>${all.filter(o=>o.estado==='Recibido').length}</b><span>Por iniciar</span></div><div class="stat"><b>${all.filter(o=>o.estado==='En fabricación').length}</b><span>En fabricación</span></div></div></div>
  ${nuevos?`<div class="banner"><span class="badge-new">Nuevo</span><span>Tienes ${nuevos} pedido${nuevos>1?'s':''} nuevo${nuevos>1?'s':''} con pago aprobado.</span></div>`:''}
  <div class="chips">${[['pendientes','Por hacer'],['entregados','Entregados a la marca'],['todos','Todos']].map(([k,l])=>`<button class="chip" data-act="provfilter" data-v="${k}" aria-pressed="${S.provFilter===k}">${l}</button>`).join('')}</div>
  <div class="tablewrap"><table><thead><tr><th>Pedido</th><th>Pares</th><th>Entrega</th><th>Plazo</th><th>Estado</th></tr></thead><tbody>
  ${list.map(o=>`<tr class="click" data-act="provopen" data-id="${o.id}"><td><span class="mono">${o.id}</span> ${o.visto?'':'<span class="badge-new">Nuevo</span>'}</td><td>${o.items.map(i=>`${esc(i.name)} · T${i.size} · ${COLORS[i.color][0]}`).join('<br>')}</td><td>${fmt(o.fecha)}</td><td>${urg(o)}</td><td>${chip(o.estado)}</td></tr>`).join('')||'<tr><td colspan="5" class="muted">No hay pedidos en esta lista.</td></tr>'}
  </tbody></table></div>`;
}
function vProvFicha(){
  const o=DB.orders.find(x=>x.id===S.provOrder);if(!o){S.provOrder=null;return vProv()}
  const next=o.estado==='Recibido'?['En fabricación','Iniciar fabricación']:o.estado==='En fabricación'?['Control de calidad','Entregar a control de calidad']:null;
  return `<button class="btn ghost" data-act="provback" style="width:fit-content">← Lista de pedidos</button>
  <div class="two">
    <div class="sheet">
      <div class="inline" style="justify-content:space-between"><h3>Ficha de taller · ${o.id}</h3>${chip(o.estado)}</div>
      <div class="grid2"><div><span>Entrega</span>${fmtL(o.fecha)}</div><div><span>Fabricar antes de</span>${fmt(ymd(bizList(fromYmd(o.creado),2)[1]))}</div><div><span>Pares</span>${o.items.length}</div></div>
      ${o.items.map((i,k)=>`<div class="pair"><div class="thumb">${shoeSVG(model(i.modelId),i.color,i.sole,i.acc)}</div><div class="grid2">
        <div><span>Par ${k+1} · Modelo</span>${esc(i.name)}</div><div><span>Talla</span>${i.size} (${SIZE_CM[i.size].toFixed(1)} cm)</div><div><span>Color</span>${COLORS[i.color][0]}</div><div><span>Suela</span>${SOLES[i.sole][0]}</div><div><span>Accesorio</span>${accOf(i.acc).name}</div></div></div>`).join('')}
    </div>
    <div style="display:grid;gap:14px">
      <div class="summary"><p class="eyebrow">Actualizar estado</p>
        ${next?`<button class="btn primary block" data-act="provstate" data-v="${next[0]}" data-id="${o.id}">${next[1]}</button><p class="muted" style="font-size:13px">La usuaria verá el cambio en su seguimiento al instante.</p>`:`<p class="muted">Este pedido ya está en manos de la marca (${esc(o.estado)}).</p>`}
        <button class="btn block" data-act="print">Imprimir ficha</button>
      </div>
      <div class="summary"><p class="eyebrow">Historial</p>${o.historial.map(h=>`<div class="kv"><span>${esc(h.e)}</span><span style="font-size:13px">${fmtTs(h.at)} · ${esc(h.por)}</span></div>`).join('')}</div>
    </div>
  </div>`;
}

/* ---------- administración ---------- */
function vAdmin(){
  if(!S.admin)return staffLogin('admin');
  return {pedidos:admPedidos,pagos:admPagos,catalogo:admCatalogo,ajustes:admAjustes}[S.admTab]();
}
function admPedidos(){
  const f={todos:()=>true,taller:o=>['Recibido','En fabricación'].includes(o.estado),calidad:o=>o.estado==='Control de calidad',enviados:o=>o.estado==='Enviado',entregados:o=>o.estado==='Entregado'}[S.admFilter];
  const list=DB.orders.filter(f).slice().sort((a,b)=>a.fecha.localeCompare(b.fecha));
  const ventas=DB.orders.filter(o=>o.pago.estado==='aprobado').reduce((s,o)=>s+o.total,0);
  return `<div class="opshead"><div><p class="eyebrow">Panel de administración</p><h2>Todos los pedidos</h2></div>
    <div class="stats"><div class="stat"><b>${DB.orders.length}</b><span>Pedidos</span></div><div class="stat"><b>${DB.orders.filter(o=>o.estado==='Control de calidad').length}</b><span>Listos para enviar</span></div><div class="stat"><b class="num">${money(ventas)}</b><span>Cobrado</span></div></div></div>
  <div class="chips">${[['todos','Todos'],['taller','En el taller'],['calidad','Control de calidad'],['enviados','Enviados'],['entregados','Entregados']].map(([k,l])=>`<button class="chip" data-act="admfilter" data-v="${k}" aria-pressed="${S.admFilter===k}">${l}</button>`).join('')}</div>
  <div class="tablewrap"><table><thead><tr><th>Pedido</th><th>Clienta</th><th>Pares</th><th>Entrega</th><th>Estado</th><th>Acción</th></tr></thead><tbody>
  ${list.map(o=>{const u=userOf(o.user);const act=o.estado==='Control de calidad'?`<button class="btn sm primary" data-act="admstate" data-v="Enviado" data-id="${o.id}">Marcar enviado</button>`:o.estado==='Enviado'?`<button class="btn sm primary" data-act="admstate" data-v="Entregado" data-id="${o.id}">Marcar entregado</button>`:o.estado==='Pago por verificar'?`<button class="btn sm" data-act="admtab" data-v="pagos">Verificar pago</button>`:'<span class="muted" style="font-size:13px">—</span>';
    return `<tr><td class="mono">${o.id}</td><td>${esc(u?.name||o.user)}<br><span class="muted" style="font-size:12px">${esc(u?.phone||'')}</span></td><td>${o.items.map(i=>`${esc(i.name)} T${i.size}`).join('<br>')}</td><td>${fmt(o.fecha)}<br>${urg(o)}</td><td>${chip(o.estado)}</td><td>${act}</td></tr>`}).join('')||'<tr><td colspan="6" class="muted">No hay pedidos en esta lista.</td></tr>'}
  </tbody></table></div>`;
}
function admPagos(){
  const list=DB.orders.filter(o=>o.estado==='Pago por verificar');
  return `<div><p class="eyebrow">Panel de administración</p><h2>Transferencias por verificar</h2><p class="muted">Al verificar, el pedido pasa al taller y el plazo de 4 días hábiles empieza a contar desde hoy.</p></div>
  ${list.length?list.map(o=>{const u=userOf(o.user),min=ymd(minDate(today())),moves=o.fecha<min;
    return `<div class="paycard"><div style="display:grid;gap:8px;min-width:0"><div class="inline"><span class="mono">${o.id}</span>${chip(o.estado)}</div><b>${esc(u?.name)} · ${money(o.total)}</b><span class="muted" style="font-size:13px">${o.items.map(i=>esc(i.name)+' T'+i.size).join(', ')} · entrega pedida ${fmt(o.fecha)}</span>
      ${moves?`<span class="urg warn">Si se verifica hoy, la entrega se mueve al ${fmt(min)}.</span>`:''}
      ${o.pago.img?`<img class="proof" src="${o.pago.img}" alt="Comprobante de ${esc(u?.name)}">`:`<span class="muted" style="font-size:13px">Archivo: ${esc(o.pago.comprobante)}</span>`}</div>
      <div class="actions"><button class="btn primary" data-act="verify" data-id="${o.id}">Verificar pago</button><button class="btn" data-act="reject" data-id="${o.id}">Rechazar</button></div></div>`}).join(''):'<div class="empty"><p>No hay transferencias pendientes.</p></div>'}`;
}
function admCatalogo(){
  return `<div><p class="eyebrow">Panel de administración</p><h2>Catálogo</h2><p class="muted">Los cambios se ven al instante en la tienda.</p></div>
  <div style="display:grid;gap:12px">${DB.models.map(m=>`<div class="adm-model"><div class="thumb">${shoeSVG(m,m.colors[0]||'nude',m.soles[0]||'natural','ninguno')}</div><div class="fields">
    <div class="inline" style="justify-content:space-between"><h3>${esc(m.name)}</h3><label class="tog"><input type="checkbox" data-chg="mactive" data-id="${m.id}" ${m.active?'checked':''}> Visible en la tienda</label></div>
    <div class="inline"><label for="pr-${m.id}" style="font-size:13px;font-weight:600">Precio</label><input id="pr-${m.id}" type="number" min="1" step="0.5" value="${m.price}" data-chg="mprice" data-id="${m.id}"><span class="muted" style="font-size:13px">${TYPES[m.type]}</span></div>
    <div class="inline">${Object.keys(COLORS).map(c=>`<button class="mini-sw" data-act="togcolor" data-id="${m.id}" data-v="${c}" aria-pressed="${m.colors.includes(c)}"><i style="background:${COLORS[c][1]}"></i>${COLORS[c][0]}</button>`).join('')}</div>
    <div class="inline">${Object.keys(SOLES).map(c=>`<button class="mini-sw" data-act="togsole" data-id="${m.id}" data-v="${c}" aria-pressed="${m.soles.includes(c)}"><i style="background:${SOLES[c][1]}"></i>Suela ${SOLES[c][0].toLowerCase()}</button>`).join('')}</div>
  </div></div>`).join('')}</div>
  <h3>Accesorios</h3>
  <div class="tablewrap"><table><thead><tr><th>Accesorio</th><th>Precio extra</th><th>Disponible</th></tr></thead><tbody>
  ${DB.accs.filter(a=>a.id!=='ninguno').map(a=>`<tr><td><span class="inline"><i style="width:14px;height:14px;border-radius:50%;background:${a.tone};border:1px solid rgba(0,0,0,.2);display:inline-block"></i>${esc(a.name)}</span></td><td><input aria-label="Precio de ${esc(a.name)}" id="ap-${a.id}" type="number" min="0" step="0.5" value="${a.price}" data-chg="aprice" data-id="${a.id}" style="width:90px;border:1px solid var(--line);background:var(--surface);border-radius:8px;padding:6px 8px"></td><td><label class="tog"><input type="checkbox" data-chg="aactive" data-id="${a.id}" ${a.active?'checked':''}> Sí</label></td></tr>`).join('')}
  </tbody></table></div>
  <h3>Agregar modelo</h3>
  <form class="f summary" data-form="addmodel" novalidate>
    <div class="row2"><div class="field"><label for="nmname">Nombre del modelo</label><input id="nmname" name="name" placeholder="Sandalia Coral"></div><div class="field"><label for="nmtype">Tipo</label><select id="nmtype" name="type">${Object.entries(TYPES).map(([k,l])=>`<option value="${k}">${l}</option>`).join('')}</select></div></div>
    <div class="row2"><div class="field"><label for="nmprice">Precio</label><input id="nmprice" name="price" type="number" min="1" step="0.5" value="40"></div><div class="field"><label for="nmdesc">Descripción</label><input id="nmdesc" name="desc" placeholder="Para qué ocasión es y su altura"></div></div>
    ${S.admErr?`<p class="err">${esc(S.admErr)}</p>`:''}
    <button class="btn primary" type="submit" style="justify-self:start">Agregar al catálogo</button></form>`;
}
function admAjustes(){
  const hs=DB.holidays.slice().sort((a,b)=>a.d.localeCompare(b.d)).filter(h=>h.d>=ymd(realToday()).slice(0,4)+'-01-01');
  return `<div><p class="eyebrow">Panel de administración</p><h2>Envío y feriados</h2></div>
  <div class="two">
    <div style="display:grid;gap:12px;min-width:0">
      <h3>Feriados que bloquea el calendario</h3>
      <p class="muted" style="font-size:13px">Feriados de ejemplo. Confírmalos con el calendario oficial del año.</p>
      <div class="tablewrap"><table><thead><tr><th>Fecha</th><th>Feriado</th><th></th></tr></thead><tbody>${hs.map(h=>`<tr><td>${fmt(h.d)} ${h.d.slice(0,4)}</td><td>${esc(h.name)}</td><td><button class="link" data-act="rmhol" data-v="${h.d}">Quitar</button></td></tr>`).join('')}</tbody></table></div>
      <form class="f summary" data-form="addhol" novalidate><div class="row2"><div class="field"><label for="hd">Fecha</label><input id="hd" name="d" type="date"></div><div class="field"><label for="hn">Nombre</label><input id="hn" name="name" placeholder="Feriado local"></div></div><button class="btn primary" type="submit" style="justify-self:start">Agregar feriado</button></form>
    </div>
    <div style="display:grid;gap:12px">
      <div class="summary"><p class="eyebrow">Costo de envío</p><div class="inline"><label for="envio" style="font-size:13px;font-weight:600">Milagro y sectores cercanos</label><input id="envio" type="number" min="0" step="0.25" value="${DB.envio}" data-chg="envio" style="width:96px;border:1px solid var(--line);background:var(--surface);border-radius:8px;padding:6px 8px"></div><p class="muted" style="font-size:13px">Valor por definir. Se muestra en el carrito antes de pagar.</p></div>
      <div class="summary"><p class="eyebrow">Datos de demostración</p><p class="muted" style="font-size:13px">Vuelve a cargar los modelos, cuentas y pedidos de ejemplo. Borra los pedidos creados durante la prueba.</p>
        ${S.confirmReset?`<div class="actions"><button class="btn primary" data-act="reset" data-v="yes">Sí, restablecer</button><button class="btn" data-act="reset" data-v="no">Cancelar</button></div>`:`<button class="btn" data-act="reset" style="justify-self:start">Restablecer datos de ejemplo</button>`}</div>
    </div>
  </div>`;
}

/* ---------- render ---------- */
function render(){
  let body;
  if(S.role==='usuaria')body=({ayuda:vAyuda,tienda:vTienda,catalogo:vCatalogo,modelo:vModelo,carrito:vCarrito,programar:vProgramar,pago:vPago,aprobado:vAprobado,pedidos:vPedidos,pedido:vPedido,login:()=>vLogin(S.after?'Inicia sesión para programar la entrega y pagar.':''),registro:vRegistro,cuenta:vCuenta}[S.view]||vCatalogo)();
  else if(S.role==='proveedor')body=vProv();else body=vAdmin();
  $('#app').innerHTML=header()+`<main class="wrap ${S.role==='usuaria'&&S.view==='catalogo'?'home':''}">${body}</main>`+foot();
  if(S.scrollTo){const el=document.getElementById(S.scrollTo);S.scrollTo=null;if(el)setTimeout(()=>el.scrollIntoView({block:'start'}),0)}
  hook();
}
function hook(){
  const st=$('#stage3d');
  if(st){let sx=null,r0=0;st.onpointerdown=e=>{sx=e.clientX;r0=S.rot;st.setPointerCapture(e.pointerId)};st.onpointermove=e=>{if(sx===null)return;S.rot=r0+(e.clientX-sx)*0.6;$('#spin').style.transform=`rotateY(${S.rot}deg) scale(${S.zoom})`};st.onpointerup=st.onpointercancel=()=>{sx=null;saveS()}}
  const ar=$('#ar'),sh=$('#arShoe');
  if(ar&&sh){let drag=false;sh.onpointerdown=e=>{drag=true;sh.setPointerCapture(e.pointerId)};sh.onpointermove=e=>{if(!drag)return;const b=ar.getBoundingClientRect();S.ar.x=Math.max(0,Math.min(100,(e.clientX-b.left)/b.width*100));S.ar.y=Math.max(0,Math.min(100,(e.clientY-b.top)/b.height*100));sh.style.left=S.ar.x+'%';sh.style.top=S.ar.y+'%'};sh.onpointerup=sh.onpointercancel=()=>{drag=false;saveS()}}
}
function arT(){const sh=$('#arShoe');if(sh)sh.style.transform=`translate(-50%,-50%) rotate(${S.ar.r}deg) scale(${S.ar.s}) scaleX(${S.ar.m?-1:1})`}

/* ---------- acciones ---------- */
function setState(id,st,por){const o=DB.orders.find(x=>x.id===id);if(!o)return;o.estado=st;o.historial.push({e:st,at:new Date().toISOString(),por});saveDB();toast(`${id}: ${st}`);render()}
function newOrder(metodo,extra){
  const c=cart(),t=totals(c),id='P-'+(++DB.seq);const ok=metodo==='tarjeta';const now=new Date().toISOString();
  const o={id,user:S.user,items:c.slice(),subtotal:t.sub,envio:t.env,total:t.total,fecha:S.fecha,creado:ymd(today()),pago:Object.assign({metodo,estado:ok?'aprobado':'pendiente'},extra||{}),estado:ok?'Recibido':'Pago por verificar',
    historial:ok?[{e:'Pago aprobado',at:now,por:'Pasarela (simulada)'},{e:'Recibido',at:now,por:'Sistema'}]:[{e:'Comprobante subido',at:now,por:'Usuaria'}],visto:false};
  DB.orders.push(o);DB.carts[S.user]=[];saveDB();S.lastOrder=id;S.fecha=null;S.calMonth=null;S.payErr=null;go('aprobado');
}
const ACT={
  home(){S.role='usuaria';go('catalogo')},
  role(v){S.role=v;S.authErr=null;S.view=v==='usuaria'?'catalogo':v;saveS();render();scrollTo({top:0})},
  nav(v){S.authErr=null;if(v==='programar')return ACT.programar();go(v)},
  filter(v){S.filter=v;saveS();render()},
  open(_,id,t){S.role='usuaria';S.modelId=id;S.vtab=t&&t.dataset.ar?'ar':'3d';S.rot=-24;S.zoom=1;S.sizeErr=false;go('modelo')},
  vtab(v){S.vtab=v;saveS();render()},
  rot(v){S.rot+=Number(v);const sp=$('#spin');if(sp){sp.style.transition='transform .5s ease';sp.style.transform=`rotateY(${S.rot}deg) scale(${S.zoom})`;setTimeout(()=>sp.style.transition='',520)}saveS()},
  zoom(v){S.zoom=Math.max(.6,Math.min(1.6,S.zoom+Number(v)));const sp=$('#spin');if(sp)sp.style.transform=`rotateY(${S.rot}deg) scale(${S.zoom})`;saveS()},
  armirror(){S.ar.m=!S.ar.m;arT();saveS()},
  arsample(){arPhoto=null;render()},
  guia(){S.guia=true;S.scrollTo='guia';render()},
  cat(v){S.f={type:[],occ:[],color:[],price:'',tag:''};S.q='';S.sort='destacados';
    if(v==='nuevo')S.f.tag='Nuevo';else if(v==='limitada')S.f.tag='Edición limitada';else if(v==='fiesta')S.f.occ=['fiesta'];else if(TYPES[v])S.f.type=[v];go('tienda')},
  trend(v){const[k,x]=v.split(':');S.f={type:[],occ:[],color:[],price:'',tag:''};S.q='';if(k==='price')S.f.price=x;else S.f[k]=[x];go('tienda')},
  unf(v){const i=v.indexOf('|'),k=v.slice(0,i),x=v.slice(i+1);if(k==='q')S.q='';else if(k==='price'||k==='tag')S.f[k]='';else S.f[k]=S.f[k].filter(y=>y!==x);saveS();render()},
  clearf(){S.f={type:[],occ:[],color:[],price:'',tag:''};S.q='';saveS();render()},
  help(v){S.role='usuaria';S.view='ayuda';S.scrollTo='h-'+v;saveS();render();if(!document.getElementById('h-'+v))scrollTo({top:0})},
  size(v){sel(model(S.modelId)).size=Number(v);saveDraft();render()},
  color(v){sel(model(S.modelId)).color=v;saveDraft();render()},
  sole(v){sel(model(S.modelId)).sole=v;saveDraft();render()},
  acc(v){sel(model(S.modelId)).acc=v;saveDraft();render()},
  addcart(){const m=model(S.modelId),d=sel(m);if(!d.size){S.sizeErr=true;render();toast('Elige tu talla');return}
    const a=accOf(d.acc);const c=cart();c.push({modelId:m.id,name:full(m),size:d.size,color:d.color,sole:d.sole,acc:d.acc,price:m.price+a.price});setCart(c);toast('Agregado al carrito');go('carrito')},
  rmcart(v){const c=cart();c.splice(Number(v),1);setCart(c);render()},
  tologin(){S.after='carrito';go('login')},
  programar(){if(!S.user){S.after='programar';toast('Inicia sesión para programar la entrega');return go('login')}if(!cart().length)return go('carrito');S.calMonth=null;go('programar')},
  calnav(v){const[y,m]=S.calMonth.split('-').map(Number);const d=new Date(y,m-1+Number(v),1);S.calMonth=ymd(d).slice(0,7);saveS();render()},
  pickdate(v){S.fecha=v;saveS();render()},
  demo(v){S.demoToday=v||null;S.fecha=null;S.calMonth=null;saveS();render()},
  topago(){if(!S.fecha)return toast('Elige una fecha');S.payErr=null;go('pago')},
  paytab(v){S.paytab=v;S.payErr=null;saveS();render()},
  fillcard(){$('#cnum').value='4111 1111 1111 1111';$('#cexp').value='08/28';$('#ccvv').value='123'},
  order(_,id){S.orderId=id;go('pedido')},
  logout(){S.user=null;S.after=null;go('catalogo');toast('Sesión cerrada')},
  fill(v,id){const[e,p]=v.split('|');const ids=id==='l'?['lemail','lpass']:[id+'email',id+'pass'];$('#'+ids[0]).value=e;$('#'+ids[1]).value=p},
  logoutStaff(v){if(v==='prov'){S.prov=false;S.provOrder=null}else S.admin=false;saveS();render()},
  provfilter(v){S.provFilter=v;saveS();render()},
  provopen(_,id){const o=DB.orders.find(x=>x.id===id);if(o&&!o.visto){o.visto=true;saveDB()}S.provOrder=id;saveS();render();scrollTo({top:0})},
  provback(){S.provOrder=null;saveS();render()},
  provstate(v,id){setState(id,v,'Proveedor')},
  print(){window.print()},
  admtab(v){S.admTab=v;S.admErr=null;S.confirmReset=false;saveS();render()},
  admfilter(v){S.admFilter=v;saveS();render()},
  admstate(v,id){setState(id,v,'Marca')},
  verify(_,id){const o=DB.orders.find(x=>x.id===id);const min=ymd(minDate(today()));o.pago.estado='aprobado';if(o.fecha<min){o.fechaAnterior=o.fecha;o.fecha=min}
    const now=new Date().toISOString();o.historial.push({e:'Pago verificado',at:now,por:'Marca'},{e:'Recibido',at:now,por:'Sistema'});o.estado='Recibido';o.visto=false;saveDB();toast(`${id} verificado y enviado al taller`);render()},
  reject(_,id){const o=DB.orders.find(x=>x.id===id);o.pago.estado='rechazado';setState(id,'Pago rechazado','Marca')},
  togcolor(v,id){const m=model(id);if(m.colors.includes(v)){if(m.colors.length===1)return toast('Cada modelo necesita al menos un color');m.colors=m.colors.filter(c=>c!==v)}else m.colors.push(v);saveDB();render()},
  togsole(v,id){const m=model(id);if(m.soles.includes(v)){if(m.soles.length===1)return toast('Cada modelo necesita al menos una suela');m.soles=m.soles.filter(c=>c!==v)}else m.soles.push(v);saveDB();render()},
  rmhol(v){DB.holidays=DB.holidays.filter(h=>h.d!==v);saveDB();render()},
  reset(v){if(v==='yes'){seed();saveDB();LS.set(GKEY,'[]');S.confirmReset=false;S.user=null;toast('Datos de ejemplo restablecidos');render()}else if(v==='no'){S.confirmReset=false;render()}else{S.confirmReset=true;render()}}
};
const FORM={
  search(fd){S.q=String(fd.get('q')||'').trim();S.f={type:[],occ:[],color:[],price:'',tag:''};go('tienda')},
  news(fd){const m=String(fd.get('mail')).trim();if(!/^\S+@\S+\.\S+$/.test(m))return toast('Escribe un correo válido');toast('Listo, te avisaremos de lo nuevo (simulado)')},
  login(fd){const e=String(fd.get('email')).trim().toLowerCase(),p=String(fd.get('pass'));const u=DB.users.find(x=>x.email===e&&x.pass===p);
    if(!u){S.authErr='El correo o la contraseña no coinciden. Revisa e intenta de nuevo.';return render()}
    S.user=u.email;S.authErr=null;const g=guestCart();if(g.length){DB.carts[u.email]=(DB.carts[u.email]||[]).concat(g);LS.set(GKEY,'[]');saveDB();toast('Tu selección se guardó en tu cuenta')}else toast('Hola, '+u.name.split(' ')[0]);
    const nx=S.after;S.after=null;nx==='programar'?ACT.programar():go(nx||'catalogo')},
  registro(fd){const u={name:String(fd.get('name')).trim(),email:String(fd.get('email')).trim().toLowerCase(),phone:String(fd.get('phone')).trim(),address:String(fd.get('address')).trim(),pass:String(fd.get('pass'))};
    let err=!u.name?'Escribe tu nombre.':!/^\S+@\S+\.\S+$/.test(u.email)?'Escribe un correo válido.':!/^0\d{9}$/.test(u.phone.replace(/\s/g,''))?'El teléfono debe tener 10 dígitos y empezar con 0.':!u.address?'Escribe tu dirección de entrega.':u.pass.length<6?'La contraseña necesita al menos 6 caracteres.':userOf(u.email)?'Ya existe una cuenta con ese correo. Inicia sesión.':null;
    if(err){S.authErr=err;return render()}DB.users.push(u);DB.carts[u.email]=[];saveDB();FORM.login(new Map([['email',u.email],['pass',u.pass]]))},
  provlogin(fd){if(String(fd.get('email')).trim().toLowerCase()==='taller@ejemplo.com'&&fd.get('pass')==='taller'){S.prov=true;S.authErr=null;saveS();render()}else{S.authErr='Credenciales del taller incorrectas.';render()}},
  admlogin(fd){if(String(fd.get('email')).trim().toLowerCase()==='admin@ejemplo.com'&&fd.get('pass')==='admin'){S.admin=true;S.authErr=null;saveS();render()}else{S.authErr='Credenciales de la marca incorrectas.';render()}},
  card(fd){const n=String(fd.get('cnum')).replace(/\s/g,''),e=String(fd.get('cexp')).trim(),v=String(fd.get('ccvv')).trim();
    S.payErr=!String(fd.get('cname')).trim()?'Escribe el nombre que aparece en la tarjeta.':!/^\d{16}$/.test(n)?'El número de tarjeta debe tener 16 dígitos.':!/^(0[1-9]|1[0-2])\/\d{2}$/.test(e)?'La fecha de vencimiento va en formato MM/AA.':!/^\d{3,4}$/.test(v)?'El CVV tiene 3 o 4 dígitos.':null;
    if(S.payErr)return render();newOrder('tarjeta',{ultimos:n.slice(-4)})},
  transfer(fd,f){const file=f.querySelector('#proof').files[0];if(!file){S.payErr='Sube la foto o captura del comprobante.';return render()}
    const finish=img=>newOrder('transferencia',{comprobante:file.name,img});
    if(file.type.startsWith('image/')&&file.size<600000){const r=new FileReader();r.onload=()=>finish(r.result);r.readAsDataURL(file)}else finish(null)},
  addhol(fd){const d=fd.get('d'),n=String(fd.get('name')).trim()||'Feriado';if(!d)return toast('Elige la fecha del feriado');if(!DB.holidays.find(h=>h.d===d))DB.holidays.push({d,name:n});saveDB();toast('Feriado agregado');render()},
  addmodel(fd){const name=String(fd.get('name')).trim(),type=fd.get('type'),price=Number(fd.get('price'));if(!name||!(price>0)){S.admErr='Escribe el nombre y un precio mayor a 0.';return render()}
    const base={sandalia:['tiras',0,8],tacon:['cerrado',58,6],plano:['cerrado',0,7],plataforma:['tiras',22,18],mule:['mule',22,7],botin:['botin',32,8]}[type];
    DB.models.push({id:'m'+Date.now(),name,type,style:base[0],heel:base[1],soleT:base[2],price,occ:['diario'],tag:'Nuevo',order:99,desc:String(fd.get('desc')).trim()||'Nuevo diseño de la marca.',colors:['nude','negro'],soles:['natural','negra'],active:true});S.admErr=null;saveDB();toast('Modelo agregado al catálogo');render()}
};
const CHG={
  fset(t){const k=t.dataset.k,v=t.dataset.v;S.f[k]=t.checked?[...S.f[k],v]:S.f[k].filter(x=>x!==v);saveS();render()},
  fprice(t){S.f.price=t.value;saveS();render()},
  sort(t){S.sort=t.value;saveS();render()},
  mprice(t){const m=model(t.dataset.id),v=Number(t.value);if(v>0){m.price=v;saveDB();toast('Precio actualizado')}},
  mactive(t){model(t.dataset.id).active=t.checked;saveDB();toast(t.checked?'Visible en la tienda':'Oculto de la tienda')},
  aprice(t){const a=accOf(t.dataset.id),v=Number(t.value);if(v>=0){a.price=v;saveDB();toast('Precio actualizado')}},
  aactive(t){accOf(t.dataset.id).active=t.checked;saveDB()},
  envio(t){const v=Number(t.value);if(v>=0){DB.envio=v;saveDB();toast('Envío actualizado')}},
  arfile(t){const f=t.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{arPhoto=r.result;render()};r.readAsDataURL(f)}
};
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t||t.disabled)return;const a=ACT[t.dataset.act];if(a){e.preventDefault();a(t.dataset.v,t.dataset.id,t)}});
document.addEventListener('submit',e=>{const f=e.target;if(f.dataset.form){e.preventDefault();FORM[f.dataset.form](new FormData(f),f)}});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.chg)CHG[t.dataset.chg](t)});
document.addEventListener('input',e=>{const t=e.target;if(t.dataset.inp==='arS'){S.ar.s=Number(t.value);arT()}if(t.dataset.inp==='arR'){S.ar.r=Number(t.value);arT()}});
window.addEventListener('storage',e=>{if(e.key===KEY){loadDB();const a=document.activeElement;if(!a||!['INPUT','SELECT','TEXTAREA'].includes(a.tagName))render()}});

loadDB();loadS();render();
