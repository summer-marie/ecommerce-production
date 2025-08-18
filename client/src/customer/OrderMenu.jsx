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
        <div className="flex flex-wrap justify-center items-start gap-4 sm:gap-6 m-4 sm:m-6">
          {/* Pizza Menu Cards */}
          {!Array.isArray(builders) || builders.length === 0 ? (
            <div className="w-full text-center py-12">
              <div className="animate-pulse">
                <div className="text-gray-500 text-lg">
                  Loading delicious pizzas...
                </div>
              </div>
            </div>
          ) : (
            builders.map((builder, index) => {
              // Defensive normalization to avoid rendering raw objects
              const imageSrc =
                builder?.image && typeof builder.image.data === "string"
                  ? builder.image.data
                  : fallbackImage;
              const baseNames = Array.isArray(builder?.base)
                ? builder.base
                    .map((b) =>
                      typeof b === "string"
                        ? b
                        : b && typeof b === "object"
                        ? b.name
                        : null
                    )
                    .filter(Boolean)
                    .join(", ")
                : "";
              const sauceName = builder?.sauce
                ? typeof builder.sauce === "string"
                  ? builder.sauce
                  : builder.sauce.name || ""
                : "";
              const meatNames = Array.isArray(builder?.meatTopping)
                ? builder.meatTopping
                    .map((m) =>
                      typeof m === "string"
                        ? m
                        : m && typeof m === "object"
                        ? m.name
                        : null
                    )
                    .filter(Boolean)
                : [];
              const veggieNames = Array.isArray(builder?.veggieTopping)
                ? builder.veggieTopping
                    .map((v) =>
                      typeof v === "string"
                        ? v
                        : v && typeof v === "object"
                        ? v.name
                        : null
                    )
                    .filter(Boolean)
                : [];
              const allToppings = [...meatNames, ...veggieNames].join(", ");
              return (
                <div
                  key={builder.id || index}
                  className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] bg-gray-300 border border-gray-200 shadow-2xl shadow-red-700 rounded-lg flex flex-col h-[26rem] sm:h-[28rem] relative"
                >
                  <div className="relative w-full h-1/2">
                    <LazyImage
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                      src={imageSrc}
                      fallbackSrc={fallbackImage}
                      alt={builder.pizzaName || "Pizza"}
                    />
                  </div>

                  <div className="px-4 sm:px-5 pt-3 pb-3 flex flex-col h-1/2 relative">
                    <h5 className="text-xl sm:text-xl lg:text-2xl font-semibold tracking-tight text-gray-900 mb-2">
                      {builder.pizzaName}
                    </h5>
                    <div className="space-y-1 mb-3">
                      <div className="text-base sm:text-base lg:text-lg">
                        <div className="mb-1">
                          <strong>Pizza Base:</strong> {baseNames || "-"}
                          {baseNames && sauceName
                            ? ", "
                            : baseNames && !sauceName
                            ? ""
                            : ""}
                          {sauceName || ""}
                        </div>
                        <div>
                          <strong>Toppings:</strong> {allToppings || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-0 w-full px-4 sm:px-5 flex items-center justify-between">
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        $ {Number(builder.pizzaPrice).toFixed(2)}
                      </span>

                      <button
                        onClick={() => handleAddToCart(builder)}
                        type="button"
                        className="font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 text-center shadow-lg hover:bg-gradient-to-br bg-gradient-to-t focus:ring-4 focus:outline-none cursor-pointer shadow-green-800/80 hover:text-black text-white from-green-950 via-green-500 to-green-600 focus:ring-green-800 transition-all duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Order;
