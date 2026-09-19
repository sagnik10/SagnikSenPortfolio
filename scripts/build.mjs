import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const e = escapeHtml;
const projects = JSON.parse(read('data/projects.json'));
const snapshot = JSON.parse(read('data/github-repositories.json'));
const icon = name => read(`assets/icons/${name}.svg`).replace('<svg ', '<svg aria-hidden="true" focusable="false" ').replace(/<title>.*?<\/title>/g, '');
const socials = [
  ['whatsapp', 'WhatsApp', 'https://wa.me/916295862826'],
  ['linkedin', 'LinkedIn', 'https://www.linkedin.com/in/sagnik-sen-0a70431a8/'],
  ['github', 'GitHub', 'https://github.com/sagnik10'],
  ['kaggle', 'Kaggle', 'https://www.kaggle.com/sagniksen3025'],
  ['leetcode', 'LeetCode', 'https://leetcode.com/u/sagnik10/'],
  ['envelope', 'Email', 'mailto:sagniklm10@gmail.com']
];
const socialLinks = socials.map(([name, label, href]) => `<a class="social-btn" href="${href}" ${href.startsWith('https') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${icon(name)}<span>${label}</span></a>`).join('\n');
const categories = ['All projects', ...new Set(projects.map(p => p.category))];
const gallery = `<div class="gallery-toolbar"><div class="filters" role="group" aria-label="Filter projects by topic">${categories.map((category, i) => `<button type="button" data-filter="${e(category)}" aria-pressed="${i === 0}">${e(category)}</button>`).join('')}</div><label class="search-label"><span>Search projects</span><input type="search" id="project-search" placeholder="Try Python, retail, rainfall…" autocomplete="off"></label></div>
<p id="project-count" class="meta" role="status">${projects.length} projects · ${projects.filter(p => p.image).length} imported output previews</p>
<div class="project-gallery">${projects.map((p, i) => `<article class="project-card" data-category="${e(p.category)}" data-search="${e(`${p.title} ${p.description} ${p.category} ${p.repo} Python`)}" id="project-${p.id}">
${p.image ? `<a class="project-image" href="${p.image}" target="_blank" rel="noopener" aria-label="Open full-size output: ${e(p.title)}"><img src="${p.image}" alt="${e(p.alt)}" width="${p.width}" height="${p.height}" loading="lazy" decoding="async"><span>View full output ${icon('arrow-up-right')}</span></a>` : `<div class="source-preview">${icon('code-slash')}<strong>${p.id === 'rainfall' ? 'Data → aggregates → atlas' : 'Video → speech → subtitles'}</strong><span>Source available · output not published</span></div>`}
<div class="project-body"><div class="project-meta"><span>${e(p.category)}</span><span>${String(i + 1).padStart(2, '0')}</span></div><h3>${e(p.title)}</h3><p>${e(p.description)}</p>
<details class="code-details"><summary>${icon('code-slash')} Explore Python snippet <span aria-hidden="true">+</span></summary><div class="code-heading"><span>${e(p.codePath.split('/').at(-1))}</span><button type="button" class="copy-button" data-copy="code-${p.id}" aria-label="Copy code for ${e(p.title)}">Copy</button></div><pre tabindex="0" aria-label="Python excerpt for ${e(p.title)}"><code id="code-${p.id}">${e(p.code)}</code></pre><a class="source-link" href="${e(p.codeUrl)}" target="_blank" rel="noopener noreferrer">Source lines ${p.lineStart}–${p.lineEnd} · ${p.commit.slice(0, 7)} ${icon('arrow-up-right')}</a><p class="snippet-note">Excerpt from the project; requires its surrounding code and dependencies.</p></details>
<div class="project-links"><a href="https://github.com/sagnik10/${p.repo}" target="_blank" rel="noopener noreferrer">${icon('github')} Repository ${icon('arrow-up-right')}</a>${p.outputUrl ? `<a href="${p.outputUrl}" target="_blank" rel="noopener noreferrer">Output source ${icon('arrow-up-right')}</a>` : ''}</div></div></article>`).join('\n')}</div><p id="project-empty" hidden>No matching projects. Try another topic or clear your search.</p><p class="meta gallery-note">Previews are original files imported from public repositories. Source links identify the exact revision; outputs have not been rerun for this portfolio.</p>`;
const languages = new Set(snapshot.repositories.map(r => r.language).filter(Boolean));
const date = new Date(snapshot.fetchedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const stats = [['3,000+', 'Classes taught', 'Teaching experience'], [String(snapshot.repositories.length), 'Public repositories', 'GitHub snapshot'], [String(languages.size), 'Primary repo languages', 'GitHub classifications'], [String(projects.filter(p => p.image).length), 'Output previews', 'Imported from GitHub'], ['8', 'Learning tracks', 'Python through AI agents'], ['1:1', 'Personal attention', 'Every teaching session']].map(([n,l,s])=>`<div class="stat"><strong>${n}</strong><span>${l}</span><small>${s}</small></div>`).join('');
const faq = [
  ['Do I need coding experience to get started?', 'No. Python foundations starts with syntax, data structures and functions. If you already code, we can focus on data analysis, machine learning or the specific project you want to build.'],
  ['How are the classes structured?', 'Classes are one-to-one and online. We agree on your starting point, learning goal and schedule, then work through explanations, coding practice and feedback at your pace.'],
  ['What does a SMART learning plan look like?', 'Choose a specific outcome, agree on a measurable checkpoint, scope it to your current level, connect it to your goal, and set a realistic review date together. For example: clean one dataset and explain three charts by an agreed milestone.'],
  ['Can we work on my own dataset or project?', 'Yes. Share your goal and the kind of data or code you are working with. We can plan support around data cleaning, analysis, model evaluation or a documented project you can explain yourself.'],
  ['Which time zones do you teach in?', 'Students join from North America, Europe, the Middle East, Australia, Singapore and other locations. Send your time zone and preferred windows so we can agree on a schedule.'],
  ['How much do classes cost?', 'Fees depend on the subject, class length and scope. Contact me for a quote. The booking arrangement is a 20% advance, with the remaining fee split into three instalments across the agreed course or project.'],
  ['Are these project previews real outputs?', 'Yes. The six image previews are committed output files imported from my public GitHub repositories. Each has an output source and an exact code link. Projects without committed outputs are labeled as source-only.'],
  ['Can I run the code snippets on their own?', 'The snippets are exact excerpts, not standalone programs. Open the linked repository for the full script, required data and setup instructions. Check its license before reusing code.'],
  ['Do the charts prove a model’s accuracy?', 'No. Distributions, correlations and projections show aspects of a dataset or analysis. Model performance needs its own evaluation and validation. This gallery does not claim accuracy scores that are not evidenced here.'],
  ['What should I send in my first message?', 'Tell me what you want to learn or build, your current experience, any deadline and your time zone. You can use WhatsApp or email from the contact section.']
].map(([q,a])=>`<details class="faq-item"><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`).join('');
let html = read('src/index.html');
for (const [key, value] of Object.entries({ GALLERY: gallery, STATS: stats, SNAPSHOT_DATE: date, SOCIALS: socialLinks, FAQ: faq, MENU_ICON: icon('list'), WHATSAPP_ICON: icon('whatsapp') })) html = html.replaceAll(`<!-- ${key} -->`, value);
fs.writeFileSync(path.join(root, 'index.html'), '<!-- Generated by npm run build. Edit src/index.html and data/, then rebuild. -->\n' + html);
console.log(`Built ${projects.length} projects, ${projects.filter(p => p.image).length} previews, ${snapshot.repositories.length} repository snapshot.`);
