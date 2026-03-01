// js/tasks.js

import { db } from './firebase.js';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { showToast, showConfirm } from './ui.js';
import { getCurrentUser } from './auth.js';

// DOM Elements
const taskListEl = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');
const taskTitleInput = document.getElementById('task-title');
const taskDueDateInput = document.getElementById('task-due-date');
const taskPrioritySelect = document.getElementById('task-priority');
const emptyStateEl = document.getElementById('task-empty-state');
const filterBtns = document.querySelectorAll('.filter-btn');
const globalSearch = document.getElementById('global-search');
const clearAllBtn = document.getElementById('clear-all-tasks-btn');

// Stats Elements
const allCountEl = document.getElementById('task-count-total');
const remainingCountEl = document.getElementById('task-count-remaining');
const completedCountEl = document.getElementById('task-count-completed');

// Dash Stats Elements
const dashCompletedEl = document.getElementById('dash-completed-tasks');
const dashPendingEl = document.getElementById('dash-pending-tasks');

// State Variables
let tasks = [];
let unsubscribeTasks = null;
let currentFilter = 'all';
let currentSearch = '';

// Setup drag context
let draggedItem = null;

// Initialize tasks tracking
export function initTasks(user) {
  if(!user) {
    if(unsubscribeTasks) {
      unsubscribeTasks();
      unsubscribeTasks = null;
    }
    tasks = [];
    renderTasks();
    return;
  }

  const tasksRef = collection(db, `users/${user.uid}/todos`);
  const q = query(tasksRef, orderBy('createdAt', 'desc'));

  // Listen for real-time changes
  unsubscribeTasks = onSnapshot(q, (snapshot) => {
    // Array creation map logic mapped to global state
    tasks = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    
    renderTasks();
  }, (error) => {
    console.error("Task read fail:", error);
    showToast('Failed to load tasks', 'error');
  });

  // Attach event Listeners (ensure attached only once in app lifecycle)
  // By removing old listeners if needed or simple single attach flow
  addTaskForm.onsubmit = handleAddTask;
  clearAllBtn.onclick = handleClearAllTasks;
  
  // Filtering system Setup
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    };
  });
  
  // Search feature implementation logic mapped across array filters
  globalSearch.oninput = (e) => {
    currentSearch = e.target.value.toLowerCase();
    renderTasks();
  };
}

// Add New Task
async function handleAddTask(e) {
  e.preventDefault();
  
  const user = getCurrentUser();
  if(!user) return;
  
  const title = taskTitleInput.value.trim();
  const priority = taskPrioritySelect.value;
  const dueDate = taskDueDateInput.value;
  
  if(!title) return;
  
  try {
    const tasksRef = collection(db, `users/${user.uid}/todos`);
    const docRef = await addDoc(tasksRef, {
      title,
      priority,
      dueDate: dueDate || null,
      completed: false,
      createdAt: serverTimestamp()
    });
    
    // Clear Form inputs automatically to improve usability
    taskTitleInput.value = '';
    taskDueDateInput.value = '';
    taskPrioritySelect.value = 'Medium';
    
    showToast('Task added successfully!');
  } catch (error) {
    showToast('Failed to add task', 'error');
    console.error(error);
  }
}

// Status Toggle Handler
export async function toggleTaskComplete(taskId, currentStatus) {
  const user = getCurrentUser();
  if(!user) return;
  
  try {
    const taskRef = doc(db, `users/${user.uid}/todos`, taskId);
    await updateDoc(taskRef, {
      completed: !currentStatus
    });
  } catch(error) {
    showToast('Failed to update task', 'error');
  }
}

// Global Delete Function Mapping Handler logic
export async function deleteTask(taskId) {
  const user = getCurrentUser();
  if(!user) return;
  
  try {
    await deleteDoc(doc(db, `users/${user.uid}/todos`, taskId));
    showToast('Task deleted!');
  } catch(error) {
    showToast('Failed to delete task', 'error');
  }
}

// Handle Clear All confirmation using UI module logic
function handleClearAllTasks() {
  const user = getCurrentUser();
  if(!user || tasks.length === 0) return;
  
  showConfirm("Remove all tasks? This action cannot be undone.", async () => {
    try {
      // Best practice is batch delete, but loop is simple for small sets
      const promises = tasks.map(task => 
        deleteDoc(doc(db, `users/${user.uid}/todos`, task.id))
      );
      await Promise.all(promises);
      showToast('All tasks cleared.');
    } catch(err) {
      showToast('Failed to clear tasks', 'error');
    }
  });
}

// Main rendering execution flow 
function renderTasks() {
  taskListEl.innerHTML = '';
  
  // Run logical Filter and Search operations array mappings
  let filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(currentSearch);
    
    let matchesFilter = true;
    if (currentFilter === 'completed') matchesFilter = task.completed;
    if (currentFilter === 'pending') matchesFilter = !task.completed;
    if (currentFilter === 'high') matchesFilter = task.priority === 'High';
    
    return matchesSearch && matchesFilter;
  });

  // Dynamic Empty State Handling
  if (filteredTasks.length === 0) {
    emptyStateEl.classList.remove('hidden');
  } else {
    emptyStateEl.classList.add('hidden');
    
    // Map Array data into robust secure visual HTML components logic dynamically mapped
    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.draggable = true;
      li.dataset.id = task.id;
      
      const priorityClass = `priority-${task.priority}`;
      
      // We securely escape generic text data via textContent assignments instead of injection flow where applicable, 
      // but simple string literal rendering works as inputs are mapped securely natively in modern HTML parsers,
      // For ultimate security, DOM parser assignments mapped dynamically:
      li.innerHTML = `
        <div class="task-left">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
          <div class="task-info">
            <span class="task-title-text"></span>
            <div class="task-meta">
              <span class="priority-badge ${priorityClass}">${task.priority}</span>
              ${task.dueDate ? `<span><i class="fas fa-calendar-alt"></i> ${task.dueDate}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="task-actions">
          <button class="btn-icon delete-task-btn" title="Delete"><i class="fas fa-trash-alt text-danger"></i></button>
        </div>
      `;
      
      // Inject untrusted data securely mapped manually bypassing generic inject properties
      li.querySelector('.task-title-text').textContent = task.title;

      // Interaction bind map loops 
      li.querySelector('.task-checkbox').addEventListener('change', () => toggleTaskComplete(task.id, task.completed));
      li.querySelector('.delete-task-btn').addEventListener('click', () => deleteTask(task.id));
      
      // Drag & Drop
      li.addEventListener('dragstart', handleDragStart);
      li.addEventListener('dragover', handleDragOver);
      li.addEventListener('drop', handleDrop);
      li.addEventListener('dragend', handleDragEnd);

      taskListEl.appendChild(li);
    });
  }

  updateTaskStats();
}

function updateTaskStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  
  // Dashboard Update
  allCountEl.textContent = total;
  completedCountEl.textContent = completed;
  remainingCountEl.textContent = pending;
  
  // System Main Dashboard Stat Mappings
  dashCompletedEl.textContent = completed;
  dashPendingEl.textContent = pending;
}

// Drag & Drop logic Mapping Systems Arrays handling local visually mapped data structures exclusively primarily 
function handleDragStart(e) {
  draggedItem = this;
  setTimeout(() => this.style.opacity = '0.5', 0);
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const target = e.target.closest('.task-item');
  if(target && target !== draggedItem) {
    // Basic sorting visualization mapping algorithm (complex server re-order would require order logic index maps mapped to db arrays dynamically mapped natively)
    taskListEl.insertBefore(draggedItem, target.nextSibling); 
  }
}

function handleDrop(e) {
  e.stopPropagation();
}

function handleDragEnd() {
  this.style.opacity = '1';
  draggedItem = null;
}
