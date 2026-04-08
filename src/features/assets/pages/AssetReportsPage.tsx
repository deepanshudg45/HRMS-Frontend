import { useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input, Select } from "@/components/ui";
import { AuthContext } from "@/context/authContext";
import { getAssetReports } from "../api/assetsApi";
import AssetStatusBadge from "../components/AssetStatusBadge";
import { AssetReport } from "../types/assets.types";

const typeOptions = [
  { label: "All Types", value: "" },
  { label: "Laptop", value: "LAPTOP" },
  { label: "Mobile", value: "MOBILE" },
  { label: "Desktop", value: "DESKTOP" },
  { label: "Furniture", value: "FURNITURE" },
  { label: "Other", value: "OTHER" },
];

const categoryOptions = [
  { label: "All Categories", value: "" },
  { label: "Laptop", value: "LAPTOP" },
  { label: "Mobile", value: "MOBILE" },
  { label: "Desktop", value: "DESKTOP" },
  { label: "Chair", value: "CHAIR" },
  { label: "Table", value: "TABLE" },
  { label: "Other", value: "OTHER" },
];

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Available", value: "AVAILABLE" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "Under Repair", value: "UNDER_REPAIR" },
  { label: "Retired", value: "RETIRED" },
  { label: "Lost", value: "LOST" },
];

const isInsideDateRange = (asset: AssetReport, startDate: string, endDate: string) => {
  if (!startDate && !endDate) return true;
  const createdAt = new Date(asset.createdAt).getTime();
  const start = startDate ? new Date(startDate).getTime() : Number.NEGATIVE_INFINITY;
  const end = endDate ? new Date(endDate).getTime() : Number.POSITIVE_INFINITY;
  return createdAt >= start && createdAt <= end;
};

const getDaysRemaining = (warrantyExpiry?: string) => {
  if (!warrantyExpiry) return null;

  const today = new Date();
  const expiry = new Date(warrantyExpiry);
  const diffMs = expiry.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const AssetReportsPage = () => {
  const auth = useContext(AuthContext);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["asset-reports", type, category, status],
    queryFn: () => getAssetReports({ type, category, status }),
    enabled: auth?.role === "HR",
  });

  const filteredReports = useMemo(() => {
    return reports.filter((asset) => isInsideDateRange(asset, startDate, endDate));
  }, [reports, startDate, endDate]);

  const summary = useMemo(() => {
    return {
      total: filteredReports.length,
      available: filteredReports.filter((asset) => asset.status === "AVAILABLE").length,
      assigned: filteredReports.filter((asset) => asset.status === "ASSIGNED").length,
      underRepair: filteredReports.filter((asset) => asset.status === "UNDER_REPAIR").length,
      retired: filteredReports.filter((asset) => asset.status === "RETIRED").length,
    };
  }, [filteredReports]);

  const expiringWarrantyAssets = filteredReports.filter((asset) => {
    const daysRemaining = getDaysRemaining(asset.warrantyExpiry);
    return daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 30;
  });

  if (auth?.role !== "HR") {
    return <p>You do not have permission to view asset reports.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Asset Reports</h1>
        <p className="text-sm text-gray-600">Review asset status and warranty risk.</p>
      </div>

      <div className="grid gap-4 rounded border bg-white p-4 md:grid-cols-5">
        <Select
          label="Type"
          options={typeOptions}
          value={type}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setType(event.target.value)}
        />
        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setCategory(event.target.value)
          }
        />
        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setStatus(event.target.value)
          }
        />
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setStartDate(event.target.value)
          }
        />
        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setEndDate(event.target.value)
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded border bg-white p-4">Total: {summary.total}</div>
        <div className="rounded border bg-white p-4">Available: {summary.available}</div>
        <div className="rounded border bg-white p-4">Assigned: {summary.assigned}</div>
        <div className="rounded border bg-white p-4">Under Repair: {summary.underRepair}</div>
        <div className="rounded border bg-white p-4">Retired: {summary.retired}</div>
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-4 text-xl font-semibold">Warranty Expiring Within 30 Days</h2>
        {expiringWarrantyAssets.length === 0 ? (
          <p className="text-sm text-gray-500">
            No warranty expiry data available or no assets expiring soon.
          </p>
        ) : (
          <div className="space-y-2">
            {expiringWarrantyAssets.map((asset) => {
              const daysRemaining = getDaysRemaining(asset.warrantyExpiry);
              return (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded bg-amber-100 p-3 text-amber-900"
                >
                  <span>
                    {asset.assetCode} — {asset.assetName}
                  </span>
                  <span className="rounded bg-amber-500 px-2 py-1 text-sm text-white">
                    {daysRemaining} days left
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Asset Code</th>
              <th className="p-3">Asset Type</th>
              <th className="p-3">Asset Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Serial No</th>
              <th className="p-3">Location</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">
                  Loading reports...
                </td>
              </tr>
            )}

            {!isLoading &&
              filteredReports.map((asset) => (
                <tr key={asset.id} className="border-t">
                  <td className="p-3">{asset.assetCode}</td>
                  <td className="p-3">{asset.assetType}</td>
                  <td className="p-3">{asset.assetName}</td>
                  <td className="p-3">{asset.category}</td>
                  <td className="p-3">
                    <AssetStatusBadge status={asset.status} />
                  </td>
                  <td className="p-3">{asset.serialNo || "-"}</td>
                  <td className="p-3">{asset.location || "-"}</td>
                  <td className="p-3">{asset.vendor || "-"}</td>
                  <td className="p-3">{asset.createdAt}</td>
                </tr>
              ))}

            {!isLoading && filteredReports.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">
                  No report data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetReportsPage;
