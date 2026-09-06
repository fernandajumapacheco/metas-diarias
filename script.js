const form = document.querySelector('#formulario');
const input = document.querySelector('#nova-meta');
const lista = document.querySelector('#lista');
const contador = document.querySelector('#contador');

let metas = JSON.parse(localStorage.getItem('metas-da-fernanda') || '[]');

function salvar() {
  localStorage.setItem('metas-da-fernanda', JSON.stringify(metas));
}

function desenhar() {
  lista.innerHTML = '';

  metas.forEach((meta, indice) => {
    const item = document.createElement('li');
    item.className = meta.concluida ? 'concluida' : '';
    item.innerHTML = '<button class="marcar"></button><span></span><button class="excluir">Excluir</button>';
    item.querySelector('span').textContent = meta.texto;

    item.querySelector('.marcar').onclick = () => {
      metas[indice].concluida = !metas[indice].concluida;
      salvar();
      desenhar();
    };

    item.querySelector('.excluir').onclick = () => {
      metas.splice(indice, 1);
      salvar();
      desenhar();
    };

    lista.appendChild(item);
  });

  contador.textContent = `${metas.length} ${metas.length === 1 ? 'meta' : 'metas'}`;
}

form.onsubmit = (evento) => {
  evento.preventDefault();
  metas.push({ texto: input.value.trim(), concluida: false });
  input.value = '';
  salvar();
  desenhar();
};

document.querySelector('#limpar').onclick = () => {
  metas = metas.filter((meta) => !meta.concluida);
  salvar();
  desenhar();
};

desenhar();
