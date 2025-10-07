import { useMemo, useState} from "react";
import apiClient from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const STATUS_OPTIONS = [
        { value: "reading", label: "leyendo" },
        { value: "read",    label: "leído" },
        { value: "to-read", label: "por leer" }
  ];

export default function BookDetailCard({ book }) {
  const {user, isAuthenticated} = useAuth();
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
      await apiClient.post(`/users/${user.id}/library`, { bookId: book.id, status: selectedStatus });
      const statusLabel = STATUS_OPTIONS.find(opt => opt.value === selectedStatus)?.label;
            Swal.fire({
                title: "¡Guardado con Éxito!",
                text: `"${book.title}" ha sido añadido a tu biblioteca como ${statusLabel}.`,
                icon: "success",
                confirmButtonText: 'Aceptar',
                draggable: true, 
                customClass: {
                    popup: 'rounded-xl shadow-2xl'
                }
            });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error guardando libro.";
      Swal.fire({
        title: "Error al Guardar",
        text: errorMessage,
        icon: "error",
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl'
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
    <article className="bg-white rounded-2xl shadow-md p-4 md:p-6 flex flex-col md:flex-row items-center flex-wap">
      {/* Portada */}
      <figure className="w-32 md:w-40 flex-shrink-0">
        <img
          src={imgSrc}
          alt={`Portada del libro ${book.title}`}
          className="w-full h-full object-cover rounded-lg shadow-lg"
          //width={240}
          //height={320}
          loading="lazy"
          decoding="async"
        />
      </figure>

      {/* Información del libro */}
      <div className="flex flex-col justify-start flex-1 w-full text-center md:text-left md:ml-6">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold truncate">{book.title ?? "Título desconocido"}</h1>
          <h2 className="text-lg md:text-xl font-inter text-gray-500 mt-1 truncate">{book.author}</h2>
        </header>

        <section className="mt-4">
          <p className="font-inter max-h-[40vh] text-gray-700 overflow-auto text-sm">
            {book.description ?? "Sin descripcion disponible."}
          </p>
        </section>
        
        {/* Contenedor para el select y el botón */}
        <footer className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Agregar:</span>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={onStatusChange}
              disabled={saving}
              className="p-2 border border-purple-300 bg-purple-50 text-purple-800 font-medium rounded-xl shadow-inner cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              aria-label="Seleccionar estado del libro"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <button
            onClick={handleAddBook}
            disabled={saving}
            className="px-6 py-2 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition duration-150 transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none"
            aria-live="polite"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </footer>
      </div>
    </article>
  );
}
