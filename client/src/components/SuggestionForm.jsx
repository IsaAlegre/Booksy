import { useState } from "react";

export default function SuggestionForm() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    suggestion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sugerencia enviada:", formData);

    // Resetea el formulario después de enviar
    setFormData({
      title: "",
      author: "",
      genre: "",
      suggestion: "",
    });
  };
  return (
    <section
      aria-labelledby="form-title"
      className=" bg-transparent  rounded-2xl mt-10 "
    >
      <header className="mb-6 text-center">
      <h2
        id="form-title"
        className="text-2xl font-extrabold text-purple-700"
      >
        ¿Qué libro crees que falta?
      </h2>
      <p className="text-gray-600 text-sm mt-1">
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
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-purple-300"
            placeholder="Ej: El Señor de los Anillos"
          />
        </div>

        {/* Autor */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Autor
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-purple-300"
            placeholder="Ej: J.R.R. Tolkien"
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-purple-300"
            placeholder="Ej: Fantasía"
          />
        </div>

        {/* Recomendación de mejora */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Qué mejorarías del sistema?
          </label>
          <textarea
            name="suggestion"
            value={formData.suggestion}
            onChange={handleChange}
            rows="3"
            className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-purple-300"
            placeholder="Escribe tus sugerencias..."
          />
        </div>

        {/* Botón enviar */}
        <div className="flex justify-end">
          <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
        >
          Enviar sugerencia
          </button>
        </div>
      </form>
    </section>
  );
}
