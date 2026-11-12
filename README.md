# i-Computers – Backend

Node.js / Express API for the i-Computers web application, with MongoDB (Mongoose), authentication, products, orders, reviews and site settings.

> **Security warning:** Several admin or write endpoints are mounted without route-level role middleware. Do not expose this API to the public internet unchanged. Authentication and authorization must be enforced server-side, independently of the frontend.

## Stack

Node.js 20, Express 4, MongoDB / Mongoose 8, JSON Web Tokens, bcrypt, Nodemailer.

## Local setup

```bash
npm install
cp .env.example .env
# Edit .env with your own MongoDB URL and JWT secret
npm run dev
```

The current server listens on port `3000`. The `start` script is `node index.js`.

## Main API groups

| Prefix | Purpose |
| --- | --- |
| `/api/users` | Login, registration, profile, OTP and user administration |
| `/api/products` | Product listing and management |
| `/api/orders` | Checkout and order management |
| `/api/reviews` | Reviews and moderation |
| `/api/settings` | Site settings |

Some endpoints are intended only for administrators, **but the current router does not consistently enforce admin roles**. For example product create/update/delete, order status updates, site settings and user management require authorization hardening.

## Required security work

1. Add explicit authenticated-user and admin-role middleware to sensitive routes.
2. Audit registration and Google-login account creation to prevent role escalation.
3. Validate payloads, restrict CORS, and rate-limit login and OTP flows.
4. Avoid exposing password hashes or other private user data in JSON responses.
5. Review OTP expiry, usage limits and account takeover protections.
6. Add integration tests for guest, customer and admin access before production deployment.

## Related application

[Frontend](https://github.com/Kelumsameera/i-computers-frontend)

## Current status

Documentation only. No runtime test, deployment validation or security certification has been performed.
