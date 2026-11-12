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

## Exposed MongoDB credentials – incident response

GitHub secret-scanning alerts [#1](https://github.com/Kelumsameera/i-computers-backend/security/secret-scanning/1) and [#2](https://github.com/Kelumsameera/i-computers-backend/security/secret-scanning/2) identified previously committed MongoDB Atlas connection strings. The current `index.js` loads `MONGO_URL` from the environment, but removing secrets from the latest commit **does not revoke exposed credentials or erase Git history**.

1. In MongoDB Atlas, disable/delete the exposed database user or rotate its password immediately. Prefer a new least-privilege application account over an administrative database user.
2. Replace `MONGO_URL` in every deployed environment and local `.env`; restart and verify services. Never paste new credentials into issues, PRs or chat.
3. Review Atlas network access restrictions and database activity/audit logs for unexpected access during the exposure window. Treat stored data as potentially compromised until assessed.
4. After revocation, mark the GitHub secret-scanning alerts as revoked/rotated through GitHub's security UI. Do not mark them as false positives merely because the file was removed.
5. If historical Git blobs must also be removed, plan a coordinated history rewrite separately: it changes commit IDs and requires all collaborators/deployments to resync. Revocation comes first.

These actions require the Atlas account administrator. This repository change alone does not rotate credentials or resolve the alerts.
