export default function Navbar({ onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (onSearch) onSearch(query);
  };

  return (
    <header className="bg-[#e6ded5] flex items-center px-6 py-4 border-b border-gray-300 sticky top-0 z-20 shadow-sm">
      <form
        id="searchForm"
        onSubmit={handleSubmit}
        className="flex flex-1 max-w-4xl mx-auto gap-3 items-center"
      >
        {/* Input con icono */}
        <div className="flex items-center flex-1 bg-[#f3ede7] rounded-full px-4 py-2 shadow-inner">
          <svg
            className="w-6 h-6 text-gray-400 mr-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 10.5a7.5 7.5 0 0012.15 6.15z"
            />
          </svg>
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Buscar libros / usuarios"
            aria-label="Buscar libros o usuarios"
            spellCheck="false"
            className="bg-transparent outline-none flex-grow text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          aria-label="Buscar"
          className="rounded-full px-6 py-2 text-white font-semibold text-sm transition select-none shadow"
          style={{ backgroundColor: "oklch(49.6% 0.265 301.924)" }}
           onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "oklch(29.1% 0.149 302.717)")
        }
        onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "oklch(49.6% 0.265 301.924)")
        }
          >
            Buscar
        </button>
      </form>
    </header>
  );
}
