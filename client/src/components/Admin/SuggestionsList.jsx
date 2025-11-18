import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import Swal from 'sweetalert2';

export default function SuggestionsList() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await apiClient.get('/suggestions');
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las sugerencias',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsSeen = async (id) => {
    try {
      await apiClient.patch(`/suggestions/${id}/seen`);
      setSuggestions(prev =>
        prev.map(s => s.id === id ? { ...s, seen: true } : s)
      );
      Swal.fire({
        title: '¡Listo!',
        text: 'Sugerencia marcada como vista',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error marking as seen:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo marcar la sugerencia',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#175873]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-[#175873] mb-6">Sugerencias de Libros</h2>
      
      {suggestions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay sugerencias aún</p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`border rounded-lg p-4 ${
                suggestion.seen ? 'bg-gray-50 opacity-75' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#175873]">{suggestion.title}</h3>
                  <p className="text-sm text-gray-600">Autor: {suggestion.author || 'No especificado'}</p>
                  <p className="text-sm text-gray-600">Género: {suggestion.genre || 'No especificado'}</p>
                </div>
                {!suggestion.seen && (
                  <button
                    onClick={() => markAsSeen(suggestion.id)}
                    className="ml-4 px-4 py-2 bg-[#647c90] text-white rounded-lg hover:bg-[#175873] transition-colors"
                  >
                    Marcar como visto
                  </button>
                )}
              </div>
              
              {suggestion.suggestion && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">{suggestion.suggestion}</p>
                </div>
              )}
              
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>
                  {suggestion.user ? `Usuario: ${suggestion.user.name}` : 'Usuario anónimo'}
                </span>
                <span>{new Date(suggestion.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}