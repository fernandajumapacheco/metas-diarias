(() => {
  'use strict';

  const STORAGE_KEY = 'metas-diarias';
  const LEGACY_DAILY_KEY = 'diario-metas-fernanda';
  const LEGACY_SIMPLE_KEY = 'metas-da-fernanda';
  const MAX_TEXT_LENGTH = 300;
  const MAX_BACKUP_BYTES = 2 * 1024 * 1024;

  const elements = {
    form: document.querySelector('#formulario'),
    input: document.querySelector('#nova-meta'),
    list: document.querySelector('#lista'),
    empty: document.querySelector('#lista-vazia'),
    counter: document.querySelector('#contador'),
    progress: document.querySelector('#barra-progresso'),
    clear: document.querySelector('#limpar'),
    finishDay: document.querySelector('#concluir-dia'),
    exportButton: document.querySelector('#exportar'),
    backupInput: document.querySelector('#arquivo-backup'),
    historyToggle: document.querySelector('#historico-toggle'),
    historyContent: document.querySelector('#historico-conteudo'),
    historyCount: document.querySelector('#historico-contagem'),
    historyList: document.querySelector('#lista-historico'),
    historyEmpty: document.querySelector('#historico-vazio'),
    date: document.querySelector('#data-atual'),
    feedback: document.querySelector('#feedback')
  };

  let state = loadState();
  let newGoalId = null;
  let justCheckedId = null;

  function todayKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function createId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  function safeParse(raw) {
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function cleanText(value) {
    return typeof value === 'string' ? value.trim().slice(0, MAX_TEXT_LENGTH) : '';
  }

  function normalizeGoal(goal) {
    if (!goal || typeof goal !== 'object') return null;
    const texto = cleanText(goal.texto);
    if (!texto) return null;
    const id = Number.isFinite(Number(goal.id)) ? Number(goal.id) : createId();
    const feita = Boolean(goal.feita ?? goal.concluida);
    return { id, texto, feita };
  }

  function normalizeHistoryItem(item) {
    if (!item || typeof item !== 'object' || !/^\d{4}-\d{2}-\d{2}$/.test(String(item.data || ''))) return null;
    const total = Math.max(0, Number.parseInt(item.total, 10) || 0);
    const feitas = Math.min(total, Math.max(0, Number.parseInt(item.feitas, 10) || 0));
    return { data: String(item.data), total, feitas, finalizado: Boolean(item.finalizado) };
  }

  function isNewStateShape(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value) && /^\d{4}-\d{2}-\d{2}$/.test(String(value.dia || '')) && Array.isArray(value.metas) && Array.isArray(value.historico));
  }

  function normalizeState(value) {
    const normalized = {
      dia: /^\d{4}-\d{2}-\d{2}$/.test(String(value?.dia || '')) ? String(value.dia) : todayKey(),
      metas: Array.isArray(value?.metas) ? value.metas.map(normalizeGoal).filter(Boolean) : [],
      historico: Array.isArray(value?.historico) ? value.historico.map(normalizeHistoryItem).filter(Boolean) : []
    };
    normalized.historico = dedupeHistory(normalized.historico);
    return normalized;
  }

  function dedupeHistory(items) {
    const byDate = new Map();
    for (const item of items) byDate.set(item.data, item);
    return [...byDate.values()].sort((a, b) => b.data.localeCompare(a.data));
  }

  function upsertHistory(record) {
    state.historico = dedupeHistory([...state.historico.filter(item => item.data !== record.data), record]);
  }

  function migrateLegacy() {
    const legacyDaily = safeParse(localStorage.getItem(LEGACY_DAILY_KEY));
    const legacySimple = safeParse(localStorage.getItem(LEGACY_SIMPLE_KEY));
    const today = todayKey();

    if (legacyDaily && typeof legacyDaily === 'object' && !Array.isArray(legacyDaily)) {
      const migrated = { dia: today, metas: [], historico: [] };
      for (const [date, record] of Object.entries(legacyDaily)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !record || typeof record !== 'object') continue;
        const metas = Array.isArray(record.metas) ? record.metas.map(normalizeGoal).filter(Boolean) : [];
        if (date === today) {
          migrated.metas = metas;
        } else if (metas.length || record.concluido) {
          migrated.historico.push({
            data: date,
            total: metas.length,
            feitas: metas.filter(meta => meta.feita).length,
            finalizado: Boolean(record.concluido)
          });
        }
      }
      migrated.historico = dedupeHistory(migrated.historico);
      if (persist(migrated)) {
        localStorage.removeItem(LEGACY_DAILY_KEY);
        localStorage.removeItem(LEGACY_SIMPLE_KEY);
      }
      return migrated;
    }

    if (Array.isArray(legacySimple)) {
      const migrated = { dia: today, metas: legacySimple.map(normalizeGoal).filter(Boolean), historico: [] };
      if (persist(migrated)) localStorage.removeItem(LEGACY_SIMPLE_KEY);
      return migrated;
    }

    return { dia: today, metas: [], historico: [] };
  }

  function persist(value = state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return true;
    } catch {
      announce('Não foi possível salvar os dados neste navegador.');
      return false;
    }
  }

  function loadState() {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY));
    const loaded = isNewStateShape(stored) ? normalizeState(stored) : migrateLegacy();
    rollToToday(loaded);
    persist(loaded);
    return loaded;
  }

  function rollToToday(target) {
    const today = todayKey();
    if (target.dia === today) return;

    if (target.metas.length > 0) {
      const record = {
        data: target.dia,
        total: target.metas.length,
        feitas: target.metas.filter(meta => meta.feita).length,
        finalizado: false
      };
      target.historico = dedupeHistory([...target.historico.filter(item => item.data !== record.data), record]);
    }

    target.dia = today;
    target.metas = [];
  }

  function formatHeaderDate() {
    const parts = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    return parts.replace('-feira', '').toLocaleUpperCase('pt-BR');
  }

  function dateFromKey(key) {
    return new Date(`${key}T12:00:00`);
  }

  function formatHistoryDate(key) {
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(dateFromKey(key));
  }

  function announce(message) {
    elements.feedback.textContent = '';
    window.requestAnimationFrame(() => { elements.feedback.textContent = message; });
  }

  function render() {
    renderGoals();
    renderProgress();
    renderHistory();
  }

  function renderGoals() {
    elements.list.replaceChildren();
    elements.empty.hidden = state.metas.length > 0;

    for (const goal of state.metas) {
      const item = document.createElement('li');
      item.className = `goal-card${goal.feita ? ' is-done' : ''}${goal.id === newGoalId ? ' is-new' : ''}`;
      item.dataset.id = String(goal.id);

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = `goal-toggle${goal.id === justCheckedId && goal.feita ? ' just-checked' : ''}`;
      toggle.setAttribute('aria-pressed', String(goal.feita));
      toggle.setAttribute('aria-label', `${goal.feita ? 'Desmarcar' : 'Concluir'} meta: ${goal.texto}`);
      toggle.dataset.action = 'toggle';
      toggle.dataset.id = String(goal.id);

      const circle = document.createElement('span');
      circle.className = 'goal-circle';
      circle.textContent = '✓';
      circle.setAttribute('aria-hidden', 'true');
      toggle.appendChild(circle);

      const text = document.createElement('span');
      text.className = 'goal-text';
      text.textContent = goal.texto;

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'delete-goal';
      deleteButton.textContent = 'Excluir';
      deleteButton.dataset.action = 'delete';
      deleteButton.dataset.id = String(goal.id);
      deleteButton.setAttribute('aria-label', `Excluir meta: ${goal.texto}`);

      const sparkles = document.createElement('span');
      sparkles.className = 'goal-sparkles';
      sparkles.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 3; i += 1) {
        const sparkle = document.createElement('i');
        sparkle.textContent = '✦';
        sparkles.appendChild(sparkle);
      }

      item.append(toggle, text, deleteButton, sparkles);
      elements.list.appendChild(item);

      if (goal.id === justCheckedId && goal.feita) {
        window.requestAnimationFrame(() => item.classList.add('celebrate'));
      }
    }

    newGoalId = null;
    justCheckedId = null;
  }

  function renderProgress() {
    const total = state.metas.length;
    const done = state.metas.filter(goal => goal.feita).length;
    const percentage = total ? (done / total) * 100 : 0;
    elements.counter.textContent = `${done} de ${total} concluídas ✦`;
    elements.progress.style.width = `${percentage}%`;
    elements.clear.disabled = done === 0;
    elements.finishDay.disabled = total === 0;
  }

  function renderHistory() {
    const history = [...state.historico].sort((a, b) => b.data.localeCompare(a.data));
    const count = history.length;
    elements.historyCount.textContent = `${count} ${count === 1 ? 'dia' : 'dias'}`;
    elements.historyList.replaceChildren();
    elements.historyEmpty.hidden = count > 0;

    for (const record of history) {
      const item = document.createElement('li');
      item.className = 'history-row';

      const date = document.createElement('span');
      date.className = 'history-date';
      date.textContent = formatHistoryDate(record.data);

      const status = document.createElement('span');
      status.className = 'history-status';
      status.textContent = record.finalizado ? `${record.feitas} de ${record.total} · dia finalizado ` : `${record.feitas} de ${record.total} concluídas`;
      if (record.finalizado) {
        const sparkle = document.createElement('span');
        sparkle.className = 'history-finished';
        sparkle.textContent = '✦';
        sparkle.setAttribute('aria-hidden', 'true');
        status.appendChild(sparkle);
      }

      item.append(date, status);
      elements.historyList.appendChild(item);
    }
  }

  function addGoal(text) {
    const cleaned = cleanText(text);
    if (!cleaned) return;
    const goal = { id: createId(), texto: cleaned, feita: false };
    state.metas.push(goal);
    newGoalId = goal.id;
    persist();
    render();
    announce('Meta adicionada.');
  }

  function toggleGoal(id) {
    const goal = state.metas.find(item => item.id === id);
    if (!goal) return;
    goal.feita = !goal.feita;
    justCheckedId = goal.feita ? goal.id : null;
    persist();
    render();
    announce(goal.feita ? 'Meta concluída.' : 'Meta marcada como pendente.');
  }

  function deleteGoal(id) {
    const before = state.metas.length;
    state.metas = state.metas.filter(item => item.id !== id);
    if (state.metas.length === before) return;
    persist();
    render();
    announce('Meta excluída.');
  }

  function clearCompleted() {
    const completed = state.metas.filter(goal => goal.feita).length;
    if (!completed) return;
    state.metas = state.metas.filter(goal => !goal.feita);
    persist();
    render();
    announce(`${completed} ${completed === 1 ? 'meta concluída removida' : 'metas concluídas removidas'}.`);
  }

  function finishDay() {
    if (!state.metas.length) return;
    const record = {
      data: state.dia,
      total: state.metas.length,
      feitas: state.metas.filter(goal => goal.feita).length,
      finalizado: true
    };
    upsertHistory(record);
    state.metas = [];
    persist();
    elements.finishDay.classList.remove('celebrate');
    void elements.finishDay.offsetWidth;
    elements.finishDay.classList.add('celebrate');
    window.setTimeout(() => elements.finishDay.classList.remove('celebrate'), 600);
    render();
    announce('Dia concluído ✦');
  }

  function exportBackup() {
    const backup = JSON.stringify(state, null, 2);
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `metas-diarias-backup-${todayKey()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    announce('Backup salvo.');
  }

  function validateBackup(value) {
    if (!isNewStateShape(value)) throw new Error('Formato inválido');
    const normalized = normalizeState(value);
    if (normalized.metas.length > 5000 || normalized.historico.length > 5000) throw new Error('Backup grande demais');
    return normalized;
  }

  async function restoreBackup(file) {
    if (!file) return;
    if (file.size > MAX_BACKUP_BYTES) throw new Error('O arquivo de backup é grande demais.');
    const parsed = safeParse(await file.text());
    if (!parsed) throw new Error('Esse arquivo não contém JSON válido.');
    const restored = validateBackup(parsed);
    rollToToday(restored);
    state = restored;
    persist();
    render();
    announce('Backup restaurado com sucesso.');
  }

  elements.form.addEventListener('submit', event => {
    event.preventDefault();
    addGoal(elements.input.value);
    elements.input.value = '';
    elements.input.focus();
  });

  elements.list.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = Number(button.dataset.id);
    if (!Number.isFinite(id)) return;
    if (button.dataset.action === 'toggle') toggleGoal(id);
    if (button.dataset.action === 'delete') deleteGoal(id);
  });

  elements.clear.addEventListener('click', clearCompleted);
  elements.finishDay.addEventListener('click', finishDay);
  elements.exportButton.addEventListener('click', exportBackup);

  elements.backupInput.addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await restoreBackup(file);
    } catch (error) {
      window.alert(error?.message || 'Esse arquivo não é um backup válido das metas.');
      announce('Não foi possível restaurar o backup.');
    } finally {
      event.target.value = '';
    }
  });

  elements.historyToggle.addEventListener('click', () => {
    const expanded = elements.historyToggle.getAttribute('aria-expanded') === 'true';
    elements.historyToggle.setAttribute('aria-expanded', String(!expanded));
    elements.historyContent.hidden = expanded;
  });

  elements.date.textContent = formatHeaderDate();
  render();
})();
