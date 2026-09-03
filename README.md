# AI Basketball Analyzer

This project is about analyzing basketball players and games.

**Current version: Day 25**

-----------------------------------------------------------------------------------

## Day 1 — Project Setup

**Learned:**

React frontend
Node/Express backend
Client/server separation

-----------------------------------------------------------------------------------

## Day 2 — Node.js + Express Basics

**Learned:**

const app = express();

Creating a server.

Routes:

app.get()
app.post()

Middleware:

app.use()

-----------------------------------------------------------------------------------

## Day 3 — Frontend ↔ Backend Communication

**Learned:**

React sends requests:

fetch()

Backend receives:

req.body

Backend responds:

res.json()

-----------------------------------------------------------------------------------

## Day 4 — REST API Thinking

**Learned:**

GET:

Retrieve data

POST:

Send/create data

Example:

POST /analyze

creates analysis.

-----------------------------------------------------------------------------------

## Day 5 — React State

**Learned:**

useState()

Example:

const [player, setPlayer] = useState();

State changes cause re-render.

-----------------------------------------------------------------------------------

## Day 6 — Object State

**Learned:**

Instead of:

name
points
assists
rebounds

you used:

player = {
    name,
    points,
    assists,
    rebounds
}

Learned:

...player

spread operator.

-----------------------------------------------------------------------------------

## Day 7 — Components

**Learned:**

Breaking UI into pieces.

Example:

App
|
├── InputForm
|
└── ResultCard

Benefits:

Cleaner code
Reusable components

-----------------------------------------------------------------------------------

## Day 8 — MongoDB Basics

**Learned:**

Database stores data.

MongoDB:

Database
|
Collection
|
Documents

Mongoose connects Node to MongoDB.

-----------------------------------------------------------------------------------

## Day 9 — Schemas & Models

**Learned:**

Schema:

Structure of data.

Model:

Tool to interact with MongoDB.

Example:

PlayerAnalysis.create()

-----------------------------------------------------------------------------------

## Day 10 — Authentication Basics

**Learned:**

Users need:

email
password

Passwords should never be stored directly.

-----------------------------------------------------------------------------------

## Day 11 — Password Hashing

**Learned:**

Plain password
      ↓
bcrypt.hash()
      ↓
Hashed password

Database stores:

$2b$10$....

not:

mypassword123

-----------------------------------------------------------------------------------

## Day 12 — Signup System

**Learned:**

Duplicate email prevention:

findOne()

-----------------------------------------------------------------------------------

## Day 13 — Login System

**Learned:**

bcrypt.compare()

-----------------------------------------------------------------------------------

## Day 14 — JWT

**Learned:**

JWT stores identity.

Example:

{
    userId: user._id
}

Token allows the server to identify the logged-in user.

-----------------------------------------------------------------------------------

## Day 15 — Validation

Important rule:

### Frontend validation

Purpose:

Help users.

Example:

Email cannot be empty

Provides fast feedback.

### Backend validation

Purpose:

Security.

Because frontend validation can be bypassed.

-----------------------------------------------------------------------------------

## Day 16 — Protected Routes

**Learned:**

Middleware:

Verifies JWT
Creates `req.user`

Example:

req.user = {
    userId: "123"
}

-----------------------------------------------------------------------------------

## Day 17 Summary — User Ownership & Authorization

**Learned:**

Make the app support multiple users safely.

### 1. Authentication vs Authorization

Authentication determines **who you are**.

Authorization determines **what you're allowed to access**.

Authentication is handled by middleware, while authorization is enforced by routes/controllers/database queries.

### 2. Store ownership

When creating data, store the logged-in user's ID:

userId

### 3. Protect database queries

Only retrieve data belonging to the authenticated user.

### 4. Protect individual documents

Update and delete operations check both:

Player _id
+
Logged-in user's userId

### 5. HTTP error codes

401 → Unauthorized / not authenticated

403 → Forbidden / authenticated but not allowed

-----------------------------------------------------------------------------------

## Day 18 — Professional Backend Architecture & Modularity

**Learned:**

How to organize backend code by responsibility instead of putting everything inside `server.js`.

Backend went from:

server.js
├── Database
├── Models
├── Middleware
├── Authentication
├── Routes
├── Controllers/logic
└── Basketball logic

to:

server/
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   └── playerController.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── User.js
│   └── Player.js
│
├── routes/
│   ├── authRoutes.js
│   └── playerRoutes.js
│
├── services/
│   └── playerAnalysisService.js
│
├── .env
├── .gitignore
└── server.js

### Modules

Learned how CommonJS modules work:

File A
↓
module.exports
↓
File B
↓
require()

### Models

Models are responsible for:

Defining how data is structured and interacting with MongoDB.

### Middleware

Moved authentication into:

middleware/auth.js

Its responsibility:

"Is this request authenticated?"

### Services

Responsible for:

Basketball/business logic.

### Routes

Routes answer:

"Which endpoint is being requested,
and which function should handle it?"

### Controllers

Controllers contain the request/response logic.

-----------------------------------------------------------------------------------

## Day 20 — Backend Robustness

**Learned:**

### 1. Backend validation

The backend should never blindly trust frontend data.

Created a validator to check:

Player name
Points
Assists
Rebounds

Invalid data returns:

res.status(400).json({
    message: "Invalid player data",
    errors
});

### 2. Frontend error handling

Learned that `fetch()` does not automatically throw for HTTP 400/500 responses.

API functions check:

if (!response.ok) {
    throw new Error(data.message);
}

React then handles the error:

try {
    // request
} catch (error) {
    setError(error.message);
} finally {
    setLoading(false);
}

### 3. Safe updates

Users can modify:

name
points
assists
rebounds

while the backend controls:

starter
grade
message
userId

Learned partial updates so changing one stat doesn't erase the other stats.

### 4. Centralized error handling

Created:

middleware/errorHandler.js

Learned:

next(error);

passes unexpected errors from the controller to centralized error middleware.

Most importantly:

400 → Expected/handled client problem

500 → Unexpected server problem

-----------------------------------------------------------------------------------

## Day 21 — REST API Design & Authorization

**Learned:**

Refactored API endpoints to follow a resource-based REST structure:

POST /player       → create a player

GET /player        → retrieve players

PUT /player/:id    → update a player

DELETE /player/:id → delete a player

### Query parameters

Learned how query parameters work:

/player?name=Curry&grade=A

Used `req.query` to dynamically build MongoDB filters.

### Authorization

Strengthened authorization by checking both:

Player _id
+
Logged-in user's userId

Learned the difference between:

Authentication → Who you are

Authorization → What you're allowed to access

Added handling for invalid MongoDB IDs using centralized error handling.

### Separation of responsibilities

Improved separation between:

Routes
Middleware
Controllers
Validators
Services
Models/database

Learned that controllers should coordinate operations rather than contain all business logic.

-----------------------------------------------------------------------------------

## Day 22 — Frontend Architecture & Refactoring

**Learned:**

Refactored `App.jsx` by separating responsibilities into reusable React components.

Moved player form state into:

PlayerForm

Created `PlayerSearch` and moved search/filter state into the component.

Created separate:

LoginForm
SignupForm

with their own form state.

### State ownership

Learned that state should live in the component that actually needs to own it.

### Callback props

Learned how callback props allow child components to send data back to the parent.

### API organization

Separated frontend API functions into:

playerApi.js
authApi.js

Created a centralized API client for common functionality such as:

authentication tokens
request headers
fetch()
JSON parsing
centralized error handling

Improved logout behavior by clearing user-specific React state.

### Day 22 Architecture

components/
├── PlayerForm.jsx
├── PlayerSearch.jsx
├── LoginForm.jsx
├── SignupForm.jsx
├── ResultCard.jsx
└── ResultList.jsx

api/
├── apiClient.js
├── playerApi.js
└── authApi.js

App.jsx

### Main lesson

Components handle UI and local state.

API modules handle domain-specific requests.

The API client handles shared communication with the backend.

-----------------------------------------------------------------------------------

## Day 23 — Frontend Architecture & UI Design

**Learned:**

Focused on turning the frontend from a developer prototype into a more structured and polished application.

### Component Architecture

Learned how to break the React application into components based on responsibility:

App
├── Navbar
├── AuthScreen
│   ├── LoginForm
│   └── SignupForm
└── Dashboard
    ├── PlayerForm
    ├── PlayerSearch
    └── ResultList
        └── ResultCard

Learned that the component tree represents which components render other components. It does not necessarily represent the folder structure.

### State Ownership

Learned to keep state in the component that actually needs to own it.

For example:

PlayerForm
→ player state

PlayerSearch
→ search name and grade filter

App
→ results, loading, errors, authenticated user

This reduced unnecessary props and made the application easier to maintain.

### UI Design

Added:

Dashboard layout
Player analysis card
Search/filter card
Professional result cards
Consistent spacing
Responsive layouts
Button hover states
Input focus states
CSS variables

### Responsive Design

Learned how media queries can change layouts for smaller screens.

For example, search controls and statistics can change from horizontal layouts to vertical layouts on mobile-sized screens.

### Day 23 Result

The application now has:

Organized React components
Clear state ownership
Authentication UI
Dashboard UI
Search and filtering UI
Styled player analysis cards
Responsive design
Consistent visual design system

The application is no longer just functional — it is starting to look and behave like a real product.

-----------------------------------------------------------------------------------

## Day 24 — Better UX

**Learned:**

### Loading UX

Disabled buttons while requests are running.

Changed button text to communicate progress.

Prevented duplicate API submissions.

### Success & Error Feedback

Added separate success and error states.

Learned how backend HTTP errors become JavaScript errors through the API layer.

Displayed meaningful feedback to the user.

### Delete UX

Added confirmation before destructive actions.

Added success/error feedback after deletion.

### Update UX

Built an edit mode for `ResultCard`.

Allowed users to edit:

name
points
assists
rebounds

Learned that frontend and backend data structures must match.

Kept the edit form open when an update fails.

Recalculated the player's analysis after changing stats.

### Empty States

Created a reusable:

EmptyState

component.

Learned that an empty screen should guide the user rather than simply say:

"nothing exists"

### Most important Day 24 lesson

Moved from thinking:

"Does the feature work?"

to:

"What does the user experience when they use the feature?"

-----------------------------------------------------------------------------------

## Day 25 — Frontend Architecture & Page Structure

**Learned:**

Improved the React frontend architecture by separating the application into pages and reusable components.

### Pages vs Components

Learned the difference between a **page** and a **component**.

A page represents a full screen or destination in the application.

A component represents a reusable piece of UI inside a page.

Example:

HistoryPage
├── PlayerSearch
└── ResultList
    └── ResultCard

### Page Structure

Created:

pages/
├── AuthPage.jsx
├── DashboardPage.jsx
├── HistoryPage.jsx
└── ProfilePage.jsx

### Authentication Architecture

Separated authentication into:

AuthPage
└── AuthScreen
    ├── LoginForm
    └── SignupForm

`AuthScreen` controls whether Login or Signup is displayed.

`LoginForm` owns its login form state.

`SignupForm` owns its signup form state.

### Conditional Rendering

Learned how React can conditionally render different UI based on state.

Example:

mode === "login"
    ↓
LoginForm

mode === "signup"
    ↓
SignupForm

### Application Navigation

Created a temporary page-navigation system using React state:

currentPage

The application can switch between:

dashboard
history
profile

### Authentication State

Used the authenticated user to determine which part of the application should be displayed:

user === null
    ↓
AuthPage

user exists
    ↓
Main Application

### MainApp

Created a `MainApp` component to separate the logged-in application UI from `App.jsx`.

Architecture:

App
│
├── AuthPage
│   └── AuthScreen
│       ├── LoginForm
│       └── SignupForm
│
└── MainApp
    ├── Navbar
    └── Pages
        ├── DashboardPage
        │   └── PlayerForm
        │
        ├── HistoryPage
        │   ├── PlayerSearch
        │   └── ResultList
        │       └── ResultCard
        │
        └── ProfilePage

### Separation of Concerns

Learned that different parts of the application should have clear responsibilities.

App
→ Global application state and coordination

Pages
→ Full application screens

Components
→ Reusable UI pieces

API modules
→ Backend communication

### Day 25 Result

The frontend now has a more scalable architecture with:

Authentication page
Dashboard page
History page
Profile page
Reusable components
Page navigation
Clear state ownership
Separated authentication forms
Main application shell

### Most important Day 25 lesson

Architecture should solve complexity rather than create unnecessary complexity.

The goal is not to create as many files or folders as possible.

The goal is to give each part of the application a **clear responsibility**.

-----------------------------------------------------------------------------------

## Day 26 — Custom React Hooks & State Management

### 🎯 Goal

The goal of Day 26 was to learn what **React Hooks** are and use **custom hooks** to organize related state and behavior.

As the application grew, `App.jsx` was becoming responsible for authentication, player operations, loading states, errors, and UI state.

The goal was to separate these responsibilities without creating unnecessary complexity.

---

### 🪝 What Is a React Hook?

A React Hook allows a component to use React features such as state and effects.

For example:

const [name, setName] = useState("");

`useState` is a built-in React Hook.

A **custom hook** is a JavaScript function that uses React Hooks to package related stateful behavior into a reusable unit.

Custom hooks normally begin with `use`.

Examples:

useAuth()
usePlayers()


The important idea learned was:

> A custom hook packages related state + behavior so components don't have to manage all of the implementation details themselves.

---

### 🔐 Creating `useAuth()`

Authentication logic was moved out of `App.jsx` and into:

hooks/
└── useAuth.js

`useAuth()` is responsible for authentication-related state and behavior:

useAuth()
├── user
├── loading
├── error
├── login()
├── signup()
└── logout()

The application can then access authentication functionality with:

const {
    user,
    loading,
    error,
    login,
    signup,
    logout
} = useAuth();

This allows `App.jsx` to use authentication without needing to contain all of the authentication implementation.

---

### 👥 Creating `usePlayers()`

Player functionality was also grouped into a custom hook:

hooks/
├── useAuth.js
└── usePlayers.js

`usePlayers()` manages player-related state and operations:

usePlayers()
├── results
├── loading
├── error
├── analyze()
├── loadHistory()
├── deletePlayer()
├── updatePlayerData()
└── search()

This removed player-management logic from `App.jsx`.

---

### 📊 Player Data Flow

The player operations now follow this structure:

React Component
      ↓
     App
      ↓
 usePlayers()
      ↓
 playerApi
      ↓
 Express Backend
      ↓
 MongoDB

For example, analyzing a player:

PlayerForm
    ↓
onAnalyze()
    ↓
App
    ↓
analyze()
    ↓
usePlayers
    ↓
analyzePlayer()
    ↓
Backend

The hook manages the player operation and its related state.

---

### ⚠️ Separating Different Types of State

An important lesson was learning that not all state belongs in the same place.

Authentication state belongs to `useAuth()`:

useAuth()
├── user
├── auth loading
└── auth error

Player-operation state belongs to `usePlayers()`:

usePlayers()
├── results
├── player loading
└── player error

General UI state remains in `App.jsx`:

App
├── success
└── currentPage

For example:

setSuccess("Player analyzed successfully! 🏀");

The success message is a UI concern rather than something that needs to be owned by the player hook.

---

### 🧠 Important Hook Lesson

A custom hook should not be created simply because there are several functions.

Instead, ask:

> **"Do I have related state and behavior that would be easier to manage independently?"**

For this project:

**Authentication** is a cohesive group:

user + login + signup + logout

Therefore:

useAuth()

makes sense.

**Player management** is another cohesive group:

results + analyze + delete + update + search

Therefore:

usePlayers()

makes sense.

This is an important architectural principle:

> **Use abstraction to solve complexity, not to create complexity.**

---

### 🏗️ App Architecture After Day 26

The application now has a cleaner structure:

App.jsx
│
├── useAuth()
│   ├── user
│   ├── loading
│   ├── error
│   ├── login()
│   ├── signup()
│   └── logout()
│
├── usePlayers()
│   ├── results
│   ├── loading
│   ├── error
│   ├── analyze()
│   ├── loadHistory()
│   ├── deletePlayer()
│   ├── updatePlayerData()
│   └── search()
│
├── success
└── currentPage

This means `App.jsx` is becoming more of a **coordinator** rather than a place where every operation is implemented.

---

### 🔄 Before vs After

Before Day 26:

App.jsx
├── Authentication logic
├── Player logic
├── API calls
├── Loading state
├── Error state
├── Results
└── UI state

After Day 26:

App.jsx
├── useAuth()
├── usePlayers()
├── success
└── currentPage

The responsibilities are now grouped according to what they actually do.

---

### 🚀 Why This Matters for the Project

The project is becoming easier to extend as more functionality is added.

Future features can follow the same pattern:

Feature
   ↓
Related state
   ↓
Related behavior
   ↓
Custom hook when appropriate

This will be especially useful as the project moves toward the upcoming **AI-powered player analysis** functionality.

---

### 📌 Day 26 Summary

Day 26 focused on **React Hooks and custom hooks**.

I learned:

* What React Hooks are
* How `useState` is a React Hook
* What custom hooks are
* Why custom hooks begin with `use`
* How to create `useAuth()`
* How to create `usePlayers()`
* How hooks can contain related state and behavior
* How to separate authentication state from player state
* How to keep general UI state separate
* How custom hooks make `App.jsx` easier to understand
* When abstraction is useful and when it creates unnecessary complexity

The application now has a cleaner separation between **authentication, player management, and UI coordination**

-------------------------------------------------------------------------------------