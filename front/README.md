# CryptoDeUna - Frontend

Una aplicación de onboarding web3 diseñada específicamente para ciudadanos ecuatorianos. CryptoDeUna facilita la compra de ETH en la red Lisk de manera súper fácil y rápida.

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

```bash
node --version
npm --version
```

## 🛠️ Instalación

```bash
cd cryptoDeUna
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Ejecutar en modo desarrollo

```bash
npm run dev
```

### Paso 4: Abrir en el navegador

Abre tu navegador y ve a: `http://localhost:3000`

## 📱 Uso Recomendado

**¡IMPORTANTE!** Esta aplicación está optimizada para dispositivos móviles y requiere la aplicación DeUna instalada para funcionar correctamente.

## 🏗️ Estructura del Proyecto

```
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
```

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
