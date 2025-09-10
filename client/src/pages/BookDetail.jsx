import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import BookDetailCard from "../components/BookDetail/BookDetailCard";
import  books  from "../data/books1.json";
import ErrorBoundary from "../components/Error/ErrorBoundary";

export default function BookDetail() {
  const { id } = useParams();

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
        <ErrorBoundary>
          <BookDetailCard book={book} />
        </ErrorBoundary>
      </main>
    </MainLayout>
  );
}
