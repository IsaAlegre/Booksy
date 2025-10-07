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
      </ErrorBoundary>
  );
}

export default App;
