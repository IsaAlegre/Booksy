import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BookDetail from "./pages/BookDetail.jsx";
import SuggestionPage from "./pages/SuggestionPage.jsx";
import Profile from "./pages/Profile.jsx";
import { LibraryProvider } from "./context/LibraryContext.jsx";
import './index.css';
import ErrorBoundary from "./components/Error/ErrorBoundary.jsx";


function App() {
  return (
    <LibraryProvider>
      <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/SuggestionPage" element={<SuggestionPage />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
      </ErrorBoundary>
      </LibraryProvider>
  );
}

export default App;
