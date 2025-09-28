import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { logger } from "../utils/logger";
import AlertSuccess2 from "../components/AlertSuccess2";
import { pizzaGetOne, builderUpdateOne } from "../redux/builderSlice";
import { ingredientGetAll } from "../redux/ingredientSlice";
import ToppingGroup from "./components/ToppingGroup";
import CheeseGroup from "./components/CheeseGroup";

const successMsg = "Pizza was updated successfully";
const successDescription = "Navigating you back to the admin menu....";


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

// Base helpers (styled like create page)
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
      className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2
        text-black placeholder-gray-500 border-slate-500 bg-gray-200
        focus:bg-gray-300 focus:ring-white focus:border-sky-500"
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

const CheeseAmountDropdown = ({
  id,
  label = "Cheese Amount",
  value,
  onChange,
  disabled = false,
}) => (
  <div className="mb-2">
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
      disabled={disabled}
      className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2
        text-black placeholder-gray-500 border-slate-500 bg-gray-200
        focus:bg-gray-300 focus:ring-white focus:border-sky-500"
    >
      <option value="0.5">Light</option>
      <option value="1">Regular</option>
      <option value="2">Extra</option>
    </select>
  </div>
);

const AdminUpdateOne = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const builder = useSelector((state) => state.builder?.builder);
  const ingredients = useSelector((state) => state.ingredient.ingredients);
  const [pizzaForm, setPizzaForm] = useState(null);
  const { id } = useParams();
  logger.debug("AdminUpdateOne param id", id);

  // Options for sauce, meat, and veggie toppings - dropdowns
  const sauceOptions = ingredients.filter((i) => i.itemType === "Sauce");
  const meatOptions = ingredients.filter((i) => i.itemType === "Meat Topping");
  const veggieOptions = ingredients.filter(
    (i) => i.itemType === "Veggie Topping"
  );
  const baseOptions = ingredients.filter((i) => i.itemType === "Base");
  const herbOptions = ingredients.filter((i) => i.itemType === "Herbs");
  const otherAdditionsOptions = ingredients.filter((i) => i.itemType === "Other");
  const crustOptions = baseOptions.filter((i) => /crust/i.test(i?.name || ""));
  const cheeseOptionsOnly = baseOptions.filter(
    (i) => !/crust/i.test(i?.name || "")
  );

  // Initialize pizzaForm with builder data
  useEffect(() => {
    dispatch(pizzaGetOne(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(ingredientGetAll());
  }, [dispatch]);

  // Helper to normalize array fields to array of names (strings)
  const normalizeArray = (arr = [], length = 0) =>
    Array.from({ length }, (_, i) =>
      typeof arr[i] === "object" && arr[i] !== null ? arr[i].name : arr[i] || ""
    );

  // Update pizzaForm when builder data changes
  useEffect(() => {
    if (builder) {
      let sauce =
        typeof builder.sauce === "object" && builder.sauce !== null
          ? builder.sauce.name
          : builder.sauce || "";

  let meatTopping = normalizeArray(builder.meatTopping, 6);
  let veggieTopping = normalizeArray(builder.veggieTopping, 6);
  let herbs = normalizeArray(builder.herbs, 3);
  let otherAdditions = normalizeArray(builder.otherAdditions, 3);

      // Prefill base selections
      const crust = builder?.base?.crust?.name || "";
      const cheesesSrc = Array.isArray(builder?.base?.cheeses)
        ? builder.base.cheeses
        : [];
      const cheeses = [0, 1, 2].map((i) => cheesesSrc[i]?.name || "");
      const cheeseAmounts = [0, 1, 2].map((i) =>
        String(
          typeof cheesesSrc[i]?.amount === "number" ? cheesesSrc[i].amount : 1
        )
      );

      setPizzaForm({
        ...builder,
        sauce,
        meatTopping,
        veggieTopping,
        crust,
        cheeses,
        cheeseAmounts,
        herbs,
        otherAdditions,
      });
    }
  }, [builder]);


  // Natural price input handler: allow user to type freely within pattern
  const handlePriceChange = (e) => {
    const { value } = e.target;

    // Allow clearing
    if (value === "") {
      setPizzaForm({ ...pizzaForm, pizzaPrice: "" });
      return;
    }

    // Accept only digits with optional single decimal and up to 2 fractional digits
    const pricePattern = /^\d+(\.\d{0,2})?$/;
    if (!pricePattern.test(value)) {
      return; // Ignore invalid keystroke
    }
    setPizzaForm({ ...pizzaForm, pizzaPrice: value });
  };

  // On blur normalize to two decimals (e.g., 10 -> 10.00, 10.5 -> 10.50, 10. -> 10.00)
  const handlePriceBlur = () => {
    const raw = pizzaForm?.pizzaPrice;
    if (raw === undefined || raw === null || raw === "") return;
    const num = Number(raw);
    if (!Number.isFinite(num)) {
      setPizzaForm({ ...pizzaForm, pizzaPrice: "" });
      return;
    }
    setPizzaForm({ ...pizzaForm, pizzaPrice: num.toFixed(2) });
  };

  // const handleFileChange = (e) => {
  //   setSelectedFile(e.target.files[0]);
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPizzaForm({
          ...pizzaForm,
          image: { data: reader.result, name: file.name, type: file.type },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Find the full sauce, meat, and veggie objects based on selected names
      const sauceObj = sauceOptions.find((opt) => opt.name === pizzaForm.sauce);

      // Use .filter(Boolean) to remove empty/undefined toppings
      const meatTopping = pizzaForm.meatTopping
        .map((name) => meatOptions.find((opt) => opt.name === name))
        .filter(Boolean);

      const veggieTopping = pizzaForm.veggieTopping
        .map((name) => veggieOptions.find((opt) => opt.name === name))
        .filter(Boolean);

      // Use the image from pizzaForm (already converted by handleFileChange)
      const imageData = pizzaForm.image;

      // Build base from selections
      const crustObj = crustOptions.find(
        (c) => c.name === (pizzaForm.crust || "")
      );
      if (!crustObj) {
        alert("Please select a valid crust.");
        return;
      }
      const cheeses = (pizzaForm.cheeses || [])
        .map((ch, i) => {
          if (!ch) return null;
          const baseCheese = cheeseOptionsOnly.find((o) => o.name === ch);
          if (!baseCheese) return null;
          const amt = parseFloat((pizzaForm.cheeseAmounts || [])[i] || "1");
          return { ...baseCheese, amount: Number.isFinite(amt) ? amt : 1 };
        })
        .filter(Boolean);

      // Map herbs
      const herbs = (pizzaForm.herbs || [])
        .map((name) => herbOptions.find((opt) => opt.name === name))
        .filter(Boolean)
        .map((h) => ({ ...h, amount: 1 }));

      const otherAdditions = (pizzaForm.otherAdditions || [])
        .map((name) => otherAdditionsOptions.find((opt) => opt.name === name))
        .filter(Boolean)
        .map((o) => ({ ...o, amount: 1 }));

      // Construct payload with full objects
      const payload = {
        id,
        pizzaName: pizzaForm.pizzaName,
        pizzaPrice: pizzaForm.pizzaPrice,
        base: { crust: crustObj, cheeses },
        sauce: sauceObj || null,
        meatTopping,
        veggieTopping,
        herbs,
        otherAdditions,
        image: imageData,
      };

      logger.info("Submitting pizza update payload", payload);

      await dispatch(builderUpdateOne(payload)).unwrap();
      setShowSuccessAlert(true);
      setTimeout(() => navigate("/admin-menu"), 2000);
    } catch (error) {
      logger.error("Error updating pizza:", error);
      // You might want to show an error alert here
    }
  };

  logger.debug("pizzaForm state", pizzaForm);

  if (!pizzaForm) return <div>Loading...</div>;

  // ...

  return (
    <>
      <div className="px-4">
        <h2 className="berkshireSwashFont mt-5 text-center text-2xl font-bold text-slate-800">
          Update Pizza Page
        </h2>
        <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700" />
        {/*  Back button */}
        <button
          onClick={() => navigate("/admin-menu")}
          type="button"
          className="absolute top-5 right-10 w-65 font-medium rounded-lg shadow-lg  text-sm px-5 py-2.5 text-center me-2 mb-2 hover:bg-gradient-to-br bg-gradient-to-t  focus:ring-4 focus:outline-none cursor-pointer
                shadow-green-800/80 
                text-white 
                from-green-950
                via-green-500 
                to-green-600
                focus:ring-green-800"
        >
          <svg
            className="w-6 h-5 text-gray-800 inline-block left-0 absolute"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="26"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m15 19-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <div className="rounded-2xl bg-white/90 shadow-xl ring-1 ring-slate-200 overflow-hidden mb-10">
            <div className="px-6 py-5 bg-gradient-to-r from-rose-700 via-red-600 to-rose-500 text-white">
              <h3 className="text-xl md:text-2xl font-semibold">
                Update Pizza
              </h3>
              <p className="text-white/90 text-sm mt-1">
                Modify base, sauces, and toppings for this pizza.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-5">
                {/* Pizza Name Input */}
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="pizza-name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Pizza Name
                  </label>
                  <input
                    value={pizzaForm.pizzaName}
                    onChange={(e) => {
                      const { value } = e.target;
                      const capitalized = value.replace(/\b\w/g, (c) => c.toUpperCase());
                      setPizzaForm({ ...pizzaForm, pizzaName: capitalized });
                    }}
                    type="text"
                    id="pizza-name"
                    name="pizzaName"
                    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-100 focus:border-sky-700"
                    placeholder="Meat Lovers"
                    required
                  />
                </div>
                {/* Pizza Price Input */}
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="pizzaPrice"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Update Pizza Price $
                  </label>
                  <input
                    value={pizzaForm.pizzaPrice}
                    type="text"
                    inputMode="decimal"
                    placeholder="00.00"
                    onChange={handlePriceChange}
                    onBlur={handlePriceBlur}
                    id="pizzaPrice"
                    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-100 focus:border-sky-700"
                    required
                  />
                </div>
              </div>

              {/* Upload new Photo */}
              <div id="imgUploader" className="w-full mb-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-stretch gap-6">
                  <div className="w-full lg:flex-1">
                    <label
                      className="block mb-2 text-sm font-medium pl-2 text-gray-900 capitalize"
                      htmlFor="pizza_photo"
                    >
                      Upload New photo
                    </label>
                    <input
                      className="block w-full text-lg focus:outline-none p-2 text-gray-800 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                      aria-describedby="pizza_photo_help"
                      id="pizza_photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div
                      className="mt-1 text-sm text-gray-500"
                      id="pizza_photo_help"
                    >
                      Add picture of desired pizza
                    </div>
                  </div>
                  {pizzaForm?.image && (
                    (() => {
                      const img = pizzaForm.image;
                      let src = '';
                      if (typeof img === 'string') {
                        src = img.startsWith('data:') ? img : img;
                      } else if (img.data) {
                        // If it's already a full data URL (update flow) use directly; if it's base64 without header, attempt to construct
                        if (typeof img.data === 'string' && img.data.startsWith('data:')) {
                          src = img.data;
                        } else if (typeof img.data === 'string' && img.data.length > 100 && !img.data.startsWith('data:')) {
                          const mime = img.type || 'image/png';
                          src = `data:${mime};base64,${img.data}`;
                        } else {
                          src = img.data;
                        }
                      }
                      if (!src) return null;
                      return (
                        <div className="w-full lg:w-[520px] xl:w-[560px] border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                          <img
                            src={src}
                            alt="Current Pizza Preview"
                            className="w-full h-auto object-cover"
                          />
                          <div className="px-3 py-2 bg-gray-100 text-xs text-gray-600 flex justify-between">
                            <span>Preview</span>
                            <span>{img.name || 'Current Image'}</span>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>

              <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">
                Pizza Base
              </h1>
              <hr className="mb-5" />
              <div className="mb-5">
                {/* Crust Selection */}
                <BaseDropdown
                  id="crust"
                  label="Select Crust"
                  value={pizzaForm.crust}
                  onChange={(e) =>
                    setPizzaForm({ ...pizzaForm, crust: e.target.value })
                  }
                  options={crustOptions}
                  placeholder="- - Select Crust - -"
                />

                {/* Sauce Selection (moved directly under crust) */}
                <div className="mb-5">
                  <label
                    htmlFor="sauce"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Select Sauce
                  </label>
                  <select
                    value={pizzaForm.sauce || ""}
                    onChange={(e) =>
                      setPizzaForm({ ...pizzaForm, sauce: e.target.value })
                    }
                    id="sauce"
                    className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2 text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-300 focus:ring-white focus:border-sky-500"
                  >
                    <option value="">- None -</option>
                    {sauceOptions.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <CheeseGroup
                  cheeses={pizzaForm.cheeses || ["", "", ""]}
                  cheeseAmounts={pizzaForm.cheeseAmounts || ["1", "1", "1"]}
                  options={cheeseOptionsOnly}
                  onChangeCheese={(idx, val) => {
                    const cheeses = [...(pizzaForm.cheeses || ["", "", ""])];
                    cheeses[idx] = val;
                    const cheeseAmounts = [...(pizzaForm.cheeseAmounts || ["1", "1", "1"])];
                    if (!val) cheeseAmounts[idx] = "1";
                    setPizzaForm({ ...pizzaForm, cheeses, cheeseAmounts });
                  }}
                  onChangeAmount={(idx, val) => {
                    const cheeseAmounts = [...(pizzaForm.cheeseAmounts || ["1", "1", "1"])];
                    cheeseAmounts[idx] = val;
                    setPizzaForm({ ...pizzaForm, cheeseAmounts });
                  }}
                  preventDuplicates
                />
              </div>



              <ToppingGroup
                title="Meat Options"
                labelPrefix="Update Meat"
                values={pizzaForm.meatTopping}
                options={meatOptions}
                slots={6}
                variant="meat"
                onChange={(idx, val) => {
                  const updated = [...pizzaForm.meatTopping];
                  updated[idx] = val;
                  setPizzaForm({ ...pizzaForm, meatTopping: updated });
                }}
              />

              <ToppingGroup
                title="Veggie Options"
                labelPrefix="Update Veggie"
                values={pizzaForm.veggieTopping}
                options={veggieOptions}
                slots={6}
                variant="veggie"
                onChange={(idx, val) => {
                  const updated = [...pizzaForm.veggieTopping];
                  updated[idx] = val;
                  setPizzaForm({ ...pizzaForm, veggieTopping: updated });
                }}
              />

              <ToppingGroup
                title="Herbs"
                labelPrefix="Update Herb"
                values={pizzaForm.herbs || ['', '', '']}
                options={herbOptions}
                slots={3}
                variant="neutral"
                onChange={(idx, val) => {
                  const updated = [...(pizzaForm.herbs || ['', '', ''])];
                  updated[idx] = val;
                  setPizzaForm({ ...pizzaForm, herbs: updated });
                }}
              />

              <ToppingGroup
                title="Other Additions"
                labelPrefix="Update Addition"
                values={pizzaForm.otherAdditions || ['', '', '']}
                options={otherAdditionsOptions}
                slots={3}
                variant="neutral"
                onChange={(idx, val) => {
                  const updated = [...(pizzaForm.otherAdditions || ['', '', ''])];
                  updated[idx] = val;
                  setPizzaForm({ ...pizzaForm, otherAdditions: updated });
                }}
              />

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

export default AdminUpdateOne;
