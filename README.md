# Job Portal — Backend

The **backend** of the Job Portal App handles the complete server-side logic of the platform — including authentication, role-based access, job and application management, and file uploads to AWS S3.

It provides RESTful APIs to connect with the React frontend and supports both **Student** and **Recruiter** roles with secure authorization and data handling.

---

## Objective

The main goal of this backend is to provide a **scalable and secure REST API** for the Job Portal App.  
It manages **user authentication**, **role-based access control**, **CRUD operations**, and **resume/image uploads** via **AWS S3**.

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| **Runtime Environment** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB (via Mongoose) |
| **Authentication** | JWT (JSON Web Token) |
| **File Storage** | AWS S3 |
| **Deployment** | AWS EC2 |
| **Version Control** | Git & GitHub |

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
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=your_aws_region
PORT=8000
```
### Run the Server
```bash
npm run dev
```
---

## API Routes Overview

### User Routes (/api/v1/user)

| Endpoint              | Method | Description                                    |
| --------------------- | ------ | ---------------------------------------------- |
| `/register`           | POST   | Register a new user (Student or Recruiter)     |
| `/login`              | POST   | Login existing user                            |
| `/logout`             | GET    | Logout user                                    |
| `/profile/update`     | POST   | Update user profile details (with file upload) |                    |                         |

### Company Routes (/api/v1/company)

| Endpoint      | Method | Description                            |
| ------------- | ------ | -------------------------------------- |
| `/register`   | POST   | Register a company                     |
| `/get`        | GET    | Get all registered                     |



### Job Routes (/api/v1/job)

| Endpoint        | Method | Description           |
| --------------- | ------ | --------------------- |
| `/post`         | POST   | Create a new job      |
| `/get`          | GET    | Get all jobs          |
| `/getadminjobs` | GET    | Get recruiter’s jobs  |
| `/get/:id`      | GET    | Get job details       |
| `/save/:id`     | GET    | Save a job (bookmark) |
| `/unsave/:id`   | GET    | Remove saved job      |


### Application Routes (/api/v1/application)

| Endpoint             | Method | Description                                        |
| -------------------- | ------ | -------------------------------------------------- |
| `/apply/:id`         | POST   | Apply for a job                                    |
| `/get`               | GET    | Get all applied jobs (student view)                |
| `/:id/applicants`    | GET    | Get applicants for a specific job (recruiter view) |
| `/status/:id/update` | POST   | Update job application status                      |
                           

## Deployment
- **Platform:** AWS EC2

- **Database:** MongoDB Atlas

- **File Storage:** AWS S3

## Security & Best Practices
- All routes are protected using **JWT-based authentication**

- Sensitive credentials stored in **.env** file

## Developed By

**[Kamlesh Chandel](https://github.com/kamlesh-chandel)**  
> MERN Stack Developer | Passionate about building scalable and secure web applications
