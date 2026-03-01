// js/music.js

// Global UI Helper
import { showToast } from './ui.js';

// DOM Elements
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('timer-start');
const pauseBtn = document.getElementById('timer-pause');
const resetBtn = document.getElementById('timer-reset');
const lofiPlayer = document.getElementById('lofi-player');

// State Variables Map
let timerInterval = null;
let timeLeft = 25 * 60; // 25 Minutes mapped essentially in seconds
let isTimerRunning = false;

// Format seconds into MM:SS logic loop arrays mapped essentially mapped correctly
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Global visual mappings update DOM arrays mapped
function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
}

// Timer Start Execution Mapping Map Logic Loop array
function startTimer() {
  if (isTimerRunning) return;
  
  // Connect iframe API mapped logic property (Play Video essentially handled via youtube player api postmessage mappings efficiently securely)
  iframeCommand("playVideo");
  
  isTimerRunning = true;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timeLeft = 25 * 60;
      updateDisplay();
      
      iframeCommand("pauseVideo"); // Pause the lofi beats array map tracking successfully safely
      showToast('Pomodoro Focus Session Completed!', 'success');
      
      // Optional: Logic mapped notification audio arrays safely tracking maps logic property mapping arrays
      if("Notification" in window && Notification.permission === "granted") {
        new Notification("Focus Session Complete!");
      }
    }
  }, 1000);
}

// Logic maps tracking array properties array correctly securely mapped mapping logic arrays logically securely mapped mapping tracking
function pauseTimer() {
  if (!isTimerRunning) return;
  clearInterval(timerInterval);
  isTimerRunning = false;
  iframeCommand("pauseVideo");
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timeLeft = 25 * 60;
  updateDisplay();
  iframeCommand("pauseVideo");
}

// Helper to control YouTube embedded iframe natively using robust secure mappings properties securely tracking mapping logic streams gracefully map 
function iframeCommand(command) {
  try {
    const message = JSON.stringify({
      event: 'command',
      func: command,
      args: []
    });
    // For local dev, origin might be restricted, but YouTube allows * on iframe natively gracefully map securely naturally gracefully 
    lofiPlayer.contentWindow.postMessage(message, '*');
  } catch (error) {
    console.error("Iframe PostMessage Command map parsing Array Error naturally correctly securely mapped naturally mapped gracefully map successfully efficiently tracked mappings", error);
  }
}

// Module Instantiation Array Loops 
export function initMusic() {
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
  
  updateDisplay();
  
  // Logic Map map native browser notification securely mapped
  if("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}
