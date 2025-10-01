import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import AlertSuccess2 from "../components/AlertSuccess2";
import ToppingGroup from "./components/ToppingGroup";
import CheeseGroup from "./components/CheeseGroup";
import { menuItemCreate } from "../redux/menuItemSlice";
import { ingredientGetAll } from "../redux/ingredientSlice";
import { convertImageToBase64, compressImage } from "../utils/imageUtils";

const successMsg = "Menu item was created successfully!!";
const successDescription = "navigating you to the admin menu....";

// Menu item types
const MENU_ITEM_TYPES = [
  "Calzone", 
  "Pizza Sticks",
  "Appetizer",
  "Side",
  "Dessert", 
  "Beverage",
  "Other"
];

// Reusable base ingredient display component
const BaseIngredientDisplay = ({ value }) => (
  <div
    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light cursor-not-allowed
    text-black 
    placeholder-gray-500 
    border-slate-500
    bg-gray-400 
    focus:bg-sky-200 
    focus:border-sky-700"
  >
    {value}
  </div>
);

// Neutral styled dropdown (matches sauce select styles)
const BaseDropdown = ({ id, label, value, onChange, options, placeholder }) => (
  <div className="mb-5">
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-gray-900"
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2
        text-black 
        placeholder-gray-500 
        border-slate-500
        bg-gray-200 
        focus:bg-gray-300 
        focus:ring-white
        focus:border-sky-500"
    >
      <option value="">{placeholder || "- - Select - -"}</option>
      {options.map((opt) => (
        <option key={opt.id || opt._id || opt.name} value={opt.name}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

const AdminMenuItemCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredient.ingredients);
  const [newMenuItem, setNewMenuItem] = useState({
    itemName: "",
    itemType: "Calzone", // default type
    itemPrice: "", // manual entry by admin
    description: "",
    crust: "Brick Oven Crust",
    cheeses: ["", "", ""], // up to 3 cheeses
    cheeseAmounts: ["1", "1", "1"], // default Regular amounts
    sauce: "Signature Red Sauce",
    meatTopping: ["", "", "", "", "", ""], // 6 meat slots
    veggieTopping: ["", "", "", "", "", ""], // 6 veggie slots
    herbs: ["", "", ""], // up to 3 herb slots
    otherAdditions: ["", "", ""], // up to 3 other addition slots
    image: null, // Base64 preview payload (data without header)
    imageFile: null, // Raw File for compression/conversion
    isAvailable: true,
    isFeatured: false,
    sortOrder: 0,
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const meatOptions = ingredients.filter((i) => i.itemType === "Meat Topping");
  const veggieOptions = ingredients.filter(
    (i) => i.itemType === "Veggie Topping"
  );
  const sauceOptions = ingredients.filter((i) => i.itemType === "Sauce");
  const baseOptions = ingredients.filter((i) => i.itemType === "Base");
  const herbOptions = ingredients.filter((i) => i.itemType === "Herbs");
  const otherAdditionsOptions = ingredients.filter(
    (i) => i.itemType === "Other"
  );
  // Split base into crust vs cheese options using a simple heuristic
  const crustOptions = baseOptions.filter((i) => /crust/i.test(i?.name || ""));
  const cheeseOptionsOnly = baseOptions.filter(
    (i) => !/crust/i.test(i?.name || "")
  );

  useEffect(() => {
    dispatch(ingredientGetAll());
  }, [dispatch]);

  // Ensure default crust is valid once ingredients are loaded
  useEffect(() => {
    // Build crust options from current ingredients
    const baseOptions = ingredients.filter((i) => i.itemType === "Base");
    const crustOptions = baseOptions.filter((i) =>
      /crust/i.test(i?.name || "")
    );
    if (!crustOptions.length) return;

    setNewMenuItem((prev) => {
      const hasCurrent = crustOptions.some((c) => c?.name === prev.crust);
      if (hasCurrent) return prev;
      const preferred = crustOptions.find((c) =>
        /brick\s*oven\s*crust/i.test(c?.name || "")
      );
      const next = preferred || crustOptions[0];
      return next?.name ? { ...prev, crust: next.name } : prev;
    });
  }, [ingredients]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMenuItem({
          ...newMenuItem,
          image: {
            data: reader.result.split(",")[1],
            name: file.name,
            type: file.type,
          },
          imageFile: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // keep digits only
    if (input.length === 0) {
      setNewMenuItem({ ...newMenuItem, itemPrice: "" });
      return;
    }
    while (input.length < 3) input = "0" + input; // ensure at least 3 digits
    const dollars = input.slice(0, -2);
    const cents = input.slice(-2);
    const formatted = `${parseInt(dollars, 10)}.${cents}`;
    setNewMenuItem({ ...newMenuItem, itemPrice: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setShowSuccessAlert(true);

      // Build sauce object first and validate if required
      let sauceObj = null;
      if (newMenuItem.sauce) {
        sauceObj = sauceOptions.find((s) => s.name === newMenuItem.sauce);
      }
      
      // Build base object
      const baseObj = {};
      
      // Add crust if selected and item type could use it
      const crustObj = crustOptions.find((c) => c.name === newMenuItem.crust);
      if (crustObj && ["Calzone", "Pizza Sticks"].includes(newMenuItem.itemType)) {
        baseObj.crust = crustObj;
      }
      
      // Add cheeses if selected
      const selectedCheeses = newMenuItem.cheeses
        .map((ch, i) => {
          if (!ch) return null;
          const baseCheese = cheeseOptionsOnly.find((o) => o.name === ch);
          if (!baseCheese) return null;
          const amt = parseFloat(newMenuItem.cheeseAmounts[i] || "1");
          return { ...baseCheese, amount: Number.isFinite(amt) ? amt : 1 };
        })
        .filter(Boolean);
      
      if (selectedCheeses.length > 0) {
        baseObj.cheeses = selectedCheeses;
      }

      // Build toppings
      const meatToppingObjs = newMenuItem.meatTopping
        .filter(Boolean)
        .map((meat) => {
          const found = meatOptions.find((opt) => opt.name === meat);
          return found ? { ...found, amount: 1 } : null;
        })
        .filter(Boolean);

      const veggieToppingObjs = newMenuItem.veggieTopping
        .filter(Boolean)
        .map((veg) => {
          const found = veggieOptions.find((opt) => opt.name === veg);
          return found ? { ...found, amount: 1 } : null;
        })
        .filter(Boolean);

      const herbObjs = newMenuItem.herbs
        .filter(Boolean)
        .map((herb) => {
          const found = herbOptions.find((opt) => opt.name === herb);
          return found ? { ...found, amount: 1 } : null;
        })
        .filter(Boolean);

      const otherAdditionObjs = newMenuItem.otherAdditions
        .filter(Boolean)
        .map((add) => {
          const found = otherAdditionsOptions.find((opt) => opt.name === add);
          return found ? { ...found, amount: 1 } : null;
        })
        .filter(Boolean);

      // Convert image to Base64 if selected
      let imageData = null;
      if (newMenuItem.imageFile) {
        console.log("Converting image to Base64...");
        try {
          // Optionally compress the image first
          const compressedFile = await compressImage(
            newMenuItem.imageFile,
            0.8,
            800
          );
          imageData = await convertImageToBase64(compressedFile);
          console.log("Image converted to Base64:", {
            filename: imageData.filename,
            size: `${(imageData.size / 1024).toFixed(2)} KB`,
            type: imageData.mimetype,
          });
        } catch (error) {
          console.error("Error converting image:", error);
          alert("Error processing image: " + error.message);
          setShowSuccessAlert(false);
          return;
        }
      }

      // Validate crust if it's required for this item type
      if (["Calzone", "Pizza Sticks"].includes(newMenuItem.itemType)) {
        const crustObj = crustOptions.find((c) => c.name === newMenuItem.crust);
        if (!crustObj) {
          alert("Please select a valid crust.");
          setShowSuccessAlert(false);
          return;
        }
      }

      const menuItemData = {
        itemName: newMenuItem.itemName,
        itemType: newMenuItem.itemType,
        itemPrice: newMenuItem.itemPrice,
        description: newMenuItem.description,
        base: Object.keys(baseObj).length > 0 ? baseObj : undefined,
        sauce: sauceObj,
        meatTopping: meatToppingObjs,
        veggieTopping: veggieToppingObjs,
        herbs: herbObjs,
        otherAdditions: otherAdditionObjs,
        image: imageData,
        isAvailable: newMenuItem.isAvailable,
        isFeatured: newMenuItem.isFeatured,
        sortOrder: parseInt(newMenuItem.sortOrder) || 0,
      };

      console.log("Sending menu item data:", menuItemData);
      await dispatch(menuItemCreate(menuItemData)).unwrap();

      setTimeout(() => {
        navigate("/admin-menu");
      }, 2000);
    } catch (error) {
      console.error("Error creating menu item:", error);
      setShowSuccessAlert(false);
      // You might want to show an error alert here
    }
  };

  // Determine if current item type should show ingredient sections
  const showIngredients = ["Calzone", "Pizza Sticks", "Appetizer"].includes(newMenuItem.itemType);
  const showCrust = ["Calzone", "Pizza Sticks"].includes(newMenuItem.itemType);

  return (
    <>
      <div className="px-4">
        <h2 className="berkshireSwashFont mt-5 text-center text-2xl font-bold text-slate-800">
          Menu Item Builder
        </h2>
        <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700 " />

        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <div className="rounded-2xl bg-white/90 shadow-xl ring-1 ring-slate-200 overflow-hidden mb-10">
            <div className="px-6 py-5 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white">
              <h3 className="text-xl md:text-2xl font-semibold">
                Create Menu Item
              </h3>
              <p className="text-white/90 text-sm mt-1">
                Create calzones, appetizers, sides, and other menu items.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-5">
                {/* Item Name Input */}
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="item-name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Item Name
                  </label>
                  <input
                    value={newMenuItem.itemName}
                    onChange={(e) => {
                      const { value } = e.target;
                      // Capitalize first letter of every word
                      const capitalized = value.replace(/\b\w/g, (char) =>
                        char.toUpperCase()
                      );
                      setNewMenuItem((prev) => ({
                        ...prev,
                        itemName: capitalized,
                      }));
                    }}
                    type="text"
                    id="item-name"
                    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light
                          text-black 
                          placeholder-gray-500 
                          border-slate-500
                          bg-gray-200 
                          focus:bg-gray-100 
                          focus:border-sky-700"
                    placeholder="Deluxe Calzone"
                    required
                  />
                </div>
                {/* Item Price Input */}
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="itemPrice"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Set Price $
                  </label>
                  <input
                    value={newMenuItem.itemPrice}
                    onChange={handlePriceChange}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*(\.[0-9]{0,2})?"
                    placeholder="00.00"
                    id="itemPrice"
                    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light
                          text-black 
                          placeholder-gray-500 
                          border-slate-500
                          bg-gray-200 
                          focus:bg-gray-100 
                          focus:border-sky-700"
                    required
                  />
                </div>
              </div>

              {/* Item Type and Description */}
              <div className="flex flex-col sm:flex-row gap-4 mb-5">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="itemType"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Item Type
                  </label>
                  <select
                    id="itemType"
                    value={newMenuItem.itemType}
                    onChange={(e) =>
                      setNewMenuItem({ ...newMenuItem, itemType: e.target.value })
                    }
                    className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2
                      text-black 
                      placeholder-gray-500 
                      border-slate-500
                      bg-gray-200 
                      focus:bg-gray-300 
                      focus:ring-white
                      focus:border-sky-500"
                    required
                  >
                    {MENU_ITEM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={newMenuItem.description}
                    onChange={(e) =>
                      setNewMenuItem({ ...newMenuItem, description: e.target.value })
                    }
                    rows="3"
                    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light
                          text-black 
                          placeholder-gray-500 
                          border-slate-500
                          bg-gray-200 
                          focus:bg-gray-100 
                          focus:border-sky-700"
                    placeholder="A delicious description of your menu item..."
                  />
                </div>
              </div>

              {/* Availability and Featured Status */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center">
                  <input
                    id="isAvailable"
                    type="checkbox"
                    checked={newMenuItem.isAvailable}
                    onChange={(e) =>
                      setNewMenuItem({ ...newMenuItem, isAvailable: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isAvailable" className="ml-2 text-sm font-medium text-gray-900">
                    Available for ordering
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="isFeatured"
                    type="checkbox"
                    checked={newMenuItem.isFeatured}
                    onChange={(e) =>
                      setNewMenuItem({ ...newMenuItem, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-900">
                    Featured item
                  </label>
                </div>

                <div className="w-full sm:w-32">
                  <label
                    htmlFor="sortOrder"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Sort Order
                  </label>
                  <input
                    id="sortOrder"
                    type="number"
                    value={newMenuItem.sortOrder}
                    onChange={(e) =>
                      setNewMenuItem({ ...newMenuItem, sortOrder: e.target.value })
                    }
                    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light
                          text-black 
                          placeholder-gray-500 
                          border-slate-500
                          bg-gray-200 
                          focus:bg-gray-100 
                          focus:border-sky-700"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Upload new Photo */}
              <div id="imgUploader" className="w-full mb-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-stretch gap-6">
                  <div className="w-full lg:flex-1">
                    <label
                      className="block mb-2 text-sm font-medium pl-2 text-gray-900 capitalize"
                      htmlFor="menu_item_photo"
                    >
                      Upload Photo
                    </label>
                    <input
                      className="block w-full text-lg focus:outline-none p-2 text-gray-800 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                      aria-describedby="menu_item_photo_help"
                      id="menu_item_photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div
                      className="mt-1 text-sm text-gray-500"
                      id="menu_item_photo_help"
                    >
                      Add picture of menu item
                    </div>
                  </div>
                  {newMenuItem?.image?.data && (
                    <div className="w-full lg:w-[520px] xl:w-[560px] border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                      <img
                        src={`data:${newMenuItem.image.type};base64,${newMenuItem.image.data}`}
                        alt="Current Menu Item Preview"
                        className="w-full h-auto object-cover"
                      />
                      <div className="px-3 py-2 bg-gray-100 text-xs text-gray-600 flex justify-between">
                        <span>Preview</span>
                        <span>{newMenuItem.image?.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients Section - Only show for relevant item types */}
              {showIngredients && (
                <>
                  <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">
                    Ingredients
                  </h1>
                  <hr className="mb-5" />
                  
                  {/* Crust Selection - Only for pizza-like items */}
                  {showCrust && (
                    <BaseDropdown
                      id="crust"
                      label="Select Crust"
                      value={newMenuItem.crust}
                      onChange={(e) =>
                        setNewMenuItem({ ...newMenuItem, crust: e.target.value })
                      }
                      options={crustOptions}
                      placeholder="- - Select Crust - -"
                    />
                  )}

                  {/* Sauce Selection */}
                  <div className="mb-5">
                    <label
                      htmlFor="sauce"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Select Sauce Type
                    </label>
                    <select
                      value={newMenuItem.sauce}
                      onChange={(e) =>
                        setNewMenuItem({ ...newMenuItem, sauce: e.target.value })
                      }
                      id="sauce"
                      className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2
                        text-black 
                          placeholder-gray-500 
                          border-slate-500
                          bg-gray-200 
                          focus:bg-gray-300 
                          focus:ring-white
                          focus:border-sky-500"
                    >
                      <option value="">- - None - -</option>
                      {sauceOptions.map((sauce) => (
                        <option key={sauce.id} value={sauce.name}>
                          {sauce.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cheese Selection */}
                  <CheeseGroup
                    cheeses={newMenuItem.cheeses}
                    cheeseAmounts={newMenuItem.cheeseAmounts}
                    options={cheeseOptionsOnly}
                    onChangeCheese={(idx, val) => {
                      const cheeses = [...newMenuItem.cheeses];
                      cheeses[idx] = val;
                      // If cheese cleared, reset amount to default '1'
                      const cheeseAmounts = [...newMenuItem.cheeseAmounts];
                      if (!val) cheeseAmounts[idx] = '1';
                      setNewMenuItem({ ...newMenuItem, cheeses, cheeseAmounts });
                    }}
                    onChangeAmount={(idx, val) => {
                      const cheeseAmounts = [...newMenuItem.cheeseAmounts];
                      cheeseAmounts[idx] = val;
                      setNewMenuItem({ ...newMenuItem, cheeseAmounts });
                    }}
                    preventDuplicates
                  />

                  <ToppingGroup
                    title="Meat Options"
                    labelPrefix="Select Meat"
                    values={newMenuItem.meatTopping}
                    options={meatOptions}
                    slots={6}
                    variant="meat"
                    onChange={(idx, val) => {
                      const updated = [...newMenuItem.meatTopping];
                      updated[idx] = val;
                      setNewMenuItem({ ...newMenuItem, meatTopping: updated });
                    }}
                  />

                  <ToppingGroup
                    title="Veggie Options"
                    labelPrefix="Select Veggie"
                    values={newMenuItem.veggieTopping}
                    options={veggieOptions}
                    slots={6}
                    variant="veggie"
                    onChange={(idx, val) => {
                      const updated = [...newMenuItem.veggieTopping];
                      updated[idx] = val;
                      setNewMenuItem({ ...newMenuItem, veggieTopping: updated });
                    }}
                  />

                  {/* Herbs Section */}
                  <ToppingGroup
                    title="Herbs"
                    labelPrefix="Select Herb"
                    values={newMenuItem.herbs}
                    options={herbOptions}
                    slots={3}
                    variant="neutral"
                    onChange={(idx, val) => {
                      const updated = [...newMenuItem.herbs];
                      updated[idx] = val;
                      setNewMenuItem({ ...newMenuItem, herbs: updated });
                    }}
                  />

                  {/* Other Additions Section */}
                  <ToppingGroup
                    title="Other Additions"
                    labelPrefix="Select Addition"
                    values={newMenuItem.otherAdditions}
                    options={otherAdditionsOptions}
                    slots={3}
                    variant="neutral"
                    onChange={(idx, val) => {
                      const updated = [...newMenuItem.otherAdditions];
                      updated[idx] = val;
                      setNewMenuItem({ ...newMenuItem, otherAdditions: updated });
                    }}
                  />
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto sm:min-w-[220px] flex justify-center mx-auto cursor-pointer disabled:cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none bg-gradient-to-r from-purple-600 to-purple-600 text-white shadow hover:from-purple-700 hover:to-purple-700 focus:ring-2 focus:ring-purple-400"
                >
                  Create Menu Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showSuccessAlert && (
        <div
          className="fixed bottom-52 left-1/2  
        -translate-x-1/2 ml-30
        bg-gray-700
        text-white  
        p-2         
        rounded-lg  
        shadow-lg   
        z-50        
        text-center 
        text-lg     
        animate-fade-in-up    
        "
        >
          <AlertSuccess2
            successMsg={successMsg}
            successDescription={successDescription}
          />
        </div>
      )}
    </>
  );
};

export default AdminMenuItemCreate;