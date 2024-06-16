var menuitem = document.querySelectorAll('.item_menu');

function selink() {
  menuitem.forEach((item) => item.classList.remove('ativo'));
  this.classList.add('ativo');
}

menuitem.forEach((item) => item.addEventListener('click', selink));

var btnexp = document.querySelector('#btn_expandir');
var menu_side = document.querySelector('.menu_lateral');

btnexp.addEventListener('click', function () {
  menu_side.classList.toggle('expandir');
});

const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoIdInput = document.querySelector('#todo-id');
const todoList = document.querySelector('#todo-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const searchInput = document.querySelector('#search-input');
const eraseBtn = document.querySelector('#erase-button');

const menuTodos = document.querySelector('#menu-todos');
const menuConcluidos = document.querySelector('#menu-concluidos');
const menuPendentes = document.querySelector('#menu-pendentes');

let oldInputValue;
let editIdValue;

// Funções
const saveTodo = (text, id, done = 0, save = 1) => {
  const todo = document.createElement('div');
  todo.classList.add('todo');
  todo.setAttribute('data-id', id);

  const todoTitle = document.createElement('h3');
  todoTitle.innerText = `${id} - ${text}`;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement('button');
  doneBtn.classList.add('finish-todo');
  doneBtn.innerHTML = '<i class="bi bi-calendar2-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement('button');
  editBtn.classList.add('edit-todo');
  editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('remove-todo');
  deleteBtn.innerHTML = '<i class="bi bi-trash3"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add('done');
  }

  if (save) {
    saveTodoLocalStorage({ text, id, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = '';
  todoIdInput.value = '';
};

const toggleForms = () => {
  editForm.classList.toggle('hide');
  todoForm.classList.toggle('hide');
  todoList.classList.toggle('hide');
};

const updateTodo = (text, id) => {
  const todos = document.querySelectorAll('.todo');

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector('h3');
    const currentId = todo.getAttribute('data-id');

    if (`${currentId} - ${todoTitle.innerText.split(' - ')[1]}` === oldInputValue) {
      todoTitle.innerText = `${id} - ${text}`;

      // Dados da localStorage
      updateTodoLocalStorage(oldInputValue.split(' - ')[1], text, id);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll('.todo');

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector('h3').innerText.toLowerCase();

    todo.style.display = 'flex';

    if (!todoTitle.includes(search)) {
      todo.style.display = 'none';
    }
  });
};

// Filtro de tarefas
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll('.todo');

  switch (filterValue) {
    case 'all':
      todos.forEach((todo) => (todo.style.display = 'flex'));
      break;

    case 'done':
      todos.forEach((todo) =>
        todo.classList.contains('done')
          ? (todo.style.display = 'flex')
          : (todo.style.display = 'none')
      );
      break;

    case 'todo':
      todos.forEach((todo) =>
        !todo.classList.contains('done')
          ? (todo.style.display = 'flex')
          : (todo.style.display = 'none')
      );
      break;

    default:
      break;
  }
};

menuTodos.addEventListener('click', () => {
  filterTodos('all');
});

menuConcluidos.addEventListener('click', (e) => {
  e.preventDefault();
  filterTodos('done');
});

menuPendentes.addEventListener('click', (e) => {
  e.preventDefault();
  filterTodos('todo');
});

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;
  const inputIdValue = todoIdInput.value;

  if (inputValue && inputIdValue) {
    saveTodo(inputValue, inputIdValue);
  }
});

document.addEventListener('click', (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest('div');
  let todoTitle;

  if (parentEl && parentEl.querySelector('h3')) {
    todoTitle = parentEl.querySelector('h3').innerText || '';
  }

  if (targetEl.classList.contains('finish-todo')) {
    parentEl.classList.toggle('done');
    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains('remove-todo')) {
    const isConfirmed = confirm(
      'Você tem certeza que deseja remover esta tarefa?'
    );

    if (isConfirmed) {
      parentEl.remove();
      removeTodoLocalStorage(todoTitle);
    }
  }

  if (targetEl.classList.contains('edit-todo')) {
    toggleForms();
    editInput.value = todoTitle.split(' - ')[1]; // Remove o ID do campo de edição
    oldInputValue = todoTitle;
    editIdValue = todoTitle.split(' - ')[0];
  }
});

cancelEditBtn.addEventListener('click', (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue, editIdValue);
  }

  toggleForms();
});

searchInput.addEventListener('keyup', (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener('click', (e) => {
  e.preventDefault();

  searchInput.value = '';

  searchInput.dispatchEvent(new Event('keyup'));
});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.id, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem('todos', JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter(
    (todo) => `${todo.id} - ${todo.text}` != todoText
  );

  localStorage.setItem('todos', JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map(
    (todo) =>
      `${todo.id} - ${todo.text}` === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem('todos', JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText, id) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText && todo.id == id ? (todo.text = todoNewText) : null
  );

  localStorage.setItem('todos', JSON.stringify(todos));
};

loadTodos();

document
  .querySelector('#menu-todos')
  .addEventListener('click', () => filterTodos('all'));
document
  .querySelector('#menu-concluidos')
  .addEventListener('click', () => filterTodos('done'));
document
  .querySelector('#menu-pendentes')
  .addEventListener('click', () => filterTodos('todo'));
