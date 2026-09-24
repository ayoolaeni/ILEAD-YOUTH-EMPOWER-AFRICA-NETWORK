# iLead Youth Empower Africa Network: website

React (Vite) front end + PHP back end, built for Whogohost / cPanel shared hosting.

```
frontend/     React app (pages, components, styles, content data)
backend/api/  PHP: contact form, newsletter sign-up
scripts/      photo/video optimiser + deploy packager
update/       new photos, videos and PDFs you supplied (source material)
legacy-site/  your previous HTML site, kept as a backup
deploy/       (generated) exactly what you upload
```

## Put the new site live on Whogohost

1. On your computer: `cd frontend`, then `npm run release` (needs Node.js 18+).
2. Open cPanel > File Manager > `public_html`. **Back up / remove the old site files first** (your old copy is also in `legacy-site/`).
3. Upload the **contents** of `deploy/public_html/` into `public_html/` (tip: zip it, upload, then Extract). Make sure the hidden file `.htaccess` comes with it.
4. In cPanel > Email Accounts, create `no-reply@ileadyouthempowerafrica.com.ng` (the address the contact form sends from) and confirm `info@` exists.
5. Test: open the site, send a message from the Contact page, subscribe in the footer.
6. Once SSL is active, open `.htaccess` and un-comment the 3 "force HTTPS" lines.

## Changing content

| To change | Edit |
|---|---|
| Phones, email, address, bank accounts, headline numbers | `frontend/src/data/site.js` |
| Team bios, advisers | `frontend/src/data/team.js` |
| Programmes, objectives, gallery captions, videos | `frontend/src/data/content.js` |
| Who receives contact messages, sender address | `backend/api/config.php` |

After any edit: `cd frontend && npm run release`, then re-upload.

**Adding photos:** add the file to `update/`, add one line to `IMAGES` in `scripts/optimize-media.mjs`, run `npm run media` (makes compressed WebP versions), then list it in `content.js`.

## Working on it locally

```
# terminal 1: PHP API (Windows PowerShell: $env:ILEAD_DEV="1")
ILEAD_DEV=1 php -S localhost:8000 -t backend
# terminal 2: React dev server
cd frontend && npm install && npm run dev      # http://localhost:5173
```
`ILEAD_DEV=1` stops real emails being sent and keeps messages in `backend/api/storage/`.

## Where messages go

* Each message is emailed to the addresses in `notify_to` (`backend/api/config.php`), with the visitor's address as Reply-To.
* A copy is saved in `ilead-data/messages.jsonl` (one folder above `public_html`, so it is not web-accessible). Newsletter sign-ups go to `subscribers.csv` in the same folder.
* Spam protection: hidden honeypot field, minimum fill time, 5 submissions/hour per IP, header-injection filtering.
