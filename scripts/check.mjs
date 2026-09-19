import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'data/projects.json'), 'utf8'));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate HTML IDs');
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id), `Missing anchor ${id}`);
for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (/^(https?:|mailto:|tel:|#)/.test(url)) continue;
  const target = path.resolve(root, url);
  assert(target.startsWith(root + path.sep), 'Asset outside project');
  assert(fs.existsSync(target), `Missing local asset: ${url}`);
}
for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
  assert(/\balt="[^"]+"/.test(tag), 'Image needs descriptive alt text');
  assert(/\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag), 'Image needs dimensions');
}
for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert(/rel="[^"]*noopener/.test(tag), 'External tab needs noopener');
assert.equal((html.match(/<h1>/g) || []).length, 1);
assert(!/<!-- (GALLERY|STATS|FAQ|SOCIALS|MENU_ICON|SNAPSHOT_DATE) -->/.test(html), 'Unrendered template marker');
assert(!/LET\?S|repository\?s|photo coming soon|Add a student review|\uFFFD/.test(html), 'Placeholder or encoding error');
const voids = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const stack = [];
for (const token of html.matchAll(/<!--[^]*?-->|<![^>]*>|<\/?([a-z][\w-]*)\b[^>]*>/gi)) {
  const [raw, name] = token;
  if (!name) continue;
  const tag = name.toLowerCase();
  if (raw.startsWith('</')) assert.equal(stack.pop(), tag, `Unbalanced ${tag}`);
  else if (!voids.has(tag) && !raw.endsWith('/>')) stack.push(tag);
}
assert.equal(stack.length, 0, 'Unclosed HTML tags');
for (const p of projects) {
  assert(/^[a-f0-9]{40}$/.test(p.commit), `Unpinned source: ${p.id}`);
  assert(p.code?.trim() && p.codeUrl.includes(p.commit), `Missing code provenance: ${p.id}`);
  if (p.image) {
    const buffer = fs.readFileSync(path.join(root, p.image));
    assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(buffer.readUInt32BE(16), p.width);
    assert.equal(buffer.readUInt32BE(20), p.height);
    assert(p.outputUrl.includes(p.commit));
  }
}
console.log(`PASS: HTML structure, anchors, assets, image dimensions, source provenance and ${projects.length} project entries.`);
