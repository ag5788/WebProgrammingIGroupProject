/**
 * Load tasks from localstorage
 * @return {Task[]} the tasks from localstorage
 */
export function loadTasks() {
    const raw = localStorage.getItem("tasks");
    if(!raw) return [];

    const parsed = JSON.parse(raw);
    let tasks = [];
    for (let task of parsed) {
        tasks.push({
            ...task,
            due: task.due && new Date(task.due)
        })
    }
    return tasks;
}

/**
 * Save tasks to localstorage, replacing current data
 * @param {Task[]} tasks The tasks to save
 */
export function saveTasks(tasks) {
    let saveTasks = [];
    for (let task of tasks) {
        saveTasks.push({
            ...task,
            due: task.due && task.due.getTime()
        });
    }
    localStorage.setItem("tasks", JSON.stringify(saveTasks));
}