import { useParams, useNavigate } from "react-router-dom";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  if (!token) {
    return (
      <main className="w-full h-screen flex items-center justify-center p-6 bg-[#647c90]">
        <section className="w-full max-w-lg shadow-lg bg-[#e2ded0] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600">Token inválido</h2>
          <p className="text-gray-600 mt-2">El enlace de reseteo no es válido o ha expirado.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="mt-4 px-6 py-2 bg-[#647c90] text-white rounded-lg hover:bg-[#b9b7bd]"
          >
            Solicitar nuevo enlace
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full h-screen flex items-center justify-center p-6 bg-[#647c90]">
      <section className="w-full max-w-lg shadow-lg bg-[#e2ded0] rounded-2xl p-8">
        <ResetPasswordForm token={token} />
      </section>
    </main>
  );
}