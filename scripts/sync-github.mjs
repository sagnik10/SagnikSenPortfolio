import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const projects = JSON.parse(await fs.readFile(path.join(root, 'data/projects.json'), 'utf8'));
async function download(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response;
}
// Pinned commits keep the imported output and its code excerpt on the same revision.
for (const project of projects) {
  const base = `https://raw.githubusercontent.com/sagnik10/${project.repo}/${project.commit}/`;
  const source = await (await download(base + project.codePath)).text();
  const lines = source.trimEnd().split(/\r?\n/);
  if (project.lineStart < 1 || project.lineEnd > lines.length || project.lineEnd < project.lineStart) throw new Error(`Invalid excerpt range: ${project.repo}`);
  project.code = lines.slice(project.lineStart - 1, project.lineEnd).join('\n');
  project.codeUrl = `https://github.com/sagnik10/${project.repo}/blob/${project.commit}/${project.codePath}#L${project.lineStart}-L${project.lineEnd}`;
  if (project.outputPath) {
    const image = Buffer.from(await (await download(base + project.outputPath)).arrayBuffer());
    if (image.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error(`Invalid PNG: ${project.repo}`);
    project.width = image.readUInt32BE(16);
    project.height = image.readUInt32BE(20);
    project.image = `assets/images/projects/${project.id}.png`;
    project.outputUrl = `https://github.com/sagnik10/${project.repo}/blob/${project.commit}/${project.outputPath}`;
    await fs.mkdir(path.join(root, 'assets/images/projects'), { recursive: true });
    await fs.writeFile(path.join(root, project.image), image);
  }
  console.log(`Imported ${project.title}`);
}
await fs.writeFile(path.join(root, 'data/projects.json'), JSON.stringify(projects, null, 2) + '\n');
const repositories = [];
for (let page = 1; ; page++) {
  const batch = await (await download(`https://api.github.com/users/sagnik10/repos?per_page=100&page=${page}`)).json();
  repositories.push(...batch.map(r => ({ name: r.name, url: r.html_url, branch: r.default_branch, language: r.language, stars: r.stargazers_count, fork: r.fork })));
  if (batch.length < 100) break;
}
await fs.writeFile(path.join(root, 'data/github-repositories.json'), JSON.stringify({ fetchedAt: new Date().toISOString(), repositories }, null, 2) + '\n');
