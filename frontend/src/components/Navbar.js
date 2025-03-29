import { Link } from "react-router-dom";

const Navbar = ({ onSignOut }) => {
  const currentUser = localStorage.getItem('currentUser');

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-orange-500">Focus+</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-orange-500 hover:text-orange-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/groups"
                className="border-transparent text-gray-500 hover:border-orange-500 hover:text-orange-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                My Groups
              </Link>
              <Link
                to="/join-groups"
                className="border-transparent text-gray-500 hover:border-orange-500 hover:text-orange-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Join Groups
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 text-sm">{currentUser}</span>
            <button
              onClick={onSignOut}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 