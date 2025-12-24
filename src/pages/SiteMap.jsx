/** 
 *@Purpose A react component that uses Leaflet mapping api to create an interactive map
 *of the conservation area.  this component tracks the user's location and notifies
 *them when they're near an area of interest via TTS
 *@COTS leaflet via npm install leaflet
 *@author Delaney Koughan - checkproximity, landmarks, useeffect, popups for landmarks, TTS button for talking trees
 *@author Kayden Silver - Map Borders, North Arrow, Bug Fixes
 *@author Aiden Moxey - Added test mode for simulating locations, refactored TTS functionality
 *@author Natalia Plaka - Added the landmark images and descriptions, created shaded woodland trail area, dark-mode for pop-ups, refined zoom limits
 *@author Annalyn Hassell - Helped with the north arrow postioning, talking tree
 *
 */

import React, { useState } from "react";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import farmhouseImg from "../assets/FarmHouse.jpg";
import entranceImg from "../assets/Entrance.jpg";
import labyrinthImg from "../assets/Labyrinth.jpg";
import birchImg from "../assets/BirchTrees.jpg";
import dockImg from "../assets/Dock.jpg";
import talkingTree from "../assets/talkingTree.png";
import TTSButton from "../Components/TTSButton.jsx";

function SiteMap() {
  const [speakingText, setSpeakingText] = useState("");
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const watchIdRef = useRef(null);
  const [nearbyLandmark, setNearbyLandmark] = useState(null);
  const notifiedLandmarksRef = useRef(new Set());
  const [testMode, setTestMode] = useState(false);
  const [selectedTestLocation, setSelectedTestLocation] = useState(null);
  const [testMenuOpen, setTestMenuOpen] = useState(false);

  // Define landmarks with coordinates
  const landmarks = [
    {
      name: "Farmhouse",
      lat: 44.626430,
      lng: -63.923172,
      description: "What's left of a small farmhouse that once stood here, now quiet and softened by moss and trees.",
      image: farmhouseImg,
    },
    {
      name: "Entrance",
      lat: 44.626556,
      lng: -63.923382,
      description: "The main entrance overlooking the bay, surrounded by birch and spruce trees. This starting point gives visitors their first glimpse of the natural beauty of the site.",
      image: entranceImg,
    },
    {
      name: "Natural burial",
      lat: 44.625050,
      lng: -63.921247,
      description: "A quiet, designated area for natural burials, surrounded by trees and native plants."
    },
    {
      name: "Labyrinth Entrance",
      lat: 44.624081,
      lng: -63.919488,
      description: "Entrance to the woodland labyrinth, marked by open pathways and fallen logs. This area begins the circular walking route used for reflection and mindfulness.",
      image: labyrinthImg,
    },
    {
      name: "Birch Forest",
      lat: 44.624640,
      lng: -63.920329,
      description: "A quiet birch grove filled with golden leaves, mossy rocks, and tall slender trees. One of the most scenic spots in the woodland conservation area.",
      image: birchImg,
    },
    {
      name: "Dock",
      lat: 44.620829,
      lng: -63.914325,
      description: "This dock provides a scenic viewpoint over the bay. Visitors often stop here to enjoy the water, the breeze, and the surrounding coastal landscape.",
      image: dockImg,
    },
  ];

  const handleSpeakText = (text) => {
    if (speakingText === text) {
      // Pause and cancel if the same text is already being spoken
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      setSpeakingText(""); // Reset speaking text
    } else {
      // Start speaking new text
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-CA"; // Set language to Canadian English

      // Reset state when speech ends
      utterance.onend = () => {
        setSpeakingText("");
      };

      window.speechSynthesis.speak(utterance);
      setSpeakingText(text); // Update speaking text
    }
  };

  // Calculate distance between two coordinates in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const radLat1 = (lat1 * Math.PI) / 180;
    const radLat2 = (lat2 * Math.PI) / 180;
    const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Check proximity to landmarks
  const checkProximity = (userLat, userLng) => {
    const proximityThreshold = 3.048; // 10 feet in meters

    for (const landmark of landmarks) {
      const distance = calculateDistance(
        userLat,
        userLng,
        landmark.lat,
        landmark.lng
      );

      if (distance <= proximityThreshold) {
        // Only notify if we haven't notified for this landmark yet
        if (!notifiedLandmarksRef.current.has(landmark.name)) {
          setNearbyLandmark(landmark);
          notifiedLandmarksRef.current.add(landmark.name);
          handleSpeakText("You are near a location of interest. Press read aloud to listen")
          return;
        }
      } else {
        // If user moves away, allow re-notification when they return
        notifiedLandmarksRef.current.delete(landmark.name);
      }
    }
  };

  // Handle user location updates
  const handleLocationUpdate = (position) => {
    const { latitude, longitude } = position.coords;

    if (leafletMapRef.current) {
      // Update or create user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([latitude, longitude]);
      } else {
        const userIcon = L.divIcon({
          className: "user-location-marker",
          html: '<div style="background-color: #4285F4; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.3);"></div>',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        userMarkerRef.current = L.marker([latitude, longitude], {
          icon: userIcon,
        })
          .addTo(leafletMapRef.current)
          .bindPopup("You are here");
      }

      // Check proximity to landmarks
      checkProximity(latitude, longitude);
    }
  };

  // Simulate location for testing
  const simulateLocation = (landmark) => {
    setSelectedTestLocation(landmark.name);
    setTestMode(true);
    setTestMenuOpen(false); // Close menu after selection

    // Simulate being right at the landmark
    handleLocationUpdate({
      coords: {
        latitude: landmark.lat,
        longitude: landmark.lng,
      },
    });
  };

  // Toggle test mode off
  const disableTestMode = () => {
    setTestMode(false);
    setSelectedTestLocation(null);
    notifiedLandmarksRef.current.clear();
    setNearbyLandmark(null);
  };

  // Handle geolocation errors
  const handleLocationError = (error) => {
    if (error.code === error.TIMEOUT) {
      console.warn("Geolocation timeout - will retry automatically");
    } else {
      console.error("Geolocation error:", error.message);
    }
  };

  useEffect(() => {
    if (leafletMapRef.current) return;

    const bounds = L.latLngBounds(
      [44.605, -63.94],
      [44.64, -63.89]
    );

    leafletMapRef.current = L.map(mapRef.current, {
      center: [44.624081, -63.919488],
      zoom: 15,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      minZoom: 14,
      maxZoom: 18,
    });

    // Add markers for landmarks
    landmarks.forEach((landmark) => {
      if (landmark.lat && landmark.lng) {  // ✅ Only add markers if coordinates exist
        L.marker([landmark.lat, landmark.lng])
          .addTo(leafletMapRef.current)
          .bindPopup(landmark.name);
      }
    });

    // Add north arrow control
    L.Control.NorthArrow = L.Control.extend({
      //Create image to display for the control.
      onAdd: function (map) {
        var img = L.DomUtil.create("img");
        img.src = "./src/assets/compass_rose.png";
        img.style.width = "150px";
        img.style.height = "150px";
        img.style.pointerEvents = "none";
        return img;
      },
      //does nothing as there are no event listners to cleanup.
      onRemove: function (map) { },
    });

    /**
     * Creates a custom control that just displays a compass.
     * @param {any} opts 
     * @returns A new north arrow custom control.
     */
    L.control.northArrow = function (opts) {
      return new L.Control.NorthArrow(opts);
    };

    L.control.northArrow({ position: "topright" }).addTo(leafletMapRef.current);

    // Add woodland trail area
    L.polygon(
      [
        [44.62673, -63.923372],
        [44.6253, -63.922747],
        [44.616241, -63.908598],
        [44.617029, -63.907005],
      ],
      {
        color: "yellow",
        weight: 3,
        fillColor: "darkgreen",
        fillOpacity: 0.3,
      }
    )
      .addTo(leafletMapRef.current)
      .bindPopup("Woodland Trail Area");

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMapRef.current);

    // Start watching user location (only if not in test mode)
    if ("geolocation" in navigator && !testMode) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleLocationUpdate,
        handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 10000, // Increased to 10 seconds
          maximumAge: 30000, // Allow cached positions up to 30 seconds old
        }
      );
    } else if (!("geolocation" in navigator)) {
      console.error("Geolocation is not supported by this browser.");
    }

    // Cleanup
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [testMode]);

  // Close the popup
  const closePopup = () => {
    setNearbyLandmark(null);
  };

  return (
    <div>
      {/* Test Menu Toggle Button - Lower Right Corner */}
      <button
        onClick={() => setTestMenuOpen(!testMenuOpen)}
        className="fixed bottom-20 right-[2vw] z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg p-4 transition-all duration-300 hover:scale-110"
        title="Test Mode"
      >
        <span className="text-2xl">🧪</span>
      </button>

      {/* Test Menu Popup */}
      {testMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setTestMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-2xl p-4 max-w-xs w-80">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-bold text-gray-800">
                🧪 Test Mode
              </h4>
              <button
                onClick={() => setTestMenuOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            {!testMode ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">
                  Simulate being at a landmark:
                </p>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {landmarks.map((landmark) => (
                    <button
                      key={landmark.name}
                      onClick={() => simulateLocation(landmark)}
                      className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded text-sm text-blue-700 transition-colors"
                    >
                      📍 {landmark.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-green-600 mb-2">
                  ✓ Testing at: <strong>{selectedTestLocation}</strong>
                </p>
                <button
                  onClick={disableTestMode}
                  className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                >
                  Exit Test Mode
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* This is the div that contains the map! - Kayden*/}
      <div
        ref={mapRef}
        className="relative z-10 w-full sm:h-[76vh] sm:w-full h-[80vh]"
      />

      {/* Proximity Alert Popup */}
      {nearbyLandmark && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-2xl p-6 max-w-sm w-11/12 animate-fade-in"
          style={{ animation: "fadeIn 0.3s ease-in-out" }}
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-800">📍 You're Near:</h3>
            <button
              onClick={closePopup}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
            >
              ×
            </button>
          </div>

          {/* LANDMARK NAME */}
          <p className="text-xl font-bold text-gray-800 mb-4">
            {nearbyLandmark.name}
          </p>

          {/* DESCRIPTION + IMAGE SIDE BY SIDE */}
          <div className="flex gap-4 items-start">

            {/* LEFT SIDE: DESCRIPTION + TALKING TREE */}
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-gray-700 text-sm">
                {nearbyLandmark.description}
              </p>

              {/* Talking Tree */}
              <img
                src={talkingTree}
                alt="Talking Tree"
                className="w-[10vw] object-contain"
              />
            </div>

            {/* RIGHT SIDE: LANDMARK IMAGE */}
            {nearbyLandmark.image && (
              <img
                src={nearbyLandmark.image}
                alt={nearbyLandmark.name}
                className="w-32 h-28 rounded-md object-cover flex-shrink-0"
              />
            )}
          </div>

          <div className="flex justify-center">
            <TTSButton classname="" text={nearbyLandmark.description} label="Read Aloud" />
          </div>

          {/* BUTTON */}
          <button
            onClick={closePopup}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-6"
          >
            Got it!
          </button>
        </div>
      )}
      
      {/* Popup overlay */}
      {nearbyLandmark && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closePopup}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default SiteMap;