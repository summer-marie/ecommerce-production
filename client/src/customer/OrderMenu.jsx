import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import { builderGetMany } from "../redux/builderSlice";
import { addToCart } from "../redux/cartSlice";
import { LazyImage } from "../utils/performance.jsx";

const Order = () => {
  const dispatch = useDispatch();
  const { builders } = useSelector((state) => state.builder);

  useEffect(() => {
    dispatch(builderGetMany());
  }, [dispatch]);

  // Memoized callback for adding to cart
  const handleAddToCart = useCallback(
    (builder) => {
      dispatch(
        addToCart({
          ...builder,
          cartItemId: Date.now() + Math.random(),
        })
      );
    },
    [dispatch]
  );

  const fallbackImage = new URL("../assets/basePizza.jpg", import.meta.url)
    .href;

  return (
    <>
      {/* Header */}
      <h2 className="berkshireSwashFont mt-5 text-center text-3xl font-bold text-slate-800">
        Our Menu
      </h2>
      <h3 className="amitaFont mt-5 text-center text-2xl font-bold text-slate-800">
        Flavor is just one click away
      </h3>
      <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700 w-[80%]" />

      {/* Flex container */}
      <div className="mx-auto max-w-[120rem]">
        <div className="flex flex-wrap justify-center items-start flex-row sm:flex-col sm:items-center md:flex-row lg:flex-col xl:flex-row m-[3rem]">
          {/* Pizza Menu Cards */}
          {builders.length === 0 ? (
            <div className="w-full text-center py-12">
              <div className="animate-pulse">
                <div className="text-gray-500 text-lg">
                  Loading delicious pizzas...
                </div>
              </div>
            </div>
          ) : (
            builders.map((builder, index) => (
              <div
                key={builder.id || index}
                className="max-w-sm w-1/4 m-4 sm:w-full bg-white border border-gray-200 shadow-2xl shadow-red-700 rounded-lg flex flex-col h-[30rem] relative"
              >
                <div className="relative w-full aspect-[4/3]">
                  <LazyImage
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg rounded-s-lg"
                    src={
                      builder.image && builder.image.filename
                        ? `${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                            builder.image.filename
                          }`
                        : fallbackImage
                    }
                    fallbackSrc={fallbackImage}
                    alt={builder.pizzaName || "Pizza"}
                  />
                </div>

                <div className="px-5 pt-3 pb-3 flex flex-col flex-1">
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                    {builder.pizzaName}
                  </h5>
                  <div className="space-y-1 mb-2">
                    <ul className="list-disc list-inside ml-2">
                      <span>
                        <strong>Pizza Base:</strong>{" "}
                        {builder.base &&
                          builder.base.map((b) => b.name).join(", ")}{" "}
                        ,{" "}
                        {builder.sauce && (builder.sauce.name || builder.sauce)}
                      </span>
                      <span className="block">
                        <strong>Toppings:</strong>{" "}
                        {[
                          ...(builder.meatTopping
                            ? builder.meatTopping.map((m) => m.name)
                            : []),
                          ...(builder.veggieTopping
                            ? builder.veggieTopping.map((v) => v.name)
                            : []),
                        ].join(", ")}
                      </span>
                    </ul>

                    <div className="flex-1"></div>
                    <div className="absolute bottom-0 left-0 w-full px-5 flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900">
                        $ {Number(builder.pizzaPrice).toFixed(2)}
                      </span>

                      <button
                        onClick={() => handleAddToCart(builder)}
                        type="button"
                        className="font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2 top-0 right-0 shadow-lg me-2 mb-2 hover:bg-gradient-to-br bg-gradient-to-t focus:ring-4 focus:outline-none cursor-pointer shadow-green-800/80 hover:text-black text-white from-green-950 via-green-500 to-green-600 focus:ring-green-800 transition-all duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Order;
