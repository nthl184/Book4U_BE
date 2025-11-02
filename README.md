# 📚 Book4U Frontend

Book4U is a modern **smart library web application** for students and admins —  
built with **React + Bootstrap + Lucide Icons**, designed for an elegant reading experience.

This folder contains the **Frontend (FE)** source code, which connects to a Node.js backend via RESTful APIs.

---

## 🚀 Tech Stack

| Layer                   | Technology                          |
| ----------------------- | ----------------------------------- |
| **Frontend Framework**  | React 18 + Vite                     |
| **UI Library**          | React-Bootstrap                     |
| **Icons**               | Lucide React                        |
| **HTTP Client**         | Axios                               |
| **Routing**             | React Router DOM                    |
| **Styling**             | CSS3 (custom purple gradient theme) |
| **Backend (connected)** | Node.js + Express (Book4U_BE)       |

---

## 📂 Folder Structure

```
Book4U_FE/
│
├── public/                 # Static assets
├── src/
│   ├── api/                # API service modules
│   │   ├── axiosClient.js
│   │   ├── authApi.js
│   │   ├── bookApi.js
│   │   └── borrowApi.js
│   │
│   ├── components/         # Shared UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/              # Main page views
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Books.jsx
│   │   ├── BookDetail.jsx
│   │   ├── BorrowStatus.jsx
│   │   ├── BorrowManage.jsx
│   │   └── History.jsx
│   │
│   ├── App.jsx             # Routing configuration
│   ├── App.css             # Global styling
│   └── index.jsx            # Entry point
│
├── package.json
└── vite.config.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run the development server

```bash
npm run dev
```

> Default runs at: **http://localhost:5173**

---

## 🔗 API Integration

Frontend communicates with the backend using Axios.  
You can configure your API base URL in:

```
src/api/axiosClient.js
```

Example:

```js
const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});
```

---

## 👥 User Roles

### 🎓 Student

- View all books
- Borrow and view borrow history
- Read book online
- See recently viewed books
- Check “My Borrow” status (overdue, extended, returned)

### 🧑‍💼 Admin

- Manage book catalog (Add / Edit / Delete)
- Manage borrow list (Approve / Extend / Return)

---

## 🧠 Key Features

✅ Responsive UI with soft purple gradient theme  
✅ Role-based access control  
✅ Book management (CRUD)  
✅ Borrow management (status, approval, extension)  
✅ LocalStorage caching + API connection  
✅ Modular architecture for easy maintenance

---

## 🛠 API Modules Overview

| Module             | Description                                    |
| ------------------ | ---------------------------------------------- |
| **authApi.js**     | Login, token verify                            |
| **bookApi.js**     | Get all books, create/edit/delete book         |
| **borrowApi.js**   | Borrow request, approve, extend, return        |
| **axiosClient.js** | Global Axios instance (base URL, interceptors) |

---

## 📸 UI Preview

| Page             | Description                     |
| ---------------- | ------------------------------- |
| 🏠 Home          | Welcome page + quick access     |
| 📖 Books         | Browse and search books         |
| 📚 Book Detail   | Read book online, Borrow button |
| ⏳ Borrow Manage | Admin approves or extends       |
| 🕓 History       | Student recently viewed books   |
| 🔐 Login         | Simple login with demo roles    |

---

## 👩‍💻 Developer

**Project:** Book4U – Smart Library for Students  
**Frontend Developer:** Nguyen Thi My Duyen - 22520350
**University:** University of Information Technology (UIT – VNUHCM)  
**Year:** 2025  
**Instructor:** Dr. Nguyen Thanh Binh

---

## 📄 License

This project is open-sourced for educational purposes.  
© 2025 Book4U Library System – All rights reserved.
