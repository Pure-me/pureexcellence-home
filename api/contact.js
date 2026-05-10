// Pure Excellence — Contact API v1.1
// Vercel serverless function via Resend

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fn, ln, em, co, su, ms } = req.body;

  if (!fn || !ln || !em || !su || !ms) {
    return res.status(400).json({ error: 'Verplichte velden ontbreken' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(em)) {
    return res.status(400).json({ error: 'Ongeldig e-mailadres' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY niet gevonden');
    return res.status(500).json({ error: 'Configuratiefout' });
  }

  try {
    const payload = {
      // Tijdelijk via onboarding@resend.dev zolang domein nog niet geverifieerd is
      from: 'Pure Excellence <onboarding@resend.dev>',
      to: ['joltenfreiter@gmail.com'],
      reply_to: em,
      subject: `[Pure Excellence] ${su}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #344057; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #FDFAF6; font-size: 20px; margin: 0;">
              Pure <span style="color: #C05A2D;">Excellence</span>
            </h1>
            <p style="color: rgba(253,250,246,0.6); margin: 4px 0 0; font-size: 13px;">Nieuw contactverzoek via pureexcellence.be</p>
          </div>
          <div style="background: #F7F4EF; padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #5E6470; font-size: 13px; width: 120px;">Naam</td>
                <td style="padding: 8px 0; color: #2B3240; font-weight: 500;">${fn} ${ln}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #5E6470; font-size: 13px;">E-mail</td>
                <td style="padding: 8px 0;"><a href="mailto:${em}" style="color: #C05A2D;">${em}</a></td>
              </tr>
              ${co ? `<tr><td style="padding: 8px 0; color: #5E6470; font-size: 13px;">Bedrijf</td><td style="padding: 8px 0; color: #2B3240;">${co}</td></tr>` : ''}
              <tr>
                <td style="padding: 8px 0; color: #5E6470; font-size: 13px;">Onderwerp</td>
                <td style="padding: 8px 0; color: #2B3240;">${su}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 20px; background: white; border-radius: 6px; border-left: 3px solid #C05A2D;">
              <p style="color: #5E6470; font-size: 13px; margin: 0 0 8px;">Bericht</p>
              <p style="color: #2B3240; line-height: 1.7; margin: 0; white-space: pre-wrap;">${ms}</p>
            </div>
            <p style="margin-top: 16px; font-size: 12px; color: #5E6470;">
              Reageer rechtstreeks op dit bericht om <a href="mailto:${em}" style="color: #C05A2D;">${em}</a> te contacteren.
            </p>
          </div>
          <div style="background: #2B3240; padding: 16px 32px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: rgba(253,250,246,0.4); font-size: 12px; margin: 0;">
              Pure Excellence · BE 0690.589.421 · pureexcellence.be
            </p>
          </div>
        </div>
      `
    };

    console.log('Sending to Resend...', { to: payload.to, subject: payload.subject });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Resend response:', response.status, data);

    if (!response.ok) {
      return res.status(500).json({ error: 'E-mail kon niet worden verzonden', detail: data });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server fout', detail: err.message });
  }
}
