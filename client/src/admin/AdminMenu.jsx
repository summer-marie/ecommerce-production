import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { builderGetMany, builderDeleteOneAlt } from "../redux/builderSlice";
import { useSelector, useDispatch } from "react-redux";
import AlertBlack from "../components/AlertBlack";

const alertMsg = "Delete Pizza from Menu";
const alertDescription =
  "This action cannot be undone. The pizza will be permanently removed from the customer menu.";

const AdminMenu = () => {
  const [showAlert, setShowAlert] = useState(false);
  const { builders } = useSelector((state) => state.builder);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(builderGetMany());
  }, [dispatch]);

  // Use a ref to store the ID of the pizza to be deleted
  const deleteIdRef = useRef(null);

  const handleDeleteClick = (id) => {
    deleteIdRef.current = id;
    setShowAlert(true);
  };

  const handleConfirm = async () => {
    setShowAlert(false);
    const id = deleteIdRef.current;
    dispatch(builderDeleteOneAlt(id));
    deleteIdRef.current = null;
    console.log("Pizza deleted with ID:", id);
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleClick = (id) => {
    // Navigate to the EditPizza page with the selected pizza ID
    navigate(`/admin-update-one/${id}`);
  };

  return (
    <>
      <div className="ml-64 px-4">
        {/* Header  */}
        <h2 className="berkshireSwashFont mt-5 text-center text-2xl font-bold text-slate-800">
          Current Customer Menu
        </h2>
        <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700 " />
        {/* Grid container Responsive */}
        <div className="mb-10 mx-auto w-full px-6 py-2 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="drop-shadow-lg grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-4 mb-10 pb-12">
            {/* Cards */}
            {builders.length === 0 ? (
              <p>No pizzas found.</p>
            ) : (
              builders.map((builder, index) => (
                // Card
                <div
                  key={builder.id || index}
                  className="max-w-2xl col-1-4 rounded-lg shadow-2xl bg-zinc-300 border border-gray-200 shadow-green-600 relative"
                >
                  <div className="relative">
                    <div className="relative w-full aspect-[4/3]">
                      <img
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg rounded-s-lg"
                        src={
                          builder.image && builder.image.filename
                            ? `${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                                builder.image.filename
                              }`
                            : new URL(
                                "../assets/basePizza.jpg",
                                import.meta.url
                              ).href
                        }
                        alt={builder.pizzaName || "Pizza"}
                      />
                    </div>
                    <button
                      onClick={() => handleClick(builder.id)}
                      type="button"
                      className="absolute mt-2 top-0 right-0 font-medium rounded-lg shadow-lg  text-sm px-5 py-2.5 text-center me-2 mb-2 hover:bg-gradient-to-br bg-gradient-to-t  focus:ring-4 focus:outline-none cursor-pointer
                shadow-green-800/80 
                text-white 
                from-green-950
                via-green-500 
                to-green-600
                focus:ring-green-800"
                    >
                      Update Pizza
                    </button>
                    <button
                      key={builder.id}
                      onClick={() => handleDeleteClick(builder.id)}
                      type="button"
                      className="absolute z-10 mt-2 top-0 left-2 font-medium rounded-lg shadow-lg  text-sm px-5 py-2.5 text-center me-2 mb-2 hover:bg-gradient-to-br bg-gradient-to-t  focus:ring-4 focus:outline-none cursor-pointer
                shadow-red-800/80 
                text-white 
                from-black
                via-red-500 
                to-red-600
                focus:ring-red-800"
                    >
                      Delete Pizza
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-gray-900">
                      <strong>Name: {builder.pizzaName}</strong>
                    </p>

                    <div className="space-y-1">
                      <div>
                        <strong>Pizza Base:</strong>
                        <span className="ml-2">
                          {builder.base &&
                            builder.base.map((b) => b.name).join(", ")}
                        </span>
                      </div>
                      <div>
                        <strong>Sauce:</strong>
                        <span className="ml-2">
                          {builder.sauce &&
                            (builder.sauce.name || builder.sauce)}
                        </span>
                      </div>
                      <div>
                        <strong>Meats:</strong>
                        <span className="ml-2">
                          {builder.meatTopping &&
                            builder.meatTopping.map((m) => m.name).join(", ")}
                        </span>
                      </div>
                      <div>
                        <strong>Veggies:</strong>
                        <span className="ml-2">
                          {builder.veggieTopping &&
                            builder.veggieTopping.map((v) => v.name).join(", ")}
                        </span>
                      </div>
                    </div>

                    <h2 className="font-bold text-lg text-gray-900 mt-2">
                      Price $ {Number(builder.pizzaPrice).toFixed(2)}
                    </h2>
                  </div>
                </div>
              ))
            )}
            {/* End of card */}
          </div>
        </div>
      </div>

      {showAlert && (
        <div className="fixed top-1/2 left-[calc(50%+8rem)] transform -translate-x-1/2 -translate-y-1/2 z-50">
          <AlertBlack
            alertMsg={alertMsg}
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
