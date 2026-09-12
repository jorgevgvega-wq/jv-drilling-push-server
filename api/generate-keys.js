const webpush = require("web-push");

module.exports = (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keys = webpush.generateVAPIDKeys();

  return res.status(200).json({
    publicKey: keys.publicKey,
    privateKey: keys.privateKey
  });
};
