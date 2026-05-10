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
    const payload = {
      from: 'onboarding@resend.dev',
      to: ['joltenfreiter@gmail.com'],
      reply_to: em,
      subject: `[Pure Excellence] ${su}`,
      html: `<p><strong>Van:</strong> ${fn} ${ln} (${em})</p><p><strong>Bedrijf:</strong> ${co || 'niet opgegeven'}</p><p><strong>Onderwerp:</strong> ${su}</p><p><strong>Bericht:</strong><br>${ms}</p>`
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

    // Geef altijd de volledige Resend response terug voor debugging
    return res.status(200).json({ 
      resendStatus: response.status, 
      resendData: data,
      success: response.ok
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
