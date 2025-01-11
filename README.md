# Zinkit Backend Using Express Server

## Run Locally
Welcome to the Zinkit Backend repository! This is the server-side code for the Zinkit application. It provides APIs, database interaction, and essential backend logic.

### Features

- User authentication (login, registerUser, verifyEmailController, uploadAvatar, updateUserProfile, forgetPassword, verifyForgetPasswordOtp)
- Password encryption using `bcrypt`
- Token-based authentication using JWT
- CRUD operations
- Database integration with MongoDB

## Prerequisites
- Ensure you have the following installed:
  1. [Node.js](https://nodejs.org/)
  2. [MongoDB](https://www.mongodb.com/)
  3. [Git](https://git-scm.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Farooq722/zinkit_backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd zinkit_backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure the environment variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   SECRET_KEY_REFRESH=your_refresh_secret
   RESEND_API=your_resend_api
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET_KEY=your_cloudinary_api_secret_key
   ```

5. Note: Use [Resend](https://resend.com) for sending emails to your users and [Cloudinary](https://cloudinary.com) for uploading images.

6. Start the server:
   ```bash
   npm run dev
   ```

7. The server will run on `http://localhost:3000` by default.

## API Endpoints

### Authentication

**POST /api/auth/register**
- Registers a new user.
- Request body:
  ```json
  {
    "fullname": "string",
    "email": "string",
    "password": "string"
  }
  ```

**POST /api/auth/login**
- Logs in an existing user.
- Request body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

**PUT /api/auth/forget-password**
- Initiates a password reset process.
- Request body:
  ```json
  {
    "email": "string"
  }
  ```

**PUT /api/auth/update**
- Updates user details based on requirements.

**PUT /api/auth/reset-password**
- Resets the user password.
- Request body:
  ```json
  {
    "email": "string",
    "newPassword": "string",
    "confirmPassword": "string"
  }
  ```

**PUT /api/auth/verify-forget-password**
- Verifies the OTP sent during the password reset process.
- Request body:
  ```json
  {
    "email": "string",
    "otp": "number"
  }
  ```

### Other Endpoints

**POST /api/auth/refresh**
- Refreshes the authentication token.

**POST /api/auth/verify-email**
- Verifies the user email address.

**GET /api/auth/logout**
- Logs the user out.

**PUT /api/auth/upload-avatar**
- Uploads or updates the user avatar.

---

## Thank You

