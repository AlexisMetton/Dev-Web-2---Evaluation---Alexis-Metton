import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/security/authProvider/AuthProvider";
import { useState } from "react";
import { useTheme } from "@/layouts/themeProvider/ThemeProvider";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-lg shadow-lg w-full ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Task Manager
        </Link>

        {/* Menu and Theme Toggle */}
        <div className="flex items-center space-x-4">
          {/* Navigation Links */}
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } lg:flex lg:flex-row lg:space-x-4 absolute lg:relative top-full left-0 w-full bg-${
              theme === "dark" ? "black" : "white"
            } shadow-md lg:shadow-none`}
          >
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-4 py-2 hover:underline ${
                    isActive("/dashboard") ? "underline" : ""
                  } ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Dashboard
                </Link>
                {(user?.roles.includes("ROLE_ADMIN") || user?.roles.includes("ROLE_SUPERADMIN")) && (
                  <Link
                    to="/admin/dashboard"
                    className={`block px-4 py-2 hover:underline ${
                      isActive("/admin/dashboard") ? "underline" : ""
                    } ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:underline text-red-500 w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block px-4 py-2 hover:underline ${
                    isActive("/login") ? "underline" : ""
                  } ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`block px-4 py-2 hover:underline ${
                    isActive("/register") ? "underline" : ""
                  } ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Theme Toggle */}
          <label className="theme">
            <input
              type="checkbox"
              className="input"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />
            <svg
              className="icon icon-sun"
              fill="white"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" x2="12" y1="1" y2="3"></line>
              <line x1="12" x2="12" y1="21" y2="23"></line>
              <line x1="4.22" x2="5.64" y1="4.22" y2="5.64"></line>
              <line x1="18.36" x2="19.78" y1="18.36" y2="19.78"></line>
              <line x1="1" x2="3" y1="12" y2="12"></line>
              <line x1="21" x2="23" y1="12" y2="12"></line>
              <line x1="4.22" x2="5.64" y1="19.78" y2="18.36"></line>
              <line x1="18.36" x2="19.78" y1="5.64" y2="4.22"></line>
            </svg>
            <svg
              className="icon icon-moon"
              viewBox="0 0 24 24"
              style={{ fill: "black" }}
            >
              <path d="m12.3 4.9c.4-.2.6-.7.5-1.1s-.6-.8-1.1-.8c-4.9.1-8.7 4.1-8.7 9 0 5 4 9 9 9 3.8 0 7.1-2.4 8.4-5.9.2-.4 0-.9-.4-1.2s-.9-.2-1.2.1c-1 .9-2.3 1.4-3.7 1.4-3.1 0-5.7-2.5-5.7-5.7 0-1.9 1.1-3.8 2.9-4.8zm2.8 12.5c.5 0 1 0 1.4-.1-1.2 1.1-2.8 1.7-4.5 1.7-3.9 0-7-3.1-7-7 0-2.5 1.4-4.8 3.5-6-.7 1.1-1 2.4-1 3.8-.1 4.2 3.4 7.6 7.6 7.6z"></path>
            </svg>
          </label>

          {/* Hamburger Menu */}
          <button
            className={`lg:hidden block ${
              theme === "dark" ? "text-white" : "text-gray-900"
            } focus:outline-none`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
