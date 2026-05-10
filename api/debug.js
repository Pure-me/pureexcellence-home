export default async function handler(req, res) {
  const hasKey = !!process.env.RESEND_API_KEY;
  const keyStart = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 8) : 'NIET GEVONDEN';
  return res.status(200).json({ 
    hasKey, 
    keyStart,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}
