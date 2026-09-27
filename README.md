# Ineza Enterprise

Responsive company website for Ineza Enterprise, a Kigali-based travel, car rental, tours, and event catering business.

## Run locally

```sh
npm install
npm run dev
```

Production checks:

```sh
npm run build
npm run lint
```

## Publish on GitHub Pages

The `main` branch workflow builds and deploys the site to GitHub Pages. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The project-site URL will be `https://nyirishema.github.io/inezaenterprise/`.

## Pages

- `/` company overview and service highlights
- `/about` company scope, values, and quality objectives
- `/services` rental options and catering details
- `/contact` contact channels and enquiry form

The contact page uses Ineza Enterprise's supplied phone number, email addresses, and Kigali location. The enquiry form opens the visitor's mail app with the enquiry addressed to all three listed email addresses. A server-side form service can be connected if direct website submission is needed.