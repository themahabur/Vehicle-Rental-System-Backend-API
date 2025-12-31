# 🚗 Vehicle Rental System – Backend API

🔗 **Live API URL:** https://your-live-api-url.com  
📦 **GitHub Repository:** https://github.com/your-username/vehicle-rental-system-backend

---

## 📌 Project Overview

The **Vehicle Rental System Backend API** is a RESTful application built to manage vehicle rentals efficiently.  
It supports secure authentication, role-based authorization, vehicle inventory management, and complete booking lifecycle handling.

The project follows **clean architecture**, **modular design**, and **industry best practices** using **Node.js and TypeScript**.

---

## ✨ Features

- 🔐 JWT-based Authentication
- 👥 Role-based Access Control (Admin & Customer)
- 🚘 Vehicle Inventory Management
- 📅 Booking, Cancellation & Return System
- 💰 Automatic Rental Cost Calculation
- 🧱 Feature-based Modular Architecture
- ⚠️ Centralized Error Handling
- 🔒 Secure Password Hashing using bcrypt

---

## 🛠️ Technology Stack

- **Runtime:** Node.js  
- **Language:** TypeScript  
- **Framework:** Express.js  
- **Database:** PostgreSQL  
- **Authentication:** JSON Web Token (JWT)  
- **Security:** bcrypt  
- **Environment Management:** dotenv  

---

## 📁 Project Structure

src/
├── config/ # Database & environment configuration
├── middlewares/ # Auth, role & error middlewares
├── modules/ # Feature-based modules
│ ├── auth/
│ ├── bookings/
│ ├── users/
│ └── vehicles/
├── types/ # Shared TypeScript types
├── app.ts # Express app configuration
├── server.ts # Server entry point


Root Files:


.env
.gitignore
package.json
tsconfig.json


---

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



Authorization: Bearer <token>


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
git clone https://github.com/your-username/vehicle-rental-system-backend.git
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

🔗 Live API: https://your-live-api-url.com