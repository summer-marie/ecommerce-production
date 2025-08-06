import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, removeFromCart } from "../redux/cartSlice";
import { createOrder } from "../redux/orderSlice";
import AlertSuccess from "../components/AlertSuccess";
import AlertBlack from "../components/AlertBlack";

const bitCoinSvg = (
  <svg
    className="w-4 h-4 me-2 -ms-1"
    aria-hidden="true"
    focusable="false"
    data-prefix="fab"
    data-icon="bitcoin"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M504 256c0 136.1-111 248-248 248S8 392.1 8 256 119 8 256 8s248 111 248 248zm-141.7-35.33c4.937-32.1-20.19-50.74-54.55-62.57l11.15-44.7-27.21-6.781-10.85 43.52c-7.154-1.783-14.5-3.464-21.8-5.13l10.93-43.81-27.2-6.781-11.15 44.69c-5.922-1.349-11.73-2.682-17.38-4.084l.031-.14-37.53-9.37-7.239 29.06s20.19 4.627 19.76 4.913c11.02 2.751 13.01 10.04 12.68 15.82l-12.7 50.92c.76 .194 1.744 .473 2.829 .907-.907-.225-1.876-.473-2.876-.713l-17.8 71.34c-1.349 3.348-4.767 8.37-12.47 6.464 .271 .395-19.78-4.937-19.78-4.937l-13.51 31.15 35.41 8.827c6.588 1.651 13.05 3.379 19.4 5.006l-11.26 45.21 27.18 6.781 11.15-44.73a1038 1038 0 0 0 21.69 5.627l-11.11 44.52 27.21 6.781 11.26-45.13c46.4 8.781 81.3 5.239 95.99-36.73 11.84-33.79-.589-53.28-25-65.99 17.78-4.098 31.17-15.79 34.75-39.95zm-62.18 87.18c-8.41 33.79-65.31 15.52-83.75 10.94l14.94-59.9c18.45 4.603 77.6 13.72 68.81 48.96zm8.417-87.67c-7.673 30.74-55.03 15.12-70.39 11.29l13.55-54.33c15.36 3.828 64.84 10.97 56.85 43.03z"
    ></path>
  </svg>
);

const paypalSvg = (
  <svg
    className="w-4 h-4 me-2 -ms-1"
    aria-hidden="true"
    focusable="false"
    data-prefix="fab"
    data-icon="paypal"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
  >
    <path
      fill="currentColor"
      d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9 .7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"
    ></path>
  </svg>
);

const applePaySvg = (
  <svg
    className="w-5 h-5 me-2 -ms-1"
    aria-hidden="true"
    focusable="false"
    data-prefix="fab"
    data-icon="apple"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
  >
    <path
      fill="currentColor"
      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
    ></path>
  </svg>
);

const successMsg = "Item deleted successfully";
const successDescription = "";

const alertMsg = "Are you sure you want to delete this order?";
const alertDescription = "Click to confirm and redirect back to menu";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // User info state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit");
    // dispatch(createOrder(order))
    const orderData = {
      firstName,
      lastName,
      address: {
        street,
        city,
        state: stateVal,
        zip,
      },
      phone,
      orderDetails: cartItems.map((item) => ({
        pizzaName: item.pizzaName,
        pizzaPrice: Number(item.pizzaPrice),
        quantity: item.quantity || 1,
      })),
      orderTotal: calculateTotal(),
    };
    try {
      await dispatch(createOrder(orderData)).unwrap();
      // handle success (e.g., show alert, clear cart, redirect)
    } catch (error) {
      console.error("Failed to create order:", error);
    }

    setTimeout(() => {
      setShowSuccessAlert(false);
      dispatch(clearCart());
      navigate("/order-success");
    }, 1500);
  };

  const handleItemDelete = (cartItemId) => {
    console.log("Item delete button works!!!");
    setShowSuccessAlert(true);
    dispatch(removeFromCart(cartItemId));
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 1500);
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleConfirm = () => {
    dispatch(clearCart());
    console.log("Order deleted");
    setTimeout(() => {
      setShowAlert(false);
      navigate("/order-menu");
    }, 2000);
  };

  // Loops through items
  // and calculates the total price of all items in the cart
  // Returns a string with 2 decimal places
  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + Number(item.pizzaPrice), 0)
      .toFixed(2);
  };

  // Format the phone number as (123) 456-7890
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");
    // Match the cleaned value against the phone number pattern
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return "";
    // Format the matched groups into the desired phone number format
    let formatted = "";
    // If the first group is not empty, add parentheses
    if (match[1]) {
      formatted = `(${match[1]}`;
    }
    // If the second group is not empty, add a space and the second group
    if (match[2]) {
      formatted += match[2].length === 3 ? `) ${match[2]}` : match[2];
    }
    // If the third group is not empty, add a hyphen and the third group
    if (match[3]) {
      formatted += match[3] ? `-${match[3]}` : "";
    }
    return formatted;
  };

  return (
    <>
      <form onSubmit={handleSubmit} autoComplete="off" className="mt-10 ">
        <div className="min-h-screen mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-start justify-center mx-auto space-y-6 sm:space-y-0 sm:space-x-6 w-2/3 bg-gray-100">
            <ul
              role="list"
              className="divide-y w-full border-2 rounded-xl p-5
              divide-gray-200
              border-red-700 "
            >
              {" "}
              <div className="text-center rounded-t-xl mb-5">
                <h1 className="font-medium mx-auto capitalize">
                  Order information
                </h1>
              </div>
              <li className="px-2">
                <div className="flex justify-between space-x-6 w-full">
                  <div className="space-y-1 w-3/4 relative">
                    {cartItems.map((item, idx) => (
                      <div
                        key={item.cartItemId || idx}
                        className="flex items-center space-x-4 mt-1 relative"
                      >
                        <button
                          onClick={() => handleItemDelete(item.cartItemId)}
                          type="button"
                          className="text-sm font-medium text-red-700 border-2 border-red-700 rounded-xl px-3 py-1 hover:bg-red-700 hover:text-white hover:border-black cursor-pointer capitalize"
                        >
                          remove item
                        </button>
                        <span className="text-lg font-medium text-gray-900 capitalize">
                          {item.pizzaName}
                        </span>
                        <span className="text-lg text-gray-500 ml-auto">
                          $ {item.pizzaPrice}
                        </span>
                      </div>
                    ))}

                    <div className="bottom-0 absolute w-full">
                      <hr className="w-full mt-3"></hr>
                      <div className="flex items-center justify-between mt-4">
                        <dt className="text-xl font-medium text-gray-900">
                          Total
                        </dt>
                        <dd className="text-lg text-gray-500 mr-1">
                          $ {calculateTotal()}
                        </dd>
                      </div>
                    </div>
                  </div>
                  {/* User info form */}
                  <div className="space-y-2 w-1/2 mb-5 mr-5">
                    {/* Nested flex box */}
                    <div className="flex space-x-2">
                      <div className="w-1/2">
                        <label
                          htmlFor="firstName"
                          className="block text-md font-medium text-gray-900"
                        >
                          First Name
                        </label>
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          type="text"
                          id="firstName"
                          className="shadow-sm mt-1 block w-full sm:text-sm rounded-md border-2 p-1
                      border-red-700  "
                          placeholder="Sally"
                          required
                        />
                      </div>
                      <div className="w-1/2">
                        <label
                          htmlFor="lastName"
                          className="block text-md font-medium text-gray-900"
                        >
                          Last Name
                        </label>
                        <input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          type="text"
                          id="lastName"
                          className="shadow-sm mt-1 block w-full sm:text-sm rounded-md border-2 p-1
                      border-red-700 "
                          placeholder="Smith"
                          required
                        />
                      </div>
                    </div>

                    <label
                      htmlFor="street"
                      className="block text-md font-medium text-gray-900"
                    >
                      Street
                    </label>
                    <input
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      type="text"
                      id="street"
                      name="street"
                      autoComplete="address-line1"
                      className="shadow-sm mt-1 block w-full sm:text-sm rounded-md border-2 p-1 border-red-700"
                      placeholder="123 Main St"
                      required
                    />

                    <label
                      htmlFor="city"
                      className="block text-md font-medium text-gray-900"
                    >
                      City
                    </label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      type="text"
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      className="shadow-sm mt-1 block w-full sm:text-sm rounded-md border-2 p-1 border-red-700"
                      placeholder="Goodyear"
                      required
                    />
                    <div className="flex space-x-2">
                      <div className="w-1/2">
                        <label
                          htmlFor="state"
                          className="block text-md font-medium text-gray-900"
                        >
                          State
                        </label>
                        <select
                          value={stateVal}
                          onChange={(e) => setStateVal(e.target.value)}
                          type="text"
                          id="state"
                          className="shadow-sm mt-1 block w-full sm:text-sm rounded-md border-2 p-1 
                      border-red-700 "
                          name="state"
                          required
                        >
                          <option value="">Select a state</option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          <option value="AR">Arkansas</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="CT">Connecticut</option>
                          <option value="DE">Delaware</option>
                          <option value="FL">Florida</option>
                          <option value="GA">Georgia</option>
                          <option value="HI">Hawaii</option>
                          <option value="ID">Idaho</option>
                          <option value="IL">Illinois</option>
                          <option value="IN">Indiana</option>
                          <option value="IA">Iowa</option>
                          <option value="KS">Kansas</option>
                          <option value="KY">Kentucky</option>
                          <option value="LA">Louisiana</option>
                          <option value="ME">Maine</option>
                          <option value="MD">Maryland</option>
                          <option value="MA">Massachusetts</option>
                          <option value="MI">Michigan</option>
                          <option value="MN">Minnesota</option>
                          <option value="MS">Mississippi</option>
                          <option value="MO">Missouri</option>
                          <option value="MT">Montana</option>
                          <option value="NE">Nebraska</option>
                          <option value="NV">Nevada</option>
                          <option value="NH">New Hampshire</option>
                          <option value="NJ">New Jersey</option>
                          <option value="NM">New Mexico</option>
                          <option value="NY">New York</option>
                          <option value="NC">North Carolina</option>
                          <option value="ND">North Dakota</option>
                          <option value="OH">Ohio</option>
                          <option value="OK">Oklahoma</option>
                          <option value="OR">Oregon</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="RI">Rhode Island</option>
                          <option value="SC">South Carolina</option>
                          <option value="SD">South Dakota</option>
                          <option value="TN">Tennessee</option>
                          <option value="TX">Texas</option>
                          <option value="UT">Utah</option>
                          <option value="VT">Vermont</option>
                          <option value="VA">Virginia</option>
                          <option value="WA">Washington</option>
                          <option value="WV">West Virginia</option>
                          <option value="WI">Wisconsin</option>
                          <option value="WY">Wyoming</option>
                        </select>
                      </div>
                      <div className="w-1/2">
                        <label
                          htmlFor="zip"
                          className="block text-md font-medium text-gray-900"
                        >
                          Zipcode
                        </label>
                        <input
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          type="text"
                          id="zip"
                          name="zip"
                          pattern="[0-9]{5}(-[0-9]{4})?"
                          maxLength={10}
                          autoComplete="postal-code"
                          className="shadow-sm mt-1 block w-full sm:text-sm rounded-md border-2 p-1 border-red-700 focus:ring-2 focus:ring-red-400 focus:border-red-400"
                          placeholder="12345"
                          required
                        />
                      </div>
                    </div>
                    <label
                      htmlFor="phone"
                      className="block text-md font-medium text-gray-900"
                    >
                      Phone
                    </label>
                    <input
                      value={phone}
                      onChange={(e) =>
                        setPhone(formatPhoneNumber(e.target.value))
                      }
                      type="tel"
                      id="phone"
                      name="phone"
                      maxLength={14}
                      autoComplete="tel"
                      className="shadow-sm mt-1 block w-full sm:text-sm rounded-md border-2 p-1 border-red-700 focus:ring-2 focus:ring-red-400 focus:border-red-400"
                      placeholder="555-555-5555"
                      required
                    />
                  </div>
                </div>
              </li>
              <div className="flex justify-center mt-5">
                <button
                  onClick={() => setShowAlert(true)}
                  type="button"
                  className="bg-gradient-to-r hover:bg-gradient-to-br focus:ring-4 focus:outline-none shadow-lg shadow-red-500/50  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer
                  text-white 
                  from-red-400 
                  via-red-500 
                  to-red-600  
                  focus:ring-red-800 "
                >
                  Cancel Order
                </button>

                <button
                  type="submit"
                  className="cursor-pointer  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 shadow-lg shadow-cyan-300
                  bg-[#16b4f3] 
                  hover:bg-[#16b4f3]/90  
                  focus:ring-sky-800/50 
                  text-gray-900 "
                >
                  {paypalSvg}
                  Check out with PayPal
                </button>

                <button
                  type="submit"
                  className="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 shadow-lg cursor-pointer 
                  shadow-black
                  text-white 
                  bg-[#050708] 
                  hover:bg-[#050708]/80  
                  focus:ring-[#050708]/50"
                >
                  {applePaySvg}
                  Check out with Apple Pay
                </button>

                <button
                  type="submit"
                  className=" focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 shadow-lg cursor-pointer 
                  shadow-amber-600
                  text-white 
                  bg-[#FF9119] 
                  hover:bg-[#FF9119]/80 
                  focus:ring-[#FF9119]/50"
                >
                  {bitCoinSvg}
                  Pay with Bitcoin
                </button>
              </div>
            </ul>
          </div>
        </div>
      </form>
      {/* Success alert  */}
      {showSuccessAlert && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-opacity-30 border-green-400">
          <AlertSuccess
            successMsg={successMsg}
            successDescription={successDescription}
          />
        </div>
      )}

      {/* Delete confirmation alert  */}
      {showAlert && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-opacity-30 rounded-2xl border-6 ">
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

export default Checkout;
