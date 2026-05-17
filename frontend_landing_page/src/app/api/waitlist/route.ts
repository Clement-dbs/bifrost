import { NextRequest, NextResponse } from 'next/server'

// Env vars requises (Vercel > Settings > Environment Variables) :
//   RESEND_API_KEY     → resend.com/api-keys
//   WAITLIST_TO_EMAIL  → ton adresse email personnelle
//   RESEND_FROM        → "Bifrost <onboarding@resend.dev>" (tests)
//                        "Bifrost <hello@bifrost.sh>" (prod, après vérification domaine)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ detail: 'Invalid email' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.WAITLIST_TO_EMAIL
    const from = process.env.RESEND_FROM ?? 'onboarding@resend.dev'

    if (!apiKey || !to) {
      console.error('Missing RESEND_API_KEY or WAITLIST_TO_EMAIL')
      return NextResponse.json({ detail: 'Server misconfigured' }, { status: 500 })
    }

    // Notification pour toi
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `🎉 Bifrost waitlist — ${email}`,
        html: `<p><strong>${email}</strong> vient de rejoindre la waitlist.</p><p style="color:#888">${new Date().toUTCString()}</p>`,
      }),
    })

    // Confirmation à l'utilisateur
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "You're on the Bifrost waitlist 🚀",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;">
            <h2 style="color:#6C63FF;margin-top:0;">Welcome to Bifrost 👋</h2>
            <p style="color:#555;line-height:1.7;">
              Thanks for signing up. You're on our early access list —
              we'll reach out as soon as we open the doors.
            </p>
            <p style="color:#aaa;font-size:13px;">— The Bifrost team</p>
          </div>
        `,
      }),
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('[waitlist]', err)
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 })
  }
}
