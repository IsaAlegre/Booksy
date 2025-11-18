import { useEffect, useState } from "react";
import apiClient from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "reading", label: "Leyendo" },
  { value: "read", label: "Leído" },
  { value: "to-read", label: "Por leer" },
];

export default function UserLibrary({ userId, isOwnProfile = false }) {
  const { user: authUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    if (!userId) return;
    console.log("👤 userId del componente:", userId);
    console.log("👤 usuario autenticado:", authUser?.id);
    setLoading(true);
    apiClient
      .get(`/users/${userId}/library`)
      .then((res) => {
      console.log("📚 Biblioteca cargada:", res.data);
      setBooks(res.data ?? [])
    })
      .catch((err) =>
        setError(err.response?.data?.message || err.message)
      )
      .finally(() => setLoading(false));
  }, [userId]);

  const filteredBooks =
    filter === "all"
      ? books
      : books.filter((b) => b.status === filter);


  const handleChangeStatus = async (libraryId, currentStatus) => {
    console.log("🔄 PUT - libraryId enviado:", libraryId); 
    const { value: newStatus } = await Swal.fire({
      title: "Cambiar estado",
      input: "select",
      inputOptions: {
        reading: "Leyendo",
        read: "Leído",
        "to-read": "Por leer",
      },
      inputValue: currentStatus,
      showCancelButton: true,
    });

    if (!newStatus) return;

    try {
      console.log("📡 URL:", `/users/${userId}/library/${libraryId}`);
      await apiClient.put(`/users/${userId}/library/${libraryId}`, {
        status: newStatus,
      });

      setBooks(
        books.map((b) => (b.id === libraryId ? { ...b, status: newStatus } : b)) 
      );

      Swal.fire({
        title: "Actualizado",
        text: "El estado del libro ha sido actualizado",
        icon: "success",
      });
    } catch (err) {
      console.error("❌ Error:", err.response?.data);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Error al actualizar",
        icon: "error",
      });
    }
  };

  
  const handleDeleteBook = async (libraryId) => {
    console.log("🗑️ DELETE - libraryId enviado:", libraryId); 
    const result = await Swal.fire({
      title: "¿Eliminar de tu biblioteca?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      console.log("📡 URL:", `/users/${userId}/library/${libraryId}`);
      await apiClient.delete(`/users/${userId}/library/${libraryId}`);
      setBooks(books.filter((b) => b.id !== libraryId)); 
      Swal.fire({
        title: "Eliminado",
        text: "El libro ha sido eliminado de tu biblioteca",
        icon: "success",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Error al eliminar",
        icon: "error",
      });
    }
  };

  return (
    <main className="w-full mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-700 mb-4 sm:mb-0">
          {isOwnProfile ? "Mi Biblioteca" : `Biblioteca de ${books.length > 0 ? "este usuario" : "libros"}`}
        </h1>

        {/* Filtro por estado */}
        <div className="flex items-center space-x-3 rounded-xl">
          <label
            htmlFor="filter"
            className="text-gray-700 font-medium whitespace-nowrap"
          >
            Estado:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-purple-100 border border-purple-300 text-purple-800 font-medium px-4 py-2 rounded-xl shadow-inner cursor-pointer focus:outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Estados */}
      {loading && (
        <section className="flex justify-center items-center h-40">
          <svg
            className="animate-spin -ml-1 mr-3 h-6 w-6 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg text-purple-600">Cargando libros...</p>
        </section>
      )}
      {error && (
        <section
          aria-live="assertive"
          className="text-red-500 text-center p-4 bg-red-50 rounded-lg border border-red-200"
        >
          <span className="font-bold">Error:</span> {error}
        </section>
      )}
      {!loading && filteredBooks.length === 0 && (
        <section className="text-gray-600 text-center p-4">
          {isOwnProfile ? "No tienes libros en este estado." : "Este usuario no tiene libros en este estado."}
        </section>
      )}

      {/* Grid de libros */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => {
          const rawSrc =
            book.book?.coverUrl ?? book.image ?? "/placeholder.jpg";

          const imgSrc = (() => {
            if (typeof rawSrc !== "string") return rawSrc;
            let s = rawSrc.trim();
            if (s.startsWith("//")) s = "https:" + s;
            if (s.startsWith("http://"))
              s = s.replace(/^http:\/\//i, "https://");
            return s;
          })();

          return (
            <article
              key={book.id}
              className="bg-[#F9F9FB] rounded-2xl shadow-xl p-4 flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex gap-4">
              <figure className="w-24 sm:w-28 flex-shrink-0 md:h-auto">
                <img
                  src={imgSrc}
                  alt={book.book.title}
                  height={320}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover rounded-lg shadow-lg aspect-[1/1.6] border border-gray-200"
                />
              </figure>

              <div className="flex flex-col justify-start py-1 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 leading-tight mb-1">
                  {book.book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {book.book.author ?? "Autor desconocido"}
                </p>

                {/* Estado */}
                <span className="mb-2 inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-[#175873] self-start">
                  {STATUS_OPTIONS.find(
                    (opt) => opt.value === book.status
                  )?.label ?? book.status}
                </span>

                {/* Link a detalles */}
                <Link
                  to={`/book/${book.book.id}`}
                  className="mt-auto text-[#8155ba] font-semibold hover:text-purple-900 text-xs  transition-colors duration-200 self-start mb-3"
                >
                  Ver detalles →
                </Link>
                </div>
                </div>

                {/* BOTONES SOLO SI ES TU PERFIL */}
                {isOwnProfile && (
                  <div className="flex gap-2  pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleChangeStatus(book.id, book.status)} 
                      className="flex-1 px-3 py-2 bg-blue-100 text-[#175873]  text-xs font-medium rounded-lg hover:bg-[#647c90] transition"
                    >
                      Cambiar estado
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)} 
                      className="flex-1 px-3 py-2 bg-red-800 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              
            </article>
          );
        })}
      </section>
    </main>
  );
}