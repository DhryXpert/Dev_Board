# 🚀 Dev Board — Agile Project Management & Bug Tracker

A modern, full-stack Jira and Linear alternative built with the **MERN stack** (MongoDB, Express, React, Node.js) and Tailwind CSS. Designed with an agile workflow in mind, featuring interactive **Kanban Drag-and-Drop**, threaded comments, role-based project collaboration, and custom dark/light themes inspired by modern SaaS applications.

---

## ✨ Features

- **🔐 Robust Authentication & Security**:
  - Secure user registration and login with JWT and `bcryptjs` password hashing.
  - Protected API routes and client-side route guards.
  - Multi-theme support (Dark/Light) with instant toggle and local storage persistence.

- **📁 Project Management & Workspaces**:
  - Create, view, edit, and delete software projects.
  - Add/remove team members by email directly to specific project workspaces.
  - Dynamic Project Switcher dropdown in the top navigation bar.

- **📋 Interactive Kanban Board (Drag & Drop)**:
  - Three distinct agile columns: **To Do**, **In Progress**, and **Done**.
  - Powered by `@hello-pangea/dnd` for smooth, realistic card lifting with elevation and rotation.
  - Optimistic UI updates with instant persistence to MongoDB.
  - Dual view modes: **Kanban Board View** and **Grid Card View**.

- **💬 Real-Time Threaded Comments**:
  - Threaded discussion stream under each ticket modal.
  - Author avatars, names, and relative timestamps.
  - Author-only comment deletion permissions.

- **🔍 Advanced Multi-Filter & Search**:
  - Instant client and server search across ticket titles and descriptions.
  - Filter simultaneously by **Status**, **Priority** (Low, Medium, High, Critical), and **Assignee**.

- **🛡️ Role-Based Ticket Authorization**:
  - Only Project Owners, Ticket Creators, or Assignees can edit/delete tickets.
  - Safe, custom confirmation modal (`DeleteAlert`) before any destructive action.

- **🔔 Toast Notification System**:
  - Sleek, unobtrusive pop-up toasts for success, error, and info updates.

---

## 🧰 Tech Stack

### Frontend
- **React.js 19** + **Vite 8**
- **Tailwind CSS v4** + Custom Glassmorphism Theme (Zen Wealth design system)
- **React Router Dom v7** (Client-side routing)
- **`@hello-pangea/dnd`** (Accessible drag-and-drop Kanban)
- **Lucide React** (Clean, consistent iconography)
- **Axios** (With interceptors for automatic JWT attachment)

### Backend
- **Node.js** + **Express.js 5** (RESTful API architecture)
- **MongoDB Atlas** + **Mongoose 9** (Database modeling & relationships)
- **JSON Web Tokens (JWT)** + **bcryptjs** (Stateless authentication)
- **CORS** & **Dotenv** (Security & environment management)

---

## 📁 Project Architecture

```text
Dev_Board/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Favicons & Brand Assets (32x32, 64x64, 180x180, 512x512)
│   ├── src/
│   │   ├── api/                # Axios instance configuration
│   │   ├── components/         # Reusable UI (AppLayout, KanbanBoard, Modal, DeleteAlert, etc.)
│   │   ├── context/            # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/              # Login, Register, Dashboard, ProjectDetails
│   │   ├── App.jsx             # Routes & Global Providers
│   │   └── index.css           # Tailwind v4 configuration & theme styles
│   └── package.json
│
├── server/                     # Backend Application (Node + Express)
│   ├── config/                 # Database connection (Mongoose)
│   ├── controllers/            # Auth, Project, Ticket, Comment business logic
│   ├── middleware/             # JWT auth & route protection
│   ├── models/                 # User, Project, Ticket, Comment Mongoose schemas
│   ├── routes/                 # Express API routes (/api/auth, /api/projects, etc.)
│   ├── server.js               # Express application entry point
│   └── package.json
│
└── Docs/                       # Project specifications, roadmap, and checklists
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/DhairyaKhatri07/Dev_Board.git
cd Dev_Board
```

### 2. Backend Setup
1. Navigate to the `server/` directory:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file inside `server/`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will be live at `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `client/` directory:
   ```bash
   cd ../client
   npm install
   ```
2. Create a `.env` file inside `client/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🌐 API Overview

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user & get JWT | No |
| `GET` | `/api/auth/me` | Get authenticated user profile | Yes |
| `POST` | `/api/projects` | Create a new project | Yes |
| `GET` | `/api/projects` | List all projects for user | Yes |
| `GET` | `/api/projects/:id` | Get single project details | Yes |
| `PUT` | `/api/projects/:id` | Update project title / description | Yes (Owner) |
| `DELETE` | `/api/projects/:id` | Delete project | Yes (Owner) |
| `POST` | `/api/projects/:id/members` | Add project member by email | Yes (Owner) |
| `DELETE` | `/api/projects/:id/members/:memberId` | Remove member from project | Yes (Owner) |
| `POST` | `/api/tickets` | Create a ticket | Yes |
| `GET` | `/api/tickets/project/:projectId` | Get filtered tickets for a project | Yes |
| `PUT` | `/api/tickets/:id` | Update ticket / change status | Yes (Owner/Creator/Assignee) |
| `DELETE` | `/api/tickets/:id` | Delete ticket | Yes (Owner/Creator) |
| `POST` | `/api/comments` | Post comment on a ticket | Yes |
| `GET` | `/api/comments/ticket/:ticketId` | Get comment thread for ticket | Yes |
| `DELETE` | `/api/comments/:id` | Delete comment | Yes (Author) |

---

## 📝 License
This project is open-source and available under the [ISC License](LICENSE).
