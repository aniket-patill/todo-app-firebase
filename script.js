// script.js

// --- DOM Elements Selection ---
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const clearAllBtn = document.getElementById('clear-all-btn');

// Stats Elements
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const remainingTasksEl = document.getElementById('remaining-tasks');

// --- Global State ---
// Array to hold our task objects: { id: string, text: string, completed: boolean }
let tasks = [];

// --- Initialization ---
// Called when the application starts
const init = () => {
  loadTasks();
  renderTasks();
  setupEventListeners();
};

// --- Event Listeners Setup ---
const setupEventListeners = () => {
  // Add task on "Add" button click
  addBtn.addEventListener('click', handleAddTask);

  // Add task on "Enter" key press within the input field
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  });

  // Clear all tasks
  clearAllBtn.addEventListener('click', handleClearAllTasks);
};

// --- Task Interaction Handlers ---

// Handles adding a new task to the list
const handleAddTask = () => {
  const taskText = taskInput.value.trim();
  
  // Requirement: Prevent empty tasks from being added
  if (taskText === '') {
    return;
  }

  // Create a new task object uniquely identified by a timestamp
  const newTask = {
    id: Date.now().toString(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = ''; // Clear input field after adding
  
  saveTasks();
  renderTasks();
};

// Handles toggling a task's completion status (checked/unchecked)
const toggleTaskCompletion = (taskId) => {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
};

// Handles deleting a single task from the list
const deleteTask = (taskId) => {
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasks();
  renderTasks();
};

// Handles clearing all tasks with a simple confirmation prompt
const handleClearAllTasks = () => {
  if (tasks.length === 0) return;
  
  if (confirm('Are you sure you want to completely clear your to-do list?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
};

// --- Rendering Logic ---

// Main render function: updates the UI and task list based on the global state
const renderTasks = () => {
  // Clean current list content before re-rendering
  taskList.innerHTML = '';

  // Inject tasks dynamically into the ul element
  tasks.forEach(task => {
    const li = document.createElement('li');
    // Add completed class if checked for line-through and fading styling
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    // Create inner HTML for the task item securely (escaping text)
    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task complete">
        <span class="task-text">${escapeHTML(task.text)}</span>
      </div>
      <button class="delete-btn" aria-label="Delete task">Delete</button>
    `;

    // Attach event listeners to newly created interactive elements
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(li);
  });

  updateUIStatsAndVisibility();
};

// Updates stats panel and controls the empty state message and 'Clear All' visibility
const updateUIStatsAndVisibility = () => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const remaining = total - completed;

  // Update text elements displaying stats
  totalTasksEl.textContent = `Total: ${total}`;
  completedTasksEl.textContent = `Completed: ${completed}`;
  remainingTasksEl.textContent = `Remaining: ${remaining}`;

  // Toggle empty state message according to tasks count
  if (total === 0) {
    emptyState.style.display = 'block';
    clearAllBtn.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    clearAllBtn.style.display = 'block';
  }
};

// --- LocalStorage Persistence Data Management ---

// Save tasks array safely into LocalStorage
const saveTasks = () => {
  localStorage.setItem('todo_tasks_data', JSON.stringify(tasks));
};

// Load tasks array from LocalStorage
const loadTasks = () => {
  const savedTasks = localStorage.getItem('todo_tasks_data');
  if (savedTasks) {
    try {
      tasks = JSON.parse(savedTasks);
    } catch (error) {
      console.error('Failed to parse tasks from localStorage', error);
      tasks = [];
    }
  }
};

// --- Utility Functions ---

// Simple HTML escaping helper function to protect against basic XSS attacks
const escapeHTML = (str) => {
  const element = document.createElement('div');
  element.innerText = str;
  return element.innerHTML;
};

// Bootstrap the application on script load
init();
