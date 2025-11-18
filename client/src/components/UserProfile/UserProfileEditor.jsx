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

  const imgSrc = previewUrl || profile.profilePicture || "";
  const hasProfilePicture = !!imgSrc;

  return (
    <section className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl p-10 rounded-3xl mb-10">
      {/* Modo visualización */}
      {!isEditing ? (
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Foto de perfil */}
          <div className="relative drop-shadow-xl">
            {hasProfilePicture ? (
              <>
                <img
                  src={imgSrc}
                  alt={`Foto de perfil de ${profile.username}`}
                  className="w-40 h-40 rounded-3xl object-cover border border-white/20 shadow-xl"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-300/10 pointer-events-none"></div>
              </>
            ) : (
              <div className="w-40 h-40 rounded-3xl bg-gray-400 border border-white/20 shadow-xl flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <h2 className="text-4xl font-bold text-gray-900/90">
              {profile.username}
            </h2>
            <p className="text-gray-700 text-lg">
              {profile.description || "Sin descripción"}
            </p>
          </div>

          {/* Botón editar */}
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-[#175873] text-white font-semibold rounded-lg hover:bg-[#647c90] transition"
          >
            Editar perfil
          </button>
        </div>
      ) : (
        /* Modo edición */
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Foto de perfil */}
            <div className="relative drop-shadow-xl flex flex-col items-center">
              {hasProfilePicture ? (
                <>
                  <img
                    src={imgSrc}
                    alt="Vista previa"
                    className="w-40 h-40 rounded-2xl object-cover border border-white/50 shadow-xl"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-300/10 pointer-events-none"></div>
                </>
              ) : (
                <div className="w-40 h-40 rounded-3xl bg-gray-300 border border-white/20 shadow-xl flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              <label className="mt-4 block">
                <span className="text-sm font-semibold text-gray-900/90 cursor-pointer bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition border border-white/20">
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
            <div className="flex-1 w-full space-y-3">
              <label className="block text-sm font-semibold text-gray-900/90">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cuéntanos sobre ti..."
                maxLength={500}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-gray-900/90 placeholder-gray-700"
                rows="4"
                disabled={saving}
              />
              <p className="text-xs text-gray-700">
                {description.length}/500 caracteres
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-center md:justify-start">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#175873] text-white font-semibold rounded-lg hover:bg-[#647c90] disabled:bg-gray-400 transition"
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
              className="px-6 py-2 bg-white/20 hover:bg-white/30 text-gray-900/90 font-semibold rounded-lg border border-white/20 disabled:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}