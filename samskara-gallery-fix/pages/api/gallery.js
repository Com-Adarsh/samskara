const DEFAULT_GALLERY_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxzj7vxNbt3Kn6ET1Q_ik_8dS7skjBI_I2iK03W_nvO5_VGxhQDVdEa-tm6G4OSxy2D/exec';

export default async function handler(req, res) {
  const endpoint = process.env.GALLERY_API_URL || DEFAULT_GALLERY_ENDPOINT;
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const options = req.method === 'POST'
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: new URLSearchParams({ formType: 'creative', ...req.body }).toString()
        }
      : { method: 'GET' };

    const response = await fetch(endpoint, options);
    const payload = await response.json();
    if (!response.ok) return res.status(502).json({ error: 'Gallery service request failed.' });
    if (req.method === 'GET' && !Array.isArray(payload)) {
      return res.status(502).json({ error: payload.error || 'Gallery service did not return a list.' });
    }
    if (req.method === 'POST' && payload.result !== 'success' && payload.ok !== true) {
      return res.status(502).json({ error: payload.error || 'The gallery service did not save the upload.' });
    }

    return res.status(200).json(req.method === 'POST' ? { ok: true } : payload);
  } catch (error) {
    console.error('Gallery API error:', error);
    return res.status(502).json({ error: 'Could not reach the gallery service.' });
  }
}
