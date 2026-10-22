# Sunnix Hotel & Suites - PMS

Sistema integral de gestión hotelera (PMS) en tiempo real para hoteles de alojamiento y suites de alta rotación, desarrollado con **Next.js 16**, **TypeScript**, **Tailwind CSS** y arquitectura reactiva.

## 🏨 Módulos del Sistema

1. **Dashboard General (Visión 360°):** Centro de control ejecutivo con KPIs en vivo (ocupación, caja del turno actual, alertas de suites por vencer y actividad reciente).
2. **Rack Operativo de Habitaciones (`/dashboard/habitaciones`):** Cuadrícula táctica en tiempo real con temporizadores de turno, estados dinámicos (`LIBRE`, `OCUPADA`, `POR_VENCER`, `EN_COBRO`, `LIMPIEZA`, `MANTENIMIENTO`), fotos de suites, Check-in express y liquidación de Check-out unificada.
3. **Turnos y Reservas (`/dashboard/turnos`):** Planificación anticipada de turnos express (2h y 3h) y pernoctes con seña y calendario.
4. **Caja por Turno (`/dashboard/caja`):** Apertura obligatoria de turno, movimientos en vivo y protocolo de **Arqueo Ciego estricto**.
5. **Ingresos y Egresos (`/dashboard/ingresos-egresos`):** Libro mayor de tesorería y flujo financiero clasificado por concepto y medio de pago, con exportación a CSV.
6. **Control de Limpieza (`/dashboard/limpieza`):** Terminal táctica para mucamas, gestión de tiempos de desinfección y reasignación de personal.
7. **Asistencia del Personal (`/dashboard/personal`):** Registro de ingresos, salidas, ausencias y métricas de dotación en tiempo real.
8. **Reportes Gerenciales & BI (`/dashboard/reportes`):** Analítica avanzada de ocupación, facturación por turno, desglose de consumos y comparativa mensual.
9. **Configuración del Sistema (`/dashboard/configuracion`):** Parámetros fiscales del hotel, reglas de tiempos y tolerancia de gracia, matriz de tarifas por suite, políticas de seguridad y domótica IoT (relés).

## 🚀 Puesta en Marcha

### Prerrequisitos
- Node.js 18+ o superior
- npm / yarn / pnpm

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Credenciales de Demostración Local
Para ingresar en entorno de prueba sin configurar Supabase remoto:
- **Email:** `demo@sunnix.local`
- **Contraseña:** `demo1234`
(O hacer clic directamente en *Ingresar en modo Demo* en la pantalla de login).

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Lenguaje:** TypeScript (Strict Mode)
- **Estilos:** Tailwind CSS + Lucide Icons
- **Base de Datos / Auth:** Supabase (con fallback local/demo de alta velocidad)
