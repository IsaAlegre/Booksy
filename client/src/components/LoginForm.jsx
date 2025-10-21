import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";

export default function LoginForm() {
  const navigate = useNavigate();
  const {login } = useAuth();
  const [formData, setFormData] = useState({
    username:"",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    if (name === "username") {
      if (!value || value.trim() === "") return "El nombre de usuario es obligatorio.";
      if (value.trim().length < 3) return "El usuario debe tener al menos 3 caracteres.";
      return "";
    }
    if (name === "password") {
      if (!value) return "La contraseña es obligatoria.";
      if (value.length < 6) return "La contraseña debe tener al menos 8 caracteres.";
      return "";
    }
    return "";
  };

  const validateForm = (data) => {
    const newErrors = {};
    Object.keys(data).forEach((key) => {
      const msg = validateField(key, data[key]);
      if (msg) newErrors[key] = msg;
    });
    return newErrors;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newErrors = validateForm(formData);
    setErrors(newErrors);
    setTouched({ username: true, password: true });

    if (Object.keys(newErrors).length > 0) {
      setLoading(false); // Detener el loading si hay errores de validación
      return;
    }


    try {
      await login(formData.username, formData.password); // Guarda el token usando el contexto
      toast.success("Inicio de sesión exitoso!");
      navigate("/"); // Redirige a la página principal
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error al iniciar sesion, por favor intenta de nuevo.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="form-title"
      className=" bg-[#e2ded0] rounded-2xl mt-10 "
    >
      <header className="form-header">
      <h2
        id="form-title"
        className="form-title"
      >
        Bienvenido a Booksy
      </h2>
      <p className="text-gray-600 text-sm mt-1">
        Por favor, inicia sesión para continuar
      </p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Usuario */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
            className="form-input"
            placeholder="Nombre de usuario"
            disabled={loading}
          />
            {errors.username && <p className="form-error">{errors.username}</p>}
        </div>

        {/* Conteasenia */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            required
            placeholder="********"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-9 right-3 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-500"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </button>
          {error && <div className="form-error">{error}</div>}
          
          {errors.password && (
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        {/* Muestra el mensaje de error general */}
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <p className="text-sm text-gray-600 flex justify-center">
            Todavia no tienes una cuenta?{' '}
            <Link to="/Register" className="ml-0.5 font-medium text-blue-400 hover:underline">
               Regístrate aquí
            </Link>
        </p>

        {/* Botón enviar */}
        <div className="flex justify-center mt-3"> 
          <button
          type="submit"
          disabled={loading}
          className={`w-[150px] py-2 px-4 rounded-lg transition 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#647c90] hover:bg-[#b9b7bd] text-white"}`}
          >
            {loading ? "Enviando..." : "Iniciar Sesión"}
          </button>
        </div>
      </form>
    </section>
  );
}
