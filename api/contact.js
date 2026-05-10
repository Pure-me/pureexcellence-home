// Pure Excellence — Contact API
// Vercel serverless function — stuurt e-mail via Resend

export default async function handler(req, res) {
  // Alleen POST toestaan
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fn, ln, em, co, su, ms } = req.body;

  // Validatie
  if (!fn || !ln || !em || !su || !ms) {
    return res.status(400).json({ error: 'Verplichte velden ontbreken' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(em)) {
    return res.status(400).json({ error: 'Ongeldig e-mailadres' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Pure Excellence <noreply@pureexcellence.be>',
        to: ['info@pureexcellence.be'],
        reply_to: em,
        subject: `${su} — Pure Excellence`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #344057; padding: 24px 32px;">
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
            </div>
            <div style="background: #2B3240; padding: 16px 32px; text-align: center;">
              <p style="color: rgba(253,250,246,0.4); font-size: 12px; margin: 0;">
                Pure Excellence · BE 0690.589.421 · pureexcellence.be
              </p>
            </div>
          </div>
        `
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'E-mail kon niet worden verzonden' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server fout' });
  }
}
