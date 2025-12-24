/**
 *@file LoginModal.jsx
  @purpose Displays a modal login form with email and password fields, including a
 *          link to navigate users to the registration page and options to close the
 *          modal.
  @author Aiden Moxey
  @author Natalia Plaka 
  - added navigation link to the Register page
 */
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {

  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999] left-0 top-0 w-screen h-screen">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-8 rounded-xl shadow-xl w-[90vw] sm:w-[70vw] md:w-[40vw] lg:w-[30vw] max-w-[400px]">
        
        <h2 className="text-2xl mb-4 font-semibold text-center">Sign In</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 mb-3 border rounded dark:bg-gray-800 dark:border-gray-600"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 mb-4 border rounded dark:bg-gray-800 dark:border-gray-600"
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-3 transition-all duration-200">
          Login
        </button>

        <p className="text-sm text-center">
          Don't have an account?{" "}
         <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => {
          onClose();        // close modal  
          navigate("/register"); // go to register page  
   }}>
          Register here
          </span> 
        </p>

        <button
          className="mt-4 w-full border dark:border-gray-500 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  );
}