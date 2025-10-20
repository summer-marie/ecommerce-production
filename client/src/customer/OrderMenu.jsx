import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { builderGetMany } from "../redux/builderSlice";
import { menuItemGetAll } from "../redux/menuItemSlice";
import { addToCart } from "../redux/cartSlice";
import { LazyImage } from "../utils/perfComponents.jsx";
import { fetchOperatingStatus } from "../redux/operatingSlice";
import WaveText from "../components/WaveText.jsx";
// Removed all icon imports
const MenuItemCard = ({
  menuItem,
  imageSrc,
  fallbackImage,
  ingredients,
  isOpen,
  quantity,
  onIncrement,
  onDecrement,
  onAdd,
}) => {
  return (
    <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] bg-gray-300 border border-gray-200 shadow-2xl shadow-purple-700 rounded-lg flex flex-col overflow-hidden h-[30rem] sm:h-[32rem] lg:h-[34rem] relative">
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
          alt={menuItem.itemName || "Menu Item"}
        />
      </div>
      <div className="flex flex-col flex-1 px-4 sm:px-5 pt-4 pb-5">
        <h5 className="font-semibold tracking-tight text-gray-900 mb-3 text-xl sm:text-2xl">
          {menuItem.itemName}
        </h5>
        <div className="space-y-2 mb-4 flex-1 min-h-[5rem] sm:min-h-[6rem]">
          <div className="text-sm sm:text-base leading-snug">
            <div className="break-words">{ingredients}</div>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-xl sm:text-2xl font-bold text-gray-900 shrink-0">
            $ {Number(menuItem.itemPrice).toFixed(2)}
          </span>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center bg-white/80 rounded-lg ring-1 ring-sky-300/30 shadow-sm">
              <button
                type="button"
                onClick={onDecrement}
                aria-label="Decrease quantity"
                className="px-2 py-1 text-slate-700 hover:text-slate-900"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold text-slate-800 select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onIncrement}
                aria-label="Increase quantity"
                className="px-2 py-1 text-slate-700 hover:text-slate-900"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                if (quantity > 0) {
                  onAdd(quantity);
                }
              }}
              type="button"
              disabled={quantity === 0 || !isOpen}
              className="font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 text-center shadow-lg hover:bg-gradient-to-br bg-gradient-to-t focus:ring-4 focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-purple-800/80 hover:text-black text-white from-purple-950 via-purple-500 to-purple-600 focus:ring-purple-800 transition-all duration-200"
            >
              {isOpen ? "Add" : "Closed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderMenu = () => {
  const dispatch = useDispatch();
  const { builders } = useSelector((state) => state.builder);
  const { menuItems } = useSelector((state) => state.menuItem);
  const isOpen = useSelector((s) => s.operating.status?.isOpen);
  const [quantities, setQuantities] = useState({}); // per-card quantity map

  useEffect(() => {
    dispatch(builderGetMany());
    dispatch(menuItemGetAll());
    dispatch(fetchOperatingStatus());
  }, [dispatch]);

  // Helper function to organize menu items by type
  const getOrganizedMenuItems = useCallback(() => {
    if (!Array.isArray(menuItems)) return {};

    const active = menuItems.filter((item) => item.isAvailable);
    const organized = {};

    active.forEach((item) => {
      if (!organized[item.itemType]) {
        organized[item.itemType] = [];
      }
      organized[item.itemType].push(item);
    });

    // Sort each category by sortOrder, then by name
    Object.keys(organized).forEach((type) => {
      organized[type].sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return (a.sortOrder || 999) - (b.sortOrder || 999);
        }
        return (a.itemName || "").localeCompare(b.itemName || "");
      });
    });

    return organized;
  }, [menuItems]);

  const organizedMenuItems = getOrganizedMenuItems();
  const hasActiveMenuItems = Object.keys(organizedMenuItems).length > 0;
  
  // Filter builders to only show active ones (status filtering)
  const activePizzas = Array.isArray(builders) ? builders.filter(builder => builder.active === true) : [];
  const hasActivePizzas = activePizzas.length > 0;

  // Helper to format section headings from itemType (adds 's' if not already plural)
  const formatTypeLabel = useCallback((t) => {
    const x = (t || "").trim();
    return x.endsWith("s") ? x : `${x}s`;
  }, []);

  // Enhanced callback for adding to cart (handles both pizzas and menu items)
  const handleAddToCart = useCallback(
    (item, qty = 1, itemType = "pizza") => {
      const count = Math.max(0, Math.min(99, Number(qty) || 0));
      for (let i = 0; i < count; i++) {
        if (itemType === "menuItem") {
          dispatch(
            addToCart({
              ...item,
              cartItemId: Date.now() + Math.random(),
              type: "menuItem",
              pizzaName: item.itemName, // Map to pizzaName for cart compatibility
              pizzaPrice: item.itemPrice, // Map to pizzaPrice for cart compatibility
            })
          );
        } else {
          dispatch(
            addToCart({
              ...item,
              cartItemId: Date.now() + Math.random(),
              type: "pizza",
            })
          );
        }
      }
    },
    [dispatch]
  );

  // Helper function to render menu item ingredients
  const getMenuItemIngredients = (menuItem) => {
    const ingredients = [];

    // Add crust if available
    if (menuItem.crust) {
      ingredients.push(
        typeof menuItem.crust === "string"
          ? menuItem.crust
          : menuItem.crust?.name
      );
    }

    // Add sauce if available
    if (menuItem.sauce) {
      ingredients.push(
        typeof menuItem.sauce === "string"
          ? menuItem.sauce
          : menuItem.sauce?.name
      );
    }

    // Add toppings
    const toppings = [];
    ["meatTopping", "veggieTopping", "herbs", "otherAdditions"].forEach(
      (key) => {
        if (Array.isArray(menuItem[key])) {
          menuItem[key].forEach((item) => {
            const name = typeof item === "string" ? item : item?.name;
            if (name) toppings.push(name);
          });
        }
      }
    );

    if (toppings.length > 0) {
      ingredients.push(`Toppings: ${toppings.join(", ")}`);
    }

    return (
      ingredients.filter(Boolean).join(" | ") ||
      menuItem.description ||
      "Delicious menu item"
    );
  };

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
            {/* Loading State */}
            {!hasActivePizzas && !hasActiveMenuItems && (
              <div className="w-full text-center py-12">
                <div className="animate-pulse">
                  <div className="text-gray-500 text-lg">
                    Loading delicious menu items...
                  </div>
                </div>
              </div>
            )}

            {/* Pizzas Section */}
            {hasActivePizzas && (
              <div className="w-full flex flex-col md:flex-row md:items-stretch md:gap-6">
                {/* Vertical header (md+) and horizontal fallback (sm) */}
                <div className="w-full md:w-auto md:flex md:flex-col md:items-center md:justify-center mb-4 md:mb-0">
                  <div className="md:hidden text-center">
                    <h3 className="berkshireSwashFont text-2xl sm:text-3xl font-bold text-red-700 mb-2">
                      Pizzas
                    </h3>
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto w-32"></div>
                  </div>
                  <div className="hidden md:flex flex-col items-center">
                    <span className="berkshireSwashFont text-3xl font-bold text-red-700 [writing-mode:vertical-rl] [text-orientation:upright] tracking-wider">
                      Pizzas
                    </span>
                    <span className="mt-4 mb-2 h-24 w-1 rounded-full bg-gradient-to-b from-transparent via-red-400 to-transparent"></span>
                  </div>
                </div>

                {/* Pizza Cards */}
                <div className="flex flex-wrap justify-center items-start gap-4 sm:gap-6 flex-1">
                  {activePizzas.map((builder, index) => {
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
                    const otherAdditionNames = Array.isArray(
                      builder?.otherAdditions
                    )
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
                          <h5 className="font-semibold tracking-tight text-gray-900 mb-3 text-xl sm:text-2xl">
                            {builder.pizzaName}
                          </h5>
                          <div className="space-y-2 mb-4 flex-1 min-h-[5rem] sm:min-h-[6rem]">
                            <div className="text-sm sm:text-base leading-snug">
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
                                    handleAddToCart(builder, qty, "pizza");
                                    setQuantities((q) => ({
                                      ...q,
                                      [cardId]: 0,
                                    }));
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
                </div>
              </div>
            )}

            {/* Other Menu Items Sections */}
            {hasActiveMenuItems &&
              Object.entries(organizedMenuItems).map(([itemType, items]) => {
                return (
                  <div
                    key={itemType}
                    className={`w-full flex flex-col md:flex-row md:items-stretch md:gap-6 ${
                      hasActivePizzas ? "mt-12" : ""
                    }`}
                  >
                    <div className="w-full md:w-auto md:flex md:flex-col md:items-center md:justify-center mb-4 md:mb-0">
                      <div className="md:hidden text-center">
                        <h3 className="berkshireSwashFont text-2xl sm:text-3xl font-bold text-purple-700 mb-2">
                          {formatTypeLabel(itemType)}
                        </h3>
                        <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto w-32"></div>
                      </div>
                      <div className="hidden md:flex flex-col items-center">
                        <span className="berkshireSwashFont text-3xl font-bold text-purple-700 [writing-mode:vertical-rl] [text-orientation:upright] tracking-wider">
                          {formatTypeLabel(itemType)}
                        </span>
                        <span className="mt-4 mb-2 h-24 w-1 rounded-full bg-gradient-to-b from-transparent via-purple-400 to-transparent"></span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center items-start gap-4 sm:gap-6 flex-1">
                      {items.map((menuItem, index) => {
                        const cardId = menuItem.id ?? index;
                        const imageSrc =
                          menuItem?.image &&
                          typeof menuItem.image.data === "string"
                            ? menuItem.image.data
                            : fallbackImage;
                        const ingredients = getMenuItemIngredients(menuItem);
                        const quantity = getQty(cardId);

                        return (
                          <MenuItemCard
                            key={menuItem.id || index}
                            menuItem={menuItem}
                            imageSrc={imageSrc}
                            fallbackImage={fallbackImage}
                            ingredients={ingredients}
                            isOpen={isOpen}
                            quantity={quantity}
                            onIncrement={() => inc(cardId)}
                            onDecrement={() => dec(cardId)}
                            onAdd={(qty) => {
                              handleAddToCart(menuItem, qty, "menuItem");
                              setQuantities((q) => ({ ...q, [cardId]: 0 }));
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            {/* Post-grid wave message - only show if we have any content */}
            {(hasActivePizzas || hasActiveMenuItems) && (
              <div className="w-full flex justify-center items-center py-6 mt-8">
                <WaveText
                  text="More coming soon"
                  className="berkshireSwashFont text-red-700 font-extrabold text-3xl sm:text-5xl"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderMenu;
