import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import AlertSuccess2 from "../components/AlertSuccess2";
import { builderCreate } from "../redux/builderSlice";
import { ingredientGetAll } from "../redux/ingredientSlice";
import { uploadImage } from "../utils/firebaseStorage";

const successMsg = "Pizza was created successfully!!";
const successDescription = "navigating you to the admin menu....";

const AdminBuilderCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredient.ingredients);
  const [newPizza, setNewPizza] = useState({
    pizzaName: "",
    pizzaPrice: "", // manual entry by admin
    sauce: "Signature Red Sauce",
    meatTopping: ["", "", ""], // 3 meat slots
    veggieTopping: ["", "", "", ""], // 4 veggie slots
  });
  const [selectedFile, setSelectedFile] = useState(null);
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
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
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

      // Upload image to Firebase Storage if selected
      let imageData = null;
      if (selectedFile) {
        console.log("Uploading image to Firebase Storage...");
        imageData = await uploadImage(selectedFile, 'pizzas');
        console.log("Image uploaded:", imageData);
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
      <div className="ml-64 px-4">
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
                    <div className="mb-5">
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
                      focus:border-sky-700
              "
                        placeholder="Meat Lovers"
                        required
                      />
                    </div>

                    {/* Upload new Photo */}
                    <div id="imgUploader" className="max-w-lg mx-auto mb-5">
                      <label
                        className="block mb-2 text-sm font-medium pl-2 text-gray-900 capitalize"
                        htmlFor="pizza_photo"
                      >
                        Upload photo
                      </label>
                      <input
                        id="pizza_photo"
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-lg focus:outline-none p-2 text-gray-800 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 "
                      />
                      <div
                        className="mt-1 text-sm text-gray-500"
                        id="pizza_photo_help"
                      >
                        Add image of desired pizza
                      </div>
                    </div>

                    {/* Manual Price Input */}
                    <div className="mb-5 w-[95%] mx-auto">
                      <label
                        htmlFor="pizzaPrice"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Pizza Price $
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
                        border-slate-500
                        bg-gray-200 
                        focus:bg-gray-100 
                        focus:border-sky-700
              "
                        required
                      />
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

                      <div
                        id="crust"
                        className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light cursor-not-allowed
                      text-black 
                      placeholder-gray-500 
                      border-slate-500
                      bg-gray-400 
                      focus:bg-sky-200 
                      focus:border-sky-700
              "
                      >
                        {baseOptions[0]
                          ? baseOptions[0].name
                          : "No crust found"}
                      </div>

                      <div
                        id="cheese"
                        className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light cursor-not-allowed
                      text-black 
                        placeholder-gray-500 
                        border-slate-500
                        bg-gray-400 
                        focus:bg-sky-200 
                        focus:border-sky-700
              "
                      >
                        {baseOptions[1]
                          ? baseOptions[1].name
                          : "No cheese found"}
                      </div>
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
                    <p className="tex-md mb-2 p-1 text-center">
                      Ingredients keep unit prices for reference, but pizza price is
                      set manually.
                    </p>
                    <hr className="mb-5" />
                    <h1 className="block mb-5 text-lg font-medium text-gray-900 text-left">
                      Meat Options:
                    </h1>

                    <div
                      id="nested-flex-container"
                      className="nested-flex-meat"
                    >
                      <div id="nested-col-1" className="px-2">
                        <div className="mb-5">
                          <label
                            htmlFor="meat-topping"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Select Meat #1
                          </label>
                          <select
                            value={newPizza.meatTopping[0]}
                            onChange={(e) =>
                              setNewPizza({
                                ...newPizza,
                                meatTopping: [
                                  e.target.value,
                                  newPizza.meatTopping[1],
                                  newPizza.meatTopping[2],
                                ],
                              })
                            }
                            id="meat-type"
                            className="text-sm rounded-lg block w-full p-2.5 shadow-sm-light border-2
                          text-white 
                          placeholder-gray-400 
                          border-red-950
                          bg-red-800 
                          focus:bg-red-950 
                          focus:ring-red-500
                          focus:border-red-500"
                          >
                            <option value="">- - None - -</option>
                            {meatOptions.map((meat) => (
                              <option key={meat.id} value={meat.name}>
                                {meat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div id="nested-col-2" className="px-2">
                        <div className="mb-5">
                          <label
                            htmlFor="meat-topping"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Select Meat #2
                          </label>
                          <select
                            value={newPizza.meatTopping[1]}
                            onChange={(e) =>
                              setNewPizza({
                                ...newPizza,
                                meatTopping: [
                                  newPizza.meatTopping[0],
                                  e.target.value,
                                  newPizza.meatTopping[2],
                                ],
                              })
                            }
                            id="meat-type"
                            className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2
                          text-white 
                          placeholder-gray-400 
                          border-red-950
                          bg-red-800 
                          focus:bg-red-950 
                          focus:ring-red-500
                          focus:border-red-500"
                          >
                            <option value="">- - None - -</option>
                            {meatOptions.map((meat) => (
                              <option key={meat.id} value={meat.name}>
                                {meat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div id="nested-col-3" className="px-2">
                        <div className="mb-5">
                          <label
                            htmlFor="meat-topping"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Select Meat #3
                          </label>
                          <select
                            value={newPizza.meatTopping[2]}
                            onChange={(e) =>
                              setNewPizza({
                                ...newPizza,
                                meatTopping: [
                                  newPizza.meatTopping[0],
                                  newPizza.meatTopping[1],
                                  e.target.value,
                                ],
                              })
                            }
                            id="meat-type"
                            className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2
                          text-white 
                          placeholder-gray-400 
                          border-red-950
                          bg-red-800 
                          focus:bg-red-950 
                          focus:ring-red-500
                          focus:border-red-500 "
                          >
                            <option value="">- - None - -</option>
                            {meatOptions.map((meat) => (
                              <option key={meat.id} value={meat.name}>
                                {meat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Nested flex with 2 cols */}
                    <h1 className="block mb-5 text-lg font-medium text-gray-900 text-left">
                      Veggie Options:
                    </h1>

                    <div
                      id="nested-flex-container"
                      className="nested-flex-veggie"
                    >
                      {/* Nested col 1 */}
                      <div id="nested-col-1" className="px-2">
                        <div className="mb-5 ">
                          <label
                            htmlFor="veggie-topping"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Select Veggies #1
                          </label>
                          <select
                            value={newPizza.veggieTopping[0]}
                            onChange={(e) =>
                              setNewPizza({
                                ...newPizza,
                                veggieTopping: [
                                  e.target.value,
                                  newPizza.veggieTopping[1],
                                  newPizza.veggieTopping[2],
                                  newPizza.veggieTopping[3],
                                ],
                              })
                            }
                            id="veggie-type"
                            className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2
                          text-white 
                          placeholder-gray-400 
                          border-green-800
                          bg-emerald-500
                          focus:bg-emerald-800
                          focus:ring-emerald-100
                          focus:border-emerald-200 "
                          >
                            <option value="">- - None - -</option>
                            {veggieOptions.map((veggie) => (
                              <option key={veggie.id} value={veggie.name}>
                                {veggie.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-5">
                          <label
                            htmlFor="veggie-topping"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Select Veggies #2
                          </label>
                          <select
                            value={newPizza.veggieTopping[1]}
                            onChange={(e) =>
                              setNewPizza({
                                ...newPizza,
                                veggieTopping: [
                                  newPizza.veggieTopping[0],
                                  e.target.value,
                                  newPizza.veggieTopping[2],
                                  newPizza.veggieTopping[3],
                                ],
                              })
                            }
                            id="veggie-type"
                            className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2
                          text-white 
                          placeholder-gray-400 
                          border-green-800
                          bg-emerald-500
                          focus:bg-emerald-800
                          focus:ring-emerald-100
                          focus:border-emerald-200 "
                          >
                            <option value="">- - None - -</option>
                            {veggieOptions.map((veggie) => (
                              <option key={veggie.id} value={veggie.name}>
                                {veggie.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {/* Nested col 2 */}
                      <div id="nested-col-2" className="px-2">
                        <div className="mb-5">
                          <label
                            htmlFor="veggie-topping"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Select Veggies #3
                          </label>
                          <select
                            value={newPizza.veggieTopping[2]}
                            onChange={(e) =>
                              setNewPizza({
                                ...newPizza,
                                veggieTopping: [
                                  newPizza.veggieTopping[0],
                                  newPizza.veggieTopping[1],
                                  e.target.value,
                                  newPizza.veggieTopping[3],
                                ],
                              })
                            }
                            id="veggie-type"
                            className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2
                          text-white 
                          placeholder-gray-400 
                          border-green-800
                          bg-emerald-500
                          focus:bg-emerald-800
                          focus:ring-emerald-100
                          focus:border-emerald-200 "
                          >
                            <option value="">- - None - -</option>
                            {veggieOptions.map((veggie) => (
                              <option key={veggie.id} value={veggie.name}>
                                {veggie.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-5">
                          <label
                            htmlFor="veggie-topping"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Select Veggies #4
                          </label>
                          <select
                            value={newPizza.veggieTopping[3]}
                            onChange={(e) =>
                              setNewPizza({
                                ...newPizza,
                                veggieTopping: [
                                  newPizza.veggieTopping[0],
                                  newPizza.veggieTopping[1],
                                  newPizza.veggieTopping[2],
                                  e.target.value,
                                ],
                              })
                            }
                            id="veggie-type"
                            className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2 
                            text-white 
                            placeholder-gray-400 
                            border-green-800
                            bg-emerald-500
                            focus:bg-emerald-800
                            focus:ring-emerald-100
                            focus:border-emerald-200 "
                          >
                            <option value="">- - None - -</option>
                            {veggieOptions.map((veggie) => (
                              <option key={veggie.id} value={veggie.name}>
                                {veggie.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
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
        bg-green-400
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
