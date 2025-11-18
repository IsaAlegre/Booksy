import AdminLayout from '../components/Admin/AdminLayaut';
import BooksList from '../components/Admin/BooksList';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <BooksList />
    </AdminLayout>
  );
}