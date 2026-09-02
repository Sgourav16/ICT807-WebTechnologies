function renderBars(target, items, key, formatter) {
  const max = Math.max(...items.map(d=>Math.abs(d[key]||0)),1);
  target.innerHTML = items.map(d => `<div class="bar-row"><div class="bar-label">${d.occupation}</div><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${Math.max(2, Math.abs(d[key]||0)/max*100)}%"></div></div><div class="bar-value">${formatter(d[key])}</div></div>`).join('');
}

function initInsights(data, source) {
  showDemoNotice(source);
  const metrics=[['Largest occupation',topBy(data,'employment',1)[0],'employment'],['Strongest 3-year growth',topBy(data,'changePct',1)[0],'changePct'],['Highest youth share',topBy(data,'youth',1)[0],'youth'],['Highest part-time share',topBy(data,'partTime',1)[0],'partTime']];
  qs('insight-metrics').innerHTML=metrics.map(([label,d,key])=>`<article class="metric-card"><span>${label}</span><strong>${d?d.occupation:'Not available'}</strong><small>${d?(key==='employment'?format.employment(d[key]):format.plainPercent(d[key])):'No data'}</small></article>`).join('');
  renderBars(qs('insight-growth-bars'), topBy(data,'projected',8), 'projected', format.percent);
}

async function start() {
  const page = document.body.dataset.page;
  if (page === 'data' || !page) return;
  try {
    const { data, source } = await CareerData.load();
    if (!data.length) throw new Error('No occupation records were recognised.');
    if (page === 'insights') initInsights(data, source);
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
