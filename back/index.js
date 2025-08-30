// index.js — step 2: open INBOX and list unseen subjects (no live listener yet)
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
const pass = required('IMAP_PASS') // strip spaces just in case

const client = new ImapFlow({
  host,
  port: 993,
  secure: true,
  auth: { user, pass },
})

function addrListToText(list) {
  if (!list || !list.length) return ''
  return list
    .map((a) => (a.name ? `${a.name} <${a.address}>` : a.address))
    .filter(Boolean)
    .join(', ')
}

;(async () => {
  try {
    console.log(`Connecting to ${host}…`)
    await client.connect()
    console.log(`✅ Connected & authenticated as ${user}`)

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
    }
    if (count === 0) console.log('✅ No unseen messages.')

    await client.logout()
    console.log('🔌 Disconnected.')
  } catch (err) {
    console.error(
      '❌ Failed:',
      err?.responseText || err?.code || err?.message || err
    )
    if (err?.aggregateErrors) {
      for (const e of err.aggregateErrors) console.error('-', e?.message || e)
    }
    process.exit(1)
  }
})()
