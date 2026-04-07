import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui";
import { AuthContext } from "@/context/authContext";
import { getAsset } from "../api/assetsApi";
import AssetStatusBadge from "../components/AssetStatusBadge";
import AssetAssignmentModal from "../components/AssetAssignmentModal";
import AssetAssignmentHistory from "../components/AssetAssignmentHistory";
import AssetReturnModal from "../components/AssetReturnModal";
import EditAssetForm from "../components/EditAssetForm";

const AssetDetailPage = () => {
  const { id = "" } = useParams();
  const auth = useContext(AuthContext);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAsset(id),
    enabled: Boolean(id),
  });

  const asset = data?.data;

  if (isLoading) {
    return <p>Loading asset...</p>;
  }

  if (!asset) {
    return <p>Asset not found.</p>;
  }

  const detailFields = [
    { label: "Asset Code", value: asset.assetCode },
    { label: "Asset Name", value: asset.assetName },
    { label: "Asset Type", value: asset.assetType },
    { label: "Asset Category", value: asset.assetCategory },
    { label: "Serial No", value: asset.serialNo },
    { label: "Brand", value: asset.brand },
    { label: "Model", value: asset.model },
    { label: "Purchase Date", value: asset.purchaseDate },
    { label: "Purchase Cost INR", value: String(asset.purchaseCostINR) },
    { label: "Vendor", value: asset.vendor },
    { label: "Warranty Expiry", value: asset.warrantyExpiry },
    { label: "Location", value: asset.location },
    { label: "Notes", value: asset.notes || "-" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{asset.assetName}</h1>
          <p className="text-sm text-gray-600">{asset.assetCode}</p>
        </div>

        <div className="flex items-center gap-3">
          <AssetStatusBadge status={asset.status} />
          {auth?.role === "HR" && (
            <>
              <Button variant="secondary" onClick={() => setShowEditForm((value) => !value)}>
                {showEditForm ? "Hide Edit" : "Edit"}
              </Button>
              <Button onClick={() => setIsAssignmentModalOpen(true)}>Assign</Button>
              {asset.status === "ASSIGNED" && (
                <Button variant="secondary" onClick={() => setIsReturnModalOpen(true)}>
                  Return
                </Button>
              )}
              <Button>Change Status</Button>
            </>
          )}
        </div>
      </div>

      {auth?.role === "HR" && (
        <AssetAssignmentModal
          asset={asset}
          open={isAssignmentModalOpen}
          onClose={() => setIsAssignmentModalOpen(false)}
        />
      )}

      {auth?.role === "HR" && (
        <AssetReturnModal
          asset={asset}
          open={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
        />
      )}

      {showEditForm && auth?.role === "HR" && (
        <EditAssetForm asset={asset} onUpdated={() => refetch()} />
      )}

      <div className="flex gap-2 border-b">
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === "details" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === "history" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Assignment History
        </button>
      </div>

      {activeTab === "details" && (
        <>
          <div className="grid gap-4 rounded border bg-white p-6 md:grid-cols-2">
            {detailFields.map((field) => (
              <div key={field.label}>
                <p className="text-sm text-gray-500">{field.label}</p>
                <p className="font-medium">{field.value}</p>
              </div>
            ))}
          </div>

          {asset.status === "ASSIGNED" && asset.currentAssignee && (
            <div className="rounded border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Current Assignee</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{asset.currentAssignee.name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee Code</p>
                  <p className="font-medium">
                    {asset.currentAssignee.employeeCode || asset.currentAssignee.employeeId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned On</p>
                  <p className="font-medium">{asset.currentAssignee.assignedOn || "-"}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "history" && (
        <AssetAssignmentHistory assetId={asset.id} />
      )}
    </div>
  );
};

export default AssetDetailPage;
