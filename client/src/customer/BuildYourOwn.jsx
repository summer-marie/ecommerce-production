import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { ingredientGetAll } from "../redux/ingredientSlice";
import AlertSuccess2 from "../components/AlertSuccess2";

const base = [
  {
    name: "Italian Blend Cheese",
    description: "Italian Blend Cheese",
    itemType: "base",
    price: "2.00",
  },
  {
    name: "Brick Oven Crust",
    description: "Brick Oven Crust",
    itemType: "base",
    price: "2.00",
  },
];

const successMsg = "Pizza was added to cart successfully!";
const successDescription = "Create another pizza or go to checkout.";

const BuildYourOwn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredient.ingredients);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [newPizza, setNewPizza] = useState({
    pizzaPrice: "6.00", // default price
    pizzaName: "Build Your Own",
    base: [...base],
    sauce: "Signature Red Sauce",
    meatTopping: ["", "", "", "", "", ""], // 6 meat slots
    veggieTopping: ["", "", "", ""], // 4 veggie slots
    specialRequest: "",
  });

  // Filter ingredients by type
  const meatOptions = ingredients.filter((i) => i.itemType === "Meat Topping");
  const veggieOptions = ingredients.filter(
    (i) => i.itemType === "Veggie Topping"
  );
  const sauceOptions = ingredients.filter((i) => i.itemType === "Sauce");

  // Fetch ingredients on component mount
  useEffect(() => {
    dispatch(ingredientGetAll());
  }, [dispatch]);

  // Calculate total price based on selected toppings
  // Base price is $6.00, first 3 toppings are free, additional toppings
  const calculateTotalPrice = useCallback(
    (meatToppings, veggieToppings) => {
      const basePrice = 6.0;
      const freeToppings = 3;

      const selectedMeat = meatToppings.filter(
        (meat) => meat !== "" && meat !== "- - None - -"
      );
      const selectedVeggie = veggieToppings.filter(
        (veggie) => veggie !== "" && veggie !== "- - None - -"
      );

      const totalToppings = selectedMeat.length + selectedVeggie.length;

      if (totalToppings <= freeToppings) {
        return basePrice;
      }

      const extraToppings = totalToppings - freeToppings;
      let extraCost = 0;

      const allToppings = [...selectedMeat, ...selectedVeggie].slice(
        -extraToppings
      );

      allToppings.forEach((topping) => {
        const meatPrice =
          meatOptions.find((m) => m.name === topping)?.price || 0;
        const veggiePrice =
          veggieOptions.find((v) => v.name === topping)?.price || 0;
        extraCost += meatPrice || veggiePrice;
      });

      return (basePrice + extraCost).toFixed(2);
    },
    [meatOptions, veggieOptions]
  );

  // Update pizza price whenever toppings change
  useEffect(() => {
    // Don't update state if price hasn't changed
    const newPrice = calculateTotalPrice(
      newPizza.meatTopping,
      newPizza.veggieTopping
    );

    if (newPrice !== newPizza.pizzaPrice) {
      setNewPizza((prev) => ({
        ...prev,
        pizzaPrice: newPrice,
      }));
    }
  }, [
    newPizza.meatTopping,
    newPizza.veggieTopping,
    newPizza.pizzaPrice,
    calculateTotalPrice,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit");
    setShowSuccessAlert(true);

    // Find the selected sauce object
    const sauceObj = sauceOptions.find((s) => s.name === newPizza.sauce);

    // Build meatTopping array of objects, filter out empty and "None" selections
    const meatToppingObjs = newPizza.meatTopping
      .filter((m) => m && m !== "- - None - -")
      .map((meat) => {
        const found = meatOptions.find((opt) => opt.name === meat);
        return found ? { ...found, amount: 1 } : null;
      })
      .filter(Boolean);

    // Build veggieTopping array of objects, filter out empty and "None" selections
    const veggieToppingObjs = newPizza.veggieTopping
      .filter((v) => v && v !== "- - None - -")
      .map((veggie) => {
        const found = veggieOptions.find((opt) => opt.name === veggie);
        return found ? { ...found, amount: 1 } : null;
      })
      .filter(Boolean);

    const finalPrice = calculateTotalPrice(
      newPizza.meatTopping,
      newPizza.veggieTopping
    );

    const pizzaData = {
      pizzaName: newPizza.pizzaName,
      pizzaPrice: finalPrice,
      base: newPizza.base,
      sauce: sauceObj,
      meatTopping: meatToppingObjs,
      veggieTopping: veggieToppingObjs,
      specialRequest: newPizza.specialRequest,
      quantity: 1,
    };

    dispatch(addToCart(pizzaData));

    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 2000);

    // Reset form to initial state
    setNewPizza({
      pizzaPrice: "6.00",
      pizzaName: "Build Your Own",
      base: [...base],
      sauce: "Signature Red Sauce",
      meatTopping: ["", "", "", "", "", ""],
      veggieTopping: ["", "", "", ""],
      specialRequest: "",
    });
    // Clear the textarea manually since it's not controlled
    const specialRequestTextarea = document.getElementById("special-request");
    if (specialRequestTextarea) {
      specialRequestTextarea.value = "";
    }
  };

  return (
    <>
      <div className="px-4 mx-auto w-3/4 sm:w-2/3 lg:w-1/2">
        <h2 className="berkshireSwashFont mt-5 text-center text-2xl font-bold text-slate-800 capitalize">
          Build Your own pizza
        </h2>
        <hr className="mb-6 sm:mx-auto lg:my-8 border-gray-700 " />
        {/* Flex container */}
        <div className="flex flex-wrap flex-row-reverse justify-center min-h-screen mb-20">
          <form onSubmit={handleSubmit} className="w-full bg-gray-100">
            {/* Custom border */}
            <div className="border-4 border-green-700">
              <div className="border-4 border-white">
                <div className="border-4 border-red-700 p-5">
                  {/* Beginning form fields */}
                  <p className="benthamFont mb-2 text-center text-2xl font-bold text-slate-800">
                    Pick up to 3 toppings
                  </p>
                  <p className="mb-4 text-center text-base text-red-700 font-semibold">
                    * Each additional topping beyond 3 will incur an extra
                    charge.
                  </p>
                  <h1 className="block mb-2 text-lg font-medium text-gray-900 text-left">
                    Pizza Base
                  </h1>
                  <hr className="mb-5" />
                  <div className="mb-5">
                    <label
                      htmlFor="pizza-name"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Crust and Cheese
                    </label>
                    <div
                      value={base[0].name}
                      id="crust"
                      className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light cursor-not-allowed 
                      text-black 
                        placeholder-gray-500 
                        border-slate-500
                        bg-gray-400 
                        focus:bg-sky-200 
                        focus:border-sky-700"
                    >
                      Brick Oven Crust
                      <div className="relative flex justify-end items-center">
                        <svg
                          className="w-6 h-6 text-green-300 absolute mb-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 11.917 9.724 16.5 19 7.5"
                          />
                        </svg>
                      </div>
                    </div>

                    <div
                      value={base[1].name}
                      id="cheese"
                      className="shadow-sm border-2 text-sm rounded-lg block w-full p-2.5 shadow-sm-light cursor-not-allowed
                      text-black 
                        placeholder-gray-500 
                        border-slate-500
                        bg-gray-400 03
                        focus:bg-sky-200 
                        focus:border-sky-700"
                    >
                      Italian Blend Cheese
                      <div className="relative flex justify-end items-center">
                        <svg
                          className="w-6 h-6 text-green-300 absolute mb-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 11.917 9.724 16.5 19 7.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="veggie-topping"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Select Sauce Type
                    </label>
                    <select
                      value={newPizza.sauce}
                      onChange={(e) =>
                        setNewPizza({ ...newPizza, sauce: e.target.value })
                      }
                      id="sauce-select"
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
                        <option key={sauce._id} value={sauce.name}>
                          {sauce.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">
                    Topping Options
                  </h1>

                  <h1 className="block mb-2 text-lg font-medium text-gray-900 text-left">
                    Meat
                  </h1>
                  <hr className="mb-5" />

                  <div id="nested-flex-container" className="nested-flex-meat">
                    {[...Array(6)].map((_, index) => (
                      <div key={`meat-${index}`} className="px-2">
                        <div className="mb-5">
                          <label
                            htmlFor={`meat-topping-${index}`}
                            className="block mb-2 text-sm font-medium text-gray-900 text-center"
                          >
                            Select Meat #{index + 1}
                          </label>
                          <select
                            value={newPizza.meatTopping[index]}
                            onChange={(e) => {
                              const newMeatToppings = [...newPizza.meatTopping];
                              newMeatToppings[index] = e.target.value;
                              setNewPizza({
                                ...newPizza,
                                meatTopping: newMeatToppings,
                              });
                            }}
                            id={`meat-type-${index}`}
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
                              <option key={meat._id} value={meat.name}>
                                {meat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Nested flex with 2 cols */}
                  <h1 className="block mb-2 text-lg font-medium text-gray-900 text-left">
                    Veggie
                  </h1>
                  <hr className="mb-5" />

                  <div
                    id="nested-flex-container"
                    className="nested-flex-veggie"
                  >
                    {[...Array(4)].map((_, index) => (
                      <div key={`veggie-${index}`} className="px-2">
                        <div className="mb-5">
                          <label
                            htmlFor={`veggie-topping-${index}`}
                            className="block mb-2 text-sm font-medium text-gray-900 text-center"
                          >
                            Select Veggie #{index + 1}
                          </label>
                          <select
                            value={newPizza.veggieTopping[index]}
                            onChange={(e) => {
                              const newVeggieToppings = [
                                ...newPizza.veggieTopping,
                              ];
                              newVeggieToppings[index] = e.target.value;
                              setNewPizza({
                                ...newPizza,
                                veggieTopping: newVeggieToppings,
                              });
                            }}
                            id={`veggie-type-${index}`}
                            className="text-sm rounded-lg block w-full p-2.5 shadow-sm-light border-2
                            text-white 
                            placeholder-gray-400 
                            border-green-800
                            bg-emerald-500
                            focus:bg-emerald-800
                            focus:ring-emerald-100
                            focus:border-emerald-200"
                          >
                            <option value="">- - None - -</option>
                            {veggieOptions.map((veggie) => (
                              <option key={veggie._id} value={veggie.name}>
                                {veggie.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h1 className="block mb-2 text-lg font-medium text-gray-900  capitalize text-center">
                    Special request's
                  </h1>

                  <div className="mb-5 m-2 w-full">
                    <textarea
                      value={newPizza.specialRequest}
                      onChange={(e) =>
                        setNewPizza({
                          ...newPizza,
                          specialRequest: e.target.value,
                        })
                      }
                      type="text"
                      id="special-request"
                      className="w-full shadow-sm border-2 text-sm rounded-lg block p-2.5 shadow-sm-light mb-5 ring-1
                       text-black 
                       placeholder-gray-500 
                       border-cyan-500
                       bg-gray-200 
                       focus:bg-gray-100 
                       focus:ring-cyan-300
                    "
                      placeholder="Light sauce"
                    ></textarea>
                  </div>
                  <div className="text-xl font-bold text-center mb-4">
                    Current Price: $ {Number(newPizza.pizzaPrice).toFixed(2)}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="submit"
                      className="cursor-pointer disabled:cursor-not-allowed font-medium rounded-lg text-sm w-[200px]
                    px-5 py-2.5 text-center bg-gradient-to-r  focus:ring-4 focus:outline-none hover:bg-gradient-to-br 
                      shadow-green-800/80 
                      hover:text-black
                      text-white 
                      from-cyan-400 
                      via-blue-700 
                      to-cyan-600
                      focus:ring-blue-800"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => navigate("/order-menu")}
                      type="button"
                      className="w-[200px] font-medium rounded-lg shadow-lg  text-sm px-5 py-2.5 text-center me-2 hover:bg-gradient-to-br bg-gradient-to-t  focus:ring-4 focus:outline-none cursor-pointer
                    shadow-red-800/80 
                    text-white 
                    from-red-600
                    via-red-500 
                    to-red-800
                    focus:ring-red-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showSuccessAlert && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2animate-fade-in-up">
          <AlertSuccess2
            successMsg={successMsg}
            successDescription={successDescription}
          />
        </div>
      )}
    </>
  );
};

export default BuildYourOwn;
