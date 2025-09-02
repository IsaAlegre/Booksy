import { FiPlus } from "react-icons/fi";
import { TbBooks } from "react-icons/tb";
import { Link } from "react-router-dom";
import { PiUserCircleFill } from "react-icons/pi";
import { TiThMenu } from "react-icons/ti";

export default function Sidebar({ children }) {
  return (
    <aside className="group w-20 hover:w-30 md:w-24 md:hover:w-45 bg-[#e6ded5] h-screen flex flex-col items-center py-6 transition-all duration-300">
      
      <div className="flex flex-col gap-6 items-start ml-15 w-full ">
          <Link 
            to="/" 
            className="flex items-center gap-4 hover:text-purple-600 transition-all mb-5 group">
            <TbBooks size={35} />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              Booksy
            </span>
          </Link>


        <button className="flex items-center gap-4 hover:text-purple-600 transition-all">
          <TiThMenu size={28} />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            Menú
          </span>
        </button>

        
          <Link 
            to="/Profile" 
            className="flex items-center gap-4 hover:text-purple-600 transition-all group">
            <PiUserCircleFill size={30} />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              Perfil
            </span>
          </Link>
    

       
          <Link 
            to="/SuggestionPage" 
            className="flex items-center gap-4 hover:text-purple-600 transition-all group">
            <FiPlus size={28} />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              Agregar
            </span>
          </Link>
      </div>

      {/* Children opcionales */}
      <ul className="mt-6 w-full px-4">{children}</ul>
    </aside>
  );
}
