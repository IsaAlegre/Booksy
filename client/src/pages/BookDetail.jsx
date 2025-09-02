import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import BookDetailCard from "../components/BookDetail/BookDetailCard";
import  books  from "../data/books1.json";

export default function BookDetail() {
  const { id } = useParams();

  // Buscar el libro en el array (id de la URL es string, lo pasamos a number)
  const book = books.find((b) => b.id === parseInt(id));

  // Si no se encuentra el libro
  if (!book) {
    return (
      <MainLayout>
        <div className="p-6">
          <p className="text-red-500 font-semibold">Libro no encontrado.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="w-full min-h-screen p-6">
        <BookDetailCard book={book} />
      </main>
    </MainLayout>
  );
}
