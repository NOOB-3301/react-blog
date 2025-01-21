import React from 'react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05 }}
      >
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">Create an Account</h2>
        <motion.form
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeInOut' }}
        >
          <motion.div
            className="mb-4"
            whileFocus={{ scale: 1.02, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}
          >
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <motion.input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your full name"
              required
              whileFocus={{ borderColor: 'rgb(168, 85, 247)', scale: 1.01 }}
            />
          </motion.div>
          <motion.div
            className="mb-4"
            whileFocus={{ scale: 1.02, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <motion.input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your email"
              required
              whileFocus={{ borderColor: 'rgb(168, 85, 247)', scale: 1.01 }}
            />
          </motion.div>
          <motion.div
            className="mb-4"
            whileFocus={{ scale: 1.02, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <motion.input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Create a password"
              required
              whileFocus={{ borderColor: 'rgb(168, 85, 247)', scale: 1.01 }}
            />
          </motion.div>
          <motion.div
            className="mb-6"
            whileFocus={{ scale: 1.02, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}
          >
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <motion.input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Re-enter your password"
              required
              whileFocus={{ borderColor: 'rgb(168, 85, 247)', scale: 1.01 }}
            />
          </motion.div>
          <motion.button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-md shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Register
          </motion.button>
        </motion.form>
        <motion.div
          className="mt-6 text-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-purple-500 hover:underline">
              Login
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
