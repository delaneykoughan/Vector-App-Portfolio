/**
 * Purpose: Main component displaying information about Natural Burial.
 * Parameters: None
 * @author: Thomas Lama 
 * @author: Delaney Koughan - shroud image, minor tailwind adjustments to transitions
 * @author: Natalia Plaka - added smallBush, Woodpost, and GPS images
 * @author: Aiden Moxey - reduced code redundancy and complexity
 * 
 */

import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp, FaPause } from "react-icons/fa";
import backGmarker from "../assets/backGmarker.jpg";
import burialOptionImage from "../assets/burialOption.jpg";
import firstpic from "../assets/firstpic.jpg";
import GPSImage from "../assets/GPS.jpg";
import pineboxImage from "../assets/pinebox.jpg";
import shroudImage from "../assets/shroud.jpg";
import smallBushImage from "../assets/smallBush.jpg";
import WoodpostImage from "../assets/Woodpost.jpg";
import TTSButton from "../Components/TTSButton"; // Reusable TTS button component

// Custom hook for intersection observer
const useInView = (threshold = 0.0) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  return [ref, isInView];
};

// Reusable Speak Button Component
const SpeakButton = ({ text, speakingText, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center p-2 sm:p-3 bg-transparent text-blue-500 hover:text-blue-700 rounded-full shadow-lg hover:bg-light-primary transition-all duration-300"
    aria-label="Read out loud"
  >
    {speakingText === text ? (
      <FaPause className="text-base sm:text-lg md:text-xl" />
    ) : (
      <FaVolumeUp className="text-base sm:text-lg md:text-xl" />
    )}
  </button>
);

function NaturalBurial() {
  const [speakingText, setSpeakingText] = useState("");
  const [naturalBurialRef, isNaturalInView] = useInView();
  const [burialOptionsRef, isBurialOptionsInView] = useInView();
  const [markerOptionsRef, isMarkerOptionsInView] = useInView();

  // Full page text for TTS
  const fullPageText = "Natural Burial. Natural burial is an eco-friendly approach to burial where the body is returned to the earth with minimal environmental impact, using biodegradable materials and without harmful chemicals. Burial Options. Here are some natural burial options: Pinebox: A biodegradable pine box with no non-biodegradable materials. Shroud: A simple biodegradable cloth shroud. Marker Options. Here are some marker options for natural burials: Small Bush: A small bush or shrub can be planted to mark the burial site. GPS Coordinate: The burial site can be identified by GPS coordinates, without a physical marker. Biodegradable Wood Post: A small, biodegradable wood post can be used as a marker.";

  /**
   * Handles text-to-speech functionality.
   * @author Raish Raj Joshi
   * @param {string} text - Text to be spoken.
   */
  const handleSpeakText = (text) => {
    if (speakingText === text) {
      window.speechSynthesis.cancel();
      setSpeakingText("");
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-CA";
      utterance.onend = () => setSpeakingText("");
      window.speechSynthesis.speak(utterance);
      setSpeakingText(text);
    }
  };

  const burialOptions = [
    {
      image: pineboxImage,
      title: "Pinebox",
      text: "A biodegradable pine box with no non-biodegradable materials.",
    },
    {
      image: shroudImage,
      title: "Shroud",
      text: "A simple biodegradable cloth shroud.",
    },
  ];

  const markerOptions = [
    {
      image: smallBushImage,
      title: "Small Bush",
      text: "A small bush or shrub can be planted to mark the burial site.",
    },
    {
      image: GPSImage,
      title: "GPS Coordinate",
      text: "The burial site can be identified by GPS coordinates, without a physical marker.",
    },
    {
      image: WoodpostImage,
      title: "Biodegradable Wood Post",
      text: "A small, biodegradable wood post can be used as a marker.",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 min-h-screen overflow-x-hidden">
      {/* Global Page TTS Button */}
      <div className="absolute top-24 right-[4vw] z-20">
        <TTSButton text={fullPageText} label="Read Aloud" />
      </div>

      {/* Natural Burial Section */}
      <div
        ref={naturalBurialRef}
        className={`relative bg-cover bg-center min-h-screen text-white flex flex-col justify-center items-center transition-opacity duration-1000 ease-in-out px-4 py-8 ${
          isNaturalInView ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${firstpic})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 text-center p-4 sm:p-6 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-shadow-lg mb-4 sm:mb-6">
            Natural Burial
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl leading-relaxed sm:leading-loose">
            <SpeakButton
              text="Natural burial is an eco-friendly approach to burial where the body is returned to the earth with minimal environmental impact, using biodegradable materials and without harmful chemicals."
              speakingText={speakingText}
              onClick={() =>
                handleSpeakText(
                  "Natural burial is an eco-friendly approach to burial where the body is returned to the earth with minimal environmental impact, using biodegradable materials and without harmful chemicals."
                )
              }
            />
            Natural burial is an eco-friendly approach to burial where the body
            is returned to the earth with minimal environmental impact, using
            biodegradable materials and without harmful chemicals.
          </p>
        </div>
      </div>

      {/* Burial Options Section */}
      <div
        ref={burialOptionsRef}
        className={`relative bg-cover bg-center min-h-screen transition-opacity duration-1000 ease-in-out py-8 sm:py-12 ${
          isBurialOptionsInView ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${burialOptionImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 relative z-10 text-center px-4 pt-4 sm:pt-8">
          Burial Options
        </h2>
        <p className="text-xl sm:text-2xl md:text-4xl text-white mb-6 relative z-10 text-center px-4"
           data-cy="paragraph-text">
          Here are some natural burial options:
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-16 md:gap-24 px-4 sm:px-8 py-8">
          {burialOptions.map((option, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 relative z-10 max-w-sm"
            >
              <img
                src={option.image}
                alt={option.title}
                className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full shadow-lg"
              />
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
                {option.title}
              </h3>
              <div className="text-center">
                <p className="text-lg sm:text-xl md:text-2xl text-white mb-2">
                  {option.text}
                </p>
                <SpeakButton
                  text={option.text}
                  speakingText={speakingText}
                  onClick={() => handleSpeakText(option.text)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marker Options Section */}
      <div
        ref={markerOptionsRef}
        className={`relative bg-cover bg-center min-h-screen p-4 sm:p-6 transition-opacity duration-1000 ease-in-out ${
          isMarkerOptionsInView ? "opacity-100" : "opacity-0"
        } filter contrast-100`}
        style={{ backgroundImage: `url(${backGmarker})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 relative z-10 text-center pt-4 sm:pt-8">
            Marker Options
          </h2>
          <p className="text-xl sm:text-2xl md:text-4xl text-white mb-6 sm:mb-8 relative z-10 text-center px-4">
            Here are some marker options for natural burials:
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16 text-white px-4">
            {markerOptions.map((option, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center max-w-sm"
              >
                <p className="text-white text-2xl sm:text-3xl md:text-5xl font-semibold mb-4 sm:mb-6">
                  {option.title}
                </p>
                <img
                  src={option.image}
                  alt={option.title}
                  className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 object-cover rounded shadow-lg"
                />
                <p className="text-base sm:text-lg md:text-2xl mt-4">{option.text}</p>
                <SpeakButton
                  text={option.text}
                  speakingText={speakingText}
                  onClick={() => handleSpeakText(option.text)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NaturalBurial;
// WAS 386 LINES