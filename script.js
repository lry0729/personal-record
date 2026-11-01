// 数据存储
const STORAGE_KEYS = {
  diary: 'personal_diary',
  todo: 'personal_todo',
  goals: 'personal_goals'
};

// 工具函数
function loadData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function formatDate(date) {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 导航切换
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.section).classList.add('active');
  });
});

// ========== 日记 ==========
const diaryList = document.getElementById('diary-list');
const diaryTitle = document.getElementById('diary-title');
const diaryContent = document.getElementById('diary-content');

function renderDiary() {
  const diaries = loadData(STORAGE_KEYS.diary).sort((a, b) => b.date - a.date);
  diaryList.innerHTML = diaries.length === 0 
    ? '<p style="color:var(--text-muted);text-align:center;padding:2rem;">还没有日记，开始记录吧～</p>'
    : diaries.map(d => `
      <div class="item">
        <div class="actions">
          <button class="delete-btn" data-id="${d.id}">删除</button>
        </div>
        <h3>${escapeHtml(d.title || '无标题')}</h3>
        <p>${escapeHtml(d.content)}</p>
        <div class="meta">${formatDate(d.date)}</div>
      </div>
    `).join('');
  
  // 绑定删除
  diaryList.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const data = loadData(STORAGE_KEYS.diary).filter(d => d.id !== id);
      saveData(STORAGE_KEYS.diary, data);
      renderDiary();
    });
  });
}

document.getElementById('add-diary').addEventListener('click', () => {
  const title = diaryTitle.value.trim();
  const content = diaryContent.value.trim();
  if (!content) {
    alert('请填写日记内容');
    return;
  }
  const diaries = loadData(STORAGE_KEYS.diary);
  diaries.push({
    id: Date.now().toString(),
    title,
    content,
    date: Date.now()
  });
  saveData(STORAGE_KEYS.diary, diaries);
  diaryTitle.value = '';
  diaryContent.value = '';
  renderDiary();
});

// ========== 待办 ==========
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');

function renderTodo() {
  const todos = loadData(STORAGE_KEYS.todo);
  todoList.innerHTML = todos.length === 0
    ? '<p style="color:var(--text-muted);text-align:center;padding:2rem;">暂无待办事项</p>'
    : todos.map(t => `
      <div class="item todo-item ${t.done ? 'completed' : ''}">
        <input type="checkbox" data-id="${t.id}" ${t.done ? 'checked' : ''}>
        <span class="todo-text">${escapeHtml(t.text)}</span>
        <button class="delete-btn" data-id="${t.id}" style="margin-left:auto;">删除</button>
      </div>
    `).join('');
  
  // 绑定事件
  todoList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.id;
      const data = loadData(STORAGE_KEYS.todo);
      const item = data.find(t => t.id === id);
      if (item) item.done = cb.checked;
      saveData(STORAGE_KEYS.todo, data);
      renderTodo();
    });
  });
  
  todoList.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const data = loadData(STORAGE_KEYS.todo).filter(t => t.id !== id);
      saveData(STORAGE_KEYS.todo, data);
      renderTodo();
    });
  });
}

document.getElementById('add-todo').addEventListener('click', () => {
  const text = todoInput.value.trim();
  if (!text) return;
  const todos = loadData(STORAGE_KEYS.todo);
  todos.push({
    id: Date.now().toString(),
    text,
    done: false
  });
  saveData(STORAGE_KEYS.todo, todos);
  todoInput.value = '';
  renderTodo();
});

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('add-todo').click();
});

// ========== 目标 ==========
const goalsList = document.getElementById('goals-list');
const goalTitle = document.getElementById('goal-title');
const goalDesc = document.getElementById('goal-desc');

function renderGoals() {
  const goals = loadData(STORAGE_KEYS.goals).sort((a, b) => b.date - a.date);
  goalsList.innerHTML = goals.length === 0
    ? '<p style="color:var(--text-muted);text-align:center;padding:2rem;">还没有设定目标</p>'
    : goals.map(g => `
      <div class="item">
        <div class="actions">
          <button class="delete-btn" data-id="${g.id}">删除</button>
        </div>
        <h3>${escapeHtml(g.title)}</h3>
        <p>${escapeHtml(g.desc || '')}</p>
        <div class="meta">创建于 ${formatDate(g.date)}</div>
      </div>
    `).join('');
  
  goalsList.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const data = loadData(STORAGE_KEYS.goals).filter(g => g.id !== id);
      saveData(STORAGE_KEYS.goals, data);
      renderGoals();
    });
  });
}

document.getElementById('add-goal').addEventListener('click', () => {
  const title = goalTitle.value.trim();
  const desc = goalDesc.value.trim();
  if (!title) {
    alert('请填写目标标题');
    return;
  }
  const goals = loadData(STORAGE_KEYS.goals);
  goals.push({
    id: Date.now().toString(),
    title,
    desc,
    date: Date.now()
  });
  saveData(STORAGE_KEYS.goals, goals);
  goalTitle.value = '';
  goalDesc.value = '';
  renderGoals();
});

// XSS 防护
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 初始化
renderDiary();
renderTodo();
renderGoals();
