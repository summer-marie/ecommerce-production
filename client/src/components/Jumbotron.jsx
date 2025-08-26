import React from "react";

const Jumbotron = () => {
  return (
    <>
      <section
        className="bg-center bg-no-repeat bg-[url('./assets/backyard.jpg')] bg-gray-700 
      bg-blend-hard-light relative bg-cover min-h-[40vh] sm:min-h-[35vh] lg:min-h-[40vh]"
      >
        <div className="px-4 w-full text-center py-10 sm:py-32 lg:py-64">
          <h1
            className="mb-4 sm:mb-0 font-extrabold tracking-tight leading-none text-white 
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
