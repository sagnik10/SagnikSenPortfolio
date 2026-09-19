import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

function element(dataset = {}) {
  const handlers = {}, attributes = {};
  return { dataset, handlers, attributes, hidden: false, value: '', textContent: '',
    classList: { add() {}, remove() {}, toggle() {} },
    setAttribute(k, v) { attributes[k] = v; }, getAttribute(k) { return attributes[k]; },
    addEventListener(k, fn) { handlers[k] = fn; }, focus() { this.focused = true; }
  };
}
function setup(clipboard = { writeText: async () => {} }) {
  const menu = element(), nav = element(), search = element(), count = element(), empty = element();
  const filters = ['All projects', 'Environment', 'Analytics'].map(filter => element({ filter }));
  const cards = [element({ category: 'Environment', search: 'Beijing air quality Python' }), element({ category: 'Analytics', search: 'Retail sales Python' })];
  const copy = element({ copy: 'sample-code' }), code = element(), status = element();
  code.textContent = 'print("example")';
  const byId = { year: element(), navigation: nav, 'project-search': search, 'project-count': count, 'project-empty': empty, 'copy-status': status, 'sample-code': code };
  const doc = element();
  Object.assign(doc, { documentElement: element(), getElementById: id => byId[id], querySelector: () => menu,
    querySelectorAll: selector => ({ '[data-filter]': filters, '.project-card': cards, '[data-copy]': [copy] })[selector] || [],
    createRange: () => ({ selectNodeContents() {} }) });
  let selected = false;
  const window = { getSelection: () => ({ removeAllRanges() {}, addRange() { selected = true; } }) };
  vm.runInNewContext(fs.readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8'), { document: doc, window, navigator: { clipboard }, Date, setTimeout() {} });
  return { menu, nav, doc, filters, cards, search, count, empty, copy, code, status, selected: () => selected };
}
test('topic and search filters compose, expose empty state and reset', () => {
  const s = setup();
  s.filters[1].handlers.click();
  assert.equal(s.cards[0].hidden, false); assert.equal(s.cards[1].hidden, true);
  s.search.value = 'retail'; s.search.handlers.input();
  assert(s.cards.every(c => c.hidden)); assert.equal(s.empty.hidden, false);
  s.filters[0].handlers.click(); assert.equal(s.cards[1].hidden, false);
  s.search.value = '  PYTHON  '; s.search.handlers.input();
  assert(s.cards.every(c => !c.hidden)); assert.equal(s.count.textContent, '2 of 2 projects shown');
  assert.equal(s.filters[0].attributes['aria-pressed'], 'true');
});
test('menu closes on navigation and Escape returns focus', () => {
  const s = setup();
  s.menu.handlers.click(); assert.equal(s.menu.attributes['aria-expanded'], 'true');
  s.doc.handlers.keydown({ key: 'Escape' }); assert.equal(s.menu.attributes['aria-expanded'], 'false'); assert(s.menu.focused);
  s.menu.handlers.click(); s.nav.handlers.click({ target: { closest: () => ({}) } }); assert.equal(s.menu.attributes['aria-expanded'], 'false');
});
test('copy uses the exact snippet and announces success', async () => {
  let copied;
  const s = setup({ writeText: async text => { copied = text; } });
  await s.copy.handlers.click(); assert.equal(copied, s.code.textContent); assert.equal(s.copy.textContent, 'Copied!'); assert.match(s.status.textContent, /copied/);
});
test('clipboard rejection selects code and explains manual copying', async () => {
  const s = setup({ writeText: async () => { throw Error('Denied'); } });
  await s.copy.handlers.click(); assert(s.selected()); assert.equal(s.copy.textContent, 'Selected'); assert.match(s.status.textContent, /device/);
});
