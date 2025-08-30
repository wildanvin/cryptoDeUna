// index.js — step 4.6: payout ETH to address in "Motivo"; subject MUST start with "¡Recibiste"
// Run: npm i mailparser imapflow cheerio dotenv ethers
// Requires Node 18+ for global fetch.
// ENV required:
//   IMAP_HOST=imap.gmail.com
//   IMAP_USER=you@gmail.com
//   IMAP_PASS=abcdefghijklmnop
//   ETH_RPC_URL=https://mainnet.infura.io/v3/<key>   (or any JSON-RPC URL)
//   ETH_PRIVATE_KEY=0xabcdef...                        (sender key)
//   PAYOUT_ENABLED=false                               (default false; set true to actually send)

import 'dotenv/config'
import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import * as cheerio from 'cheerio'
import {
  JsonRpcProvider,
  Wallet,
  isAddress,
  parseEther,
  formatEther,
} from 'ethers'

function required(name) {
  const v = process.env[name]
  if (!v) {
    console.error(`Missing ${name} in .env`)
    process.exit(1)
  }
  return v
}

const host = required('IMAP_HOST') // e.g. imap.gmail.com
const user = required('IMAP_USER') // full email
const pass = required('IMAP_PASS').split(' ').join('').trim() // sanitize any spaces

const RPC_URL = required('ETH_RPC_URL')
const PRIVATE_KEY = required('ETH_PRIVATE_KEY')
const PAYOUT_ENABLED =
  String(process.env.PAYOUT_ENABLED || 'false').toLowerCase() === 'true'

const provider = new JsonRpcProvider(RPC_URL)
const wallet = new Wallet(PRIVATE_KEY, provider)

const client = new ImapFlow({
  host,
  port: 993,
  secure: true,
  auth: { user, pass },
  logger: false, // set to console for verbose logs
})

function normalizeWhitespace(s = '') {
  return s.replace(/\s+/g, ' ').trim()
}
function normalizeSubject(s = '') {
  return s.trim().toLowerCase()
} // no conversion; must match leading "¡"
function getAddresses(addrObj) {
  const arr = addrObj?.value || []
  return arr.map((x) => (x.address || '').toLowerCase()).filter(Boolean)
}

function extractMontoMotivo(parsed) {
  let monto = ''
  let motivo = ''
  const html = parsed.html || ''
  const text = parsed.text || ''

  if (html) {
    const $ = cheerio.load(html)
    const pick = (label) => {
      const td = $('td')
        .filter(
          (_, el) => normalizeWhitespace($(el).text()).toLowerCase() === label
        )
        .first()
      if (td.length) {
        const tr = td.closest('tr')
        let val = normalizeWhitespace(
          tr.find('td.text-subtitle-table').first().text()
        )
        if (!val) val = normalizeWhitespace(td.nextAll('td').last().text())
        return val
      }
      return ''
    }
    monto = pick('monto')
    motivo = pick('motivo')
  }

  if ((!monto || !motivo) && text) {
    const lines = text
      .split(/\r?\n/)
      .map((l) => normalizeWhitespace(l))
      .filter(Boolean)
    for (let i = 0; i < lines.length; i++) {
      const low = lines[i].toLowerCase()
      if (!monto && low.startsWith('monto'))
        monto =
          normalizeWhitespace(lines[i].replace(/^monto\s*:?/i, '')) ||
          lines[i + 1] ||
          ''
      if (!motivo && low.startsWith('motivo'))
        motivo =
          normalizeWhitespace(lines[i].replace(/^motivo\s*:?/i, '')) ||
          lines[i + 1] ||
          ''
    }
  }
  return { monto, motivo }
}

// Parse Monto string like "$0,50 USD" or "$1,234.56" into a JS number (USD)
function parseUSDFromMonto(monto = '') {
  if (!monto) return null
  let s = monto
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/usd/gi, '')
    .replace(/us\$/gi, '')
    .replace(/\$/g, '')
    .replace(/\s/g, '')
    .replace(/[^0-9,.-]/g, '')
  if (!s) return null
  const lastComma = s.lastIndexOf(',')
  const lastDot = s.lastIndexOf('.')
  let decimalSep = null
  if (lastComma === -1 && lastDot === -1) decimalSep = null
  else if (lastComma === -1) decimalSep = '.'
  else if (lastDot === -1) decimalSep = ','
  else decimalSep = lastComma > lastDot ? ',' : '.'
  const lastIdx = decimalSep === ',' ? lastComma : lastDot
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch >= '0' && ch <= '9') out += ch
    else if ((ch === ',' || ch === '.') && i === lastIdx) out += '.'
  }
  if (!out || out === '.') return null
  const num = Number(out)
  return Number.isFinite(num) ? num : null
}

async function getEthSpotUSD() {
  const url = 'https://api.coinbase.com/v2/prices/ETH-USD/spot'
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 1200)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json' },
    })
    clearTimeout(timer)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const n = Number(json?.data?.amount)
    return Number.isFinite(n) ? n : null
  } catch (e) {
    clearTimeout(timer)
    console.error('Price fetch failed:', e?.message || e)
    return null
  }
}

function extractEthAddress(str = '') {
  const m = String(str).match(/0x[a-fA-F0-9]{40}/)
  return m ? m[0] : ''
}

async function maybePayoutETH(toAddr, weiAmount) {
  if (!isAddress(toAddr)) {
    console.warn('⛔ Invalid target address, skipping:', toAddr)
    return
  }
  const sender = await wallet.getAddress()
  const [bal, feeData] = await Promise.all([
    provider.getBalance(sender),
    provider.getFeeData(),
  ])
  const gasLimit = 21000n
  const maxFeePerGas = feeData.maxFeePerGas ?? 30n * 10n ** 9n // 30 gwei fallback
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? 2n * 10n ** 9n
  const gasCost = gasLimit * maxFeePerGas

  if (bal < weiAmount + gasCost) {
    console.warn(
      `⛔ Insufficient funds. Balance=${formatEther(
        bal
      )} ETH, Needed≈${formatEther(weiAmount + gasCost)} ETH`
    )
    return
  }

  console.log(
    `🔁 Prepared payout of ${formatEther(
      weiAmount
    )} ETH to ${toAddr} from ${sender}`
  )

  if (!PAYOUT_ENABLED) {
    console.log('💤 PAYOUT_ENABLED=false (dry-run). No transaction sent.')
    return
  }

  const tx = await wallet.sendTransaction({
    to: toAddr,
    value: weiAmount,
    maxFeePerGas,
    maxPriorityFeePerGas,
    gasLimit,
  })
  console.log('🚀 Sent tx:', tx.hash)
}

// 🔥 Action hook: subject must start with "¡recibiste" and From must be notificaciones@deunaapp.com
async function onNewEmail(parsed) {
  const fromText = parsed.from?.text || ''
  const to = parsed.to?.text || ''
  const cc = parsed.cc?.text || ''
  const subjectRaw = parsed.subject || '(no subject)'
  const subjectNorm = normalizeSubject(subjectRaw)
  const fromAddrs = getAddresses(parsed.from)
  const isFromDeUna = fromAddrs.includes('notificaciones@deunaapp.com')
  const subjMatch = subjectNorm.startsWith('¡recibiste') // strictly requires opening ¡
  if (!(subjMatch /*&& isFromDeUna*/)) return

  const { monto, motivo } = extractMontoMotivo(parsed)
  const montoUSD = parseUSDFromMonto(monto)
  const ethUsd = await getEthSpotUSD()
  const montoETH = montoUSD != null && ethUsd ? montoUSD / ethUsd : null
  const montoEthStr = montoETH != null ? montoETH.toFixed(18) : null
  const wei = montoEthStr ? parseEther(montoEthStr) : null

  const targetAddr = extractEthAddress(motivo)

  console.log('--- NEW EMAIL -------------------------------------------------')
  console.log('From     :', fromText)
  console.log('To       :', to)
  if (cc) console.log('Cc       :', cc)
  console.log('Subject  :', subjectRaw)
  if (monto) console.log('Monto    :', monto)
  if (montoUSD != null) console.log('MontoUSD :', montoUSD.toFixed(2))
  if (ethUsd) console.log('ETH/USD  :', ethUsd)
  if (montoEthStr) console.log('MontoETH :', montoEthStr)
  if (motivo) console.log('Motivo   :', motivo)
  if (targetAddr) console.log('Target   :', targetAddr)
  console.log('Sender   :', await wallet.getAddress())
  console.log('---------------------------------------------------------------')

  if (wei && targetAddr) {
    await maybePayoutETH(targetAddr, wei)
  } else {
    console.warn('⛔ Missing amount or target address; payout skipped.')
  }
}

let lastUid = 0 // highest UID we've processed

async function seedFromUnseen() {
  const mailbox = await client.mailboxOpen('INBOX')
  console.log(`📬 INBOX opened. Total messages: ${mailbox.exists}`)
  console.log('🔎 Scanning for unseen messages…')
  let count = 0
  for await (const msg of client.fetch(
    { seen: false },
    { uid: true, source: true }
  )) {
    count++
    const parsed = await simpleParser(msg.source)
    await onNewEmail(parsed)
    if (msg.uid > lastUid) lastUid = msg.uid
  }
  if (count === 0) console.log('✅ No unseen messages.')
  const baseline = client.mailbox?.uidNext ? client.mailbox.uidNext - 1 : 0
  if (baseline > lastUid) lastUid = baseline
  console.log(`🧭 Baseline lastUid: ${lastUid}`)
}

client.on('exists', async () => {
  const lock = await client.getMailboxLock('INBOX')
  try {
    const start = Math.max(lastUid + 1, 1)
    let newCount = 0
    for await (const msg of client.fetch(
      { uid: `${start}:*` },
      { uid: true, source: true }
    )) {
      newCount++
      const parsed = await simpleParser(msg.source)
      await onNewEmail(parsed)
      if (msg.uid > lastUid) lastUid = msg.uid
    }
    if (newCount === 0) {
      const baseline = client.mailbox?.uidNext
        ? client.mailbox.uidNext - 1
        : lastUid
      if (baseline > lastUid) lastUid = baseline
    }
  } catch (e) {
    console.error('Listener error:', e?.responseText || e?.message || e)
  } finally {
    try {
      lock.release()
    } catch {}
  }
})

client.on('close', async () => {
  console.warn('⚠️  Connection closed. Reconnecting…')
  try {
    await client.connect()
    await client.mailboxOpen('INBOX')
    console.log('🔄 Reconnected. Resuming IDLE…')
  } catch (e) {
    console.error('Reconnect failed:', e?.message || e)
  }
})

client.on('error', (err) => {
  console.error('IMAP error:', err?.responseText || err?.message || err)
})
;(async () => {
  try {
    console.log(`Connecting to ${host}…`)
    await client.connect()
    console.log(`✅ Connected & authenticated as ${user}`)
    const sender = await wallet.getAddress()
    console.log(`👛 Sender: ${sender}`)
    console.log(`🔗 RPC: ${RPC_URL}`)

    await seedFromUnseen()
    console.log('🟢 Live listening with IDLE… (Ctrl+C to exit)')
  } catch (err) {
    console.error(
      '❌ Failed:',
      err?.responseText || err?.code || err?.message || err
    )
    process.exit(1)
  }
})()
