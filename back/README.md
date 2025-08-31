# DeUna IMAP ETH Payout Worker

A background Node.js worker that listens to **Gmail IMAP** for payment notifications from **DeUna**, extracts **Monto** (USD) and **Motivo** (ETH address), fetches the **ETH/USD spot price** from Coinbase, converts USD → ETH, and (optionally) sends the payout on Ethereum using **ethers v6**.

---

## 🚀 Features

- **IMAP listener with IDLE**: reacts to new mail immediately (no polling)
- **Message parsing**: extracts **Monto** and **Motivo** from HTML or text
- **Price fetch**: grabs **ETH/USD** spot from Coinbase and converts Monto → ETH
- **Safety rails**:

  - Sender must be **`notificaciones@deunaapp.com`**
  - Subject must start with **`¡Recibiste`** (case-insensitive)
  - Dry-run by default (`PAYOUT_ENABLED=false`)
  - Balance check includes gas before sending

- **Production-ready worker**: runs continuously on platforms like Render or Heroku worker dynos

---

## 📋 Prerequisites

- **Node.js 18+** (uses global `fetch`)
- Access to an **IMAP inbox** (Gmail, etc.)

  - For **Gmail**: enable **2-Step Verification** and create an **App Password** for IMAP

- An **Ethereum JSON-RPC** endpoint (Infura, Alchemy, etc.)
- An **Ethereum private key** with funds for gas and payouts (keep it secret)

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Gmail IMAP (App Password required)
IMAP_HOST=imap.gmail.com
IMAP_USER=you@gmail.com
IMAP_PASS=abcdefghijklmnop     # 16 chars, no spaces

# Ethereum
ETH_RPC_URL=https://mainnet.infura.io/v3/<your_key>
ETH_PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# Safety switch
PAYOUT_ENABLED=false            # keep false in first runs
```

> Gmail note: App Passwords require **2-Step Verification** on your Google Account.

---

## 🛠️ Installation & Run

```bash
npm install
node index.js
```

What you’ll see on startup:

- IMAP connects and opens **INBOX**
- Seed scan of any unseen messages
- Starts **live IDLE** listening
- Logs sender/subject and extracted fields (Monto, Motivo). If rules match, it fetches price, converts USD→ETH, and **prepares** a payout (dry-run unless enabled).

To actually send payouts, flip the switch in `.env`:

```env
PAYOUT_ENABLED=true
```

---

## 🧭 Message Rules (default)

1. **From** must include `notificaciones@deunaapp.com`
2. **Subject** must start with `¡Recibiste` (case-insensitive)
3. **Monto** is parsed from the email (handles `$1.234,56` and `$1,234.56`)
4. **Motivo** must contain a valid `0x…` Ethereum address (first match wins)

---

## 🔢 Price & Conversion

- Fetches **ETH/USD** from Coinbase’s public Prices API (`/v2/prices/ETH-USD/spot`) and divides `MontoUSD / ETHUSD` to get **MontoETH**.
- Short request timeout (\~1.2s) to avoid blocking mail handling; if price is unavailable, payout is skipped.

---

## 💸 Payouts (ethers v6)

- Creates a `JsonRpcProvider` using `ETH_RPC_URL`, and a `Wallet` from `ETH_PRIVATE_KEY`
- Checks balance ≥ **amount + estimated gas** (uses `21000 * maxFeePerGas`) before sending
- Sends a simple value transfer with EIP-1559 fees (`maxFeePerGas` / `maxPriorityFeePerGas`)
- You can switch chains by changing `ETH_RPC_URL`

---

## 🧪 Development Tips

- Keep `PAYOUT_ENABLED=false` while testing—logs will show a **dry-run**
- Send yourself a test email that matches:

  - From: `notificaciones@deunaapp.com`
  - Subject: `¡Recibiste …`
  - Body includes:

    - **Monto**: e.g., `$0,50 USD` or `$1,234.56`
    - **Motivo**: an ETH address like `0xabc123…`

- Check console logs for parsed **MontoUSD**, **ETH/USD**, **MontoETH** and target **address**

---

## 🏗️ Project Structure

```
deuna-imap-worker/
├── index.js          # The worker (IMAP listen → parse → price → optional payout)
├── package.json
├── .env.example      # Sample env (copy to .env)
└── README.md         # This file
```
