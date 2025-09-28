import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { builderGetMany } from "../redux/builderSlice";
import { addToCart } from "../redux/cartSlice";
import { LazyImage } from "../utils/perfComponents.jsx";
import { fetchOperatingStatus } from "../redux/operatingSlice";
import WaveText from "../components/WaveText.jsx";

const Order = () => {
  const dispatch = useDispatch();
  const { builders } = useSelector((state) => state.builder);
  const isOpen = useSelector((s) => s.operating.status?.isOpen);
  const [quantities, setQuantities] = useState({}); // per-card quantity map

  useEffect(() => {
    dispatch(builderGetMany());
    dispatch(fetchOperatingStatus());
  }, [dispatch]);

  // Memoized callback for adding to cart
  const handleAddToCart = useCallback(
    (builder, qty = 1) => {
      const count = Math.max(0, Math.min(99, Number(qty) || 0));
      for (let i = 0; i < count; i++) {
        dispatch(
          addToCart({
            ...builder,
            cartItemId: Date.now() + Math.random(),
          })
        );
      }
    },
    [dispatch]
  );

  const getQty = (key) => quantities[key] || 0;
  const inc = (key) =>
    setQuantities((q) => ({ ...q, [key]: Math.min(99, (q[key] || 0) + 1) }));
  const dec = (key) =>
    setQuantities((q) => ({ ...q, [key]: Math.max(0, (q[key] || 0) - 1) }));

  const fallbackImage = new URL("../assets/basePizza.jpg", import.meta.url)
    .href;

  return (
    <div className="relative min-h-screen">
      {/* Faded Logo Background */}
      <div
        className="fixed inset-0 bg-no-repeat bg-center opacity-15 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${
            new URL("../assets/pizzaLogoMain.png", import.meta.url).href
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header */}
        <h2 className="berkshireSwashFont mt-5 text-center text-3xl font-bold text-slate-800">
          Our Menu
        </h2>
        <h3 className="amitaFont mt-5 text-center text-2xl font-bold text-slate-800">
          {isOpen
            ? "Flavor is just one click away"
            : "We are not accepting orders right now"}
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
              <>
                {builders.map((builder, index) => {
                  // Defensive normalization to avoid rendering raw objects
                  const imageSrc =
                    builder?.image && typeof builder.image.data === "string"
                      ? builder.image.data
                      : fallbackImage;
                  const cardId = builder.id ?? builder._id ?? index;
                  const baseNames =
                    builder?.base && typeof builder.base === "object"
                      ? [
                          builder.base?.crust?.name,
                          ...(Array.isArray(builder.base?.cheeses)
                            ? builder.base.cheeses
                                .map((c) => c?.name)
                                .filter(Boolean)
                            : []),
                        ]
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
                  const herbNames = Array.isArray(builder?.herbs)
                    ? builder.herbs
                        .map((h) =>
                          typeof h === "string"
                            ? h
                            : h && typeof h === "object"
                            ? h.name
                            : null
                        )
                        .filter(Boolean)
                    : [];
                  const otherAdditionNames = Array.isArray(builder?.otherAdditions)
                    ? builder.otherAdditions
                        .map((o) =>
                          typeof o === "string"
                            ? o
                            : o && typeof o === "object"
                            ? o.name
                            : null
                        )
                        .filter(Boolean)
                    : [];
                  const allToppings = [
                    ...meatNames,
                    ...veggieNames,
                    ...herbNames,
                    ...otherAdditionNames,
                  ].join(", ");
                  return (
                    <div
                      key={builder.id || index}
                      className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] bg-gray-300 border border-gray-200 shadow-2xl shadow-red-700 rounded-lg flex flex-col overflow-hidden h-[30rem] sm:h-[32rem] lg:h-[34rem] relative"
                    >
                      {!isOpen && (
                        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] z-10 flex items-center justify-center">
                          <span className="text-white text-sm sm:text-base font-semibold bg-black/40 px-3 py-1 rounded-md ring-1 ring-white/30">
                            Ordering unavailable
                          </span>
                        </div>
                      )}
                      <div className="relative w-full h-48 sm:h-56 lg:h-60 xl:h-64">
                        <LazyImage
                          className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                          src={imageSrc}
                          fallbackSrc={fallbackImage}
                          alt={builder.pizzaName || "Pizza"}
                        />
                      </div>
                      <div className="flex flex-col flex-1 px-4 sm:px-5 pt-4 pb-5">
                        <h5
                          className={`font-semibold tracking-tight text-gray-900 mb-3 text-xl sm:text-2xl`}
                        >
                          {builder.pizzaName}
                        </h5>
                        <div className="space-y-2 mb-4 flex-1 min-h-[5rem] sm:min-h-[6rem]">
                          <div className={`text-sm sm:text-base leading-snug`}>
                            <div className="mb-2 break-words">
                              <strong>Pizza Base:</strong> {baseNames || "-"}
                              {baseNames && sauceName ? ", " : ""}
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
                          <div className="flex items-center gap-2">
                            <div className="inline-flex items-center bg-white/80 rounded-lg ring-1 ring-sky-300/30 shadow-sm">
                              <button
                                type="button"
                                onClick={() => dec(cardId)}
                                aria-label="Decrease quantity"
                                className="px-2 py-1 text-slate-700 hover:text-slate-900"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-semibold text-slate-800 select-none">
                                {getQty(cardId)}
                              </span>
                              <button
                                type="button"
                                onClick={() => inc(cardId)}
                                aria-label="Increase quantity"
                                className="px-2 py-1 text-slate-700 hover:text-slate-900"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                const qty = getQty(cardId);
                                if (qty > 0) {
                                  handleAddToCart(builder, qty);
                                  setQuantities((q) => ({ ...q, [cardId]: 0 }));
                                }
                              }}
                              type="button"
                              disabled={getQty(cardId) === 0 || !isOpen}
                              className="font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 text-center shadow-lg hover:bg-gradient-to-br bg-gradient-to-t focus:ring-4 focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-green-800/80 hover:text-black text-white from-green-950 via-green-500 to-green-600 focus:ring-green-800 transition-all duration-200"
                            >
                              {isOpen ? "Add" : "Closed"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Post-grid wave message */}
                <div className="w-full flex justify-center items-center py-6">
                  <WaveText
                    text="More coming soon"
                    className="berkshireSwashFont text-red-700 font-extrabold text-3xl sm:text-5xl"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
