import BookCard from "../components/BookCard";
import apiClient from "../api/axios";
import { useEffect, useState, useMemo } from "react";
import {useSearch} from "../context/SearchContext";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {debouncedQuery} = useSearch(); 
  
  useEffect(() => {
    let mounted = true;
    const fetchBooks = async () => {
      try {
        const res = await apiClient.get("/books"); // baseURL + /books
        if (!mounted) return;
        setBooks(res.data || []);
      } catch (err) {
        console.error("Error fetching books:", err);
        if (!mounted) return;
        setError(err.response?.data?.message || err.message || "Error cargando libros");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBooks();
    return () => {
      mounted = false;
    };
  }, []);

  const visibleBooks = useMemo(() => {
    if (!debouncedQuery) return books;
    return books.filter((b) =>
      (b.title ?? b.book?.title ?? "").toString().toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [books, debouncedQuery]);

  console.log("Query para filtrar:", debouncedQuery);
  console.log("Libros disponibles para filtrar:", books);

return (
      <section aria-labelledby="seccion-title" data-testid="recomendations-section">
        <h2 
          id="seccion-title"
          className="text-xl font-extrabold text-[#647c90] mb-6">
            You may like
        </h2>

        {loading && (
        <div className="flex justify-center items-center h-40">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-purple-600">Cargando libros...</p>
        </div>
      )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {visibleBooks.length === 0 ? (
            <p className="text-gray-500">No hay libros disponibles.</p>
          ) : (
            visibleBooks.map((item) => {
              const book = item.title ? item : item.book ? item.book : item;
              const key = (item.id ?? item.book?.id ?? book.id);
              return <BookCard key={key} book={book} />;
            })
          )}
        </div>
        )}
      </section>
  );
}