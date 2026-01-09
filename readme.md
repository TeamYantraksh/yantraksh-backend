A backend built with **TypeScript, Express, Prisma (MongoDB), Mongoose, Zod, JWT, OOP architecture**, and a clean module-based structure.

This README explains **how the project works, how to contribute, and how to test it**.

# 📁 **Project Structure Overview**

The backend follows a strict, scalable **Object-Oriented, Modular Architecture**.

```
src
│
├── config/
│   ├── database.ts                # DB config
|   ├── client.ts                  # Prisma client instance
│
├── core/
│   ├── AppError.ts           # Custom error class
│
├── middlewares/
│   ├── validate.ts           # Zod validation middleware
│   ├── requireUser.ts        # JWT auth middleware
│   ├── errorHandler.ts       # Global error handler
│
├── prisma/
│   ├── schema.prisma         # Prisma MongoDB schema
│
├── mongoose(not yet implemented implement from schema)/
│   ├── merch.model.ts        # Mongoose models (example)
│   ├── ticket.model.ts
│   ├── accommodation.model.ts
│
├── modules/
│   ├── auth/                 # Prisma Module (OOP)
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.validators.ts
│   │
|   |  (To be done)
│   ├── merch/                # Mongoose Module (OOP)
│   ├── ticket/
│   ├── accommodation/
│
├── types/
│   ├── user.ts
│   ├── auth.ts
│   ├── request.ts
│
└── server.ts                 # App entry point
```

---

# 🧠 **Architecture Philosophy (MUST FOLLOW)**

This codebase follows **strict Object-Oriented rules**:

### ✔ Each module has 4 layers:

1. **Repository** → DB operations (Prisma OR Mongoose)
2. **Service** → Business logic (classes ONLY)
3. **Controller** → Request/Response handling
4. **Routes** → Route definitions

### ✔ No business logic inside controllers

### ✔ No raw Prisma/Mongoose calls outside repositories

### ✔ No validation inside services (Zod middleware handles that)

### ✔ No `any` types — use strict TypeScript types

### ✔ Prisma is used ONLY for:

* Users
* Authentication
* Competition
* Team
* Participation

### ✔ Mongoose is used ONLY for:

* Merch
* Tickets
* Accommodation

---

# ⚙️ **How to Run the Project**

## 1. Install dependencies

```sh
npm install
```

---

## 2. Create a `.env` file in the root

```
PORT=5000
DATABASE_URL="YOUR_MONGODB_URI"
JWT_SECRET="YOUR_RANDOM_SECRET"
```

### ⚠️ REQUIRED:

* Use your own MongoDB Atlas URL for `DATABASE_URL`
* `JWT_SECRET` must be a long random string

---

## 3. Run Prisma Client Generator

```sh
npx prisma generate
```

---

## 4. Start the development server

```sh
npm run dev
```

If everything is correct, you'll see:

```
Mongoose connected
Prisma connected
 Server running on port 5000
```

---

# 🧪 **Testing With Postman (Add your tests here)**

Here are the base endpoints:

---

## ✅ **1. Register User**

**POST**
`http://localhost:5000/auth/register`

### Body (JSON):

```json
{
  "name": "Rohit",
  "email": "rohit@example.com",
  "password": "123456",
  "userType": "AUS_STUDENT",
  "rollNumber": "AUS2024B12",
  "department": "CSE",
  "year": 3
}
```

### If NON_AUS:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "123456",
  "userType": "NON_AUS"
}
```

---

## ✅ **2. Login User**

**POST**
`http://localhost:5000/auth/login`

### Body:

```json
{
  "email": "rohit@example.com",
  "password": "123456"
}
```

### Response:

```json
{
  "token": "<jwt_token>"
}
```

---

## ✅ **3. Get Logged-in User**

**GET**
`http://localhost:5000/auth/me`

### Headers:

```
Authorization: Bearer <token>
```

### Response:

```json
{
  "id": "66af...",
  "name": "Rohit",
  "email": "rohit@example.com",
  "userType": "AUS_STUDENT",
  "rollNumber": "AUS2024B12"
}
```

---

# 🔨 **How to Add a New Module (OOP + Clean Architecture)**

Example for a **Mongoose module** (`merch`):

1. Create folder:

```
src/modules/merch/
```

2. Add:

```
merch.repository.ts  → DB logic (Mongoose)
merch.service.ts     → Business class
merch.controller.ts  → Controller class
merch.routes.ts      → Routes
```

3. Add model in:

```
src/mongoose/merch.model.ts
```

4. Register route in server:

```ts
app.use("/merch", merchRoutes);
```


---

# 🛑 **Rules for Contributors**

* ❌ Do NOT write raw DB logic inside controllers/services
* ❌ Do NOT bypass Zod validation
* ❌ Do NOT use `any` type

### ✔ Every module must follow:

**Repository → Service → Controller → Routes**

---

# 🎉 Ready to Build
