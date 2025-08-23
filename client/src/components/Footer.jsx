import { Link } from "react-router";

const Footer = () => {
  return (
    <>
      <footer className="bg-white rounded-lg shadow-sm w-full">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin-login" className="hover:underline text-gray-500 text-sm font-medium">
              Portal
            </Link>
            <span className="text-sm text-gray-500 text-center block sm:text-left">
              © 2025 OverTheWall™ . All Rights Reserved.
            </span>
          </div>
          <ul className="flex flex-wrap items-center justify-center sm:justify-end mt-3 text-sm font-medium text-gray-500 sm:mt-0 gap-4 sm:gap-6">
            <li>
              <Link to="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/licensing" className="hover:underline">
                Licensing
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
