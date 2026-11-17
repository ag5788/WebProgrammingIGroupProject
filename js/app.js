import {loadTasks, saveTasks} from "./storage.js";


// I, Aiden, am using JSDoc for type definitions here.
// I prefer TypeScript, but I assume that wouldn't be allowed for this class.
/**
 * In-memory representation of tasks
 * @typedef {Object} Task
 * @property {string} id - The internal ID of the task
 * @property {string} title - The title of the task
 * @property {string} [description] - The description of the task
 * @property {Date} [due] - The timestamp of the due date of the task
 * @property {number} priority - The priority of the task
 * @property {boolean} completed - If the task is marked completed or not
 */

/**
 * @type {Task[]}
 */
let tasks = [];

/**
 * Renders the tasks to the UI
 */
function renderTasks() {
    let html = "";
    for (let task of tasks) {
        html += `
        <div class="task ${task.completed ? 'completed' : ''}">
            <div class="title">${escapeHtml(task.title)}</div>
            <div class="description">${escapeHtml(task.description || "")}</div>
            <div class="priority">Priority: ${escapeHtml(task.priority+"")}</div>
            ${task.due ? `<div class="due">Due: ${escapeHtml(task.due.toLocaleString())}</div>` : ''}
            <button class="delete" onclick='deleteTask(${JSON.stringify(task.id)})'>X</button>
            <button class="delete" onclick='completed(${JSON.stringify(task.id)}, ${!task.completed})'>
                ${task.completed ? "Un-Complete" : "Complete"}
            </button>
        </div>
        `;
    }
    document.getElementById("tasks").innerHTML = html;
}

/**
 * @param {string} id
 */
window.deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
    renderTasks();
}

window.completed = (id, completed) => {
    const index = tasks.findIndex(task => task.id === id);
    if(index === -1) return;
    tasks[index].completed = completed;
    saveTasks(tasks);
    renderTasks();
}

/**
 * @param {string} dirty
 * @return {string} clean
 */
function escapeHtml(dirty) {
    const span = document.createElement("span");
    span.innerText = dirty;
    return span.innerHTML;
}

document.getElementById("create-task").onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementsByName("title")[0];
    const description = document.getElementsByName("description")[0];
    const due = document.getElementsByName("due")[0];
    const priority = document.getElementsByName("priority")[0];

    const id = Date.now().toString(36);

    /**
     * @type {Task}
     */
    const newTask = {
        id,
        title: title.value,
        description: description.value || undefined,
        due: (due.value && new Date(due.value)) || undefined,
        priority: Number(priority.value),
        completed: false,
    }

    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();

    title.value = "";
    description.value = "";
    due.value = "";
    priority.value = "1";
}


tasks = loadTasks();
renderTasks();