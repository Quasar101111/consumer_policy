'use client';
import CollapsibleSidebar from "@/components/sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    
    faPlus,
   faSliders,
} from '@fortawesome/free-solid-svg-icons';

import { totalPremium } from "@/services/api";
import { useState ,useEffect} from "react";


export default function DashboardPage() {
    const [premium, setpremium] = useState(0) ;
   
    useEffect(()=>{
         const loadData = async () => {
      const username = localStorage.getItem("username");
      if (username) {
        const result = await totalPremium(username);
        setpremium(result);
      }
    };

    loadData(); 
  }, []);


  return (
    <div style={{ display: 'flex' }}>
      <CollapsibleSidebar />
      <div className="flex items-center justify-center h-screen bg-gray-100 w-full">
        <div className="relative w-[400px] h-[400px]">
        
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-white rounded-full shadow p-4 w-40 h-40 flex flex-col justify-center items-center  hover:">
              <h3 className="text-sm font-semibold text-gray-600">policy count</h3>
              <p className="text-lg font-bold text-blue-600">5</p>
            </div>
          </div>

      
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-center">
            <div className="bg-white rounded-full shadow p-4 w-40 h-40 flex flex-col justify-center items-center">
              <h3 className="text-sm font-semibold text-gray-600">policy total vaule</h3>
              <p className="text-lg font-bold text-green-600">{premium}</p>
            </div>
          </div>

          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-center">
            <div className="bg-white rounded-full shadow p-4 w-40 h-40 flex flex-col justify-center items-center">
              <h3 className="text-sm font-semibold text-gray-600">Add policy</h3>
              <p className="text-lg font-bold text-yellow-600"><button type="button" className="text-white bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 shadow-lg shadow-yellow-500/50 dark:shadow-lg dark:shadow-yellow-800/80
                 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 " ><FontAwesomeIcon icon={faPlus} /></button></p>
            </div>
          </div>


           <div className="absolute top-[80%] right-1/2 transform translate-x-1/2 -translate-y-1/2 text-center">

            <div className="bg-white rounded-full shadow p-4 w-40 h-40 flex flex-col justify-center items-center">
              <h3 className="text-sm font-semibold text-gray-600">Manage policy</h3>
              <p className="text-lg font-bold text-gray-600"><button type="button" className="text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80
                 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 " ><FontAwesomeIcon icon={faSliders} /></button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
