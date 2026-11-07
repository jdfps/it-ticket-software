# Security and category update

## Changes
- Existing queries use SQLAlchemy ORM filters rather than SQL string concatenation; this is the right approach for SQL injection prevention.
- Ticket title, description, and comment inputs now have backend maximum lengths and reject whitespace-only content.
- "Other" categories require a separate short description, saved to `tickets.other_category`; all other categories reject that field.
- Database connection errors no longer expose internal exception details in the `/` API response.
- Database connection URLs now safely handle special characters in passwords.

## Before running
For **existing databases**, back up TMS and run `backend/migrate_other_category.sql` **once**. Do **not** rerun `backend/schema.sql` on existing data: it drops and recreates TMS. Fresh installations can use the updated `backend/schema.sql`.

## IMPORTANT: Not yet safe for public deployment
This project currently has **no authenticated API sessions or server-side role authorization**. Anybody who can reach the API can impersonate another user by sending their ID, change any user's password, and call admin ticket approval and account creation endpoints. The 5-minute frontend timeout is not a security control. **Do not expose the backend to the public Internet until this is fixed.** Implement signed sessions (secure HTTP-only cookies), current-user dependency, role and ticket ownership permissions, and a password-change flow that verifies the temporary/current password. Add rate limits to login and user creation, strict production CORS, HTTPS, production secrets and limited DB privileges. Do not treat SQL input validation as a substitute for authentication/authorization.

Frontend uses JSX text rendering (React escapes strings); never change it to raw HTML rendering for ticket descriptions/comments.
