import BookCard from "../components/BookCard";
import BooksCoverflow from "../components/BookCoverFlow";
import apiClient from "../api/axios";
import { useEffect, useState, useMemo } from "react";
import {useSearch} from "../context/SearchContext";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";


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

  const scrollToSection = () => {
  const target = document.getElementById("discover-section");
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
};

return (
  <>  
      <section className="relative w-full min-h-[60vh] md:min-h-[70vh] mb-16 rounded-2xl overflow-hidden shadow-2xl">
              
          {/* Fondo */}
          <motion.div
            className="absolute inset-0 bg-no-repeat bg-center"
            style={{
              backgroundImage: `url('img/home.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            initial={{ scale: 1.25 }}   // Comienza más grande
            animate={{ scale: 1 }}      // Vuelve lentamente al tamaño normal
            transition={{ duration: 12, ease: "easeOut" }} // Zoom ultra suave
          />

          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

          <div className="absolute inset-0 rounded-2xl pointer-events-none
            before:absolute before:inset-0 before:rounded-2xl
            before:bg-gradient-to-r before:from-purple-500/30 before:to-blue-500/30
            before:blur-3xl before:opacity-50 before:animate-pulse">
          </div>

          {/* Contenido animado */}
          <div className="relative w-full h-full min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center px-6">

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white text-center mb-6 drop-shadow-xl"
            >
              Bienvenido a Booksy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-100 text-center drop-shadow-md max-w-3xl"
            >
              Descubre un mundo de historias en cada página
            </motion.p>
            <motion.div
              onClick={scrollToSection}
              className="absolute bottom-5 cursor-pointer text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaChevronDown className="text-3xl" />
            </motion.div>
          </div>
      </section>

      <BooksCoverflow />
      <section id="discover-section" aria-labelledby="seccion-title" data-testid="recomendations-section">
        <motion.h2
          id="seccion-title"
          className="text-xl font-extrabold text-[#647c90] mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          You may like
        </motion.h2>


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
  </>
  );
}