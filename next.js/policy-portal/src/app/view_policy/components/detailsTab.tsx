import React from 'react';
import DetailCard from "@/components/cards";
import { formatNumberWithCommas } from '@/utils/formatNumber';
import { formatDate } from '@/utils/formatDate';
import '@/styles/scroll.css';


type PolicyDetailsTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  policyDetails: any;
};

type DetailCardProps = {
  title: string;
  fields: Record<string, string | number | null | undefined>;
};

export default function PolicyDetailsTabs({
  activeTab,
  setActiveTab,
  policyDetails,
}: PolicyDetailsTabsProps) {
  return (
  <div className=" overflow-auto no-scrollbar mt-2 ml-25 mr-auto sm:ml-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl bg-white p-6 rounded shadow">
 {/* Tabs */}
      <ul className="flex flex-wrap justify-center text-sm font-medium text-gray-500 border-b pb-2">
        <li className="me-2">
          <button
            onClick={() => setActiveTab('holder')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'holder'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            Policy Holder Details
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'policy'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            Policy Details
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'desc'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            Description
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab('vehicle')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'vehicle'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            Vehicle Details
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="border-t pt-4">
        {activeTab === 'holder' && policyDetails?.policyholder && (
          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DetailCard
              title="Personal Information"
              fields={{
                'First Name': policyDetails.policyholder.firstName,
                'Last Name': policyDetails.policyholder.lastName,
                'Mobile No': policyDetails.policyholder.mobileNo,
                'Email': policyDetails.policyholder.email,
              }}
            />
            <DetailCard
              title="Address"
              fields={{
                'Address Line 1': policyDetails.policyholder.addressLine1,
                'Address Line 2': policyDetails.policyholder.addressLine2,
                'City': policyDetails.policyholder.city,
                'State': policyDetails.policyholder.state,
                'Pincode': policyDetails.policyholder.pincode,
              }}
            />
            <DetailCard
              title="Identity Details"
              fields={{
                'Aadhar Number': policyDetails.policyholder.Aadhar,
                'License Number': policyDetails.policyholder.licenseNumber,
                'PAN Number': policyDetails.policyholder.panNumber,
              }}
            />
            <DetailCard
              title="Bank Details"
              fields={{
                'Account Number': policyDetails.policyholder.accountNumber,
                'IFSC Code': policyDetails.policyholder.ifscCode,
                'Bank Name': policyDetails.policyholder.bankName,
                'Bank Address':policyDetails.policyholder.bankAddress ,
              }}
            />
          </div>
        )}

        {activeTab === 'policy' && policyDetails?.policyDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DetailCard
              title="Policy Information"
              fields={{
                'Policy Number': policyDetails.policyDetails.policyNumber,
                'Effective Date': formatDate(policyDetails.policyDetails.policyEffectiveDt),
                'Expiration Date': formatDate(policyDetails.policyDetails.policyExpirationDt),
                'Term': `${policyDetails.policyDetails.term} year(s)`,
              }}
            />
            <DetailCard
              title="Policy Status"
              fields={{
                'Status': policyDetails.policyDetails.status,
                'Total Premium': `₹${formatNumberWithCommas(policyDetails.policyDetails.totalPremium)}`,
                'Payment Plan': policyDetails.policyDetails.payPlan,
              }}
            />
          </div>
        )}

        {activeTab === 'desc' && policyDetails?.coverageDetails?.description && (
          <div className="bg-gray-100 rounded-lg shadow-md p-6 border border-gray-200">
            <h4 className="text-lg font-semibold mb-4">Coverage Details</h4>
            <ul className="list-disc list-inside space-y-1">
              {policyDetails.coverageDetails.description
               }
            </ul>
          </div>
        )}

        {activeTab === 'vehicle' && policyDetails?.vehicleDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DetailCard
              title="Vehicle & Policy Info"
              fields={{
                'Policy Number': policyDetails.vehicleDetails.policyNumber,
                'Vehicle Type': policyDetails.vehicleDetails.vehicleType,
                'Registration Number': policyDetails.vehicleDetails.registrationNumber,
                'Date of Purchase': formatDate(policyDetails.vehicleDetails.dateOfPurchase),
                'RTO Name': policyDetails.vehicleDetails.rtoName,
                'City': policyDetails.vehicleDetails.city,
                'State': policyDetails.vehicleDetails.state,
              }}
            />
            <DetailCard
              title="Vehicle Specifications"
              fields={{
                'Brand': policyDetails.vehicleDetails.brand,
                'Model Name': policyDetails.vehicleDetails.modelName,
                'Variant': policyDetails.vehicleDetails.variant,
                'Body Type': policyDetails.vehicleDetails.bodyType,
                'Fuel Type': policyDetails.vehicleDetails.fuelType,
                'Transmission Type': policyDetails.vehicleDetails.transmissionType,
                'Color': policyDetails.vehicleDetails.color,
              }}
            />
            <DetailCard
              title="Technical Details"
              fields={{
                'Chasis Number': policyDetails.vehicleDetails.chasisNumber,
                'Engine Number': policyDetails.vehicleDetails.engineNumber,
                'Cubic Capacity': policyDetails.vehicleDetails.cubicCapacity,
                'Seating Capacity': policyDetails.vehicleDetails.seatingCapacity,
                'Year of Manufacture': formatDate(policyDetails.vehicleDetails.yearOfManufacture),
              }}
            />
            <DetailCard
              title="Valuation"
              fields={{
                'IDV': `₹${formatNumberWithCommas(policyDetails.vehicleDetails.idv)}`,
                'Ex-Showroom Price': `₹${formatNumberWithCommas(policyDetails.vehicleDetails.exShowroomPrice)}`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}


