# IREPS - Indian Railways E-Procurement System

A full-stack web application for the Indian Railways E-Procurement System with JWT authentication and MongoDB database.

## Features

- **Government Portal Design**: Authentic IREPS styling with GeM integration
- **JWT Authentication**: Secure login/logout with token-based authentication
- **MongoDB Database**: User management with secure password hashing
- **User Registration**: New user account creation with validation
- **Protected Routes**: Secure access to dashboard and user areas
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 19.1.1
- React Router DOM
- CSS3 with modern styling
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd UDM
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ireps_db
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Start Backend Server
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:5000

### 6. Frontend Setup
```bash
cd frontend
npm install
```

### 7. Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### User Model
```javascript
{
  username: String (unique, required)
  email: String (unique, required)
  password: String (hashed, required)
  role: String (enum: 'user', 'admin', 'supervisor')
  department: String
  isActive: Boolean
  lastLogin: Date
  loginAttempts: Number
  lockUntil: Date
  createdAt: Date
  updatedAt: Date
}
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Account Lockout**: 5 failed attempts locks account for 2 hours
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for frontend origin
- **Error Handling**: Comprehensive error handling and logging

## Usage

### 1. Registration
- Navigate to http://localhost:5173/register
- Fill in username, email, password, and department
- Click "Register" to create account

### 2. Login
- Navigate to http://localhost:5173/
- Enter username/email and password
- Click "Login" to authenticate

### 3. Dashboard
- After successful login, you'll be redirected to the dashboard
- View user information and system features
- Use "Logout" to end session

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite development server
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `NODE_ENV`: Environment (development/production)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify database permissions

2. **CORS Errors**
   - Check frontend URL in backend CORS configuration
   - Ensure both servers are running

3. **JWT Token Errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear localStorage if needed

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes using the port

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team.


8jKH06Ix29NKh6G0
2003rohansinha_db_user
