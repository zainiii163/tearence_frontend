import React, { useState, useEffect } from "react";

const AutocompleteDropdown = ({ data, onSelect, selected, displayKey }) => {
  const [query, setQuery] = useState(selected ?? "");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    if (selected) {
      const selectedItem = data.find((item) => item.zone_id === selected);
      if (selectedItem) {
        setQuery(selectedItem[displayKey]);
      }
      setSuggestions([]);
    } else {
      setSuggestions(data);
    }
  }, [selected, data, displayKey]);
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const filteredSuggestions = data.filter((item) =>
        item[displayKey].toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions(data);
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding to allow click event to register
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        selectSuggestion(suggestions[selectedIndex]);
      }
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion[displayKey]);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect(suggestion);
  };

  const handleSuggestionClick = (suggestion) => {
    selectSuggestion(suggestion);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Type to search..."
        className="border border-gray-300 p-2 rounded-md w-full"
      />
      {showSuggestions && (
        <ul className="absolute left-0 right-0 border border-gray-300 mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg bg-white z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion?.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-2 cursor-pointer hover:bg-slate-50 ${
                selectedIndex === index ? "bg-gray-200" : ""
              }`}
            >
              {suggestion[displayKey]}
            </li>
          ))}
          {suggestions.length === 0 && (
            <li
              key={"value"}
              onClick={() => handleSuggestionClick({ id: query, name: query })}
              className={`px-4 py-2 cursor-pointer hover:bg-slate-50`}
            >
              {query}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteDropdown;
