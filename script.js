// ================================
// DOM Elements
// ================================

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");

const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

const clearCompleted =
    document.getElementById("clearCompleted");

const filterButtons =
    document.querySelectorAll(".filter");

const searchInput =
    document.getElementById("searchInput");

const sortInput =
    document.getElementById("sortInput");

const themeToggle =
    document.getElementById("themeToggle");


// ================================
// Application State
// ================================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ================================
// Local Storage
// ================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ================================
// Render Tasks
// ================================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];


    // Search

    const searchText =
        searchInput.value.toLowerCase().trim();

    if (searchText !== "") {

        filteredTasks =
            filteredTasks.filter(task =>
                task.text
                    .toLowerCase()
                    .includes(searchText)
            );

    }


    // Filter

    if (currentFilter === "active") {

        filteredTasks =
            filteredTasks.filter(
                task => !task.completed
            );

    }

    if (currentFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(
                task => task.completed
            );

    }


    // Sort

    if (sortInput.value === "newest") {

        filteredTasks.sort(
            (a, b) => b.id - a.id
        );

    }

    if (sortInput.value === "oldest") {

        filteredTasks.sort(
            (a, b) => a.id - b.id
        );

    }

    if (sortInput.value === "priority") {

        const priorityOrder = {

            high: 1,
            medium: 2,
            low: 3

        };

        filteredTasks.sort(
            (a, b) =>
                priorityOrder[a.priority] -
                priorityOrder[b.priority]
        );

    }


    // Empty state

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <li class="empty-message">
                No tasks found.
            </li>
        `;

        updateTaskCount();

        return;
    }


    // Create tasks

    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");

        li.className = "task";


        if (task.completed) {

            li.classList.add("completed");

        }


        li.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <div>

                    <span>
                        ${escapeHTML(task.text)}
                    </span>

                    <span
                        class="priority ${task.priority}"
                    >
                        ${task.priority}
                    </span>

                    ${
                        task.date
                        ? `
                            <span class="due-date">
                                Due: ${task.date}
                            </span>
                          `
                        : ""
                    }

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(li);

    });


    updateTaskCount();

}


// ================================
// Add Task
// ================================

function addTask(
    text,
    priority,
    date
) {

    const newTask = {

        id: Date.now(),

        text: text,

        priority: priority,

        date: date,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();

    renderTasks();

}


// ================================
// Toggle Task
// ================================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {

                ...task,

                completed:
                    !task.completed

            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

}


// ================================
// Delete Task
// ================================

function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );

    saveTasks();

    renderTasks();

}


// ================================
// Edit Task
// ================================

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {

        return;

    }


    const newText =
        prompt(
            "Edit your task:",
            task.text
        );


    if (newText === null) {

        return;

    }


    const trimmedText =
        newText.trim();


    if (trimmedText === "") {

        return;

    }


    task.text = trimmedText;

    saveTasks();

    renderTasks();

}


// ================================
// Task Counter
// ================================

function updateTaskCount() {

    const remainingTasks =
        tasks.filter(
            task => !task.completed
        ).length;


    if (remainingTasks === 1) {

        taskCount.textContent =
            "1 task remaining";

    } else {

        taskCount.textContent =
            `${remainingTasks} tasks remaining`;

    }

}


// ================================
// Clear Completed
// ================================

clearCompleted.addEventListener(
    "click",
    function () {

        tasks =
            tasks.filter(
                task => !task.completed
            );

        saveTasks();

        renderTasks();

    }
);


// ================================
// Add Task Form
// ================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const text =
            taskInput.value.trim();

        const priority =
            priorityInput.value;

        const date =
            dateInput.value;


        if (text === "") {

            return;

        }


        addTask(
            text,
            priority,
            date
        );


        taskInput.value = "";

        priorityInput.value =
            "medium";

        dateInput.value = "";

    }
);


// ================================
// Filters
// ================================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            this.classList.add("active");


            currentFilter =
                this.dataset.filter;


            renderTasks();

        }
    );

});


// ================================
// Search
// ================================

searchInput.addEventListener(
    "input",
    renderTasks
);


// ================================
// Sort
// ================================

sortInput.addEventListener(
    "change",
    renderTasks
);


// ================================
// Dark Mode
// ================================

function loadTheme() {

    const darkMode =
        localStorage.getItem("darkMode");


    if (darkMode === "true") {

        document.body.classList.add("dark");

        themeToggle.textContent =
            "☀️ Light Mode";

    } else {

        document.body.classList.remove("dark");

        themeToggle.textContent =
            "🌙 Dark Mode";

    }

}


themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            isDark
        );


        if (isDark) {

            themeToggle.textContent =
                "☀️ Light Mode";

        } else {

            themeToggle.textContent =
                "🌙 Dark Mode";

        }

    }
);


// ================================
// Security
// ================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ================================
// Start Application
// ================================

loadTheme();

renderTasks();