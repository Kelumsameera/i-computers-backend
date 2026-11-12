# i-Computers – Backend

Node.js / Express API for the i-Computers web application, with MongoDB (Mongoose), authentication, products, orders, reviews and site settings.

> **Security warning:** Route-level admin guards were introduced for key management endpoints, and public registration no longer accepts privileged roles. This is not a complete authentication or authorization audit; do not deploy publicly without integration testing.

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

Product create/update/delete, order list/status management, moderation, settings updates and user administration now have route-level admin guards. The signed JWT currently uses `email` and `role` claims; test all customer/admin workflows and audit other routes for missing permissions.

## Required security work

1. Integration-test admin guards, signed JWT handling and role-restricted registration.
2. Audit Google-login account creation and any remaining privilege escalation paths.
3. Validate payloads, restrict CORS, and rate-limit login and OTP flows.
4. Review every sensitive response for private user data, even though the admin user list now excludes password hashes.
5. Review OTP expiry, usage limits and account takeover protections.
6. Add integration tests for guest, customer and admin access before production deployment.

## Related application

[Frontend](https://github.com/Kelumsameera/i-computers-frontend)

## Current status

Documentation only. No runtime test, deployment validation or security certification has been performed.
