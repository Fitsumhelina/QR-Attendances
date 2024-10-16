
### Project Overview
Your web application will:
1. **User Registration**: Students will register themselves by providing personal details including their university ID (with a QR code), and this registration will go to the admin's dashboard for approval.
2. **Admin Approval**: Admin can approve or disapprove the registration, with approved data stored in Google Sheets.
3. **Attendance Management**: Admin can scan students' QR codes to mark attendance and record it in the Google Sheet.
4. **Registration Management**: Admin controls when registration is open or closed.
5. **Student Search**: Admin can search for specific student data using their ID number.

### Project Technologies
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (for student data storage)
- **Frontend**: React.js (or simple HTML/CSS if you prefer)
- **Google Sheets Integration**: Use Google Sheets API to save student data and attendance records.
- **Authentication**: Pre-registered email and password for admin, students can register using their university email.
- **QR Code Scanner**: A tool to scan QR codes to track attendance (using a library like `qrcode-reader`).
- **Deployment**: Vercel (for frontend), Railway/Heroku for backend.

---

### Project Structure and Workflow

#### 1. **Authentication**
- **Pre-registered Admin**: Only admin can approve or reject students and manage attendance.
- **Student Registration**: Students create an account with full name, university ID, sex, age, profile picture, department (dropdown), phone number, email, interests, and experience.
- **Registration Flow**: Upon student registration, the data goes to a pending tab. The admin can review and approve it.

#### 2. **Admin Features**
- **Approval Dashboard**: 
  - Pending page shows new registrations with all submitted data.
  - Admin can approve or disapprove each student. Upon approval, the student’s data is saved to a Google Sheet.
  - Approved students appear in the “Registered” tab. Clicking on a student will display their full details. Admin can filter students using ID number.
  
- **Attendance System**:
  - Admin can scan the student’s QR code and mark their attendance for a particular day and save it to the Google Sheet.

- **Registration Management**:
  - Admin can open or close student registration based on need.
  
#### 3. **Student Features**
- **Self-Registration**: Students can fill out their personal data and submit it. This will go to the admin's pending page.
- **Profile Picture and QR Code**: Each student must upload a profile picture, and their university ID (with a QR code) will be scanned for attendance.
  
---

### Backend Architecture (Node.js + MongoDB)
- **Authentication**: 
  - Implement user authentication for admin (hardcoded credentials in the beginning or using Firebase Authentication).
  - Student data stored securely in MongoDB, and data sent to Google Sheets API upon approval.

- **QR Code Scanner**:
  - Use `qrcode-reader` to scan the student ID and check them in for attendance. This data should be linked to the student's MongoDB entry.
  
- **Admin Dashboard**: 
  - Create a REST API for:
    - Approving/Disapproving students.
    - Viewing registered students (GET).
    - Searching student by ID.
    - Managing attendance (POST requests to save scanned QR codes).

- **Database Schema**:
  - **Student Collection**:
    ```js
    {
      fullName: String,
      idNumber: String,  // university ID
      sex: String,
      age: Number,
      department: String,
      profilePicture: String,
      email: String,
      phoneNumber: String,
      interests: [String],
      experience: {
        hasExperience: Boolean,
        degreeNumber: Number
      },
      isApproved: Boolean,
      approvedDate: Date,
      attendance: [{
        date: Date,
        status: String  // Present/Absent
      }]
    }
    ```
  
- **Google Sheets Integration**: 
  - Once the admin approves a student, their data should be sent to a designated Google Sheet using the Google Sheets API.

---

### Frontend Architecture (React or HTML/CSS)
- **Registration Form**: 
  - Create a form that allows students to register. This should include file upload for profile pictures and dropdowns for department selection.
  
- **Admin Dashboard**:
  - Display registered students in one tab.
  - Display pending student registrations in another tab.
  - Allow search functionality based on university ID.
  - QR code scanner for attendance (this will use the backend API to mark attendance).
  
- **Registration Control**:
  - Admin can toggle registration status on the dashboard (open/close registration for new students).
  
---

### Project Workflow and Document Outline

1. **Step 1: Setup**
   - Initialize the project using Node.js and MongoDB.
   - Create routes for student registration and admin approval.
   - Setup Google Sheets API and integrate it into the project for saving approved student data.
   
2. **Step 2: Student Registration**
   - Implement frontend form for student registration.
   - Create API routes to handle form submission and store data in MongoDB.
   - Ensure that data goes into a "pending" status by default, awaiting admin approval.

3. **Step 3: Admin Dashboard**
   - Build a simple admin dashboard with login authentication.
   - Display pending registrations with options to approve or reject.
   - When approved, send the data to Google Sheets and mark the student as "approved" in MongoDB.

4. **Step 4: QR Code Attendance**
   - Implement QR code scanning functionality for taking attendance.
   - Mark the attendance in the Google Sheets with the appropriate student information and date.

5. **Step 5: Deployment**
   - Deploy frontend on Vercel and backend on Railway/Heroku.
   - Ensure environment variables are securely managed for MongoDB and Google Sheets API.

---

### Documentation (README.md)

#### 1. Project Overview
  - Brief explanation of what the project does.

#### 2. Features
  - Registration for students.
  - Admin approval for student data.
  - Attendance system with QR code.
  - Integration with Google Sheets for data storage.

#### 3. Tech Stack
  - Node.js, Express, MongoDB, React (or HTML/CSS).
  - Google Sheets API.

#### 4. Setup Instructions
  - Instructions for cloning the repository.
  - Environment setup (`.env` for MongoDB connection, Google Sheets API keys).
  - Running the project locally.
  - Deployment instructions.

#### 5. API Endpoints
  - List all API routes (e.g., student registration, admin approval, attendance).
  
#### 6. Future Improvements
  - Adding additional attendance reports.
  - Adding notifications for students (e.g., approval email).



Here’s a well-organized explanation of your project’s folder structure and its use, formatted for your `README.md`:

```markdown
# Project Folder Structure

This project is divided into two main sections: **backend** and **frontend**, each handling different aspects of the Student Attendance System. Below is a breakdown of the folder structure and its use.

## Project Structure

/student-attendance-system
│
├── /backend                # Backend folder
│   ├── /config             # Configurations (e.g., MongoDB connection, environment variables)
│   ├── /controllers        # Controller files to handle logic
│   ├── /models             # MongoDB models
│   ├── /routes             # Routes for different endpoints
│   ├── /middleware         # Middleware for authentication and error handling
│   ├── /utils              # Utility functions (e.g., QR Code, Google Sheets integration)
│   ├── app.js              # Main Express app setup
│   └── server.js           # Server entry point
│
├── /frontend               # Frontend folder for HTML and CSS files
│   ├── /css                # Stylesheets for the frontend
│   ├── /images             # Image assets (e.g., profile pictures)
│   ├── index.html          # Main registration form (student side)
│   ├── login.html          # Admin login page
│   ├── dashboard.html      # Admin dashboard to manage registrations
│   └── attendance.html     # QR code scanning for attendance
│
├── /node_modules            # Node.js modules (auto-generated after npm install)
├── .env                     # Environment variables (e.g., MongoDB URI, API keys)
├── package.json             # Project dependencies and scripts
├── README.md                # Project documentation
└── .gitignore               # Files to be ignored in Git (e.g., node_modules, .env)



