// js/auth.js

import { auth } from './firebase.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { showToast, showScreen } from './ui.js';

let isSignUpMode = false;

// DOM Elements
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const submitBtn = document.getElementById('auth-submit-btn');
const authSwitchLink = document.getElementById('auth-switch-link');
const authSwitchText = document.getElementById('auth-switch-text');
const userEmailDisplay = document.getElementById('user-email-display');
const logoutBtn = document.getElementById('logout-btn');
const googleAuthBtn = document.getElementById('google-auth-btn');

// State callbacks
let userStateCallback = null;

// User Session state handling
export function initAuth(callback) {
  userStateCallback = callback;
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User logged in
      userEmailDisplay.textContent = user.email;
      showScreen('app-screen');
      showToast(`Welcome back, ${user.email.split('@')[0]}!`);
      if(userStateCallback) userStateCallback(user);
    } else {
      // User logged out
      showScreen('auth-screen');
      if(userStateCallback) userStateCallback(null);
    }
  });

  // Attach event Listeners
  authForm.addEventListener('submit', handleAuthSubmit);
  authSwitchLink.addEventListener('click', toggleAuthMode);
  logoutBtn.addEventListener('click', handleLogout);
  if(googleAuthBtn) {
    googleAuthBtn.addEventListener('click', handleGoogleAuth);
  }
}

// Handler for Google Sign In
async function handleGoogleAuth() {
  const provider = new GoogleAuthProvider();
  try {
    googleAuthBtn.disabled = true;
    googleAuthBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Please wait...';
    await signInWithPopup(auth, provider);
    // onAuthStateChanged will handle the redirect seamlessly!
  } catch (error) {
    console.error("Google Auth Error:", error);
    showToast('Google Sign-In failed or was cancelled.', 'error');
  } finally {
    googleAuthBtn.disabled = false;
    googleAuthBtn.innerHTML = '<i class="fab fa-google"></i> Continue with Google';
  }
}

// Handler for Login/Sign Up forms
async function handleAuthSubmit(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if(!email || !password) return;
  
  try {
    submitBtn.textContent = 'Please wait...';
    submitBtn.disabled = true;

    if (isSignUpMode) {
      // Sign Up Action
      await createUserWithEmailAndPassword(auth, email, password);
      // Let onAuthStateChanged handle redirect
    } else {
      // Login Action
      await signInWithEmailAndPassword(auth, email, password);
      // Let onAuthStateChanged handle redirect
    }
  } catch (error) {
    console.error("Auth Error:", error);
    // User Friendly Parsing
    let message = 'Authentication failed. Make sure your credentials are correct.';
    if(error.code === 'auth/email-already-in-use') message = 'Email already in use.';
    if(error.code === 'auth/weak-password') message = 'Password must be at least 6 characters.';
    
    showToast(message, 'error');
  } finally {
    submitBtn.textContent = isSignUpMode ? 'Sign Up' : 'Login';
    submitBtn.disabled = false;
  }
}

// Toggle between Login & Signup modes
function toggleAuthMode(e) {
  e.preventDefault();
  isSignUpMode = !isSignUpMode;
  
  if (isSignUpMode) {
    authTitle.textContent = "Create Account";
    authSubtitle.textContent = "Join the Dashboard";
    submitBtn.textContent = "Sign Up";
    authSwitchText.textContent = "Already have an account?";
    authSwitchLink.textContent = "Login";
  } else {
    authTitle.textContent = "Welcome Back";
    authSubtitle.textContent = "Login to your dashboard";
    submitBtn.textContent = "Login";
    authSwitchText.textContent = "Don't have an account?";
    authSwitchLink.textContent = "Sign Up";
  }
}

// Logout
async function handleLogout() {
  try {
    await signOut(auth);
    showToast('Logged out successfully');
  } catch (error) {
    showToast('Failed to logout', 'error');
  }
}

// Utility to grab current user object directly
export function getCurrentUser() {
  return auth.currentUser;
}
