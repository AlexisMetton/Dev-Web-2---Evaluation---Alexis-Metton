import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-opacity-10 backdrop-blur-lg shadow-lg w-full">
      <div className="px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Task Manager</Link>
        <nav>
          <Link to="/login" className="px-4 hover:underline">Login</Link>
          <Link to="/register" className="px-4 hover:underline">Register</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
