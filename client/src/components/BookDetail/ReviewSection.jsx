import { useState, useEffect } from "react";
import apiClient from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ReviewSection({ bookId }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado del formulario
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Cargar reseñas
  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/books/${bookId}/reviews`);
      setReviews(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error cargando reseñas");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para dejar una reseña",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    if (!comment.trim()) {
      Swal.fire({
        title: "Campo vacío",
        text: "Por favor escribe una reseña",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    setSubmitting(true);

    try {
      await apiClient.post(`/books/${bookId}/reviews`, {
        comment: comment.trim(),
        rating: parseInt(rating),
      });

      Swal.fire({
        title: "¡Reseña publicada!",
        text: "Tu reseña ha sido guardada exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      setComment("");
      setRating(5);
      setShowForm(false);
      fetchReviews(); // Recargar reseñas
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error publicando reseña";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: "¿Eliminar reseña?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await apiClient.delete(`/books/${bookId}/reviews/${reviewId}`);
      
      Swal.fire({
        title: "Eliminada",
        text: "Tu reseña ha sido eliminada",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      
      fetchReviews();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error eliminando reseña";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

   const handleUserClick = (userId) => {
    navigate(`/users/${userId}/public`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-purple-600">Cargando reseñas...</div>
      </div>
    );
  }

  return (
    <section className="mt-8 bg-white/70 backdrop-blur shadow-lg rounded-2xl p-8 border border-purple-100">
      {/* Encabezado */}
      <header className="mb-8 border-b pb-4 border-purple-200 flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-800">
          Reseñas
        </h2>
        <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
          {reviews.length}
        </span>
      </header>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Botón para abrir formulario */}
      {isAuthenticated && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 bg-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all"
        >
          Escribir una reseña
        </button>
      )}

      {/* Formulario de reseña */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Calificación: {rating} ⭐
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tu reseña
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos tu opinión sobre este libro..."
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows="4"
              disabled={submitting}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
            >
              {submitting ? "Publicando..." : "Publicar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setComment("");
                setRating(5);
              }}
              disabled={submitting}
              className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 disabled:bg-gray-200 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay reseñas aún. ¡Sé el primero en dejar una!</p>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="p-6 bg-white border border-purple-100 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <header className="flex items-start justify-between mb-2">
                <div>
                  <h3 
                    onClick={() => handleUserClick(review.user?.id)}
                    className="font-bold text-purple-800 hover:text-purple-600 cursor-pointer transition">{review.user?.username || "Usuario"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">{"⭐".repeat(review.rating || 0)}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>

                {isAuthenticated && user?.id === review.user?.id && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold transition"
                  >
                    Eliminar
                  </button>
                )}
              </header>

              <p className="text-gray-700 mt-2 leading-relaxed">{review.comment}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}