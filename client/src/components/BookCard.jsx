// src/components/BookCard.jsx
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
    if (!book) {
    return null;
  }

  const imgSrc = book.coverUrl ?? "/placeholder.jpg";
  return (
    <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-500 ease-in-out h-full flex flex-col">
      <figure className="w-full aspect-[2/3] overflow-hidden rounded-t-xl">
        <img
          src={imgSrc}
          alt={`Portada del libro ${book.title}`}
          loading="lazy"
          width={240}
          height={320}
          className="w-full h-full object-cover object-center"
        />
      </figure>
      <div className="book-card__info p-3 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mt-2">{book.title}</h3>
        <p className="text-gray-500 text-sm">{book.author}</p>
        <Link 
          to={`/book/${book.id}`}
          aria-label={`Ver detalles de ${book.title}`}
          className="mt-auto self-start text-[#8155ba] font-semibold hover:text-purple-900 transition-colors duration-300"
          >
            Ver detalles →
        </Link>
      </div>
    </article>
  );
}