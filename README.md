# BookSwap

BookSwap is a full-stack web application that allows users to share, borrow, and exchange books within a community. This platform enables book lovers to discover new reads, connect with others, and reduce waste by reusing books.

## LIVE DEMO LINK BOTH FRONTEND AND BACKEND HAS BEEN DEPLOYED IN RENDER 
- **LIVE LINK**: https://bookswap-7nnd.onrender.com/
- **DEMO ACCOUNT**
  - **Book Owner**
    - Email: shahgarv0507@gmail.com
    - Password: garv123
  - **Book Borrower**
    - Email: jeet1234@gmail.com
    - Password: jeet123


## Features And Bonus Features

- **User Authentication**: Secure signup and login functionality
- **Book Management**: Add, edit, browse, and search for books
- **Book Swapping**: Request and manage book trades/loans
- **User Dashboard**: Track your book collection, loans, and borrowing history
- **Trust Score System**: Build reputation through successful transactions and ratings
- **User Profile Management**: Update personal information via account settings
- **User Dashboard**: Track your book collection and borrowing history
- **Responsive Design**: Optimized for both desktop and mobile devices

## User Types and Workflow

BookSwap supports two types of users:

### 1. Book Owners
Users who list books they own and are willing to share:
- Register and create a profile
- Add books to their collection with details (title, author, condition, etc.)
- Review and respond to swap/borrow requests
- Track which books are currently loaned out
- Rate borrowers based on their experience
- Build a trust score through positive interactions

### 2. Book Borrowers
Users who want to borrow books from the community:
- Browse available books by category, author, or proximity
- Request to borrow books for a specific period
- Track their borrowing history and current loans
- Return books and mark transactions as complete
- Rate book owners and the book quality
- Build their reputation with responsible borrowing

### Trust Score System

Our platform features a comprehensive trust score system that helps users build reputation:

- **Trust Score Calculation**: Based on successful transactions, ratings, and community interactions
- **Transparent Components**: Users can see how their score is calculated and ways to improve it
- **Rating System**: After a transaction, users can rate each other's reliability and experience
- **Visual Badges**: Display trust levels through intuitive badges visible on profiles

### Dashboard Features

The enhanced user dashboard includes:

- **Book Management**: Add, edit, and manage your book collection 
- **Transaction History**: Track all your lending and borrowing activities
- **Request Management**: Review, approve, or decline book requests
- **Profile Overview**: View and manage your user profile and trust score
- **Account Settings**: Update personal information including name, email, and contact details

### Typical Workflow:

1. **Registration**: Both types of users register on the platform
2. **Book Listing**: Book owners add their books to the platform
3. **Book Discovery**: Borrowers browse and search for books
4. **Borrow Request**: Borrower sends a request to the book owner
5. **Request Approval**: Owner reviews and approves/rejects the request
6. **Book Exchange**: Users meet in person or arrange shipping for the book
7. **Transaction Completion**: Both parties mark the transaction as complete
8. **Rating Exchange**: Users rate each other to build trust scores

This peer-to-peer model creates a sustainable book-sharing community where both parties benefit from the exchange.

## Tech Stack

### Frontend
- **React** with **Vite** for fast development and optimized builds
- **React Router** for navigation
- **Tailwind CSS** and **Shadcn UI** for modern, responsive UI components
- **React Query** for efficient data fetching and state management
- **React Hook Form** with **Zod** for form validation

### Backend
- **Node.js** with **Express** for REST API
- **MongoDB** with **Mongoose** for database management
- **JWT** for secure authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing


### AI USED
AI TOOLS USED: CURSOR

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local or Atlas cloud instance)
- Git

### Installation

#### Clone the repository
```bash
git clone https://github.com/yourusername/BookSwap.git
cd BookSwap
```

#### Backend Setup
1. Navigate to the backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

4. Start the backend server
```bash
npm run dev
```

The backend will run on http://localhost:5000

#### Frontend Setup
1. Navigate to the frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the frontend directory with the following variable:
```
VITE_API_URL=http://localhost:5000
```

4. Start the frontend development server
```bash
npm run dev
```

The frontend will run on http://localhost:8080

## Usage

1. Register for a new account or login with existing credentials
2. Browse available books on the platform
3. Add your own books to make them available for swapping
4. Request to borrow books from other users
5. Manage your book transactions through the dashboard
6. Rate and review books after reading

## Account Settings

The Account Settings feature allows users to manage their personal information:

1. **Profile Information**: Update your name, email address, and mobile number
2. **Account Type**: View your account type (Book Owner or Book Seeker)
3. **User Avatar**: Visual representation based on your name's initial

To access Account Settings:
1. Login to your account
2. Navigate to the Dashboard
3. Click on the "Account Settings" tab
4. Make your changes and click "Save Changes"

## Folder Structure

```
BookSwap/
├── backend/              # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── server.js         # Express app setup
│   └── index.js          # Server entry point
│
├── frontend/             # React frontend
│   ├── public/           # Static files
│   └── src/              # Source files
│       ├── components/   # UI components
│       ├── context/      # React context
│       ├── hooks/        # Custom hooks
│       ├── lib/          # Utility functions
│       ├── pages/        # Page components
│       └── utils/        # Helper utilities
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile information
- `GET /api/auth/users/:id` - Get a specific user's public profile
- `POST /api/auth/users/:id/rate` - Rate a user after transaction
- `POST /api/auth/users/:id/ratings/check` - Check if user has already been rated for a transaction

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Add a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `GET /api/books/owner/:userId` - Get books by owner
- `PATCH /api/books/:id/status` - Update book availability status

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create a transaction request
- `PUT /api/transactions/:id` - Update transaction status
- `PATCH /api/transactions/:id/status` - Update transaction status (approve/reject/cancel/complete)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- All the open-source libraries and tools used in this project
- Book lovers everywhere who inspired this platform 
