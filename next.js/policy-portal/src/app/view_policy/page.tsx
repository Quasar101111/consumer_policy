'use client';

import CollapsibleSidebar from "@/components/sidebar";
import { useState,useEffect } from "react";
import SearchableDropdown from "@/components/dropdownSearch";
import { viewPolicyNumbers } from "@/services/api";



export default function ViewPolicy() {

    const [activetab, setactivetab]= useState('personal');
    const [policies, setpolicies] = useState<string[]>([]);
     const [loading, setloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

      useEffect(() => {
    const loadData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) return;
        const result = await viewPolicyNumbers(username);
        setpolicies(result);
      } finally {
        setloading(false);
      }
    };
    loadData();
   
  }, []);
     
  console.log(policies);
      
    
  return (
    <div className="min-h-screen bg-gray-100 p-6">
     
     <div className="w-32">
    <CollapsibleSidebar />
  </div>


  <div className="mt-2 ml-15 mr-auto sm:ml-auto max-w-sm sm:max-w-[80%] md:max-w-lg lg:max-w-xl bg-white p-4 sm:p-4 rounded shadow">
        
          
        
   <h3 className="text-lg font-semibold mb-4 text-center">Select a Policy</h3>
     <SearchableDropdown policies={policies} onSelect={setSelectedPolicy} />
          
 
</div>



      
      
      {/* Main Content */}

     <div className="mt-2 ml-15 mr-auto sm:ml-auto max-w-sm sm:max-w-[80%] md:max-w-lg lg:max-w-xl bg-white p-6 sm:p-6 rounded shadow">
        
          
        
          <ul className="flex flex-wrap justify-center text-sm font-medium text-gray-500">
            <li className="me-2">
              <button  onClick={() => setactivetab('personal')}
              className={`px-4 py-2 rounded-lg ${
                activetab === 'personal'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
             personal Details
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
