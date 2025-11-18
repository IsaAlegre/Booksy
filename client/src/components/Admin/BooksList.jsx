import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminBooks } from '../../hooks/UseAdminBooks';
import ConfirmDelete from './ConfirmDelete';
import { TbPlus, TbEdit, TbTrash, TbLoader, TbBooks} from 'react-icons/tb';

export default function BooksList() {
  const { books, loading, error, fetchBooks, deleteBook } = useAdminBooks();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBook(selectedBook.id);
      setShowConfirm(false);
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <TbLoader className="animate-spin text-[#647c90]" size={48} />
        <span className="ml-3 text-[#647c90] text-lg font-semibold">Cargando libros...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#175873]">Gestión de Libros</h2>
        <button
          onClick={() => navigate('/admin/books/new')}
          className="flex items-center gap-2 bg-gradient-to-r from-[#647c90] to-[#175873] hover:from-[#175873] hover:to-[#0d3e57] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all font-semibold text-sm md:text-base w-full sm:w-auto justify-center"
        >
          <TbPlus size={20} />
          Nuevo Libro
        </button>
      </div>

      {/* Contenido */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-[#e2ded0]">
        {books.length === 0 ? (
          <div className="text-center py-12 px-4">
            <TbBooks size={48} className="mx-auto text-[#647c90] mb-3 opacity-50" />
            <p className="text-[#647c90] text-lg font-semibold">No hay libros registrados</p>
            <p className="text-gray-500 text-sm mt-2">Comienza creando tu primer libro</p>
          </div>
        ) : (
          <>
            {/* Vista Desktop - Tabla */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#647c90] to-[#175873] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Portada</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Título</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Autor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Género</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-[#f5f3f0] transition-colors">
                      <td className="px-6 py-4">
                        {book.coverUrl ? (
                          <img 
                            src={book.coverUrl} 
                            alt={book.title} 
                            className="w-12 h-16 object-cover rounded shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-gradient-to-br from-[#647c90] to-[#175873] flex items-center justify-center rounded text-white">
                            <TbBooks size={24} />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#175873]">{book.title}</td>
                      <td className="px-6 py-4 text-[#647c90]">{book.author}</td>
                      <td className="px-6 py-4 text-gray-600">{book.genre || '-'}</td>
                      <td className="px-6 py-4 space-x-3 flex">
                        <button
                          onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                          title="Editar libro"
                        >
                          <TbEdit size={18} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteClick(book)}
                          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                          title="Eliminar libro"
                        >
                          <TbTrash size={18} />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {books.map((book) => (
                <div key={book.id} className="p-4 hover:bg-[#f5f3f0] transition-colors">
                  <div className="flex gap-4">
                    {/* Portada */}
                    <div className="flex-shrink-0">
                      {book.coverUrl ? (
                        <img 
                          src={book.coverUrl} 
                          alt={book.title} 
                          className="w-16 h-24 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-gradient-to-br from-[#647c90] to-[#175873] flex items-center justify-center rounded text-white">
                          <TbBooks size={28} />
                        </div>
                      )}
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#175873] text-lg truncate">{book.title}</h3>
                      <p className="text-[#647c90] text-sm mb-1">{book.author}</p>
                      {book.genre && (
                        <p className="text-gray-600 text-xs mb-3">{book.genre}</p>
                      )}

                      {/* Botones */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                        >
                          <TbEdit size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteClick(book)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                        >
                          <TbTrash size={16} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showConfirm && (
        <ConfirmDelete
          book={selectedBook}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}