# CryptoDeUna - Frontend

A web3 onboarding app designed specifically for Ecuadorian citizens. CryptoDeUna makes buying ETH on the Lisk network super easy and fast.

## 🚀 Features

- **Real-Time Balance**: Check available funds on the Lisk network
- **USD Conversion**: Automatic ETH→USD conversion using the Coinbase API
- **DeUna Integration**: Direct payment button that redirects to the DeUna platform
- **QR Code**: Built-in QR code for easy mobile access
- **Mobile Only**: Optimized exclusively for mobile devices
- **Web3 Education**: Educational pages on DeFi, wallets, ENS, multisigs, and ecosystem

## 📋 Prerequisites

Before you start, make sure you have:

- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js)
- **Git** (optional, to clone the repo)

### Verify installation:

```bash
node --version
npm --version
```

## 🛠️ Installation

```bash
cd cryptoDeUna
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Run in development mode

```bash
npm run dev
```

### Step 4: Open in the browser

Open: `http://localhost:3000`

## 📱 Recommended Use

**IMPORTANT!** This app is optimized for mobile devices and requires the DeUna app installed to work properly.

## 🏗️ Project Structure

```
cryptodeuna-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Global layout
│   ├── globals.css        # Global styles
│   ├── ecosystem/         # Educational page: ecosystem
│   ├── defi/              # Educational page: DeFi
│   ├── wallets/           # Educational page: wallets
│   ├── multisigs/         # Educational page: multisigs
│   └── ens/               # Educational page: ENS
├── components/            # Reusable components
│   ├── balance-card.tsx   # Balance card with API
│   ├── payment-button.tsx # Payment button to DeUna
│   └── mobile-only-notice.tsx # Mobile-only notice
├── public/                # Static files
│   └── qr-deuna.png       # DeUna QR code
└── README.md              # This file
```

## 🔧 Tech Stack

- **Next.js 15** – React framework with App Router
- **React 18** – UI library
- **TypeScript** – Static typing
- **Tailwind CSS v4** – Styling framework
- **shadcn/ui** – UI components
- **Lisk API** – Query blockchain balances
- **Coinbase API** – ETH/USD price conversion

## 🌐 APIs Used

### Lisk Balance

- **Endpoint**: `https://lisk.drpc.org`
- **Address**: `0x70E1D904c1b50A4B77a38FfA4ec14217493484e3`
- **Method**: `eth_getBalance`

### ETH/USD Price

- **Endpoint**: `https://api.coinbase.com/v2/exchange-rates?currency=ETH`
- **Use**: Automatic ETH→USD conversion
