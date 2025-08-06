import { Link, useLocation } from "react-router";
import { useSelector } from "react-redux";
import CartSVG from "../assets/svg/CartSVG";

const Navbar = () => {
  let location = useLocation();
  console.log("location", location);

  const cartCount = useSelector((state) => state.cart.items.length);
  console.log("Checkout cartCount", cartCount);
  // const navigate = useNavigate()

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-red-900 smokeShadow">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src={new URL("../assets/pizzaLogo.jpg", import.meta.url).href}
              className="h-12"
              alt="Pizza Logo"
            />
            <span className="self-center text-slate-100 text-2xl font-semibold whitespace-nowrap barriecitoFont">
              OverTheWall
            </span>
          </div>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"></div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-cta"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-transparent ">
              <li>
                <Link
                  to="/"
                  className={`berkshireSwashFont block py-2 px-3 md:p-0 text-2xl md:hover:bg-transparent md:hover:text-stone-300 hover:bg-stone-300 ${
                    location.pathname === "/" ? "text-green-700" : "text-black"
                  }
                       `}
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/order-menu"
                  className={`berkshireSwashFont block py-2 px-3 md:p-0 text-2xl md:hover:bg-transparent md:hover:text-stone-300 hover:bg-stone-300 ${
                    location.pathname === "/order-menu"
                      ? "text-green-700"
                      : " text-black"
                  }
                      `}
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={` berkshireSwashFont block py-2 px-3 md:p-0 text-2xl md:hover:bg-transparent md:hover:text-stone-300 hover:bg-stone-300 ${
                    location.pathname === "/contact"
                      ? "text-green-700"
                      : " text-black"
                  } 
                      `}
                >
                  Contact
                </Link>
              </li>
            </ul>
     
            <div className="absolute end-20 p-3 flex items-center space-x-3">
              <p className="text-stone-300 berkshireSwashFont">Check</p>
              <div className="relative">
                <Link to="/checkout">
                  <CartSVG count={cartCount} />
                </Link>
              </div>
              <p className="text-stone-300 berkshireSwashFont">Out</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
