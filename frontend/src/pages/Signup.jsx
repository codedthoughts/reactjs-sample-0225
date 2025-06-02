import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
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
    
    if (!acceptTerms) {
      setError('You must accept the terms and conditions');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const { name, email, password } = formData;
      const result = await signup(name, email, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="w-full max-w-md p-8 rounded-lg">
        <h1 className="text-4xl font-bold text-center text-white mb-10">Sign up</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-white bg-transparent text-white rounded focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-white bg-transparent text-white rounded focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Email Address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-white bg-transparent text-white rounded focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Password"
              required
              minLength="6"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
              className="h-4 w-4 text-blue-600 focus:ring-white border-white rounded bg-transparent"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-white">
              I accept the terms & conditions
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-white text-blue-900 font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-100 transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
