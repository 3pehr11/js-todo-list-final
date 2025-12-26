// ===== DOM Elements =====
const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");
const statsEl = document.querySelector("#stats");
const filterButtons = document.querySelectorAll("[data-filter]");
const clearCompletedBtn = document.querySelector("#clearCompleted");
const themeToggle = document.querySelector("#themeToggle");

// ===== App State =====
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";
const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const renderTodos = () => {
    todoList.innerHTML = "";
  
    let filteredTodos = todos;
  
    if (currentFilter === "active") {
      filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === "completed") {
      filteredTodos = todos.filter(todo => todo.completed);
    }
  
    filteredTodos.forEach(todo => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      if (todo.completed) li.classList.add("completed");
  
      const span = document.createElement("span");
      span.textContent = todo.text;
      span.className = "todo-text";
      span.dataset.id = todo.id;
  
      const btnGroup = document.createElement("div");
  
      const doneBtn = document.createElement("button");
      doneBtn.className = "btn btn-sm btn-success me-2";
      doneBtn.textContent = "Done";
  
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-sm btn-danger";
      deleteBtn.textContent = "Delete";
  
      btnGroup.append(doneBtn, deleteBtn);
      li.append(span, btnGroup);
      todoList.appendChild(li);
  
      // Toggle Complete
      doneBtn.addEventListener("click", () => toggleTodo(todo.id));
  
      // Delete
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));
    });
  
    updateStats();
  };
  const addTodo = () => {
    const text = todoInput.value.trim();
    if (!text) return;
  
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
  
    todos = [...todos, newTodo];
    todoInput.value = "";
  
    saveTodos();
    renderTodos();
  };
  
  addBtn.addEventListener("click", addTodo);
  
  todoInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTodo();
  });
  const toggleTodo = id => {
    todos = todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    );
  
    saveTodos();
    renderTodos();
  };
  const deleteTodo = id => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
  };
  const updateStats = () => {
    const completedCount = todos.reduce(
      (count, todo) => (todo.completed ? count + 1 : count),
      0
    );
  
    statsEl.textContent = `${completedCount} / ${todos.length} completed`;
  };
  renderTodos();
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
  
      currentFilter = btn.dataset.filter;
      renderTodos();
    });
  });
  clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
  });
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light";
  }
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  
    themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  });
                