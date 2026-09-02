document.addEventListener('DOMContentLoaded', async () => {
  let data=[]; try{ data=await CareerData.load(); }catch(e){ const s=document.getElementById('data-status'); if(s){s.textContent=e.message;s.classList.add('is-visible');} }
  const selects=['career-one','career-two','career-three'].map(id=>document.getElementById(id)).filter(Boolean);
  if(selects.length){ const opts=data.slice(0,25).map((d,i)=>`<option value="${i}">${d.occupation}</option>`).join(''); selects.forEach((s,i)=>s.innerHTML=`<option value="">Choose career ${i+1}</option>`+opts); }
  const employment=document.getElementById('employment-bars');
  if(employment && data.length) employment.innerHTML=data.filter(d=>d.employment!=null).slice(0,3).map(d=>`<div class="bar-row"><div class="bar-label">${d.occupation}</div><div class="bar-value">${d.employment}k</div></div>`).join('');
});
