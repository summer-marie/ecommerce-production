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

const AdminBuilderCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredient.ingredients);
  const [newPizza, setNewPizza] = useState({
    pizzaName: "",
    pizzaPrice: "", // manual entry by admin
    sauce: "Signature Red Sauce",
    meatTopping: ["", "", "", "", "", ""], // 6 meat slots
    veggieTopping: ["", "", "", "", "", ""], // 6 veggie slots
    image: null, // Added image field
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const meatOptions = ingredients.filter((i) => i.itemType === "Meat Topping");
  const veggieOptions = ingredients.filter(
    (i) => i.itemType === "Veggie Topping"
  );
  const sauceOptions = ingredients.filter((i) => i.itemType === "Sauce");
  const baseOptions = ingredients.filter((i) => i.itemType === "Base");

  useEffect(() => {
    dispatch(ingredientGetAll());
  }, [dispatch]);

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

      // Find the selected sauce object
      const sauceObj = sauceOptions.find((s) => s.name === newPizza.sauce);
      if (!sauceObj) {
        alert("Please select a valid sauce.");
        return;
      }

      // Build meatTopping array of objects, filter out empty selections
      const meatToppingObjs = newPizza.meatTopping
        .filter((m) => m)
        .map((meat) => {
          const found = meatOptions.find((opt) => opt.name === meat);
          return found ? { ...found, amount: 1 } : null;
        })
        .filter(Boolean);

      // Build veggieTopping array of objects, filter out empty selections
      const veggieToppingObjs = newPizza.veggieTopping
        .filter((v) => v)
        .map((veggie) => {
          const found = veggieOptions.find((opt) => opt.name === veggie);
          return found ? { ...found, amount: 1 } : null;
        })
        .filter(Boolean);

      // Convert image to Base64 if selected
      let imageData = null;
      if (newPizza.image) {
        console.log("Converting image to Base64...");
        try {
          // Optionally compress the image first
          const compressedFile = await compressImage(newPizza.image, 0.8, 800);
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

      // Create pizza data object
      const pizzaData = {
        pizzaName: newPizza.pizzaName,
        pizzaPrice: newPizza.pizzaPrice,
        base: [
          baseOptions[0] || { name: "No crust found" },
          baseOptions[1] || { name: "No cheese found" },
        ],
        sauce: sauceObj,
        meatTopping: meatToppingObjs,
        veggieTopping: veggieToppingObjs,
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
        <div className="h-screen">
          <div className="flex flex-wrap flex-row-reverse justify-center">
            <form onSubmit={handleSubmit} className="w-5/8 mb-10 min-h-screen">
              <div className="border-4 border-green-700 mb-20">
                <div className="border-4 border-white">
                  <div className="border-4 border-red-700 p-5">
                    <div className="flex gap-4 mb-5">
                      {/* Pizza Name Input */}
                      <div className="w-1/2">
                        <label
                          htmlFor="pizza-name"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Create Pizza Name
                        </label>
                        <input
                          value={newPizza.pizzaName}
                          onChange={(e) =>
                            setNewPizza({
                              ...newPizza,
                              pizzaName: e.target.value,
                            })
                          }
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
                      <div className="w-1/2">
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
                    <div id="imgUploader" className="max-w-lg ml-10 mb-5">
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
                        {newPizza?.image?.data && (
                          <div className="flex-shrink-0 w-30 h-24 border border-gray-300 rounded-lg overflow-hidden">
                            <img
                              src={`data:${newPizza.image.type};base64,${newPizza.image.data}`}
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
                        htmlFor="pizza-base"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Crust and Cheese
                      </label>

                      <BaseIngredientDisplay 
                        value={baseOptions[0] ? baseOptions[0].name : "No crust found"} 
                      />
                      <BaseIngredientDisplay 
                        value={baseOptions[1] ? baseOptions[1].name : "No cheese found"} 
                      />
                    </div>

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
                        <option value="">- - Select Sauce - -</option>
                        {sauceOptions.map((sauce) => (
                          <option key={sauce.id} value={sauce.name}>
                            {sauce.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <h1 className="block text-lg font-medium text-gray-900 text-center"></h1>

                    <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">
                      Meat Options
                    </h1>
                    <hr className="mb-5" />

                    <div className="grid grid-cols-3 gap-4 mb-5">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <ToppingDropdown
                          key={`meat-${index}`}
                          label={`Select Meat #${index + 1}`}
                          value={newPizza.meatTopping[index]}
                          onChange={(e) => {
                            const updatedMeatTopping = [
                              ...newPizza.meatTopping,
                            ];
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
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <ToppingDropdown
                          key={`veggie-${index}`}
                          label={`Select Veggie #${index + 1}`}
                          value={newPizza.veggieTopping[index]}
                          onChange={(e) => {
                            const updatedVeggieTopping = [
                              ...newPizza.veggieTopping,
                            ];
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

                    <button
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
                      Submit New Pizza
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

export default AdminBuilderCreate;
