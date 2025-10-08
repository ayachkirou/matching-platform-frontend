import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './Signup.jsx'
import CompanySignup from "./signup/company.jsx";
import StudentSignup from "./signup/student.jsx";
import CompanyConfirmation from './pages/CompanyConfirmation';
import Login from './Login';
import StudentProfile from './student/profile.jsx'
import CompanyProfile from './company/profile.jsx'
import { AuthProvider } from './contexts/AuthContext'; 
import '@fortawesome/fontawesome-free/css/all.min.css';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> 
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/student" element={<StudentSignup />} />
          <Route path="/signup/company" element={<CompanySignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/company/confirmation" element={<CompanyConfirmation />} />
          <Route path='/student/profile' element={<StudentProfile />}/>
          <Route path="/company/profile" element={<CompanyProfile />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
