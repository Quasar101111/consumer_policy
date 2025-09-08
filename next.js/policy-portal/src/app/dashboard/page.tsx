'use client';
import CollapsibleSidebar from "@/components/sidebar";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSliders } from '@fortawesome/free-solid-svg-icons';
import { totalPremium, viewPolicyNumbers } from "@/services/api";
import { useState, useEffect } from "react";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getAuthenticatedUsername } from "@/utils/authenticate";
import ErrorFallback from "@/components/errorBoundary";
import { ErrorBoundary } from "react-error-boundary";


function BrokenContent(){
  throw new Error("error occured");
}
const InlinePolicyFallback = () => (
<div className="bg-amber-600 rounded-full shadow p-4 w-40 h-40 flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:shadow-xl">
   
    <h3 className="text-sm font-semibold">Policy Total Value</h3>
    <p className="text-sm">!!! Error</p>
  </div>
);


export default function DashboardPage() {
  const [premium, setpremium] = useState<string>("0");
  const [premiumCount, setpremiumCount] = useState(0);

  
  const { data: session, status } = useSession();
 
  const [error, seterror] = useState(false);
  const[comperror, setcomperror]= useState(false);




 useEffect(() => {
   
    const loadData = async () => {
      

        try {
          const user = await getAuthenticatedUsername(status,session);
          if (!user) return;
          const {username, role}= user;
          const result = await totalPremium(username);
          setpremium(formatNumberWithCommas(result));

          const result1 = await viewPolicyNumbers(username);
          setpremiumCount(result1.length);
          }
         catch (error: any) {
          
            console.error("Unexpected error:", error);
          
        }
      
    };

    loadData();
   
  }, [status,session]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}  > 
   <div className="flex min-h-screen bg-gray-100">
  <CollapsibleSidebar />
 
  <div className="flex flex-1 flex-col items-center justify-center py-8 px-2">
    <div className="relative w-full max-w-md flex flex-col items-center justify-center gap-6 md:block">
       <div className="p-4 relative md:absolute md:top-[-300px] ">
          <button
            onClick={() => seterror(true)}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Trigger Render Error
          </button>
          <button
            onClick={() => setcomperror(true)}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Trigger elements Error
          </button>
          {error && <BrokenContent />}
          {comperror && <InlinePolicyFallback />}
        </div>
     {/* Policy Count */}
   
<div className="relative md:absolute md:top-[-200px] md:left-1/2 md:transform md:-translate-x-1/2 text-center">
  <ErrorBoundary FallbackComponent={InlinePolicyFallback}>
  <div className="bg-white rounded-full shadow p-4 w-40 h-40 flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:shadow-xl">
    <h3 className="text-sm font-semibold text-gray-600">Policy Count</h3>
    <p className="text-lg font-bold text-blue-600">{premiumCount}</p>
  </div>
  </ErrorBoundary>
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
         
          <Link href="/add_policy" passHref>
          <button
            type="button" name="addpolicy"
            className="mt-2 text-white bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 shadow-lg rounded-full p-3"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          </Link>
        </div>
      </div>

      {/* Manage Policy */}
      <div className="relative md:absolute md:top-30 md:right-1/2 md:transform md:translate-x-1/2 md:-translate-y-1/2 text-center">
        <div className="bg-white rounded-full shadow p-4 w-40 h-40 flex flex-col justify-center items-center transition-all duration-300 hover:scale-110 hover:shadow-xl">
          <h3 className="text-sm font-semibold text-gray-600">Manage Policies</h3>
         <Link href="/manage_policies" passHref>
          <button
            type="button"  name="managepolicy"
            className="mt-2 text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 shadow-lg rounded-full p-3"
          >
            <FontAwesomeIcon icon={faSliders} />
          </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>
</ErrorBoundary>

  );
}