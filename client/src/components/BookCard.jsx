// src/components/BookCard.jsx
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
    if (!book) {
    return null;
  }
  return (
    <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-500 ease-in-out w-64">
      <figure className="w-full h-80 overflow-hidden rounded-md">
        <img
          src={book.image}
          alt={`Portada del libro ${book.title}`}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="book-card__info p-3 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mt-2">{book.title}</h3>
        <p className="text-gray-500 text-sm">{book.author}</p>
        <Link 
          to={`/book/${book.id}`}
            // 6. Usar aria-label para accesibilidad.
          aria-label={`Ver detalles de ${book.title}`}
          className="mt-4 self-start text-purple-700 font-semibold hover:text-purple-900 transition-colors duration-300"
          >
            Ver detalles →
        </Link>
      </div>
    </article>
  );
}