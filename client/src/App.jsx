import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BookDetail from "./pages/BookDetail.jsx";
import SuggestionPage from "./pages/SuggestionPage.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import './index.css';
import ErrorBoundary from "./components/Error/ErrorBoundary.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
      <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout/>}>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/SuggestionPage" element={<SuggestionPage />} />
        <Route path="/Profile" element={<Profile />} />
        </Route>
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
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
