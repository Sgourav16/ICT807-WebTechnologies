
/* CareerCompass AU dataset and interaction utilities.
   HTML/CSS provide the structure and presentation; JavaScript supports dataset-driven interaction. */

const CareerData = (() => {
  const officialFiles = [
    'data/aus_jobs_2026_-_occupation_matrix_0.csv',
    'data/aus_jobs_2026_-_occupation_matrix.csv'
  ];
  const fallbackFile = 'data/occupation_demo.csv';

  function parseCSV(text) {
    const rows = [];
    let row = [], field = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];
      if (char === '"' && quoted && next === '"') { field += '"'; i++; }
      else if (char === '"') quoted = !quoted;
      else if (char === ',' && !quoted) { row.push(field.trim()); field = ''; }
      else if ((char === '\n' || char === '\r') && !quoted) {
        if (char === '\r' && next === '\n') i++;
        row.push(field.trim()); field = '';
        if (row.some(cell => cell !== '')) rows.push(row);
        row = [];
      } else field += char;
    }
    if (field || row.length) { row.push(field.trim()); if (row.some(cell => cell !== '')) rows.push(row); }
    return rows;
  }

  const normalise = s => (s || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9%]+/g, ' ').trim();
  const toNumber = value => {
    if (value === undefined || value === null) return null;
    const cleaned = String(value).replace(/,/g, '').replace(/%/g, '').trim();
    if (!cleaned || cleaned === '-' || cleaned.toLowerCase() === 'n/a') return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };
  const cleanText = value => {
    const v = (value ?? '').trim();
    return (!v || v === '-') ? null : v;
  };

  function headerIndex(headers, includes, excludes = []) {
    return headers.findIndex(h => includes.every(k => normalise(h).includes(k)) && excludes.every(k => !normalise(h).includes(k)));
  }

  function mapRows(rows) {
    if (rows.length < 2) return [];
    const headers = rows[0];
    const h = headers.map(normalise);

    let idx = {
      // The official matrix has used different wording for the career grouping
      // across downloadable/exported versions. Recognise the common variants.
      category: h.findIndex(x => x === 'category' || x.includes('career field') || x.includes('career group') || x.includes('field of work') || x === 'grouping'),
      occupation: headerIndex(headers, ['occupation']),
      major: headerIndex(headers, ['major']),
      employment: h.findIndex(x => x.includes('employ') && x.includes('2025') && !x.includes('project') && !x.includes('change')),
      changeAbs: h.findIndex(x => x.includes('3 year') && x.includes('change') && (x.includes('000') || !x.includes('%'))),
      changePct: h.findIndex(x => x.includes('3 year') && x.includes('change') && x.includes('%')),
      partTime: h.findIndex(x => x.includes('part') && x.includes('time')),
      female: h.findIndex(x => x.includes('female')),
      youth: h.findIndex(x => x.includes('15') && x.includes('24')),
      unemployment: h.findIndex(x => x.includes('unemploy')),
      earnings: h.findIndex(x => x.includes('earning')),
      skill: h.findIndex(x => x.includes('skill')),
      projected: h.findIndex(x => x.includes('project') && x.includes('employ'))
    };

    // Positional fallback for the official matrix if headings are abbreviated.
    const hasCategory = idx.category >= 0;
    if (idx.occupation < 0) idx.occupation = hasCategory ? 1 : 0;
    const base = hasCategory ? 2 : 1;
    if (idx.employment < 0) idx.employment = base;
    if (idx.changeAbs < 0) idx.changeAbs = base + 1;
    if (idx.changePct < 0) idx.changePct = base + 2;
    if (idx.partTime < 0) idx.partTime = base + 3;
    if (idx.female < 0) idx.female = base + 4;
    if (idx.youth < 0) idx.youth = base + 5;
    if (idx.unemployment < 0) idx.unemployment = base + 6;
    if (idx.earnings < 0) idx.earnings = base + 7;
    if (idx.skill < 0) idx.skill = base + 8;
    if (idx.projected < 0) idx.projected = base + 9;

    const knownCategories = new Set([
      'Accounting, Banking and Financial Services','Administration and Human Resources','Advertising, Public Relations, Media and Arts',
      'Agriculture, Animal and Horticulture','Automotive, Transport and Logistics','Construction, Architecture and Design','Education and Training',
      'Electrical and Electronics','Engineers and Engineering Trades','Executive and General Management','Government, Defence and Protective Services',
      'Health and Community Services','Hospitality, Food Services and Tourism','Information and Communication Technology (ICT)','Legal and Insurance',
      'Manufacturing','Mining and Energy','Personal Services','Sales, Retail, Wholesale and Real Estate','Science','Sports and Recreation'
    ]);

    const categoryLookup = new Map([...knownCategories].map(name => [normalise(name), name]));
    let currentCategory = '';
    const data = [];
    for (const row of rows.slice(1)) {
      const cells = row.map(cleanText);
      const first = cells[0];
      const restHaveValues = cells.slice(1).some(Boolean);
      const rawOccupation = cleanText(row[idx.occupation]);
      const categoryCell = idx.category >= 0 ? cleanText(row[idx.category]) : null;

      // Find any of the official 21 career group names anywhere in the row.
      // This supports both common CSV layouts:
      // 1) a Career field/category column repeated for each occupation, and
      // 2) a category heading row followed by its occupation rows.
      let categoryInRow = null;
      for (const cell of cells) {
        if (!cell) continue;
        const canonical = categoryLookup.get(normalise(cell));
        if (canonical) { categoryInRow = canonical; break; }
      }
      if (!categoryInRow && categoryCell) {
        categoryInRow = categoryLookup.get(normalise(categoryCell)) || categoryCell;
      }

      const numericEvidence = [idx.employment, idx.changeAbs, idx.changePct, idx.partTime, idx.female, idx.youth, idx.skill, idx.projected]
        .some(i => i >= 0 && toNumber(row[i]) !== null);

      // Category-only rows in the official matrix must update the current group
      // rather than being interpreted as occupations.
      if (categoryInRow && (!rawOccupation || !numericEvidence || categoryLookup.has(normalise(rawOccupation)))) {
        currentCategory = categoryInRow;
        if (!rawOccupation || categoryLookup.has(normalise(rawOccupation)) || !numericEvidence) continue;
      }
      if (!hasCategory && first && !restHaveValues) {
        currentCategory = categoryLookup.get(normalise(first)) || first;
        continue;
      }
      if (!rawOccupation) continue;

      const match = rawOccupation.match(/\s*\((M|P|TT|CP|CA|SW|MO|L)\)\s*$/i);
      const majorFromName = match ? match[1].toUpperCase() : null;
      const occupation = match ? rawOccupation.replace(/\s*\((M|P|TT|CP|CA|SW|MO|L)\)\s*$/i, '').trim() : rawOccupation;
      const category = categoryInRow || currentCategory || 'Other';

      data.push({
        category,
        occupation,
        major: cleanText(row[idx.major]) || majorFromName || '',
        employment: toNumber(row[idx.employment]),
        changeAbs: toNumber(row[idx.changeAbs]),
        changePct: toNumber(row[idx.changePct]),
        partTime: toNumber(row[idx.partTime]),
        female: toNumber(row[idx.female]),
        youth: toNumber(row[idx.youth]),
        unemployment: cleanText(row[idx.unemployment]),
        earnings: cleanText(row[idx.earnings]),
        skill: toNumber(row[idx.skill]),
        projected: toNumber(row[idx.projected])
      });
    }
    return data.filter(d => d.occupation && (d.employment !== null || d.skill !== null || d.projected !== null));
  }

  async function load() {
    for (const path of officialFiles) {
      try {
        const response = await fetch(path, { cache: 'no-store' });
        if (response.ok) return { data: mapRows(parseCSV(await response.text())), source: 'official' };
      } catch (error) { /* Try next file. */ }
    }
    const response = await fetch(fallbackFile, { cache: 'no-store' });
    if (!response.ok) throw new Error('Dataset could not be loaded.');
    return { data: mapRows(parseCSV(await response.text())), source: 'demo' };
  }

  return { load };
})();

const format = {
  number: value => value == null ? 'Not available' : new Intl.NumberFormat('en-AU', { maximumFractionDigits: 1 }).format(value),
  employment: value => value == null ? 'Not available' : `${new Intl.NumberFormat('en-AU', { maximumFractionDigits: 1 }).format(value)}k`,
  percent: value => value == null ? 'Not available' : `${value > 0 ? '+' : ''}${new Intl.NumberFormat('en-AU', { maximumFractionDigits: 1 }).format(value)}%`,
  plainPercent: value => value == null ? 'Not available' : `${new Intl.NumberFormat('en-AU', { maximumFractionDigits: 1 }).format(value)}%`,
  earnings: code => ({'$':'Under $1,250','$$':'$1,250–$1,530','$$$':'$1,531–$1,900','$$$$':'$1,901–$2,460','$$$$$':'Above $2,460'}[code] || 'Not available'),
  skill: level => ({1:'Bachelor degree or higher',2:'Advanced Diploma or Diploma',3:'Certificate IV/III + substantial training',4:'Certificate II or III',5:'Certificate I or secondary education'}[level] || 'Not available'),
  major: code => ({M:'Managers',P:'Professionals',TT:'Technicians & Trades',CP:'Community & Personal Service',CA:'Clerical & Administrative',SW:'Sales Workers',MO:'Machinery Operators & Drivers',L:'Labourers'}[code] || code || 'Other')
};

function tone(value) { return value == null || value === 0 ? 'neutral' : value > 0 ? 'positive' : 'negative'; }
function qs(id) { return document.getElementById(id); }
function setText(id, text) { const el = qs(id); if (el) el.textContent = text; }
function showDemoNotice(source) {
  const el = qs('data-status');
  if (el && source === 'demo') {
    el.textContent = 'Sample data notice: a small verified occupation sample is being displayed because the full official CSV is not available in this copy.';
    el.classList.add('is-visible');
  }
}
function unique(data, key) { return [...new Set(data.map(d => d[key]).filter(Boolean))].sort((a,b) => String(a).localeCompare(String(b))); }
function addOptions(select, values, label = 'All') {
  if (!select) return;
  select.innerHTML = `<option value="">${label}</option>` + values.map(v => `<option value="${String(v).replace(/"/g,'&quot;')}">${v}</option>`).join('');
}
function topBy(data, key, n=8, direction='desc') {
  return data.filter(d => d[key] != null).sort((a,b) => direction === 'desc' ? b[key]-a[key] : a[key]-b[key]).slice(0,n);
}

