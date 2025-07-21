import { useState } from "react";
import axios from "axios";
import AuthUser from "./AuthUser";
import { NavLink, useNavigate } from "react-router-dom";

export default function Login({ handleLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { http, setToken } = AuthUser();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    

    const handleSubmit = async (e) => {
      e.preventDefault();
      let errors = {};
      if (!email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Email is invalid';
      }
      if (!password) {
        errors.password = 'Password is required';
      } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }
      if (Object.keys(errors).length === 0) {

      try {
              // Make a POST request to your backend login endpoint with user input data
              const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
                  email,
                  password
              });
              
              // Extract the JWT token from the response
              const token = response.data.token;
              
              const userDetails = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/verify`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })

              const user = userDetails.data.userData;
              // Store the token in local storage or cookie
              localStorage.setItem("token", token);
              localStorage.setItem("username", user.username)
  
              // Call handleLogin with the response data if login is successful
              handleLogin(response.data);
              // location.href = '/dashboard';
              window.location.reload()
              // navigate('/dashboard')
            }
          catch (error) {
            // Handle login error
          setErrors({'failed' : error.response.data.message});
          console.error("Login failed:", error);
      }
    }
    else {
      setErrors(errors);
    }
  };
  

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
              <h1 className="text-3xl font-semibold mb-6 text-center">Login</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:border-blue-500`}
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:border-blue-500`}
                    placeholder="Enter your password"
                    required
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="inline-block w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                  >
                    Login
                  </button>
                  <NavLink to="/register">
                    <button
                      type="button"
                      className="inline-block w-full bg-gray-500 text-white px-4 py-2 rounded-md ml-4 hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                    >
                      Register
                    </button>
                  </NavLink>
                </div>
                {errors.failed && (
                  <p className="text-red-500 text-xs italic">{errors.failed}</p>
                )}
              </form>
            </div>
          </div>
        </>
    );
}
