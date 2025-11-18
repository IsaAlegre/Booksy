import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BookDetail from "./pages/BookDetail.jsx";
import SuggestionPage from "./pages/SuggestionPage.jsx";
import Profile from "./pages/Profile.jsx";
import PublicProfile from "./pages/PublicProfile.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ResetPasswordForm from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import './index.css';
import ErrorBoundary from "./components/Error/ErrorBoundary.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLayout from "./components/Admin/AdminLayaut.jsx";
import BookForm from "./components/Admin/BookForm.jsx";


function App() {
  return (
      <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout/>}>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/SuggestionPage" element={<SuggestionPage />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/users/:userId/public" element={<PublicProfile />} />
        // Agrega estas rutas a tu configuración de React Router
        </Route>
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/books" element={<AdminDashboard />} />
        <Route path="/admin/books/new" element={<AdminLayout><BookForm /></AdminLayout>} />
        <Route path="/admin/books/:id/edit" element={<AdminLayout><BookForm /></AdminLayout>} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      </ErrorBoundary>
  );
}

export default App;
