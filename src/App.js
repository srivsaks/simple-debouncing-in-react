import "./styles.css";
import React, { useCallback, useState } from "react";

export default function App() {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    (val) => {
      console.log(val);
      if (isLoading) return;
      setIsLoading(true);
      fetch(`https://openlibrary.org/search.json?q=${val}&page=1`)
        .then(async (res) => {
          const response = await res.json();
          console.log(response.docs);
          setSuggestions((prev) => [...prev.concat(response.docs)]);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [isLoading]
  );

  const debounce = useCallback((fn) => {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, 1000);
    };
  }, []);
  const optimizedFn = useCallback(debounce(fetchData, 1000), []);
  return (
    <>
      <h2 style={{ textAlign: "center" }}>Debouncing in React JS</h2>

      <input
        type="text"
        className="search"
        placeholder="Enter something here..."
        onInput={(e) => optimizedFn(e.target.value)}
      />

      {suggestions.length > 0 && (
        <div className="autocomplete">
          {suggestions.map((el, i) => (
            <div key={i} className="autocompleteItems">
              <span>{el.title}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
