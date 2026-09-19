# Sagnik Sen · Portfolio

A light, responsive portfolio with a filterable GitHub project gallery, imported outputs, exact Python excerpts, profile statistics, SMART learning plans and accessible Q&A.

## Quick start

Open `index.html` directly, or use Node.js 22+:

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. No package installation or third-party JavaScript is required.

## Project structure

```text
index.html                    Generated, deployable homepage
src/index.html                Page template and editorial content
assets/css/styles.css         Tokens, components and responsive styles
assets/js/main.js             Navigation, search, filters and clipboard
assets/images/                Portrait and imported project charts
assets/icons/                 Local SVG icons and favicon
data/projects.json            Projects, exact code and source revisions
data/github-repositories.json Dated public-repository snapshot
scripts/build.mjs             Offline HTML generation
scripts/sync-github.mjs       Explicit GitHub import/update tool
scripts/check.mjs             Structure, assets and provenance checks
scripts/serve.mjs             Local static preview server
tests/interactions.test.mjs   Interaction regression tests
docs/ARCHITECTURE.md          Maintenance conventions
docs/ATTRIBUTIONS.md          Asset provenance and notices
```

## Edit and verify

Edit the template, stylesheet or project data, then run:

```sh
npm run build
npm run check
npm test
```

Do not edit generated `index.html` directly. Commit it after rebuilding so GitHub Pages can serve the site without a build service.

### Refresh GitHub content

```sh
npm run sync:github
npm run build
npm run check
npm test
```

The importer uses public GitHub endpoints without credentials. Statistics are a dated snapshot, not a visitor-time API call. Rate limits can interrupt a refresh; the existing deployable page remains usable.

Projects are curated. Add a repository, **commit SHA**, source path, excerpt line range, description and optional output path to `data/projects.json`. Run the importer and inspect the result. To change an imported revision, update its SHA explicitly.

## GitHub Pages deployment

1. Create a public repository on GitHub (for example, `sagnik10/SagnikSenPortfolio`).
2. From this folder, connect and push the prepared `main` branch:

   ```sh
   git remote add origin https://github.com/sagnik10/SagnikSenPortfolio.git
   git push -u origin main
   ```

   Replace the repository name in the URL if you chose a different one. You can also upload the project through GitHub's web interface, including generated `index.html` and `assets/`.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, select **main** and **/(root)**, then **Save**.
5. GitHub shows the published URL once deployment completes.

A project repository typically publishes at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`. Relative URLs support repository subpaths. `.nojekyll` keeps the site static. Minimal deployment needs only `index.html`, `assets/` and `.nojekyll`; keep the remaining files in version control for maintenance.

[Official GitHub Pages instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Content and accessibility

- Six original PNG outputs and eight exact Python excerpts have commit-specific source links.
- Rainfall and subtitle projects have no committed output previews at the pinned revisions and are labeled accordingly.
- Charts are repository artifacts, not independently reproduced results or verified performance claims.
- Teaching, education, employment and payment terms come from the supplied portfolio; review before publication.
- Gallery content, snippet disclosures, Q&A and contact links work without JavaScript.
- Filters, search, clipboard feedback, keyboard navigation and reduced-motion support provide progressive enhancement.
- Google Fonts has system-font fallbacks; all other visual assets are local.

No backend, analytics, contact-data storage or secret tokens are included.
