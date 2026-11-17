# Dev Board — Agile Project Management & Issue Tracker

A modern, full-stack project management platform built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS. Designed for agile teams, featuring Kanban drag-and-drop workflows, threaded discussions, role-based access control, and dark/light display modes.

---

## Features

- **Authentication & Security**:
  - Stateless authentication with JSON Web Tokens (JWT) and `bcryptjs` password hashing.
  - Protected API routes and client-side routing guards.
  - Dark and light theme modes with local storage persistence.

- **Project Workspaces**:
  - Full CRUD operations for software projects.
  - Team collaboration: invite and remove project members by email.
  - Project switcher dropdown in navigation bar for fast context switching.

- **Interactive Kanban Board**:
  - Three standard workflow states: To Do, In Progress, and Done.
  - Smooth drag-and-drop powered by `@hello-pangea/dnd`.
  - Optimistic UI state updates synchronized with MongoDB.
  - Dual view toggle: Kanban Board View and Grid Card View.

- **Threaded Discussions**:
  - Discussion streams within each ticket modal.
  - Author attribution, initials badge, and relative timestamps.
  - Author-only comment deletion permissions.

- **Search & Multi-Criteria Filtering**:
  - Real-time search across ticket titles and descriptions.
  - Multi-dimensional filters for Status, Priority (Low, Medium, High, Critical), and Assignee.

- **Role-Based Authorization**:
  - Fine-grained permission model: only Project Owners, Ticket Creators, or Assignees can modify or remove tickets.
  - Destructive actions safeguarded by a custom confirmation dialog.

- **Notification System**:
  - Global toast notification manager for success, info, and error alerts.

---

## Tech Stack

### Frontend
- React 19
- Vite 8
- Tailwind CSS v4
- React Router Dom v7
- `@hello-pangea/dnd`
- Lucide React
- Axios (configured with request interceptors for bearer tokens)
- `@vercel/speed-insights`

### Backend
- Node.js
- Express.js 5
- MongoDB Atlas & Mongoose 9
- JSON Web Tokens (jsonwebtoken)
- bcryptjs
- CORS & Dotenv

---

## Project Structure

```text
Dev_Board/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets and routing configuration (_redirects)
│   ├── src/
│   │   ├── api/                # Axios instance configuration
│   │   ├── components/         # Reusable UI (AppLayout, KanbanBoard, Modal, DeleteAlert)
│   │   ├── context/            # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/              # Login, Register, Dashboard, ProjectDetails
│   │   ├── App.jsx             # Router and global context providers
│   │   └── index.css           # Global Tailwind CSS and design tokens
│   ├── vercel.json             # Vercel SPA routing rewrite rules
│   └── package.json
│
├── server/                     # Backend Application (Node + Express)
│   ├── config/                 # Database configuration (Mongoose connection caching)
│   ├── controllers/            # Auth, Project, Ticket, Comment business logic
│   ├── middleware/             # JWT authentication and authorization guards
│   ├── models/                 # User, Project, Ticket, Comment schemas
│   ├── routes/                 # Express API endpoints
│   ├── server.js               # Application entry point and serverless export
│   ├── vercel.json             # Vercel serverless function configuration
│   └── package.json
│
└── Docs/                       # Technical specifications and planning documents
```

---

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas connection string (or local MongoDB instance)

### 1. Clone Repository
```bash
git clone https://github.com/DhryXpert/Dev_Board.git
cd Dev_Board
```

### 2. Backend Configuration
1. Navigate to the server folder:
   ```bash
   cd server
   npm install
   ```
2. Configure `.env` in the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   API will be available at `http://localhost:5000`.

### 3. Frontend Configuration
1. Open a new terminal session and navigate to the client folder:
   ```bash
   cd client
   npm install
   ```
2. Configure `.env` in the `client/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Client will be available at `http://localhost:5173`.

---

## API Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT | Public |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Private |
| `POST` | `/api/projects` | Create a new project | Private |
| `GET` | `/api/projects` | List projects for authenticated user | Private |
| `GET` | `/api/projects/:id` | Retrieve single project details | Private |
| `PUT` | `/api/projects/:id` | Update project metadata | Private (Owner) |
| `DELETE` | `/api/projects/:id` | Delete project and associated records | Private (Owner) |
| `POST` | `/api/projects/:id/members` | Add project collaborator by email | Private (Owner) |
| `DELETE` | `/api/projects/:id/members/:memberId` | Remove project collaborator | Private (Owner) |
| `POST` | `/api/tickets` | Create a new ticket | Private |
| `GET` | `/api/tickets/project/:projectId` | Retrieve tickets for a project with filters | Private |
| `PUT` | `/api/tickets/:id` | Update ticket details or workflow status | Private (Owner/Creator/Assignee) |
| `DELETE` | `/api/tickets/:id` | Delete ticket | Private (Owner/Creator) |
| `POST` | `/api/comments` | Post a comment on a ticket | Private |
| `GET` | `/api/comments/ticket/:ticketId` | Retrieve comment thread for a ticket | Private |
| `DELETE` | `/api/comments/:id` | Delete comment | Private (Author) |

---

## License

This project is licensed under the ISC License.
