// index.js — step 3: add live listener (IDLE) with burst-safe range fetching
// Run: node index.js

import 'dotenv/config'
import { ImapFlow } from 'imapflow'

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
const pass = required('IMAP_PASS').replace(/\s+/g, '').trim() // strip spaces just in case

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

let lastUid = 0 // highest UID we've processed

async function seedFromUnseen() {
  const mailbox = await client.mailboxOpen('INBOX')
  console.log(`📬 INBOX opened. Total messages: ${mailbox.exists}`)

  console.log('🔎 Scanning for unseen messages…')
  let count = 0
  for await (const msg of client.fetch(
    { seen: false },
    { uid: true, envelope: true }
  )) {
    count++
    const env = msg.envelope || {}
    const subject = env.subject || '(no subject)'
    const from = addrListToText(env.from)
    const to = addrListToText(env.to)
    console.log(`[UID ${msg.uid}] ${subject} — from: ${from} — to: ${to}`)
    if (msg.uid > lastUid) lastUid = msg.uid
  }
  if (count === 0) console.log('✅ No unseen messages.')

  // Baseline to current last existing message (uidNext - 1)
  const baseline = client.mailbox?.uidNext ? client.mailbox.uidNext - 1 : 0
  if (baseline > lastUid) lastUid = baseline
  console.log(`🧭 Baseline lastUid: ${lastUid}`)
}

client.on('exists', async () => {
  // New message count changed → fetch everything after lastUid
  const lock = await client.getMailboxLock('INBOX')
  try {
    const start = Math.max(lastUid + 1, 1)
    let newCount = 0
    for await (const msg of client.fetch(
      { uid: `${start}:*` },
      { uid: true, envelope: true }
    )) {
      newCount++
      const env = msg.envelope || {}
      const subject = env.subject || '(no subject)'
      const from = addrListToText(env.from)
      const to = addrListToText(env.to)
      console.log(`🆕 [UID ${msg.uid}] ${subject} — from: ${from} — to: ${to}`)
      if (msg.uid > lastUid) lastUid = msg.uid
    }

    if (newCount === 0) {
      // Sometimes EXISTS fires for flag changes; advance baseline safely
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
    // Keep process alive; ImapFlow maintains IDLE after mailboxOpen
  } catch (err) {
    console.error(
      '❌ Failed:',
      err?.responseText || err?.code || err?.message || err
    )
    process.exit(1)
  }
})()
