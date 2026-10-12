const DEFAULT_REGISTRATION_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz1-qpuklkJwq9yZDuxBVcksOaa6yFNfB8YM4kFTNXTpTCAUP5Pg2W6cxdc7r0r3obu/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const phone = String(req.body?.phone || '').replace(/\D/g, '');
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Enter a valid 10-digit phone number.' });
  }

  const endpoint = process.env.REGISTRATION_API_URL || DEFAULT_REGISTRATION_ENDPOINT;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams({ formType: 'login', phone }).toString()
    });
    const result = await response.json();

    if (!response.ok) {
      return res.status(502).json({ error: 'The registration service could not verify your number.' });
    }
    if (result.result !== 'success' || !result.user) {
      return res.status(401).json({ error: result.error || 'No registration found for that phone number.' });
    }

    return res.status(200).json({ ok: true, user: result.user });
  } catch (error) {
    console.error('Student login API error:', error);
    return res.status(502).json({ error: 'Could not reach the registration service. Please try again.' });
  }
}