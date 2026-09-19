# Architecture and maintenance

The portfolio is static and compatible with GitHub Pages. Build tools use only Node.js built-ins. Checked-in HTML includes the complete content; visitors do not depend on GitHub API availability.

## Responsibilities

- `src/index.html`: biography, teaching, booking and contact content.
- `data/projects.json`: gallery entries with pinned source revisions.
- `scripts/build.mjs`: escaped HTML generation, Q&A, social links and statistics.
- `assets/css/styles.css`: design tokens, components and responsive layouts.
- `assets/js/main.js`: progressive navigation, composed filtering and clipboard feedback.
- `scripts/sync-github.mjs`: explicit imports and paginated public repository snapshots.
- `scripts/check.mjs`: HTML nesting, IDs, links, local assets and source revision checks.
- `tests/interactions.test.mjs`: filters, empty states, menu focus and clipboard failure tests.

## SMART delivery criteria

| Principle | Acceptance criterion |
| --- | --- |
| Specific | Present biography, teaching, source-backed projects, Q&A and direct contact. |
| Measurable | Each project has exact source code; each preview has a revision and alt text. |
| Achievable | Static HTML, CSS and JavaScript, without server or runtime dependencies. |
| Relevant | Prioritize work samples and learning goals for students and collaborators. |
| Time-bound | Display a snapshot date and refresh intentionally before each release. |

## Release steps

1. Review profile facts, fees and contact links.
2. Inspect refreshed outputs and excerpts; do not infer performance from exploratory charts.
3. Run build, structural checks and interaction tests.
4. Commit generated HTML with its source and assets.
5. Publish the main branch root in GitHub Pages.

Use relative URLs, kebab-case filenames, UTF-8 and two-space indentation. Generated project text is escaped. Keep secrets out of source control and add dependencies only when built-in capabilities cannot satisfy a requirement.

Imported charts preserve original colors and labels; some use dark backgrounds within the light website. Dimensions reserve layout space, images load lazily and full-size originals open from each preview.
