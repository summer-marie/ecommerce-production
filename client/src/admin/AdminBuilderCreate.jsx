import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import AlertSuccess2 from "../components/AlertSuccess2";
import { builderCreate } from "../redux/builderSlice";
import { ingredientGetAll } from "../redux/ingredientSlice";
import { convertImageToBase64, compressImage } from "../utils/imageUtils";

const successMsg = "Pizza was created successfully!!";
const successDescription = "navigating you to the admin menu....";

// Reusable dropdown component
const ToppingDropdown = ({ label, value, onChange, options, type }) => (
  <div className="mb-5">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className={`text-sm rounded-lg block w-full p-2.5 shadow-sm-light border-2 text-white placeholder-gray-400 ${
        type === "meat"
          ? "border-red-950 bg-red-800 focus:bg-red-950 focus:ring-red-500 focus:border-red-500"
          : "border-green-950 bg-green-800 focus:bg-green-950 focus:ring-green-500 focus:border-green-500"
      }`}
    >
      <option value="">- - None - -</option>
      {options.map((option) => (
        <option key={option.id} value={option.name}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

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

// Cheese amount selector: Light(0.5), Regular(1), Extra(2)
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
        text-black 
        placeholder-gray-500 
        border-slate-500
        bg-gray-200 
        focus:bg-gray-300 
        focus:ring-white
        focus:border-sky-500"
    >
      <option value="0.5">Light</option>
      <option value="1">Regular</option>
      <option value="2">Extra</option>
    </select>
  </div>
);

const AdminBuilderCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredient.ingredients);
  const [newPizza, setNewPizza] = useState({
    pizzaName: "",
    pizzaPrice: "", // manual entry by admin
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
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const meatOptions = ingredients.filter((i) => i.itemType === "Meat Topping");
  const veggieOptions = ingredients.filter(
    (i) => i.itemType === "Veggie Topping"
  );
  const sauceOptions = ingredients.filter((i) => i.itemType === "Sauce");
  const baseOptions = ingredients.filter((i) => i.itemType === "Base");
  const herbOptions = ingredients.filter((i) => i.itemType === "Herbs");
  const otherAdditionsOptions = ingredients.filter((i) => i.itemType === "Other");
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

    setNewPizza((prev) => {
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
        setNewPizza({
          ...newPizza,
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
      setNewPizza({ ...newPizza, pizzaPrice: "" });
      return;
    }
    while (input.length < 3) input = "0" + input; // ensure at least 3 digits
    const dollars = input.slice(0, -2);
    const cents = input.slice(-2);
    const formatted = `${parseInt(dollars, 10)}.${cents}`;
    setNewPizza({ ...newPizza, pizzaPrice: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setShowSuccessAlert(true);
      const sauceObj = sauceOptions.find((s) => s.name === newPizza.sauce);
      if (!sauceObj) {
        alert("Please select a valid sauce.");
        return;
      }
      // Build toppings
      const meatToppingObjs = newPizza.meatTopping
        .filter(Boolean)
        .map((meat) => {
          const found = meatOptions.find((opt) => opt.name === meat);
          return found ? { ...found, amount: 1 } : null;
        })
        .filter(Boolean);

      const veggieToppingObjs = newPizza.veggieTopping
        .filter(Boolean)
        .map((veg) => {
          const found = veggieOptions.find((opt) => opt.name === veg);
          return found ? { ...found, amount: 1 } : null;
        })
        .filter(Boolean);

      const herbObjs = newPizza.herbs
        .filter(Boolean)
        .map((herb) => {
          const found = herbOptions.find((opt) => opt.name === herb);
          return found ? { ...found, amount: 1 } : null;
        })
        .filter(Boolean);

      const otherAdditionObjs = newPizza.otherAdditions
        .filter(Boolean)
        .map((add) => {
          const found = otherAdditionsOptions.find((opt) => opt.name === add);
          return found ? { ...found, amount: 1 } : null;
        })
        .filter(Boolean);

      // Convert image to Base64 if selected
      let imageData = null;
      if (newPizza.imageFile) {
        console.log("Converting image to Base64...");
        try {
          // Optionally compress the image first
          const compressedFile = await compressImage(
            newPizza.imageFile,
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

      // Validate crust
      const crustObj = crustOptions.find((c) => c.name === newPizza.crust);
      if (!crustObj) {
        alert("Please select a valid crust.");
        setShowSuccessAlert(false);
        return;
      }

      const pizzaData = {
        pizzaName: newPizza.pizzaName,
        pizzaPrice: newPizza.pizzaPrice,
        base: {
          crust: crustObj,
          cheeses: newPizza.cheeses
            .map((ch, i) => {
              if (!ch) return null;
              const baseCheese = cheeseOptionsOnly.find((o) => o.name === ch);
              if (!baseCheese) return null;
              const amt = parseFloat(newPizza.cheeseAmounts[i] || "1");
              return { ...baseCheese, amount: Number.isFinite(amt) ? amt : 1 };
            })
            .filter(Boolean),
        },
        sauce: sauceObj,
        meatTopping: meatToppingObjs,
        veggieTopping: veggieToppingObjs,
        herbs: herbObjs,
        otherAdditions: otherAdditionObjs,
        image: imageData,
      };

      console.log("Sending pizza data:", pizzaData);
      await dispatch(builderCreate(pizzaData)).unwrap();

      setTimeout(() => {
        navigate("/admin-menu");
      }, 2000);
    } catch (error) {
      console.error("Error creating pizza:", error);
      setShowSuccessAlert(false);
      // You might want to show an error alert here
    }
  };

  return (
    <>
      <div className="px-4">
        <h2 className="berkshireSwashFont mt-5 text-center text-2xl font-bold text-slate-800">
          Pizza Builder for Menu
        </h2>
        <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700 " />

        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <div className="rounded-2xl bg-white/90 shadow-xl ring-1 ring-slate-200 overflow-hidden mb-10">
            <div className="px-6 py-5 bg-gradient-to-r from-rose-700 via-red-600 to-rose-500 text-white">
              <h3 className="text-xl md:text-2xl font-semibold">
                Create Pizza
              </h3>
              <p className="text-white/90 text-sm mt-1">
                Build a new menu pizza with your preferred base, sauces, and
                toppings.
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
                    Create Pizza Name
                  </label>
                  <input
                    value={newPizza.pizzaName}
                    onChange={(e) => {
                      const raw = e.target.value;
                      // Convert every word to Title Case (handles multiple spaces gracefully)
                      const titleCased = raw
                        .toLowerCase()
                        .replace(/\s+/g, ' ') // collapse consecutive spaces
                        .trimStart() // allow user to keep trailing space while typing
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                      // Preserve a trailing space if user is still typing
                      const endsWithSpace = /\s$/.test(raw);
                      setNewPizza({
                        ...newPizza,
                        pizzaName: endsWithSpace ? titleCased + ' ' : titleCased,
                      });
                    }}
                    type="text"
                    id="pizza-name"
                    className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light
                          text-black 
                          placeholder-gray-500 
                          border-slate-500
                          bg-gray-200 
                          focus:bg-gray-100 
                          focus:border-sky-700"
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
                    Set Price $
                  </label>
                  <input
                    value={newPizza.pizzaPrice}
                    onChange={handlePriceChange}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*(\.[0-9]{0,2})?"
                    placeholder="00.00"
                    id="pizzaPrice"
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
                  {newPizza?.image?.data && (
                    <div className="w-full lg:w-[520px] xl:w-[560px] border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                      <img
                        src={`data:${newPizza.image.type};base64,${newPizza.image.data}`}
                        alt="Current Pizza Preview"
                        className="w-full h-auto object-cover"
                      />
                      <div className="px-3 py-2 bg-gray-100 text-xs text-gray-600 flex justify-between">
                        <span>Preview</span>
                        <span>{newPizza.image?.name}</span>
                      </div>
                    </div>
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
                  value={newPizza.crust}
                  onChange={(e) =>
                    setNewPizza({ ...newPizza, crust: e.target.value })
                  }
                  options={crustOptions}
                  placeholder="- - Select Crust - -"
                />

                {/* Sauce Selection moved directly under crust */}
                <div className="mb-5">
                  <label
                    htmlFor="sauce"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Select Sauce Type
                  </label>
                  <select
                    value={newPizza.sauce}
                    onChange={(e) =>
                      setNewPizza({ ...newPizza, sauce: e.target.value })
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
                    required
                  >
                    <option value="">- - None - -</option>
                    {sauceOptions.map((sauce) => (
                      <option key={sauce.id} value={sauce.name}>
                        {sauce.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cheese Selections */}
                <h3 className="block mb-2 text-sm font-bold text-gray-900">
                  Select Cheese(s)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                  {[0, 1, 2].map((index) => (
                    <div key={`cheese-slot-${index}`}>
                      <BaseDropdown
                        id={`cheese-${index}`}
                        label={`Select Cheese #${index + 1}`}
                        value={newPizza.cheeses[index]}
                        onChange={(e) => {
                          const cheeses = [...newPizza.cheeses];
                          cheeses[index] = e.target.value;
                          setNewPizza({ ...newPizza, cheeses });
                        }}
                        options={cheeseOptionsOnly}
                        placeholder="- - None - -"
                      />
                      <CheeseAmountDropdown
                        id={`cheese-amt-${index}`}
                        label="Cheese Amount"
                        value={newPizza.cheeseAmounts[index]}
                        onChange={(e) => {
                          const cheeseAmounts = [...newPizza.cheeseAmounts];
                          cheeseAmounts[index] = e.target.value;
                          setNewPizza({ ...newPizza, cheeseAmounts });
                        }}
                        disabled={!newPizza.cheeses[index]}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <h1 className="block text-lg font-medium text-gray-900 text-center"></h1>

              <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">
                Meat Options
              </h1>
              <hr className="mb-5" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <ToppingDropdown
                    key={`meat-${index}`}
                    label={`Select Meat #${index + 1}`}
                    value={newPizza.meatTopping[index]}
                    onChange={(e) => {
                      const updatedMeatTopping = [...newPizza.meatTopping];
                      updatedMeatTopping[index] = e.target.value;
                      setNewPizza({
                        ...newPizza,
                        meatTopping: updatedMeatTopping,
                      });
                    }}
                    options={meatOptions}
                    type="meat"
                  />
                ))}
              </div>

              <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">
                Veggie Options
              </h1>
              <hr className="mb-5" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <ToppingDropdown
                    key={`veggie-${index}`}
                    label={`Select Veggie #${index + 1}`}
                    value={newPizza.veggieTopping[index]}
                    onChange={(e) => {
                      const updatedVeggieTopping = [...newPizza.veggieTopping];
                      updatedVeggieTopping[index] = e.target.value;
                      setNewPizza({
                        ...newPizza,
                        veggieTopping: updatedVeggieTopping,
                      });
                    }}
                    options={veggieOptions}
                    type="veggie"
                  />
                ))}
              </div>

              {/* Herbs Section */}
              <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">
                Herbs
              </h1>
              <hr className="mb-5" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {[0, 1, 2].map((index) => (
                  <ToppingDropdown
                    key={`herb-${index}`}
                    label={`Select Herb #${index + 1}`}
                    value={newPizza.herbs[index]}
                    onChange={(e) => {
                      const updatedHerbs = [...newPizza.herbs];
                      updatedHerbs[index] = e.target.value;
                      setNewPizza({
                        ...newPizza,
                        herbs: updatedHerbs,
                      });
                    }}
                    options={herbOptions}
                    type="veggie"
                  />
                ))}
              </div>

              {/* Other Additions Section */}
              <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">
                Other Additions
              </h1>
              <hr className="mb-5" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {[0, 1, 2].map((index) => (
                  <BaseDropdown
                    key={`other-${index}`}
                    id={`other-${index}`}
                    label={`Select Addition #${index + 1}`}
                    value={newPizza.otherAdditions[index]}
                    onChange={(e) => {
                      const updatedOther = [...newPizza.otherAdditions];
                      updatedOther[index] = e.target.value;
                      setNewPizza({
                        ...newPizza,
                        otherAdditions: updatedOther,
                      });
                    }}
                    options={otherAdditionsOptions}
                    placeholder="- - None - -"
                  />
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto sm:min-w-[220px] flex justify-center mx-auto cursor-pointer disabled:cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow hover:from-emerald-700 hover:to-green-700 focus:ring-2 focus:ring-emerald-400"
                >
                  Submit New Pizza
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

export default AdminBuilderCreate;
