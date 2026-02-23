25th birthday Mithi gifts

## Dev

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```powershell
npm run build
npm run start
```

## Email sending (EmailJS)

The submit button calls `POST /api/submit`, which sends an email via EmailJS.

- In EmailJS, create an **Email Template** and copy its **Template ID**.
- Copy `.env.example` → `.env.local` and fill in the `EMAILJS_*` + `EMAIL_TO` + `EMAIL_FROM_LABEL` vars.
- In EmailJS, ensure your template includes: `to_email`, `from_label`, `subject`, `wishlist_lines`, `wishes`.

## Audio gift

The audio gift page is at `http://localhost:3000/song`.

Drop your recording here:

- `public/assets/mithi-song.mp3`

If you use a different filename or format, update the `<source />` in `app/song/page.tsx`.

## Big gift (teaser)

The big gift teaser page is at `http://localhost:3000/big-gift`.

Drop the shoe image here:

- `public/assets/Samba.jpg`
