import React from 'react';
import { AuthProvider } from './Contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import Register from './Features/Auth/Register';
import Login from './Features/Auth/Login';
import Navbar from './Features/Navbar/Navbar';
import PhotoUpload from './Features/Photo/PhotoUpload';
import PhotoGallery from './Features/Photo/PhotoGallery';
import BookmarksPage from './Features/User/BookmarksPage';


const App: React.FC = () => {
 
  return (
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PhotoGallery />} />
          <Route path='/bookmarks' element={<BookmarksPage />} />
          <Route path="/upload" element={<PhotoUpload />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
    </AuthProvider>
  );
};

export default App;