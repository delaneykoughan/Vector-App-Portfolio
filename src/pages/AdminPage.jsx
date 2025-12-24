/**
 * @file AdminPage.jsx
 * @purpose Admin interface for approving or receting user-submitted images.
 * @author Natalia Plaka
 */
 
import React, { useEffect, useState } from "react";

/**
 * @function AdminPage
 * @purpose Displays the admin interface and handles authentication, image approval,
 *          rejection, and deletion.
 */
export default function AdminPage() {
  // Ask for password 
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const adminPassword = "woodland2025";

  const handleLogin = () => {
    if (passwordInput === adminPassword) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password! Please try again.")
    }
  };

  const [pendingImages, setPendingImages] = useState([]);
  const [approvedImages, setApprovedImages] = useState([]);
  
  // Load stored data
  useEffect(() => {
    setPendingImages(JSON.parse(localStorage.getItem("pendingImages")) || []);
    setApprovedImages(JSON.parse(localStorage.getItem("approvedImages")) || []);
  }, []);

  // Approve: Move from pending to approved
  const approveImage = (img) => {
    const newPending = pendingImages.filter((p) => p.id !== img.id);
    const newApproved = [...approvedImages, img];

    setPendingImages(newPending);
    setApprovedImages(newApproved);

    localStorage.setItem("pendingImages", JSON.stringify(newPending));
    localStorage.setItem("approvedImages", JSON.stringify(newApproved));
  };

  // Reject: Remove from pending list
  const rejectImage = (img) => {
    const newPending = pendingImages.filter((p) => p.id !== img.id);

    setPendingImages(newPending);
    localStorage.setItem("pendingImages", JSON.stringify(newPending));
  };

  // Delete an approved image
const deleteApprovedImage = (img) => {
  const newApproved = approvedImages.filter((p) => p.id !== img.id);
  setApprovedImages(newApproved);
  localStorage.setItem("approvedImages", JSON.stringify(newApproved));
};

 // Confirm before deleting an approved image
  const confirmDeleteApprovedImage = (img) => {
    const confirmed = window.confirm("Are you sure you want to delete this approved image?");
    if (confirmed) {
      deleteApprovedImage(img);
    }
  };
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <input
          type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full border border-gray-400 rounded px-3 py-2 mb-4"
          />
          <button
          onClick={handleLogin}
            className="w-full bg-green-200 hover:bg-green-300 text-black py-2 rounded border border-green-600"
          >Login
          </button>
          </div>
         </div>
    );
  }


  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold text-center mb-6">Admin Panel</h1>

      {/* Pending Images */}
      <h2 className="text-2xl font-bold mb-4">Pending Images</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {pendingImages.length === 0 ? (
          <p>No pending images.</p>
        ) : (
          pendingImages.map((img) => (
            <div key={img.id} className="p-4 bg-white shadow rounded">
              <img
                src={img.src}
                alt="pending"
                className="w-full h-40 object-cover rounded mb-2"
              />
              <p className="text-center text-gray-700">{img.caption}</p>

              <div className="flex justify-between mt-2">
                <button
                  onClick={() => approveImage(img)}
                  className="bg-green-200 text-black px-4 py-1 rounded border border-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectImage(img)}
                  className="bg-gray-300 text-back px-4 py-1 rounded border border-gray-500 hover:bg-gray-400 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Approved Images */}
      <h2 className="text-2xl font-bold mb-4">Approved Images</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {approvedImages.map((img, i) => (
          <div key={i} className="p-4 bg-white shadow rounded">
            <img
              src={img.src}
              alt="approved"
              className="w-full h-40 object-cover rounded mb-2"
            />
            <p className="text-center text-gray-700">{img.caption}</p>
            <button
              onClick={() => confirmDeleteApprovedImage(img)}
              className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-black border border-gray-600"
            >
              Delete 
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
