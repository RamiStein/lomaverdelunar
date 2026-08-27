# 🌕 Loma Verde Lunar 1320 • Estado de Situación & Próximos Pasos 🌿

Documento de sincronización y hoja de ruta para continuar el desarrollo desde cualquier computadora.

---

## 📌 1. Resumen del Proyecto

**Loma Verde Lunar 1320** es una plataforma integral web y CRM comunitario desarrollado para la autogestión de la feria vecinal, asambleas de presupuesto participativo, economía fraterna basada en troqueles (virtudes y saberes) y transparencia contable comunitaria.

- **Repositorio Oficial en GitHub**: [https://github.com/RamiStein/lomaverdelunar](https://github.com/RamiStein/lomaverdelunar)
- **Tecnologías**:
  - **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas API, QRCode.
  - **Backend**: Node.js, Express REST API, exportador nativo Excel (`xlsx`).
  - **Base de Datos**: Motor de base de datos transaccional en JSON (`server/data/db.json`) de lectura/escritura ultra-rápida con auditoría.

---

## 🛠️ 2. Módulos Implementados & Estado Actual

| Módulo | Componente Principal | Estado | Descripción |
| :--- | :--- | :---: | :--- |
| **Hero & Fase Lunar en Vivo** | `HeroSection.jsx` & `lunarCalc.js` | ✅ Listo | Calcula la fase astronómica real de la Luna y signo zodiacal en tiempo real. |
| **La Feria Comunitaria** | `FeriaSection.jsx` & `InscripcionForm.jsx` | ✅ Listo | Catálogo interactivo por rubros, modal de contacto con WhatsApp pre-cargado e inscripción online. |
| **Flyer Studio 2.0 (Editor Visual)** | `FlyerStudio.jsx` | ✅ Listo | Editor interactivo estilo Canva sobre el afiche oficial (`plantilla_luna_piscis.jpg`): logo en la luna con 3 modos de fusión, tipografía original (`Lora bold`), drag & drop, manijas de redimensionado con anclaje direccional y botón de auto-organización sin superposiciones. |
| **Mercado de Virtudes & Saberes** | `MercadoVirtudes.jsx` & `TroquelModal.jsx` | ✅ Listo | Billetera de troqueles digitales con Código QR, canje atómico de saldo y publicación de virtudes. |
| **Presupuesto Participativo** | `PresupuestoView.jsx` | ✅ Listo | Votación comunitaria de proyectos, donaciones directas (alias CVU/Mercado Pago) e inscripción de voluntarios. |
| **Directorio "Páginas Amarillas"** | `DirectorioView.jsx` | ✅ Listo | Directorio vecinal con buscador instantáneo en vivo. |
| **Transparencia Contable** | `ContabilidadView.jsx` | ✅ Listo | Libro público de egresos y facturas verificables. |
| **CRM Administrativo Integral** | `CRMDashboard.jsx` & `CRMLoginModal.jsx` | ✅ Listo | Panel de control con clave (`lomaverde`): aprobación de feriantes, generador de confirmaciones por WhatsApp, auditoría de troqueles/votos y exportación completa a Excel (.xlsx). |

---

## 📂 3. Estructura de Archivos Clave

```text
lomaverdelunar/
├── client/                               # Frontend (React + Vite + Tailwind)
│   ├── public/
│   │   └── plantilla_luna_piscis.jpg     # Afiche base maestro para el Flyer Studio
│   └── src/
│       ├── components/
│       │   ├── CRM/
│       │   │   ├── CRMDashboard.jsx      # Panel CRM de gestión administrativa
│       │   │   └── CRMLoginModal.jsx     # Modal de desbloqueo con clave lunar
│       │   ├── ContabilidadView.jsx      # Libro contable público
│       │   ├── DirectorioView.jsx        # Páginas Amarillas con buscador en vivo
│       │   ├── EscenarioSection.jsx      # Cronograma artístico y musical
│       │   ├── FeriaSection.jsx          # Puestos de feria por rubros
│       │   ├── FlyerStudio.jsx           # Editor visual interactivo de flyers en Canvas
│       │   ├── HeroSection.jsx           # Cabecera mística con cálculo astronómico
│       │   ├── InscripcionForm.jsx       # Formulario de postulación de feriantes
│       │   ├── MercadoVirtudes.jsx       # Mercado de economía fraterna
│       │   ├── Navbar.jsx                # Navegación con responsive design
│       │   ├── PresupuestoView.jsx       # Votación de presupuesto participativo
│       │   └── TroquelModal.jsx          # Modal de troqueles y código QR
│       ├── utils/
│       │   └── lunarCalc.js              # Algoritmo de cálculo de fases lunares
│       ├── App.jsx                       # Orquestador de vistas y estado global
│       └── main.jsx                      # Entrada de la app React
├── server/                               # Backend (Node.js + Express)
│   ├── data/
│   │   └── db.json                       # Base de datos JSON viva y persistente
│   ├── db.js                             # Métodos CRUD, transacciones y exportación Excel
│   └── index.js                          # Servidor REST API (Puerto 3001)
├── .gitignore                            # Exclusión de node_modules, dist, temporales
├── package.json                          # Scripts para levantar Frontend + Backend juntos
└── README.md                             # Documentación general de instalación
```

---

## 🚀 4. Cómo Iniciar en la Otra Computadora

Al clonar o abrir el proyecto en tu otra computadora:

```bash
# 1. Traer los últimos cambios desde GitHub
git pull origin main

# 2. Instalar dependencias si es la primera vez en esa máquina
npm install
cd client && npm install && cd ..

# 3. Levantar la aplicación completa (Frontend + Backend)
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Clave de Acceso CRM**: `lomaverde`

---

## 🔮 5. Próximos Pasos Sugeridos (Hoja de Ruta)

1. **Despliegue en la Nube (Deploy)**:
   - Configurar hosting público para que los feriantes y vecinos puedan acceder desde sus celulares (opciones recomendadas: *Render*, *Railway*, *Vercel* con backend Node).
2. **Notificaciones Automáticas**:
   - Integración con webhook de WhatsApp / Email para avisar automáticamente al feriante cuando su puesto haya sido aprobado desde el CRM.
3. **Impresión en Lote de Troqueles y Flyers**:
   - Agregar botón en el CRM para generar planchas PDF listas para imprimir de troqueles con QR y flyers de la feria.
4. **Modo Offline / PWA (Progressive Web App)**:
   - Configurar Service Worker para permitir registrar transacciones de troqueles en la plaza incluso si hay baja señal de internet móvil.
5. **Autenticación Multi-Rol**:
   - Panel específico para feriantes donde puedan consultar sus ventas de virtudes acumuladas y actualizar su catálogo de productos.
