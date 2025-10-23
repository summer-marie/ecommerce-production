import React from "react";

const Jumbotron = () => {
  return (
    <>
      <section
        className="bg-center bg-no-repeat bg-[url('./assets/backyard.jpg')] bg-gray-700 
      bg-blend-hard-light relative bg-cover min-h-[40vh] sm:min-h-[35vh] lg:min-h-[40vh]"
      >
        {/* Newsletter QR Code - Positioned Absolutely on Left */}
        <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 max-w-[180px] z-10">
          <p className="text-gray-800 text-md font-bold mb-2 cursiveFont text-center">
            Newsletter
          </p>
          <img
            src={new URL("../assets/QRCode/QRcodeKit.png", import.meta.url).href}
            alt="Newsletter signup QR code"
            className="w-32 h-32 rounded-lg"
          />
          <p className="text-gray-600 text-xs mt-2 italic text-center">
            Scan to join!
          </p>
        </div>

        {/* Main Heading - Centered */}
        <div className="px-4 w-full text-center py-10 sm:py-32 lg:py-64">
          <h1
            className="font-extrabold tracking-tight leading-none text-white 
          header-text2 mix-blend-screen barriecitoFont rounded-xl"
          >
            OverTheWall
            <span className="header-badge">Pizza</span>
          </h1>
        </div>
      </section>
    </>
  );
};

export default Jumbotron;

// Favs; bg-blend-hard-light(sharp), bg-blend-difference(high contrast) bg-blend-luminosity(black and white)
