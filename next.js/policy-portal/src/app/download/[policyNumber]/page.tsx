'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pdf, Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { policyDetails as fetchPolicy } from "@/services/api";
import { useAppSelector } from "@/redux/hooks";
import { formatNumberWithCommas } from "@/utils/formatNumber";
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#FAFAFA",
  },
  section: {
    marginBottom: 18,
    border: "1 solid #ddd",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#2A4D9B",
    borderBottom: "1 solid #ddd",
    paddingBottom: 4,
  },
  subTitle: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#333333",
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 3,
    borderBottom: "0.5 solid #eee",
    paddingVertical: 2,
  },
  fieldLabel: {
    width: "40%",
    fontWeight: "bold",
    color: "#555555",
  },
  fieldValue: {
    width: "60%",
    color: "#222222",
  },
  highlightValue: {
    color: "#E53935",
    fontWeight: "bold",
  },
});

const renderFields = (
  fields: Record<string, any>,
  
) => (
  <>
    {Object.entries(fields).map(([label, value], i) => (
      <View key={i} style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text
        
        >
          {String(value ?? "—")}
        </Text>
      </View>
    ))}
  </>
);

export const PolicyPdf = ({ policy }: { policy: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Policy Holder Details */}
      {policy?.policyholder && (
        <View style={styles.section}>
          <Text style={styles.title}>Policy Holder Details</Text>

          <Text style={styles.subTitle}>Personal Information</Text>
          {renderFields({
            "First Name": policy.policyholder.firstName,
            "Last Name": policy.policyholder.lastName,
            "Mobile No": policy.policyholder.mobileNo,
            "Email": policy.policyholder.email,
          })}

          <Text style={styles.subTitle}>Address</Text>
          {renderFields({
            "Address Line 1": policy.policyholder.addressLine1,
            "Address Line 2": policy.policyholder.addressLine2,
            "City": policy.policyholder.city,
            "State": policy.policyholder.state,
            "Pincode": policy.policyholder.pincode,
          })}

          <Text style={styles.subTitle}>Identity Details</Text>
          {renderFields({
            "Aadhar Number": policy.policyholder.Aadhar,
            "License Number": policy.policyholder.licenseNumber,
            "PAN Number": policy.policyholder.panNumber,
          })}

          <Text style={styles.subTitle}>Bank Details</Text>
          {renderFields({
            "Account Number": policy.policyholder.accountNumber,
            "IFSC Code": policy.policyholder.ifscCode,
            "Bank Name": policy.policyholder.bankName,
            "Bank Address": policy.policyholder.bankAddress,
          })}
        </View>
      )}

      {/* Policy Details */}
      {policy?.policyDetails && (
        <View style={styles.section}>
          <Text style={styles.title}>Policy Details</Text>
          {renderFields(
            {
              "Policy Number": policy.policyDetails.policyNumber,
              "Effective Date": policy.policyDetails.policyEffectiveDt,
              "Expiration Date": policy.policyDetails.policyExpirationDt,
              "Term": `${policy.policyDetails.term} year(s)`,
              "Status": policy.policyDetails.status,
              "Total Premium": `Rs.  ${formatNumberWithCommas( policy.policyDetails.totalPremium)}`,
              "Payment Plan": policy.policyDetails.payPlan,
            }
          )}
        </View>
      )}

      {/* Coverage Details */}
      {policy?.coverageDetails?.description && (
        <View style={styles.section}>
          <Text style={styles.title}>Coverage Details</Text>
          <Text>{policy.coverageDetails.description}</Text>
        </View>
      )}

      {/* Vehicle Details */}
      {policy?.vehicleDetails && (
        <View style={styles.section}>
          <Text style={styles.title}>Vehicle Details</Text>

          <Text style={styles.subTitle}>Vehicle & Policy Info</Text>
          {renderFields({
            "Policy Number": policy.vehicleDetails.policyNumber,
            "Vehicle Type": policy.vehicleDetails.vehicleType,
            "Registration Number": policy.vehicleDetails.registrationNumber,
            "Date of Purchase": policy.vehicleDetails.dateOfPurchase,
            "RTO Name": policy.vehicleDetails.rtoName,
            "City": policy.vehicleDetails.city,
            "State": policy.vehicleDetails.state,
          })}

          <Text style={styles.subTitle}>Vehicle Specifications</Text>
          {renderFields({
            "Brand": policy.vehicleDetails.brand,
            "Model Name": policy.vehicleDetails.modelName,
            "Variant": policy.vehicleDetails.variant,
            "Body Type": policy.vehicleDetails.bodyType,
            "Fuel Type": policy.vehicleDetails.fuelType,
            "Transmission Type": policy.vehicleDetails.transmissionType,
            "Color": policy.vehicleDetails.color,
          })}

          <Text style={styles.subTitle}>Technical Details</Text>
          {renderFields({
            "Chasis Number": policy.vehicleDetails.chasisNumber,
            "Engine Number": policy.vehicleDetails.engineNumber,
            "Cubic Capacity": policy.vehicleDetails.cubicCapacity,
            "Seating Capacity": policy.vehicleDetails.seatingCapacity,
            "Year of Manufacture": policy.vehicleDetails.yearOfManufacture,
          })}

          <Text style={styles.subTitle}>Valuation</Text>
          {renderFields(
            {
              "IDV": `Rs. ${formatNumberWithCommas(policy.vehicleDetails.idv)}`,
              "Ex-Showroom Price": `Rs. ${formatNumberWithCommas(policy.vehicleDetails.exShowroomPrice)}`,
            }
          )}
        </View>
      )}
    </Page>
  </Document>
);

export default function DownloadPage() {
  const params = useParams();
  const policyNumber = String(params?.policyNumber);
  const policyMap = useAppSelector((state) => state.viewPolicy.policyDetails);
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!policyNumber) return;

    const loadPolicy = async () => {
      let result: any = policyMap[policyNumber] || null;
      if (!result) {
        try {
          result = await fetchPolicy(policyNumber);
        } catch (err) {
          console.error("Error fetching policy:", err);
          setLoading(false);
          return;
        }
      }
      setPolicy(result);

      try {
        const blob = await pdf(<PolicyPdf policy={result} />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        
      } catch (err) {
        console.error("Error generating PDF:", err);
        <p>error downloading</p>
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, [policyNumber, policyMap]);

  if (loading) return <p>Generating your policy PDF...</p>;
  if (!policy) return <p>No policy found.</p>;

  return (
    <div style={{ height: "100vh" }}>
      {pdfUrl && (
        <PDFViewer style={{ width: "100%", height: "100%" }}>
          <PolicyPdf policy={policy} />
        </PDFViewer>
      )}
    </div>
  );
}
