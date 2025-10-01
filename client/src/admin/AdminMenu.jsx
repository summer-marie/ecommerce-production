import { useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { logger } from "../utils/logger";
import {
  builderGetMany,
  builderDeleteOneAlt,
  builderToggleStatus,
} from "../redux/builderSlice";
import {
  menuItemGetAll,
  menuItemDelete,
  menuItemUpdate,
} from "../redux/menuItemSlice";
import { useSelector, useDispatch } from "react-redux";
import AlertBlack from "../components/AlertBlack";

// TODO: Implement pagination or infinite scroll if the list grows large
// TODO: make buttons small like new ones but make them consistant colors
// TODO: need update page for menu items

const alertMsg = "Delete item from Menu";
const alertDescription =
  "This action cannot be undone. The item will be permanently removed from the customer menu.";

const AdminMenu = () => {
  const [showAlert, setShowAlert] = useState(false);
  const { builders } = useSelector((state) => state.builder);
  const { menuItems } = useSelector((state) => state.menuItem);
  const [togglingId, setTogglingId] = useState(null);
  const [togglingMenuItemId, setTogglingMenuItemId] = useState(null);
  // State to track the pizza being deleted
  const [alertPizza, setAlertPizza] = useState(null);
  // State to track the menu item being deleted
  const [alertMenuItem, setAlertMenuItem] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initial load
  useEffect(() => {
    dispatch(builderGetMany());
    dispatch(menuItemGetAll());
  }, [dispatch]);

  // No local mirror now; rely directly on redux updates (pattern like orders slice refreshes list atomically)

  // Helpers similar in spirit to AdminOpenOrders grouping helpers
  const getSeparatedBuilders = useCallback(() => {
    const list = Array.isArray(builders) ? builders : [];
    const active = list.filter((p) => p?.active === true);
    const inactive = list.filter((p) => p?.active === false);
    return { active, inactive };
  }, [builders]);

  const getSeparatedMenuItems = useCallback(() => {
    const list = Array.isArray(menuItems) ? menuItems : [];
    const active = list.filter((item) => item?.isAvailable === true);
    const inactive = list.filter((item) => item?.isAvailable === false);
    
    // Group active items by type
    const groupedActive = active.reduce((acc, item) => {
      const type = item.itemType || 'Other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
    
    return { groupedActive, inactive };
  }, [menuItems]);

  // Get organized data
  const { active, inactive } = getSeparatedBuilders();
  const { groupedActive: groupedMenuItems, inactive: inactiveMenuItems } = getSeparatedMenuItems();

  const handleDeleteClick = (builder) => {
    setAlertPizza(builder);
    setAlertMenuItem(null);
    setShowAlert(true);
  };

  const handleMenuItemDeleteClick = (menuItem) => {
    setAlertMenuItem(menuItem);
    setAlertPizza(null);
    setShowAlert(true);
  };

  const handleMenuItemToggleStatus = async (menuItem) => {
    const id = menuItem?.id || menuItem?._id;
    if (!id) return;
    
    setTogglingMenuItemId(id);
    try {
      await dispatch(menuItemUpdate({
        id,
        isAvailable: !menuItem.isAvailable,
        itemName: menuItem.itemName,
        itemType: menuItem.itemType,
        itemPrice: menuItem.itemPrice,
        description: menuItem.description,
        base: menuItem.base,
        sauce: menuItem.sauce,
        meatTopping: menuItem.meatTopping,
        veggieTopping: menuItem.veggieTopping,
        herbs: menuItem.herbs,
        otherAdditions: menuItem.otherAdditions,
        image: menuItem.image,
        isFeatured: menuItem.isFeatured,
        sortOrder: menuItem.sortOrder,
      })).unwrap();
    } catch (error) {
      logger.error("Failed to toggle menu item status", error);
    } finally {
      setTogglingMenuItemId(null);
    }
  };

  const handleConfirm = async () => {
    setShowAlert(false);
    
    if (alertPizza) {
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
    }
    
    if (alertMenuItem) {
      const id = alertMenuItem?.id || alertMenuItem?._id;
      if (!id) {
        logger.error("No menu item id set for deletion");
        return;
      }
      await dispatch(menuItemDelete(id)).unwrap();
      // Refresh the menu items list after deletion
      await dispatch(menuItemGetAll()).unwrap();
      setAlertMenuItem(null);
      logger.info("Menu item deleted", { id });
    }
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

        {/* Pizzas Section */}
        {active.length > 0 && (
          <div className="mb-10 mx-auto w-full px-6 py-2 sm:px-6 lg:max-w-7xl lg:px-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Pizzas
            </h3>
          <div className="drop-shadow-lg grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-4 mb-10 pb-12">
            {/* Active Pizza Cards */}
            {active.length === 0 ? (
              <p>No active pizzas found.</p>
            ) : (
              active.map((builder, index) => {
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
                const safeHerbs = Array.isArray(builder?.herbs)
                  ? builder.herbs
                      .map((h) => (typeof h === "string" ? h : h?.name))
                      .filter(Boolean)
                      .join(", ")
                  : "";
                const safeOtherAdditions = Array.isArray(builder?.otherAdditions)
                  ? builder.otherAdditions
                      .map((o) => (typeof o === "string" ? o : o?.name))
                      .filter(Boolean)
                      .join(", ")
                  : "";
                const combinedOther = [safeHerbs, safeOtherAdditions]
                  .filter(Boolean)
                  .join(", ");
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
                        <div>
                          <strong>Other:</strong>
                          <span className="ml-2">{combinedOther || "-"}</span>
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
            {/* End of pizza cards */}
          </div>
          </div>
        )}

        {/* Other Menu Items Sections */}
        {Object.entries(groupedMenuItems).map(([itemType, items]) => (
          <div key={itemType} className="mb-10 mx-auto w-full px-6 py-2 sm:px-6 lg:max-w-7xl lg:px-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {itemType}
            </h3>
            <div className="drop-shadow-lg grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-4 mb-10 pb-12">
              {items.map((menuItem, index) => {
                const imageSrc = menuItem?.image && typeof menuItem.image.data === "string"
                  ? menuItem.image.data
                  : new URL("../assets/basePizza.jpg", import.meta.url).href;
                
                return (
                  <div
                    key={menuItem?.id || menuItem?._id || index}
                    className="max-w-2xl col-1-4 rounded-lg shadow-2xl bg-zinc-300 border border-gray-200 shadow-green-600 relative flex flex-col"
                  >
                    <div className="relative">
                      <div className="relative w-full aspect-[4/3]">
                        <img
                          className="absolute inset-0 w-full h-full object-cover rounded-t-lg rounded-s-lg"
                          src={imageSrc}
                          alt={menuItem?.itemName || "Menu Item"}
                          onError={(e) => {
                            e.currentTarget.src = new URL(
                              "../assets/basePizza.jpg",
                              import.meta.url
                            ).href;
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const id = menuItem?.id || menuItem?._id;
                          if (id) handleMenuItemToggleStatus(menuItem);
                        }}
                        disabled={togglingMenuItemId === (menuItem?.id || menuItem?._id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm disabled:opacity-50"
                      >
                        {togglingMenuItemId === (menuItem?.id || menuItem?._id) 
                          ? "..." : "Deactivate"}
                      </button>
                      <button
                        onClick={() => handleMenuItemDeleteClick(menuItem)}
                        className="absolute top-2 left-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="flex flex-col flex-grow p-5">
                      <h2 className="font-bold text-xl text-gray-800 mb-2">
                        {menuItem?.itemName || "Unnamed Item"}
                      </h2>
                      {menuItem?.description && (
                        <p className="text-gray-600 mb-3 text-sm">
                          {menuItem.description}
                        </p>
                      )}
                      <div className="space-y-2 mb-4 text-sm">
                        {menuItem?.base && (
                          <div className="flex">
                            <strong>Base:</strong>
                            <span className="ml-2">
                              {(() => {
                                if (typeof menuItem.base === 'string') return menuItem.base;
                                const baseItems = [];
                                if (menuItem.base?.crust?.name) baseItems.push(menuItem.base.crust.name);
                                if (menuItem.base?.cheeses?.length > 0) {
                                  const cheeses = menuItem.base.cheeses.map(c => c?.name || c).filter(Boolean);
                                  baseItems.push(...cheeses);
                                }
                                return baseItems.length > 0 ? baseItems.join(', ') : '-';
                              })()}
                            </span>
                          </div>
                        )}
                        {menuItem?.sauce && (
                          <div className="flex">
                            <strong>Sauce:</strong>
                            <span className="ml-2">{typeof menuItem.sauce === 'string' ? menuItem.sauce : (menuItem.sauce?.name || JSON.stringify(menuItem.sauce))}</span>
                          </div>
                        )}
                        {(menuItem?.meatTopping?.length > 0 || menuItem?.veggieTopping?.length > 0) && (
                          <div className="flex">
                            <strong>Toppings:</strong>
                            <span className="ml-2">
                              {[
                                ...(menuItem.meatTopping?.map(item => typeof item === 'string' ? item : item?.name) || []),
                                ...(menuItem.veggieTopping?.map(item => typeof item === 'string' ? item : item?.name) || [])
                              ].filter(Boolean).join(", ") || "-"}
                            </span>
                          </div>
                        )}
                        {(menuItem?.herbs?.length > 0 || menuItem?.otherAdditions?.length > 0) && (
                          <div className="flex">
                            <strong>Other:</strong>
                            <span className="ml-2">
                              {[
                                ...(menuItem.herbs?.map(item => typeof item === 'string' ? item : item?.name) || []),
                                ...(menuItem.otherAdditions?.map(item => typeof item === 'string' ? item : item?.name) || [])
                              ].filter(Boolean).join(", ") || "-"}
                            </span>
                          </div>
                        )}
                      </div>
                      <h2 className="font-bold text-lg text-gray-700 mt-auto pt-2">
                        Price ${" "}
                        {menuItem?.itemPrice
                          ? Number(menuItem.itemPrice).toFixed(2)
                          : "0.00"}
                      </h2>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Deactivated Items Section */}
        {(inactive.length > 0 || inactiveMenuItems.length > 0) && (
          <div className="mb-10 mx-auto w-full px-6 py-2 sm:px-6 lg:max-w-7xl lg:px-8">
            <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700" />
            <h3 className="text-xl font-bold text-gray-600 mb-4">
              Deactivated Menu Items
            </h3>
            <div className="drop-shadow-lg grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-4 mb-10 pb-12 opacity-75">
              {/* Deactivated Pizzas */}
              {inactive.map((builder, index) => {
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
                const safeHerbs = Array.isArray(builder?.herbs)
                  ? builder.herbs
                      .map((h) => (typeof h === "string" ? h : h?.name))
                      .filter(Boolean)
                      .join(", ")
                  : "";
                const safeOtherAdditions = Array.isArray(builder?.otherAdditions)
                  ? builder.otherAdditions
                      .map((o) => (typeof o === "string" ? o : o?.name))
                      .filter(Boolean)
                      .join(", ")
                  : "";
                const combinedOther = [safeHerbs, safeOtherAdditions]
                  .filter(Boolean)
                  .join(", ");
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
                        <div>
                          <strong>Other:</strong>
                          <span className="ml-2">{combinedOther || "-"}</span>
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
              
              {/* Deactivated Menu Items */}
              {inactiveMenuItems.map((menuItem, index) => {
                const imageSrc = menuItem?.image && typeof menuItem.image.data === "string"
                  ? menuItem.image.data
                  : new URL("../assets/basePizza.jpg", import.meta.url).href;
                
                return (
                  <div
                    key={`inactive-${menuItem?.id || menuItem?._id || index}`}
                    className="max-w-2xl col-1-4 rounded-lg shadow-2xl bg-zinc-300 border border-gray-200 shadow-green-600 relative flex flex-col"
                  >
                    <div className="relative">
                      <div className="relative w-full aspect-[4/3]">
                        <img
                          className="absolute inset-0 w-full h-full object-cover rounded-t-lg rounded-s-lg"
                          src={imageSrc}
                          alt={menuItem?.itemName || "Menu Item"}
                          onError={(e) => {
                            e.currentTarget.src = new URL(
                              "../assets/basePizza.jpg",
                              import.meta.url
                            ).href;
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const id = menuItem?.id || menuItem?._id;
                          if (id) handleMenuItemToggleStatus(menuItem);
                        }}
                        disabled={togglingMenuItemId === (menuItem?.id || menuItem?._id)}
                        className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-sm disabled:opacity-50"
                      >
                        {togglingMenuItemId === (menuItem?.id || menuItem?._id) 
                          ? "..." : "Activate"}
                      </button>
                      <button
                        onClick={() => handleMenuItemDeleteClick(menuItem)}
                        className="absolute top-2 left-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="flex flex-col flex-grow p-5">
                      <h2 className="font-bold text-xl text-gray-800 mb-2">
                        {menuItem?.itemName || "Unnamed Item"}
                      </h2>
                      <p className="text-gray-500 text-sm mb-2">Type: {menuItem?.itemType || "Unknown"}</p>
                      {menuItem?.description && (
                        <p className="text-gray-600 mb-3 text-sm">
                          {menuItem.description}
                        </p>
                      )}
                      <h2 className="font-bold text-lg text-gray-700 mt-auto pt-2">
                        Price ${" "}
                        {menuItem?.itemPrice
                          ? Number(menuItem.itemPrice).toFixed(2)
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
