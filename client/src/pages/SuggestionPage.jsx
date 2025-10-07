import MainLayout from "../layouts/MainLayout";
import SuggestionForm from "../components/SuggestionForm";

export default function SuggestionPage() {
    return (
            <main className="w-full m-h-screen flex items-center justify-center p-6 ">
                <section className=" w-full max-w-lg shadow-lg bg-white rounded-2xl p-8">
                    <SuggestionForm />
                </section>
            </main>
    );
}