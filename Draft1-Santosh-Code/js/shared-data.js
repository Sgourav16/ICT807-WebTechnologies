/* CareerCompass AU shared dataset utility.
   This file intentionally provides only the common CSV-loading foundation.
   Page-specific rendering is completed in each member's page script. */
const CareerData = (() => {
  const files = ['data/aus_jobs_2026_-_occupation_matrix_0.csv','data/aus_jobs_2026_-_occupation_matrix.csv','data/occupation_demo.csv'];
  function parseCSV(text) {
    const rows=[]; let row=[], field='', quoted=false;
    for (let i=0;i<text.length;i++) {
      const c=text[i], n=text[i+1];
      if (c==='"' && quoted && n==='"') { field+='"'; i++; }
      else if (c==='"') quoted=!quoted;
      else if (c===',' && !quoted) { row.push(field.trim()); field=''; }
      else if ((c==='\n'||c==='\r') && !quoted) { if(c==='\r'&&n==='\n') i++; row.push(field.trim()); field=''; if(row.some(Boolean)) rows.push(row); row=[]; }
      else field+=c;
    }
    if (field || row.length) { row.push(field.trim()); if(row.some(Boolean)) rows.push(row); }
    return rows;
  }
  function toNumber(value){ const x=String(value??'').replace(/,/g,'').replace(/%/g,'').trim(); if(!x||x==='-'||x.toLowerCase()==='n/a') return null; const n=Number(x); return Number.isFinite(n)?n:null; }
  function clean(value){ const v=String(value??'').trim(); return (!v||v==='-')?null:v; }
  function mapRows(rows){
    if(rows.length<2) return [];
    const h=rows[0].map(x=>x.toLowerCase());
    const find=(...keys)=>h.findIndex(x=>keys.every(k=>x.includes(k)));
    const occ=find('occupation');
    const emp=h.findIndex(x=>x.includes('employ')&&x.includes('2025')&&!x.includes('project')&&!x.includes('change'));
    const proj=h.findIndex(x=>x.includes('project')&&x.includes('employ'));
    const skill=find('skill');
    return rows.slice(1).map(r=>({occupation:clean(r[occ<0?0:occ]), employment:toNumber(r[emp<0?1:emp]), projected:toNumber(r[proj<0?11:proj]), skill:toNumber(r[skill<0?10:skill]), raw:r})).filter(d=>d.occupation);
  }
  async function load(){
    for(const file of files){ try{ const res=await fetch(file,{cache:'no-store'}); if(res.ok) return mapRows(parseCSV(await res.text())); }catch(e){} }
    throw new Error('Dataset could not be loaded. Run the package through a local web server such as VS Code Live Server.');
  }
  return {load};
})();
