import SearchResults from "./SearchResults";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";

export default function Navbar({ query, onSearch, toggleSidebar }) {
  const { isAuthenticated, user, loading } = useAuth();

  const handleChange = (e) => {
    onSearch(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <header className="bg-[#e2ded0] flex items-center justify-between px-4 md:px-6 py-4 sticky top-0 z-50 shadow-sm gap-4">
      {/* Botón de menú solo para móviles */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-[#647c90] focus:outline-none"
        aria-label="Abrir menú"
      >
        <TiThMenu size={30} />
      </button>

      {/* Formulario de búsqueda */}
      <form
        id="searchForm"
        onSubmit={handleSubmit}
        className="flex flex-1 max-w-4xl items-center"
      >
        <div className="relative flex-1">
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-inner border border-gray-300 hover:border-purple-900 transition-colors duration-300">
            <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 10.5a7.5 7.5 0 0012.15 6.15z" />
            </svg>
            <input
              type="search"
              id="search"
              name="search"
              placeholder="Buscar libros..."
              aria-label="Buscar libros"
              spellCheck="false"
              value={query || ""}
              onChange={handleChange}
              className="bg-transparent outline-none flex-grow text-gray-700 placeholder-gray-400 text-sm"
            />
          </div>
          <SearchResults />
        </div>
      </form>

      {/* Icono de usuario o link de login */}
      <div className="flex items-center">
        {!loading && (
          <>
            {isAuthenticated ? (
              <div className="w-10 h-10 bg-[#647c90] rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer">
                {user?.username?.[0]?.toUpperCase() ?? 'U'}
              </div>
            ) : (
              <Link
                to="/Login"
                className="text-[#647c90] font-extrabold text-sm rounded-sm transition-colors duration-200 hover:text-[#175873] hover:underline select-none"
              >
                Iniciar Sesión
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}