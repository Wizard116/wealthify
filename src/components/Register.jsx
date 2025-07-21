import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";


const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    let errors = {};
    if (!formData.username) {
      errors.username = 'Username is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    if (Object.keys(errors).length === 0) {
      // Submit the form if there are no errors
      // console.log('Form data:', formData);
        try {
          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, formData);
            // handleLogin(response.data);
          // location.href = '/login';
          navigate('/login');
      } catch (error) {
          // Handle login error
          setErrors({'failed' : error.response.data.message});
          console.error("Register failed:", error.response.data.message);
      }
      // You can add your API call or further actions here
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-3xl font-semibold mb-6 text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:border-blue-500`}
            placeholder="user007"
            required
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:border-blue-500`}
            placeholder="eg. example@gmail.com"
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:border-blue-500`}
            placeholder="........."
            required
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="inline-block w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Register
          </button>
          <NavLink to="/login">
            <button
              type="button"
              className="inline-block w-full bg-gray-500 text-white px-4 py-2 rounded-md ml-4 hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            >
              Login
            </button>
          </NavLink>
        </div>
        {errors.failed && (
          <p className="text-red-500 text-xs italic">{errors.failed}</p>
        )}
      </form>
    </div>
  </div>
  );
};

export default Register;
