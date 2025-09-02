import MainLayout from "../layouts/MainLayout";
import BookCard from "../components/BookCard";
import books1 from "../data/books1.json";



export default function Home() {



return (
    <MainLayout>
      <section aria-labelledby="seccion-title" data-testid="recomendations-section">
        <h2 
        id="seccion-title"
        className="text-xl font-extrabold text-purple-700 mb-6">
          You may like
          </h2>
        <div className=" flex flex-wrap justify-start gap-6">
          {books1.map((book) => (
            <BookCard key={book.id} book={book} />
            ))}
        </div>
      </section>
    </MainLayout>
  );
}