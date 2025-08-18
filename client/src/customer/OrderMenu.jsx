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
              const longText = (allToppings && allToppings.length > 45) || (builder.pizzaName && builder.pizzaName.length > 24);
              return (
                <div
                  key={builder.id || index}
                  className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] bg-gray-300 border border-gray-200 shadow-2xl shadow-red-700 rounded-lg flex flex-col overflow-hidden"
                >
                  <div className="relative w-full h-40 sm:h-44 lg:h-48">
                    <LazyImage
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                      src={imageSrc}
                      fallbackSrc={fallbackImage}
                      alt={builder.pizzaName || "Pizza"}
                    />
                  </div>
                  <div className="flex flex-col flex-1 px-4 sm:px-5 pt-4 pb-5">
                    <h5 className={`font-semibold tracking-tight text-gray-900 mb-3 ${longText ? 'text-xl sm:text-xl' : 'text-2xl sm:text-2xl'}`}>
                      {builder.pizzaName}
                    </h5>
                    <div className="space-y-2 mb-4 flex-1 min-h-0">
                      <div className={`${longText ? 'text-sm sm:text-sm' : 'text-base sm:text-lg'} leading-snug`}> 
                        <div className="mb-2 break-words">
                          <strong>Pizza Base:</strong> {baseNames || "-"}
                          {baseNames && sauceName ? ", " : ''}
                          {sauceName || ""}
                        </div>
                        <div className="break-words">
                          <strong>Toppings:</strong> {allToppings || "-"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <span className="text-xl sm:text-2xl font-bold text-gray-900 shrink-0">
                        $ {Number(builder.pizzaPrice).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(builder)}
                        type="button"
                        className="font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 text-center shadow-lg hover:bg-gradient-to-br bg-gradient-to-t focus:ring-4 focus:outline-none cursor-pointer shadow-green-800/80 hover:text-black text-white from-green-950 via-green-500 to-green-600 focus:ring-green-800 transition-all duration-200 max-w-[60%]"
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
