import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AlertSuccess2 from "../components/AlertSuccess2";
import ToppingGroup from "./components/ToppingGroup";
import CheeseGroup from "./components/CheeseGroup";
import { ingredientGetAll } from "../redux/ingredientSlice";
import { menuItemGetOne, menuItemUpdate } from "../redux/menuItemSlice";
import { convertImageToBase64, compressImage } from "../utils/imageUtils";

const successMsg = "Menu item updated successfully";
const successDescription = "Navigating you back to the admin menu...";

// Menu item types (match create page)
const MENU_ITEM_TYPES = [
  "Calzone",
  "Pizza Sticks",
  "Appetizer",
  "Side",
  "Dessert",
  "Beverage",
  "Other",
];

// Neutral styled dropdown (shared style)
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
      value={value || ""}
      onChange={onChange}
      className="text-sm rounded-lg block w-full p-2.5 shadow-sm-light border-2 text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-300 focus:ring-white focus:border-sky-500"
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

const AdminUpdateIMenuItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const ingredients = useSelector((s) => s.ingredient.ingredients);
  const current = useSelector((s) => s.menuItem.menuItem);
  const [form, setForm] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);

  // Ingredient option buckets
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
  const crustOptions = baseOptions.filter((i) => /crust/i.test(i?.name || ""));
  const cheeseOptionsOnly = baseOptions.filter(
    (i) => !/crust/i.test(i?.name || "")
  );

  // Fetch data
  useEffect(() => {
    dispatch(ingredientGetAll());
  }, [dispatch]);

  useEffect(() => {
    if (id) dispatch(menuItemGetOne(id));
  }, [dispatch, id]);

  // Helper for normalizing arrays to fixed length strings
  const normArr = (arr = [], len = 0) =>
    Array.from({ length: len }, (_, i) =>
      typeof arr[i] === "object" && arr[i] !== null ? arr[i].name : arr[i] || ""
    );

  // Initialize form when current loads
  useEffect(() => {
    if (!current) return;
    const sauce =
      typeof current.sauce === "object" && current.sauce !== null
        ? current.sauce.name
        : current.sauce || "";

    const meatTopping = normArr(current.meatTopping, 6);
    const veggieTopping = normArr(current.veggieTopping, 6);
    const herbs = normArr(current.herbs, 3);
    const otherAdditions = normArr(current.otherAdditions, 3);

    // Base
    const crust = current?.base?.crust?.name || "";
    const cheesesSrc = Array.isArray(current?.base?.cheeses)
      ? current.base.cheeses
      : [];
    const cheeses = [0, 1, 2].map((i) => cheesesSrc[i]?.name || "");
    const cheeseAmounts = [0, 1, 2].map((i) =>
      String(
        typeof cheesesSrc[i]?.amount === "number" ? cheesesSrc[i].amount : 1
      )
    );

    setForm({
      ...current,
      sauce,
      meatTopping,
      veggieTopping,
      herbs,
      otherAdditions,
      crust,
      cheeses,
      cheeseAmounts,
      itemPrice: current?.itemPrice ? String(current.itemPrice) : "",
    });
    setOriginalImage(current?.image || null);
  }, [current]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result || "";
      const base64 = typeof result === "string" ? result.split(",")[1] : "";
      setForm((prev) => ({
        ...prev,
        image: { data: base64, name: file.name, type: file.type }, // preview payload
        imageFile: file, // raw for compression/conversion on submit
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePriceChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // keep digits only
    if (input.length === 0) {
      setForm({ ...form, itemPrice: "" });
      return;
    }
    while (input.length < 3) input = "0" + input; // ensure at least 3 digits
    const dollars = input.slice(0, -2);
    const cents = input.slice(-2);
    const formatted = `${parseInt(dollars, 10)}.${cents}`;
    setForm({ ...form, itemPrice: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    // Map selections to full objects like create page
    const sauceObj = form.sauce
      ? sauceOptions.find((s) => s.name === form.sauce)
      : null;

    const crustObj = crustOptions.find((c) => c.name === (form.crust || ""));

    const cheeses = (form.cheeses || [])
      .map((ch, i) => {
        if (!ch) return null;
        const baseCheese = cheeseOptionsOnly.find((o) => o.name === ch);
        if (!baseCheese) return null;
        const amt = parseFloat((form.cheeseAmounts || [])[i] || "1");
        return { ...baseCheese, amount: Number.isFinite(amt) ? amt : 1 };
      })
      .filter(Boolean);

    const mapT = (arr, opts) =>
      (arr || [])
        .filter(Boolean)
        .map((name) => {
          const found = opts.find((o) => o.name === name);
          return found ? { ...found, amount: 1 } : null;
        })
        .filter(Boolean);

    const meatTopping = mapT(form.meatTopping, meatOptions);
    const veggieTopping = mapT(form.veggieTopping, veggieOptions);
    const herbs = mapT(form.herbs, herbOptions);
    const otherAdditions = mapT(form.otherAdditions, otherAdditionsOptions);

    const base = {};
    if (crustObj && ["Calzone", "Pizza Sticks"].includes(form.itemType))
      base.crust = crustObj;
    if (cheeses.length) base.cheeses = cheeses;

    // Validate crust if required for this item type
    if (["Calzone", "Pizza Sticks"].includes(form.itemType)) {
      const hasCrust = crustOptions.find((c) => c.name === (form.crust || ""));
      if (!hasCrust) {
        alert("Please select a valid crust.");
        return;
      }
    }

    // Convert image if a new one is chosen; otherwise omit image from update
    let imageData = null;
    if (form.imageFile) {
      try {
        const compressedFile = await compressImage(form.imageFile, 0.8, 800);
        imageData = await convertImageToBase64(compressedFile);
      } catch (error) {
        console.error("Error converting image:", error);
        alert("Error processing image: " + error.message);
        return;
      }
    }

    const payload = {
      id,
      itemName: form.itemName,
      itemType: form.itemType,
      itemPrice: form.itemPrice,
      description: form.description,
      base,
      sauce: sauceObj || null,
      meatTopping,
      veggieTopping,
      herbs,
      otherAdditions,
      ...(imageData ? { image: imageData } : {}),
      isAvailable: !!form.isAvailable,
      isFeatured: !!form.isFeatured,
      sortOrder: parseInt(form.sortOrder) || 0,
    };

    try {
      await dispatch(menuItemUpdate(payload)).unwrap();
      setShowSuccessAlert(true);
      setTimeout(() => navigate("/admin-menu"), 1500);
    } catch (err) {
      console.error("Failed to update menu item", err);
    }
  };

  if (!form) return <div>Loading...</div>;

  // Resolve preview src from stored image (may be DataURL or DataURL-less base64)
  const getPreviewSrc = () => {
    const img = form?.image;
    if (!img) return "";
    if (typeof img === "string") return img; // assume full DataURL
    if (typeof img?.data === "string") {
      if (img.data.startsWith("data:")) return img.data;
      const mime = img.type || "image/png";
      return `data:${mime};base64,${img.data}`;
    }
    return "";
  };

  const getOriginalPreviewSrc = () => {
    const img = originalImage;
    if (!img) return "";
    if (typeof img === "string") return img;
    if (typeof img?.data === "string") {
      if (img.data.startsWith("data:")) return img.data;
      const mime = img.type || "image/png";
      return `data:${mime};base64,${img.data}`;
    }
    return "";
  };

  // Determine ingredient visibility like create page
  const showIngredients = ["Calzone", "Pizza Sticks", "Appetizer"].includes(
    form.itemType
  );
  const showCrust = ["Calzone", "Pizza Sticks"].includes(form.itemType);

  return (
    <>
      <div className="px-4">
        <h2 className="berkshireSwashFont mt-5 text-center text-2xl font-bold text-slate-800">
          Update Menu Item
        </h2>
        <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700" />
        <button
          onClick={() => navigate("/admin-menu")}
          type="button"
          className="absolute top-5 right-10 w-65 font-medium rounded-lg shadow-lg text-sm px-5 py-2.5 text-center me-2 mb-2 hover:bg-gradient-to-br bg-gradient-to-t focus:ring-4 focus:outline-none cursor-pointer shadow-green-800/80 text-white from-green-950 via-green-500 to-green-600 focus:ring-green-800"
        >
          Back
        </button>

        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <div className="rounded-2xl bg-white/90 shadow-xl ring-1 ring-slate-200 overflow-hidden mb-10">
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-500 text-white">
              <h3 className="text-xl md:text-2xl font-semibold">
                Update Menu Item
              </h3>
              <p className="text-white/90 text-sm mt-1">
                Edit name, price, base, sauces, and toppings.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-5">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="item-name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Item Name
                  </label>
                  <input
                    value={form.itemName || ""}
                    onChange={(e) => {
                      const { value } = e.target;
                      const capitalized = value.replace(/\b\w/g, (char) =>
                        char.toUpperCase()
                      );
                      setForm({ ...form, itemName: capitalized });
                    }}
                    type="text"
                    id="item-name"
                    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-100 focus:border-sky-700"
                    placeholder="Deluxe Calzone"
                    required
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="item-price"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Set Price $
                  </label>
                  <input
                    value={form.itemPrice ?? ""}
                    type="text"
                    inputMode="decimal"
                    placeholder="00.00"
                    onChange={handlePriceChange}
                    id="item-price"
                    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-100 focus:border-sky-700"
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
                    value={form.itemType || ""}
                    onChange={(e) =>
                      setForm({ ...form, itemType: e.target.value })
                    }
                    className="text-sm rounded-lg block w-full p-2.5 shadow-sm-light border-2 text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-300 focus:ring-white focus:border-sky-500"
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
                    value={form.description || ""}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows="3"
                    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-100 focus:border-sky-700"
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
                    checked={!!form.isAvailable}
                    onChange={(e) =>
                      setForm({ ...form, isAvailable: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isAvailable"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    Available for ordering
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="isFeatured"
                    type="checkbox"
                    checked={!!form.isFeatured}
                    onChange={(e) =>
                      setForm({ ...form, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
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
                    value={form.sortOrder ?? 0}
                    onChange={(e) =>
                      setForm({ ...form, sortOrder: e.target.value })
                    }
                    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-100 focus:border-sky-700"
                    placeholder="0"
                  />
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
                      value={form.crust}
                      onChange={(e) =>
                        setForm({ ...form, crust: e.target.value })
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
                      value={form.sauce || ""}
                      onChange={(e) =>
                        setForm({ ...form, sauce: e.target.value })
                      }
                      id="sauce"
                      className="text-sm rounded-lg block w-full p-2.5 shadow-sm-light border-2 text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-300 focus:ring-white focus:border-sky-500"
                    >
                      <option value="">- - None - -</option>
                      {sauceOptions.map((option) => (
                        <option key={option.name} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cheese Selection */}
                  <CheeseGroup
                    cheeses={form.cheeses || ["", "", ""]}
                    cheeseAmounts={form.cheeseAmounts || ["1", "1", "1"]}
                    options={cheeseOptionsOnly}
                    onChangeCheese={(idx, val) => {
                      const cheeses = [...(form.cheeses || ["", "", ""])];
                      cheeses[idx] = val;
                      const cheeseAmounts = [
                        ...(form.cheeseAmounts || ["1", "1", "1"]),
                      ];
                      if (!val) cheeseAmounts[idx] = "1";
                      setForm({ ...form, cheeses, cheeseAmounts });
                    }}
                    onChangeAmount={(idx, val) => {
                      const cheeseAmounts = [
                        ...(form.cheeseAmounts || ["1", "1", "1"]),
                      ];
                      cheeseAmounts[idx] = val;
                      setForm({ ...form, cheeseAmounts });
                    }}
                    preventDuplicates
                  />

                  <ToppingGroup
                    title="Meat Options"
                    labelPrefix="Select Meat"
                    values={form.meatTopping}
                    options={meatOptions}
                    slots={6}
                    variant="meat"
                    onChange={(idx, val) => {
                      const updated = [...form.meatTopping];
                      updated[idx] = val;
                      setForm({ ...form, meatTopping: updated });
                    }}
                  />

                  <ToppingGroup
                    title="Veggie Options"
                    labelPrefix="Select Veggie"
                    values={form.veggieTopping}
                    options={veggieOptions}
                    slots={6}
                    variant="veggie"
                    onChange={(idx, val) => {
                      const updated = [...form.veggieTopping];
                      updated[idx] = val;
                      setForm({ ...form, veggieTopping: updated });
                    }}
                  />

                  {/* Herbs Section */}
                  <ToppingGroup
                    title="Herbs"
                    labelPrefix="Select Herb"
                    values={form.herbs || ["", "", ""]}
                    options={herbOptions}
                    slots={3}
                    variant="neutral"
                    onChange={(idx, val) => {
                      const updated = [...(form.herbs || ["", "", ""])];
                      updated[idx] = val;
                      setForm({ ...form, herbs: updated });
                    }}
                  />

                  {/* Other Additions Section */}
                  <ToppingGroup
                    title="Other Additions"
                    labelPrefix="Select Addition"
                    values={form.otherAdditions || ["", "", ""]}
                    options={otherAdditionsOptions}
                    slots={3}
                    variant="neutral"
                    onChange={(idx, val) => {
                      const updated = [
                        ...(form.otherAdditions || ["", "", ""]),
                      ];
                      updated[idx] = val;
                      setForm({ ...form, otherAdditions: updated });
                    }}
                  />
                </>
              )}

              {/* Upload Photo */}
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
                  {form.imageFile ? (
                    <>
                      {getOriginalPreviewSrc() && (
                        <div className="w-full lg:w-[240px] border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                          <img
                            src={getOriginalPreviewSrc()}
                            alt="Previous Item Image"
                            className="w-full h-auto object-cover"
                          />
                          <div className="px-3 py-2 bg-gray-100 text-xs text-gray-600 flex justify-between">
                            <span>Previous</span>
                            <span>Current Image</span>
                          </div>
                        </div>
                      )}
                      {getPreviewSrc() && (
                        <div className="w-full lg:w-[520px] xl:w-[560px] border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                          <img
                            src={getPreviewSrc()}
                            alt="New Item Preview"
                            className="w-full h-auto object-cover"
                          />
                          <div className="px-3 py-2 bg-gray-100 text-xs text-gray-600 flex justify-between">
                            <span>Preview</span>
                            <span>
                              {typeof form.image === "object"
                                ? form.image.name || "New Image"
                                : "New Image"}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    getPreviewSrc() && (
                      <div className="w-full lg:w-[520px] xl:w-[560px] border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                        <img
                          src={getPreviewSrc()}
                          alt="Current Item Preview"
                          className="w-full h-auto object-cover"
                        />
                        <div className="px-3 py-2 bg-gray-100 text-xs text-gray-600 flex justify-between">
                          <span>Current</span>
                          <span>Current Image</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto sm:min-w-[220px] flex justify-center mx-auto cursor-pointer disabled:cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow hover:from-emerald-700 hover:to-green-700 focus:ring-2 focus:ring-emerald-400"
                >
                  Submit Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showSuccessAlert && (
        <div className="fixed bottom-52 left-1/2 -translate-x-1/2 ml-30 bg-gray-700 text-white p-2 rounded-lg shadow-lg z-50 text-center text-lg animate-fade-in-up">
          <AlertSuccess2
            successMsg={successMsg}
            successDescription={successDescription}
          />
        </div>
      )}
    </>
  );
};

export default AdminUpdateIMenuItems;
