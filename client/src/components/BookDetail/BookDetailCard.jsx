import BookReview from "./BookReview";
import { useLibrary } from "../../context/LibraryContext";

export default function BookDetailCard({ book }) {
  const { addBook } = useLibrary();
  if (!book) return null;

  const handleAddBook = () => {
    addBook(book);
    alert(`"${book.title}" fue agregado a tu biblioteca.`);
  };

  return (
    <article className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6">
      {/* Portada */}
      <figure className="w-60 md:w-60 flex-shrink-0 h-90 md:h-auto">
        <img
          src={book.image}
          alt={`Portada del libro ${book.title}`}
          className="w-full h-full object-cover rounded-lg"
        />
      </figure>

      {/* Información del libro */}
      <div className="flex flex-col justify-start flex-1">
        <header>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <h2 className="text-xl font-inter text-gray-500 mt-1">{book.author}</h2>
        </header>

        <p className="font-inter mt-4 text-gray-700">{book.description}</p>

        <button
          onClick={handleAddBook} 
          className="mt-4 self-start w-auto px-3 py-1.5 bg-gray-400 text-sm text-white rounded-md hover:bg-purple-700 transition-all">
          Agregar a mi biblioteca
        </button>

        <section className="mt-6">
          <BookReview bookTitle={book.title} />
        </section>
      </div>
    </article>
  );
}
