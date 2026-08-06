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
