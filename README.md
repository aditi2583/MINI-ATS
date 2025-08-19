# Mini ATS - Applicant Tracking System

A modern, full-featured Applicant Tracking System with Kanban board visualization and analytics dashboard. Built with Next.js, Express, PostgreSQL, and TypeScript.

## Features

### Core Features
- **Kanban Board**: Visual pipeline with drag-and-drop functionality
  - Track applications across stages: Applied → Interview → Offer → Rejected
  - Real-time status updates
  - Card-based view with candidate details

- **Analytics Dashboard**: Comprehensive insights with interactive charts
  - Pipeline status distribution (Pie chart)
  - Applications by role (Bar chart)
  - Monthly application trends (Line chart)
  - Key metrics: Total applications, average experience, conversion rate

- **Application Management**
  - Add/Edit/Delete candidates
  - Upload and preview resumes (PDF support)
  - Advanced filtering and search
  - Detailed candidate profiles

### Additional Features
- **Authentication System**: Secure login/register with JWT
- **Dark/Light Mode**: Toggle between themes
- **Resume Management**: Upload, store, and preview PDF resumes
- **Export Analytics**: Download dashboard as PDF
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **Forms**: React Hook Form
- **PDF Viewer**: React-PDF
- **Export**: html2canvas + jsPDF

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer

## Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- name (String, Not Null)
- email (String, Unique, Not Null)
- password (String, Hashed, Not Null)
- role (Enum: 'recruiter', 'admin')
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

### Applications Table
```sql
- id (UUID, Primary Key)
- candidateName (String, Not Null)
- email (String, Not Null)
- phone (String)
- role (String, Not Null)
- yearsOfExperience (Integer)
- resumeLink (Text)
- resumeFileName (String)
- status (Enum: 'applied', 'interview', 'offer', 'rejected')
- notes (Text)
- appliedDate (Date)
- interviewDate (Date)
- skills (Array of Strings)
- salary (Decimal)
- location (String)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mini-ats
```

### 2. Install Dependencies
```bash
npm install-all
# or manually:
cd backend && npm install
cd ../frontend && npm install
```

### 3. PostgreSQL Setup

Create a new PostgreSQL database:
```sql
CREATE DATABASE mini_ats_db;
```

### 4. Environment Configuration

Update the backend `.env` file:
```env
# backend/.env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_ats_db
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
```

### 5. Start the Application

Development mode:
```bash
# From root directory
npm run dev

# Or separately:
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 6. Initial Setup

1. Navigate to http://localhost:3000
2. Click "Create a new account" to register
3. Login with your credentials
4. Start adding candidates!

## Usage Guide

### Adding a Candidate
1. Click "Add Candidate" button
2. Fill in candidate details
3. Optionally upload resume (PDF format)
4. Submit the form

### Managing Applications
- **Drag & Drop**: Move cards between columns to update status
- **Edit**: Click edit icon on any card
- **Delete**: Click delete icon with confirmation
- **View Resume**: Click "Resume" link to preview PDF

### Using Filters
- Search by name, email, or role
- Filter by status (Applied/Interview/Offer/Rejected)
- Filter by role

### Analytics Dashboard
- Navigate to Analytics tab
- View real-time metrics and charts
- Export dashboard as PDF

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Applications
- `GET /api/applications` - Get all applications (with filters)
- `GET /api/applications/:id` - Get single application
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `PATCH /api/applications/:id/status` - Update status only
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/analytics` - Get analytics data

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
vercel
```

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Database (Neon/Supabase)
1. Create PostgreSQL instance
2. Update connection string in backend `.env`
3. Run migrations

## Demo Credentials

For testing purposes:
- Email: demo@example.com
- Password: password123

## Libraries & Dependencies

### Frontend Dependencies
- next: 14.2.5 - React framework
- react: 18.3.1 - UI library
- @dnd-kit/core: 6.1.0 - Drag and drop
- recharts: 2.12.7 - Charts library
- zustand: 4.5.2 - State management
- react-pdf: 7.7.1 - PDF viewer
- tailwindcss: 3.4.1 - CSS framework

### Backend Dependencies
- express: 4.19.2 - Web framework
- sequelize: 6.35.2 - ORM
- pg: 8.11.3 - PostgreSQL client
- jsonwebtoken: 9.0.2 - JWT authentication
- bcryptjs: 2.4.3 - Password hashing
- multer: 1.4.5 - File uploads

## Project Architecture

```
mini-ats/
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and API
│   ├── store/            # Zustand store
│   └── public/           # Static assets
├── backend/               # Express backend
│   ├── config/           # Database config
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── uploads/          # File uploads
└── README.md             # Documentation
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the GitHub repository.