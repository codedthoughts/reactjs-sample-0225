import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { email, password } = formData;
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A428A] text-white relative">
      <div className="w-full max-w-md px-8 py-10">
        <h2 className="text-3xl font-bold text-center mb-10">Log in!</h2>
        
        {error && (
          <div className="bg-red-600 text-white px-4 py-3 rounded text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-transparent border border-white text-white placeholder-white outline-none"
              placeholder="Email Address"
              required
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-transparent border border-white text-white placeholder-white outline-none"
              placeholder="Enter Password"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="hover:underline">
              Forgot Password?
            </a>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-white text-[#1A428A] font-bold px-6 py-2 mt-4 w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
            
            <div className="mt-4 text-sm">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-white hover:underline font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signup');
                }}
              >
                Sign up
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
