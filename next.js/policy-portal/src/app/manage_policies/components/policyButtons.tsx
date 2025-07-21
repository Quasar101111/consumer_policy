'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


interface PolicyButtonsProps {
  status: 'Active' | 'Inactive';
  onDelete: () => void;
  onToggle: () => void;
  policyId: number;
}

const PolicyButtons: React.FC<PolicyButtonsProps> = ({ status, onDelete, onToggle }) => {
  const isActive = status === 'Active';

  return (
    <div className="flex items-center gap-6">
    
      <button
        onClick={onDelete}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-full hover:bg-red-600 hover:text-white transition"
      >
        <FontAwesomeIcon icon={faTrash} />
        Delete
      </button>

     
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isActive}
          onChange={onToggle}
          className="sr-only peer"
        />
     <div className="group peer ring-0 bg-red-500 rounded-full outline-none duration-300 after:duration-300 
            w-16 h-8 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none 
            after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none 
            after:h-6 after:w-6 after:top-1 after:left-1 after:-rotate-180 
            after:flex after:justify-center after:items-center 
            peer-checked:after:translate-x-8 peer-checked:after:content-['✔️'] 
            peer-hover:after:scale-95 peer-checked:after:rotate-0" />

      </label>
    </div>
  );
};

export default PolicyButtons;
