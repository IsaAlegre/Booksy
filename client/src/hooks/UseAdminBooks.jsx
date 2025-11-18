import { useState, useCallback } from 'react';
import apiClient from '../api/axios';

export function useAdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/books');
      setBooks(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error cargando libros');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBook = useCallback(async (bookData) => {
    try {
      const res = await apiClient.post('/books', bookData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBooks([...books, res.data.book]);
      return res.data.book;
    } catch (err) {
      throw err.response?.data?.message || 'Error creando libro';
    }
  }, [books]);

  const updateBook = useCallback(async (id, bookData) => {
    try {
      const res = await apiClient.put(`/books/${id}`, bookData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBooks(books.map(b => b.id === id ? res.data.book : b));
      return res.data.book;
    } catch (err) {
      throw err.response?.data?.message || 'Error actualizando libro';
    }
  }, [books]);

  const deleteBook = useCallback(async (id) => {
    try {
      await apiClient.delete(`/books/${id}`);
      setBooks(books.filter(b => b.id !== id));
    } catch (err) {
      throw err.response?.data?.message || 'Error eliminando libro';
    }
  }, [books]);

  return {
    books,
    loading,
    error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook
  };
}