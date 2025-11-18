import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminBooks } from '../../hooks/UseAdminBooks';
import apiClient from '../../api/axios';
import { TbUpload, TbX } from 'react-icons/tb';

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createBook, updateBook } = useAdminBooks();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    year: new Date().getFullYear(),
    pages: '',
    coverImage: null
  });

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      const res = await apiClient.get(`/books/${id}`);
      const book = res.data;
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description || '',
        genre: book.genre || '',
        year: book.year || new Date().getFullYear(),
        pages: book.pages || '',
        coverImage: null
      });
      if (book.coverUrl) setPreview(book.coverUrl);
    } catch (err) {
      setError('Error cargando libro');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, coverImage: null }));
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('author', formData.author);
      data.append('description', formData.description);
      data.append('genre', formData.genre);
      data.append('year', formData.year);
      data.append('pages', formData.pages);
      if (formData.coverImage) {
        data.append('coverImage', formData.coverImage);
      }

      if (id) {
        await updateBook(id, data);
        alert('Libro actualizado correctamente');
      } else {
        await createBook(data);
        alert('Libro creado correctamente');
      }
      navigate('/admin/books');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="bg-white shadow-md rounded-lg p-4 md:p-8 border border-[#e2ded0]">
        <h2 className="text-2xl md:text-3xl font-bold text-[#175873] mb-6">
          {id ? 'Editar Libro' : 'Crear Nuevo Libro'}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-start gap-3">
            <TbX className="mt-1 flex-shrink-0" size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título y Autor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#175873] mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Ej: El Quijote"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#e2ded0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#647c90] bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#175873] mb-2">
                Autor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                placeholder="Ej: Miguel de Cervantes"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#e2ded0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#647c90] bg-gray-50"
              />
            </div>
          </div>

          {/* Género y Año */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#175873] mb-2">
                Género
              </label>
              <input
                type="text"
                name="genre"
                placeholder="Ej: Novela de aventuras"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#e2ded0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#647c90] bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#175873] mb-2">
                Año de Publicación
              </label>
              <input
                type="number"
                name="year"
                placeholder="2024"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#e2ded0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#647c90] bg-gray-50"
              />
            </div>
          </div>

          {/* Páginas */}
          <div>
            <label className="block text-sm font-semibold text-[#175873] mb-2">
              Número de Páginas
            </label>
            <input
              type="number"
              name="pages"
              placeholder="Ej: 500"
              value={formData.pages}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#e2ded0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#647c90] bg-gray-50"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-[#175873] mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              placeholder="Escribe una descripción del libro..."
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-4 py-2 border border-[#e2ded0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#647c90] bg-gray-50 resize-none"
            />
          </div>

          {/* Portada */}
          <div>
            <label className="block text-sm font-semibold text-[#175873] mb-2">
              Portada del Libro
            </label>
            <div className="border-2 border-dashed border-[#647c90] rounded-lg p-6 text-center">
              {preview ? (
                <div className="space-y-4">
                  <img src={preview} alt="preview" className="w-32 h-48 object-cover mx-auto rounded shadow-md" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 mx-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <TbX size={18} />
                    Remover imagen
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    <TbUpload size={32} className="text-[#647c90]" />
                    <div>
                      <p className="text-[#175873] font-semibold">Sube una imagen</p>
                      <p className="text-sm text-gray-500">JPG, PNG o WebP (máx 5MB)</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#e2ded0]">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#647c90] to-[#175873] hover:from-[#175873] hover:to-[#0d3e57] text-white py-3 rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : id ? 'Actualizar Libro' : 'Crear Libro'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/books')}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg transition-colors font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}