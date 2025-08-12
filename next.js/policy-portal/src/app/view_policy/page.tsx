'use client';

import CollapsibleSidebar from "@/components/sidebar";
import { useState, useEffect } from "react";
import SearchableDropdown from "@/components/dropdownSearch";
import { viewPolicyNumbers  } from "@/services/api";
import { policyDetails as fetchPolicyDetails} from "@/services/api";
import PolicyDetailsTabs from "./components/detailsTab";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {setPolicies,setSelectedPolicy, setPolicyDetails}from "@/redux/slices/policySlice";
import { getAuthenticatedUsername } from "@/utils/authenticate";
import { useSession } from "next-auth/react";


export default function ViewPolicy() {
  const [activeTab, setActiveTab] = useState('holder');
  // const [policies, setPolicies] = useState<string[]>([]);
  // const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  // const [policyDetails, setPolicyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
const dispatch = useAppDispatch();
const policies = useAppSelector((state)=>state.viewPolicy.policies);
const selectedPolicy = useAppSelector((state)=>state.viewPolicy.selectedPolicy);
const policyDetailsMap = useAppSelector((state)=>state.viewPolicy.policyDetails)
 
const policyDetails = selectedPolicy? policyDetailsMap[selectedPolicy]:null;
 
const { data: session, status } = useSession();

  useEffect(() => {
    const loadData = async () => {
      if(policies.length > 0){
        setLoading(false);
        return;
      }
      try {
        const username = await getAuthenticatedUsername(status,session);
        if (!username) return;
        const result = await viewPolicyNumbers(username);
        dispatch(setPolicies(result));
        
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dispatch, policies.length, status]);

console.log(policies);
console.log("selected polciy",selectedPolicy);



useEffect(() => {
  const loadPolicyDetails = async () => {
    
    if (!selectedPolicy) return;
    
    const cachedDetails = policyDetailsMap[selectedPolicy];
    if (cachedDetails && Object.keys(cachedDetails).length > 0) {
      return; }
    try {
      const result = await fetchPolicyDetails(selectedPolicy);
      dispatch(setPolicyDetails({policyNumber: selectedPolicy,
        details: result,
      }));
      console.log("Fetched policy details:", result);
    } catch (error) {
      console.error("Failed to fetch policy details:", error);
    
    }
  };

  loadPolicyDetails();
}, [dispatch,selectedPolicy]);

console.log("policy details",policyDetails);
console.log("policy details map:",policyDetailsMap);
  return (
    <div className=" min-h-screen bg-gray-100 p-6">
      {/* Sidebar */}
      <div className="w-32">
        <CollapsibleSidebar />
      </div>

      {/* Dropdown */}
    <div className="mt-8 ml-25 mr-auto sm:ml-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl bg-white p-4 rounded shadow">
  <h3 className="text-lg font-semibold mb-4 text-center">Select a Policy</h3>
  <SearchableDropdown policies={policies}  onSelect={(policyNumber) => dispatch(setSelectedPolicy(policyNumber))} />
</div>

      {/* Show Policy Details Tabs only when policy is selected */}
      {policyDetails && (
        <div className="mt-6 scroll-hidden">
          <PolicyDetailsTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            policyDetails={policyDetails}
          />
        </div>
      )}
    </div>
  );
}
