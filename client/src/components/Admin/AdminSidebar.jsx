import { useNavigate } from 'react-router-dom';
import { TbBooks, TbPlus, TbLogout, TbX } from 'react-icons/tb';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBook, FaLightbulb } from 'react-icons/fa'; 

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <aside className="w-64 bg-[#647c90] text-black h-full shadow-lg flex flex-col">
      {/* Logo y botón cerrar */}
      <div className="p-4 border-b border-black/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TbBooks size={32} className="text-black flex-shrink-0" />
          <h2 className="font-bold text-xl text-black">Booksy</h2>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-black hover:text-white transition-colors"
          aria-label="Cerrar menú"
        >
          <TbX size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-8 space-y-2 flex-1 px-3">
        <NavLink 
          icon={<TbBooks size={24} />}
          label="Libros"
          onClick={() => handleNavigate('/admin/books')}
        />
        <NavLink 
          icon={<TbPlus size={24} />}
          label="Nuevo Libro"
          onClick={() => handleNavigate('/admin/books/new')}
        />
        <NavLink 
          icon={<FaLightbulb size={24} />}
          label="Sugerencias"
          onClick={() => handleNavigate('/admin/suggestions')}
        />
      </nav>

      {/* Logout Button */}
      <div className="px-3 pb-4 border-t border-black/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white font-medium"
        >
          <TbLogout size={24} className="flex-shrink-0" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

function NavLink({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-black/20 transition-colors text-black group"
    >
      <span className="flex-shrink-0 text-black group-hover:text-white transition-colors">
        {icon}
      </span>
      <span className="group-hover:font-semibold transition-all">{label}</span>
    </button>
  );
}