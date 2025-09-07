# Job Portal Full-Stack Application

This is a complete full-stack web application for a job portal, built as a technical assessment. It features two distinct user roles: **Students**, who can search and apply for jobs, and **Employers**, who can post job listings and view applicants.

---

## Live Demo Links

* **Live Frontend (Netlify):** [https://your-netlify-site-name.netlify.app](https://your-netlify-site-name.netlify.app)
* **Live Backend (Render):** [https://job-portal-backend.onrender.com](https://job-portal-backend.onrender.com)

---

## Features Implemented

* **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
* **Role-Based Access Control:**
    * **Students:** Can view/search jobs, apply for jobs, and see their application history.
    * **Employers:** Can post new jobs, view all applicants for their jobs, and manage their job listings.
* **Job Management:** Employers can create and delete job postings.
* **Search and Filtering:** Students can search for jobs by title, company, or location.
* **Application System:** Students can apply for jobs, and employers can see a list of applicants for each position.
* **Responsive UI:** The frontend is styled with a professional and clean design that works on different screen sizes.

---

## Tech Stack

* **Frontend:** React (with Vite), Axios, React Router
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JWT, bcrypt.js
* **Deployment:**
    * Frontend deployed on **Netlify**.
    * Backend deployed on **Render**.
    * Database hosted on **MongoDB Atlas**.

---

## Local Setup and Installation

To run this project on your local machine:

### 1. Backend Setup

```bash
# Navigate to the backend folder
cd job_portal_backend

# Install dependencies
npm install

# Create a .env file and add your MONGO_URI and JWT_SECRET
# Example:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret

# Start the server
node server.js