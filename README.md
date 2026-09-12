# JV Drilling Push Server

Serverless Push endpoint for JV Drilling Field Tools on Vercel.

## Environment variables

Set these in Vercel Project Settings → Environment Variables:

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `JV_PUSH_TEST_TOKEN`

The private key must never be committed to GitHub.

## Endpoint

POST `/api/push`

JSON body:

```json
{
  "subscription": { "endpoint": "...", "keys": { "p256dh": "...", "auth": "..." } },
  "title": "JV Drilling Field Tools",
  "message": "Prueba de notificación Push funcionando."
}
```
