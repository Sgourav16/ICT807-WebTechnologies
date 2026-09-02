function initCompare(data, source) {
  showDemoNotice(source);
  const selects = [qs('career-one'), qs('career-two'), qs('career-three')];
  const options = [...data].sort((a,b)=>a.occupation.localeCompare(b.occupation));
  selects.forEach((s,i)=>{ s.innerHTML = `<option value="">Choose career ${i+1}</option>` + options.map((d,index)=>`<option value="${index}">${d.occupation}</option>`).join(''); s.addEventListener('change', render); });
  if (options.length >= 3) { selects[0].value='0'; selects[1].value=String(Math.min(1,options.length-1)); selects[2].value=String(Math.min(2,options.length-1)); }
  function render() {
    const chosen = selects.map(s => s.value === '' ? null : options[Number(s.value)]).filter(Boolean);
    const wrap = qs('compare-output');
    if (chosen.length < 2) { wrap.innerHTML='<div class="compare-empty">Choose at least two occupations to build a comparison.</div>'; return; }
    const rows = [
      ['Career field', d=>d.category], ['Major group', d=>format.major(d.major)], ['Employment (Nov 2025)', d=>format.employment(d.employment)], ['3-year employment change', d=>format.percent(d.changePct)], ['Working part-time', d=>format.plainPercent(d.partTime)], ['Female', d=>format.plainPercent(d.female)], ['Aged 15–24', d=>format.plainPercent(d.youth)], ['Unemployment category', d=>d.unemployment || 'Not available'], ['Median weekly earnings band', d=>format.earnings(d.earnings)], ['Skill level', d=>d.skill ? `Level ${d.skill} — ${format.skill(d.skill)}` : 'Not available'], ['Projected employment change to May 2030', d=>format.percent(d.projected)]
    ];
    wrap.innerHTML = `<div class="table-wrap"><table><caption>Selected occupation comparison</caption><thead><tr><th scope="col">Measure</th>${chosen.map(d=>`<th scope="col">${d.occupation}</th>`).join('')}</tr></thead><tbody>${rows.map(([name,fn])=>`<tr><th scope="row">${name}</th>${chosen.map(d=>`<td>${fn(d)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="table-help">Earnings are indicative bands for full-time workers, not guaranteed salaries.</p>`;
  }
  render();
}

function renderBars(target, items, key, formatter) {
  const max = Math.max(...items.map(d=>Math.abs(d[key]||0)),1);
  target.innerHTML = items.map(d => `<div class="bar-row"><div class="bar-label">${d.occupation}</div><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${Math.max(2, Math.abs(d[key]||0)/max*100)}%"></div></div><div class="bar-value">${formatter(d[key])}</div></div>`).join('');
}

function initEmployment(data, source) {
  showDemoNotice(source);
  const category=qs('employment-category'); addOptions(category, unique(data,'category'), 'All career fields');
  function render(){ const list=category.value?data.filter(d=>d.category===category.value):data; renderBars(qs('employment-bars'), topBy(list,'employment',10), 'employment', format.employment); const bands=['$','$$','$$$','$$$$','$$$$$']; const counts=bands.map(code=>({occupation:`${code} — ${format.earnings(code)}`, count:list.filter(d=>d.earnings===code).length})); const max=Math.max(...counts.map(x=>x.count),1); qs('earnings-bars').innerHTML=counts.map(x=>`<div class="bar-row"><div class="bar-label">${x.occupation}</div><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${Math.max(2,x.count/max*100)}%"></div></div><div class="bar-value">${x.count}</div></div>`).join(''); }
  category.addEventListener('change',render); render();
}

async function start() {
  const page = document.body.dataset.page;
  if (!page) return;
  try {
    const { data, source } = await CareerData.load();
    if (!data.length) throw new Error('No occupation records were recognised.');
    if (page === 'compare') initCompare(data, source);
    if (page === 'employment') initEmployment(data, source);
  } catch (error) {
    const status = qs('data-status');
    if (status) {
      status.textContent = 'The occupation dataset could not be loaded. Run the website through a local web server (for example VS Code Live Server) and confirm the CSV is in the data folder.';
      status.classList.add('is-visible');
    }
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', start);
