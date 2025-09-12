# UDM Portal Testing Instructions

## ✅ **Issue Fixed: "Failed to fetch" Error**

The error was caused by the frontend trying to connect to port 5000, but the backend was running on port 3001.

### **What was fixed:**
1. **API URL**: Updated frontend to use `http://localhost:3001/api`
2. **Database**: Initialized MongoDB with proper schemas
3. **Entry Model**: Made `product_id` optional for standalone entries
4. **Error Handling**: Added better error messages and authentication handling

## 🚀 **How to Test:**

### **1. Start the Backend:**
```bash
cd backend
npm run dev
```
The backend should be running on `http://localhost:3001`

### **2. Start the Frontend:**
```bash
cd frontend
npm run dev
```
The frontend should be running on `http://localhost:5173`

### **3. Test the Application:**

#### **Step 1: Register/Login**
1. Go to `http://localhost:5173`
2. Register a new account or login with existing credentials
3. You should be redirected to the dashboard

#### **Step 2: Test Add Entries**
1. Click on "Add Entries" card on the dashboard
2. Fill out the form with sample data:
   - Lot Number: `UDM-2025-TEST-001`
   - Item Type: `Test Product`
   - Vendor Name: `Test Vendor`
   - Vendor ID: `V99999`
   - Date of Supply: `2025-01-15`
   - Warranty Period: `12`
   - Quantity Supplied: `100`
   - Inspection Date: `2025-01-10`
   - Inspected By: `RDSO`
3. Click "Add Entry"
4. You should see a success message and be redirected back

#### **Step 3: Verify Data in Database**
The entry should now be saved in MongoDB and visible in the dashboard.

## 🔧 **API Endpoints Working:**

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get products (requires auth)
- `POST /api/products` - Create product (requires auth)
- `GET /api/entries` - Get entries (requires auth)
- `POST /api/entries` - Create entry (requires auth)

## 🐛 **Troubleshooting:**

### **If you still get "Failed to fetch":**
1. Check if backend is running: `curl http://localhost:3001/api/health`
2. Check if frontend is using correct port in `api.js`
3. Check browser console for CORS errors

### **If you get authentication errors:**
1. Make sure you're logged in
2. Check if token exists in localStorage
3. Try logging out and logging back in

### **If database errors occur:**
1. Run database initialization: `cd backend && npm run init-db`
2. Check MongoDB connection in `.env` file
3. Verify MongoDB is running

## 📊 **Database Collections:**
- `users` - User accounts
- `products` - Railway products
- `entries` - Product entries

The application is now fully functional with proper database integration!
