import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import apiClient from "../api/axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username:"",
    email:"",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    setError(null);
  };

  const validate = (data) => {
    const errs = {};
    if (!data.username) errs.username = "El nombre de usuario es obligatorio.";
    if (!data.email) errs.email = "El correo es obligatorio.";
    if (!data.password) errs.password = "La contraseña es obligatoria.";
    else if (data.password.length < 8) errs.password = "La contraseña debe tener al menos 8 caracteres.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError(null);
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/auth/register', formData);
      alert("Registro exitoso, por favor inicia sesión.");
      navigate("/Login"); // Redirige a la página de login
    }catch (err) {
      console.error("Error al registrar, por favor intenta de nuevo:", err.response ?? err);
      let message = "Error al registrar, por favor intenta de nuevo.";
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") message = data;
        else if (data.message) message = data.message;
        else if (Array.isArray(data.errors)) message = data.errors.map(x => x.msg || x).join(", ");
        else message = JSON.stringify(data);
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="form-title"
      className="bg-[#e2ded0] rounded-2xl mt-10 "
    >
      <header className="form-header">
      <h2
        id="form-title"
        className="form-title"
      >
        Bienvenido a Booksy
      </h2>
      <p className="text-gray-600 text-sm mt-1">
        Complete el formulario para crear una cuenta
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
            required
            className="form-input"
            placeholder="Nombre de usuario"
            disabled={loading}
          />
          {validationErrors.username && (
            <p className="form-error">{validationErrors.username}</p>
          )}
        </div>

        {/* Correo Electrónico */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="isa@gmail.com"
            disabled={loading}
          />
          {validationErrors.email && (
            <p className="form-error">{validationErrors.email}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
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
          {validationErrors.password && (
            <p className="form-error">{validationErrors.password}</p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center -mt-2 mb-2">
            {error}
          </div>
        )}


        {/* Botón enviar */}
        <div className="flex justify-center mt-6">
          <button
          type="submit"
          disabled={loading}
          className={`w-[150px] py-2 px-4 rounded-lg transition 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#647c90] hover:bg-[#b9b7bd] text-white"}`}
          >
            {loading ? "Enviando..." : "Registrarse"}
          </button>
        </div>

         <p className="text-sm text-gray-600 flex justify-center">
            Ya tienes una cuenta?{' '}
            <Link to="/Login" className="ml-0.5 font-medium text-blue-400 hover:underline">
                Inicia sesión aquí
            </Link>
        </p>

      </form>
    </section>
  );
}
