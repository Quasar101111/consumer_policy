import React from "react";

export type DetailCardProps = {
  title: string;
  fields: Record<string, string | number | null | undefined>;
  className?: string;
};

const DetailCard: React.FC<DetailCardProps> = ({ title, fields, className }) => (
  <div className={`bg-gray-100 rounded-lg shadow-md p-6 border border-gray-200 ${className || ""}`}>
    <h5 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h5>
    <dl className="space-y-3 text-gray-700">
      {Object.entries(fields).map(([label, value]) => (
        <div key={label} className="flex justify-between">
          <dt className="font-medium">{label}</dt>
          <dd>
            {value !== undefined && value !== null && value !== ""
              ? value
              : <span className="text-gray-400">N/A</span>}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

export default DetailCard;