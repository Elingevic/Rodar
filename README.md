# Rodar

> Tu seguro arranca cuando arranca tu turno.

Seguro por jornada para repartidores y motorizados de plataformas de delivery en Venezuela. La cobertura se activa cuando el repartidor se conecta a la app y se apaga cuando se desconecta. La plataforma paga solo las horas en la vía y cumple los seguros que exige el INTT. Postulación a **AseguraTech26**, desafío 3 (nuevos modelos de distribución).

## Carpetas

```
web/          prototipo (HTML, CSS y JS sin dependencias): se publica tal cual en Vercel
postulacion/  propuesta y lámina en HTML y PDF, con capturas del prototipo
PITCH.md      pitch, guion de 5 minutos, preguntas del jurado y fuentes
```

## Ver el prototipo en local

Abre `web/index.html` en el navegador, o sírvelo:

```bash
cd web
npx serve .        # o: python -m http.server 8000
```

## Publicar en Vercel

**Opción 1, sin instalar nada:** entra a vercel.com → *Add New → Project* → importa el repositorio y en *Root Directory* elige `web`. No hay build: *Framework Preset* = **Other**, sin comando de build.

**Opción 2, con la CLI:**

```bash
cd web
npx vercel --prod
```

## Qué hace el prototipo

| Vista | Ruta | Qué muestra |
|---|---|---|
| Inicio | `#/` | Problema, solución y acceso a las vistas |
| Repartidor | `#/repartidor` | App en un teléfono: iniciar y terminar turno, costo por minuto, código de verificación, reporte de accidente en 3 pasos con clave de atención médica, historial |
| Plataforma | `#/plataforma` | Flota cubierta en vivo, cumplimiento INTT, constancia imprimible, costo por hora frente a póliza fija, siniestros e integración por API |
| Aseguradora | `#/aseguradora` | Exposición por hora, prima devengada, siniestralidad, mapa de siniestros por día y franja, aprobación y pago de siniestros |
| Verificar | `#/verificar?c=CODIGO` | Lo que ve un fiscal: cobertura vigente o no en este momento |

Todo corre en el navegador y el estado se guarda en `localStorage`: lo que haces como repartidor aparece en los otros paneles. El botón **Reiniciar demo** vuelve a los datos de ejemplo. Con **Simular +1 hora** se adelanta el turno para la presentación.

Empresas, personas, precios y códigos son **ficticios o referenciales**. El QR del repartidor es ilustrativo; la verificación funciona escribiendo el código.

## Siguiente paso técnico

Si el proyecto avanza: pasar a Next.js + PostgreSQL con el mismo stack de Perfila, con una API real de turnos (`POST /v1/turnos`, `/cerrar`, `/pasajero`) y webhooks hacia la aseguradora.
