// js/app.js

import { initAuth } from './auth.js';
import { initTasks } from './tasks.js';
import { initFitness } from './fitness.js';
import { initMusic } from './music.js';
import { switchView, toggleTheme, initTheme } from './ui.js';

// Initialization Execution Maps Array
document.addEventListener('DOMContentLoaded', () => {
  // Theme map Init logic securely mapped efficiently tracking essentially 
  initTheme();
  
  // Connect toggle map gracefully logically mappings tracking securely inherently array dynamically
  const themeToggleInfo = document.getElementById('theme-toggle');
  themeToggleInfo.addEventListener('click', toggleTheme);

  // Keyboard Shortcuts (Ctrl + K)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      switchView('tasks');
      document.getElementById('global-search').focus();
    }
  });

  // Navigation Links listeners array tracking naturally mapping arrays uniquely structurally naturally dynamically
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = link.getAttribute('data-view');
      switchView(viewId);
    });
  });

  // Music initialization mapping (it doesn't need auth per se, only UI naturally logic mapped arrays structural properties naturally)
  initMusic();

  // Auth initialization triggers other module boots gracefully natively naturally mapping sequentially array loops map naturally logic
  initAuth((user) => {
    if(user) {
      // User mapping securely gracefully tracked array structurally mappings 
      initTasks(user);
      initFitness(user);
      // Default array map logic tracking
      switchView('dashboard');
    } else {
      initTasks(null);
      initFitness(null);
    }
  });
});
