import React, { useState } from 'react';

const options = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'];

export default function SearchableDropdown() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64">
      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="Search city..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ul className="border rounded mt-1 max-h-40 overflow-auto">
        {filteredOptions.map(option => (
          <li
            key={option}
            onClick={() => {
              setSelected(option);
              setSearchTerm(option); // Set selected value
            }}
            className="p-2 hover:bg-gray-200 cursor-pointer"
          >
            {option}
          </li>
        ))}
      </ul>

      {selected && (
        <p className="text-sm text-gray-600 mt-2">Selected: {selected}</p>
      )}
    </div>
  );
}
