import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import AlertSuccess2 from "../components/AlertSuccess2";
import { pizzaGetOne, builderUpdateOne } from "../redux/builderSlice";
import { ingredientGetAll } from "../redux/ingredientSlice";

const successMsg = "Pizza was updated successfully";
const successDescription = "Navigating you back to the admin menu....";

// Reusable dropdown component
const ToppingDropdown = ({ label, value, onChange, options, type }) => (
  <div className="mb-5">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      {label}
    </label>
    <select
      value={value || ""}
      onChange={onChange}
      className={`text-sm rounded-lg block w-full p-2.5 shadow-sm-light border-2 text-white placeholder-gray-400 ${
        type === 'meat' 
          ? 'border-red-950 bg-red-800 focus:bg-red-950 focus:ring-red-500 focus:border-red-500'
          : 'border-green-800 bg-emerald-500 focus:bg-emerald-800 focus:ring-emerald-100 focus:border-emerald-200'
      }`}
    >
      <option value={value || ""} disabled>
        {value || "- - None - -"}
      </option>
      {options
        .filter((option) => option.name !== value)
        .map((option) => (
          <option key={option.name} value={option.name}>
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

const AdminUpdateOne = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const builder = useSelector((state) => state.builder?.builder);
  const ingredients = useSelector((state) => state.ingredient.ingredients);
  const [pizzaForm, setPizzaForm] = useState(null);
  const { id } = useParams();
  console.log("USE PARAMS", id);

  // Options for sauce, meat, and veggie toppings - dropdowns
  const sauceOptions = ingredients.filter((i) => i.itemType === "Sauce");
  const meatOptions = ingredients.filter((i) => i.itemType === "Meat Topping");
  const veggieOptions = ingredients.filter(
    (i) => i.itemType === "Veggie Topping"
  );
  // const baseOptions = ingredients.filter((i) => i.itemType === "Base");

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

      setPizzaForm({ ...builder, sauce, meatTopping, veggieTopping });
    }
  }, [builder]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPizzaForm({ ...pizzaForm, [name]: value });
  };

  const handlePriceChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // Remove all non-digits
    if (input.length === 0) {
      setPizzaForm({ ...pizzaForm, pizzaPrice: "" });
      return;
    }
    // Pad with zeros if needed, then insert decimal
    while (input.length < 3) input = "0" + input;
    const dollars = input.slice(0, -2);
    const cents = input.slice(-2);
    const formatted = `${parseInt(dollars, 10)}.${cents}`;
    setPizzaForm({ ...pizzaForm, pizzaPrice: formatted });
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

      // Construct payload with full objects
      const payload = {
        ...pizzaForm,
        id,
        // Use null instead of {} to avoid rendering empty object placeholder in UI
        sauce: sauceObj || null,
        meatTopping,
        veggieTopping,
        image: imageData,
      };

      console.log("Submitting payload:", payload);

      await dispatch(builderUpdateOne(payload)).unwrap();
      setShowSuccessAlert(true);
      setTimeout(() => navigate("/admin-menu"), 2000);
    } catch (error) {
      console.error("Error updating pizza:", error);
      // You might want to show an error alert here
    }
  };

  console.log("pizzaForm:", pizzaForm);

  if (!pizzaForm) return <div>Loading...</div>;

  // Defensive helpers for rendering to avoid raw objects
  const safeArrayNames = (arr) =>
    Array.isArray(arr)
      ? arr
          .map((item) =>
            typeof item === "string"
              ? item
              : item && typeof item === "object"
              ? item.name
              : null
          )
          .filter(Boolean)
      : [];
  const safeBaseNames = safeArrayNames(pizzaForm.base);
  // (Optional) Additional safe arrays can be derived similarly if needed

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
        <div className="h-screen">
          <div className="flex flex-wrap flex-row-reverse justify-center mb-20">
            <form onSubmit={handleSubmit} className="w-5/8 mb-10 min-h-screen">
              <div className="border-4 border-green-700 mb-15">
                <div className="border-4 border-white">
                  <div className="border-4 border-red-700 p-5">
                    <div className="flex gap-4 mb-5">
                      {/* Pizza Name Input */}
                      <div className="w-1/2">
                        <label
                          htmlFor="pizza-name"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Pizza Name
                        </label>
                        <input
                          value={pizzaForm.pizzaName}
                          onChange={handleChange}
                          type="text"
                          id="pizza-name"
                          name="pizzaName"
                          className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light
                          text-black 
                          placeholder-gray-500 
                          border-slate-500
                          bg-gray-200 
                          focus:bg-gray-100 focus:border-sky-700"
                          placeholder="Meat Lovers"
                          required
                        />
                      </div>
                      {/* Pizza Price Input */}
                      <div className="w-1/2">
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
                          pattern="[0-9]*(\.[0-9]{0,2})?"
                          placeholder="00.00"
                          onChange={handlePriceChange}
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
                    <div id="imgUploader" className="max-w-lg mx-auto mb-5">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
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
                        {pizzaForm?.image?.data &&
                          typeof pizzaForm.image.data === "string" && (
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-300 rounded-lg overflow-hidden">
                              <img
                                src={pizzaForm.image.data}
                                alt="Current Pizza"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                      </div>
                    </div>

                    <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">
                      Pizza Base
                    </h1>
                    <hr className="mb-5" />
                    <div className="mb-5">
                      <label
                        htmlFor=""
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Crust and Cheese
                      </label>
                      <BaseIngredientDisplay 
                        value={safeBaseNames[0] || "No crust info"} 
                      />
                      <BaseIngredientDisplay 
                        value={safeBaseNames[1] || "No cheese info"} 
                      />
                    </div>

                    <div className="mb-5">
                      <label
                        htmlFor="sauce"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Update Sauce Type
                      </label>
                      <select
                        value={pizzaForm.sauce || ""}
                        onChange={(e) =>
                          setPizzaForm({ ...pizzaForm, sauce: e.target.value })
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
                        <option value={pizzaForm.sauce || ""} disabled>
                          {pizzaForm.sauce || "- - None - -"}
                        </option>
                        {sauceOptions
                          .filter((option) => option.name !== pizzaForm.sauce)
                          .map((option) => (
                            <option key={option.name} value={option.name}>
                              {option.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">
                      Meat Options
                    </h1>
                    <hr className="mb-5" />
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <ToppingDropdown
                          key={`meat-${index}`}
                          label={`Update Meat #${index + 1}`}
                          value={pizzaForm.meatTopping[index]}
                          onChange={(e) => {
                            const updatedMeatTopping = [...pizzaForm.meatTopping];
                            updatedMeatTopping[index] = e.target.value;
                            setPizzaForm({ ...pizzaForm, meatTopping: updatedMeatTopping });
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
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <ToppingDropdown
                          key={`veggie-${index}`}
                          label={`Update Veggie #${index + 1}`}
                          value={pizzaForm.veggieTopping[index]}
                          onChange={(e) => {
                            const updatedVeggieTopping = [...pizzaForm.veggieTopping];
                            updatedVeggieTopping[index] = e.target.value;
                            setPizzaForm({ ...pizzaForm, veggieTopping: updatedVeggieTopping });
                          }}
                          options={veggieOptions}
                          type="veggie"
                        />
                      ))}
                    </div>
                    <button
                      // disabled={submitDisabled}
                      onClick={handleSubmit}
                      type="submit"
                      className="flex justify-center mx-auto cursor-pointer disabled:cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center  focus:outline-none hover:bg-gradient-to-br bg-gradient-to-r  focus:ring-4 
                        shadow-green-800/80 
                        hover:text-black
                        text-white 
                        from-cyan-400 
                        via-blue-700 
                        to-cyan-600
                        focus:ring-blue-800"
                    >
                      Submit Changes
                    </button>
                  </div>
                </div>
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
