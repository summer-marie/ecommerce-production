import { useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { logger } from "../utils/logger";
import {
  builderGetMany,
  builderDeleteOneAlt,
  builderToggleStatus,
} from "../redux/builderSlice";
import { useSelector, useDispatch } from "react-redux";
import AlertBlack from "../components/AlertBlack";

const alertMsg = "Delete Pizza from Menu";
const alertDescription =
  "This action cannot be undone. The pizza will be permanently removed from the customer menu.";

const AdminMenu = () => {
  const [showAlert, setShowAlert] = useState(false);
  const { builders } = useSelector((state) => state.builder);
  const [togglingId, setTogglingId] = useState(null);
  // State to track the pizza being deleted
  const [alertPizza, setAlertPizza] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initial load
  useEffect(() => {
    dispatch(builderGetMany());
  }, [dispatch]);

  // No local mirror now; rely directly on redux updates (pattern like orders slice refreshes list atomically)

  // Helpers similar in spirit to AdminOpenOrders grouping helpers
  const getSeparatedBuilders = useCallback(() => {
    const list = Array.isArray(builders) ? builders : [];
    const active = list.filter((p) => p?.active === true);
    const inactive = list.filter((p) => p?.active === false);
    return { active, inactive };
  }, [builders]);

  const handleDeleteClick = (builder) => {
    setAlertPizza(builder);
    setShowAlert(true);
  };

  const handleConfirm = async () => {
    setShowAlert(false);
    const id = alertPizza?.id;
    if (!id) {
      logger.error("No pizza id set for deletion");
      return;
    }
    await dispatch(builderDeleteOneAlt(id)).unwrap();
    // Refresh the builders list after deletion
    await dispatch(builderGetMany()).unwrap();
    setAlertPizza(null);
    logger.info("Pizza deleted", { id });
  };

  const handleCancel = () => {
    setShowAlert(false);
    setAlertPizza(null);
  };

  const handleClick = (id) => {
    // Navigate to the EditPizza page with the selected pizza ID
    navigate(`/admin-update-one/${id}`);
  };

  const handleToggleStatus = async (pizza) => {
    if (!pizza) return;
    const id = pizza.id || pizza._id;
    if (!id) return;
    const newActiveStatus = !pizza.active;
    setTogglingId(id);
    try {
      await dispatch(
        builderToggleStatus({ id, active: newActiveStatus })
      ).unwrap();
    } catch (err) {
      logger.error("Toggle failed", err);
    } finally {
      setTogglingId(null);
    }
  };

  // Pass the pizza name dynamically to the alert
  const dynamicAlertMsg = alertPizza ? (
    <>
      Are you sure you want to delete{" "}
      <span className="text-red-500 italic p-2">{alertPizza.pizzaName}</span>?
    </>
  ) : (
    alertMsg
  );

  // Separate using helper (mirroring grouping pattern of AdminOpenOrders)
  const { active: activePizzas, inactive: inactivePizzas } =
    getSeparatedBuilders();

  return (
    <>
      <div className="px-4">
        {/* Header  */}
        <h2 className="berkshireSwashFont mt-5 text-center text-2xl font-bold text-slate-800">
          Current Customer Menu
        </h2>
        <p className="text-center text-lg text-gray-600 pt-2">
          * Modify the customer menu here. Updates and deletions are immediately
          applied to the database.
        </p>
        <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700 " />

        {/* Active Pizzas Section */}
        <div className="mb-10 mx-auto w-full px-6 py-2 sm:px-6 lg:max-w-7xl lg:px-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Active Menu Items
          </h3>
          <div className="drop-shadow-lg grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-4 mb-10 pb-12">
            {/* Active Cards */}
            {activePizzas.length === 0 ? (
              <p>No active pizzas found.</p>
            ) : (
              activePizzas.map((builder, index) => {
                // Defensive normalizations to avoid rendering raw objects
                const safeBase =
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
                const safeSauce = builder?.sauce
                  ? typeof builder.sauce === "string"
                    ? builder.sauce
                    : builder.sauce.name || ""
                  : "";
                const safeMeats = Array.isArray(builder?.meatTopping)
                  ? builder.meatTopping
                      .map((m) => (typeof m === "string" ? m : m?.name))
                      .filter(Boolean)
                      .join(", ")
                  : "";
                const safeVeggies = Array.isArray(builder?.veggieTopping)
                  ? builder.veggieTopping
                      .map((v) => (typeof v === "string" ? v : v?.name))
                      .filter(Boolean)
                      .join(", ")
                  : "";
                const imageSrc =
                  builder?.image && typeof builder.image.data === "string"
                    ? builder.image.data
                    : new URL("../assets/basePizza.jpg", import.meta.url).href;
                return (
                  // Card
                  <div
                    key={builder?.id || index}
                    className="max-w-2xl col-1-4 rounded-lg shadow-2xl bg-zinc-300 border border-gray-200 shadow-green-600 relative flex flex-col"
                  >
                    <div className="relative">
                      <div className="relative w-full aspect-[4/3]">
                        <img
                          className="absolute inset-0 w-full h-full object-cover rounded-t-lg rounded-s-lg"
                          src={imageSrc}
                          alt={builder?.pizzaName || "Pizza"}
                          onError={(e) => {
                            e.currentTarget.src = new URL(
                              "../assets/basePizza.jpg",
                              import.meta.url
                            ).href;
                          }}
                        />
                      </div>
                      <button
                        onClick={() => builder?.id && handleClick(builder.id)}
                        type="button"
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 font-medium rounded-lg shadow-lg text-xs px-2 py-1 sm:text-sm sm:px-5 sm:py-2.5 text-center hover:bg-gradient-to-br bg-gradient-to-t focus:ring-4 focus:outline-none cursor-pointer whitespace-nowrap transform origin-top-right transition-transform sm:scale-100 max-[640px]:scale-90 max-[420px]:scale-75
                          shadow-green-800/80 
                          text-white 
                          from-green-950
                          via-green-500 
                          to-green-600
                          focus:ring-green-800"
                      >
                        Update Pizza
                      </button>
                      {/* Deactivate now positioned at top-left */}
                      <button
                        onClick={() => handleToggleStatus(builder)}
                        type="button"
                        disabled={togglingId === (builder.id || builder._id)}
                        className={`absolute z-10 top-1 left-1 sm:top-2 sm:left-2 font-medium rounded-lg shadow-lg text-xs px-2 py-1 sm:text-sm sm:px-5 sm:py-2.5 text-center bg-gradient-to-t focus:ring-4 focus:outline-none whitespace-nowrap transform origin-top-left transition-all sm:scale-100 max-[640px]:scale-90 max-[420px]:scale-75
                            shadow-orange-800/80 text-white from-orange-950 via-orange-500 to-orange-600 focus:ring-orange-800
                            ${
                              togglingId === (builder.id || builder._id)
                                ? "opacity-60 cursor-not-allowed"
                                : "hover:bg-gradient-to-br cursor-pointer"
                            }`}
                      >
                        {togglingId === (builder.id || builder._id)
                          ? "Updating..."
                          : "Deactivate"}
                      </button>
                      {/* Delete moved to bottom-left */}
                      <button
                        onClick={() => handleDeleteClick(builder)}
                        type="button"
                        className="absolute z-10 bottom-1 left-1 sm:bottom-2 sm:left-2 font-medium rounded-lg shadow-lg text-xs px-2 py-1 sm:text-sm sm:px-5 sm:py-2.5 text-center hover:bg-gradient-to-br bg-gradient-to-t focus:ring-4 focus:outline-none cursor-pointer whitespace-nowrap transform origin-bottom-left transition-transform sm:scale-100 max-[640px]:scale-90 max-[420px]:scale-75
                            shadow-red-800/80 
                            text-white 
                            from-black
                            via-red-500 
                            to-red-600
                            focus:ring-red-800"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <p className="text-gray-900">
                        <strong>Name: {builder?.pizzaName || "Unnamed"}</strong>
                      </p>

                      <div className="space-y-1">
                        <div>
                          <strong>Pizza Base:</strong>
                          <span className="ml-2">{safeBase || "-"}</span>
                        </div>
                        <div>
                          <strong>Sauce:</strong>
                          <span className="ml-2">{safeSauce || "-"}</span>
                        </div>
                        <div>
                          <strong>Meats:</strong>
                          <span className="ml-2">{safeMeats || "-"}</span>
                        </div>
                        <div>
                          <strong>Veggies:</strong>
                          <span className="ml-2">{safeVeggies || "-"}</span>
                        </div>
                      </div>

                      <h2 className="font-bold text-lg text-gray-900 mt-auto pt-2">
                        Price ${" "}
                        {builder?.pizzaPrice
                          ? Number(builder.pizzaPrice).toFixed(2)
                          : "0.00"}
                      </h2>
                    </div>
                  </div>
                );
              })
            )}
            {/* End of card */}
          </div>
        </div>

        {/* Deactivated Pizzas Section */}
        {inactivePizzas.length > 0 && (
          <div className="mb-10 mx-auto w-full px-6 py-2 sm:px-6 lg:max-w-7xl lg:px-8">
            <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700" />
            <h3 className="text-xl font-bold text-gray-600 mb-4">
              Deactivated Pizzas
            </h3>
            <div className="drop-shadow-lg grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-4 mb-10 pb-12 opacity-75">
              {inactivePizzas.map((builder, index) => {
                // Same normalization logic as active pizzas
                const safeBase =
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
                const safeSauce = builder?.sauce
                  ? typeof builder.sauce === "string"
                    ? builder.sauce
                    : builder.sauce.name || ""
                  : "";
                const safeMeats = Array.isArray(builder?.meatTopping)
                  ? builder.meatTopping
                      .map((m) => (typeof m === "string" ? m : m?.name))
                      .filter(Boolean)
                      .join(", ")
                  : "";
                const safeVeggies = Array.isArray(builder?.veggieTopping)
                  ? builder.veggieTopping
                      .map((v) => (typeof v === "string" ? v : v?.name))
                      .filter(Boolean)
                      .join(", ")
                  : "";
                const imageSrc =
                  builder?.image && typeof builder.image.data === "string"
                    ? builder.image.data
                    : new URL("../assets/basePizza.jpg", import.meta.url).href;

                return (
                  <div
                    key={builder?.id || index}
                    className="max-w-2xl col-1-4 rounded-lg shadow-2xl bg-gray-200 border border-gray-300 shadow-gray-400 relative flex flex-col"
                  >
                    <div className="relative">
                      <div className="relative w-full aspect-[4/3]">
                        <img
                          className="absolute inset-0 w-full h-full object-cover rounded-t-lg rounded-s-lg grayscale"
                          src={imageSrc}
                          alt={builder?.pizzaName || "Pizza"}
                          onError={(e) => {
                            e.currentTarget.src = new URL(
                              "../assets/basePizza.jpg",
                              import.meta.url
                            ).href;
                          }}
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteClick(builder)}
                        type="button"
                        className="absolute z-10 top-1 left-1 sm:top-2 sm:left-2 font-medium rounded-lg shadow-lg text-xs px-2 py-1 sm:text-sm sm:px-5 sm:py-2.5 text-center hover:bg-gradient-to-br bg-gradient-to-t focus:ring-4 focus:outline-none cursor-pointer whitespace-nowrap transform origin-top-left transition-transform sm:scale-100 max-[640px]:scale-90 max-[420px]:scale-75
                          shadow-red-800/80 
                          text-white 
                          from-black
                          via-red-500 
                          to-red-600
                          focus:ring-red-800"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleToggleStatus(builder)}
                        type="button"
                        disabled={togglingId === (builder.id || builder._id)}
                        className={`absolute z-10 top-1 right-1 sm:top-2 sm:right-2 font-medium rounded-lg shadow-lg text-xs px-2 py-1 sm:text-sm sm:px-5 sm:py-2.5 text-center bg-gradient-to-t focus:ring-4 focus:outline-none whitespace-nowrap transform origin-top-right transition-transform sm:scale-100 max-[640px]:scale-90 max-[420px]:scale-75
                          shadow-blue-800/80 text-white from-blue-950 via-blue-500 to-blue-600 focus:ring-blue-800
                          ${
                            togglingId === (builder.id || builder._id)
                              ? "opacity-60 cursor-not-allowed"
                              : "hover:bg-gradient-to-br cursor-pointer"
                          }`}
                      >
                        {togglingId === (builder.id || builder._id)
                          ? "Updating..."
                          : "Activate"}
                      </button>
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <p className="text-gray-700">
                        <strong>Name: {builder?.pizzaName || "Unnamed"}</strong>
                        <span className="ml-2 text-xs bg-gray-500 text-white px-2 py-1 rounded">
                          DRAFT
                        </span>
                      </p>
                      <div className="space-y-1 text-gray-600">
                        <div>
                          <strong>Pizza Base:</strong>
                          <span className="ml-2">{safeBase || "-"}</span>
                        </div>
                        <div>
                          <strong>Sauce:</strong>
                          <span className="ml-2">{safeSauce || "-"}</span>
                        </div>
                        <div>
                          <strong>Meats:</strong>
                          <span className="ml-2">{safeMeats || "-"}</span>
                        </div>
                        <div>
                          <strong>Veggies:</strong>
                          <span className="ml-2">{safeVeggies || "-"}</span>
                        </div>
                      </div>
                      <h2 className="font-bold text-lg text-gray-700 mt-auto pt-2">
                        Price ${" "}
                        {builder?.pizzaPrice
                          ? Number(builder.pizzaPrice).toFixed(2)
                          : "0.00"}
                      </h2>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showAlert && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <AlertBlack
            alertMsg={dynamicAlertMsg}
            alertDescription={alertDescription}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
          />
        </div>
      )}
    </>
  );
};

export default AdminMenu;
