import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axios";
import { useSearch } from "../context/SearchContext";

export default function SearchResults() {
  const { debouncedQuery, setQuery } = useSearch();
  const [allBooks, setAllBooks] = useState([]); // Almacena todos los libros
  const [results, setResults] = useState([]); // Almacena los resultados filtrados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Si no hay consulta, no hacemos la solicitud
    if (!debouncedQuery || debouncedQuery.trim() === "") {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Obtener todos los libros del backend
    apiClient
      .get("/books")
      .then((res) => {
        if (!mounted) return;
        const books = res.data ?? [];
        setAllBooks(books); // Guardamos todos los libros
        // Filtrar los libros en función de la consulta
        const filteredBooks = books.filter((book) =>
          book.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          (book.author && book.author.toLowerCase().includes(debouncedQuery.toLowerCase()))
        );
        setResults(filteredBooks); // Actualizamos los resultados filtrados
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.response?.data?.message || err.message || "Error buscando");
        setResults([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [debouncedQuery]);

  if (!debouncedQuery) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-xl max-h-80 overflow-y-auto z-50 mt-1"
      aria-live="polite"
      aria-labelledby="search-results-title"
    >
      <h2 id="search-results-title" className="sr-only">
        Resultados de búsqueda
      </h2>

      {loading && (
        <p className="p-3 text-sm text-gray-500">Buscando...</p>
      )}

      {error && (
        <p className="p-3 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && results.length === 0 && (
        <p className="p-3 text-sm text-gray-500">No se encontraron resultados.</p>
      )}

      {!loading && !error && results.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {results.map((book) => (
            <li key={book.id}>
              <Link
                to={`/book/${book.id}`}
                onClick={() => setQuery("")}
                className="flex items-center gap-4 p-3 hover:bg-gray-100"
              >
                <img
                  src={book.coverUrl ?? book.image ?? "/placeholder.jpg"}
                  alt={`Portada del libro ${book.title}`}
                  className="w-10 h-14 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium text-sm truncate">{book.title}</div>
                  <div className="text-xs text-gray-500">{book.author}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}