import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookDetailCard from "../components/BookDetail/BookDetailCard";
import ErrorBoundary from "../components/Error/ErrorBoundary";
import apiClient from "../api/axios";

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/books/${id}`);
        if (!mounted) return;
        setBook(res.data);
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || err.message || "Error cargando el libro");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (id) fetchBook();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-purple-600">Cargando libro...</p>
      </div>
    );
  }

    if (error) {
      return (
        <div className="p-6"><p className="text-red-500 font-semibold">Error: {error}</p></div>
      );
    }

    if (!book) {
      return (
        <div className="p-6">
          <p className="text-red-500 font-semibold">Libro no encontrado.</p>
        </div>
      );
    }

    return (
      <main className="w-full min-h-screen p-6">
        <ErrorBoundary>
          <BookDetailCard book={book} />
        </ErrorBoundary>
      </main>
    );
}