export default function LibraryTable({ books }) {


  if (!books || books.length === 0) {
    return <p className="text-gray-500">No tienes productos guardados</p>;
  }

  return (
    <table className="table-auto border-collapse border border-gray-300 w-full">
      <thead>
        <tr className="bg-gray-200">
          <th scope="col" className="border border-gray-300 px-4 py-2">Título</th>
          <th scope="col" className="border border-gray-300 px-4 py-2">Autor</th>
          <th scope="col" className="border border-gray-300 px-4 py-2">Fecha guardado</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td className="border border-gray-300 px-4 py-2">{book.title}</td>
            <td className="border border-gray-300 px-4 py-2">{book.author}</td>
            <td className="border border-gray-300 px-4 py-2">
              {new Date(book.savedAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
