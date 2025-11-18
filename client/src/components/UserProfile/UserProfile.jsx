import { useState, useEffect, useMemo } from "react";
import apiClient from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados del formulario
  const [description, setDescription] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/users/${user?.id}`);
      setProfile(res.data);
      setDescription(res.data.description || "");
      setPreviewUrl(res.data.profilePicture || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
      Swal.fire({
        title: "Error",
        text: "Error al cargar el perfil",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      Swal.fire({
        title: "Campo vacío",
        text: "Por favor ingresa una descripción",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const res = await apiClient.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(res.data.user);
      setProfilePicture(null);
      setIsEditing(false);

      // Actualizar contexto de autenticación
      if (setUser) {
        setUser({
          ...user,
          profilePicture: res.data.user.profilePicture,
        });
      }

      Swal.fire({
        title: "¡Éxito!",
        text: "Tu perfil ha sido actualizado",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al actualizar el perfil";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-purple-600">Cargando perfil...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-red-500 font-semibold">Error al cargar el perfil</p>
      </div>
    );
  }

  const imgSrc = previewUrl || profile.profilePicture || "/placeholder.jpg";

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
      {/* Modo visualización */}
      {!isEditing ? (
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Foto de perfil */}
          <figure className="flex-shrink-0">
            <img
              src={imgSrc}
              alt={`Foto de perfil de ${profile.username}`}
              className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-purple-200"
              loading="lazy"
              decoding="async"
            />
          </figure>

          {/* Información */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{profile.username}</h1>
            <p className="text-gray-600 mt-2 text-lg">
              {profile.description || "Sin descripción"}
            </p>
          </div>

          {/* Botón editar */}
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition self-start md:self-center"
          >
            Editar perfil
          </button>
        </div>
      ) : (
        /* Modo edición */
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Foto de perfil */}
            <div className="flex-shrink-0">
              <img
                src={imgSrc}
                alt="Vista previa"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-purple-200"
              />
              <label className="mt-3 block">
                <span className="text-sm font-semibold text-gray-700 cursor-pointer bg-purple-100 px-3 py-2 rounded-lg hover:bg-purple-200 transition text-center">
                  Cambiar foto
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={saving}
                />
              </label>
            </div>

            {/* Campo de descripción */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cuéntanos sobre ti..."
                maxLength={500}
                className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows="4"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/500 caracteres
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-center md:justify-start">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setDescription(profile.description || "");
                setProfilePicture(null);
                setPreviewUrl(profile.profilePicture || "");
              }}
              disabled={saving}
              className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 disabled:bg-gray-200 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}