import React from "react";

const Jumbotron = () => {
  return (
    <>
      <section
        className="bg-center bg-no-repeat bg-[url('./assets/backyard.jpg')] bg-gray-700 
      bg-blend-hard-light relative bg-cover min-h-[40vh] sm:min-h-[35vh] lg:min-h-[40vh]"
      >
        {/* Newsletter QR Code - Desktop/Tablet */}
        <div className="hidden md:block absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-2 md:p-3 max-w-[140px] md:max-w-[160px] lg:max-w-[180px] z-10">
      <p className="text-gray-800 text-xs md:text-sm font-bold mb-1 md:mb-2 cursiveFont text-center">
            Newsletter
          </p>
          <img
            src={
              new URL("../assets/QRCode/QRcodeKit.png", import.meta.url).href
            }
            alt="Newsletter signup QR code"
            className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg mx-auto"
          />
          <p className="text-gray-600 text-xs mt-1 md:mt-2 italic text-center">
            Scan to join!
          </p>
        </div>

        {/* Mobile Newsletter Button */}
        <div className="block md:hidden absolute left-1/2 -translate-x-1/2 bottom-6 z-10">
          <a
            href="https://otw-pizza.kit.com/07380be14d"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white font-semibold px-4 py-2 rounded-full shadow-lg text-sm cursiveFont hover:bg-gray-700 transition-colors"
          >
            Join Newsletter
          </a>
        </div>

        {/* Main Heading - Centered */}
        <div className="px-4 w-full text-center py-10 sm:py-32 lg:py-64">
          <h1
            className="font-extrabold tracking-tight leading-none text-white 
          header-text2 mix-blend-screen barriecitoFont rounded-xl"
          >
            OverTheWall
            <span className="header-badge text-[0.6em] inline-block align-baseline">
              Pizza
            </span>
          </h1>
        </div>
      </section>
    </>
  );
};

export default Jumbotron;

// Favs; bg-blend-hard-light(sharp), bg-blend-difference(high contrast) bg-blend-luminosity(black and white)
