import { useParams, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../api/axios";
import UserProfileViewer from "../components/UserProfile/UserProfileViewer";
import UserLibrary from "../components/UserLibrary";

export default function PublicProfile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = user && parseInt(userId) === user.id;

  const booksReadCount = books.filter(b => b.status === 'read').length;

  useEffect(() => {
    if (isOwnProfile) {
      navigate("/profile", { replace: true });
      return;
    }
  }, [isOwnProfile, navigate]);

  useEffect(() => {
    if (isOwnProfile) return; // No cargar si es tu perfil
    fetchProfileAndBooks();
  }, [userId, isOwnProfile]);

  const fetchProfileAndBooks = async () => {
    try {
      setLoading(true);
      
      // Cargar perfil
      const profileRes = await apiClient.get(`/users/${userId}/public`);
      setProfile(profileRes.data);
      
      // Cargar libros
      const booksRes = await apiClient.get(`/users/${userId}/library`);
      setBooks(booksRes.data ?? []);
      
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-6"><div className="text-purple-600">Cargando...</div></div>;
  if (error) return <div className="flex justify-center p-6"><div className="text-red-500">{error}</div></div>;
  if (!profile) return <div className="flex justify-center p-6"><div className="text-red-500">Perfil no encontrado</div></div>;

  return (
    <main className="w-full min-h-screen p-6">
      <UserProfileViewer profile={profile} booksRead={booksReadCount} />
      <UserLibrary userId={parseInt(userId)} isOwnProfile={false}/>
    </main>
  );
}