# IECLATE INOVATE Backend API Portal

This is the production-ready MVC backend for IECLATE INOVATE B2B services, managing registrations, email OTP dispatches, admin multi-factor SMS codes, consultation scheduling, and client contact form submissions.

---

## Technical Stack
- **Node.js & Express.js**
- **MongoDB Atlas**
- **Mongoose ORM**
- **JWT** (JSON Web Tokens)
- **bcryptjs**
- **Nodemailer** (HTML emails)
- **Twilio SMS** (Mobile OTPs)
- **Helmet, Morgan, CORS, express-rate-limit**

---

## Project Structure
```
backend/
├── config/
│   └── db.js            # MongoDB database connection configuration
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── contactController.js
│   └── meetingController.js
├── middleware/
│   ├── auth.js          # JWT Route protection rules
│   ├── errorHandler.js  # Global Express error captures
│   └── rateLimiter.js   # IP Request rate limiting thresholds
├── models/
│   ├── Admin.js
│   ├── Contact.js
│   ├── Meeting.js
│   ├── OTP.js
│   └── User.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── contactRoutes.js
│   └── meetingRoutes.js
├── services/
│   ├── emailService.js  # SMTP email templates dispatches
│   └── smsService.js    # Twilio SMS verification dispatches
├── .env                 # Secret environment keys
├── package.json
└── server.js            # Main boot entrypoint
```

---

## Installation & Setup

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Verify Environment Configuration**:
   Ensure `.env` contains correct MongoDB connection strings, Twilio, and SMTP SMTP credentials.

4. **Start local development server**:
   ```bash
   npm run dev
   ```

---

## Default Seeding Credentials
On initial connection, the system automatically checks and seeds a default administrator account into MongoDB if empty:
* **Admin Email**: `admin@ieclateinovate.com`
* **Admin Password**: `password123`
* **Registered Mobile**: `+18777804236` (matching the Twilio sandbox number)

---

## Key API Routes

### User Auth Paths
* `POST /api/auth/register` - Create temporary user profile & send email verification OTP code.
* `POST /api/auth/verify-email` - Check OTP code and activate user account.
* `POST /api/auth/login` - Validate credentials, register login time and return JWT token.
* `POST /api/auth/forgot-password` - Email OTP verification reset link.
* `POST /api/auth/reset-password` - Verify code and save new password.

### Admin Auth Paths
* `POST /api/admin/login` - Verify admin credentials, registered phone, and send SMS OTP.
* `POST /api/admin/verify-mobile-otp` - Verify SMS verification code and return JWT token.
* `GET /api/admin/dashboard` - Retrieve overall statistics metrics (bookings, approvals, rejections counts).

### Meeting Slots Paths
* `POST /api/meetings/create` - Submit a new consultation booking.
* `GET /api/meetings/user` - Fetch logged in client's meeting history.
* `GET /api/meetings/admin` - Fetch all bookings with search/filter support.
* `PUT /api/meetings/approve` - Admin confirms slot, attaches conferencing link and emails user.
* `PUT /api/meetings/reject` - Admin updates status to Rejected, records reasons, and notifies client.
* `PUT /api/meetings/reschedule` - Admin alters slot coordinates, updates link, and emails notification.
* `DELETE /api/meetings/delete` - Admin deletes meeting record by ID.

### Contact Paths
* `POST /api/contact` - Submit a public inquiry form (saves to database and dispatches admin warning email).
* `GET /api/contact/admin` - Retrieve logged brand inquiry details.
