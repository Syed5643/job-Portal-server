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

* **Frontend:** React (with Vite), Axios, React Router - For a fast and interactive user interface.
* **Backend:** Node.js, Express.js - To build a lightweight and efficient backend API.
* **Database:** MongoDB (with Mongoose) - For a flexible database that handles user and job data easily.
* **Authentication:** JWT, bcrypt.js - To implement secure, token-based authentication and protect routes.
* **Deployment:**
    * Frontend deployed on **Netlify**.
    * Backend deployed on **Render**.
    * Database hosted on **MongoDB Atlas**.

---

### 4. Challenges Faced and Solutions

During the project, I encountered several challenges which provided valuable learning experiences:

* **Problem:** My initial Git setup was incorrect, causing it to track my entire user directory.
    * **Solution:** I learned how to properly diagnose the issue, remove the incorrect `.git` repository, navigate to the correct project folder, and re-initialize it to track only the project files.

* **Problem:** The backend deployment on Render failed because it couldn't find the `package.json` file.
    * **Solution:** I realized my local file structure was wrong. I corrected it by moving the backend's `package.json` into the `job_portal_backend` folder and pushed the fix, which led to a successful deployment.

* **Problem:** The login feature wasn't redirecting on the live site.
    * **Solution:** I learned to use the browser's Developer Console (specifically the Network tab) to debug the issue. I discovered that my backend server was not running and that I needed both the frontend and backend servers to be active for the full-stack application to work.
