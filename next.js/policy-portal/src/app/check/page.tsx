'use client'
import React, { useState, useRef } from 'react';

const options = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'];

export default function SearchableDropdown() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-64 relative" ref={dropdownRef}>
      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="Search city..."
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value);
          setShowOptions(true); // show when typing
        }}
        onFocus={() => setShowOptions(true)} // show on focus
      />

      {showOptions && filteredOptions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border rounded mt-1 max-h-40 overflow-auto z-10">
          {filteredOptions.map(option => (
            <li
              key={option}
              onClick={() => {
                setSelected(option);
                setSearchTerm(option);
                setShowOptions(false);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
