// index.js — step 4.1: filter by subject prefix "!Recibiste" and log matching emails
// Run: node index.js

import 'dotenv/config'
import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'

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

// 🔥 Your action hook: only logs when subject starts with "!Recibiste"
async function onNewEmail(parsed) {
  const from = parsed.from?.text || ''
  const to = parsed.to?.text || ''
  const cc = parsed.cc?.text || ''
  const subjectRaw = parsed.subject || '(no subject)'
  const subject = subjectRaw.trim()

  // Filter: only act if subject starts with "!Recibiste" (case-insensitive)
  if (!subject.toLowerCase().startsWith('!recibiste')) {
    return // ignore non-matching emails
  }

  const attachments = (parsed.attachments || [])
    .map((a) => a.filename)
    .filter(Boolean)

  console.log('--- NEW EMAIL -------------------------------------------------')
  console.log('From   :', from)
  console.log('To     :', to)
  if (cc) console.log('Cc     :', cc)
  console.log('Subject:', subject)
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
  // New message count changed → fetch everything after lastUid
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
