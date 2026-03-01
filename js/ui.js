// js/ui.js

// --- Global UI Helpers ---

// Toast Notifications
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Remove toast after animation
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Screen Routing (Auth vs App vs Loading)
export function showScreen(screenId) {
  document.getElementById('loading-screen').classList.add('hidden');
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.add('hidden');
  
  document.getElementById(screenId).classList.remove('hidden');
}

// Switch Sidebar Views
export function switchView(viewId) {
  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  
  // Show target view
  const targetView = document.getElementById(`view-${viewId}`);
  if(targetView) targetView.classList.remove('hidden');
  
  // Update sidebar active link state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if(link.getAttribute('data-view') === viewId) {
      link.classList.add('active');
    }
  });
}

// Dark/Light Mode Toggle
export function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle('dark-mode');
  
  // Switch icon
  const icon = document.querySelector('#theme-toggle i');
  if(isDark) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
}

// Load persisted theme
export function initTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.querySelector('#theme-toggle i').classList.replace('fa-moon', 'fa-sun');
  }
}

// Global Custom Confirm Dialog
export function showConfirm(message, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  const msgEl = document.getElementById('confirm-message');
  const cancelBtn = document.getElementById('confirm-cancel');
  const okBtn = document.getElementById('confirm-ok');
  
  msgEl.textContent = message;
  modal.classList.remove('hidden');
  
  // Remove past listeners by replacing node
  const newCancel = cancelBtn.cloneNode(true);
  cancelBtn.replaceWith(newCancel);
  
  const newOk = okBtn.cloneNode(true);
  okBtn.replaceWith(newOk);
  
  newCancel.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  newOk.addEventListener('click', () => {
    modal.classList.add('hidden');
    onConfirm();
  });
}
