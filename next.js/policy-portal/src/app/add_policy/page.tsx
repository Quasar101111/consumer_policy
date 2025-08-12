'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ToastContainer, toast } from 'react-toastify';
import CollapsibleSidebar from '@/components/sidebar';
import 'react-toastify/dist/ReactToastify.css';
import { findPolicy ,addPolicy} from '@/services/api';
import { getAuthenticatedUsername } from '@/utils/authenticate';

import {formatNumberWithCommas} from '@/utils/formatNumber'; 
import {formatDate} from '@/utils/formatDate'; 
import { useSession } from 'next-auth/react';

type PolicyResponse = {
  vehicle: {
    registrationNumber: string;
    dateOfPurchase: string;
    exShowroomPrice: number;
  };
  policy: {
    policyEffectiveDate: string;
    policyExpirationDate: string;
    totalPremium: number;
  };
};

export default function AddPolicyPage() {
  const router = useRouter();

  const [policyData, setPolicyData] = useState({
    policyNumber: '',
    chassisNumber: '',
  });

  const [result, setResult] = useState<PolicyResponse | null >(null);
    const { data: session ,status:sessionStatus } = useSession(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPolicyData({ ...policyData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    

    if (!policyData.policyNumber || !policyData.chassisNumber) {
      toast.warning('Please fill in all required fields.');
      return;
    }

  

    try {
      const data:PolicyResponse = await findPolicy(policyData);
      setResult(data);
    } catch (error: any) {
      
      toast.error(error.message || 'Failed to find policy.');
     
    }


  };

 const add_policy = async () => {
  const username = await getAuthenticatedUsername(sessionStatus,session,);
        if (!username) return;
  console.log(username);
 

  try {
    const data = await addPolicy(policyData.policyNumber, username);
   
    toast.success("Policy added successfully!");
    
  } catch (error: any) {
    toast.error(error.message || "Failed to add policy.");
  }
};


  return (<>
    <ToastContainer />
    <div className="min-h-screen bg-gray-100 p-6">
    
      <CollapsibleSidebar />


      <div className="mt-10 ml-15 mr-auto sm:ml-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white p-6 sm:p-6 rounded shadow">

        <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">Find Policy</h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative z-0 w-full group">
            <input
              type="text"
              name="policyNumber"
              id="policyNumber"
              value={policyData.policyNumber}
              onChange={handleChange}
              placeholder=" "
              
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent 
              border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0
               focus:border-blue-600 peer"
            />
            <label
              htmlFor="policyNumber"
              className="absolute text-sm text-gray-500 duration-300 transform scale-75 -translate-y-4 top-2.5 left-2.5 z-10 origin-[0] 
      peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 
      peer-focus:-translate-y-4  peer-focus:text-blue-600"        >
              Policy Number
            </label>
          </div>
        <br></br>
          <div className="relative z-0 w-full group">
            <input
              type="text"
              name="chassisNumber"
              id="chassisNumber"
              value={policyData.chassisNumber}
              onChange={handleChange}
              placeholder=" "
              
               className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent 
              border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0
               focus:border-blue-600 peer"
            />
            <label
              htmlFor="chassisNumber"
              className="absolute text-sm text-gray-500 duration-300 transform scale-75 -translate-y-4 top-2.5 left-2.5 z-10 origin-[0] 
      peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 
      peer-focus:-translate-y-4  peer-focus:text-blue-600"        >
              Chassis Number
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Submit
          </button>
        </form>

        {result && result.vehicle && result.policy && (
          <div className="mt-6 p-4 border border-green-300 bg-green-50 rounded">
            <h3 data-testid="policy-found"  className="font-semibold text-green-700 mb-2">Policy Found:</h3>
           
             <pre className="text-sm whitespace-pre-wrap text-gray-800"><strong>Registration No:</strong> {result.vehicle.registrationNumber}</pre>
            <pre className="text-sm whitespace-pre-wrap text-gray-800"><strong>Date of Purchase:</strong> {formatDate(result.vehicle.dateOfPurchase)}</pre>
            <pre className="text-sm whitespace-pre-wrap text-gray-800"><strong>Ex-Showroom Price:</strong> ₹ {formatNumberWithCommas(result.vehicle.exShowroomPrice)}</pre>
            <pre className="text-sm whitespace-pre-wrap text-gray-800"><strong>Policy Start:</strong> {formatDate(result.policy.policyEffectiveDate)}</pre>
            <pre className="text-sm whitespace-pre-wrap text-gray-800"><strong>Policy End:</strong> {formatDate(result.policy.policyExpirationDate)}</pre>
            <pre className="text-sm whitespace-pre-wrap text-gray-800"><strong>Total Premium:</strong> ₹{formatNumberWithCommas(result.policy.totalPremium)}</pre>
  
            <button
              onClick={add_policy}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Add this policy
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
