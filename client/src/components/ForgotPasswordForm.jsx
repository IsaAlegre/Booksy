import { useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axios";
import { toast } from "react-toastify";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const validateEmail = (value) => {
    if (!value || value.trim() === "") {
      return "El correo es obligatorio.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Por favor ingresa un correo válido.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      
      toast.success("Correo enviado");
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al enviar el correo. Intenta de nuevo.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#e2ded0] rounded-2xl">
      <header className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">¿Olvidaste tu contraseña?</h2>
        <p className="text-gray-600 text-sm mt-2">
          Ingresa tu correo y te enviaremos un enlace para resetear tu contraseña
        </p>
      </header>

      {submitted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center mb-4">
          <p className="font-semibold">¡Correo enviado!</p>
          <p className="text-sm mt-2">
            Revisa tu correo para encontrar el enlace de reseteo. Si no ves el correo, verifica tu carpeta de spam.
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="tu@correo.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:bg-gray-100"
            disabled={loading || submitted}
            required
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>

        {/* Botón enviar */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading || submitted}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
              loading || submitted
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-[#647c90] hover:bg-[#b9b7bd] text-white"
            }`}
          >
            {loading ? "Enviando..." : submitted ? "Correo enviado" : "Enviar correo"}
          </button>
        </div>

        {/* Links */}
        <div className="flex justify-center gap-2 text-sm text-gray-600 mt-4">
          <Link to="/login" className="font-medium text-blue-400 hover:underline">
            Volver al login
          </Link>
          <span>|</span>
          <Link to="/register" className="font-medium text-blue-400 hover:underline">
            Crear cuenta
          </Link>
        </div>
      </form>
    </section>
  );
}