import { useEffect , FC } from 'react';
import { AuthProvider } from './Contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import Register from './Features/Auth/Register';
import Login from './Features/Auth/Login';
import Navbar from './Features/Navbar/Navbar';
import UploadPage from './Features/User/UserUploadsPage';
import PhotoGallery from './Features/Photo/PhotoGallery';
import BookmarksPage from './Features/User/BookmarksPage';



const App: FC = () => {
  useEffect(() => {
    const handleResize = () => {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    };

    // Call the function on mount
    handleResize();

    // Add the resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PhotoGallery />} />
          <Route path='/bookmarks' element={<BookmarksPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
    </AuthProvider>
  );
};

export default App;