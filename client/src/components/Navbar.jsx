import { Link, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useState } from "react";
import CartSVG from "../assets/svg/CartSVG";

const Navbar = () => {
  let location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = useSelector((state) => state.cart.items.length);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <div className="flex space-x-8">
              <Link
                to="/"
                className={`berkshireSwashFont text-2xl hover:text-stone-300 ${
                  location.pathname === "/" ? "text-green-700" : "text-black"
                }`}
              >
                About
              </Link>
              <Link
                to="/order-menu"
                className={`berkshireSwashFont text-2xl hover:text-stone-300 ${
                  location.pathname === "/order-menu"
                    ? "text-green-700"
                    : "text-black"
                }`}
              >
                Menu
              </Link>
              <Link
                to="/contact"
                className={`berkshireSwashFont text-2xl hover:text-stone-300 ${
                  location.pathname === "/contact"
                    ? "text-green-700"
                    : "text-black"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Cart section */}
            <div className="flex items-center space-x-3">
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

        {/* Mobile menu */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } w-full md:hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-red-800">
            <Link
              to="/"
              className={`berkshireSwashFont block px-3 py-2 text-xl rounded-md hover:bg-red-700 ${
                location.pathname === "/"
                  ? "text-green-300 bg-red-700"
                  : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/order-menu"
              className={`berkshireSwashFont block px-3 py-2 text-xl rounded-md hover:bg-red-700 ${
                location.pathname === "/order-menu"
                  ? "text-green-300 bg-red-700"
                  : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/contact"
              className={`berkshireSwashFont block px-3 py-2 text-xl rounded-md hover:bg-red-700 ${
                location.pathname === "/contact"
                  ? "text-green-300 bg-red-700"
                  : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/checkout"
              className="berkshireSwashFont block px-3 py-2 text-xl rounded-md hover:bg-red-700 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cart ({cartCount})
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
