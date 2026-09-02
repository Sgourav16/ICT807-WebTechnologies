document.addEventListener('DOMContentLoaded', async () => {
  let data=[]; try{ data=await CareerData.load(); }catch(e){ const s=document.getElementById('data-status'); if(s){s.textContent=e.message;s.classList.add('is-visible');} }
  if(data.length){ const largest=data.filter(d=>d.employment!=null).sort((a,b)=>b.employment-a.employment)[0]; const el=document.getElementById('insight-largest'); if(el&&largest) el.textContent=largest.occupation; }
});
