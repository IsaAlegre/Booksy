import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <main className="w-full h-screen flex items-center justify-center p-6 bg-[#647c90]">
      <section className="w-full max-w-lg shadow-lg bg-[#e2ded0] rounded-2xl p-8">
        <ForgotPasswordForm />
      </section>
    </main>
  );
}