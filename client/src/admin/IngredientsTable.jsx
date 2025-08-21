import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createIngredient,
  ingredientGetAll,
  ingredientUpdateOne,
  ingredientDeleteOne,
} from "../redux/ingredientSlice";
import AlertBlack from "../components/AlertBlack";
import SpinnerBubbles from "../components/SpinnerBubbles";

// Add new ingredient modal
const IngredientModal = ({ isOpen, onClose, setShowModal }) => {
  const initialFormState = {
    name: "",
    description: "",
    itemType: "",
    price: 0,
  };
  const [formData, setFormData] = useState(initialFormState);
  const dispatch = useDispatch();

  // Handle inline input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const capitalizeWords = (str) =>
      str.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
    const capitalizeFirstLetter = (str) =>
      str.charAt(0).toUpperCase() + str.slice(1); // Capitalize only the first letter of the sentence

    setFormData((prevState) => ({
      ...prevState,
      [name]:
        name === "price"
          ? value.replace(/^0+/, "")
          : name === "name"
          ? capitalizeWords(value) // Apply capitalization to "name"
          : name === "description"
          ? capitalizeFirstLetter(value) // Apply first-letter capitalization to "description"
          : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handle submit");
    const newIngredient = {
      ...formData,
      price: formData.price === "" ? 0 : parseFloat(formData.price),
    };
    // dispatch(createIngredient(newIngredient));
    await dispatch(createIngredient(newIngredient)).unwrap();
    await dispatch(ingredientGetAll()).unwrap();

    setFormData(initialFormState);
    setShowModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="min-h-[50%] p-2">
        <div className="flex flex-col w-auto md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 rounded-2xl shadow-2xl shadow-cyan-800/80  bg-stone-300">
          <div className="flex flex-row gap-3 pb-4 ">
            <h1 className="text-3xl font-bold text-[#4B5563] mx-auto my-auto capitalize text-center">
              add ingredient to table
              <p className="text-sm text-red-500 me-2 pt-4">
                All fields are required
              </p>
            </h1>
          </div>
          {/* shadow-lg shadow-cyan-800/80  */}

          <form onSubmit={handleSubmit} className="flex flex-col ">
            <div className="pb-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-[#111827]"
              >
                Item Name
              </label>
              <div className=" text-gray-400">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-5 mb-2 focus:border-transparent sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden  block w-full p-2.5 rounded-l-lg py-3 px-4
                  bg-gray-50 
                  text-gray-600 border 
                  border-gray-300 
                  focus:ring-gray-400"
                  required
                />
              </div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-[#111827]"
              >
                Item Description
              </label>
              <div className=" text-gray-400">
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="pl-5 mb-2 focus:border-transparent sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden  block w-full p-2.5 rounded-l-lg py-3 px-4
                  bg-gray-50 
                  text-gray-600 border 
                  border-gray-300 
                  focus:ring-gray-400"
                />
              </div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-[#111827]"
              >
                Item Type (Category)
              </label>
              <div className=" text-gray-400">
                <select
                  id="itemType"
                  name="itemType"
                  value={formData.itemType}
                  onChange={handleChange}
                  className="text-sm rounded-lg block w-full p-2.5  shadow-sm-light border-2 capitalize
                          text-white 
                          placeholder-gray-400 
                          border-cyan-950
                          bg-cyan-800 
                          focus:bg-cyan-950 
                          focus:ring-cyan-500
                          focus:border-cyan-500"
                >
                  <option defaultValue>Select type from list</option>
                  <option value="Base">Base: Crust or Cheese</option>
                  <option value="Sauce">Sauce</option>
                  <option value="Meat Topping">Meat Topping</option>
                  <option value="Veggie Topping">Veggie Topping</option>
                </select>
              </div>
            </div>
            <div className="pb-6">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-[#111827]"
              >
                Item Price $
              </label>
              <div className=" text-gray-400">
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.25"
                  value={formData.price}
                  onChange={handleChange}
                  className="pl-5 mb-2 border focus:border-transparent sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden block w-full p-2.5 rounded-l-lg py-3 px-4
                    bg-gray-50 
                    text-gray-600 
                    border-gray-300 
                    focus:ring-gray-400"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="cursor-pointer w-full focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 
              text-[#FFFFFF] 
              bg-cyan-800 
              hover:bg-cyan-600 "
            >
              Add
            </button>
            <button
              onClick={onClose}
              name="close-button"
              type="button"
              className="cursor-pointer w-full focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 
              text-[#FFFFFF] 
              bg-black 
              hover:bg-slate-800"
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const alertMsg = "Are you sure you want to delete?";
const alertDescription =
  "Ingredient will be permanently removed from the data set";

const IngredientsTable = () => {
  const { ingredients } = useSelector((state) => state.ingredient);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // State to track which ingredient is being edited
  const [editing, setEditing] = useState({});
  // State to track loading state for saving changes
  const [loading, setLoading] = useState(false);
  // State to track which ingredient is being deleted
  const [deleteId, setDeleteId] = useState(null);
  // State to track which ingredient is being saved
  const [savingId, setSavingId] = useState(null);
  // Alert Position
  const [alertPosition, setAlertPosition] = useState({ top: 0, left: 0 });
  // State to track the clicked ingredient
  const [alertIngredient, setAlertIngredient] = useState(null);

  const itemTypesArray = ["Base", "Sauce", "Meat Topping", "Veggie Topping"];

  const dispatch = useDispatch();

  // Grab ingredients from database
  useEffect(() => {
    dispatch(ingredientGetAll());
  }, [dispatch]);

  // Log editing state to console for debugging
  useEffect(() => {
    console.log(editing);
  }, [editing]);

  // Function to count ingredients by type
  const getIngredientTypeCounts = () => {
    return ingredients.reduce(
      (counts, ingredient) => {
        if (ingredient.itemType in counts) {
          counts[ingredient.itemType]++;
        }
        return counts;
      },
      {
        Base: 0,
        Sauce: 0,
        "Meat Topping": 0,
        "Veggie Topping": 0,
        Total: ingredients.length,
      }
    );
  };

  // Add New ingredient Modal
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdate = async () => {
    setSavingId(editing.id);
    setLoading(true);
    try {
      // Ensure price is properly converted to number
      const updateData = {
        ...editing,
        price: editing.price === "" ? 0 : parseFloat(editing.price) || 0,
      };

      // Update the ingredient
      await dispatch(ingredientUpdateOne(updateData)).unwrap();
      // Clear editing state
      setEditing({});
      // Fetch fresh, sorted data from server
      await dispatch(ingredientGetAll()).unwrap();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setSavingId(null);
      setLoading(false);
    }
  };

  // Alert functions
  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleConfirm = async () => {
    setShowAlert(false);
    if (deleteId) {
      console.log("Deleting ingredient with ID:", deleteId); // Log deleteId
      await dispatch(ingredientDeleteOne(deleteId)).unwrap();
      await dispatch(ingredientGetAll()).unwrap(); // Refresh ingredients list
      setDeleteId(null);
    } else {
      console.error("No deleteId set");
    }
  };

  // Pass the ingredient name dynamically to the alert
  const dynamicAlertMsg = alertIngredient ? (
    <>
      Are you sure you want to delete{" "}
      <span className="text-red-500 italic p-2">{alertIngredient.name}</span>?
    </>
  ) : (
    alertMsg
  );

  // State for sorting
  const [sortConfig, setSortConfig] = useState(null);

  // Sorting function
  const sortedIngredients = () => {
    const sortableItems = [...ingredients];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const isAsc = sortConfig.direction === "ascending";
        switch (sortConfig.key) {
          case "itemType":
            return isAsc
              ? a.itemType.localeCompare(b.itemType)
              : b.itemType.localeCompare(a.itemType);
          case "name":
            return isAsc
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          case "description":
            return isAsc
              ? a.description.localeCompare(b.description)
              : b.description.localeCompare(a.description);
          case "price":
            return isAsc ? a.price - b.price : b.price - a.price;
          default:
            return 0;
        }
      });
    }
    return sortableItems;
  };

  // Handle sort request
  const handleSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <div className="px-4">
        {/* Centers Button above table */}
        <div className="flex items-center justify-center w-full">
          <button onClick={handleOpenModal} className="p-5">
            <div
              className="cursor-pointer w-full focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-lg
              shadow-cyan-800/80 
              text-[#FFFFFF] 
              bg-cyan-800 
              hover:bg-cyan-600 "
            >
              <p className="text-2xl text-gray-300">Add Ingredient</p>
            </div>
          </button>
        </div>
        <IngredientModal
          isOpen={showModal}
          onClose={handleCloseModal}
          setShowModal={setShowModal}
        />
        {/* Badge counts - using same styling pattern as OrderOpen */}
        <div className="flex justify-center gap-4 mb-6">
          {Object.entries(getIngredientTypeCounts()).map(([type, count]) => (
            <div
              key={type}
              className={`
              px-4 py-2 rounded-full font-semibold border-2
              ${
                type === "Base"
                  ? "bg-blue-100 text-blue-800 border-blue-800"
                  : ""
              }
              ${
                type === "Sauce" ? "bg-red-100 text-red-800 border-red-800" : ""
              }
              ${
                type === "Meat Topping"
                  ? "bg-orange-100 text-orange-800 border-orange-800"
                  : ""
              }
              ${
                type === "Veggie Topping"
                  ? "bg-green-100 text-green-800 border-green-800"
                  : ""
              }
            `}
            >
              {type}: {count}
            </div>
          ))}
        </div>
        {/*  Table container  */}
        <div className="mt-0 mb-16">
          <div
            name="ingredients-table"
            className="shadow-2xl  overflow-hidden "
          >
            <table
              className="w-full text-sm text-left rtl:text-right
            text-gray-500 shadow-lg shadow-cyan-800/80 border-l-2 border-r-2 border-b-2 border-t-0 border-teal-600 "
            >
              <thead
                className="text-xs uppercase 
              bg-gray-400
              text-teal-950"
              >
                <tr>
                  <th scope="col" className="px-2 py-4">
                    category (A-Z)
                    <span className="ml-2">
                      <button onClick={() => handleSort("itemType")}>▲▼</button>
                    </span>
                  </th>
                  <th scope="col" className="px-2 py-4">
                    name
                    <span className="ml-2">
                      <button onClick={() => handleSort("name")}>▲▼</button>
                    </span>
                  </th>
                  <th scope="col" className="px-2 py-4">
                    description
                    <span className="ml-2">
                      <button onClick={() => handleSort("description")}>
                        ▲▼
                      </button>
                    </span>
                  </th>
                  <th scope="col" className="px-2 py-4 text-center">
                    $ unit price
                    <span className="ml-2">
                      <button onClick={() => handleSort("price")}>▲▼</button>
                    </span>
                  </th>
                  <th scope="col" className="px-2 py-4 text-center">
                    Update
                  </th>
                  <th scope="col" className="px-2 py-4 text-center">
                    delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedIngredients().map((ingredient, index) =>
                  savingId === ingredient.id ? (
                    // Show spinner while saving
                    <tr key={ingredient.id || index}>
                      <td
                        colSpan={6}
                        className="py-6 text-center bg-transparent"
                      >
                        <SpinnerBubbles loading={loading} size={14} />
                      </td>
                    </tr>
                  ) : (
                    // Show ingredient row
                    <tr
                      key={ingredient.id || index}
                      ingredient={ingredient}
                      className=" border-b px-2 py-2
                  odd:bg-stone-200
                  even:bg-gray-300 
                  border-gray-700"
                    >
                      <td // itemType
                        className="px-2 py-2"
                      >
                        {editing.id === ingredient.id ? (
                          <select
                            className="bg-white rounded-2xl p-2 w-full"
                            value={editing.itemType}
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                itemType: e.target.value,
                              })
                            }
                          >
                            <option defaultValue={ingredient.itemType}>
                              {ingredient.itemType}
                            </option>
                            {/* Only show types that are different from default */}
                            {ingredient.itemType &&
                              [...itemTypesArray]
                                .filter((type) => type !== ingredient.itemType)
                                .map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                          </select>
                        ) : (
                          ingredient.itemType
                        )}
                      </td>

                      <td // Name
                        className="px-2 py-2"
                      >
                        {editing.id === ingredient.id ? (
                          <input
                            className="bg-white rounded-2xl p-2 w-full"
                            value={editing.name}
                            onChange={(e) =>
                              setEditing({ ...editing, name: e.target.value })
                            }
                          />
                        ) : (
                          ingredient.name
                        )}
                      </td>
                      <td
                        // description
                        className="px-2 py-2"
                      >
                        {editing.id === ingredient.id ? (
                          <input
                            className="bg-white rounded-2xl p-2  w-full"
                            value={editing.description}
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                description: e.target.value,
                              })
                            }
                          />
                        ) : (
                          ingredient.description
                        )}
                      </td>
                      <td // Price
                        className="px-2 py-2 text-center"
                      >
                        $
                        {editing.id === ingredient.id ? (
                          <input
                            className="bg-white rounded-2xl p-2"
                            value={editing.price}
                            onChange={(e) =>
                              setEditing({ ...editing, price: e.target.value })
                            }
                          />
                        ) : (
                          parseFloat(ingredient.price).toFixed(2) // 0.00
                        )}
                      </td>

                      <td className="px-2 py-2">
                        {editing.id === ingredient.id ? (
                          <button
                            type="button"
                            className="font-medium hover:underline text-lg disabled:cursor-not-allowed  w-full h-full cursor-pointer
                        text-cyan-600"
                            onClick={() => handleUpdate()}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="font-medium hover:underline text-lg disabled:cursor-not-allowed  w-full h-full cursor-pointer
                        text-cyan-600"
                            onClick={() => setEditing({ ...ingredient })}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setAlertPosition({
                              top: rect.top + window.scrollY,
                              left: rect.left + window.scrollX,
                            });
                            setAlertIngredient(ingredient); // Set the clicked ingredient
                            setDeleteId(ingredient.id);
                            setShowAlert(true);
                          }}
                          type="button"
                          className="font-medium  cursor-pointer
                      text-red-700 w-full h-full border-3 rounded-xl hover:bg-red-700 
                      hover:text-white 
                      hover:border-black"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAlert && (
        <div
          className="absolute z-30 min-w-sm"
          style={{
            top: `${alertPosition.top - 50}px`, // Adjusted to center vertically
            left: `${Math.min(alertPosition.left, window.innerWidth - 800)}px`, // Prevent overflow
          }}
        >
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

export default IngredientsTable;
