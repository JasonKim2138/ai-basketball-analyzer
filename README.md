This project is about analyzing basketball players and games

Current version: Day 17

Day 1 — Project Setup

    Learned:

    React frontend
    Node/Express backend
    Client/server separation

Day 2 — Node.js + Express Basics

    Learned:

    const app = express();

    Creating a server.

    Routes:

    app.get()
    app.post()

    Middleware:

    app.use()

Day 3 — Frontend ↔ Backend Communication

    Learned:

    React sends requests:

    fetch()

    Backend receives:

    req.body

    Backend responds:

    res.json()

Day 4 — REST API Thinking

    Learned:

    GET:

    Retrieve data

    POST:

    Send/create data

    Example:

    POST /analyze

    creates analysis.

Day 5 — React State

    Learned:

    useState()

    Example:

    const [player,setPlayer] = useState();

    State changes cause re-render.

Day 6 — Object State

    Learned:

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

Day 7 — Components

    Learned:

    Breaking UI into pieces:

    Example:

    App
    |
    ├── InputForm
    |
    └── ResultCard

    Benefits:

    Cleaner code
    Reusable components

Day 8 — MongoDB Basics

    Learned:

    Database stores data.

    MongoDB:

    Database
    |
    Collection
    |
    Documents

    Mongoose connects Node to MongoDB.

Day 9 — Schemas & Models

    Learned:

    Schema:

    structure of data

    Model:

    tool to interact with MongoDB

    Example:

    PlayerAnalysis.create()

Day 10 — Authentication Basics

    Learned:

    Users need:

    email
    password

    Passwords should never be stored directly.

Day 11 — Password Hashing

    Learned:

    bcrypt:

    Plain password
        ↓
    bcrypt.hash()
        ↓
    Hashed password

    Database stores:

    $2b$10$....

    not:

    mypassword123

Day 12 — Signup System

    Learned:

    Duplicate email prevention:

    findOne()

Day 13 — Login System

    Learned:

    bcrypt.compare()

Day 14 — JWT

    Learned:

    JWT stores identity.

    Example:

    {
    userId:user._id
    }

    Token allows the server to remember the user.

Day 15 — Validation

    Important rule:

    Frontend validation:

    Purpose:

    Help users.

    Example:

    Email cannot be empty

    Fast feedback.

    Backend validation:

    Purpose:

    Security.

    Because frontend can be bypassed.

Day 16 — Protected Routes

    Learned:

    Middleware:

    verifies JWT
    creates req.user

    Example:

    req.user={
    userId:"123"
    }

Day 17 Summary — User Ownership & Authorization

    Learned:

    Make your app support multiple users safely.

    1. Authentication vs Authorization
        Authentication handled by middleware (auth), Authorization handled by routes

    2. Store ownership(userId) when creating data

    3. Protect database queries

    4. Protect individual documents
    
    5. Error codes: 
        401 Unauthorized, 403 Forbidden

Day 18 — Professional Backend Architecture & Modularity

    Learned:

    How to organize backend code by responsibility instead of putting everything inside server.js.

    Your backend went from:

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

    require() + module.exports

    You learned that CommonJS modules work like:

    File A
    ↓
    module.exports
    ↓
    File B
    ↓
    require()

    models/

    You separated:

    models/
    ├── User.js
    └── Player.js

    Models are responsible for:

    Defining how data is structured and interacting with MongoDB.

    middleware/

    You moved authentication into:

    middleware/auth.js
    
    It answers:

    "Is this request authenticated?"

    services/

    Its responsibility:

    Basketball/business logic.

    routes/

    Routes answer:

    "Which endpoint is being requested, and which function should handle it?"

    controllers/

    Controllers contain the actual request/response logic.

Day 20 — Backend Robustness

    Learned:

    1. Backend validation

    You learned that the backend should never blindly trust frontend data.

    You created a validator to check:

    Player name
    Points
    Assists
    Rebounds

    Invalid data returns:

    res.status(400).json({
    message: "Invalid player data",
    errors
    });

    2. Frontend error handling

    You learned that fetch() doesn't automatically throw for HTTP 400/500.

    So your API function checks:

    if (!response.ok) {
    throw new Error(data.message);
    }

    Then React handles it with:

    try {
    // request
    } catch (error) {
    setError(error.message);
    } finally {
    setLoading(false);
    }
    
    3. Safe updates

    You changed your update approach so users can modify:

    name
    points
    assists
    rebounds

    while the backend controls:

    starter
    grade
    message
    userId

    You also learned partial updates—changing only points shouldn't erase the other stats.

    4. Centralized error handling

    You created:

    middleware/errorHandler.js

    and learned:

    next(error);

    passes unexpected errors from your controller to the centralized error middleware.

    Most importantly, you learned the difference between:

    400 → expected/handled client problem
    500 → unexpected server problem

Day 21 — REST API Design & Authorization

    Learned:

    Refactored API endpoints to follow a resource-based REST structure:

    POST /player → create a player

    GET /player → retrieve players

    PUT /player/:id → update a player

    DELETE /player/:id → delete a player

    Learned how query parameters work:

    /player?name=Curry&grade=A

    Used req.query to dynamically build MongoDB filters.

    Strengthened authorization by checking both:

    Player _id

    Logged-in user's userId

    Learned the difference between authentication (who you are) and authorization (what you're allowed to access).

    Added handling for invalid MongoDB IDs using centralized error handling.

    Improved separation of responsibilities between:

    Routes

    Middleware

    Controllers

    Validators

    Services
    
    Models/database

    Learned that controllers should coordinate operations rather than contain all business logic.

Day 22 — Frontend Architecture & Refactoring

    Learned:

    Refactored App.jsx by separating responsibilities into reusable React components.

    Moved player form state into PlayerForm.

    Created PlayerSearch and moved search/filter state into the component.

    Created separate LoginForm and SignupForm components with their own form state.

    Learned state ownership — state should live in the component that actually needs it.

    Learned how callback props allow child components to send data back to the parent.

    Separated frontend API functions into:

    playerApi.js
    authApi.js

    Created a centralized apiClient.js for common API functionality such as:

    authentication tokens
    request headers
    fetch()
    JSON parsing
    centralized error handling

    Improved logout behavior by clearing user-specific React state.

    Learned how to structure frontend code by responsibility and domain.

    Day 22 Architecture
    
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

    The main lesson:

    Components handle UI and local state, API modules handle domain-specific requests, and apiClient handles shared communication with the backend.

Day 23 — Frontend Architecture & UI Design

    Learned:

    Today I focused on turning my frontend from a developer prototype into a more structured and polished application.

    Component Architecture

    I learned how to break my React application into components based on responsibility:

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

    I learned that the component tree represents which components render other components. It does not necessarily represent the folder structure.

    State Ownership

    I learned to keep state in the component that actually needs to own it.

    For example:

    PlayerForm → player state
    PlayerSearch → search name and grade filter
    App → results, loading, errors, and authenticated user

    This helped reduce unnecessary props and made the application easier to maintain.

    UI Design

    I added:

    Dashboard layout
    Player analysis card
    Search/filter card
    Professional result cards
    Consistent spacing
    Responsive layouts
    Button hover states
    Input focus states
    CSS variables for a consistent design system

    I also learned how CSS flex, grid, max-width, media queries, and CSS variables help create a cleaner UI.

    Responsive Design

    I learned how to use media queries to change the layout for smaller screens.

    For example, the search controls and statistics change from horizontal layouts to vertical layouts on mobile-sized screens.

    Day 23 Result

    My application now has:

    Organized React components
    Clear state ownership
    Authentication UI
    Dashboard UI
    Search and filtering UI
    Styled player analysis cards
    Responsive design
    A consistent visual design system

    The application is no longer just functional — it is starting to look and behave like a real product.

Day 24 — Better UX

    Learned:

    Loading UX:

    Disable buttons while requests are running.

    Change button text to communicate progress.

    Prevent duplicate API submissions.

    Success & error feedback:

    Added separate success and error states.

    Learned how backend HTTP errors become JavaScript errors through your API layer.

    Displayed meaningful feedback to the user.

    Delete UX:

    Added confirmation before destructive actions.

    Added success/error feedback after deletion.

    Update UX:

    Built an edit mode for ResultCard.

    Allowed users to edit name, points, assists, and rebounds.

    Learned that frontend and backend data structures must match.

    Kept the edit form open when an update fails.

    Recalculated the player's analysis after changing stats.

    Empty states:

    Created a reusable EmptyState component.

    Learned that an empty screen should guide the user rather than simply say "nothing exists."
    
    Most important Day 24 lesson

    You moved from thinking:

    "Does the feature work?"

    to:

    "What does the user experience when they use the feature?"