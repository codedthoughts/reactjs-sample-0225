import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    // Generate a random profile picture from Picsum
    const randomId = Math.floor(Math.random() * 1000);
    setProfilePic(`https://picsum.photos/id/${randomId}/200`);
  }, []);

  return (
    <nav className="bg-blue-900 text-white py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* TasksBoard Logo */}
          <div className="w-10 h-10 mr-3">
            <svg viewBox="0 0 100 100" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M50 10C27.91 10 10 27.91 10 50C10 72.09 27.91 90 50 90C72.09 90 90 72.09 90 50C90 27.91 72.09 10 50 10ZM50 20C66.57 20 80 33.43 80 50C80 66.57 66.57 80 50 80C33.43 80 20 66.57 20 50C20 33.43 33.43 20 50 20Z" />
              <path d="M35 35H65V40H35V35Z" />
              <path d="M35 45H65V50H35V45Z" />
              <path d="M35 55H65V60H35V55Z" />
              <path d="M35 65H65V70H35V65Z" />
            </svg>
          </div>
          <Link to="/" className="text-2xl font-bold">TasksBoard</Link>
        </div>
        
        {user ? (
          <div className="flex items-center">
            <img 
              src={profilePic} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
              onError={() => setProfilePic('https://picsum.photos/200')} // Fallback if image fails to load
            />
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-blue-300">Login</Link>
            <Link to="/signup" className="hover:text-blue-300">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
