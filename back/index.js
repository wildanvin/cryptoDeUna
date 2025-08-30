// index.js — step 4.5: convert "Monto" to USD number and to ETH using Coinbase price
// Run: npm i mailparser imapflow cheerio dotenv
// Requires Node 18+ (global fetch). If older, install node-fetch and adapt.

import 'dotenv/config'
import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import * as cheerio from 'cheerio'

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

const client = new ImapFlow({
  host,
  port: 993,
  secure: true,
  auth: { user, pass },
  logger: false, // set to console for verbose logs
})

function addrListToText(list) {
  if (!list || !list.length) return ''
  return list
    .map((a) => (a.name ? `${a.name} <${a.address}>` : a.address))
    .filter(Boolean)
    .join(', ')
}

function normalizeWhitespace(s = '') {
  return s.replace(/\s+/g, ' ').trim()
}

function normalizeSubject(s = '') {
  return s.trim().toLowerCase().replace(/^¡/, '!') // handle Spanish opening exclamation
}

function extractMontoMotivo(parsed) {
  let monto = ''
  let motivo = ''

  const html = parsed.html || ''
  const text = parsed.text || ''

  if (html) {
    const $ = cheerio.load(html)
    const pick = (label) => {
      // Find a TD whose text equals the label (case-insensitive), then get value from same row
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
        if (!val) {
          // Fallback: any following TDs
          val = normalizeWhitespace(td.nextAll('td').last().text())
        }
        return val
      }
      return ''
    }
    monto = pick('monto')
    motivo = pick('motivo')
  }

  if ((!monto || !motivo) && text) {
    // Text fallback: scan lines
    const lines = text
      .split(/\r?\n/)
      .map((l) => normalizeWhitespace(l))
      .filter(Boolean)
    for (let i = 0; i < lines.length; i++) {
      const low = lines[i].toLowerCase()
      if (!monto && low.startsWith('monto')) {
        monto =
          normalizeWhitespace(lines[i].replace(/^monto\s*:?/i, '')) ||
          lines[i + 1] ||
          ''
      }
      if (!motivo && low.startsWith('motivo')) {
        motivo =
          normalizeWhitespace(lines[i].replace(/^motivo\s*:?/i, '')) ||
          lines[i + 1] ||
          ''
      }
    }
  }

  return { monto, motivo }
}

function getAddresses(addrObj) {
  const arr = addrObj?.value || []
  return arr.map((x) => (x.address || '').toLowerCase()).filter(Boolean)
}

// Parse Monto string like "$0,50 USD" or "$1,234.56"
function parseUSDFromMonto(monto = '') {
  if (!monto) return null
  let s = monto
    .replace(/\u00a0/g, ' ') // NBSP -> space
    .replace(/\s+/g, ' ') // collapse spaces
    .replace(/usd/gi, '')
    .replace(/us\$/gi, '')
    .replace(/\$/g, '')
    .replace(/\s/g, '')
    .replace(/[^0-9,.-]/g, '') // keep digits and separators

  if (!s) return null

  const lastComma = s.lastIndexOf(',')
  const lastDot = s.lastIndexOf('.')
  let decimalSep = null
  if (lastComma === -1 && lastDot === -1) decimalSep = null
  else if (lastComma === -1) decimalSep = '.'
  else if (lastDot === -1) decimalSep = ','
  else decimalSep = lastComma > lastDot ? ',' : '.' // last separator wins

  // Build a normalized number: keep digits; keep only the last decimal separator as '.'
  const lastIdx = decimalSep === ',' ? lastComma : lastDot
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch >= '0' && ch <= '9') out += ch
    else if ((ch === ',' || ch === '.') && i === lastIdx) out += '.'
    // ignore other separators (thousands)
  }
  if (!out || out === '.') return null
  const num = Number(out)
  return Number.isFinite(num) ? num : null
}

async function getEthSpotUSD() {
  const url = 'https://api.coinbase.com/v2/prices/ETH-USD/spot'
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 5000)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json' },
    })
    clearTimeout(timer)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const amt = json?.data?.amount
    const n = Number(amt)
    return Number.isFinite(n) ? n : null
  } catch (e) {
    clearTimeout(timer)
    console.error('Price fetch failed:', e?.message || e)
    return null
  }
}

// 🔥 Action hook: log only when (subject starts with !Recibiste/¡Recibiste) AND (From is notificaciones@deunaapp.com)
async function onNewEmail(parsed) {
  const fromText = parsed.from?.text || ''
  const to = parsed.to?.text || ''
  const cc = parsed.cc?.text || ''
  const subjectRaw = parsed.subject || '(no subject)'
  const subjectNorm = normalizeSubject(subjectRaw)

  const fromAddrs = getAddresses(parsed.from)
  const isFromDeUna = fromAddrs.includes('notificaciones@deunaapp.com')

  // Filters
  const subjMatch = subjectNorm.startsWith('!recibiste')
  if (!(subjMatch /*&& isFromDeUna*/)) return

  const attachments = (parsed.attachments || [])
    .map((a) => a.filename)
    .filter(Boolean)

  const { monto, motivo } = extractMontoMotivo(parsed)
  const montoUSD = parseUSDFromMonto(monto)
  const ethUsd = await getEthSpotUSD()
  const montoETH = montoUSD != null && ethUsd ? montoUSD / ethUsd : null

  console.log('--- NEW EMAIL -------------------------------------------------')
  console.log('From     :', fromText)
  console.log('To       :', to)
  if (cc) console.log('Cc       :', cc)
  console.log('Subject  :', subjectRaw)
  if (monto) console.log('Monto    :', monto)
  if (montoUSD != null) console.log('MontoUSD :', montoUSD.toFixed(2))
  if (ethUsd) console.log('ETH/USD  :', ethUsd)
  if (montoETH != null) console.log('MontoETH :', montoETH.toFixed(8))
  if (motivo) console.log('Motivo   :', motivo)
  if (attachments.length) console.log('Files    :', attachments.join(', '))
  console.log('Msg-ID   :', parsed.messageId)
  console.log('---------------------------------------------------------------')
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

  // Baseline to current last existing message (uidNext - 1)
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
