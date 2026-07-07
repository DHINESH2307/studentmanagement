# Student Management System (Full-Stack Supabase + React + Vite)

A modern, fully responsive, production-ready full-stack Student Management System built with **React**, **Vite**, **Vanilla CSS**, and **Supabase**. This project follows clean architecture principles, modular component design, and rich aesthetic guidelines (glassmorphism, vibrant HSL color palettes, dark/light themes, smooth animations, and loading skeletons).

---

## ✨ Features

- **🛡️ Full Supabase Authentication**:
  - Email & Password Sign Up, Login, Logout, and Forgot Password recovery.
  - Session persistence and Protected Dashboard route guards.
- **📊 Interactive Dashboard**:
  - Live statistics overview cards (Total Students, Recently Added, Department Enrollment Breakdown).
  - Dynamic enrollment percentage progress bars.
- **🎓 Comprehensive Student Directory (CRUD)**:
  - Add, Edit, and Delete student records with inline validation (email regex, phone length).
  - **Live Profile Photo Upload**: Direct integration with Supabase Storage bucket (`student-images`) with live image preview.
  - **Advanced Filtering & Sorting**: Sort by Name or Created Date, filter by Academic Department and Year, and search globally across names, emails, and departments.
  - **Bulk Operations**: Multi-select checkboxes for batch deleting records.
  - **CSV Import / Export**: Batch upload student spreadsheets with error reporting or export directory data to CSV.
  - **Pagination**: Adjustable rows per page (10, 25, 50) and page navigation controls.
- **🎨 Rich Design & Aesthetics**:
  - Built with **Vanilla CSS** utilizing custom HSL design variables.
  - Seamless **Dark / Light mode toggle** with local storage preference persistence.
  - Responsive layouts optimized for Desktop, Tablet, and Mobile screens.
  - Micro-animations, hover effects, and skeleton loaders for enhanced UX.
- **⚡ Productivity Enhancements**:
  - Keyboard Shortcuts: Press `Ctrl + K` to jump to search, `Alt + N` to add a new student, and `Esc` to close modals.
  - Toast notification system and confirmation dialogs for destructive actions.

---

## 🛠️ Technology Stack

- **Frontend**: Vite + React (JavaScript ES6+), Vanilla CSS (HSL Tokens, Grid, Flexbox).
- **Backend & Database**: Supabase (PostgreSQL, Authentication, Row-Level Security, Storage).
- **Icons**: Lucide React.
- **CSV Processing**: PapaParse.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher) and `npm`.
- A free [Supabase](https://supabase.com/) project.

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory (you can copy from `.env.example`):
```bash
cp .env.example .env
```

Add your Supabase credentials to `.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```
*(Note: The project automatically maps both `SUPABASE_URL` and `VITE_SUPABASE_URL` in `vite.config.js` so it works immediately out of the box without requiring code changes).*

### 4. Supabase Database & Storage Setup
1. Open your Supabase Dashboard and navigate to the **SQL Editor**.
2. Copy the entire contents of `supabase/schema.sql` and run the script. This will automatically:
   - Create the `students` table.
   - Configure **Row-Level Security (RLS)** policies ensuring multi-tenant security (`auth.uid() = user_id`).
   - Create the `student-images` public storage bucket for profile image uploads.
   - Insert sample mock student records.

### 5. Running the Application Locally
Start the development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 📁 Clean Architecture & Project Structure

```text
student_management/
├── supabase/
│   └── schema.sql              # Database schema, RLS policies, storage bucket & mock data
├── src/
│   ├── services/
│   │   ├── supabase.js         # Supabase client initialization (dual env support)
│   │   ├── authService.js      # Authentication methods (signIn, signUp, signOut, reset)
│   │   ├── studentService.js   # CRUD operations & CSV import logic
│   │   └── storageService.js   # Storage bucket image upload & deletion
│   ├── components/
│   │   ├── auth/               # Login, SignUp, ForgotPassword, ProtectedRoute
│   │   ├── layout/             # Header, Sidebar, Footer
│   │   ├── common/             # Toast, ConfirmModal, EmptyState, ErrorPage
│   │   ├── dashboard/          # Dashboard stats & department charts
│   │   ├── students/           # StudentToolbar, StudentTable, StudentModal, Pagination, CsvModal
│   │   ├── profile/            # User profile management
│   │   └── settings/           # System settings & keyboard shortcuts
│   ├── App.jsx                 # Main application state, routing & keyboard listeners
│   ├── main.jsx                # React DOM entry point
│   └── index.css               # Design system tokens, themes, glassmorphism & responsive rules
├── index.html                  # HTML template with font preloads
├── package.json                # Project metadata and dependencies
└── vite.config.js              # Vite configuration & environment mapping
```

---

## 🧪 Building for Production

To build the application for production deployment (Netlify, Vercel, Cloudflare Pages, etc.):
```bash
npm run build
```
This generates an optimized static bundle in the `dist/` directory.

---

## 📄 License
This project is open-source and available under the MIT License.
