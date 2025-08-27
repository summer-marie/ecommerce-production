import Jumbotron from "../components/Jumbotron";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAbout } from "../redux/aboutSlice";

const topImagePlaceholder = (
  <img
    className="object-cover object-center w-full rounded-lg h-full"
    src={new URL("../assets/gardenTomato.jpg", import.meta.url).href}
    alt=""
    loading="lazy"
  />
);
const centerImagePlaceholder = (
  <img
    className="object-cover object-center w-full rounded-lg h-full"
    src={new URL("../assets/dough.jpg", import.meta.url).href}
    alt=""
    loading="lazy"
  />
);

const bottomImagePlaceholder = (
  <img
    className="object-cover object-center w-full rounded-lg h-full"
    src={new URL("../assets/herbs.jpg", import.meta.url).href}
    alt=""
    loading="lazy"
  />
);

// Static fallback sections removed — empty space will render when content is not provided

const Home = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((s) => s.about);

  useEffect(() => {
    dispatch(fetchAbout());
  }, [dispatch]);

  // Images are static placeholders for now; dynamic images will be wired later

  return (
    <>
      <div>
        <Jumbotron headline={"OverTheWall"} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 px-2 sm:px-4 py-4 mb-15 sm:ms-5">
        <div className="w-full bg-red-900 rounded-xl shadow-2xl shadow-black overflow-hidden h-[35vh] sm:h-64 lg:h-80">
          {data?.topImage?.data ? (
            <img
              className="object-cover object-center w-full rounded-lg h-full"
              src={data.topImage.data}
              alt="About top section"
              loading="lazy"
            />
          ) : (
            topImagePlaceholder
          )}
        </div>
        <div className="w-full bg-green-200 rounded-xl sm:col-span-1 lg:col-span-2 shadow-2xl shadow-green-900">
          {data?.topHeading || data?.topDescription ? (
            <div className="cursiveFont text-black text-center p-2 sm:p-3">
              {data.topHeading && (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800 m-2 text-shadow-gray-700 text-shadow-sm">
                    {data.topHeading}
                  </h1>
                  <hr className="p-1 border-gray-700" />
                </>
              )}
              <div className="mx-auto max-w-3xl text-sm sm:text-base lg:text-xl leading-relaxed whitespace-pre-line break-words">
                {data.topDescription}
              </div>
            </div>
          ) : null}
        </div>

        <div className="w-full bg-white shadow-black rounded-xl sm:col-span-1 lg:col-span-2 shadow-2xl order-4 sm:order-3">
          {data?.centerHeading || data?.centerDescription ? (
            <div className="cursiveFont font-medium text-black text-center p-2 sm:p-3">
              {data.centerHeading && (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold text-black m-2 p-2 text-shadow-gray-600 text-shadow-sm">
                    {data.centerHeading}
                  </h1>
                  <hr className="p-1 border-black mb-1" />
                </>
              )}
              <div className="mx-auto max-w-3xl text-sm sm:text-base lg:text-xl leading-relaxed whitespace-pre-line break-words">
                {data.centerDescription}
              </div>
            </div>
          ) : null}
        </div>
        <div className="w-full bg-red-900 rounded-xl shadow-2xl shadow-black overflow-hidden h-[35vh] sm:h-64 lg:h-80 order-3 sm:order-4">
          {data?.centerImage?.data ? (
            <img
              className="object-cover object-center w-full rounded-lg h-full"
              src={data.centerImage.data}
              alt="About center section"
              loading="lazy"
            />
          ) : (
            centerImagePlaceholder
          )}
        </div>

        <div className="w-full bg-red-900 rounded-xl shadow-2xl shadow-black overflow-hidden h-[35vh] sm:h-64 lg:h-80 order-5">
          {data?.bottomImage?.data ? (
            <img
              className="object-cover object-center w-full rounded-lg h-full"
              src={data.bottomImage.data}
              alt="About bottom section"
              loading="lazy"
            />
          ) : (
            bottomImagePlaceholder
          )}
        </div>
        <div className="w-full bg-red-900 rounded-xl sm:col-span-1 lg:col-span-2 shadow-2xl shadow-red-600 order-6">
          {data?.bottomHeading || data?.bottomDescription ? (
            <div className="cursiveFont text-black text-center p-2 sm:p-3">
              {data.bottomHeading && (
                <>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black m-2 p-2 text-shadow-gray-800 text-shadow-sm">
                    {data.bottomHeading}
                  </h1>
                  <hr className="border-black mb-1 p-1" />
                </>
              )}
              <div className="mx-auto max-w-3xl text-sm sm:text-base lg:text-xl leading-relaxed whitespace-pre-line break-words">
                {data.bottomDescription}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Home;
