import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { link } from '../Baselink';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ credential: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${link}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful login
        console.log('Login successful:', data);
        console.log(data.token)
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.userId)
        alert('Login successful!');
        // Redirect to a dashboard or home page
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05 }}
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Welcome Back</h2>
        <motion.form
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeInOut' }}
          onSubmit={handleSubmit}
        >
          <motion.div
            className="mb-4"
            whileFocus={{ scale: 1.02, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}
          >
            <label htmlFor="credential" className="block text-sm font-medium text-gray-700">
              Credential
            </label>
            <motion.input
              type="text"
              id="credential"
              name="credential"
              className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your credential"
              value={credentials.credential}
              onChange={handleChange}
              required
              whileFocus={{ borderColor: 'rgb(59, 130, 246)', scale: 1.01 }}
            />
          </motion.div>
          <motion.div
            className="mb-6"
            whileFocus={{ scale: 1.02, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <motion.input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
              whileFocus={{ borderColor: 'rgb(59, 130, 246)', scale: 1.01 }}
            />
          </motion.div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <motion.button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Login
          </motion.button>
        </motion.form>
        <motion.div
          className="mt-6 text-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
