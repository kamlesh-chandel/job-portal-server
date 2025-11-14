# Job Portal — Backend

The **backend** of the Job Portal App handles the complete server-side logic of the platform — including authentication, role-based access, job and application management, and file uploads to AWS S3.

It provides RESTful APIs to connect with the React frontend and supports both **Student** and **Recruiter** roles with secure authorization and data handling.

---

## Objective

The main goal of this backend is to provide a **scalable and secure REST API** for the Job Portal App.  
It manages **user authentication**, **role-based access control**, **CRUD operations**, and **resume/image uploads** via **AWS S3**.

---

## Tech Stack

| Category                | Technology             |
| ----------------------- | ---------------------- |
| **Runtime Environment** | Node.js                |
| **Framework**           | Express.js             |
| **Database**            | MongoDB (via Mongoose) |
| **Authentication**      | JWT (JSON Web Token)   |
| **File Storage**        | AWS S3                 |
| **Deployment**          | AWS EC2                |
| **Version Control**     | Git & GitHub           |

---

## Key Features

- **Authentication & Authorization**
  - User login/register with JWT tokens
  - Role-based access control for Student and Recruiter

- **Recruiter Functionalities**
  - Register company and manage company details
  - Create, edit, and delete job posts
  - View applicants and their uploaded resumes
  - Update job application statuses

- **Student Functionalities**
  - Register and login
  - Browse and apply for jobs
  - Upload resume and profile photo
  - View and track job application status
  - Save and unsave jobs

- **File Upload**
  - Resume and profile photo uploads to **AWS S3**

- **Error Handling & Security**
  - Protected routes for authenticated users only

---

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/job-portal-backend.git
```

### Navigate into the project directory

```bash
cd job-portal-backend
```

### Install Dependencies

```bash
npm install
```

### Setup Environment Variables

```bash
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=port_number
```

### Run the Server

```bash
npm run dev
```

---

## Security & Best Practices

- All routes are protected using **JWT-based authentication**

- Sensitive credentials stored in **.env** file

## Developed By

**[Kamlesh Chandel](https://github.com/kamlesh-chandel)**

> MERN Stack Developer | Passionate about building scalable and secure web applications
