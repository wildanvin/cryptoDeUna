# CryptoDeUna - Aplicación de Onboarding Web3 para Ecuador

Una aplicación moderna y juguetona de onboarding web3 diseñada específicamente para ciudadanos ecuatorianos. CryptoDeUna facilita la compra de ETH en la red Lisk de manera súper fácil y rápida.

## 🚀 Características

- **Balance en Tiempo Real**: Consulta el balance disponible de fondos en la red Lisk
- **Conversión USD**: Conversión automática de ETH a USD usando la API de Coinbase
- **Integración DeUna**: Botón de pago directo que redirige a la plataforma DeUna
- **Código QR**: Código QR integrado para facilitar el acceso desde móviles
- **Solo Móvil**: Optimizado exclusivamente para dispositivos móviles
- **Educación Web3**: Páginas educativas sobre DeFi, wallets, ENS, multisigs y ecosistema

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.0 o superior)
- **npm** (viene incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

### Verificar instalación:
\`\`\`bash
node --version
npm --version
\`\`\`

## 🛠️ Instalación

### Paso 1: Descargar el proyecto
Si descargaste el ZIP desde v0:
\`\`\`bash
# Extrae el archivo ZIP y navega al directorio
cd cryptodeuna-app
\`\`\`

### Paso 2: Instalar dependencias
\`\`\`bash
npm install
\`\`\`

### Paso 3: Ejecutar en modo desarrollo
\`\`\`bash
npm run dev
\`\`\`

### Paso 4: Abrir en el navegador
Abre tu navegador y ve a: `http://localhost:3000`

## 📱 Uso Recomendado

**¡IMPORTANTE!** Esta aplicación está optimizada para dispositivos móviles y requiere la aplicación DeUna instalada para funcionar correctamente.

### Para probar en desktop:
1. Abre las herramientas de desarrollador (F12)
2. Activa el modo responsive/móvil
3. Selecciona un dispositivo móvil (iPhone, Android)

## 🏗️ Estructura del Proyecto

\`\`\`
cryptodeuna-app/
├── app/                    # App Router de Next.js
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout global
│   ├── globals.css        # Estilos globales
│   ├── ecosystem/         # Página educativa sobre ecosistema
│   ├── defi/             # Página educativa sobre DeFi
│   ├── wallets/          # Página educativa sobre wallets
│   ├── multisigs/        # Página educativa sobre multisigs
│   └── ens/              # Página educativa sobre ENS
├── components/            # Componentes reutilizables
│   ├── balance-card.tsx   # Tarjeta de balance con API
│   ├── payment-button.tsx # Botón de pago a DeUna
│   └── mobile-only-notice.tsx # Aviso para móviles
├── public/               # Archivos estáticos
│   └── qr-deuna.png     # Código QR de DeUna
└── README.md            # Este archivo
\`\`\`

## 🔧 Tecnologías Utilizadas

- **Next.js 15** - Framework React con App Router
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Framework de estilos
- **Shadcn/ui** - Componentes de UI
- **Lisk API** - Para consultar balances en blockchain
- **Coinbase API** - Para conversión de precios ETH/USD

## 🌐 APIs Utilizadas

### Balance de Lisk
- **Endpoint**: `https://lisk.drpc.org`
- **Dirección**: `0x70E1D904c1b50A4B77a38FfA4ec14217493484e3`
- **Método**: `eth_getBalance`

### Precio ETH/USD
- **Endpoint**: `https://api.coinbase.com/v2/exchange-rates?currency=ETH`
- **Uso**: Conversión automática de ETH a USD

## 📱 Funcionalidades Principales

### 1. Balance en Tiempo Real
- Consulta automática del balance de la dirección Lisk
- Actualización cada vez que se carga la página
- Conversión automática a USD

### 2. Botón de Pago
- Redirige directamente a DeUna para procesar pagos
- URL encriptada para seguridad
- Optimizado para móviles

### 3. Educación Web3
- 5 páginas educativas sobre conceptos web3
- Explicaciones ELI5 (Explain Like I'm 5)
- Enlaces a recursos externos

## 🚨 Comandos Útiles

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar versión de producción
npm start

# Linter (verificar código)
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
\`\`\`

## 🔍 Troubleshooting

### Problema: "Module not found"
\`\`\`bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Problema: Puerto 3000 ocupado
\`\`\`bash
# Usar un puerto diferente
npm run dev -- -p 3001
\`\`\`

### Problema: Error de CORS con APIs
- Las APIs están configuradas para funcionar desde cualquier origen
- Si hay problemas, verifica tu conexión a internet

### Problema: Estilos no se cargan
\`\`\`bash
# Limpiar caché de Next.js
rm -rf .next
npm run dev
\`\`\`

## 🌍 Despliegue

### Vercel (Recomendado)
1. Sube tu código a GitHub
2. Conecta tu repositorio en Vercel
3. Despliega automáticamente

### Otros proveedores
\`\`\`bash
# Construir para producción
npm run build

# Los archivos estáticos estarán en la carpeta 'out' o '.next'
\`\`\`

## 📞 Soporte

Si encuentras algún problema:

1. Verifica que tienes las versiones correctas de Node.js y npm
2. Asegúrate de que todas las dependencias estén instaladas
3. Revisa que estés usando un dispositivo móvil o simulando uno
4. Verifica tu conexión a internet para las APIs

## 📄 Licencia

Este proyecto está diseñado específicamente para el onboarding web3 en Ecuador.

---

**¡Disfruta usando CryptoDeUna! 🇪🇨🚀**
