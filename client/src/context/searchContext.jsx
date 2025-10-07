import { createContext, useContext } from "react";

const SearchContext = createContext({
  query: "",
  debouncedQuery: "",
  setQuery: () => {}
});

export function SearchProvider({ value, children }) {
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
export function useSearch() {
  return useContext(SearchContext);
}