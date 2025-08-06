import { Link } from "react-router"

const NoMatch = () => {
  return (
    <>
      <section className='tomato flex items-center justify-center relative h-screen'>
        <div className='absolute myText py-8 px-4 max-w-screen-xl lg:py-16 lg:px-6 bg-white opacity-70 rounded-4xl '>
          <div className='mx-auto max-w-screen-sm text-center -mt-[10] z-20'>
            <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 text-red-600'>
              404
            </h1>
            <p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl '>
              Something is missing.
            </p>
            <p className='mb-4 text-lg  text-gray-900'>
              Sorry, we can not find that page. You will find lots to explore on
              the home page.{" "}
            </p>
            <Link
              to='/'
              className='inline-flex text-black bg-green-600 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4'
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default NoMatch
