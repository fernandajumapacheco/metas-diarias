const form=document.querySelector('#formulario'),input=document.querySelector('#nova-meta'),lista=document.querySelector('#lista'),contador=document.querySelector('#contador');
let metas=JSON.parse(localStorage.getItem('metas-da-fernanda')||'[]');
const salvar=()=>localStorage.setItem('metas-da-fernanda',JSON.stringify(metas));
function desenhar(){lista.innerHTML='';metas.forEach((meta,i)=>{const item=document.createElement('li');item.className=meta.concluida?'concluida':'';item.innerHTML='<button class="marcar"></button><span></span><button class="excluir">Excluir</button>';item.querySelector('span').textContent=meta.texto;item.querySelector('.marcar').onclick=()=>{metas[i].concluida=!metas[i].concluida;salvar();desenhar()};item.querySelector('.excluir').onclick=()=>{metas.splice(i,1);salvar();desenhar()};lista.appendChild(item)});contador.textContent=`${metas.length} ${metas.length===1?'meta':'metas'}`}
form.onsubmit=e=>{e.preventDefault();metas.push({texto:input.value.trim(),concluida:false});input.value='';salvar();desenhar()};
document.querySelector('#limpar').onclick=()=>{metas=metas.filter(m=>!m.concluida);salvar();desenhar()};desenhar();
