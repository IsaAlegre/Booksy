// LibraryContext.jsx
import { createContext, useContext, useState } from "react";

const LibraryContext = createContext();

export function LibraryProvider({ children }) {
    const [library, setLibrary] = useState([]);

    const addBook = (book) => {
        const isBookInLibrary = library.some((item) => item.id === book.id);
        if (!isBookInLibrary) {
            setLibrary((prevLibrary) => [
                ...prevLibrary,
                { ...book, savedAt: new Date().toISOString() },
            ]);
        } else {
            alert(`"${book.title}" ya está en tu biblioteca.`);}
        };
    
        return (
        <LibraryContext.Provider value={{ library, addBook }}>
            {children}
            </LibraryContext.Provider>
            );
        }

// Hook para consumir el contexto
export function useLibrary() {
    return useContext(LibraryContext);
}