import React, { useEffect, useRef, useState } from "react";

const Index = (props) => {
  const { onSelect, label, options } = props;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleClear = () => {
    setSelectedOptions([]);
    setIsOpen(false);
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    onSelect(selectedOptions);

    return () => {};
  }, [selectedOptions, onSelect]);

  return (
    <div className="w-full max-w-xs">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleToggleDropdown}
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {selectedOptions.length
            ? selectedOptions.map((option) => option.Name).join(", ")
            : label}
        </button>
        {isOpen && (
          <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
            <div className="ring-1 ring-black ring-opacity-5">
              <ul className="max-h-60 rounded-md py-1 text-base  overflow-auto focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <li
                    key={option.Name}
                    className="text-gray-900 cursor-default select-none relative py-2 pl-10 pr-4"
                  >
                    <div className="flex items-center">
                      <input
                        id={option.Name}
                        name={option.Name}
                        type="checkbox"
                        checked={selectedOptions.includes(option)}
                        onChange={() => handleOptionChange(option)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={option.Name}
                        className="ml-3 block text-sm text-gray-700"
                      >
                        {option.Name}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleClear}
                className="mt-2 w-full bg-white text-black rounded-md py-2 text-center"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
