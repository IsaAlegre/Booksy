import { useLibrary } from "../context/LibraryContext";
import LibraryTable from "../components/LibraryTable";
import MainLayout from "../layouts/MainLayout";

export default function Profile() {
  const { library } = useLibrary();

  return (
    <MainLayout>
      <section aria-labelledby="saved-books-title">
        <h2 id="saved-books-title" className="text-xl font-semibold mb-3">📚 Mis libros guardados</h2>
        <LibraryTable books={library}/>
      </section>
    </MainLayout>
  );
}
