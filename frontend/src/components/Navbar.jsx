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
