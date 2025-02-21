const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoUL = document.getElementById('todo-list');

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodos();
});

function addTodos() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false
        }
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }
}

function updateTodoList() {
    todoUL.innerHTML = ""; // Corrected variable name
    allTodos.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex); // Added let declaration
        todoUL.append(todoItem);
    });
}

function createTodoItem(todo, todoIndex) {
    const todoLI = document.createElement('li');
    const todoText = todo.text;
    todoLI.className = "todo"
    todoLI.innerHTML = `<li class="flex items-center justify-center">
    <input class="peer h-[20px] border border-[var(--accent-color)] text-center" type="checkbox" id="${todoIndex}">
    <label for="${todoIndex}">Done</label>
    <label for="${todoIndex}" class="pl-[15px] flex-grow peer-checked:line-through ">${todoText}</label>
    <button class="delete-button py-3 px-2 rounded-lg text-[var(--accent-color)] bg-transparent outline-none hover:text-red-700 transition-all duration-500 peer-checked:text-[var(--accent-color)]">
      Delete
    </button>
  </li>`

  const deleteButton = todoLI.querySelector(".delete-button");
        deleteButton.addEventListener("click", ()=> {
        deleteTodoItem(todoIndex);
  })

  const checkbox = todoLI.querySelector("input");
  checkbox.addEventListener("change", ()=> {
      allTodos[todoIndex].completed = checkbox.checked
      saveTodos();
  })
    checkbox.checked = todo.completed;
    return todoLI;
}

function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoList();
}



function saveTodos(){
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

function getTodos () {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}
