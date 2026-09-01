document.addEventListener('DOMContentLoaded', async () => {
  const page=document.body.dataset.page;
  let data=[]; try{ data=await CareerData.load(); }catch(e){ const s=document.getElementById('data-status'); if(s){s.textContent=e.message;s.classList.add('is-visible');} }
  if(page==='home'){
    const a=document.getElementById('home-career-count'); if(a) a.textContent=data.length || '—';
  }
  if(page==='explorer'){
    const count=document.getElementById('result-count'); if(count) count.textContent=data.length;
    const results=document.getElementById('career-results');
    if(results && data.length) results.innerHTML=data.slice(0,3).map(d=>`<article class="career-card"><h2>${d.occupation}</h2><p>Occupation record from the Australian Jobs dataset.</p></article>`).join('');
  }
  const form=document.getElementById('feedback-form'); if(form) form.addEventListener('submit',e=>{e.preventDefault(); alert('Thank you for your feedback. This prototype does not permanently store submissions.');});
});
