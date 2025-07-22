import React, { useState, useRef, useEffect } from 'react';

type Props = {
  policies: string[];
  onSelect?: (policyNumber: string) => void;
};

export default function SearchableDropdown({ policies, onSelect }: Props) {
  // Initialize with first policy or empty string if none
  const [selected, setSelected] = useState<string | null>(policies[0] ?? null);
  const [searchTerm, setSearchTerm] = useState<string>(policies[0] ?? '');
  const [showOptions, setShowOptions] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = showOptions && searchTerm === selected
  ? policies
  : policies.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    if (policies.length > 0) {
      setSelected(policies[0]);
      setSearchTerm(policies[0]);
      if (onSelect) onSelect(policies[0]);
    }
  }, [policies, onSelect]);

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
    <div className="flex justify-center w-full">
      <div className="w-64 bg-white shadow-lg p-1 relative rounded-4xl" ref={dropdownRef}>
        <input
          type="text"
          className="border p-2 w-full rounded-4xl"
          placeholder="Search policy..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setShowOptions(true);
          }}
          onFocus={() => setShowOptions(true)}
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
                  onSelect?.(option);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
