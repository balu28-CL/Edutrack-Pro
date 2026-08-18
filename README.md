# EduTrack Pro

## Student Management Portal

EduTrack Pro is a full-stack Student Management Portal designed to simplify the management of students, faculty, courses, attendance, marks, notices, and academic information through a secure and responsive web application.

The project was developed as a Capstone Project for the Full Stack Web Development Internship.

---

## 📌 Project Overview

EduTrack Pro provides a centralized platform for college administration and academic management.

The system supports different user roles and provides role-based access to features and dashboards.

### User Roles

* **Admin** – Manage students, faculty, courses, attendance, marks, and notices.
* **Faculty** – Access academic information and manage permitted academic activities.
* **Student** – Access personal academic information and student dashboard.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* Secure user login
* JWT-based authentication
* Protected routes
* Role-based authorization
* Session-based login state

### 🎓 Student Management

* Add students
* View student records
* Edit student information
* Delete students
* Student details including:

  * Student ID
  * Name
  * Email
  * Phone
  * Department
  * Semester
  * Section
  * Gender

### 👨‍🏫 Faculty Management

* Add faculty members
* View faculty records
* Update faculty information
* Delete faculty records
* Faculty information management

### 📚 Course Management

* Course management
* Course information
* Enrollment-related functionality

### 📊 Attendance Management

* View attendance records
* Add attendance
* Update attendance
* Delete attendance

### 📝 Marks Management

* Add marks
* View marks
* Update marks
* Delete marks

### 📢 Notice Management

* Create notices
* View notices
* Update notices
* Delete notices
* Dashboard display of recent notices

### 📈 Dashboard

* Role-based dashboards
* Academic statistics
* Recent notices
* Student-related information
* Faculty-related information

### 👤 Profile

* User profile access
* Role-aware user information

### 📱 Responsive UI

* Responsive dashboard layout
* Mobile-friendly interface
* Responsive tables
* Horizontal scrolling for wide data tables
* Responsive forms and modals

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* Lucide React
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* RESTful APIs
* JWT
* bcryptjs
* CORS
* dotenv

### Database

* MongoDB
* Mongoose

### Deployment

* **Frontend:** Netlify
* **Backend:** Render

---

## 🏗️ Project Architecture

```text
EduTrack Pro/
│
├── client/
│   ├── public/
│   │   └── _redirects
│   │
│   └── src/
│       ├── components/
│       │   ├── AddStudentForm.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── RecentNotice.jsx
│       │   ├── Sidebar.jsx
│       │   └── StatCard.jsx
│       │
│       ├── layouts/
│       │   └── MainLayout.jsx
│       │
│       ├── pages/
│       │   ├── Attendance.jsx
│       │   ├── Courses.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Faculty.jsx
│       │   ├── Login.jsx
│       │   ├── Marks.jsx
│       │   ├── Notices.jsx
│       │   ├── Profile.jsx
│       │   ├── StudentDashboard.jsx
│       │   └── Students.jsx
│       │
│       ├── services/
│       │   ├── api.js
│       │   ├── attendanceService.js
│       │   ├── facultyService.js
│       │   ├── marksService.js
│       │   ├── noticeService.js
│       │   └── studentService.js
│       │
│       ├── styles/
│       │   ├── Attendance.css
│       │   ├── Dashboard.css
│       │   ├── Faculty.css
│       │   ├── Login.css
│       │   ├── Marks.css
│       │   ├── Navbar.css
│       │   ├── Notice.css
│       │   ├── Profile.css
│       │   ├── Sidebar.css
│       │   └── Students.css
│       │
│       └── utils/
│           └── auth.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── dashboardController.js
│   │   ├── enrollmentController.js
│   │   ├── facultyController.js
│   │   ├── marksController.js
│   │   ├── noticeController.js
│   │   └── studentController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Attendance.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Faculty.js
│   │   └── Student.js
│   │
│   ├── routes/
│   │   ├── attendanceRoutes.js
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── facultyRoutes.js
│   │   ├── marksRoutes.js
│   │   ├── noticeRoutes.js
│   │   └── studentRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

> Environment files such as `.env` are intentionally excluded from the public repository.

---

## 🔄 Application Flow

```text
User
  │
  ▼
React Frontend
  │
  │ HTTP Requests
  ▼
Axios API Layer
  │
  ▼
Express.js REST API
  │
  ├── Authentication Middleware
  │
  ├── Controllers
  │
  └── Routes
        │
        ▼
     Mongoose
        │
        ▼
      MongoDB
```

---

## 🔐 Authentication Flow

1. User enters email and password.
2. Frontend sends login credentials to the backend.
3. Backend validates the credentials.
4. Password verification is performed using `bcryptjs`.
5. Backend generates a JWT token.
6. Token and user information are stored in the browser session.
7. Axios automatically attaches the JWT token to protected API requests.
8. Backend middleware validates the token before allowing access to protected resources.

---

## 🌐 REST API

The backend exposes RESTful API endpoints for the major application modules.

### Authentication

```text
POST /api/auth/login
```

### Students

```text
GET    /api/students
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

### Faculty

```text
GET    /api/faculty
POST   /api/faculty
PUT    /api/faculty/:id
DELETE /api/faculty/:id
```

### Attendance

```text
GET    /api/attendance
POST   /api/attendance
PUT    /api/attendance/:id
DELETE /api/attendance/:id
```

### Marks

```text
GET    /api/marks
POST   /api/marks
PUT    /api/marks/:id
DELETE /api/marks/:id
```

### Notices

```text
GET    /api/notices
POST   /api/notices
PUT    /api/notices/:id
DELETE /api/notices/:id
```

### Dashboard

```text
GET /api/dashboard
```

### Courses

```text
/api/courses
```

### Enrollments

```text
/api/enrollments
```

Detailed API documentation and Postman collection can be provided separately as part of the project deliverables.

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB / MongoDB Atlas
* Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/balu28-CL/Edutrack-Pro.git
```

```bash
cd Edutrack-Pro
```

---

### 2. Frontend Setup

```bash
cd client
npm install
```

Create the required environment/configuration values for the deployed or local backend API.

For local development, the frontend can communicate with:

```text
http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The Vite development server will normally run on:

```text
http://localhost:5173
```

---

### 3. Backend Setup

Open another terminal:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

---

## 🔑 Environment Variables

The following environment variables are required by the backend:

| Variable     | Description                                       |
| ------------ | ------------------------------------------------- |
| `PORT`       | Port used by the Express server                   |
| `MONGO_URI`  | MongoDB connection string                         |
| `JWT_SECRET` | Secret key used to generate and verify JWT tokens |

**Never commit `.env` files or database credentials to GitHub.**

---

## 🚀 Live Deployment

### Frontend

**Netlify**

https://edutrackpro26.netlify.app

### Backend

**Render**

https://edutrack-pro-backend.onrender.com

The frontend communicates with the deployed backend through the configured API base URL.

---

## 🗄️ Database

EduTrack Pro uses MongoDB as its database with Mongoose for schema definition and database operations.

Major collections/models include:

* User
* Student
* Faculty
* Course
* Enrollment
* Attendance
* Marks
* Notice

The detailed database schema is provided separately as part of the project documentation.

---

## 🛡️ Security

The application includes:

* JWT-based authentication
* Protected backend routes
* Role-based authorization
* Password hashing with bcryptjs
* Environment variables for sensitive configuration
* Session-based authentication state
* Input validation through request handling
* Error handling for failed operations

---

## 📋 Project Requirements Mapping

| Capstone Requirement                  | EduTrack Pro Implementation                                             |
| ------------------------------------- | ----------------------------------------------------------------------- |
| Secure Authentication & Authorization | JWT authentication and protected routes                                 |
| RESTful API Development               | Express.js REST API                                                     |
| Database Integration                  | MongoDB + Mongoose                                                      |
| Responsive User Interface             | Responsive React/CSS interface                                          |
| Role-Based Access Control             | Admin, Faculty and Student roles                                        |
| File Upload & Media Management        | Not implemented in the current version                                  |
| Input Validation                      | Form and request validation                                             |
| Exception Handling                    | Backend and frontend error handling                                     |
| Clean Architecture                    | Components, pages, services, routes, controllers, models and middleware |

---

## 🎯 Future Improvements

Possible future enhancements include:

* File upload and media management
* Advanced search and filtering
* Email notifications
* Attendance analytics
* Academic performance charts
* Export reports as PDF/Excel
* Improved notification system
* More advanced administrator controls

---

## 👨‍💻 Developer

**Y Balaji**

Full Stack Web Development Internship
Kinetrexa Software Private Limited

---

## 📄 License

This project was developed for educational and internship purposes.
