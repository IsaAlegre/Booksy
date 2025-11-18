export default function ConfirmDelete({ book, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h3 className="text-xl font-bold mb-4">Confirmar eliminación</h3>
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar "{book.title}"?
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Eliminar
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}