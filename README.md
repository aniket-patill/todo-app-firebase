# Productivity Dashboard Web App

A powerful, modern, and responsive productivity dashboard built entirely with HTML, CSS (Glassmorphism), Vanilla JavaScript (ES6 modules), and Firebase. No frontend frameworks like React or Vue are required.

![Dashboard Preview](https://via.placeholder.com/800x400.png?text=Productivity+Dashboard+Preview)

## ✨ Core Features

* **Secure Authentication:** Email/Password and Google Sign-in integration via Firebase Auth.
* **Real-time Synchronization:** Instant UI updates and secure data persistence using Firestore `onSnapshot`.
* **Dark & Light Mode Themes:** Beautiful aesthetic themes controlled seamlessly with native CSS variables and LocalStorage mapping.
* **Glassmorphism UI:** A sleek, premium, visually rich interface with subtle hover micro-interactions and smooth page transitions.
* **Mobile Responsive Structure:** Grid and flexbox layouts naturally adaptable to both desktop screens and mobile devices.

### 🛠 Active Modules

1. **Dashboard Overview:** Monitor total tasks completed, daily steps, and workout calories at a glance.
2. **Tasks Manager:** Fully-featured To-Do list supporting priority levels (Low, Medium, High), due dates, real-time filtering, global search queries (Ctrl + K), and local drag-and-drop sorting.
3. **Fitness Tracker:** Log your daily steps, track water consumption (8-glass metric), and record custom workouts to capture calorie burn efficiently.
4. **Personal Diary:** Securely encrypt and maintain personal long-form journal entries synced instantly to the cloud.
5. **Focus Timer & Music:** An integrated 25-minute Pomodoro timer perfectly paired with an embedded LoFi Beats YouTube music player.

---

## 🚀 Setup & Installation Guide

Follow these steps to deploy and run the app locally.

### Step 1: Clone the Repository
Clone this repository to your local machine:
```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

### Step 2: Configure Firebase
This project relies on Google Firebase for Authentication and Database architecture. 

1. Create a free project at the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication**:
   - Navigate to **Build > Authentication > Sign-in Method**.
   - Enable **Email/Password** provider.
   - Enable **Google** sign-in provider (supply a support email).
3. Enable **Firestore Database**:
   - Navigate to **Build > Firestore Database** and click **Create Database**.
   - Start in **Production Mode**. Choose a geographic location closest to you.
4. Add the Web App:
   - Go to your **Project Settings** (Gear icon ⚙️) > **General**.
   - Scroll down to "Your Apps" and click the web icon `</>` to register a new app.
   - Check the `Config` block provided. 
5. Inject your limits:
   - Open `js/firebase.js`.
   - Replace the `firebaseConfig` object with your newly generated keys.

### Step 3: Launch Local Server
The app consists of static files and relies on standard ES6 Module structures. You must serve it over an HTTP server (simply opening `index.html` as a file `file://` will block JS module imports due to CORS).

**Option A - VS Code Live Server:**
- Install the **Live Server** extension.
- Right-click `index.html` and click **Open with Live Server**.

**Option B - NodeJS HTTP-Server:**
- If you have Node installed, execute:
```bash
npx http-server .
```

---

## 🔒 Security Configuration

To ensure active users can exactly and exclusively read/write ONLY their own data without leaking it globally, deploy the enclosed security rules layout directly into your Firestore backend:

1. Inside your Firebase console, navigate to **Firestore Database > Rules**.
2. Replace what is currently there with the contents of the `firestore.rules` file in this repository.
3. Click **Publish**.

*(Alternatively, manage rules via CLI by running `firebase deploy --only firestore:rules` after successful terminal initialization)*.

---

## ☁️ Deployment instructions (Firebase Hosting)

Deploy your dashboard live to a free `.web.app` suffix globally utilizing Firebase Hosting:

1. Install Firebase toolkit globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Log into your Google Account:
   ```bash
   firebase login
   ```
3. Initialize the directory:
   ```bash
   firebase init
   ```
   - **Select:** `Hosting`
   - **Select:** `Use an existing project` (choose the one you created in Step 2).
   - **Public Directory:** Provide `.` (type a single dot, representing the root folder).
   - **Single Page App:** `Yes`
   - **GitHub Deployments:** `No` (or Yes if desired)
4. Simply push your code live:
   ```bash
   firebase deploy
   ```

## 📜 License
This application is distributed under the MIT license. Feel completely free to fork, expand, or repurpose these foundations as you see fit.
