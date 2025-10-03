# Node.js User Management API

This project is a **RESTful API** built with **Node.js** and **Express.js** for managing user data. It provides core functionalities such as user registration, login with JWT authentication, and role-based access to user information. The database interaction is handled using **Mongoose** with a **MongoDB** database.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)

  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Environment Configuration](#3-environment-configuration)
  - [4. Database Setup](#4-database-setup)
  - [5. Running the Application](#5-running-the-application)

- [API Endpoints](#api-endpoints)

---

## Features

- **User Registration**: Allows new users to create an account with validated fields.
- **Secure User Login**: Authenticates users and provides a JSON Web Token (JWT) for session management.
- **Password Hashing**: Hashes user passwords securely using bcryptjs before saving.
- **Role-Based Access Control**: Differentiates between admin and user roles to secure certain endpoints.
- **Protected Routes**: Middleware verifies JWT to protect sensitive endpoints.
- **Centralized Error Handling**: Provides clean error responses for validation and operational errors.

---

## Technologies Used

- **Node.js** – Server-side runtime.
- **Express.js** – Framework for building APIs.
- **MongoDB** – NoSQL database for storing user data.
- **Mongoose** – An Object Data Modeling (ODM) library for MongoDB.
- **JSON Web Tokens (JWT)** – For authentication and secure access.
- **bcryptjs** – Password hashing.
- **dotenv** – Manage environment variables.

---

## Prerequisites

- Node.js (version 14 or newer)
- NPM (Node Package Manager)
- MongoDB (running locally or via MongoDB Atlas)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a file named **`config.env`** in the project root and add:

```env
NODE_ENV=development
PORT=3000

# MongoDB Connection String
DATABASE=mongodb://localhost:27017/node-assessment

# JWT Configuration
JWT_SECRET=this-is-a-super-secret-key-for-jwt
JWT_EXPIRES_IN=90d
```

⚠️ **Important:**

- Update `DATABASE` with your own MongoDB connection string.
- Use a strong, random value for `JWT_SECRET`.

### 4. Database Setup

- Ensure MongoDB is running.
- Mongoose will auto-create the database (`node-assessment`) and `assessment_users` collection when a user registers.

### 5. Running the Application

```bash
npm start
```

Server will run at **[http://localhost:3000](http://localhost:3000)**.

---

## API Endpoints

Base URL: `/api/user`

### Authentication

#### 1. Register a New User

**POST** `/api/user/signup`
Request Body:

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "securepassword123",
  "phone": 9876543210,
  "city": "London",
  "country": "UK"
}
```

Response:

```json
{
  "status": "success",
  "token": "your_jwt_token",
  "data": {
    "user": { ... }
  }
}
```

#### 2. Login a User

**POST** `/api/user/login`
Request Body:

```json
{
  "email": "jane.doe@example.com",
  "password": "securepassword123"
}
```

Response:

```json
{
  "status": "success",
  "token": "your_jwt_token",
  "data": {
    "user": { ... }
  }
}
```

---

### User Management (Protected Endpoints)

**Authorization Header:**
`Authorization: Bearer <your_jwt_token>`

#### 3. Get All Users (Admin Only)

**GET** `/api/user/allUser`
Response:

```json
{
  "status": "success",
  "data": {
    "alluser": [ { ... }, { ... } ]
  }
}
```

#### 4. Get Logged-In User’s Details

**GET** `/api/user/getMe`
Response:

```json
{
  "status": "success",
  "data": {
    "user": { ... }
  }
}
```

#### 5. Get User by ID

**GET** `/api/user/:id`

- Admin: Can view any user.
- User: Can only view their own details.

Response:

```json
{
  "status": "success",
  "data": {
    "user": { ... }
  }
}
```

---
