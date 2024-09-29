import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Features/Auth/Register';
import Login from './Features/Auth/Login';
import PhotoUpload from './Features/Photo/PhotoUpload';
import PhotoGallery from './Features/Photo/PhotoGallery';

const App: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/upload">Upload Photo</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<PhotoUpload />} />
          <Route path="/" element={<PhotoGallery />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;