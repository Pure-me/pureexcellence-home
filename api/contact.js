export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fn, ln, em, co, su, ms } = req.body;

  if (!fn || !ln || !em || !su || !ms) {
    return res.status(400).json({ error: 'Verplichte velden ontbreken' });
  }

  const apiKey = process.env.RESEND_API_KEY;

  try {
    // Stuur naar joltenfreiter@gmail.com want dat is het Resend account e-mail
    // onboarding@resend.dev werkt alleen naar het geregistreerde account e-mail
    const payload = {
      from: 'onboarding@resend.dev',
      to: ['joltenfreiter@gmail.com'],
      reply_to: em,
      subject: `[Pure Excellence] Nieuw bericht van ${fn} ${ln}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#344057;padding:24px 32px;border-radius:8px 8px 0 0;">
            <h2 style="color:#FDFAF6;margin:0;">Pure <span style="color:#C05A2D;">Excellence</span></h2>
            <p style="color:rgba(253,250,246,0.6);margin:4px 0 0;font-size:13px;">Nieuw contactverzoek via pureexcellence.be</p>
          </div>
          <div style="background:#F7F4EF;padding:32px;">
            <p><strong>Naam:</strong> ${fn} ${ln}</p>
            <p><strong>E-mail:</strong> <a href="mailto:${em}">${em}</a></p>
            <p><strong>Bedrijf:</strong> ${co || 'niet opgegeven'}</p>
            <p><strong>Onderwerp:</strong> ${su}</p>
            <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
            <p><strong>Bericht:</strong></p>
            <p style="white-space:pre-wrap;">${ms}</p>
          </div>
          <div style="background:#2B3240;padding:16px 32px;text-align:center;border-radius:0 0 8px 8px;">
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">Pure Excellence · BE 0690.589.421 · pureexcellence.be</p>
          </div>
        </div>
      `
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Resend response:', response.status, JSON.stringify(data));

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ 
        error: 'E-mail kon niet worden verzonden',
        resendError: data
      });
    }

    return res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message });
  }
}
