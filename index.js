document.addEventListener('DOMContentLoaded', function () {
    setDateToToday(); // Set the date input to today

    var storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (storedTasks.length) {
        storedTasks.forEach(function (task) {
            tasks.push(task);
        });
        updateTaskList();
        updateStats();
    }

    var dateInput = document.getElementById("date-time");
    dateInput.addEventListener("change", function () {
        updateTaskList();
        updateStats();
    }); // Update task list and stats when date changes

    document.getElementById("prev-page").addEventListener("click", prevPage);
    document.getElementById("next-page").addEventListener("click", nextPage);
});

var currentPage = 1;
var tasksPerPage = 5;

function setDateToToday() {
    var dateInput = document.getElementById("date-time");
    var today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

var tasks = [];

function saveTask() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

var addNewTask = document.getElementById("add-task");
addNewTask.addEventListener("click", function (e) {
    e.preventDefault();
    addATask();
});

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTask();
}

function editTask(index) {
    var taskInput = document.getElementById("task-input");
    taskInput.value = tasks[index].text;
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTask();
}

function updateStats() {
    var selectedDate = document.getElementById("date-time").value;
    var filteredTasks = selectedDate 
        ? tasks.filter(function (task) {
            return new Date(task.date).toISOString().split('T')[0] === selectedDate;
        }) 
        : tasks;

    var taskCompleted = filteredTasks.filter(function (task) {
        return task.complete;
    }).length;
    var totalTasks = filteredTasks.length;
    var progress = totalTasks > 0 ? (taskCompleted / totalTasks) * 100 : 0;

    var progressBar = document.getElementById('progress');
    progressBar.style.width = progress + '%';

    document.getElementById('numbers').innerText = taskCompleted + ' / ' + totalTasks;
}

function addATask() {
    var currentDate = new Date().toLocaleDateString();
    var inputTask = document.getElementById("task-input");
    var task = inputTask.value;
    
    if (task.length > 0) {
        tasks.push({ text: task, complete: false, date: currentDate });
    }
    inputTask.value = "";
    updateTaskList();
    updateStats();
    saveTask();
}

function updateTaskList() {
    var taskslist = document.getElementById("task-UL");
    taskslist.innerHTML = "";

    var selectedDate = document.getElementById("date-time").value;
    var filteredTasks = selectedDate 
        ? tasks.filter(function (task) {
            return new Date(task.date).toISOString().split('T')[0] === selectedDate;
        }) 
        : tasks;

    var start = (currentPage - 1) * tasksPerPage;
    var end = start + tasksPerPage;
    var paginatedTasks = filteredTasks.slice(start, end);

    paginatedTasks.forEach(function (task, index) {
        var taskItem = document.createElement("li");
        taskItem.className = "flex items-center justify-between gap-3";
        taskItem.innerHTML = `
            <input class="peer flex items-center justify-evenly gap-2" type="checkbox" name="checkbox-item" id="checkbox-item-${start + index}">
            <label class="flex flex-grow items-center justify-left peer-checked:line-through peer-checked:text-green-500" for="checkbox-item-${start + index}">${task.text}</label>
            <label for="date">${task.date}</label>
            <div class="flex items-center justify-center flex-col">
                <button onclick="editTask(${start + index})"> <i class="fa-solid fa-pen text-green-500"></i> </button>
                <button onclick="deleteTask(${start + index})"> <i class="fa-solid fa-trash-can text-[var(--pink-color)]"></i> </button>
            </div>
        `;

        var checkbox = taskItem.querySelector("#checkbox-item-" + (start + index));
        checkbox.checked = task.complete;
        checkbox.addEventListener('change', function () {
            task.complete = checkbox.checked;
            if (checkbox.checked) {
                taskItem.querySelector("label[for='checkbox-item-"+(start + index)+"']").classList.add("line-through", "text-green-500");
            } else {
                taskItem.querySelector("label[for='checkbox-item-"+(start + index)+"']").classList.remove("line-through", "text-green-500");
            }
            saveTask();
            updateStats();
        });

        taskslist.append(taskItem);
    });
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateTaskList();
    }
}

function nextPage() {
    var selectedDate = document.getElementById("date-time").value;
    var filteredTasks = selectedDate 
        ? tasks.filter(function (task) {
            return new Date(task.date).toISOString().split('T')[0] === selectedDate;
        }) 
        : tasks;

    var totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateTaskList();
    }
}
