document.addEventListener('DOMContentLoaded', async () => {
  let data=[]; try{ data=await CareerData.load(); }catch(e){ const s=document.getElementById('data-status'); if(s){s.textContent=e.message;s.classList.add('is-visible');} }
  const growth=document.getElementById('growth-table');
  if(growth && data.length){ const rows=data.filter(d=>d.projected!=null).sort((a,b)=>b.projected-a.projected).slice(0,3); growth.innerHTML=rows.map((d,i)=>`<tr><td>${i+1}</td><td>${d.occupation}</td><td>To classify</td><td>${d.projected}%</td></tr>`).join(''); }
});
