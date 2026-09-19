# Metta Denture Clinic Website

Static site for Metta Denture Clinic (Steveston, Richmond & New Westminster, BC). Plain HTML/CSS/JS — no build step, no framework.

## Preview locally

This repo includes a tiny local server for previewing the site on Windows (needs no installs — it uses PowerShell's built-in `System.Net.HttpListener`):

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open http://localhost:8080 in your browser. Press Ctrl+C to stop it.

## Contact form

The "Send us a note" form on [contact.html](contact.html) submits to [FormSubmit.co](https://formsubmit.co), a free service that emails submissions straight to **mettadentures@gmail.com** — no backend or account required.

**One-time setup:** the very first time someone submits the form after it goes live, FormSubmit sends a confirmation email to mettadentures@gmail.com. Someone needs to open that email and click **"Confirm my email now"** — until that happens, submissions won't be delivered (the sender won't see an error; the message just won't arrive). After that one confirmation, every future submission goes straight to the inbox.

To change the destination email, or the redirect page after sending, edit the hidden fields at the top of the `<form>` in `contact.html`:

```html
<form ... action="https://formsubmit.co/mettadentures@gmail.com" method="POST">
  <input type="hidden" name="_subject" value="...">   <!-- email subject line -->
  <input type="hidden" name="_next" value="thank-you.html">  <!-- redirect after sending -->
```

If FormSubmit ever needs to be swapped out (e.g. for more spam filtering or submission limits), [Formspree](https://formspree.io) is a solid free alternative — same idea, just requires a quick sign-up to get a form endpoint URL.

## Deploying to GitHub Pages (free)

1. Create a new repository on [github.com/new](https://github.com/new) — any name (e.g. `metta-website`), public, no README/gitignore (this folder already has them).
2. From this folder, push the code:
   ```
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub, go to the repo's **Settings → Pages**, and under "Build and deployment" set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**. Save.
4. GitHub gives you a live URL after a minute or two, usually `https://<your-username>.github.io/<repo-name>/`.

### Using your real domain (mettadentures.com)

Once the GitHub Pages site is live, you can point your existing domain at it instead of using the github.io address:

1. In the repo, add a file named `CNAME` (no extension) containing just `mettadentures.com`, and add the same domain in **Settings → Pages → Custom domain**.
2. At your domain registrar, add these DNS records for `mettadentures.com`:
   - Four `A` records pointing to GitHub's IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A `CNAME` record for `www` pointing to `<your-username>.github.io`
3. DNS changes can take a few hours to propagate. Once they do, check "Enforce HTTPS" in the Pages settings.

## Project structure

- `index.html`, `about.html`, `services.html`, `faq.html`, `contact.html`, `thank-you.html` — pages
- `css/style.css` — all styling
- `js/main.js` — mobile nav, accordions, scroll reveals, contact form
- `images/` — logo, favicon, and photos/illustrations. Files named `placeholder-*.svg` are stand-ins for real photos (team portraits, clinic interior) — swap them out whenever you have real photos, keeping the same filenames so the pages don't need editing.
