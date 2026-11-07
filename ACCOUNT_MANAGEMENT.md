# Account management and administrator password resets

In the admin dashboard, select **Accounts** to search all accounts by name, login email, or role.

For a user who can't log in:
1. Admin selects **Reset password** for that user and confirms.
2. The backend generates a new random temporary password. Admin must copy it immediately and deliver it to the user through a trusted private channel. The password is returned only in that reset response, never stored in plaintext or exposed through account lists.
3. The user's existing password stops working and their existing signed login tokens are invalidated by the changed password hash.
4. The user signs in with their existing email and the newly issued temporary password.
5. The application requires the user to enter their first and last name as recorded on the account, then select a new password before they can access the dashboard.

**Important:** First/last name is a confirmation check and is not identity proof; possession of the temporary password is required. An administrator should independently verify the user's identity before sending the password. Use HTTPS for any publicly hosted environment.

Existing MySQL schema already contains `must_change_password`; **no database migration is necessary**. The backend requires a logged-in administrator for the reset API `POST /users/{user_id}/reset-password`. It doesn't allow an admin to reset their own password this way. Do not commit `.env` secrets to GitHub.

The account's login username is its email address; there is no separate username field. A reset does not delete tickets or the account.
