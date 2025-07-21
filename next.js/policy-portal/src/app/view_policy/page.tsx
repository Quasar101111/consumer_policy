'use client';

import CollapsibleSidebar from "@/components/sidebar";
import { useState } from "react";


export default function ViewPolicy() {

    const [activetab, setactivetab]= useState('personal');
  return (
    <div className="min-h-screen bg-gray-100 p-6">
     
     <div className="w-32">
    <CollapsibleSidebar />
  </div>

      {/* Main Content */}
     <div className="mt-10 ml-15 mr-auto sm:ml-auto max-w-sm sm:max-w-[80%] md:max-w-lg lg:max-w-xl bg-white p-6 sm:p-6 rounded shadow">
        
          
        
          <ul className="flex flex-wrap justify-center text-sm font-medium text-gray-500">
            <li className="me-2">
              <button  onClick={() => setactivetab('personal')}
              className={`px-4 py-2 rounded-lg ${
                activetab === 'personal'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
             personal Detaisl
            </button>
            </li>
            <li className="me-2">
              <a href="#" className="inline-block px-4 py-2 sm:py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100">
                Tab 2
              </a>
            </li>
            <li className="me-2">
              <a href="#" className="inline-block px-4 py-2 sm:py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100">
                Tab 3
              </a>
            </li>
            <li className="me-2">
              <a href="#" className="inline-block px-4 py-2 sm:py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100">
                Tab 4
              </a>
            </li>
            <li>
              <a className="inline-block px-4 py-2 sm:py-3 text-gray-400 cursor-not-allowed">
                Tab 5
              </a>
            </li>
          </ul>

         {/* Tab Content */}
        <div className="border-t pt-4">
          {activetab === 'personal' && (
            <div className="card bg-gray-300">
              <h3 className="text-lg font-semibold mb-2"> personal Details</h3>
              <p>First Name: John</p>
              <p>Last Name: Doe</p>
              <p>Mobile: 1234567890</p>
              <p>Email: john@example.com</p>
            </div>
          )}
       </div>
      </div>
    </div>
  );
}
