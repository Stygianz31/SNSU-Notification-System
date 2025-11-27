# SNSU Notification System

A comprehensive notification and communication system built for Surigao del Norte State University (SNSU) using Ionic React, Node.js, Express, and Socket.IO.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Default Accounts](#default-accounts)
- [System Diagrams](#system-diagrams)
  - [Use Case Diagram](#use-case-diagram)
  - [Activity Diagram](#activity-diagram)
  - [Sequence Diagram](#sequence-diagram)
  - [Class Diagram](#class-diagram)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Features

### For All Users
- 🔐 **Secure Authentication** - JWT-based login/register system
- 📢 **Real-time Notifications** - Instant notification delivery
- 💬 **Live Messaging** - Real-time chat with Socket.IO
- 👤 **Profile Management** - Update profile, change password, upload profile picture
- 🔔 **Notification History** - View and manage all notifications
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

### For Students
- 📚 **Course Notifications** - Receive course-specific updates
- 💬 **Chat with Teachers** - Direct messaging with instructors
- 📅 **Calendar Integration** - View academic calendar
- 📖 **Resource Access** - Access learning materials

### For Teachers
- 👨‍🎓 **Student Management** - View and manage student lists
- 📢 **Broadcast Notifications** - Send notifications to classes
- 📊 **Class Overview** - View class statistics
- 📝 **Announcements** - Create and manage announcements

### For Admins
- 👥 **User Management** - Create, edit, delete users
- 📊 **Analytics Dashboard** - System usage statistics
- 📢 **System-wide Notifications** - Broadcast to all users
- 🛠️ **System Settings** - Configure system parameters
- 📈 **Reports Generation** - Generate various reports

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Ionic React 7
- **UI Library**: Ionic Components
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Routing**: React Router DOM
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Security**: Helmet, bcrypt

---

## 🏗️ System Architecture

```
┌─────────────┐      HTTP/WebSocket      ┌─────────────┐
│             │◄────────────────────────►│             │
│   Frontend  │                          │   Backend   │
│ (Ionic/React)│                          │ (Node.js)   │
│             │                          │             │
└─────────────┘                          └──────┬──────┘
                                                │
                                                │
                                         ┌──────▼──────┐
                                         │             │
                                         │   Database  │
                                         │   (SQLite)  │
                                         │             │
                                         └─────────────┘
```

---

## 📦 Installation

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional) - [Download here](https://git-scm.com/)

Check installations:
```bash
node --version
npm --version
```

---

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the `backend` directory:
   ```bash
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_DIALECT=sqlite
   DB_STORAGE=./database.sqlite
   DB_LOGGING=false

   # PostgreSQL (for production)
   # DB_DIALECT=postgres
   # DB_HOST=localhost
   # DB_PORT=5432
   # DB_NAME=snsu_db
   # DB_USER=postgres
   # DB_PASSWORD=your_password

   # JWT Secret (Change this!)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # File Upload Configuration
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=16777216
   ```

4. **Initialize the database:**

   The database will be automatically created on first run. It includes:
   - Users table
   - Notifications table
   - Messages table
   - Default admin account

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

   **Expected output:**
   ```
   Database connection established successfully.
   Database synchronized successfully.
   Default admin user created successfully.
   Server is running on port 5000
   Environment: development
   Database: sqlite
   ```

---

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint (if needed):**

   The frontend is pre-configured to connect to `http://localhost:5000`. If your backend runs on a different port, update:
   
   File: `frontend/src/services/api.ts`
   ```typescript
   const API_URL = 'http://localhost:5000/api';
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The application will open at `http://localhost:8100`

   **Expected output:**
   ```
   VITE v4.x.x  ready in xxx ms

   ➜  Local:   http://localhost:8100/
   ➜  Network: use --host to expose
   ➜  press h to show help
   ```

---

## ▶️ Running the Application

### Development Mode

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   - Open your browser
   - Navigate to `http://localhost:8100`
   - Login with default admin account

### Using Batch Scripts (Windows)

For convenience, use the provided batch scripts:

1. **Start Backend:**
   ```bash
   start-backend.bat
   ```

2. **Start Frontend:**
   ```bash
   start-frontend.bat
   ```

3. **Start Both (One-Click):**
   ```bash
   ONE-CLICK-START.bat
   ```

---

## 👤 Default Accounts

The system creates a default admin account on first run:

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@snsu.edu.ph`
- **Role:** Admin

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

### Creating Additional Accounts

#### Option 1: Through Admin Panel
1. Login as admin
2. Go to **Manage Users**
3. Click the **+** button
4. Fill in the user details
5. Select role (Teacher/Student)
6. Click **Create User**

#### Option 2: Through Registration Page
Users can self-register at the registration page. Admins can then assign appropriate roles.

---

## 📊 System Diagrams

### Use Case Diagram

```
                    ┌─────────────────────────────────────┐
                    │   SNSU Notification System          │
                    └─────────────────────────────────────┘

┌─────────┐                                          ┌─────────┐
│ Student │                                          │ Teacher │
└────┬────┘                                          └────┬────┘
     │                                                    │
     ├─► Login/Register                                  ├─► Login/Register
     ├─► View Notifications                              ├─► View Notifications
     ├─► Read Messages                                   ├─► Send Messages
     ├─► Send Messages                                   ├─► Create Announcements
     ├─► Update Profile                                  ├─► View Students
     ├─► Change Password                                 ├─► Update Profile
     ├─► View Calendar                                   ├─► Change Password
     ├─► Access Resources                                ├─► Manage Classes
     │                                                   │
     │               ┌─────────────┐                     │
     └──────────────►│   System    │◄────────────────────┘
                     └──────┬──────┘
                            │
                            │
                     ┌──────▼──────┐
                     │    Admin    │
                     └──────┬──────┘
                            │
                            ├─► Login
                            ├─► Manage Users (CRUD)
                            ├─► Create Notifications
                            ├─► View Analytics
                            ├─► Generate Reports
                            ├─► Manage System Settings
                            ├─► View All Messages
                            └─► System Configuration
```

**Actors:**
- **Student**: End-user who receives notifications and communicates
- **Teacher**: Faculty member who sends notifications and manages students
- **Admin**: System administrator with full access

**Use Cases:**
1. Authentication (Login/Register)
2. Notification Management
3. Messaging System
4. User Management
5. Profile Management
6. Analytics & Reporting
7. System Administration

---

### Activity Diagram

#### User Login Process

```
                    START
                      │
                      ▼
            ┌──────────────────┐
            │  Open Application│
            └────────┬─────────┘
                     │
                     ▼
            ┌──────────────────┐
            │ Enter Credentials│
            └────────┬─────────┘
                     │
                     ▼
            ┌──────────────────┐
            │  Click Login     │
            └────────┬─────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │ Validate Credentials │
         └──────────┬───────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
     ┌───▼────┐           ┌────▼────┐
     │ Invalid│           │  Valid  │
     └───┬────┘           └────┬────┘
         │                     │
         ▼                     ▼
   ┌──────────┐      ┌─────────────────┐
   │Show Error│      │Generate JWT Token│
   └────┬─────┘      └────────┬────────┘
        │                     │
        │                     ▼
        │            ┌─────────────────┐
        │            │ Store Token &   │
        │            │ User Data       │
        │            └────────┬────────┘
        │                     │
        │                     ▼
        │            ┌─────────────────┐
        │            │Initialize Socket│
        │            │Connection       │
        │            └────────┬────────┘
        │                     │
        │                     ▼
        │            ┌─────────────────┐
        │            │ Redirect to     │
        │            │ Dashboard       │
        │            └────────┬────────┘
        │                     │
        └─────────────────────┴──────► END
```

#### Creating a Notification

```
                    START (Admin)
                      │
                      ▼
            ┌──────────────────┐
            │Click "Create     │
            │Notification"     │
            └────────┬─────────┘
                     │
                     ▼
            ┌──────────────────┐
            │Fill Notification │
            │Form (Title,      │
            │Content, Image)   │
            └────────┬─────────┘
                     │
                     ▼
            ┌──────────────────┐
            │ Select Target    │
            │ (All/Role)       │
            └────────┬─────────┘
                     │
                     ▼
            ┌──────────────────┐
            │  Upload Image    │
            │  (Optional)      │
            └────────┬─────────┘
                     │
                     ▼
            ┌──────────────────┐
            │   Submit Form    │
            └────────┬─────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │   Validate Data      │
         └──────────┬───────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
     ┌───▼────┐           ┌────▼────┐
     │Invalid │           │  Valid  │
     └───┬────┘           └────┬────┘
         │                     │
         ▼                     ▼
   ┌──────────┐      ┌─────────────────┐
   │Show Error│      │Save to Database │
   └────┬─────┘      └────────┬────────┘
        │                     │
        │                     ▼
        │            ┌─────────────────┐
        │            │ Emit Socket     │
        │            │ Event to Users  │
        │            └────────┬────────┘
        │                     │
        │                     ▼
        │            ┌─────────────────┐
        │            │ Show Success    │
        │            │ Message         │
        │            └────────┬────────┘
        │                     │
        └─────────────────────┴──────► END
```

---

### Sequence Diagram

#### User Authentication Sequence

```
┌──────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│Client│         │  React   │         │  Express │         │ Database │
└───┬──┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
    │                 │                    │                    │
    │  Enter Login    │                    │                    │
    ├────────────────►│                    │                    │
    │                 │                    │                    │
    │                 │  POST /api/auth/login                   │
    │                 ├───────────────────►│                    │
    │                 │  {username, pwd}   │                    │
    │                 │                    │                    │
    │                 │                    │  findOne(username) │
    │                 │                    ├───────────────────►│
    │                 │                    │                    │
    │                 │                    │  User Data         │
    │                 │                    │◄───────────────────┤
    │                 │                    │                    │
    │                 │                    │                    │
    │                 │               ┌────▼────┐               │
    │                 │               │Validate │               │
    │                 │               │Password │               │
    │                 │               └────┬────┘               │
    │                 │                    │                    │
    │                 │               ┌────▼────┐               │
    │                 │               │Generate │               │
    │                 │               │JWT Token│               │
    │                 │               └────┬────┘               │
    │                 │                    │                    │
    │                 │  {token, user}     │                    │
    │                 │◄───────────────────┤                    │
    │                 │                    │                    │
    │  Success Response                    │                    │
    │◄────────────────┤                    │                    │
    │                 │                    │                    │
    │           ┌─────▼─────┐              │                    │
    │           │Store Token│              │                    │
    │           │in Storage │              │                    │
    │           └─────┬─────┘              │                    │
    │                 │                    │                    │
    │                 │  Connect Socket    │                    │
    │                 ├───────────────────►│                    │
    │                 │  {token}           │                    │
    │                 │                    │                    │
    │                 │  Socket Connected  │                    │
    │                 │◄───────────────────┤                    │
    │                 │                    │                    │
    │  Navigate to Dashboard               │                    │
    │◄────────────────┤                    │                    │
    │                 │                    │                    │
```

#### Real-time Notification Delivery

```
┌──────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────┐
│Admin │     │  React   │     │  Express │     │ Socket.IO│     │Client│
└───┬──┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └───┬──┘
    │             │                │                │                │
    │Create       │                │                │                │
    │Notification │                │                │                │
    ├────────────►│                │                │                │
    │             │                │                │                │
    │             │  POST /api/notifications        │                │
    │             ├───────────────►│                │                │
    │             │  {title,       │                │                │
    │             │   content,     │                │                │
    │             │   image}       │                │                │
    │             │                │                │                │
    │             │           ┌────▼────┐           │                │
    │             │           │  Save   │           │                │
    │             │           │   to    │           │                │
    │             │           │Database │           │                │
    │             │           └────┬────┘           │                │
    │             │                │                │                │
    │             │                │  Emit 'notification'            │
    │             │                ├───────────────►│                │
    │             │                │                │                │
    │             │                │                │  Broadcast     │
    │             │                │                ├───────────────►│
    │             │                │                │                │
    │             │                │                │  Show Toast    │
    │             │                │                │  Notification  │
    │             │                │                │◄───────────────┤
    │             │                │                │                │
    │             │  Success       │                │                │
    │             │◄───────────────┤                │                │
    │             │                │                │                │
    │Show Success │                │                │                │
    │◄────────────┤                │                │                │
    │             │                │                │                │
```

---

### Class Diagram

```
┌─────────────────────────────────┐
│           User                  │
├─────────────────────────────────┤
│ - id: number                    │
│ - username: string              │
│ - email: string                 │
│ - password: string (hashed)     │
│ - phone: string                 │
│ - role: enum                    │
│ - profilePicture: string        │
│ - onlineStatus: boolean         │
│ - department: string (optional) │
│ - course: string (optional)     │
│ - yearLevel: number (optional)  │
│ - bio: string (optional)        │
│ - lastActive: Date              │
│ - createdAt: Date               │
│ - updatedAt: Date               │
├─────────────────────────────────┤
│ + comparePassword()             │
│ + hashPassword()                │
│ + toJSON()                      │
└─────────────────────────────────┘
         ▲                ▲
         │                │
    ┌────┴────┐      ┌────┴────┐
    │         │      │         │
┌───┴───┐ ┌───┴───┐ ┌┴────────┐
│Student│ │Teacher│ │  Admin  │
└───────┘ └───────┘ └─────────┘

┌─────────────────────────────────┐
│        Notification             │
├─────────────────────────────────┤
│ - id: number                    │
│ - title: string                 │
│ - content: text                 │
│ - category: enum                │
│ - priority: enum                │
│ - image: string (optional)      │
│ - targetAudience: enum          │
│ - isActive: boolean             │
│ - createdBy: number (FK)        │
│ - createdAt: Date               │
│ - updatedAt: Date               │
├─────────────────────────────────┤
│ + create()                      │
│ + update()                      │
│ + delete()                      │
│ + getByUser()                   │
└─────────────────────────────────┘
              │
              │ 1:N
              ▼
┌─────────────────────────────────┐
│          Message                │
├─────────────────────────────────┤
│ - id: number                    │
│ - content: text                 │
│ - senderId: number (FK)         │
│ - recipientId: number (FK)      │
│ - isBroadcast: boolean          │
│ - readStatus: boolean           │
│ - readTimestamp: Date           │
│ - deletedFor: string            │
│ - timestamp: Date               │
│ - createdAt: Date               │
│ - updatedAt: Date               │
├─────────────────────────────────┤
│ + send()                        │
│ + markAsRead()                  │
│ + deleteForMe()                 │
│ + deleteForEveryone()           │
│ + getConversation()             │
└─────────────────────────────────┘
              ▲
              │ M:N
              │
        ┌─────┴─────┐
        │           │
    ┌───┴───┐   ┌───┴───┐
    │ Sender│   │Recipient│
    │ (User)│   │ (User)│
    └───────┘   └───────┘
```

**Relationships:**
- User `1:N` Notification (One user creates many notifications)
- User `1:N` Message as Sender (One user sends many messages)
- User `1:N` Message as Recipient (One user receives many messages)
- User specializes into Student, Teacher, Admin

**Enums:**
- **Role**: `admin`, `teacher`, `student`
- **NotificationCategory**: `academic`, `event`, `announcement`, `urgent`
- **Priority**: `low`, `medium`, `high`, `urgent`
- **TargetAudience**: `all`, `students`, `teachers`, `admins`

---

## 📁 Project Structure

```
ionic-school-system/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── notificationController.ts
│   │   │   ├── messageController.ts
│   │   │   └── userController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── upload.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Notification.ts
│   │   │   └── Message.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── notificationRoutes.ts
│   │   │   ├── messageRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── database/
│   │   │   └── config.ts
│   │   ├── socket/
│   │   │   └── handlers.ts
│   │   └── server.ts
│   ├── uploads/
│   │   ├── profiles/
│   │   └── notifications/
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       └── logos/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Notifications.tsx
│   │   │   ├── Messages.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── ManageUsers.tsx
│   │   │   └── CreateUser.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── socket.ts
│   │   ├── styles/
│   │   │   └── responsive.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── start-backend.bat
├── start-frontend.bat
├── ONE-CLICK-START.bat
└── README.md
```

---

## 🌐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "role": "student" | "teacher" | "admin"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response: {
  "token": "JWT_TOKEN",
  "user": {...}
}
```

### Notification Endpoints

#### Get All Notifications
```http
GET /notifications
Authorization: Bearer <token>
```

#### Create Notification
```http
POST /notifications
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "string",
  "content": "string",
  "category": "string",
  "priority": "string",
  "targetAudience": "string",
  "image": File (optional)
}
```

#### Update Notification
```http
PUT /notifications/:id
Authorization: Bearer <token>
```

#### Delete Notification
```http
DELETE /notifications/:id
Authorization: Bearer <token>
```

### Message Endpoints

#### Get Messages
```http
GET /messages
Authorization: Bearer <token>
```

#### Send Message
```http
POST /messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "string",
  "isBroadcast": boolean
}
```

#### Delete Message (For Me)
```http
DELETE /messages/:messageId/delete-for-me
Authorization: Bearer <token>
```

#### Delete Message (For Everyone)
```http
DELETE /messages/:messageId/delete-for-everyone
Authorization: Bearer <token>
```

### User Endpoints

#### Get All Users
```http
GET /users
Authorization: Bearer <token>
```

#### Create User
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "role": "string",
  "department": "string" (optional),
  "course": "string" (optional),
  "yearLevel": number (optional)
}
```

#### Update Profile
```http
PUT /users/profile/update
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "username": "string",
  "email": "string",
  "phone": "string",
  "profilePicture": File (optional)
}
```

#### Change Password
```http
POST /users/profile/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "string",
  "newPassword": "string"
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed for use by Surigao del Norte State University (SNSU).

© 2025 SNSU. All rights reserved.

---

## 📞 Support

For issues, questions, or support:

- **Email**: admin@snsu.edu.ph
- **Website**: [SNSU Official Website](https://snsu.edu.ph)

---

## 🙏 Acknowledgments

- Surigao del Norte State University
- Ionic Framework Team
- Node.js & Express.js Communities
- All contributors and testers

---

**Built with ❤️ for SNSU**
