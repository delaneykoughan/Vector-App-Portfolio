/**
 * @file TTSButton.jsx
 * @description Reusable Text-to-Speech button component that can be placed on any page.
 * Positioned in the top-left corner with fixed positioning.
 *
 * @author Aiden Moxey
 */

import { useState, useEffect } from "react";
import { FaVolumeUp, FaPause } from "react-icons/fa";

/**
 * @function TTSButton
 * @description A reusable text-to-speech button component that reads provided text content.
 *
 * @param {Object} props - Component props
 * @param {string} props.text - The full text content to be read aloud
 * @param {string} [props.label="Read Aloud"] - Custom label for the button
 * 
 * @returns {JSX.Element} The rendered TTS button component
 */
const TTSButton = ({ text, label = "Read Aloud" }) => {
  const [speakingText, setSpeakingText] = useState("");

  /**
   * Cleanup effect: stops speech synthesis when component unmounts (page change)
   */
  useEffect(() => {
    return () => {
      // Cancel any ongoing speech when component unmounts
      window.speechSynthesis.cancel();
    };
  }, []);

  /**
   * Handles text-to-speech functionality by toggling speech synthesis.
   *
   * @param {string} textToSpeak - The text to be spoken
   */
  const handleSpeakText = (textToSpeak) => {
    if (speakingText === textToSpeak) {
      // Pause and cancel if the same text is already being spoken
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      setSpeakingText("");
    } else {
      // Start speaking new text
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en-CA"; // Set language to Canadian English

      // Reset state when speech ends
      utterance.onend = () => {
        setSpeakingText("");
      };

      window.speechSynthesis.speak(utterance);
      setSpeakingText(textToSpeak);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleSpeakText(text)}
        className="flex items-center gap-2 p-2 sm:p-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        aria-label={label}
        title={label}
      >
        {speakingText === text ? (
          <>
            <FaPause className="text-xl" />
            <span className="font-semibold text-sm hidden sm:inline">Stop</span>
          </>
        ) : (
          <>
            <FaVolumeUp className="text-xl" />
            <span className="font-semibold text-sm hidden sm:inline">{label}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default TTSButton;