import type { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).send('Missing url parameter');
  }

  try {
    // 🔹 SSL Bypass
    const agent = new https.Agent({ rejectUnauthorized: false });

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      },
      // @ts-ignore
      agent,
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');

    const arrayBuffer = await response.arrayBuffer();
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (error) {
    return res.status(500).send('Error streaming video');
  }
}

