/** 
 * @file Gallery.jsx
 * @description:
 * A React component that uses TailwindCSS to display a parallax-style gallery
 * with both static images and user-uploaded images. Users can upload images 
 * (with validation) which are stored in localStorage for later approval.
 *
 * @author 
 *    - Aaron Jayawardana 
 *    - Annalyn Hassell & Kayden Silver
 * 
 * */


import React, { useState, useEffect } from "react";
import "./Gallery.css";

// Import static images
import image5 from "../assets/image5.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";

/**
   * Load approved images from localStorage when the component starts.
   * Returns an empty array if none exist.
   */
function Gallery() {
  const [approvedImages, setApprovedImages] = useState(() => {
    return JSON.parse(localStorage.getItem("approvedImages")) || [];
  });

  //Error message state.
  const [errorMessage, setErrorMessage] = useState("");

  // Static images included with the website
  const staticImages = [
    {
      src: image5,
      caption:
        "Natural History of the French Village Conservation Woodland – Nov. 2021",
    },
    { src: image2, caption: "" },
    { src: image3, caption: "" },
    { src: image4, caption: "" },
  ];

  /**
   * Reads file input from user and converts it into an image kept in local storage.
   * Contains checks for file extension and size.
   * @param {string} event - Event given by browser when used as an event handler.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    //File type check
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowedFileTypes.includes(file.type)) {
      setErrorMessage("File type must be .jpeg, .png, or .jpg");
      return;
    }

    //File size check
    const maxSize = 5 * 1024 * 1024; //5MB
    if (file.size > maxSize) {
      setErrorMessage("File must be 5MB or less.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImage = {
        src: reader.result,
        id: Date.now(),
        caption: "User Uploaded Image",
      };

      // Save to pending list in localStorage
      const oldPending =
        JSON.parse(localStorage.getItem("pendingImages")) || [];
      const updatedPending = [...oldPending, newImage];

      localStorage.setItem("pendingImages", JSON.stringify(updatedPending));

      alert("Image submitted for approval!");
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="Gallery">
      {/* STATIC GALLERY */}
      <section className="p-8">
        <h2 className="text-4xl font-bold mb-6 text-center">Gallery</h2>

        {/* Responsive grid layout using Tailwind */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Display static images */}
          {staticImages.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg shadow-lg p-4 bg-white"
            >
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-48 object-cover rounded-lg transition-all duration-300 transform hover:scale-105"
              />
              <p className="mt-2 text-left text-gray-700 font-medium">
                {item.caption}
              </p>
            </div>
          ))}

          {/* APPROVED USER IMAGES */}
          {approvedImages.map((img, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg shadow-lg p-4 bg-white"
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-48 object-cover rounded-lg transition-all duration-300 transform hover:scale-105"
              />
              <p className="mt-2 text-center text-gray-700">{img.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UPLOAD SECTION */}
      <section className="bg-gray-900 text-white p-8 text-center">
        <h2 className="text-3xl font-semibold mb-4">Add Your Own Image</h2>
        {/* File input with Tailwind styling */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
        />
        {/* Display validation errors if present */}
        {errorMessage && (
          <div className="mt-4 text-red-500 text-sm">
            <p>{errorMessage}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Gallery;