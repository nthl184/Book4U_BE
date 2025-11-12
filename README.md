# 📚 **Book4U – Backend (Node.js + Express + MongoDB)**

> Smart Library Management System for Students – built with RESTful APIs, JWT Authentication, and Mongoose ORM.

---

## 🚀 **1. Overview**

Book4U Backend là **server API** phục vụ cho hệ thống thư viện thông minh (Book4U).  
Nó cung cấp các tính năng chính:

- ✅ Xác thực người dùng (JWT Authentication)
- ✅ Quản lý sách (Books CRUD)
- ✅ Quản lý yêu cầu mượn trả (Borrow Management)
- ✅ Tự động phân quyền (Student / Admin)
- ✅ Kết nối MongoDB (Atlas hoặc Local)

---

## 🧩 **2. Tech Stack**

| Layer              | Technology                |
| ------------------ | ------------------------- |
| Server Framework   | **Express.js (Node.js)**  |
| Database           | **MongoDB + Mongoose**    |
| Authentication     | **JWT (jsonwebtoken)**    |
| Password Hashing   | **bcryptjs**              |
| Environment Config | **dotenv**                |
| Async Handler      | **express-async-handler** |
| Dev Tooling        | **Nodemon**               |

---

## ⚙️ **3. Installation & Setup**

### 🪶 Step 1 – Clone repo

```bash
git clone https://github.com/<your-username>/Book4U_BE.git
cd Book4U_BE
```

### 🧱 Step 2 – Install dependencies

```bash
npm install
```

### ⚡ Step 3 – Create `.env` file

Tạo file `.env` tại thư mục gốc:

```bash
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/book4u
JWT_SECRET=secretkey
PORT=5000
```

### ▶️ Step 4 – Run server

**Development mode (hot reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Server mặc định chạy tại:  
👉 `http://localhost:5000/api`

---

## 🧠 **4. Folder Structure**

```
Book4U_BE/
│
├── controllers/        # Logic xử lý chính cho từng module
│   ├── authController.js
│   ├── bookController.js
│   └── borrowController.js
│
├── models/             # Mongoose schema cho MongoDB
│   ├── userModel.js
│   ├── bookModel.js
│   └── borrowModel.js
│
├── middlewares/        # Middleware (JWT, error handling,…)
│   └── authMiddleware.js
│
├── routes/             # Định nghĩa các API endpoint
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── borrowRoutes.js
│
├── seedUsers.js        # Script tạo user sinh viên mặc định
│
├── server.js           # Entry point của ứng dụng
├── .env.example
├── package.json
└── README.md
```

---

## 🔐 **5. Authentication Flow**

### Register (`POST /api/auth/register`)

```json
{
  "name": "Nguyen Thi My Duyen",
  "email": "22520350@gm.uit.edu.vn",
  "password": "1234",
  "role": "student"
}
```

### Login (`POST /api/auth/login`)

> Hỗ trợ 2 cách đăng nhập:
>
> - **Sinh viên**: chỉ nhập MSSV (tự nối `@gm.uit.edu.vn`)
> - **Admin**: đăng nhập bằng email thật (`admin@book4u.com`)

**Request:**

```json
{
  "email": "22520350",
  "password": "1234"
}
```

**Response:**

```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "6730c2...",
    "name": "Nguyễn Thị Mỹ Duyên",
    "email": "22520350@gm.uit.edu.vn",
    "role": "student"
  }
}
```

---

## 📘 **6. Main API Endpoints**

| Endpoint                  | Method | Description                   | Role          |
| ------------------------- | ------ | ----------------------------- | ------------- |
| `/api/auth/register`      | POST   | Tạo tài khoản mới             | Admin         |
| `/api/auth/login`         | POST   | Đăng nhập                     | All           |
| `/api/books`              | GET    | Lấy danh sách sách            | All           |
| `/api/books/:id`          | GET    | Chi tiết sách                 | All           |
| `/api/borrow`             | POST   | Tạo yêu cầu mượn              | Student       |
| `/api/borrow`             | GET    | Danh sách mượn (Admin)        | Admin         |
| `/api/borrow/me`          | GET    | Danh sách mượn của chính user | Student       |
| `/api/borrow/:id/approve` | PUT    | Duyệt yêu cầu mượn            | Admin         |
| `/api/borrow/:id/return`  | PUT    | Đánh dấu đã trả               | Admin         |
| `/api/borrow/:id/extend`  | PUT    | Gia hạn 7 ngày                | Student/Admin |

---

## 🧑‍🎓 **7. Seed Student Accounts**

Dùng script `seedUsers.js` để tạo danh sách sinh viên mặc định.  
Mặc định mỗi user có:

| Field    | Value                |
| -------- | -------------------- |
| Email    | `MSSV@gm.uit.edu.vn` |
| Password | `1234`               |
| Role     | `student`            |

### Chạy lệnh:

```bash
node seedUsers.js
```

---

## 🧑‍💼 **8. Admin Default Account**

```json
{
  "email": "admin@book4u.com",
  "password": "123456",
  "role": "admin"
}
```

---

## 🌐 **9. Integration with Frontend (React)**

Frontend (Book4U_FE) sử dụng `axiosClient` để gọi API.  
Cấu hình:

```js
axios.defaults.baseURL = "http://localhost:5000/api";
```

Gửi JWT token trong Header:

```js
Authorization: Bearer <JWT_TOKEN>
```

---

## 🧾 **10. License**

This project is licensed under the **MIT License**.  
© 2025 **Book4U Smart Library**

---

## ❤️ **Contributors**

| Role         | Name                  | Student ID |
| ------------ | --------------------- | ---------- |
| 👨‍💻 Developer | Nguyễn Thị Mỹ Duyên   | 22520350   |
| 👨‍💻 Developer | Nguyễn Thị Huyền Linh | 22520772   |

---
