# First-time setup for a new company

This project supports **one company per deployment/database**. Separate companies require separate deployed instances and MySQL databases. It is not a multi-tenant SaaS platform.

## New installation

1. Create the MySQL `TMS` database and run `backend/schema.sql` **only for a completely new, empty database**. Never run `schema.sql` against an existing installation: it starts with `DROP DATABASE`.
2. Configure the backend `.env` (local) or backend environment variables (Render) with `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_NAME` as usual.
3. Generate a high-entropy setup key. Example: `python -c "import secrets; print(secrets.token_urlsafe(32))"`. Save the output privately.
4. Add `INITIAL_SETUP_KEY` with that output to the **backend** environment variables. Do not put this value into a Vite variable or commit it to Git.
5. Start FastAPI and the frontend. Visit the frontend URL. If no users exist and setup was never completed, you will see the setup screen instead of login.
6. Enter the first admin's name, email, a strong password (12+ characters), and the setup key. After successful creation, you are redirected to the normal login page. Sign in with the admin credentials, then use the admin dashboard to add staff.
7. Remove `INITIAL_SETUP_KEY` from your hosting environment after setup; the setup route is locked by the database marker and cannot be reused.

## Existing installation

No current users are removed or modified. The app creates the `installation_state` table automatically if needed. Existing user accounts cause the setup route to refuse requests. You can optionally run `backend/migrate_initial_setup.sql` yourself. **Do not run `backend/schema.sql` on an existing database.**

## Safety notes

- The key must be **at least 24 characters** and must remain secret. Do not use an example string from documentation as a real setup key.
- The setup state is recorded in MySQL, so restarting or redeploying does not reopen setup. The backend uses a database row lock to serialize competing setup requests.
- The setup status endpoint reports whether setup is required and whether the key is configured; it never returns the key.
- A database restore to a pre-setup state can reopen installation; protect your backups and rotate setup keys.
- **Existing API authentication/authorization is still incomplete** in this version (e.g. regular user creation and ticket actions do not check a server-issued session). Do not expose the current project publicly until those endpoints are secured. The initial setup key protects only `/setup/initialize`.
