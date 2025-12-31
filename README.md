# 🚗 Vehicle Rental System – Backend API

🔗 Live API: https://l2-assignment-2-psi.vercel.app/api/v1/  
📦 GitHub: https://github.com/themahabur/Vehicle-Rental-System-Backend-API

---

## 📌 Overview
RESTful backend API for managing vehicle rentals with secure authentication, role-based access, vehicle inventory, and booking management. Built with **Node.js, TypeScript, Express, PostgreSQL**.

---

## ✨ Features
- JWT Authentication
- Admin & Customer Roles
- Vehicle Management
- Booking, Cancel & Return System
- Auto Rental Cost Calculation
- Modular Feature-based Architecture
- bcrypt Password Hashing

---

## 🛠️ Tech Stack
Node.js | TypeScript | Express.js | PostgreSQL | JWT | bcrypt | dotenv



## 🔐 Authentication & Authorization

### User Roles

**Admin**
- Manage users
- Manage vehicles
- Manage all bookings

**Customer**
- View vehicles
- Create, cancel, and view own bookings

### JWT Header Format



Authorization: Bearer token


---

## 🌐 API Endpoints (Summary)

### Authentication
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/signin`

### Vehicles
- `POST /api/v1/vehicles` (Admin)
- `GET /api/v1/vehicles`
- `GET /api/v1/vehicles/:vehicleId`
- `PUT /api/v1/vehicles/:vehicleId` (Admin)
- `DELETE /api/v1/vehicles/:vehicleId` (Admin)

### Users
- `GET /api/v1/users` (Admin)
- `PUT /api/v1/users/:userId`
- `DELETE /api/v1/users/:userId` (Admin)

### Bookings
- `POST /api/v1/bookings`
- `GET /api/v1/bookings`
- `PUT /api/v1/bookings/:bookingId`

---

## 📐 Business Rules

- Vehicles must be **available** before booking
- Rental cost calculation:


daily_rent_price × number_of_days

- Customers can cancel bookings **before start date**
- Admin can mark bookings as **returned**
- Vehicle availability updates automatically

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/themahabur/Vehicle-Rental-System-Backend-API.git
cd vehicle-rental-system-backend

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env file:

PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret

4️⃣ Run the Server
npm run dev


Server will run on:

http://localhost:5000

🚀 Deployment

The API is deployed on a cloud platform.

🔗 Live API: https://l2-assignment-2-psi.vercel.app/api/v1/