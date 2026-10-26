(async function(){if(window.__rasdDone&&window.__rasdDone===window.__rasdK)return;window.__rasdDone=window.__rasdK;
const V='3';
const BOX=(html,btns,ta)=>new Promise(res=>{const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px';const d=document.createElement('div');d.dir='rtl';d.style.cssText='background:#fff;color:#111;border-radius:16px;padding:18px;width:calc(100vw - 64px);max-width:520px;font:17px/1.7 system-ui;box-shadow:0 10px 40px rgba(0,0,0,.3)';d.innerHTML='<div style="font-weight:700;color:#0f6b4f;margin-bottom:6px">رصد إلى مدرستي</div><div>'+html+'</div>'+(ta?'<textarea style="display:block;width:calc(100vw - 100px);max-width:484px;min-height:90px;margin-top:10px;font:15px system-ui;border:1px solid #bbb;border-radius:10px;padding:8px;box-sizing:border-box" placeholder="اضغطي مطولًا هنا ثم «لصق»"></textarea>':'')+'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"></div>';const row=d.lastElementChild;btns.forEach(([t,v,c])=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.style.cssText='padding:10px 18px;border-radius:10px;border:0;font:inherit;font-weight:600;background:'+(c||'#0f6b4f')+';color:#fff';b.onclick=async e=>{e.preventDefault();e.stopPropagation();if(v==='paste'){try{const x=await navigator.clipboard.readText();d.querySelector('textarea').value=x;}catch(_){}return;}o.remove();res(v==='ok'&&ta?d.querySelector('textarea').value:v);};row.appendChild(b);});o.appendChild(d);document.body.appendChild(o);const t=d.querySelector('textarea');if(t)setTimeout(()=>t.focus(),50);});
const alert=m=>BOX(m.replace(/\n/g,'<br>'),[['حسنًا','x']]);
const N=s=>(s||'').replace(/[ً-ْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/\s+/g,' ').trim();
const T=s=>N(s).split(' ').filter(w=>w&&w!=='بن'&&w!=='بنت');
const TX=e=>{const w=document.createTreeWalker(e,4);let o=[],n;while(n=w.nextNode())o.push(n.nodeValue);return o.join(' ');};
const tt=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
const C=t=>{const L=[...document.querySelectorAll('body *')].filter(e=>tt(e)===t&&![...e.children].some(c=>tt(c)===t)&&vis(e));
  return L.map(e=>e.closest('button,label,a,[role=button],[role=radio],[role=tab],[tabindex]')||e);};
const inp=b=>{if(b.matches&&b.matches('input'))return b;let i=b.querySelector&&b.querySelector('input');if(i)return i;const f=b.getAttribute&&b.getAttribute('for');if(f&&document.getElementById(f))return document.getElementById(f);const p=b.previousElementSibling;if(p&&p.matches('input[type=radio],input[type=checkbox]'))return p;return null;};
const bg=e=>{const c=getComputedStyle(e).backgroundColor;return !(c==='transparent'||c==='rgba(0, 0, 0, 0)'||c==='rgb(255, 255, 255)');};
const sel=b=>{const i=inp(b);if(i&&(i.type==='radio'||i.type==='checkbox'))return i.checked;if(b.getAttribute('aria-pressed')==='true'||b.getAttribute('aria-checked')==='true'||/(^|\s|-)(active|selected|checked)(\s|$)/.test(b.className))return true;return bg(b);};
const AB=C('غائب');
if(!AB.length){const all=[...document.querySelectorAll('body *')].filter(e=>tt(e)==='غائب');alert('لم أجد أزرار «غائب» في هذه الصفحة.\nافتحي «الحضور والتحفيز» وانتظري ظهور الأسماء ثم اضغطي الزر.\n[تشخيص v'+V+': '+all.length+' '+all.slice(0,3).map(e=>e.tagName+'.'+(e.className||'').toString().slice(0,30)).join(' | ')+']');return;}
let raw=await BOX('الصقي هنا ما نسختِه من منصة السلوك:',[['متابعة','ok'],['لصق','paste','#475467'],['إلغاء','no','#b42318']],1);if(raw==null||raw==='no')return;raw=String(raw).trim();
if(raw.indexOf('RASD1|')!==0){alert('النص الملصق ليس من منصة السلوك. ارجعي إلى المنصة واضغطي «انسخي وافتحي مدرستي» ثم أعيدي المحاولة.');return;}
const P=raw.split('|'),names=(P[4]||'').split('؛').map(x=>x.trim()).filter(Boolean);
const PR=C('حاضر');
const rowOf=b=>{let r=b;while(r.parentElement&&r.parentElement!==document.body){const p=r.parentElement;if(AB.filter(x=>p.contains(x)).length>1)break;r=p;}return r;};
const rows=AB.map(b=>{const r=rowOf(b);return {r,ab:b,pr:PR.find(x=>r.contains(x)),t:new Set(T(TX(r)))};});
const hit=new Set(),miss=[],amb=[];
for(const n of names){const tn=T(n);let c=rows.filter(x=>tn.every(w=>x.t.has(w)));if(!c.length&&tn.length>2)c=rows.filter(x=>x.t.has(tn[0])&&x.t.has(tn[tn.length-1])&&x.t.has(tn[1]));if(c.length===1)hit.add(c[0]);else if(c.length>1)amb.push(n);else miss.push(n);}
if(await BOX('<b>فصل '+P[2]+' · '+P[3]+'</b><br>غائبات وُجدن في الصفحة: <b>'+hit.size+'</b> من '+names.length+'<br>والبقية حاضرات ('+(rows.length-hit.size)+').'+(miss.length+amb.length?'<br><span style="color:#b42318">لم أطابق: '+miss.concat(amb).join('، ')+'</span>':'')+'<br>تأكدي أن هذه صفحة الفصل والحصة نفسها.',[['تأشير','ok'],['إلغاء','no','#b42318']])!=='ok')return;
const clk=w=>{const i=inp(w);if(w.tagName!=='LABEL'&&i&&i!==w){i.click();}else w.click();};
let i=0;const go=()=>{if(i>=rows.length){done();return;}const x=rows[i++];const w=hit.has(x)?x.ab:x.pr;if(w&&!sel(w))clk(w);setTimeout(go,150);};
const done=()=>{const bad=rows.filter(x=>hit.has(x)?!sel(x.ab):(x.pr&&!sel(x.pr))).length;rows.forEach(x=>{x.r.style.outline=hit.has(x)?'3px solid #d0381a':'';});
const d=document.createElement('div');d.dir='rtl';d.style.cssText='position:fixed;z-index:2147483647;left:12px;right:12px;bottom:12px;background:#fff;color:#111;border:2px solid #0f6b4f;border-radius:14px;padding:14px;font:16px/1.7 system-ui;box-shadow:0 8px 30px rgba(0,0,0,.25)';
d.innerHTML='<b>تم التأشير: '+hit.size+' غائبة</b> (محاطة بإطار أحمر). راجعي الأسماء ثم اضغطي «حفظ» في أسفل الصفحة.'+(bad?'<div style="color:#b42318;margin-top:6px">تنبيه: '+bad+' طالبة لم يتغير تأشيرها كما يجب — راجعيها يدويًا.</div>':'')+(miss.length?'<div style="color:#b42318;margin-top:6px">لم أجد في الصفحة: '+miss.join('، ')+' — أشّريها يدويًا.</div>':'')+(amb.length?'<div style="color:#b42318;margin-top:6px">أكثر من اسم متشابه: '+amb.join('، ')+' — أشّريها يدويًا.</div>':'')+'<div style="margin-top:8px"><button type="button" style="padding:8px 18px;border-radius:10px;border:0;background:#0f6b4f;color:#fff;font:inherit">إغلاق</button></div>';
d.querySelector('button').onclick=()=>d.remove();document.body.appendChild(d);};
go();})();
