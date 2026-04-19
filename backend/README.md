# Safi Loans Django Backend

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and set your Supabase Postgres credentials.
4. Ensure your Supabase project is active and reachable.
5. Run migrations:
   - `python manage.py migrate`
6. Start server:
   - `python manage.py runserver`

## Database

The backend uses Supabase Postgres via Django's PostgreSQL backend. Configure the pooler values in `.env`:

- `DB_ENGINE=django.db.backends.postgresql`
- `DB_HOST=<your Supabase pooler host>`
- `DB_PORT=6543`
- `DB_NAME=postgres`
- `DB_USER=<your Supabase pooler user>`
- `DB_PASSWORD=<your Supabase password>`
- `DB_SSLMODE=require`

`DB_CONN_MAX_AGE=0` keeps Django from holding long-lived connections against the Supabase pooler.
`DB_CONNECT_TIMEOUT=10` keeps remote connection failures from hanging local commands.

## Email confirmations

After a successful loan application, the backend sends a branded confirmation email to the applicant.
For local testing, `DJANGO_EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend` prints the email in the server console.
For real delivery, set `DJANGO_EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend` and provide `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, and `DEFAULT_FROM_EMAIL` in `.env`.

## API Endpoints

- `GET /api/health/`
- `GET /api/applications/`
- `POST /api/applications/` (accepts manual till-payment `paymentReceipt` transaction code and `idDocument` PDF)
- `GET /api/dashboard/metrics/`
- `POST /api/admin/login/`
- `GET /api/admin/profile/`
- `PUT /api/admin/profile/`
