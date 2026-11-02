# Rodar — Pitch AseguraTech26

> **Tu seguro arranca cuando arranca tu turno.**

**Desafío principal:** 3 — Nuevos modelos de distribución y seguros
**Desafío secundario:** 2 — Seguros inclusivos, microseguros y masivos
**Etapa:** Pre-semilla (problema identificado y solución definida), con prototipo funcional en línea

---

## 1. El problema

- **La norma ya llegó.** En agosto de 2026 el INTT estableció que las empresas de delivery y de viajes deben mantener vigentes un **seguro de responsabilidad civil** y un **seguro médico para el pasajero**, además de tener Registro Nacional, una escuela de conductores avalada y revisiones técnicas periódicas.
- **La responsabilidad es de la plataforma.** El INTT considera prestadora del servicio a la empresa dueña de la app, aunque el repartidor use moto propia o alquilada.
- **La regulación todavía se está diseñando.** El 22 de octubre de 2026 el INTT lanzó una consulta nacional a motorizados y repartidores para ajustar el marco regulatorio.
- **El costo preocupa al sector.** Cavecom-e advirtió que los seguros obligatorios y las certificaciones van a subir la tarifa final del delivery.
- **El mercado es grande y vulnerable.** Hay unos 1,5 millones de motos registradas, de las cuales entre 270.000 y 300.000 están en delivery y transporte móvil. Los motorizados son el grupo con más víctimas en accidentes de tránsito, y los accidentes se concentran en horas pico.
- **La póliza anual fija no encaja.** Los repartidores trabajan por horas, rotan entre apps y muchas cuentas registradas casi no salen a la calle. Asegurar cada moto registrada con una póliza anual obliga a pagar por cuentas inactivas.

> 📌 **Por hacer antes del evento:** confirmar con 2–3 plataformas cuántos de sus registrados trabajan cada mes y cuántas horas promedio. Ese dato sostiene el argumento del ahorro.

## 2. La solución

**Rodar** es un **seguro por jornada** integrado en las apps de delivery. La cobertura se **activa cuando el repartidor se conecta** y se **apaga cuando se desconecta**. La plataforma paga **solo las horas reales en la vía**, con un tope diario.

1. **Integración por API:** la app avisa a Rodar al iniciar y cerrar cada turno, y cuando sube un pasajero (mototaxi).
2. **Coberturas por turno**, emitidas por una aseguradora autorizada en una póliza colectiva cuyo tomador es la plataforma:
   - Responsabilidad civil durante el reparto, como exceso sobre el RCV obligatorio (ramo 31).
   - Accidentes personales del repartidor: gastos médicos, invalidez y muerte (ramo 06).
   - Accidentes personales del pasajero, solo durante el viaje (ramo 06).
3. **Código de verificación:** el repartidor muestra un código en su app y cualquier fiscal del INTT, policía o la otra parte de un accidente comprueba que tiene cobertura **en ese momento**.
4. **Reporte de siniestros en 3 pasos** desde el teléfono, con la hora y la ubicación del turno. Si hay heridos, recibe una **clave de atención médica** válida 24 horas.
5. **Constancia de cumplimiento** para que la plataforma la presente ante el INTT.
6. **Control de requisitos:** Rodar no activa turnos de motos sin RCV obligatorio vigente y avisa qué repartidores no han cargado su certificado de aptitud.

### Los cuatro actores

| Actor | Qué hace en Rodar |
|---|---|
| **Plataforma de delivery** (tomador) | Integra la API, ve su flota cubierta en tiempo real, paga por hora y descarga la constancia para el INTT |
| **Repartidor** (asegurado) | Trabaja cubierto sin trámites, muestra su código y reporta accidentes desde la app |
| **Aseguradora** | Asume el riesgo, ve la exposición por hora, la prima devengada, el mapa de siniestralidad y gestiona siniestros |
| **Intermediario autorizado** | Coloca la póliza colectiva con la plataforma |

## 3. Por qué ahora y por qué en Venezuela

- **Obligación nueva y sin producto a la medida:** la norma del INTT existe desde agosto de 2026 y la consulta nacional sigue abierta.
- **Plataformas digitales:** el delivery ya funciona por apps, así que el seguro se distribuye por el mismo canal sin red de ventas.
- **Pago digital masivo:** las plataformas ya liquidan a sus repartidores y pagan en línea.
- **Datos para tarificar:** cada turno deja horas, zona y franja, la base para tarifas por riesgo real.

## 4. Modelo de negocio

| Fuente | Descripción |
|---|---|
| Comisión tecnológica | Un porcentaje de la prima por hora, acordado con la aseguradora por operar el canal |
| Suscripción de la plataforma | Panel de flota, constancias, control de requisitos y API |
| Datos de riesgo (agregados) | Reportes de siniestralidad por hora y zona para la aseguradora, sin datos personales |

**Para la plataforma:** cumple la norma pagando solo lo que usa. En la demo, una flota de 1.240 registrados con 812 activos paga unos **$4.677/mes por hora** contra **$8.680/mes** de una póliza fija por moto, un **46 % menos** (cifras referenciales).
**Para la aseguradora:** un canal masivo nuevo, con prima que se devenga solo cuando hay exposición real y datos finos para tarificar.
**Para el repartidor:** protección sin costo para él y sin papeleo.

## 5. Cumplimiento regulatorio

- **Rodar no asume riesgo ni intermedia:** el riesgo es de una aseguradora autorizada y la colocación la hace un intermediario autorizado. Rodar es la capa tecnológica.
- **Ramos:** cada cobertura se identifica con su ramo contable (31 y 06).
- **RCV obligatorio:** sigue siendo del propietario de la moto (Ley de Transporte Terrestre). Rodar lo verifica y cubre la actividad de reparto por encima de ese límite.
- **Datos personales:** la verificación pública muestra solo iniciales, placa y estado de la cobertura.
- **Producto:** requiere un condicionado de póliza colectiva con activación por turno aprobado por la SUDEASEG. Es el primer paso del piloto.

## 6. Hoja de ruta

| Fase | Qué |
|---|---|
| Hoy | Prototipo en línea: app del repartidor, panel de la plataforma, panel de la aseguradora y verificación pública |
| 0–3 meses | Validación con 2–3 plataformas y 1 aseguradora; diseño del condicionado por turno |
| 3–6 meses | Piloto con una plataforma: API en producción, pago mensual por horas, constancias |
| 6–12 meses | Tarifa por zona y franja, más plataformas (mototaxi, encomiendas, mensajería) |
| 12+ meses | Mismo modelo para otros trabajos por plataforma: conductores de carro, técnicos a domicilio |

## 7. Métricas del piloto

- % de la flota activa con cobertura en cada turno
- Horas cubiertas por mes y costo por repartidor activo
- Tiempo de reporte y de primer contacto en un siniestro
- Siniestralidad por hora expuesta
- Verificaciones realizadas en la calle

## 8. Equipo

> Completar: nombre, rol y experiencia de cada integrante.

---

## Guion del pitch (≈ 5 minutos)

**[0:00 – 0:40] Gancho**
"Desde agosto, si tienes una app de delivery en Venezuela, el INTT te exige seguro de responsabilidad civil y seguro médico. Pregunta: ¿cuántas horas al mes trabaja realmente cada uno de tus repartidores? … Porque una póliza anual te cobra las 720."

**[0:40 – 1:30] Problema**
La norma del INTT, la responsabilidad de la plataforma, el aviso de Cavecom-e sobre la tarifa y los motorizados como grupo más vulnerable.

**[1:30 – 3:00] Solución y demo en vivo**
"Con Rodar, el seguro arranca cuando arranca el turno."
1. App del repartidor: iniciar turno → cobertura activa y costo por minuto
2. Mi código → la vista que ve el fiscal: "Cobertura VIGENTE"
3. Reportar accidente → clave de atención médica
4. Panel de la plataforma: flota cubierta en vivo, cumplimiento INTT, constancia y ahorro
5. Panel de la aseguradora: el siniestro llega al instante; exposición por hora y mapa de siniestralidad

**[3:00 – 3:45] Modelo de negocio**
Comisión por la prima y suscripción de la plataforma. La plataforma paga por uso; la aseguradora gana un canal masivo nuevo.

**[3:45 – 4:30] Viabilidad en Venezuela y regulación**
Aseguradora e intermediario autorizados, ramos 31 y 06, RCV obligatorio intacto y condicionado por turno como primer paso.

**[4:30 – 5:00] Cierre**
"Más de 270.000 motos trabajan en delivery y transporte. Queremos que cada una esté cubierta en el momento exacto en que está en la calle, y que asegurarla cueste lo que realmente se usa."

---

## Preguntas probables del jurado

- **¿El RCV por hora es legal si el RCV es obligatorio para circular?** → Rodar no reemplaza el RCV obligatorio de la moto: lo verifica y cubre la responsabilidad de la actividad de reparto por encima de ese límite, que es lo que el INTT exige a la plataforma.
- **¿Quién paga?** → La plataforma, como tomador. La norma la hace responsable. Puede trasladar una parte a la tarifa si quiere, pero el repartidor no paga nada.
- **¿Qué pasa si el repartidor se accidenta desconectado?** → No está en turno y no está cubierto por Rodar; lo cubre su RCV y cualquier póliza propia. La app lo deja claro.
- **¿Cómo evitan el fraude (conectarse después del accidente)?** → El turno lo abre la app de la plataforma, no el repartidor, y cada reporte se cruza con la hora y la ubicación del turno.
- **¿Por qué una aseguradora querría esto?** → Prima que se devenga con exposición real, un canal masivo sin red de ventas y datos por hora y zona para tarificar.
- **¿Ya existe algo así en Venezuela?** → No encontramos un producto de activación por turno para plataformas de delivery en el país.

## Fuentes

- INTT, requisitos para empresas de delivery: [El Universal](https://www.eluniversal.com/venezuela/239590/intt-sostuvo-encuentro-para-mejorar-la-seguridad-vial-y-reducir-accidentes-de-motorizados), [NotiFalcón](https://notifalcon.com/2026/08/regulaciones-al-delivery-en-venezuela-intt-fija-reglas-para-empresas-de-repartos/)
- Consulta nacional del INTT (22/10/2026): [El Impulso](https://www.elimpulso.com/2026/10/22/el-intt-despliega-encuesta-nacional-para-disenar-la-nueva-regulacion-del-sector-motorizado-y-delivery-22oct/)
- Cavecom-e, costos y número de motos: [Finanzas Digital](https://finanzasdigital.com/regulaciones-y-seguros-obligatorios-elevaran-tarifas-de-delivery/)
- Motorizados y accidentes: [El Diario](https://eldiario.com/etiqueta/motorizados/), [Finanzas Digital](https://finanzasdigital.com/ventas-de-motocicletas-dinamiza-la-economia-venezolana/)
- RCV obligatorio (Gaceta Oficial 6.835): [El Diario](https://eldiario.com/2025/05/23/cuanto-cuesta-poliza-responsabilidad-civil-vehicular-venezuela/)
