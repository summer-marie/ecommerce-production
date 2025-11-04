import Jumbotron from "../components/Jumbotron";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAbout } from "../redux/aboutSlice";

// Static placeholder images are now inline in the components

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
      
      <div className="space-y-16 py-12 bg-gray-50">
        {/* Section 1 - Our Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6">
          <div className="space-y-6">
            {data?.topHeading || data?.topDescription ? (
              <>
                <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium cursiveFont">
                  Our Story
                </span>
                {data.topHeading && (
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight barriecitoFont">
                    {data.topHeading}
                  </h2>
                )}
                {data.topDescription && (
                  <p className="text-lg text-gray-600 leading-relaxed cursiveFont whitespace-pre-line">
                    {data.topDescription}
                  </p>
                )}
              </>
            ) : (
              <>
                <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium cursiveFont">
                  Our Story
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight barriecitoFont">
                  Fresh Ingredients, Bold Flavors
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed cursiveFont">
                  Discover the passion behind every pizza we create, from farm-fresh ingredients to time-honored recipes.
                </p>
              </>
            )}
          </div>
          <div className="relative">
            {data?.topImage?.data ? (
              <img 
                className="w-full h-96 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                src={data.topImage.data}
                alt="About top section"
                loading="lazy"
              />
            ) : (
              <img 
                className="w-full h-96 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                src={new URL("../assets/gardenTomato.jpg", import.meta.url).href}
                alt="Fresh garden tomatoes"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Section 2 - Craft & Quality (Reversed) */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6">
          <div className="lg:order-2 space-y-6">
            {data?.centerHeading || data?.centerDescription ? (
              <>
                <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium cursiveFont">
                  Craft & Quality
                </span>
                {data.centerHeading && (
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight barriecitoFont">
                    {data.centerHeading}
                  </h2>
                )}
                {data.centerDescription && (
                  <p className="text-lg text-gray-600 leading-relaxed cursiveFont whitespace-pre-line">
                    {data.centerDescription}
                  </p>
                )}
              </>
            ) : (
              <>
                <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium cursiveFont">
                  Craft & Quality
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight barriecitoFont">
                  Handcrafted Perfection
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed cursiveFont">
                  Every dough is hand-stretched, every sauce is made fresh daily, and every pizza is a work of art.
                </p>
              </>
            )}
          </div>
          <div className="lg:order-1 relative">
            {data?.centerImage?.data ? (
              <img 
                className="w-full h-96 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                src={data.centerImage.data}
                alt="About center section"
                loading="lazy"
              />
            ) : (
              <img 
                className="w-full h-96 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                src={new URL("../assets/dough.jpg", import.meta.url).href}
                alt="Fresh pizza dough"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Section 3 - Community & Tradition */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6">
          <div className="space-y-6">
            {data?.bottomHeading || data?.bottomDescription ? (
              <>
                <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium cursiveFont">
                  Community & Tradition
                </span>
                {data.bottomHeading && (
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight barriecitoFont">
                    {data.bottomHeading}
                  </h2>
                )}
                {data.bottomDescription && (
                  <p className="text-lg text-gray-600 leading-relaxed cursiveFont whitespace-pre-line">
                    {data.bottomDescription}
                  </p>
                )}
              </>
            ) : (
              <>
                <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium cursiveFont">
                  Community & Tradition
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight barriecitoFont">
                  Rooted in Tradition
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed cursiveFont">
                  From our herb garden to your table, we're committed to serving our community with authentic flavors and warm hospitality.
                </p>
              </>
            )}
          </div>
          <div className="relative">
            {data?.bottomImage?.data ? (
              <img 
                className="w-full h-96 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                src={data.bottomImage.data}
                alt="About bottom section"
                loading="lazy"
              />
            ) : (
              <img 
                className="w-full h-96 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                src={new URL("../assets/herbs.jpg", import.meta.url).href}
                alt="Fresh herbs"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
