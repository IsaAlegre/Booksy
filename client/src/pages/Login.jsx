import LoginForm from "../components/LoginForm";

export default function Login() {
    return (
        <main className="w-full h-screen flex items-center justify-center p-6 bg-[#647c90] ">
            <section className="w-full max-w-lg shadow-lg bg-[#e2ded0] rounded-2xl p-8">
                <LoginForm />
            </section>
        </main>
    )
}