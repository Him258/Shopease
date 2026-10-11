# ShopEase 🛍️ - Full-Stack E-Commerce with Mobile OTP Auth & Multi-Gateway Payments

ShopEase is a full-stack e-commerce web application featuring a Node.js/Express/MongoDB backend and a modern Vite + React frontend styled with custom CSS, supporting mobile OTP authentication and Razorpay / Cashfree payment integrations.

---

## 🌟 Features

- **Product Catalog:** Real-time search, category filtering, responsive grid, dynamic stock badges, and detailed product showcase.
- **Mobile OTP Authentication:** Passwordless auth using 10-digit Indian mobile numbers. OTP hashed with bcrypt, 5-minute TTL expiry, 5-attempt rate limits, and 30s resend cooldown.
- **Cart Isolation & Security:** Authenticated user-scoped MongoDB cart management with frontend-backend synchronization.
- **Payment Gateways:** Integrated Razorpay and Cashfree checkout options with HMAC signature verification and atomic inventory reduction.
- **Admin Dashboard:** Overview statistics, order fulfillment management, product creation/editing, and customer directory for the single site admin.
- **Order Tracking:** Real-time customer order history with payment status badges (`paid`, `pending`, `failed`) and fulfillment states (`Processing`, `Shipped`, `Delivered`).

---

## ⚙️ Environment Variables

### 1. Backend (`/server/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/shopease
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# OTP Configuration
# OTP_MODE=dev  -> OTPs printed to server console (for local development/testing)
# OTP_MODE=sms  -> OTPs sent via Fast2SMS API
OTP_MODE=dev
SMS_API_KEY=your_sms_api_key_here

# Single Admin Configuration (Specify your admin mobile number here)
ADMIN_MOBILE=9876543210
ADMIN_NAME=Admin

# Payment Gateway Keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 2. Frontend (`/client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started & Running Locally

### Step 1: Install Dependencies

```powershell
# In /server folder
cd server
npm install

# In /client folder
cd ../client
npm install
```

### Step 2: Seed Database & Initialize Admin

```powershell
cd server
node seed.js
```

> **Note:** The configured `ADMIN_MOBILE` will automatically be set as the system admin upon server startup or database seeding.

### Step 3: Start the Backend Server

```powershell
cd server
npm run dev
```
> Server runs on: `http://localhost:5000`

### Step 4: Start the Frontend Client

In a second terminal window:

```powershell
cd client
npm run dev
```
> Frontend runs on: `http://localhost:5173`

---

## 💳 Payment Gateway Testing Guide

When testing payments in Sandbox / Test mode:

| Method | Test Value | Outcome |
| :--- | :--- | :--- |
| **UPI** | `success@razorpay` | Simulates a **Successful** payment |
| **UPI** | `failure@razorpay` | Simulates a **Failed** payment |
| **Cards** | Any valid test card (e.g. `4012000000000002`, Exp: `11/28`, CVV: `123`) | Enters OTP screen (enter test OTP) |
| **NetBanking** | Select any bank | Select "Success" or "Failure" in simulator |

---

## 🧪 Testing Mobile OTP Auth Flow

1. Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g., `9876543210`).
2. Click **Send OTP**.
3. In `OTP_MODE=dev`, view the generated 6-digit OTP in the backend terminal logs.
4. Enter the 6-digit OTP on the verification screen to authenticate.
