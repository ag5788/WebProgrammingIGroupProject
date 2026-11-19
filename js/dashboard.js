
import { loadTasks } from "./storage.js";

// DASHBOARD - TASK MANAGEMENT APPLICATION

// STATUS COLORS
const statusColors = {
    "In Progress": "#aaa2f5",
    "In Review": "#efa9eb",
    "On Hold": "#f6c65d",
    "Completed": "#63cf7b"
};


// GET TASK STATUS
// Supports the current completed boolean.
// Also supports a future status field.

function getTaskStatus(task) {

    if (task.completed === true) {
        return "Completed";
    }

    const validStatuses = [
        "In Progress",
        "In Review",
        "On Hold"
    ];

    if (validStatuses.includes(task.status)) {
        return task.status;
    }

    return "In Progress";
}


// UPDATE DASHBOARD

function updateDashboard() {

    // Load tasks from localStorage
    const tasks = loadTasks();

    console.log("Dashboard loaded tasks:", tasks);

    // Count tasks by status
    const counts = {
        "In Progress": 0,
        "In Review": 0,
        "On Hold": 0,
        "Completed": 0
    };

    tasks.forEach(task => {
        const status = getTaskStatus(task);
        counts[status]++;
    });

    const total = tasks.length;


    // PROJECT SUMMARY

    setText("in-progress-count", counts["In Progress"]);
    setText("in-review-count", counts["In Review"]);
    setText("on-hold-count", counts["On Hold"]);
    setText("completed-count", counts["Completed"]);


    // TASK ACTIVITY TOTAL

    setText("total-tasks", `Total Tasks: ${total}`);


    // PROJECT STATISTICS

    renderStatistics([
        {
            label: "In Progress",
            count: counts["In Progress"]
        },
        {
            label: "In Review",
            count: counts["In Review"]
        },
        {
            label: "On Hold",
            count: counts["On Hold"]
        },
        {
            label: "Completed",
            count: counts["Completed"]
        }
    ]);


    // DISPLAY SAVED TASKS

    renderTaskActivity(tasks);
}


// UPDATE TEXT SAFELY

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


// PROJECT STATISTICS - VERTICAL BAR GRAPH

function renderStatistics(data) {

    const chart = document.getElementById(
        "statistics-chart"
    );

    if (!chart) return;

    // Clear previous graph
    chart.replaceChildren();

    // Determine Y-axis maximum
    const maxCount = Math.max(
        4,
        ...data.map(item => item.count)
    );

    // Main chart wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "bar-chart";


    // Y-AXIS NUMBERS

    const yAxis = document.createElement("div");
    yAxis.className = "y-axis";

    for (let i = maxCount; i >= 0; i--) {

        const number = document.createElement("span");
        number.textContent = i;

        yAxis.appendChild(number);
    }


    // GRAPH AREA

    const graph = document.createElement("div");
    graph.className = "graph-area";


    // HORIZONTAL GRIDLINES

    const grid = document.createElement("div");
    grid.className = "graph-grid";

    for (let i = 0; i <= maxCount; i++) {

        const line = document.createElement("div");
        line.className = "grid-line";

        line.style.bottom =
            `${(i / maxCount) * 100}%`;

        grid.appendChild(line);
    }

    graph.appendChild(grid);


    // CREATE STATUS BARS

    data.forEach(item => {

        const column = document.createElement("div");
        column.className = "bar-column";

        const bar = document.createElement("div");
        bar.className = "vertical-bar";

        // Calculate bar height
        const percentage =
            (item.count / maxCount) * 100;

        bar.style.height = `${percentage}%`;

        // Match Project Summary color
        bar.style.background =
            statusColors[item.label];

        bar.title = `${item.label}: ${item.count}`;


        // DISPLAY COUNT ABOVE BAR

        if (item.count > 0) {

            const value = document.createElement("span");
            value.className = "bar-value";

            value.textContent = item.count;

            bar.appendChild(value);
        }


        // STATUS LABEL

        const label = document.createElement("span");
        label.className = "bar-label";

        label.textContent = item.label;

        column.appendChild(bar);
        column.appendChild(label);

        graph.appendChild(column);
    });


    // DISPLAY GRAPH

    wrapper.appendChild(yAxis);
    wrapper.appendChild(graph);

    chart.appendChild(wrapper);
}


// TASK ACTIVITY - DISPLAY INDIVIDUAL TASKS

function renderTaskActivity(tasks) {

    const container = document.getElementById(
        "dashboard-task-list"
    );

    if (!container) return;

    // Clear previous tasks
    container.replaceChildren();


    // NO TASKS MESSAGE

    if (tasks.length === 0) {

        container.textContent = "No tasks created yet.";
        return;
    }


    // CREATE TASK CARDS

    tasks.forEach(task => {

        const card = document.createElement("div");
        card.className = "activity-task";

        // Get task status
        const taskStatus = getTaskStatus(task);

        // Apply status class
        const statusClass = taskStatus
            .toLowerCase()
            .replace(/\s+/g, "-");

        card.classList.add(statusClass);


        // TASK TITLE

        const title = document.createElement("h3");
        title.textContent = task.title;


        // TASK DESCRIPTION

        const description = document.createElement("p");
        description.textContent =
            task.description || "";


        // TASK STATUS

        const status = document.createElement("p");
        status.textContent =
            `Status: ${taskStatus}`;


        // TASK PRIORITY

        const priority = document.createElement("p");
        priority.textContent =
            `Priority: ${task.priority}`;


        // ADD TASK INFORMATION

        card.appendChild(title);

        if (task.description) {
            card.appendChild(description);
        }

        card.appendChild(status);
        card.appendChild(priority);


        // TASK DUE DATE

        if (task.due) {

            const date = new Date(task.due);

            if (!Number.isNaN(date.getTime())) {

                const due = document.createElement("p");

                due.textContent =
                    `Due: ${date.toLocaleString()}`;

                card.appendChild(due);
            }
        }


        // DISPLAY TASK CARD

        container.appendChild(card);
    });
}


// INITIALIZE DASHBOARD

updateDashboard();


// REFRESH WHEN RETURNING TO DASHBOARD

window.addEventListener("pageshow", updateDashboard);

window.addEventListener("focus", updateDashboard);


// REFRESH WHEN TASKS CHANGE IN ANOTHER TAB

window.addEventListener("storage", event => {

    if (event.key === "tasks") {
        updateDashboard();
    }

});
