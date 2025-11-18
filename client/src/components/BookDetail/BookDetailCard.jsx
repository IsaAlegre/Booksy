import { useMemo, useState } from "react";
import apiClient from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TbBookmark, TbLoader } from "react-icons/tb";

const STATUS_OPTIONS = [
  { value: "reading", label: "Leyendo" },
  { value: "read", label: "Leído" },
  { value: "to-read", label: "Por leer" }
];

export default function BookDetailCard({ book }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  if (!book) return null;

  const [selectedStatus, setSelectedStatus] = useState("to-read");
  const [saving, setSaving] = useState(false);
  
  const handleAddBook = async () => {
    if (!isAuthenticated || !user?.id) {
      return navigate("/login");
    }
    setSaving(true);
    try {
      const res = await apiClient.post(`/users/${user.id}/library`, { 
        bookId: book.id, 
        status: selectedStatus 
      });
      console.log("✅ Libro agregado:", res.data);
      
      const statusLabel = STATUS_OPTIONS.find(opt => opt.value === selectedStatus)?.label;
      Swal.fire({
        title: "¡Guardado con Éxito!",
        text: `"${book.title}" ha sido añadido a tu biblioteca como ${statusLabel}.`,
        icon: "success",
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7c3aed',
        draggable: true, 
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          confirmButton: 'rounded-lg'
        }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error guardando libro.";
      Swal.fire({
        title: "Error al Guardar",
        text: errorMessage,
        icon: "error",
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          confirmButton: 'rounded-lg'
        }
      });
    } finally {
      setSaving(false);
    }
  };

  const onStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const rawSrc = book.coverUrl ?? book.image ?? "/placeholder.jpg";
  const imgSrc = useMemo(() => {
    if (typeof rawSrc !== "string") return rawSrc;
    let s = rawSrc.trim();
    if (s.startsWith("//")) s = "https:" + s;
    if (s.startsWith("http://")) s = s.replace(/^http:\/\//i, "https://");
    return s;
  }, [rawSrc]);

  return (
    <article className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[max-content_1fr] gap-6">
        
        {/* Columna 1: Portada (siempre arriba) */}
        <div className="flex flex-col items-center md:items-start">
          <figure className="w-40 md:w-56 h-64 md:h-[22rem] flex-shrink-0 mb-4 overflow-hidden">
            <img
              src={imgSrc}
              alt={`Portada del libro ${book.title}`}
              className="w-full h-full object-cover rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
              loading="lazy"
              decoding="async"
            />
          </figure>

          {/* Acción rápida */}
          <button
            onClick={handleAddBook}
            disabled={saving}
            className="w-40 md:w-56 flex items-center justify-center gap-2 px-4 py-3 bg-[#647c90] to-[#175873] hover:from-[#175873] hover:to-[#0d3e57] text-white text-sm font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-live="polite"
          >
            {saving ? (
              <>
                <TbLoader className="animate-spin" size={20} />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <TbBookmark size={20} />
                <span>Guardar en Biblioteca</span>
              </>
            )}
          </button>
        </div>

        {/* Columna 2-3: Información */}
        <div className="flex flex-col">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#175873] mb-2 leading-tight">
              {book.title ?? "Título desconocido"}
            </h1>
            <h2 className="text-xl text-[#647c90] font-semibold">
              {book.author ?? "Autor desconocido"}
            </h2>
          </header>

          {/* Meta información */}
          <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-gray-200">
            {book.year && (
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Año</p>
                <p className="text-lg font-semibold text-[#175873]">{book.year}</p>
              </div>
            )}
            {book.pages && (
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Páginas</p>
                <p className="text-lg font-semibold text-[#175873]">{book.pages}</p>
              </div>
            )}
            {book.genre && (
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Género</p>
                <p className="text-lg font-semibold text-[#175873]">{book.genre}</p>
              </div>
            )}
          </div>

          {/* Descripción */}
          <section className="flex-1 mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
              Descripción
            </h3>
            <p className="text-gray-700 leading-relaxed text-base max-h-40 overflow-y-auto pr-4">
              {book.description ?? "Sin descripción disponible."}
            </p>
          </section>

          {/* Selector de Estado */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <label className="block mb-4">
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wide block mb-2">
                Agregar como:
              </span>
              <select
                id="status-select"
                value={selectedStatus}
                onChange={onStatusChange}
                disabled={saving}
                className="w-full p-3 border-2 border-[#647c90] bg-white text-[#175873] font-semibold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#647c90] focus:border-transparent transition-all cursor-pointer disabled:opacity-50"
                aria-label="Seleccionar estado del libro"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    </article>
  );
}