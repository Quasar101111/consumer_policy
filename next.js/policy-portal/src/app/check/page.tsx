
import { totalPremium, viewPolicyNumbers } from "@/services/apitest";
import { formatNumberWithCommas } from "@/utils/formatNumber";

import Link from "next/link";
import { getAuthenticatedUsername, getAuthenticatedUsername1 } from "@/utils/authenticate";
import DashboardClient from "./dashboardClient";

import CollapsibleSidebar from "@/components/sidebar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSliders } from "@fortawesome/free-solid-svg-icons";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  
  let premium = "0";
  let premiumCount = 0;

 

          const username = await getAuthenticatedUsername1();
        

          const result = await totalPremium(username);
          premium=formatNumberWithCommas(result);

          const result1 = await viewPolicyNumbers(username);
          premiumCount=result1.length;
          
        
     
  

   

  return (
    
   <div className="flex min-h-screen bg-gray-100">
      <CollapsibleSidebar />

      <div className="flex flex-1 flex-col items-center justify-center py-8 px-2">
        <div className="relative w-full max-w-md flex flex-col items-center justify-center gap-6 md:block">

          {/* Policy Count */}
          <div className="relative md:absolute md:top-[-200px] md:left-1/2 md:transform md:-translate-x-1/2 text-center">
            <div className="bg-white rounded-full shadow p-4 w-40 h-40 flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <h3 className="text-sm font-semibold text-gray-600">Policy Count</h3>
              <p className="text-lg font-bold text-blue-600">{premiumCount}</p>
            </div>
          </div>

          {/* Policy Total Value */}
          <div className="relative md:absolute md:left-0 md:top-1/2 md:transform md:-translate-y-1/2 text-center">
            <div className="bg-white rounded-full shadow p-4 w-40 h-40 flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <h3 className="text-sm font-semibold text-gray-600">Policy Total Value</h3>
              <p className="text-lg font-bold text-green-600">{premium}</p>
            </div>
          </div>

          {/* Add Policy */}
          <div className="relative md:absolute md:right-0 md:top-1/2 md:transform md:-translate-y-1/2 text-center">
            <div className="bg-white rounded-full shadow p-4 w-40 h-40 flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <h3 className="text-sm font-semibold text-gray-600">Add Policy</h3>
              <Link href="/add_policy">
                <button className="mt-2 text-white bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 shadow-lg rounded-full p-3">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </Link>
            </div>
          </div>

          {/* Manage Policies */}
          <div className="relative md:absolute md:top-30 md:right-1/2 md:transform md:translate-x-1/2 md:-translate-y-1/2 text-center">
            <div className="bg-white rounded-full shadow p-4 w-40 h-40 flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <h3 className="text-sm font-semibold text-gray-600">Manage Policies</h3>
              <Link href="/manage_policies">
                <button className="mt-2 text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 shadow-lg rounded-full p-3">
                  <FontAwesomeIcon icon={faSliders} />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
}