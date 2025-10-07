import { FiPlus } from "react-icons/fi";
import { TbBooks } from "react-icons/tb";
import { Link } from "react-router-dom";
import { PiUserCircleFill } from "react-icons/pi";
import { TiThMenu } from "react-icons/ti";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ children, toggleSidebar }) {
  const { isAuthenticated } = useAuth();
  
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <nav className="h-full w-20 md:w-24 md:hover:w-48 bg-[#647c90] flex flex-col items-center py-6 transition-all duration-300 justify-between">
      
      <div className="flex flex-col gap-4 items-start px-4 w-full ">
          <div className="flex items-center gap-4 mb-5 borde">
            <TbBooks size={35} />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              Booksy
            </span>
          </div>
        
        {/* Menú de navegación */}
        <div className="flex flex-col gap-6 items-start w-full mt-10">
            <Link 
                to="/" 
                onClick={handleLinkClick}
                className="flex items-center gap-4 hover:text-purple-900 transition-all">
              <TiThMenu size={28} />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                Explorar
              </span>
            </Link>

            
              <Link 
                to={isAuthenticated ? "/Profile" : "/Login"}
                onClick={handleLinkClick}
                className="flex items-center gap-4 hover:text-purple-900 transition-all">
                <PiUserCircleFill size={28} />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Perfil
                </span>
              </Link>
        

           
              <Link 
                to="/SuggestionPage" 
                onClick={handleLinkClick}
                className="flex items-center gap-4 hover:text-purple-900 transition-all">
                <FiPlus size={28} />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Agregar
                </span>
              </Link>
          </div>
      </div>


      {/* Children opcionales */}
      <ul className="w-full px-4">{children}</ul>
    </nav>
  );
}
