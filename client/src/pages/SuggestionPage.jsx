import MainLayout from "../layouts/MainLayout";
import SuggestionForm from "../components/SuggestionForm";

export default function SuggestionPage() {
    return (
        <MainLayout>
            <main className="w-full m-h-screen flex items-center justify-center p-6 ">
                <section className="w-full max-w-lg shadow-lg bg-transparent rounded-2xl p-8">
                    <SuggestionForm />
                </section>
            </main>
        </MainLayout>
    );
}