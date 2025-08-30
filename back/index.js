// index.js — step 4.3: add From filter (notificaciones@deunaapp.com) + Monto/Motivo extraction
// Run: npm i mailparser imapflow cheerio dotenv
//      node index.js

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

  console.log('--- NEW EMAIL -------------------------------------------------')
  console.log('From   :', fromText)
  console.log('To     :', to)
  if (cc) console.log('Cc     :', cc)
  console.log('Subject:', subjectRaw)
  if (monto) console.log('Monto  :', monto)
  if (motivo) console.log('Motivo :', motivo)
  if (attachments.length) console.log('Files  :', attachments.join(', '))
  console.log('Msg-ID :', parsed.messageId)
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
