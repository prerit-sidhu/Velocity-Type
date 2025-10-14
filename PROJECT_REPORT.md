# VelocityType: Project Report

## 1. Overview

**VelocityType** is a modern and feature-rich typing speed test application designed to provide users with a seamless and engaging experience. It leverages a powerful tech stack to deliver real-time feedback, AI-powered content, and competitive features. The user interface is clean, responsive, and includes both light and dark modes for user comfort.

## 2. Core Technologies

- **Frontend Framework:** Next.js (with App Router) & React
- **Styling:** Tailwind CSS with ShadCN UI components
- **Generative AI:** Google's Genkit for dynamic content generation
- **Backend & Authentication:** Firebase (Firestore for database, Firebase Auth for user management)
- **Deployment:** Firebase App Hosting

## 3. Key Features

### 3.1. Dynamic Typing Tests

The core of the application is its versatile typing test module, offering multiple modes to suit different user preferences.

- **AI-Powered Content:**
    - **Random Paragraphs:** The application uses Google's Genkit to generate unique, random paragraphs for each test, ensuring a fresh experience every time.
    - **Custom Topics:** Users can input any topic (e.g., "a story about dragons"), and the AI will generate a custom paragraph for their typing test.
- **Multiple Test Modes:**
    - **Words Mode:** The classic experience where the user types a predefined block of text.
    - **Time Mode:** Users type as much as they can within a set time limit. Available durations are 30, 60, and 120 seconds. The text provided in this mode is longer to accommodate the time limit.

### 3.2. Real-time Performance Tracking

Users receive immediate feedback on their performance as they type.

- **Live Stats:** During a test, live metrics for Words Per Minute (WPM) and Characters Per Minute (CPM) are displayed and updated in real-time.
- **Detailed Results:** Upon completion, a comprehensive results card shows the final WPM and accuracy percentage.

### 3.3. User Authentication & Profile

A secure authentication system allows users to track their progress and compete with others.

- **Email & Password Authentication:** Users can create an account and log in using their email and password.
- **Secure Sign-Up:** New account registrations require email verification to ensure validity.
- **Forgot Password:** A password reset feature allows users to securely regain access to their accounts via email.
- **Seamless Logout:** The logout process provides clear visual feedback with a toast notification for a smooth user experience.

### 3.4. Competitive Leaderboard

- **Score Persistence:** Logged-in users can save their test scores (WPM and accuracy) to a global leaderboard powered by Firebase Firestore.
- **Ranking:** The leaderboard page displays the top 100 scores, ranked by WPM, allowing users to see how they stack up against the competition.
- **Personal Highlight:** The currently logged-in user's scores are highlighted on the leaderboard for easy identification.

### 3.5. Polished & Responsive User Interface

The application is designed to be visually appealing and functional across all devices.

- **Light & Dark Mode:** A theme toggle allows users to switch between light and dark modes, with their preference saved locally.
- **Responsive Design:** The UI is fully responsive, providing an optimal experience on desktops, tablets, and mobile devices.
- **Interactive Components:** Custom-styled components with hover and click effects (e.g., login tabs) create a polished and intuitive user experience.
- **Smooth Navigation:** Page transitions are animated, and clear navigation elements like a close button on the login form prevent users from getting stuck.
- **Toast Notifications:** Non-intrusive toast notifications provide feedback for actions like logging in and logging out.

## 4. Security

- **Environment Variables:** All sensitive Firebase configuration keys are stored securely in a `.env` file and are not exposed in the source code, following industry best practices for application security.
