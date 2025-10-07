import { useState } from "react";
import apiClient from "../api/axios";
import Swal from "sweetalert2";

export default function SuggestionForm() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    suggestion: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/suggestions", formData);
      await Swal.fire({
        title: "¡Gracias!",
        text: "Tu sugerencia ha sido enviada.",
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: { popup: "rounded-xl" },
      });
      setFormData({ title: "", author: "", genre: "", suggestion: "" });
    } catch (err) {
      console.error("Error al enviar sugerencia:", err);
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Error al enviar sugerencia, por favor intenta de nuevo.";
      await Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: { popup: "rounded-xl" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="form-title"
      className="bg-white  rounded-2xl mt-10 "
    >
      <header className="mb-6 text-center">
        <h2
          id="form-title"
          className="text-2xl font-extrabold text-[#175873]"
        >
          ¿Qué libro crees que falta?
        </h2>
        <p className="text-[#647c90] text-sm mt-1">
          Dejanos tu sugerencia y ayudanos a mejorar
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Nombre del libro */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del libro
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-lg"
            placeholder="Ej: El Señor de los Anillos"
            disabled={loading}
          />
        </div>

        {/* Autor */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Autor
          </label>
          <input
            id="author"
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-lg  "
            placeholder="Ej: J.R.R. Tolkien"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <input
            id="genre"
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg  "
            placeholder="Ej: Fantasía"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Qué mejorarías del sistema?
          </label>
          <textarea
            id="suggestion"
            name="suggestion"
            value={formData.suggestion}
            onChange={handleChange}
            rows="3"
            className="w-full mt-1 p-2 border rounded-lg  "
            placeholder="Escribe tus sugerencias..."
            disabled={loading}
          />
        </div>

        {/* Botón enviar */}
        <div className="flex justify-center mt-6">
          <button
          type="submit"
          disabled={loading}
          className={`w-[200px] py-2 px-4 rounded-lg transition 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#647c90] hover:bg-purple-900 text-white"}`}
          >
            {loading ? "Enviando..." : "Enviar sugerencia"}
          </button>
        </div>
      </form>
    </section>
  );
}
