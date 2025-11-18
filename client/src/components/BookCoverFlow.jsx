import { useEffect, useState } from 'react';
import apiClient from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function BooksCoverflow() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await apiClient.get('/books');
        console.log('Libros cargados:', res.data);
        setBooks(res.data || []);
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-12 w-12 text-[#647c90]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#647c90] font-semibold">No hay libros disponibles</p>
      </div>
    );
  }

  // Duplicar los libros para loop infinito
  const duplicatedBooks = [...books, ...books, ...books];

  return (
    <section className="mb-12">
      <header className="mb-6">
        <h2 className="text-4xl font-extrabold text-[#175873] mb-1">
          Descubre Nuestros Libros
        </h2>
        <p className="text-[#647c90] font-medium">
          Explora nuestra colección destacada
        </p>
      </header>

      <div className="relative overflow-hidden rounded-2xl py-4">
        <div className="carousel-container">
          <div className="carousel-track">
            {duplicatedBooks.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                onClick={() => navigate(`/book/${book.id}`)}
                className="
                  relative w-[180px] cursor-pointer rounded-lg overflow-hidden
                  bg-white shadow-lg flex-shrink-0 mx-2
                  transition-all duration-500
                  hover:scale-105 hover:shadow-2xl hover:z-10
                "
              >
                <div className="aspect-[2/3]">
                  <img
                    src={book.coverUrl || '/placeholder.jpg'}
                    alt={book.title}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute bottom-0 p-4 w-full bg-gradient-to-t from-black/80 to-transparent text-white">
                  <h3 className="font-bold text-sm line-clamp-2">{book.title}</h3>
                  <p className="text-xs opacity-80 line-clamp-1">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradientes laterales para efecto fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      </div>

      <style>{`
        .carousel-container {
          overflow: hidden;
          width: 100%;
        }
        
        .carousel-track {
          display: flex;
          animation: scroll 5s linear infinite;  /* 25s = más rápido */
          width: fit-content;
        }
        
        .carousel-track:hover {
          animation-play-state: paused;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-184px * ${books.length}));  /* 180px si mx-0 */
          }
        }
      `}</style>
    </section>
  );
}