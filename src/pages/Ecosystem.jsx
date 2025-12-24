import React from "react";
import { IoPaw } from "react-icons/io5";
import { PiPlantFill } from "react-icons/pi";
import { TbMushroomFilled, TbTrees } from "react-icons/tb";
import { FaVolumeUp, FaPause } from "react-icons/fa";
import { useState } from "react";
import deer from "../assets/deer.jpg";
import heron from "../assets/heron.jpg";
import coyote from "../assets/coyote.jpg";
import TTSButton from "../Components/TTSButton"; // Reusable TTS button component
/**
 * @author Aiden Moxey, Alexander Culpitts
 * @returns 
 */

// -------------------------------
// Local TTS Button (for individual sections)
// -------------------------------
const SectionTTSButton = ({ text, speakingText, handleSpeakText }) => (
  <button
    onClick={() => handleSpeakText(text)}
    className="mr-2 p-1 sm:mr-4 sm:p-2 bg-transparent text-blue-500 hover:text-blue-700 rounded-full
         shadow-md hover:bg-light-primary transition-all duration-300 active:scale-90 shrink-0"
    aria-label="Read out loud"
  >
    {speakingText === text ? <FaPause className="text-lg sm:text-xl" /> : <FaVolumeUp className="text-lg sm:text-xl" />}
  </button>
);

// -------------------------------
// Reusable Flip Image Card
// -------------------------------
const InfoCard = ({ img, text }) => (
  <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 group overflow-hidden [transform-style:preserve-3d] perspective shrink-0">
    <div className="absolute inset-0 transform transition-transform duration-700
            [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] w-full h-full">

      {/* front */}
      <div
        className="absolute inset-0 rounded-full shadow-md bg-cover bg-center select-none [backface-visibility:hidden]"
        style={{ backgroundImage: `url(${img})` }}
      />

      {/* back */}
      <div className="absolute inset-0 flex items-center justify-center bg-light-background text-black 
          dark:bg-gray-800 dark:text-dark-text text-center rounded-full [backface-visibility:hidden] 
          [transform:rotateY(180deg)] px-2">
        <p className="px-2 sm:px-4 text-xs sm:text-sm break-words">{text}</p>
      </div>
    </div>
  </div>
);

// -------------------------------
// Main
// -------------------------------
const Ecosystem = () => {

  // Full page text for TTS
  const fullPageText = `Ecosystem. This woodland conservation site is home to a diverse and vibrant ecosystem. Wildlife: Herons are wading birds known for their long legs and necks, often found near water bodies. Deer are graceful herbivores, commonly found in forests and grasslands. The coyote is a highly adaptable, opportunistic predator, controlling populations of small mammals. Flora: Our woodlands are adorned with a variety of plant species, including towering Yellow Birch Trees, delicate wildflowers, and lush ferns. Fauna: Among the fauna, you can find graceful deer, playful foxes, and a myriad of bird species. Fungi: Woodland fungi play a vital role in breaking down organic matter and supporting plant health.`;

  const [speakingText, setSpeakingText] = useState("");

  const handleSpeakText = (text) => {
    if (speakingText === text) {
      window.speechSynthesis.pause();
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

  const wildlifeCards = [
    { img: heron, text: "Herons are wading birds known for their long legs and necks, often found near water bodies." },
    { img: deer, text: "Deer are graceful herbivores, commonly found in forests and grasslands." },
    { img: coyote, text: "The coyote is a highly adaptable, opportunistic predator, controlling populations of small mammals." },
  ];

  const categoryData = [
    {
      icon: <PiPlantFill className="text-green-700 text-5xl sm:text-6xl mb-2 shrink-0" />,
      title: "Flora",
      text: "Our woodlands are adorned with a variety of plant species, including towering Yellow Birch Trees, delicate wildflowers, and lush ferns.",
    },
    {
      icon: <IoPaw className="text-orange-700 text-5xl sm:text-6xl mb-2 shrink-0" />,
      title: "Fauna",
      text: "Among the fauna, you can find graceful deer, playful foxes, and a myriad of bird species.",
    },
    {
      icon: <TbMushroomFilled className="text-purple-700 text-5xl sm:text-6xl mb-2 shrink-0" />,
      title: "Fungi",
      text: "Woodland fungi play a vital role in breaking down organic matter and supporting plant health.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden w-full max-w-full">
      {/* Global Page TTS Button */}
      <div className="absolute top-24 right-[4vw] z-20">
        <TTSButton text={fullPageText} label="Read Aloud" />
      </div>
      

      <main className="w-full max-w-full px-4 py-4 overflow-hidden">
        <section className="mb-12 overflow-hidden">

          {/* Heading */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left mb-6 pt-2 w-full max-w-full overflow-hidden">
            <TbTrees className="text-green-700 dark:text-green-300 text-5xl sm:text-7xl mr-2 shrink-0" />
            <h2 data-cy="ecosystem-tts-button" className="text-4xl sm:text-6xl font-semibold text-blue-500 px-2 shrink min-w-0 break-words">
              Ecosystem
            </h2> 
            <SectionTTSButton
              text="This woodland conservation site is home to a diverse and vibrant ecosystem..."
              speakingText={speakingText}
              handleSpeakText={handleSpeakText}
            />
          </div>

          {/* wildlife display */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 justify-center items-center w-full max-w-full [&>*]:min-w-0 overflow-hidden">
            {wildlifeCards.map(({ img, text }, i) => (
              <div key={i} className="flex flex-col items-center w-fit overflow-hidden">
                <SectionTTSButton
                  text={text}
                  speakingText={speakingText}
                  handleSpeakText={handleSpeakText}
                />
                <InfoCard img={img} text={text} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Category Cards */}
      <div className="w-full max-w-full px-4 py-10 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-full [&>*]:min-w-0 overflow-hidden">
          {categoryData.map(({ icon, title, text }, i) => (
            <div key={i} className="bg-light-background text-light-text dark:bg-gray-800 dark:text-dark-text 
                    p-4 rounded-xl shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="flex flex-col items-center text-center mb-4 pt-4">
                {icon}
                <div className="flex items-center justify-center flex-shrink-0">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-blue-500 pr-2">{title}</h3>
                  <SectionTTSButton
                    text={text}
                    speakingText={speakingText}
                    handleSpeakText={handleSpeakText}
                  />
                </div>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-center px-2 sm:px-4 break-words">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ecosystem;

// Was 450+ lines before