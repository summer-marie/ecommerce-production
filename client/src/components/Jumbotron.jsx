import React from "react"

const Jumbotron = () => {
  return (
    <>
      <section
        className="bg-center bg-no-repeat bg-[url('./assets/backyard.jpg')] bg-gray-700 
      bg-blend-hard-light relative
      
      bg-cover"
      >
        <div className='px-4 w-full text-center py-24 lg:py-56 '>
          <h1
            className='mb-4 text-4xl font-extrabold tracking-tight leading-none text-white 
        md:text-5xl lg:text-6xl header-text2 mix-blend-screen barriecitoFont rounded-xl'
          >
            OverTheWall
          </h1>
          <div className='absolute right-0 bottom-15 w-[50%]'>
            <div className=' bg-green-100 rounded-xl '>
              <div className='px-4 py-3 mx-auto'>
                <div className='flex items-center'>
                  <p className='amitaFont text-3xl italic'>
                    Brick oven pie with authentic italian vibe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Jumbotron

// Favs; bg-blend-hard-light(sharp), bg-blend-difference(high contrast) bg-blend-luminosity(black and white)
