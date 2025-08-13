import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, removeFromCart } from "../redux/cartSlice";
import { createOrder, markOrderPaymentFailed } from "../redux/orderSlice";
import AlertSuccess from "../components/AlertSuccess";
import AlertBlack from "../components/AlertBlack";
import SquarePayment from "../components/SquarePayment";

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

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [paymentHandler, setPaymentHandler] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit");
    setPaymentError("");
    
    // Validate form data
    if (!firstName || !lastName || !street || !city || !stateVal || !zip || !phone) {
      setPaymentError("Please fill in all required fields");
      return;
    }

    if (cartItems.length === 0) {
      setPaymentError("Cart is empty");
      return;
    }

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
      // Create as processing; payment will update status to completed via backend
      status: "processing",
    };

    // Process payment based on method
    if (paymentMethod === "square" && paymentHandler) {
      setIsPaymentProcessing(true);
      let createdOrderNumber;
      try {
        // 1) Create the order first to get a real orderNumber
        const created = await dispatch(createOrder(orderData)).unwrap();
        createdOrderNumber = Number(created?.order?.orderNumber);
        if (!createdOrderNumber || Number.isNaN(createdOrderNumber)) {
          throw new Error("Failed to get orderNumber");
        }

        // 2) Call the Square payment handler with orderNumber
        await paymentHandler({
          ...orderData,
          orderNumber: createdOrderNumber,
        });
        // handlePaymentSuccess will finish the UX
      } catch (error) {
        console.error("Payment flow failed:", error);
        // Attempt soft-cancel via Redux thunk
        if (createdOrderNumber) {
          try {
            await dispatch(
              markOrderPaymentFailed({
                orderNumber: createdOrderNumber,
                reason: error?.response?.data?.details || error?.message || "payment_failed",
              })
            ).unwrap();
          } catch (e) {
            console.warn("Soft-cancel failed:", e?.message);
          }
        }
        setPaymentError(
          error?.response?.data?.message || error?.message || "Payment processing failed. Please try again."
        );
        setIsPaymentProcessing(false);
      }
    } else if (paymentMethod === "cash") {
      // Process cash payment
      handleCashPayment(orderData);
    } else {
      setPaymentError("Please select a payment method");
    }
  };

  const handleCashPayment = async (orderData) => {
    setIsPaymentProcessing(true);
    try {
      // Create order with cash payment info
      const cashOrderData = {
        ...orderData,
        payment: {
          status: "pending",
          method: "cash",
          amountPaid: calculateTotal(),
          paidAt: null // Will be updated when cash is received
        }
      };

      await dispatch(createOrder(cashOrderData)).unwrap();
      
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        dispatch(clearCart());
        navigate("/order-success");
      }, 1500);
      
    } catch (error) {
      console.error("Failed to create cash order:", error);
      setPaymentError("Failed to create order. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handlePayWithCard = () => {
    setPaymentMethod("square");
    setShowCardForm(true);
    setPaymentError("");
  };

  const handlePayWithCash = () => {
    setPaymentMethod("cash");
    setShowCardForm(false);
    setPaymentError("");
  };

  const handlePaymentSuccess = async (paymentResult) => {
    console.log("Payment successful:", paymentResult);
    
    try {
      // Order was already created. Backend updated it via orderNumber.
      // Just clear cart and navigate to success.
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        dispatch(clearCart());
        navigate("/order-success");
      }, 1000);
      
    } catch (error) {
      console.error("Post-payment flow failed:", error);
      setPaymentError("Payment completed but there was an app error. Please contact support.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    setPaymentError(error);
    setIsPaymentProcessing(false);
  };

  const handlePaymentReady = (handler) => {
    setPaymentHandler(() => handler);
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
      <form onSubmit={handleSubmit} autoComplete="off" className="mt-10 mb-20">
        <div className="min-h-screen mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-start justify-center mx-auto space-y-6 sm:space-y-0 sm:space-x-6 w-2/3 bg-gray-100 mb-10 h-full">
            <ul
              role="list"
              className="divide-y w-full border-2 rounded-xl p-5
              divide-gray-200
              border-red-700 mb-10 h-full"
            >
              {" "}
              <div className="text-center rounded-t-xl mb-5">
                <h1 className="font-medium mx-auto capitalize">
                  Order information
                </h1>
              </div>
              <li className="px-2">
                <div className="flex justify-between space-x-6 w-full">
                  <div className="space-y-1 w-3/4">
                    {cartItems.map((item, idx) => (
                      <div
                        key={item.cartItemId || idx}
                        className="flex items-center space-x-4 mt-1"
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

                    <div className="w-full mt-6">
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
              
              {/* Payment Error Display */}
              <li className="px-2 py-4">
                {paymentError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {paymentError}
                  </div>
                )}

                {/* Payment Method Selection */}
                {!paymentMethod && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Payment Method</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={handlePayWithCard}
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                      >
                        Pay with Card
                      </button>
                      <button
                        type="button"
                        onClick={handlePayWithCash}
                        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-300"
                      >
                        Pay Cash On-Site
                      </button>
                    </div>
                  </div>
                )}

                {/* Square Payment Form - Only show if card payment selected */}
                {showCardForm && paymentMethod === "square" && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Card Payment</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod(null);
                          setShowCardForm(false);
                          setPaymentError("");
                        }}
                        className="text-black hover:text-gray-700 cursor-pointer border-gray-700 border-2 rounded-lg px-3 py-1 hover:bg-white bg-green-400"
                      >
                        Change Payment Method
                      </button>
                    </div>
                    <SquarePayment
                      orderTotal={calculateTotal()}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      onPaymentReady={handlePaymentReady}
                    />
                  </div>
                )}

                {/* Cash Payment Confirmation */}
                {paymentMethod === "cash" && !showCardForm && (
                  <div className="mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-green-800">Cash Payment Selected</h3>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod(null);
                            setPaymentError("");
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          Change Payment Method
                        </button>
                      </div>
                      <p className="text-green-700">
                        You will pay <strong>${calculateTotal()}</strong> in cash when you pick up your order.
                      </p>
                    </div>
                  </div>
                )}

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

                  {/* Dynamic submit button based on payment method */}
                  {paymentMethod === "cash" && (
                    <button
                      type="submit"
                      disabled={isPaymentProcessing}
                      className={`focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 shadow-lg cursor-pointer 
                      ${isPaymentProcessing 
                        ? 'bg-gray-400 shadow-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'shadow-green-600 text-white bg-green-600 hover:bg-green-700 focus:ring-green-800'
                      }`}
                    >
                      {isPaymentProcessing ? 'Processing...' : 'Complete Order'}
                    </button>
                  )}

                  {paymentMethod === "square" && showCardForm && (
                    <button
                      type="submit"
                      disabled={isPaymentProcessing || !paymentHandler}
                      className={`focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 shadow-lg cursor-pointer 
                      ${isPaymentProcessing || !paymentHandler 
                        ? 'bg-gray-400 shadow-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'shadow-blue-600 text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-800'
                      }`}
                    >
                      {isPaymentProcessing ? 'Processing...' : 'Submit Order'}
                    </button>
                  )}
                </div>
              </li>
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
