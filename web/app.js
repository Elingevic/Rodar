"use strict";
/* Rodar — prototipo de demostración (AseguraTech26).
   Todo corre en el navegador; el estado se guarda en localStorage.
   Empresas, personas, precios y códigos son ficticios o referenciales. */

// ---------------------------------------------------------------------------
// Parámetros de la demo
// ---------------------------------------------------------------------------
const TARIFA = { hora: 0.06, topeDia: 0.48 };          // USD, referencial
const FIJO_MES_POR_MOTO = 7;                            // alternativa: póliza fija por moto registrada (referencial)
const PLATAFORMA = { nombre: "MotoYa Delivery", rif: "J-50123456-7", registrados: 1240, activosMes: 812, horasProm: 96, enVia: 412 };
const ASEGURADORA = { nombre: "Seguros Tepuy", corredor: "Corretaje Andino" };
const COBERTURAS = [
  { ic: "🛵", t: "Responsabilidad civil en reparto", s: "RCV · exceso sobre el RCV obligatorio · ramo 31", m: "$10.000" },
  { ic: "🩹", t: "Accidentes personales del repartidor", s: "Gastos médicos, invalidez y muerte · ramo 06", m: "$5.000" },
  { ic: "🧍", t: "Pasajero (solo en viajes en moto)", s: "Gastos médicos del pasajero · ramo 06", m: "$2.000" },
];
const PLATAFORMAS_CLIENTE = [
  { n: "MotoYa Delivery", reg: 1240, act: 812, enVia: 412, horas: 77952, sin: 6 },
  { n: "Mandao Express", reg: 860, act: 590, enVia: 288, horas: 50150, sin: 4 },
  { n: "Ruta 58", reg: 410, act: 301, enVia: 131, horas: 24380, sin: 2 },
];
const COLORES = ["#ea580c", "#0891b2", "#7c3aed", "#16a34a", "#db2777", "#2563eb", "#ca8a04", "#475569"];

const SEMILLA = () => ({
  v: 3,
  turno: null,                 // { inicio, codigo, viaje }
  ultimoCodigo: null,          // { codigo, fin }
  semana: [
    { d: "Lun 26", h: 6.5 }, { d: "Mar 27", h: 8.2 }, { d: "Mié 28", h: 4.0 },
    { d: "Jue 29", h: 9.1 }, { d: "Vie 30", h: 7.4 }, { d: "Sáb 31", h: 5.3 },
  ],
  flota: [
    { n: "Carlos Pérez", ci: "V-27.4**.***", placa: "AB1C23D", cert: true, rcv: true, yo: true, h: 141 },
    { n: "Yusmary Rondón", ci: "V-25.8**.***", placa: "AC4K87L", cert: true, rcv: true, on: "07:42", h: 168 },
    { n: "José Gregorio Mata", ci: "V-19.0**.***", placa: "AA9F12P", cert: true, rcv: true, on: "08:15", h: 155 },
    { n: "Luis Ángel Sifontes", ci: "V-28.3**.***", placa: "AD2M55R", cert: false, rcv: true, h: 37 },
    { n: "Andrea Colmenares", ci: "V-26.1**.***", placa: "AB7T09S", cert: true, rcv: true, on: "10:03", h: 122 },
    { n: "Wilmer Pacheco", ci: "V-21.6**.***", placa: "AC0P31Z", cert: true, rcv: false, h: 0 },
    { n: "Daniela Guevara", ci: "V-29.2**.***", placa: "AE3R76B", cert: true, rcv: true, h: 88 },
    { n: "Kevin Marcano", ci: "V-30.4**.***", placa: "AD8H20Q", cert: true, rcv: true, on: "11:20", h: 176 },
    { n: "Rosa Villarroel", ci: "V-18.9**.***", placa: "AA5W64N", cert: true, rcv: true, h: 64 },
    { n: "Jhonatan Lugo", ci: "V-27.7**.***", placa: "AF1S48K", cert: false, rcv: true, on: "09:05", h: 131 },
  ],
  siniestros: [
    { id: "RD-2026-0412", fecha: "01/11 19:12", quien: "Kevin Marcano", plat: "MotoYa Delivery", tipo: "Caída sola", heridos: "El repartidor", ramo: "06", reserva: 350, estado: "En revisión" },
    { id: "RD-2026-0405", fecha: "30/10 13:40", quien: "Yusmary Rondón", plat: "MotoYa Delivery", tipo: "Roce con peatón", heridos: "Un tercero", ramo: "31", reserva: 220, estado: "Aprobado" },
    { id: "RD-2026-0398", fecha: "28/10 18:55", quien: "Ender Rojas", plat: "Mandao Express", tipo: "Choque con vehículo", heridos: "Nadie", ramo: "31", reserva: 640, estado: "Pagado" },
    { id: "RD-2026-0391", fecha: "27/10 12:31", quien: "Mariela Ortiz", plat: "Ruta 58", tipo: "Caída sola", heridos: "El repartidor", ramo: "06", reserva: 180, estado: "Pagado" },
  ],
  activos: { "RDR-7K2M-QX": { n: "Yusmary R.", placa: "AC4K87L", plat: "MotoYa Delivery", desde: "07:42" } },
  reporte: null,
  pestana: "inicio",
  filtro: "todos",
});

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------
const CLAVE = "rodar_demo";
let S = cargar();
function cargar() {
  try {
    const s = JSON.parse(localStorage.getItem(CLAVE));
    if (s && s.v === SEMILLA().v) return s;
  } catch { /* sin almacenamiento */ }
  return SEMILLA();
}
function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch { /* sin almacenamiento */ } }
function set(cambios) { Object.assign(S, cambios); guardar(); render(); }

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
const $ = (sel) => document.querySelector(sel);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const usd = (n, d = 2) => "$" + Number(n).toLocaleString("es-VE", { minimumFractionDigits: d, maximumFractionDigits: d });
const ent = (n) => Number(n).toLocaleString("es-VE");
const hhmm = (ts) => new Date(ts).toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", hour12: false });
const iniciales = (n) => n.split(" ").slice(0, 2).map((p) => p[0]).join("");
const avatar = (n, i = 0) => `<span class="av" style="background:${COLORES[i % COLORES.length]}">${esc(iniciales(n))}</span>`;
function aleatorio(n, alfabeto = "ABCDEFGHJKMNPQRSTUVWXYZ23456789") {
  let s = ""; for (let i = 0; i < n; i++) s += alfabeto[Math.floor(Math.random() * alfabeto.length)]; return s;
}
function costoTurno(ms) { return Math.min((ms / 3600000) * TARIFA.hora, TARIFA.topeDia); }
function duracion(ms) {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(t / 3600)).padStart(2, "0"), m = String(Math.floor((t % 3600) / 60)).padStart(2, "0"), s = String(t % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
function toast(msg) {
  document.querySelectorAll(".toast").forEach((t) => t.remove());
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}
function modal(html) {
  cerrarModal();
  const f = document.createElement("div"); f.className = "fondo-modal"; f.id = "modal";
  f.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  f.addEventListener("click", (e) => { if (e.target === f || e.target.closest("[data-cerrar]")) cerrarModal(); });
  document.body.appendChild(f);
}
function cerrarModal() { const m = $("#modal"); if (m) m.remove(); }

// QR ilustrativo (patrón determinístico a partir del código; no es un QR estándar)
function qr(codigo, tam = 168) {
  const N = 25; let h = 2166136261;
  for (const c of codigo) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
  const enFinder = (x, y) => [[0, 0], [N - 7, 0], [0, N - 7]].some(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
  let r = "";
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (enFinder(x, y)) continue;
    if (x === 7 || y === 7 || x === N - 8 || y === N - 8) { if ((x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)) continue; }
    if (rnd() > 0.52) r += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  const finder = (a, b) => `<rect x="${a}" y="${b}" width="7" height="7"/><rect x="${a + 1}" y="${b + 1}" width="5" height="5" fill="#fff"/><rect x="${a + 2}" y="${b + 2}" width="3" height="3"/>`;
  return `<svg width="${tam}" height="${tam}" viewBox="-1 -1 ${N + 2} ${N + 2}" shape-rendering="crispEdges" fill="#1c1917" aria-label="Código de verificación ${esc(codigo)}">${finder(0, 0)}${finder(N - 7, 0)}${finder(0, N - 7)}${r}</svg>`;
}

// ---------------------------------------------------------------------------
// Rutas
// ---------------------------------------------------------------------------
function ruta() {
  const [path, query] = (location.hash.slice(1) || "/").split("?");
  return { path: path || "/", q: new URLSearchParams(query || "") };
}
let reloj = null;
function render() {
  const { path, q } = ruta();
  const r = path.replace(/^\//, "").split("/")[0];
  document.querySelectorAll("#roles a").forEach((a) => a.classList.toggle("activo", a.dataset.r === r));
  const vistas = { "": landing, repartidor, plataforma, aseguradora, verificar };
  const vista = vistas[r] || landing;
  $("#app").innerHTML = vista(q);
  if (vista === repartidor) iniciarReloj(); else detenerReloj();
}
window.addEventListener("hashchange", () => { cerrarModal(); render(); window.scrollTo(0, 0); });
$("#reiniciar").addEventListener("click", () => { S = SEMILLA(); guardar(); render(); toast("Demo reiniciada con los datos de ejemplo"); });

function iniciarReloj() {
  detenerReloj();
  reloj = setInterval(() => {
    if (!S.turno) return;
    const ms = Date.now() - S.turno.inicio;
    const r = $("#reloj"), c = $("#costo");
    if (r) r.textContent = duracion(ms);
    if (c) c.textContent = usd(costoTurno(ms), 3);
  }, 1000);
}
function detenerReloj() { if (reloj) clearInterval(reloj); reloj = null; }

// ---------------------------------------------------------------------------
// Landing
// ---------------------------------------------------------------------------
function landing() {
  return `
  <section class="hero">
    <div class="hero-in">
      <div class="aparecer">
        <span class="chip">🏁 AseguraTech26 · Desafío 3: nuevos modelos de distribución</span>
        <h1>Tu seguro arranca<br>cuando <span>arranca tu turno.</span></h1>
        <p class="lead">Rodar es un seguro por jornada para repartidores y motorizados de plataformas de delivery. Se activa al conectarse a la app, se cobra solo por las horas en la calle y le permite a la plataforma cumplir los seguros que hoy exige el INTT.</p>
        <div class="ctas">
          <a class="btn btn-pri btn-lg" href="#/repartidor">Probar como repartidor</a>
          <a class="btn btn-borde btn-lg" href="#/plataforma">Ver panel de la plataforma</a>
        </div>
        <div class="hero-datos">
          <div><b>270–300 mil</b><span>motos en delivery y transporte móvil</span></div>
          <div><b>RC + seguro médico</b><span>exigidos por el INTT a las plataformas (ago. 2026)</span></div>
          <div><b>Por hora</b><span>se paga solo el tiempo en la vía</span></div>
        </div>
      </div>
      <div class="hero-tarjeta aparecer" style="animation-delay:.1s">
        <div class="eyebrow" style="color:var(--r400)">Un turno con Rodar</div>
        <div class="linea-tiempo" style="margin-top:14px">
          <div class="lt-item"><span class="hora">07:58</span><b>Carlos se conecta en la app de delivery</b><span>Rodar activa su cobertura en ese instante.</span></div>
          <div class="lt-item"><span class="hora">12:40</span><b>Un fiscal le pide el seguro</b><span>Muestra su código y el fiscal ve la cobertura vigente en tiempo real.</span></div>
          <div class="lt-item"><span class="hora">18:21</span><b>Sufre una caída en hora pico</b><span>Reporta desde el teléfono y recibe una clave de atención médica.</span></div>
          <div class="lt-item"><span class="hora">20:05</span><b>Se desconecta</b><span>La cobertura se apaga. La plataforma paga 8 horas, no un año.</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="seccion">
    <span class="eyebrow">El problema</span>
    <h2>La norma ya llegó. El seguro a la medida del repartidor, todavía no.</h2>
    <p class="lead">Desde agosto de 2026 el INTT trata a la plataforma como prestadora del servicio y le exige mantener vigentes un seguro de responsabilidad civil y un seguro médico. Los repartidores trabajan por horas, rotan entre apps y muchos se registran pero casi no salen. Una póliza anual fija por moto no encaja con esa realidad.</p>
    <div class="grid-3">
      <div class="tarjeta"><div class="card-ic">⚖️</div><h3>Responsabilidad de la plataforma</h3><p>El INTT considera prestadora del servicio a la empresa dueña de la app, aunque el repartidor use moto propia o alquilada.</p><div class="dato-fuente">Fuente: INTT, ago. 2026 (NotiFalcón, El Universal)</div></div>
      <div class="tarjeta"><div class="card-ic">📈</div><h3>Costos que suben la tarifa</h3><p>Cavecom-e advirtió que los seguros obligatorios y las certificaciones van a encarecer el delivery para el usuario final.</p><div class="dato-fuente">Fuente: Finanzas Digital, 2026</div></div>
      <div class="tarjeta"><div class="card-ic">🚑</div><h3>El grupo más vulnerable</h3><p>Los motorizados encabezan las víctimas de accidentes de tránsito en Venezuela, con picos en las horas de mayor demanda de delivery.</p><div class="dato-fuente">Fuente: Observatorio de Seguridad Vial / El Diario</div></div>
    </div>
  </section>

  <section class="seccion">
    <span class="eyebrow">La solución</span>
    <h2>Cobertura que se enciende y se apaga con la jornada.</h2>
    <div class="grid-4">
      <div class="tarjeta"><div class="paso-n">1</div><h3>La plataforma se integra</h3><p>Con una API, la app de delivery avisa a Rodar cuando un repartidor se conecta y se desconecta.</p></div>
      <div class="tarjeta"><div class="paso-n">2</div><h3>La cobertura se activa sola</h3><p>Responsabilidad civil en reparto y accidentes personales, respaldados por una aseguradora autorizada.</p></div>
      <div class="tarjeta"><div class="paso-n">3</div><h3>Se cobra por hora</h3><p>La plataforma paga las horas reales en la vía, con un tope diario. Sin pagar por cuentas inactivas.</p></div>
      <div class="tarjeta"><div class="paso-n">4</div><h3>Todo queda verificable</h3><p>Constancia para el INTT, código de verificación en la calle y reporte de siniestros desde el teléfono.</p></div>
    </div>
  </section>

  <section class="seccion">
    <span class="eyebrow">Prueba el prototipo</span>
    <h2>Tres vistas, un mismo turno.</h2>
    <p class="lead">Lo que hagas como repartidor aparece al instante en los paneles de la plataforma y de la aseguradora.</p>
    <div class="banda-roles">
      <a class="tarjeta rol-card" href="#/repartidor"><div class="card-ic">🛵</div><h3>Repartidor</h3><p>Inicia un turno, muestra tu código de verificación y reporta un accidente.</p><div class="ir">Abrir app →</div></a>
      <a class="tarjeta rol-card" href="#/plataforma"><div class="card-ic">📦</div><h3>Plataforma de delivery</h3><p>Flota cubierta en tiempo real, cumplimiento INTT, costo por hora e integración.</p><div class="ir">Abrir panel →</div></a>
      <a class="tarjeta rol-card" href="#/aseguradora"><div class="card-ic">🏢</div><h3>Aseguradora</h3><p>Exposición por hora, prima devengada, mapa de siniestralidad y gestión de siniestros.</p><div class="ir">Abrir panel →</div></a>
    </div>
  </section>
  <footer class="pie"><span><b>Rodar</b> · Prototipo para AseguraTech26 (SUDEASEG) · Noviembre de 2026</span><span>Rodar es la capa tecnológica: el riesgo lo asume una aseguradora autorizada y la colocación la hace un intermediario autorizado.</span></footer>`;
}

// ---------------------------------------------------------------------------
// App del repartidor
// ---------------------------------------------------------------------------
function repartidor() {
  return `
  <div class="contenedor">
    <div class="escena">
      <div class="explica aparecer">
        <span class="eyebrow">Vista del repartidor</span>
        <h2>Así se ve Rodar dentro de la app de delivery.</h2>
        <p>Para el repartidor no hay trámites: su cobertura sigue a su jornada. En producción, el turno lo inicia la propia app de la plataforma por API. Aquí lo puedes hacer con un botón.</p>
        <ol>
          <li><b>Inicia el turno</b><span>La cobertura se activa al instante y el costo corre por minuto, con un tope diario.</span></li>
          <li><b>Muestra tu código</b><span>Ante un fiscal o en un accidente, el código prueba que tienes cobertura vigente en ese momento.</span></li>
          <li><b>Reporta un accidente</b><span>En 3 pasos: qué pasó, quién resultó herido y fotos. Si hay heridos, recibes una clave de atención médica.</span></li>
          <li><b>Revisa los otros paneles</b><span>Tu turno y tu reporte aparecen en el panel de la <a href="#/plataforma">plataforma</a> y de la <a href="#/aseguradora">aseguradora</a>.</span></li>
        </ol>
        <div class="nota"><b>Tarifa referencial de la demo:</b> ${usd(TARIFA.hora)} por hora con tope de ${usd(TARIFA.topeDia)} por día, pagados por la plataforma. El RCV obligatorio de la moto sigue siendo del propietario; Rodar cubre la actividad de reparto por encima de ese límite.</div>
        <div class="demo-ctrl no-imprimir">
          <button class="btn btn-borde btn-sm" data-acc="adelantar" ${S.turno ? "" : "disabled"}>⏩ Simular +1 hora de turno</button>
          <button class="btn btn-borde btn-sm" data-acc="viaje" ${S.turno ? "" : "disabled"}>${S.turno && S.turno.viaje ? "🧍 Terminar viaje con pasajero" : "🧍 Simular viaje con pasajero"}</button>
        </div>
      </div>
      <div class="telefono"><div class="pantalla">
        <div class="notch"></div>
        <div class="status"><span>${hhmm(Date.now())}</span><span>▮▮▮ 5G ▭</span></div>
        ${pantallaApp()}
      </div></div>
    </div>
  </div>`;
}

function pantallaApp() {
  if (S.reporte) return pantallaReporte();
  const p = S.pestana;
  const nav = `<nav class="app-nav">
      <button class="${p === "inicio" ? "on" : ""}" data-tab="inicio"><span>🏠</span>Inicio</button>
      <button class="${p === "codigo" ? "on" : ""}" data-tab="codigo"><span>🔳</span>Mi código</button>
      <button class="${p === "historial" ? "on" : ""}" data-tab="historial"><span>🕑</span>Historial</button>
    </nav>`;
  const cab = `<div class="app-cab"><div><div class="hola">MotoYa Delivery · protegido por Rodar</div><div class="nom">Hola, Carlos</div></div>${avatar("Carlos Pérez")}</div>`;
  let cuerpo = "";
  if (p === "codigo") cuerpo = tabCodigo();
  else if (p === "historial") cuerpo = tabHistorial();
  else cuerpo = tabInicio();
  return `${cab}<div class="app-cuerpo">${cuerpo}</div>${nav}`;
}

function tabInicio() {
  const t = S.turno;
  if (!t) {
    return `
      <div class="estado-turno off aparecer">
        <div class="lbl"><span class="punto"></span> Fuera de turno</div>
        <div class="big">Sin cobertura activa</div>
        <div style="font-size:13px;opacity:.8;margin-top:6px">Tu cobertura se activa sola cuando te conectas para trabajar.</div>
      </div>
      <button class="btn-turno btn-pri" data-acc="iniciar">▶ Iniciar turno</button>
      <div class="mini"><h4>Lo que te cubre en cada turno</h4>${COBERTURAS.map(cob).join("")}</div>
      <div class="acciones-app">
        <button class="acc" data-tab="codigo"><span class="i">🔳</span>Mi código</button>
        <button class="acc alerta" disabled title="Disponible durante un turno"><span class="i">🚨</span>Reportar accidente</button>
      </div>`;
  }
  const ms = Date.now() - t.inicio;
  return `
    <div class="estado-turno on aparecer">
      <div class="lbl"><span class="punto vivo"></span> Cobertura activa desde las ${hhmm(t.inicio)}</div>
      <div class="reloj" id="reloj">${duracion(ms)}</div>
      <div class="met">
        <div><b id="costo">${usd(costoTurno(ms), 3)}</b>costo del turno</div>
        <div><b>MotoYa</b>lo paga</div>
        <div><b>${t.viaje ? "Sí" : "No"}</b>pasajero a bordo</div>
      </div>
    </div>
    <div class="acciones-app">
      <button class="acc" data-tab="codigo"><span class="i">🔳</span>Mi código</button>
      <button class="acc alerta" data-acc="reportar"><span class="i">🚨</span>Reportar accidente</button>
    </div>
    <div class="mini"><h4>Cubierto ahora</h4>${COBERTURAS.filter((c, i) => i < 2 || t.viaje).map(cob).join("")}</div>
    <button class="btn-turno btn-osc" data-acc="terminar">■ Terminar turno</button>`;
}
const cob = (c) => `<div class="cob"><span class="ic">${c.ic}</span><div><div class="t">${c.t}</div><div class="s">${c.s}</div></div><span class="m">${c.m}</span></div>`;

function tabCodigo() {
  const t = S.turno;
  if (!t) {
    return `<div class="app-titulo" style="margin-top:6px">Mi código</div>
      <p class="app-sub">Tu código de verificación aparece cuando inicias un turno.</p>
      <div class="mini" style="text-align:center;padding:30px 16px;color:var(--t500)">🔒<br>Sin cobertura activa</div>
      <button class="btn-turno btn-pri" data-acc="iniciar">▶ Iniciar turno</button>`;
  }
  return `<div class="app-titulo" style="margin-top:6px">Mi código</div>
    <p class="app-sub">Muéstralo a un fiscal o a la otra parte en un accidente. Prueba que tienes cobertura vigente ahora mismo.</p>
    <div class="qr-caja" style="margin-top:14px">${qr(t.codigo)}<div class="mono" style="font-size:20px;font-weight:700;margin-top:8px;letter-spacing:.05em">${t.codigo}</div>
      <span class="badge b-verde" style="margin-top:8px"><span class="punto vivo"></span> Vigente · desde ${hhmm(t.inicio)}</span></div>
    <div class="mini"><div class="cob"><span class="ic">🏢</span><div><div class="t">${ASEGURADORA.nombre}</div><div class="s">Póliza colectiva · tomador MotoYa Delivery</div></div></div>
      <div class="cob"><span class="ic">🛵</span><div><div class="t">Moto AB1C23D</div><div class="s">RCV obligatorio vigente (verificado al registrarse)</div></div></div></div>
    <a class="btn btn-sec bloque" style="margin-top:12px" href="#/verificar?c=${t.codigo}">Ver lo que ve el fiscal →</a>`;
}

function tabHistorial() {
  const total = S.semana.reduce((a, d) => a + d.h, 0);
  const costo = S.semana.reduce((a, d) => a + Math.min(d.h * TARIFA.hora, TARIFA.topeDia), 0);
  return `<div class="app-titulo" style="margin-top:6px">Esta semana</div>
    <p class="app-sub">Horas cubiertas y lo que pagó MotoYa por tu protección.</p>
    <div class="mini" style="display:flex;gap:16px">
      <div style="flex:1"><div style="font-size:24px;font-weight:800">${total.toFixed(1)} h</div><div class="sub">cubiertas</div></div>
      <div style="flex:1"><div style="font-size:24px;font-weight:800">${usd(costo)}</div><div class="sub">pagado por la plataforma</div></div>
    </div>
    <div class="mini">${S.semana.map((d) => `<div class="hist"><span>${d.d}</span><span>${d.h.toFixed(1)} h · <b>${usd(Math.min(d.h * TARIFA.hora, TARIFA.topeDia))}</b></span></div>`).join("")}</div>
    <div class="mini"><h4>Mis siniestros</h4>${(() => {
      const mios = S.siniestros.filter((s) => s.quien === "Carlos Pérez");
      return mios.length ? mios.map((s) => `<div class="hist"><span>${s.id}<br><span class="sub">${s.tipo}</span></span>${badgeEstado(s.estado)}</div>`).join("") : `<div class="sub">No has reportado siniestros.</div>`;
    })()}</div>`;
}

// --- Reporte de accidente (3 pasos) ---
const TIPOS = [
  { v: "Choque con vehículo", i: "🚗" }, { v: "Caída sola", i: "🛵" }, { v: "Roce con peatón", i: "🚶" }, { v: "Daño a un bien (vidriera, poste…)", i: "🏪" },
];
const HERIDOS = [
  { v: "Yo", i: "🤕" }, { v: "Un tercero", i: "🧍" }, { v: "Mi pasajero", i: "🧑‍🦱" }, { v: "Nadie", i: "✅" },
];
function pantallaReporte() {
  const r = S.reporte;
  const prog = (n) => `<div class="progreso">${[1, 2, 3].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</div>`;
  const cab = r.paso === 4 ? `<div class="app-cab"><span class="sub">Reporte de siniestro</span></div>` : `<div class="app-cab"><button class="btn btn-borde btn-sm" data-acc="cancelar-rep">✕ Cancelar</button><span class="sub">Turno activo · ${S.turno ? hhmm(S.turno.inicio) : ""}</span></div>`;
  let c = "";
  if (r.paso === 1) {
    c = `${prog(1)}<div class="app-titulo">¿Qué pasó?</div><p class="app-sub">Tranquilo. Primero ponte a salvo; esto toma un minuto.</p>
      ${TIPOS.map((t) => `<button class="opcion ${r.tipo === t.v ? "sel" : ""}" data-tipo="${esc(t.v)}"><span class="i">${t.i}</span>${t.v}</button>`).join("")}`;
  } else if (r.paso === 2) {
    c = `${prog(2)}<div class="app-titulo">¿Alguien resultó herido?</div><p class="app-sub">Si hay heridos, te damos una clave para que los atiendan en una clínica de la red.</p>
      ${HERIDOS.map((t) => `<button class="opcion ${r.heridos === t.v ? "sel" : ""}" data-heridos="${esc(t.v)}"><span class="i">${t.i}</span>${t.v}</button>`).join("")}`;
  } else if (r.paso === 3) {
    const n = r.fotos || 0;
    c = `${prog(3)}<div class="app-titulo">Fotos y ubicación</div><p class="app-sub">La hora y la ubicación se toman del turno. Agrega al menos 2 fotos.</p>
      <div class="mini"><div class="cob"><span class="ic">📍</span><div><div class="t">Av. Francisco de Miranda, Chacao</div><div class="s">Ubicación del turno · ${hhmm(Date.now())}</div></div></div></div>
      <div class="fotos">${[0, 1, 2].map((i) => i < n ? `<div class="foto ok">📷</div>` : `<button class="foto" data-acc="foto">＋<br>Foto</button>`).join("")}</div>
      <button class="btn-turno btn-pri" data-acc="enviar-rep" ${n >= 2 ? "" : "disabled style='opacity:.5;cursor:not-allowed'"}>Enviar reporte</button>`;
  } else {
    const conHeridos = r.heridos !== "Nadie";
    const ramo = r.heridos === "Yo" || r.heridos === "Mi pasajero" ? "06" : "31";
    c = `<div style="text-align:center;margin-top:10px"><div style="font-size:44px">✅</div><div class="app-titulo">Reporte enviado</div>
      <p class="app-sub">Siniestro <b class="mono">${r.id}</b> · ${esc(r.tipo)}. ${ASEGURADORA.nombre} y MotoYa ya lo recibieron.</p></div>
      ${conHeridos ? `<div class="clave"><div class="sub">Clave de atención médica · válida 24 h</div><div class="cod">${r.clave}</div><div class="sub">Clínica sugerida: <b>Centro Médico de la red (demo)</b> · a 1,2 km</div></div>` : ""}
      ${ramo === "31" ? `<div class="mini"><div class="cob"><span class="ic">🛵</span><div><div class="t">Daños al tercero cubiertos</div><div class="s">Comparte el número del siniestro con la otra parte. Cobertura de responsabilidad civil en reparto (ramo 31).</div></div></div></div>` : ""}
      <div class="mini"><div class="cob"><span class="ic">💬</span><div><div class="t">Un ajustador te escribirá por WhatsApp</div><div class="s">Tiempo objetivo de primer contacto: 30 minutos.</div></div></div></div>
      <button class="btn-turno btn-osc" data-acc="cerrar-rep">Volver al turno</button>`;
  }
  return `${cab}<div class="app-cuerpo">${c}</div>`;
}

// ---------------------------------------------------------------------------
// Panel de la plataforma
// ---------------------------------------------------------------------------
function plataforma() {
  const yoOn = !!S.turno;
  const flota = S.flota.map((f) => ({ ...f, enTurno: f.yo ? yoOn : !!f.on, desde: f.yo ? (yoOn ? hhmm(S.turno.inicio) : null) : f.on }));
  const enVia = PLATAFORMA.enVia + (yoOn ? 1 : 0);
  const horasMes = PLATAFORMA.activosMes * PLATAFORMA.horasProm;
  const costoMes = horasMes * TARIFA.hora;
  const fijo = PLATAFORMA.registrados * FIJO_MES_POR_MOTO;
  const ahorro = 1 - costoMes / fijo;
  const sinCert = flota.filter((f) => !f.cert).length, sinRcv = flota.filter((f) => !f.rcv).length;
  const misSin = S.siniestros.filter((s) => s.plat === PLATAFORMA.nombre);
  const fil = S.filtro;
  const lista = flota.filter((f) => fil === "todos" || (fil === "turno" && f.enTurno) || (fil === "alertas" && (!f.cert || !f.rcv)));
  return `
  <div class="contenedor">
    <div class="titulo-pag">
      <div><span class="eyebrow">Panel de la plataforma</span><h1>${PLATAFORMA.nombre}</h1><p>RIF ${PLATAFORMA.rif} · Tomador de la póliza colectiva con ${ASEGURADORA.nombre} · Intermediario: ${ASEGURADORA.corredor}</p></div>
      <button class="btn btn-osc" data-acc="constancia">📄 Constancia para el INTT</button>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="v" style="color:var(--verde)">${ent(enVia)}</div><div class="e">repartidores cubiertos ahora</div><div class="d"><span class="badge b-verde"><span class="punto vivo"></span> en vivo</span></div></div>
      <div class="kpi"><div class="v">${ent(horasMes)}</div><div class="e">horas cubiertas este mes</div><div class="d">${ent(PLATAFORMA.activosMes)} de ${ent(PLATAFORMA.registrados)} registrados trabajaron</div></div>
      <div class="kpi"><div class="v">${usd(costoMes, 0)}</div><div class="e">costo del mes (por hora)</div><div class="d">${usd(costoMes / PLATAFORMA.activosMes)} por repartidor activo</div></div>
      <div class="kpi"><div class="v">${misSin.filter((s) => s.estado !== "Pagado").length}</div><div class="e">siniestros abiertos</div><div class="d">${misSin.length} reportados en total</div></div>
    </div>
    <div class="rejilla-2">
      <div class="pila">
        <div class="tarjeta">
          <h2 class="sec">🛵 Repartidores <span class="sub" style="font-weight:500">· muestra de la flota</span></h2>
          <div class="filtros">
            <button class="${fil === "todos" ? "on" : ""}" data-filtro="todos">Todos</button>
            <button class="${fil === "turno" ? "on" : ""}" data-filtro="turno">En turno</button>
            <button class="${fil === "alertas" ? "on" : ""}" data-filtro="alertas">Con alertas (${flota.filter((f) => !f.cert || !f.rcv).length})</button>
          </div>
          <div class="tabla-env"><table>
            <thead><tr><th>Repartidor</th><th>Moto</th><th>Cobertura</th><th>Requisitos</th><th style="text-align:right">Horas mes</th></tr></thead>
            <tbody>${lista.map((f, i) => `<tr>
              <td><div class="persona">${avatar(f.n, S.flota.indexOf(S.flota.find((x) => x.n === f.n)))}<div><b>${esc(f.n)}</b>${f.yo ? ' <span class="badge b-naranja">tú en la demo</span>' : ""}<div class="sub">${f.ci}</div></div></div></td>
              <td class="mono">${f.placa}</td>
              <td>${f.enTurno ? `<span class="badge b-verde"><span class="punto vivo"></span> Activa desde ${f.desde}</span>` : `<span class="badge b-gris">Fuera de turno</span>`}</td>
              <td>${f.cert && f.rcv ? `<span class="badge b-verde">✓ Completos</span>` : `<span class="badge b-ambar">⚠ ${!f.rcv ? "RCV vencido" : "Falta certificado"}</span>`}</td>
              <td style="text-align:right">${f.h} h</td></tr>`).join("") || `<tr><td colspan="5" class="sub" style="text-align:center;padding:24px">Nadie en este filtro.</td></tr>`}</tbody>
          </table></div>
          ${sinRcv ? `<p class="sub" style="margin-top:10px">⚠ Rodar no activa turnos de motos sin RCV obligatorio vigente: así la plataforma no pone en la calle a quien no puede circular.</p>` : ""}
        </div>
        <div class="tarjeta">
          <h2 class="sec">🔌 Integración en un día</h2>
          <p class="sub" style="margin-bottom:10px">La app de delivery llama a Rodar al conectar y desconectar al repartidor. Rodar devuelve el código de verificación.</p>
<pre class="codigo"><span class="c">// Al conectarse el repartidor</span>
<span class="k">POST</span> /v1/turnos
{ <span class="s">"repartidor"</span>: <span class="s">"V-27.4**.***"</span>, <span class="s">"placa"</span>: <span class="s">"AB1C23D"</span>, <span class="s">"tipo"</span>: <span class="s">"delivery"</span> }
<span class="c">→ 201 { "turno": "trn_8F2", "codigo": "RDR-7K2M-QX", "cobertura": "activa" }</span>

<span class="c">// Viaje con pasajero (mototaxi)</span>
<span class="k">POST</span> /v1/turnos/trn_8F2/pasajero    { <span class="s">"estado"</span>: <span class="s">"a_bordo"</span> }

<span class="c">// Al desconectarse</span>
<span class="k">POST</span> /v1/turnos/trn_8F2/cerrar
<span class="c">→ 200 { "minutos": 487, "prima_usd": 0.48 }</span></pre>
        </div>
      </div>
      <div class="pila">
        <div class="tarjeta">
          <h2 class="sec">✅ Cumplimiento INTT</h2>
          <ul class="lista-check">
            <li><span class="ic-check ic-ok">✓</span><div><b>Seguro de responsabilidad civil vigente</b><div class="sub">Póliza colectiva ${ASEGURADORA.nombre}, ramo 31, activa por turno.</div></div></li>
            <li><span class="ic-check ic-ok">✓</span><div><b>Seguro médico (repartidor y pasajero)</b><div class="sub">Accidentes personales, ramo 06, con clave de atención.</div></div></li>
            <li><span class="ic-check ${sinCert ? "ic-warn" : "ic-ok"}">${sinCert ? "!" : "✓"}</span><div><b>Certificado de aptitud para conducción comercial</b><div class="sub">${sinCert ? `${sinCert} repartidor(es) de la muestra sin certificado cargado.` : "Todos cargados."}</div></div></li>
            <li><span class="ic-check ic-ok">✓</span><div><b>RCV obligatorio de cada moto</b><div class="sub">Se verifica al registrarse; sin RCV no se activa el turno.</div></div></li>
            <li><span class="ic-check ic-na">–</span><div><b>Registro Nacional y revisión técnica</b><div class="sub">Trámites de la plataforma ante el INTT. Rodar guarda la evidencia.</div></div></li>
          </ul>
        </div>
        <div class="tarjeta">
          <h2 class="sec">💵 Por hora vs. póliza fija</h2>
          <div style="display:flex;gap:14px;margin-top:4px">
            <div style="flex:1"><div class="sub">Póliza fija por moto registrada</div><div style="font-size:22px;font-weight:750;color:var(--t500);text-decoration:line-through">${usd(fijo, 0)}<span style="font-size:13px">/mes</span></div></div>
            <div style="flex:1"><div class="sub">Rodar, por hora en la vía</div><div style="font-size:22px;font-weight:750;color:var(--verde)">${usd(costoMes, 0)}<span style="font-size:13px">/mes</span></div></div>
          </div>
          <div class="nota" style="margin-top:12px">Ahorro estimado de <b>${Math.round(ahorro * 100)}%</b>: ${ent(PLATAFORMA.registrados - PLATAFORMA.activosMes)} cuentas registradas no trabajaron este mes y no generan costo. <span class="sub">Cifras referenciales de demostración.</span></div>
        </div>
        <div class="tarjeta">
          <h2 class="sec">🚨 Siniestros de la flota</h2>
          ${misSin.map((s) => `<div class="hist"><span><b class="mono" style="font-size:12.5px">${s.id}</b><br><span class="sub">${esc(s.quien)} · ${esc(s.tipo)}</span></span>${badgeEstado(s.estado)}</div>`).join("")}
        </div>
      </div>
    </div>
  </div>`;
}
function badgeEstado(e) {
  const t = { "Nuevo": "b-naranja", "En revisión": "b-ambar", "Aprobado": "b-azul", "Pagado": "b-verde" }[e] || "b-gris";
  return `<span class="badge ${t}">${e}</span>`;
}
function constancia() {
  const hoy = new Date().toLocaleDateString("es-VE", { day: "2-digit", month: "long", year: "numeric" });
  modal(`<h3>Constancia de cobertura</h3><p class="sub">Documento de demostración para presentar ante el INTT.</p>
    <div class="constancia">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b style="font-size:16px">Roda<span style="color:var(--r600)">r</span></b><span class="mono sub">CNS-2026-11-0042</span></div>
      <div class="fila"><span>Tomador</span><b>${PLATAFORMA.nombre} · ${PLATAFORMA.rif}</b></div>
      <div class="fila"><span>Aseguradora</span><b>${ASEGURADORA.nombre} (ficticia)</b></div>
      <div class="fila"><span>Intermediario</span><b>${ASEGURADORA.corredor} (ficticio)</b></div>
      <div class="fila"><span>Coberturas</span><b>RC en reparto (31) · Accidentes personales (06)</b></div>
      <div class="fila"><span>Modalidad</span><b>Colectiva, activación por turno</b></div>
      <div class="fila"><span>Repartidores con cobertura habilitada</span><b>${ent(PLATAFORMA.registrados)}</b></div>
      <div class="fila"><span>Vigencia de la póliza</span><b>01/11/2026 – 31/10/2027</b></div>
      <div class="fila"><span>Emitida</span><b>${hoy}</b></div>
      <div style="display:flex;gap:12px;align-items:center;margin-top:12px">${qr("CNS-2026-11-0042", 72)}<span class="sub">Cualquier fiscal puede verificar la cobertura de un repartidor en tiempo real con su código en <b>rodar…/verificar</b>.</span></div>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px" class="no-imprimir"><button class="btn btn-borde" data-cerrar>Cerrar</button><button class="btn btn-osc" onclick="window.print()">Imprimir</button></div>`);
}

// ---------------------------------------------------------------------------
// Panel de la aseguradora
// ---------------------------------------------------------------------------
const EXPOSICION = [40, 120, 310, 520, 610, 700, 820, 760, 540, 430, 470, 610, 790, 860, 740, 520, 260, 90]; // 6h → 23h
const FRANJAS = ["6–8", "8–10", "10–12", "12–14", "14–16", "16–18", "18–20", "20–22"];
const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const CALOR = [
  [1, 2, 2, 5, 2, 3, 6, 2], [1, 2, 1, 4, 2, 3, 6, 2], [0, 2, 2, 5, 1, 3, 5, 1], [1, 1, 2, 5, 2, 4, 6, 2],
  [1, 2, 2, 6, 2, 4, 8, 4], [0, 1, 2, 5, 3, 4, 7, 5], [0, 0, 1, 4, 2, 3, 5, 3],
];
function aseguradora() {
  const enVia = PLATAFORMAS_CLIENTE.reduce((a, p) => a + p.enVia, 0) + (S.turno ? 1 : 0);
  const horas = PLATAFORMAS_CLIENTE.reduce((a, p) => a + p.horas, 0);
  const prima = horas * TARIFA.hora;
  const reservas = S.siniestros.reduce((a, s) => a + s.reserva, 0);
  const sini = (reservas + 1950) / prima;  // incluye siniestros históricos del mes no listados
  const max = Math.max(...EXPOSICION);
  const color = (v) => v === 0 ? "#f5f5f4" : `rgba(234,88,12,${0.12 + v / 9})`;
  const hora = new Date().getHours();
  return `
  <div class="contenedor">
    <div class="titulo-pag">
      <div><span class="eyebrow">Panel de la aseguradora</span><h1>${ASEGURADORA.nombre}</h1><p>Pólizas colectivas por turno · 3 plataformas · colocadas por ${ASEGURADORA.corredor}</p></div>
      <span class="badge b-verde" style="font-size:13px;padding:6px 12px"><span class="punto vivo"></span> Exposición en tiempo real</span>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="v">${ent(enVia)}</div><div class="e">motos en la vía con cobertura ahora</div></div>
      <div class="kpi"><div class="v">${usd(prima, 0)}</div><div class="e">prima devengada este mes</div><div class="d">${ent(horas)} horas expuestas</div></div>
      <div class="kpi"><div class="v">${Math.round(sini * 100)}%</div><div class="e">siniestralidad del mes</div><div class="d">reservas / prima devengada</div></div>
      <div class="kpi"><div class="v">${S.siniestros.filter((s) => s.estado !== "Pagado").length}</div><div class="e">siniestros por gestionar</div></div>
    </div>
    <div class="rejilla-2i">
      <div class="tarjeta">
        <h2 class="sec">📊 Motos expuestas por hora (hoy)</h2>
        <div class="barras">${EXPOSICION.map((v, i) => `<div class="col"><div class="b ${v > 700 ? "alta" : ""}" style="height:${(v / max) * 100}%;${i + 6 === hora ? "outline:2px solid var(--t900);outline-offset:1px" : ""}" title="${i + 6}:00 · ${v} motos"></div><span class="l">${i + 6}</span></div>`).join("")}</div>
        <p class="sub" style="margin-top:10px">La prima se devenga solo cuando hay motos en la calle. El riesgo se mide por hora, no por año.</p>
      </div>
      <div class="tarjeta">
        <h2 class="sec">🔥 Siniestros por día y franja (últimos 90 días)</h2>
        <div class="mapa"><span></span>${FRANJAS.map((f) => `<span style="text-align:center">${f}</span>`).join("")}
          ${DIAS.map((d, i) => `<span style="align-self:center">${d}</span>${CALOR[i].map((v) => `<div class="c" style="background:${color(v)}" title="${d} ${v} siniestros"></div>`).join("")}`).join("")}</div>
        <div class="leyenda">Menos <i style="background:rgba(234,88,12,.15)"></i><i style="background:rgba(234,88,12,.45)"></i><i style="background:rgba(234,88,12,.8)"></i><i style="background:rgba(234,88,12,1)"></i> Más · picos en almuerzo y en la tarde, como el delivery.</div>
      </div>
    </div>
    <div class="tarjeta" style="margin-top:18px">
      <h2 class="sec">🚨 Siniestros</h2>
      <div class="tabla-env"><table>
        <thead><tr><th>Siniestro</th><th>Repartidor</th><th>Qué pasó</th><th>Ramo</th><th style="text-align:right">Reserva</th><th>Estado</th><th></th></tr></thead>
        <tbody>${S.siniestros.map((s) => `<tr>
          <td><b class="mono" style="font-size:12.5px">${s.id}</b><div class="sub">${s.fecha}</div></td>
          <td>${esc(s.quien)}<div class="sub">${esc(s.plat)}</div></td>
          <td>${esc(s.tipo)}<div class="sub">Heridos: ${esc(s.heridos)}</div></td>
          <td class="mono">${s.ramo}</td>
          <td style="text-align:right">${usd(s.reserva, 0)}</td>
          <td>${badgeEstado(s.estado)}</td>
          <td style="text-align:right;white-space:nowrap">${s.estado === "Nuevo" || s.estado === "En revisión" ? `<button class="btn btn-sec btn-sm" data-aprobar="${s.id}">Aprobar</button>` : s.estado === "Aprobado" ? `<button class="btn btn-borde btn-sm" data-pagar="${s.id}">Marcar pagado</button>` : `<span class="sub">—</span>`}</td></tr>`).join("")}</tbody>
      </table></div>
    </div>
    <div class="tarjeta" style="margin-top:18px">
      <h2 class="sec">📦 Plataformas aseguradas</h2>
      <div class="tabla-env"><table>
        <thead><tr><th>Plataforma (tomador)</th><th style="text-align:right">Registrados</th><th style="text-align:right">Activos en el mes</th><th style="text-align:right">En la vía ahora</th><th style="text-align:right">Horas del mes</th><th style="text-align:right">Prima del mes</th></tr></thead>
        <tbody>${PLATAFORMAS_CLIENTE.map((p, i) => `<tr><td><b>${p.n}</b></td><td style="text-align:right">${ent(p.reg)}</td><td style="text-align:right">${ent(p.act)}</td><td style="text-align:right">${ent(p.enVia + (i === 0 && S.turno ? 1 : 0))}</td><td style="text-align:right">${ent(p.horas)}</td><td style="text-align:right"><b>${usd(p.horas * TARIFA.hora, 0)}</b></td></tr>`).join("")}</tbody>
      </table></div>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Verificación pública (lo que ve un fiscal)
// ---------------------------------------------------------------------------
function verificar(q) {
  const c = (q.get("c") || "").trim().toUpperCase();
  let res = "";
  if (c) {
    const yo = S.turno && S.turno.codigo === c ? { n: "Carlos P.", placa: "AB1C23D", plat: PLATAFORMA.nombre, desde: hhmm(S.turno.inicio) } : null;
    const otro = S.activos[c];
    const v = yo || otro;
    const pasado = !v && S.ultimoCodigo && S.ultimoCodigo.codigo === c;
    if (v) {
      res = `<div class="verif-res ok aparecer"><div style="font-size:40px">🛡️</div><div class="big">Cobertura VIGENTE</div><div style="opacity:.9;margin-top:4px">Verificado ${hhmm(Date.now())} · código ${esc(c)}</div></div>
        <div class="tarjeta" style="margin-top:14px"><div class="hist"><span>Repartidor</span><b>${esc(v.n)}</b></div><div class="hist"><span>Moto</span><b class="mono">${esc(v.placa)}</b></div>
        <div class="hist"><span>Plataforma (tomador)</span><b>${esc(v.plat)}</b></div><div class="hist"><span>Aseguradora</span><b>${ASEGURADORA.nombre}</b></div>
        <div class="hist"><span>En turno desde</span><b>${esc(v.desde)}</b></div><div class="hist"><span>Coberturas</span><b>RC en reparto (31) · AP (06)</b></div></div>`;
    } else if (pasado) {
      res = `<div class="verif-res no aparecer"><div style="font-size:40px">⏹</div><div class="big">Sin cobertura activa</div><div style="opacity:.9;margin-top:4px">El turno de este código terminó a las ${hhmm(S.ultimoCodigo.fin)}.</div></div>`;
    } else {
      res = `<div class="verif-res no aparecer"><div style="font-size:40px">✕</div><div class="big">Código no encontrado</div><div style="opacity:.9;margin-top:4px">Revisa el código o pide al repartidor que lo muestre desde su app.</div></div>`;
    }
  }
  const sugerencia = S.turno ? S.turno.codigo : "RDR-7K2M-QX";
  return `
  <div class="contenedor"><div class="verif">
    <span class="eyebrow">Verificación pública</span>
    <h1 style="font-size:28px;letter-spacing:-0.03em;margin:6px 0 6px">¿Este repartidor está asegurado ahora?</h1>
    <p class="sub" style="font-size:14.5px">Para fiscales del INTT, policías o la otra parte en un accidente. Escanea el código o escríbelo. No muestra datos personales completos.</p>
    <form class="campo" style="margin-top:18px" id="form-verif"><input name="c" placeholder="RDR-XXXX-XX" value="${esc(c)}" aria-label="Código de verificación" autocomplete="off"><button class="btn btn-osc">Verificar</button></form>
    <p class="sub" style="margin-top:8px">Prueba con <a href="#/verificar?c=${sugerencia}" class="mono">${sugerencia}</a>${S.turno ? " (tu turno activo)" : ""}.</p>
    ${res}
  </div></div>`;
}

// ---------------------------------------------------------------------------
// Acciones
// ---------------------------------------------------------------------------
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-acc],[data-tab],[data-tipo],[data-heridos],[data-filtro],[data-aprobar],[data-pagar]");
  if (!el || el.disabled) return;
  const d = el.dataset;
  if (d.tab) return set({ pestana: d.tab });
  if (d.filtro) return set({ filtro: d.filtro });
  if (d.tipo) return set({ reporte: { ...S.reporte, tipo: d.tipo, paso: 2 } });
  if (d.heridos) return set({ reporte: { ...S.reporte, heridos: d.heridos, paso: 3, fotos: 0 } });
  if (d.aprobar || d.pagar) {
    const id = d.aprobar || d.pagar;
    S.siniestros = S.siniestros.map((s) => s.id === id ? { ...s, estado: d.aprobar ? "Aprobado" : "Pagado" } : s);
    toast(d.aprobar ? `Siniestro ${id} aprobado` : `Siniestro ${id} marcado como pagado`);
    return set({});
  }
  switch (d.acc) {
    case "iniciar": {
      const codigo = `RDR-${aleatorio(4)}-${aleatorio(2)}`;
      set({ turno: { inicio: Date.now(), codigo, viaje: false }, pestana: "inicio" });
      return toast("Turno iniciado: tu cobertura está activa");
    }
    case "terminar": {
      const ms = Date.now() - S.turno.inicio;
      const h = ms / 3600000;
      const fin = Date.now();
      const semana = [...S.semana, { d: "Hoy", h: Math.max(h, 0.01) }];
      const codigo = S.turno.codigo;
      set({ turno: null, ultimoCodigo: { codigo, fin }, semana });
      return modal(`<div style="text-align:center"><div style="font-size:40px">🏁</div><h3>Turno terminado</h3>
        <p class="sub">Tu cobertura se apagó a las ${hhmm(fin)}.</p>
        <div class="constancia" style="text-align:left"><div class="fila"><span>Duración</span><b>${duracion(ms)}</b></div>
        <div class="fila"><span>Costo del turno</span><b>${usd(costoTurno(ms), 3)}</b></div><div class="fila"><span>Pagado por</span><b>${PLATAFORMA.nombre}</b></div></div>
        <button class="btn btn-osc bloque" style="margin-top:16px" data-cerrar>Listo</button></div>`);
    }
    case "adelantar":
      if (!S.turno) return;
      S.turno.inicio -= 3600000; guardar(); render(); return toast("Se adelantó 1 hora el turno");
    case "viaje":
      if (!S.turno) return;
      S.turno.viaje = !S.turno.viaje; guardar(); render();
      return toast(S.turno.viaje ? "Pasajero a bordo: se activó su cobertura médica" : "Viaje terminado: cobertura del pasajero desactivada");
    case "reportar": return set({ reporte: { paso: 1 } });
    case "cancelar-rep": return set({ reporte: null });
    case "foto": return set({ reporte: { ...S.reporte, fotos: (S.reporte.fotos || 0) + 1 } });
    case "enviar-rep": {
      const r = S.reporte;
      const id = `RD-2026-${String(413 + S.siniestros.filter((s) => s.estado === "Nuevo").length).padStart(4, "0")}`;
      const clave = `ATN-${aleatorio(4)}-${aleatorio(4)}`;
      const ramo = r.heridos === "Yo" || r.heridos === "Mi pasajero" ? "06" : "31";
      const ahora = new Date();
      const fecha = `${String(ahora.getDate()).padStart(2, "0")}/${String(ahora.getMonth() + 1).padStart(2, "0")} ${hhmm(ahora)}`;
      const reserva = { "Choque con vehículo": 600, "Caída sola": 300, "Roce con peatón": 250 }[r.tipo] || 200;
      S.siniestros = [{ id, fecha, quien: "Carlos Pérez", plat: PLATAFORMA.nombre, tipo: r.tipo, heridos: r.heridos, ramo, reserva, estado: "Nuevo" }, ...S.siniestros];
      return set({ reporte: { ...r, paso: 4, id, clave } });
    }
    case "cerrar-rep": return set({ reporte: null, pestana: "inicio" });
    case "constancia": return constancia();
  }
});
document.addEventListener("submit", (e) => {
  if (e.target.id !== "form-verif") return;
  e.preventDefault();
  const c = new FormData(e.target).get("c").toString().trim().toUpperCase();
  location.hash = `#/verificar?c=${encodeURIComponent(c)}`;
});

render();
