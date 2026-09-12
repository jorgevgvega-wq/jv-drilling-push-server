const webpush = require('web-push');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://jorgevgvega-wq.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-JV-Push-Token');
}

module.exports = async (req, res) => {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, JV_PUSH_TEST_TOKEN } = process.env;

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return res.status(500).json({ ok: false, error: 'VAPID keys are not configured' });
  }

  if (JV_PUSH_TEST_TOKEN && req.headers['x-jv-push-token'] !== JV_PUSH_TEST_TOKEN) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const subscription = body && body.subscription;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ ok: false, error: 'Missing push subscription' });
    }

    webpush.setVapidDetails(
      'mailto:jv-drilling-notifications@users.noreply.github.com',
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );

    const payload = JSON.stringify({
      title: body.title || 'JV Drilling Field Tools',
      body: body.message || '🔧 Prueba de notificación Push funcionando.',
      icon: 'https://jorgevgvega-wq.github.io/motor-yield/icon-192.png',
      badge: 'https://jorgevgvega-wq.github.io/motor-yield/icon-192.png',
      url: 'https://jorgevgvega-wq.github.io/motor-yield/'
    });

    await webpush.sendNotification(subscription, payload);

    return res.status(200).json({ ok: true, message: 'Push sent' });
  } catch (error) {
    console.error('Push error:', error);
    return res.status(error.statusCode || 500).json({
      ok: false,
      error: error.body || error.message || 'Push failed'
    });
  }
};
