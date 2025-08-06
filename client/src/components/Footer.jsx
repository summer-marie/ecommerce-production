import { Link } from "react-router";

// TODO: Finish creating real links (Privacy policy, Liscensing)

const Footer = () => {
  return (
    <>
      <footer
        className="bg-white 
      rounded-lg shadow-sm fixed bottom-0 w-full"
      >
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between h-auto">
          <span className="text-sm text-gray-500 sm:text-center">
            © 2025 OverTheWall™ . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
            <li>
              <Link to="/admin-login" className="hover:underline me-4 md:me-6">
                Portal
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline me-4 md:me-6">
                Licensing
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
