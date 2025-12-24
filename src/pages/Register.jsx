/**
 * @file Register.jsx
 * @purpose This component provides the user registration form, including validation
 *          for email, password strength, password confirmation, and required birthday
 *          input. It displays error messages for invalid fields and prevents form
 *          submission until all requirements are met.
 * @author Natalia Plaka
 */

import React, { useState } from "react";

/**
 * @function Register
 * @purpose Renders the registration form UI and handles client-side validation for
 *          email, password requirements, and birthday input before allowing form
 *          submission.
 * @returns JSX for the registration page.
 */
export default function Register() {
  
  const [form, setForm] = useState({
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    birthday: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    // Email validation
    if (!form.email.includes("@")) {
      newErrors.email = "Enter a valid email address.";
    }
    if (form.email !== form.confirmEmail) {
      newErrors.confirmEmail = "Emails do not match.";
    }

    // Password validation
    const passwordReqs = [
      { test: /.{8,}/, message: "At least 8 characters long" },
      { test: /[A-Z]/, message: "Contains an uppercase letter" },
      { test: /[a-z]/, message: "Contains a lowercase letter" },
      { test: /[0-9]/, message: "Contains a number" },
      { test: /[^A-Za-z0-9]/, message: "Contains a symbol" },
    ];

    passwordReqs.forEach(req => {
      if (!req.test.test(form.password)) {
        newErrors.password = "Password does not meet requirements.";
      }
    });

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Birthday validation 
    if (!form.birthday) {
      newErrors.birthday = "Enter your birthday.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      alert("Registration successful!");
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-[#edf7f1] dark:bg-gray-900 px-6 py-10">
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-xl shadow-xl w-[90vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] max-w-[450px]">

        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* CONFIRM EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Confirm Email"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
              value={form.confirmEmail}
              onChange={(e) => setForm({ ...form, confirmEmail: e.target.value })}
            />
            {errors.confirmEmail && <p className="text-red-500 text-sm">{errors.confirmEmail}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <ul className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-2">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
              <li>• One special symbol</li>
            </ul>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* BIRTHDAY */}
          <div className="mt-5">
          <label classname="block text-sm mb-1 text-gray-600 dark:text-gray-300">
            Birthday (Required)
            </label>
          
            <input
              type="date"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
              value={form.birthday}
              onChange={(e) => setForm({ ...form, birthday: e.target.value })}
            />
            {errors.birthday && (
              <p className="text-red-500 text-sm">{errors.birthday}</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-all duration-200 mt-4"
          >
            Create Account
          </button>

        </form>
      </div>
    </div>
  );
}
