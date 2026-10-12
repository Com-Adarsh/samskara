export const config = {
  api: { bodyParser: { sizeLimit: '12mb' } }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Image storage is not configured on the server.' });

  const image = req.body?.image;
  if (typeof image !== 'string' || !image || image.length > 11_200_000) {
    return res.status(400).json({ error: 'Choose an image smaller than 8 MB.' });
  }

  try {
    const payload = new URLSearchParams({ image });
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data?.url) {
      return res.status(502).json({ error: result.error?.message || 'Image storage rejected the upload.' });
    }
    return res.status(200).json({ url: result.data.url });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(502).json({ error: 'Could not reach image storage.' });
  }
}
