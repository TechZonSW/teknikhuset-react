// src/components/CustomSelect.jsx

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ options, value, onChange, placeholder = 'Välj...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Stäng dropdownen om man klickar utanför
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Bestäm om options är strängar eller objekt
  const isStringArray = options.length > 0 && typeof options[0] === 'string';

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  // Hämta texten som ska visas
  const getDisplayValue = () => {
    if (!value) return placeholder;
    if (isStringArray) return value;
    return value.label || placeholder;
  };

  // Hämta unik nyckel för option
  const getOptionKey = (option) => {
    if (isStringArray) return option;
    return option.value || option.label;
  };

  // Hämta display-text för option
  const getOptionDisplay = (option) => {
    if (isStringArray) return option;
    return option.label || option.value;
  };

  const displayValue = getDisplayValue();

  return (
    <div className="custom-select-wrapper" ref={selectRef}>
      <div
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'value-selected' : ''}>{displayValue}</span>
        <div className="arrow">
          <ChevronDown size={20} />
        </div>
      </div>

      {isOpen && (
        <ul className="custom-select-options open">
          {options.map((option) => (
            <li
              key={getOptionKey(option)}
              className="custom-select-option"
              onClick={() => handleOptionClick(option)}
            >
              {getOptionDisplay(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;