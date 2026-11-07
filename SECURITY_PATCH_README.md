# Authentication and Authorization Fix (before cloud deployment)

This patch secures FastAPI endpoints rather than depending on React to restrict access.

## Changes
- `/auth/login` issues a signed, expiring bearer token (12-hour maximum lifetime).
- Every protected endpoint verifies that token and looks up the current user in MySQL.
- Admin-only: create users, approve/reject tickets, list any pending tickets.
- Employee-only: create tickets; the authenticated employee is checked against the submitted `user_id` and sees only their tickets.
- Technician-only: claim/resolve tickets; the authenticated technician must match `tech_id` and may not view pending/rejected tickets.
- Comments cannot be impersonated (`author_id` must match authenticated user), and ticket access rules apply.
- Users can only change their own password. Changing it invalidates previously issued tokens; the frontend receives a replacement token.
- Users with a temporary password cannot access ticket/user APIs before changing that password.
- The frontend includes the token on API requests, checks `/auth/me` after refresh, and clears stale login state on HTTP 401.

## Local setup / migration
1. Keep your existing database. **No schema migration is required by this patch.**
2. Add `AUTH_SECRET_KEY` to your existing `backend/.env`: use a distinct, unpredictable 32+ character string (e.g. create one with `python -c "import secrets; print(secrets.token_urlsafe(48))"`). Never commit your actual `.env`.
3. Keep `INITIAL_SETUP_KEY` for the one-time first admin setup on a clean database, if not initialized already. It must be **different** from `AUTH_SECRET_KEY`.
4. In `backend`, install updated Python dependencies: `python -m pip install -r requirements.txt`.
5. Start FastAPI as before. In `frontend`, run `npm install` then `npm run dev`.
6. All existing user accounts can continue logging in normally. The frontend and backend must be updated together because authenticated API calls now require a token.

## Notes before a *public/real customer* deployment
- This is a classroom-level hardening patch, not a third-party security audit. Add distributed login rate limiting, monitoring, backups, HTTPS, DB TLS, strict deployment configuration and automated integration tests with real MySQL before putting real customer data on the internet.
- Tokens are stored in browser `sessionStorage`, with a five-minute frontend inactivity logout. Browser logout removes the token locally; server-side token revocation currently occurs when the password is changed or the token expires. A server-side session table would allow immediate logout/revocation across clients.
- For Render later, set `AUTH_SECRET_KEY` and database settings on the service (not GitHub). Set `FRONTEND_ORIGINS` to the exact deployed frontend URL and `VITE_API_BASE_URL` to the backend HTTPS URL.
