# E-Commerce Backend

A Node.js e-commerce backend application with user authentication, product management, order processing, shopping cart functionality.

## Features

- **Authentication System**
  - JWT-based authentication
  - Email verification with OTP
  - Admin and user role management
  - Password reset functionality
  - Secure session management

- **Product Management**
  - CRUD operations for products
  - Multiple image upload (up to 4 images per product)
  - Product categorization
  - Inventory tracking

- **Shopping Cart**
  - Add/remove items from cart
  - Update product quantities
  - Persistent cart storage

- **Order Processing**
  - Cash on Delivery (COD) orders only
  - Order status tracking
  - Order history management

- **Additional Features**
  - Email notifications
  - File upload with Cloudinary
  - Automated cleanup tasks
  - Error handling middleware

## Unavailable Features

- *Payment Integration*
- *Multi-Vendor Support*


## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer
- **File Upload**: Multer
- **Security**: bcryptjs for password hashing


## Installation

1. Clone the repository
```bash
git clone https://github.com/Rijan-dhakal/ecommerce-backend.git
cd ecommerce-backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.sample .env
```

4. Update environment variables in `.env` file

5. Start the server
```bash
npm run dev
```

## API Endpoints    

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/otp` - Verify OTP
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password

### Products
- `GET /api/product/list` - Get all products
- `GET /api/product/list/:userId` - Get products by user
- `GET /api/product/single/:id` - Get single product
- `POST /api/product/add` - Add new product
- `PATCH /api/product/update/:id` - Update product
- `DELETE /api/product/remove/:id` - Remove product

### Cart
- `POST /api/cart/get` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update cart item
- `POST /api/cart/remove` - Remove all items from cart

### Orders
- `POST /api/order/place` - Place COD order
- `POST /api/order/list` - Get all orders (admin)
- `POST /api/order/userorders` - Get all user orders
- `POST /api/order/status` - Update order status

## Environment Variables

Create a `.env` file based on `.env.sample` and configure the variables


## Usage

- Register a new user account or login with existing credentials
- Admin users can add, update, and remove products
- Users can browse products, add items to cart, and place orders
- Currently supports only Cash on Delivery (COD) payment method
- Email notifications are sent for registration and order confirmations


