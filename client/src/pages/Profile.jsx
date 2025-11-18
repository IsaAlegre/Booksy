import UserLibrary from "../components/UserLibrary";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import UserProfileEditor from "../components/UserProfile/UserProfileEditor";


export default function Profile() {

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!user || !isAuthenticated) {
    return null;
  }

  return (
    <main className="w-full min-h-screen p-6">
      <UserProfileEditor />
      <UserLibrary userId={user.id} isOwnProfile={true} />
    </main>
  );
}
