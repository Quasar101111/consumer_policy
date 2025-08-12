'use client';

import CollapsibleSidebar from "@/components/sidebar";
import { useState, useEffect } from "react";
import SearchableDropdown from "@/components/dropdownSearch";
import mockPolicyData from "../components/mockPolicyData";
import PolicyDetailsTabs from "../components/detailsTab";
import { viewPolicyNumbers } from "@/services/api";

export default function ViewPolicy() {
  const [policies, setPolicies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [policyDetails, setPolicyDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("holder");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
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
    if (selectedPolicy) {
      const found = mockPolicyData.find(
        (p) => String(p.policyDetails.policyNumber) === String(selectedPolicy)
      );
      setPolicyDetails(found || null);
    } else {
      setPolicyDetails(null);
    }
  }, [selectedPolicy]);

  const handleSelect = (policyNumber: string) => {
    setSelectedPolicy(policyNumber);
    setActiveTab("holder");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-32">
        <CollapsibleSidebar />
      </div>
      <div className="mt-8 ml-25 mr-auto sm:ml-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-center">Select a Policy</h3>
        <SearchableDropdown policies={policies} onSelect={handleSelect} />
        {selectedPolicy && (
          <div className="mt-8">
            {policyDetails ? (
              <PolicyDetailsTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                policyDetails={policyDetails}
              />
            ) : (
              <div className="text-center text-gray-500 mt-10">
                No policy details found for policy number: <span className="font-mono">{selectedPolicy}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}