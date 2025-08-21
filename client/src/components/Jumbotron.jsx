import React from "react";

const Jumbotron = () => {
  return (
    <>
      <section
        className="bg-center bg-no-repeat bg-[url('./assets/backyard.jpg')] bg-gray-700 
      bg-blend-hard-light relative bg-cover min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh]"
      >
        <div className="px-4 w-full text-center py-10 sm:py-32 lg:py-64">
          <h1
            className="mb-4 sm:mb-0 font-extrabold tracking-tight leading-none text-white 
        header-text2 mix-blend-screen barriecitoFont rounded-xl"
          >
            OverTheWall
          </h1>
          <div className="absolute bottom-8 left-4 right-4 sm:right-0 sm:bottom-20 sm:left-auto sm:w-[50%]">
            <div className="bg-green-100 rounded-xl p-2">
              <div className="px-2 py-3 sm:px-4">
                <div className="flex items-center">
                  <p className="amitaFont text-lg sm:text-2xl lg:text-3xl italic text-center">
                    Brick oven pie with authentic italian vibe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Jumbotron;

// Favs; bg-blend-hard-light(sharp), bg-blend-difference(high contrast) bg-blend-luminosity(black and white)
