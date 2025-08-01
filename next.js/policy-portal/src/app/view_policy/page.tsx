'use client';

import CollapsibleSidebar from "@/components/sidebar";
import { useState, useEffect } from "react";
import SearchableDropdown from "@/components/dropdownSearch";
import { viewPolicyNumbers  } from "@/services/api";
import { policyDetails as fetchPolicyDetails} from "@/services/api";
import PolicyDetailsTabs from "./components/detailsTab";
import mockPolicyData from "./components/mockPolicyData"; // <-- Import mock data

export default function ViewPolicy() {
  const [activeTab, setActiveTab] = useState('holder');
  const [policies, setPolicies] = useState<string[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [policyDetails, setPolicyDetails] = useState(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const loadData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) return;
        const result = await viewPolicyNumbers(username);
        setPolicies(result);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);



useEffect(() => {
  const loadPolicyDetails = async () => {
    if (!selectedPolicy) return;
    
        
    try {
      const result = await fetchPolicyDetails(selectedPolicy);
      setPolicyDetails(result);
    } catch (error) {
      console.error("Failed to fetch policy details:", error);
      setPolicyDetails(null);
    }
  };

  loadPolicyDetails();
}, [selectedPolicy]);

console.log(policyDetails);
  return (
    <div className=" min-h-screen bg-gray-100 p-6">
      {/* Sidebar */}
      <div className="w-32">
        <CollapsibleSidebar />
      </div>

      {/* Dropdown */}
    <div className="mt-8 ml-25 mr-auto sm:ml-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl bg-white p-4 rounded shadow">
  <h3 className="text-lg font-semibold mb-4 text-center">Select a Policy</h3>
  <SearchableDropdown policies={policies} onSelect={setSelectedPolicy} />
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
