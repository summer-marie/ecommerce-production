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
    setPaymentError("");

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
      address: { street, city, state: stateVal, zip },
      phone,
      orderDetails: cartItems.map((item) => ({
        pizzaName: item.pizzaName,
        pizzaPrice: Number(item.pizzaPrice),
        quantity: item.quantity || 1,
      })),
      orderTotal: calculateTotal(),
      status: "processing",
    };

    if (paymentMethod === "square" && paymentHandler) {
      setIsPaymentProcessing(true);
      let createdOrderNumber;
      try {
        const created = await dispatch(createOrder(orderData)).unwrap();
        createdOrderNumber = Number(created?.order?.orderNumber);
        if (!createdOrderNumber || Number.isNaN(createdOrderNumber)) throw new Error("Failed to get orderNumber");
        await paymentHandler({ ...orderData, orderNumber: createdOrderNumber });
      } catch (error) {
        if (createdOrderNumber) {
          try {
            await dispatch(
              markOrderPaymentFailed({
                orderNumber: createdOrderNumber,
                reason: error?.response?.data?.details || error?.message || "payment_failed",
              })
            ).unwrap();
          } catch (softCancelErr) {
            console.warn('Soft cancel failed', softCancelErr);
          }
        }
        setPaymentError(
          error?.response?.data?.message || error?.message || "Payment processing failed. Please try again."
        );
        setIsPaymentProcessing(false);
      }
    } else if (paymentMethod === "cash") {
      handleCashPayment(orderData);
    } else {
      setPaymentError("Please select a payment method");
    }
  };

  const handleCashPayment = async (orderData) => {
    setIsPaymentProcessing(true);
    try {
      const cashOrderData = {
        ...orderData,
        payment: { status: "pending", method: "cash", amountPaid: calculateTotal(), paidAt: null },
      };
      await dispatch(createOrder(cashOrderData)).unwrap();
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        dispatch(clearCart());
        navigate("/order-success");
      }, 1500);
    } catch (error) {
      console.error('Cash order creation failed', error);
      setPaymentError("Failed to create order. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handlePayWithCard = () => { setPaymentMethod("square"); setShowCardForm(true); setPaymentError(""); };
  const handlePayWithCash = () => { setPaymentMethod("cash"); setShowCardForm(false); setPaymentError(""); };
  const handlePaymentSuccess = async () => {
    try {
      setShowSuccessAlert(true);
      setTimeout(() => { setShowSuccessAlert(false); dispatch(clearCart()); navigate("/order-success"); }, 1000);
    } catch {
      setPaymentError("Payment completed but there was an app error. Please contact support.");
    } finally { setIsPaymentProcessing(false); }
  };
  const handlePaymentError = (error) => { setPaymentError(error); setIsPaymentProcessing(false); };
  const handlePaymentReady = (handler) => { setPaymentHandler(() => handler); };
  const handleItemDelete = (cartItemId) => { setShowSuccessAlert(true); dispatch(removeFromCart(cartItemId)); setTimeout(() => setShowSuccessAlert(false), 1500); };
  const handleCancel = () => { setShowAlert(false); };
  const handleConfirm = () => { dispatch(clearCart()); setTimeout(() => { setShowAlert(false); navigate("/order-menu"); }, 2000); };
  const calculateTotal = () => cartItems.reduce((sum, item) => sum + Number(item.pizzaPrice), 0).toFixed(2);
  const formatPhoneNumber = (value) => { const cleaned = value.replace(/\D/g, ""); const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/); if (!match) return ""; let formatted = ""; if (match[1]) formatted = `(${match[1]}`; if (match[2]) formatted += match[2].length === 3 ? `) ${match[2]}` : match[2]; if (match[3]) formatted += match[3] ? `-${match[3]}` : ""; return formatted; };

  // Modern UI Start
  return (
    <>
      <form onSubmit={handleSubmit} autoComplete="off" className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-8 text-center berkshireSwashFont">
            Checkout
          </h1>

            {/* GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Order Summary */}
            <section
              aria-labelledby="order-summary"
              className="order-1 lg:order-1 lg:col-span-2 space-y-6"
            >
              <div className="bg-white/80 backdrop-blur rounded-2xl shadow ring-1 ring-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    id="order-summary"
                    className="text-xl font-semibold text-gray-800 flex items-center gap-2"
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Order Items
                  </h2>
                  {cartItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAlert(true)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">
                    Your cart is empty.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item, idx) => (
                      <li
                        key={item.cartItemId || idx}
                        className="py-4 flex gap-4 items-start"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-900 capitalize leading-snug">
                            {item.pizzaName}
                          </p>
                          <p className="text-sm text-gray-500">${item.pizzaPrice}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => handleItemDelete(item.cartItemId)}
                            type="button"
                            className="text-xs font-medium text-red-600 hover:text-white border border-red-500 hover:bg-red-600 px-3 py-1 rounded-full transition"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 border-t pt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    ${calculateTotal()}
                  </span>
                </div>

                {/* Desktop-only payment section (integrated under order items) */}
                <div className="hidden lg:block mt-10">
                  <div className="space-y-6">
                    {paymentError && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                        {paymentError}
                      </div>
                    )}
                    {!paymentMethod && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Payment Method
                        </h3>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={handlePayWithCard}
                            className="btn-metal btn-metal-blue w-full lg:w-2/5"
                          >
                            Card
                          </button>
                          <button
                            type="button"
                            onClick={handlePayWithCash}
                            className="btn-metal btn-metal-green w-full lg:w-2/5"
                          >
                            Cash (On-Site)
                          </button>
                        </div>
                      </div>
                    )}

                    {showCardForm && paymentMethod === "square" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Card Payment
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod(null);
                              setShowCardForm(false);
                              setPaymentError("");
                            }}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Change
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

                    {paymentMethod === "cash" && !showCardForm && (
                      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-green-800">
                            Cash Selected
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod(null);
                              setPaymentError("");
                            }}
                            className="text-green-600 hover:text-green-800 text-xs font-medium"
                          >
                            Change
                          </button>
                        </div>
                        <p>
                          You will pay <strong>${calculateTotal()}</strong> when you
                          pick up your order.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAlert(true)}
                        className="btn-metal btn-metal-red w-full sm:w-auto flex-1"
                      >
                        Cancel Order
                      </button>
                      {paymentMethod === "cash" && (
                        <button
                          type="submit"
                          disabled={isPaymentProcessing}
                          className={`btn-metal btn-metal-green flex-1 ${isPaymentProcessing ? 'btn-metal-disabled' : ''}`}
                        >
                          {isPaymentProcessing ? "Processing…" : "Complete Order"}
                        </button>
                      )}
                      {paymentMethod === "square" && showCardForm && (
                        <button
                          type="submit"
                          disabled={isPaymentProcessing || !paymentHandler}
                          className={`btn-metal btn-metal-blue flex-1 ${isPaymentProcessing || !paymentHandler ? 'btn-metal-disabled' : ''}`}
                        >
                          {isPaymentProcessing ? "Processing…" : "Submit Order"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* User Info Form */}
            <aside className="order-2 lg:order-2 lg:col-span-1">
              <div className="bg-white/80 backdrop-blur rounded-2xl shadow ring-1 ring-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Your Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="Sally"
                      className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Smith"
                      className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <label
                      htmlFor="street"
                      className="text-sm font-medium text-gray-700"
                    >
                      Street
                    </label>
                    <input
                      id="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      placeholder="123 Main St"
                      className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="city"
                      className="text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Goodyear"
                      className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="state"
                      className="text-sm font-medium text-gray-700"
                    >
                      State
                    </label>
                    <select
                      id="state"
                      value={stateVal}
                      onChange={(e) => setStateVal(e.target.value)}
                      required
                      className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    >
                      <option value="">Select</option>
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
                  <div className="flex flex-col">
                    <label
                      htmlFor="zip"
                      className="text-sm font-medium text-gray-700"
                    >
                      Zipcode
                    </label>
                    <input
                      id="zip"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      required
                      placeholder="12345"
                      pattern="[0-9]{5}(-[0-9]{4})?"
                      maxLength={10}
                      className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                      required
                      placeholder="(555) 555-5555"
                      maxLength={14}
                      className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    />
                  </div>
                </div>
                <p className="mt-6 text-xs text-gray-500 leading-relaxed">
                  Your information is used only to process your order. By placing the order you
                  agree to our terms & pickup policies.
                </p>
              </div>
            </aside>

            {/* Payment Section (mobile below details via order classes) */}
            <div className="order-3 lg:hidden lg:order-2 lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur rounded-2xl shadow ring-1 ring-gray-200 p-6 space-y-6">
                {paymentError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {paymentError}
                  </div>
                )}
                {!paymentMethod && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Payment Method
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={handlePayWithCard}
                        className="btn-metal btn-metal-blue"
                      >
                        Card
                      </button>
                      <button
                        type="button"
                        onClick={handlePayWithCash}
                        className="btn-metal btn-metal-green"
                      >
                        Cash (On-Site)
                      </button>
                    </div>
                  </div>
                )}

                {showCardForm && paymentMethod === "square" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Card Payment
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod(null);
                          setShowCardForm(false);
                          setPaymentError("");
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Change
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

                {paymentMethod === "cash" && !showCardForm && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-green-800">
                        Cash Selected
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod(null);
                          setPaymentError("");
                        }}
                        className="text-green-600 hover:text-green-800 text-xs font-medium"
                      >
                        Change
                      </button>
                    </div>
                    <p>
                      You will pay <strong>${calculateTotal()}</strong> when you
                      pick up your order.
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAlert(true)}
                    className="btn-metal btn-metal-red w-full sm:w-auto flex-1"
                  >
                    Cancel Order
                  </button>
                  {paymentMethod === "cash" && (
                    <button
                      type="submit"
                      disabled={isPaymentProcessing}
                      className={`btn-metal btn-metal-green w-full sm:w-auto flex-1 ${isPaymentProcessing ? 'btn-metal-disabled' : ''}`}
                    >
                      {isPaymentProcessing ? "Processing…" : "Complete Order"}
                    </button>
                  )}
                  {paymentMethod === "square" && showCardForm && (
                    <button
                      type="submit"
                      disabled={isPaymentProcessing || !paymentHandler}
                      className={`btn-metal btn-metal-blue w-full sm:w-auto flex-1 ${isPaymentProcessing || !paymentHandler ? 'btn-metal-disabled' : ''}`}
                    >
                      {isPaymentProcessing ? "Processing…" : "Submit Order"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Success alert */}
      {showSuccessAlert && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <AlertSuccess successMsg={successMsg} successDescription={successDescription} />
        </div>
      )}

      {/* Delete confirmation alert */}
      {showAlert && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
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
