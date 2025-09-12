# UDM Portal Backend

Railway UDM Portal backend API built with Node.js, Express, and MongoDB.

## Features

- **Product Management**: CRUD operations for railway products
- **Entry Management**: Track multiple entries for each product
- **Authentication**: JWT-based user authentication
- **Data Validation**: Comprehensive input validation
- **Search & Filtering**: Advanced search and filtering capabilities
- **Statistics**: Product and entry analytics

## Database Schema

### Product Model
- `lot_number`: Unique product identifier
- `item_type`: Type of railway component
- `vendor_name`: Supplier name
- `vendor_id`: Supplier identifier
- `date_of_supply`: Supply date
- `warranty_period_months`: Warranty duration
- `quantity_supplied`: Quantity delivered
- `inspection_date`: Last inspection date
- `inspected_by`: Inspection authority
- `status`: Product status (Accepted/Rejected/Pending)
- `image`: Product image URL
- `created_by`: User who created the product

### Entry Model
- `product_id`: Reference to parent product
- `lot_number`: Entry lot number
- `item_type`: Component type
- `vendor_name`: Supplier name
- `vendor_id`: Supplier identifier
- `date_of_supply`: Supply date
- `warranty_period_months`: Warranty duration
- `quantity_supplied`: Quantity delivered
- `inspection_date`: Inspection date
- `inspected_by`: Inspection authority
- `status`: Entry status
- `image`: Entry image URL
- `entry_type`: Type of entry (New_Supply/Replacement/Maintenance/Inspection)
- `notes`: Additional notes
- `created_by`: User who created the entry

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with pagination, search, filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/stats/overview` - Get product statistics

### Entries
- `GET /api/entries` - Get all entries (with pagination, search, filters)
- `GET /api/entries/product/:productId` - Get entries for specific product
- `GET /api/entries/:id` - Get single entry
- `POST /api/entries` - Create new entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry
- `GET /api/entries/stats/overview` - Get entry statistics

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/udm-portal
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in your `.env` file
3. The application will automatically create the database and collections

## API Usage Examples

### Create a Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "lot_number": "UDM-2025-CLIP-001",
    "item_type": "Elastic Rail Clip",
    "vendor_name": "ABC Steel Pvt Ltd",
    "vendor_id": "V12345",
    "date_of_supply": "2025-01-15",
    "warranty_period_months": 24,
    "quantity_supplied": 50000,
    "inspection_date": "2025-01-10",
    "inspected_by": "RDSO",
    "status": "Accepted"
  }'
```

### Create an Entry
```bash
curl -X POST http://localhost:5000/api/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "product_id": "PRODUCT_ID_HERE",
    "lot_number": "UDM-2025-CLIP-002",
    "item_type": "Elastic Rail Clip",
    "vendor_name": "ABC Steel Pvt Ltd",
    "vendor_id": "V12345",
    "date_of_supply": "2025-01-20",
    "warranty_period_months": 24,
    "quantity_supplied": 25000,
    "inspection_date": "2025-01-18",
    "inspected_by": "RDSO",
    "status": "Accepted",
    "entry_type": "New_Supply"
  }'
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- JWT-based authentication
- User-specific data isolation
- Input validation and sanitization
- CORS configuration
- Error message sanitization
