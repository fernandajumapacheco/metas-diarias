const form = document.querySelector('#formulario');
const input = document.querySelector('#nova-meta');
const lista = document.querySelector('#lista');
const contador = document.querySelector('#contador');
const listaHistorico = document.querySelector('#lista-historico');
const historicoVazio = document.querySelector('#historico-vazio');
const chaveHoje = new Date().toLocaleDateString('en-CA');

const metasAntigas = JSON.parse(localStorage.getItem('metas-da-fernanda') || '[]');
let diario = JSON.parse(localStorage.getItem('diario-metas-fernanda') || '{}');

if (!diario[chaveHoje]) {
  diario[chaveHoje] = { metas: metasAntigas, concluido: false };
}

localStorage.removeItem('metas-da-fernanda');

function registroHoje() {
  return diario[chaveHoje];
}

function salvar() {
  localStorage.setItem('diario-metas-fernanda', JSON.stringify(diario));
}

function formatarData(data) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' })
    .format(new Date(`${data}T12:00:00Z`));
}

function desenharHistorico() {
  listaHistorico.innerHTML = '';
  const dias = Object.keys(diario).sort().reverse();
  historicoVazio.hidden = dias.length > 0;

  dias.forEach((data) => {
    const registro = diario[data];
    const feitas = registro.metas.filter((meta) => meta.concluida).length;
    const item = document.createElement('li');
    item.className = 'dia-historico';
    item.innerHTML = `<strong>${formatarData(data)}</strong><span>${feitas} de ${registro.metas.length} concluídas${registro.concluido ? ' • dia finalizado' : ''}</span>`;
    listaHistorico.appendChild(item);
  });
}

function desenhar() {
  const metas = registroHoje().metas;
  lista.innerHTML = '';

  metas.forEach((meta, indice) => {
    const item = document.createElement('li');
    item.className = meta.concluida ? 'concluida' : '';
    item.innerHTML = '<button class="marcar" aria-label="Marcar como concluída"></button><span></span><button class="excluir">Excluir</button>';
    item.querySelector('span').textContent = meta.texto;

    item.querySelector('.marcar').onclick = () => {
      meta.concluida = !meta.concluida;
      registroHoje().concluido = false;
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

  const feitas = metas.filter((meta) => meta.concluida).length;
  contador.textContent = `${feitas} de ${metas.length} concluídas`;
  desenharHistorico();
}

form.onsubmit = (evento) => {
  evento.preventDefault();
  registroHoje().metas.push({ texto: input.value.trim(), concluida: false });
  registroHoje().concluido = false;
  input.value = '';
  salvar();
  desenhar();
};

document.querySelector('#limpar').onclick = () => {
  registroHoje().metas = registroHoje().metas.filter((meta) => !meta.concluida);
  salvar();
  desenhar();
};

document.querySelector('#concluir-dia').onclick = () => {
  registroHoje().metas.forEach((meta) => { meta.concluida = true; });
  registroHoje().concluido = true;
  salvar();
  desenhar();
};

document.querySelector('#exportar').onclick = () => {
  const arquivo = new Blob([JSON.stringify(diario, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(arquivo);
  link.download = `backup-metas-${chaveHoje}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
};

document.querySelector('#arquivo-backup').onchange = async (evento) => {
  const arquivo = evento.target.files[0];
  if (!arquivo) return;

  try {
    const restaurado = JSON.parse(await arquivo.text());
    if (!restaurado || Array.isArray(restaurado) || typeof restaurado !== 'object') throw new Error();
    diario = restaurado;
    if (!diario[chaveHoje]) diario[chaveHoje] = { metas: [], concluido: false };
    salvar();
    desenhar();
    alert('Backup restaurado com sucesso.');
  } catch {
    alert('Esse arquivo não é um backup válido das metas.');
  }
};

document.querySelector('#data-atual').textContent = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'full'
}).format(new Date());

salvar();
desenhar();
