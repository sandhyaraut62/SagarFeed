# Sagar Feeds — Setup Guide & What Changed

## 1. Database setup

**If this is your first time setting up:**
```bash
mysql -u <user> -p -e "CREATE DATABASE IF NOT EXISTS sagarfeeds"
mysql -u <user> -p sagarfeeds < backend/database/schema.sql
mysql -u <user> -p sagarfeeds < backend/database/seed.sql
```

**If you already ran the schema from the previous delivery**, just run the additive migration
instead of `schema.sql`:
```bash
mysql -u <user> -p sagarfeeds < backend/database/migration_v2.sql
```

Default admin login: `admin@sagarfeeds.com` / `Admin@123` — change this after first login.

## 2. Backend setup

```bash
cd backend
cp .env.example .env   # fill in DB_USER / DB_PASSWORD / JWT_SECRET at minimum
npm install
npm run dev
```

`.env.example` now also documents:
- `FRONTEND_URL` — used to build eSewa redirect links and password-reset links
- `ESEWA_*` — leave blank to use eSewa's own public sandbox/test merchant (safe, no real money
  moves). See section 4 below.
- `SMTP_*` — leave blank during development; password-reset links will be printed to the server
  console and returned in the API response instead of emailed.

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

## 4. The 8 things you asked me to build

### 1. eSewa is now actually wired up (sandbox)
Checkout → eSewa now redirects to eSewa's real payment page using their official ePay v2
integration (HMAC-SHA256 signed request), and verifies the transaction against eSewa's status
API when it redirects back — it isn't just a UI toggle anymore. Out of the box this uses eSewa's
own **published test merchant** (`EPAYTEST`), so you can test the entire flow with **no signup**
using eSewa's test credentials (eSewa ID `9806800001`–`9806800005`, password `Nepal@123`, MPIN
`1122`, OTP `123456` — these are eSewa's own publicly documented UAT test values).
**To go live**, register as an eSewa merchant, then set `ESEWA_ENV=live` and your real
`ESEWA_MERCHANT_CODE` / `ESEWA_SECRET_KEY` in `.env`. Payments start as "pending" and only flip to
"paid" once eSewa confirms — nothing is silently marked paid anymore.

### 2. Admin can now manage the product catalog
New **Products** tab in the Admin dashboard: add new products, edit price/description/stage/
image, hide/show a product from the public site, or delete it — no more editing the database by
hand. Products can use an external image URL, or fall back to the default category photo.

### 3. Customers can cancel their own orders
A **Cancel Order** button now appears on the Farmer's Orders page for any order that hasn't yet
been marked "Out for Delivery." Cancelling automatically restocks the items. (If an order was
already paid via eSewa, cancelling notifies the team that a manual refund is needed — eSewa
refunds require a separate merchant-side request that this app can't trigger automatically.)

### 4. Forgot / reset password
New **"Forgot password?"** link on the login page → enter your email → get a reset link (emailed
via SMTP if you've configured it, otherwise printed to the server console/shown on screen for
easy local testing) → set a new password. Reset links expire after 1 hour and can only be used
once.

### 5. Checkout now uses your saved address book
The backend already supported saved addresses — now the checkout flow actually uses them. If you
have saved addresses, you'll see them as a pick-list at checkout instead of having to retype
everything every time; "+ Use a new address" is still there when you need it.

### 6. In-app order notifications
A notification bell now sits in the header for logged-in users. Whenever a Dealer/Admin updates
an order's status (processing, out for delivery, delivered, cancelled) or an eSewa payment is
confirmed, the customer gets an in-app notification. (This is in-app only, not email/SMS — see
the note below.)

### 7. Terms of Service & Privacy Policy pages
Real pages now exist at `/terms` and `/privacy`, and the registration checkbox links to them
instead of going nowhere.

### 8. Multi-dealer support (basic territory scoping)
Admin can now assign each Dealer account a **service area** (district) from the Dealers tab. If a
Dealer has a service area assigned, their Orders/Deliveries tabs only show orders being delivered
to that district. Dealers with no service area assigned (the default) still see everything, so a
single-dealer setup keeps working exactly as before with zero extra configuration.

## 5. Still-open items (smaller, and genuinely optional)

- **Notifications are in-app only** — no email/SMS is sent when an order status changes (only the
  password-reset flow sends real email, and only if you configure SMTP). Wiring order-status
  emails would reuse the same `utils/mailer.js` helper if you want it later.
- **No CAPTCHA** on login/register — the rate limiter (10 attempts/15 min per IP) covers basic
  abuse, but a real bot-resistant CAPTCHA isn't in place.
- **Product photo upload** is URL-based, not a file-upload widget — Admin pastes an image link
  rather than uploading a file from their computer.
