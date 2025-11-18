import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import apiClient from "../api/axios";
import { toast } from "react-toastify";

export default function ResetPasswordForm({ token }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (name === "password") {
      if (!value) return "La contraseña es obligatoria.";
      if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
      if (!/[A-Z]/.test(value)) return "Debe contener al menos una mayúscula.";
      if (!/[0-9]/.test(value)) return "Debe contener al menos un número.";
      return "";
    }
    if (name === "confirmPassword") {
      if (!value) return "Debes confirmar la contraseña.";
      if (value !== formData.password) return "Las contraseñas no coinciden.";
      return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const msg = validateField(key, formData[key]);
      if (msg) newErrors[key] = msg;
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = validateForm();
    setErrors(newErrors);
    setTouched({ password: true, confirmPassword: true });

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      await apiClient.post(`/auth/reset-password/${token}`, {
        password: formData.password,
      });

      toast.success("¡Contraseña actualizada exitosamente!");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Error al resetear la contraseña. Intenta de nuevo.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#e2ded0] rounded-2xl">
      <header className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Resetear contraseña</h2>
        <p className="text-gray-600 text-sm mt-2">
          Ingresa tu nueva contraseña
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Nueva contraseña */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:bg-gray-100"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-9 right-3 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </button>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        {/* Confirmar contraseña */}
        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:bg-gray-100"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute top-9 right-3 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </button>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
        </div>

        {/* Requisitos de contraseña */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
          <p className="font-semibold mb-2">La contraseña debe contener:</p>
          <ul className="list-disc list-inside space-y-1">
            <li className={formData.password.length >= 8 ? "text-green-600" : "text-gray-600"}>
              Mínimo 8 caracteres
            </li>
            <li className={/[A-Z]/.test(formData.password) ? "text-green-600" : "text-gray-600"}>
              Al menos una mayúscula
            </li>
            <li className={/[0-9]/.test(formData.password) ? "text-green-600" : "text-gray-600"}>
              Al menos un número
            </li>
          </ul>
        </div>

        {/* Botón enviar */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-[#647c90] hover:bg-[#b9b7bd] text-white"
            }`}
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </div>

        {/* Link */}
        <div className="flex justify-center text-sm text-gray-600 mt-4">
          <Link to="/login" className="font-medium text-blue-400 hover:underline">
            Volver al login
          </Link>
        </div>
      </form>
    </section>
  );
}