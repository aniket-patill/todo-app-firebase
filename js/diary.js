// js/diary.js

import { db } from './firebase.js';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { showToast, showConfirm } from './ui.js';
import { getCurrentUser } from './auth.js';

// DOM Elements
const diaryForm = document.getElementById('diary-form');
const diaryTitle = document.getElementById('diary-title');
const diaryContent = document.getElementById('diary-content');
const diaryList = document.getElementById('diary-list');
const diaryEmptyState = document.getElementById('diary-empty-state');

let unsubscribeDiary = null;

export function initDiary(user) {
  if (!user) {
    if (unsubscribeDiary) unsubscribeDiary();
    unsubscribeDiary = null;
    diaryList.innerHTML = '';
    return;
  }

  // Define Firestore Query
  const diaryRef = collection(db, `users/${user.uid}/diary`);
  const q = query(diaryRef, orderBy('createdAt', 'desc'));

  // Listen to entries in real-time
  unsubscribeDiary = onSnapshot(q, (snapshot) => {
    diaryList.innerHTML = '';
    
    if (snapshot.empty) {
      diaryEmptyState.classList.remove('hidden');
    } else {
      diaryEmptyState.classList.add('hidden');
      
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const dateObj = data.createdAt ? data.createdAt.toDate() : new Date();
        const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        const div = document.createElement('div');
        div.className = 'diary-entry';
        
        div.innerHTML = `
          <div class="diary-header">
            <div>
              <h4 class="diary-title-text"></h4>
              <span class="diary-date">${formattedDate}</span>
            </div>
            <button class="btn-icon delete-diary-btn" title="Delete Entry"><i class="fas fa-trash-alt text-danger"></i></button>
          </div>
          <div class="diary-body"></div>
        `;
        
        // Securely map user text
        div.querySelector('.diary-title-text').textContent = data.title;
        div.querySelector('.diary-body').textContent = data.content;
        
        // Setup Delete Logic
        div.querySelector('.delete-diary-btn').addEventListener('click', () => {
          showConfirm('Are you sure you want to delete this diary entry?', async () => {
            try {
              await deleteDoc(doc(db, `users/${user.uid}/diary`, docSnap.id));
              showToast('Diary entry deleted.');
            } catch (err) {
              showToast('Failed to delete entry.', 'error');
            }
          });
        });
        
        diaryList.appendChild(div);
      });
    }
  });

  // Attach Submission Logic
  diaryForm.onsubmit = async (e) => {
    e.preventDefault();
    const title = diaryTitle.value.trim();
    const content = diaryContent.value.trim();
    
    if (!title || !content) return;
    
    try {
      await addDoc(collection(db, `users/${user.uid}/diary`), {
        title,
        content,
        createdAt: serverTimestamp()
      });
      
      // Clear form perfectly
      diaryTitle.value = '';
      diaryContent.value = '';
      showToast('Diary entry saved!');
    } catch(err) {
      showToast('Failed to save diary entry.', 'error');
      console.error(err);
    }
  };
}
