import { LogOut } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const username = user?.name || localStorage.getItem("userName") || "User";

  const navigate = useNavigate();
  
      const handleLogout = () => {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          navigate("/login");
      };
  
  return(
    <header className="backdrop-blur-md bg-white/30 border-b border-white/25 sticky top-0 z-30">
      <div className="flex justify-between items-center px-5 py-3">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          TaskFlow-Pro
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-800 font-medium">
            {username}
          </span>
          <button 
          onClick={handleLogout}
          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
          >
            <LogOut size = {16}/>
            logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
