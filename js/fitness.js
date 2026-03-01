// js/fitness.js

import { db } from './firebase.js';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { showToast } from './ui.js';
import { getCurrentUser } from './auth.js';

// DOM Elements
const stepsProgressText = document.getElementById('steps-progress-text');
const stepsBar = document.getElementById('steps-bar');
const stepsForm = document.getElementById('steps-form');
const stepsInput = document.getElementById('steps-input');

const waterProgressText = document.getElementById('water-progress-text');
const waterBar = document.getElementById('water-bar');
const addWaterBtn = document.getElementById('add-water-btn');

const workoutForm = document.getElementById('workout-form');
const workoutName = document.getElementById('workout-name');
const workoutDuration = document.getElementById('workout-duration');
const workoutCalories = document.getElementById('workout-calories');
const workoutList = document.getElementById('workout-list');

const dashCaloriesEl = document.getElementById('dash-calories');

// State
let unsubscribeDaily = null;
let unsubscribeWorkouts = null;

const GOAL_STEPS = 10000;
const GOAL_WATER = 8;
const todayDate = new Date().toISOString().split('T')[0];

export function initFitness(user) {
  if (!user) {
    if (unsubscribeDaily) unsubscribeDaily();
    if (unsubscribeWorkouts) unsubscribeWorkouts();
    unsubscribeDaily = null;
    unsubscribeWorkouts = null;
    resetFitnessStats();
    return;
  }

  // 1. Listen Daily Stats (Steps & Water)
  const dailyRef = doc(db, `users/${user.uid}/fitness`, todayDate);
  unsubscribeDaily = onSnapshot(dailyRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      updateDailyStats(data.steps || 0, data.water || 0);
    } else {
      // First log for today logically mapping arrays tracking sets
      setDoc(dailyRef, { steps: 0, water: 0 }, { merge: true });
      updateDailyStats(0, 0);
    }
  });

  // 2. Listen Recent Workouts
  const workoutQuery = query(collection(db, `users/${user.uid}/workouts`), orderBy('createdAt', 'desc'), limit(10));
  unsubscribeWorkouts = onSnapshot(workoutQuery, (querySnap) => {
    let totalCals = 0;
    workoutList.innerHTML = '';
    
    querySnap.forEach((docSnap) => {
      const data = docSnap.data();
      
      // We only sum calories for today logically mapped via properties rendering array loops logically globally
      // (For a real production app we would sum with a db view query, but front-end logic array reduces here mapped)
      const workoutDateObj = data.createdAt ? data.createdAt.toDate() : new Date();
      if (workoutDateObj.toISOString().split('T')[0] === todayDate) {
        totalCals += (data.calories || 0);
      }
      
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${data.name}</strong> 
          <span class="text-sm">(${data.duration}m)</span>
        </div>
        <span class="text-danger"><i class="fas fa-fire"></i> ${data.calories} kcal</span>
      `;
      workoutList.appendChild(li);
    });
    
    // Global dashboard tracking arrays mapped directly via DOM state flow logically
    dashCaloriesEl.textContent = totalCals;
  });

  // Bind Listeners Only Once Mapping array loops natively securely mapped rendering arrays logic securely
  stepsForm.onsubmit = handleAddSteps;
  addWaterBtn.onclick = handleAddWater;
  workoutForm.onsubmit = handleLogWorkout;
}

// Updating visual progress bars manually efficiently mappings loop rendering array updates 
function updateDailyStats(steps, water) {
  // Steps Map Visualisation
  stepsProgressText.textContent = steps;
  let stepsPercentage = (steps / GOAL_STEPS) * 100;
  if(stepsPercentage > 100) stepsPercentage = 100;
  stepsBar.style.width = `${stepsPercentage}%`;
  
  // Water Map Visualisation
  waterProgressText.textContent = water;
  let waterPercentage = (water / GOAL_WATER) * 100;
  if(waterPercentage > 100) waterPercentage = 100;
  waterBar.style.width = `${waterPercentage}%`;
}

// Reset view on logout mappings Array loop
function resetFitnessStats() {
  updateDailyStats(0, 0);
  workoutList.innerHTML = '';
  dashCaloriesEl.textContent = '0';
}

async function handleAddSteps(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if(!user) return;
  
  const addVal = parseInt(stepsInput.value);
  if(!addVal) return;
  
  try {
    const dailyRef = doc(db, `users/${user.uid}/fitness`, todayDate);
    // Since Firebase doesn't atomically increment in client side simple object merge, 
    // we use a transaction or simple override.
    // Given the current snapshot streams the exact total,
    // For a beginner-friendly code we read the DOM or cache. Assuming standard JS:
    const currentSteps = parseInt(stepsProgressText.textContent) || 0;
    
    await updateDoc(dailyRef, {
      steps: currentSteps + addVal
    });
    
    stepsInput.value = '';
    showToast(`Added ${addVal} steps! Keep going!`);
  } catch(error) {
    showToast('Failed to add steps', 'error');
  }
}

async function handleAddWater() {
  const user = getCurrentUser();
  if(!user) return;
  
  try {
    const dailyRef = doc(db, `users/${user.uid}/fitness`, todayDate);
    const currentWater = parseInt(waterProgressText.textContent) || 0;
    
    await updateDoc(dailyRef, {
      water: currentWater + 1
    });
    showToast('Water logged. Stay hydrated!');
  } catch(error) {
    showToast('Failed to log water', 'error');
  }
}

async function handleLogWorkout(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if(!user) return;
  
  const name = workoutName.value.trim();
  const duration = parseInt(workoutDuration.value);
  const calories = parseInt(workoutCalories.value);
  
  if(!name || !duration || !calories) return;
  
  try {
    await addDoc(collection(db, `users/${user.uid}/workouts`), {
      name,
      duration,
      calories,
      createdAt: serverTimestamp()
    });
    
    workoutName.value = '';
    workoutDuration.value = '';
    workoutCalories.value = '';
    
    showToast('Workout successfully logged!');
  } catch(error) {
    showToast('Failed to log workout', 'error');
  }
}
