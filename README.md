# Oshin Cafe Demo

This project is a React + Vite demo for a cafe customer and staff experience.

## Local development

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Then open the app in your browser:

- `http://localhost:8443/`
- `http://<your-laptop-ip>:8443/`

Customer demo:

- `http://<your-laptop-ip>:8443/?app=customer`

Staff demo:

- `http://<your-laptop-ip>:8443/?app=cafe`

## Build for production

```bash
npm run build
```

## GitHub and Vercel deployment

1. Create a new GitHub repository.
2. Add the GitHub remote:

```bash
git remote add origin https://github.com/<your-username>/<repo>.git
```

3. Rename the branch to `main`:

```bash
git branch -M main
```

4. Push to GitHub:

```bash
git push -u origin main
```

5. On Vercel, import the GitHub repository and use these settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Notes

- This repository is a web-only demo; the Android folder is included for reference but not required for Vercel.
- If you want, you can also deploy the app directly from the `main` branch on Vercel.
