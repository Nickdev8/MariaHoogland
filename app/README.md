# Maria Hoogland Architect Portfolio

A professional, responsive portfolio site for Maria Hoogland with a built-in admin dashboard and a JSON-based content system.

## What’s in here
- Home / About / Portfolio / Contact content comes from `app/defaults.json`, then gets patched by `storage/overrides.json` at runtime.
- `/admin` lets you edit all copy, galleries, stats, contact details, footer links, and more.
- `/admin/portfolio` manages projects and featured items.
- Image uploads go to `CONTENT_DIR/uploads` and are served via `/uploads/...`.
- Optional ntfy notifications on saves + uploads.
- Canonical URLs + sitemap + robots.

## Running locally
```bash
npm install
npm run dev
```

## Env vars (app/.env)
Copy `app/.env.example` to `app/.env` and adjust:
- `ADMIN_PASSWORD` – admin password (default is `mariahoogland`).
- `CONTENT_DIR` / `CONTENT_FILE` – where `overrides.json` lives.
- `CONTENT_UPLOADS_DIR` or `UPLOADS_DIR` – where uploads are stored.
- `SMTP_*`, `EMAIL_FROM`, `EMAIL_TO` – contact form email delivery.
- `PUBLIC_SITE_URL` (or `SITE_URL` / `BASE_URL`) – used for canonical URLs and sitemap.
- `NTFY_*` – optional notifications.

## Content storage
- Defaults: `app/defaults.json`
- Overrides: `storage/overrides.json`
- Uploads: `storage/uploads`

## Docker
Build + run with Docker:
```bash
docker compose up --build
```

The container mounts `./storage` into `/app/storage`, so uploads and overrides survive restarts.

## Admin
Visit `/admin` to edit general content and `/admin/portfolio` for projects. Changes are written to `storage/overrides.json`.
