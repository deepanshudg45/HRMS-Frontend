import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui";
import { acknowledgeAssetAssignment, getMyAssets } from "../api/assetsApi";
import AcknowledgementStatusBadge from "../components/AcknowledgementStatusBadge";

const MyAssetsPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-assets"],
    queryFn: getMyAssets,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: acknowledgeAssetAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-assets"] });
    },
  });

  const handleAcknowledge = (assignmentId?: string) => {
    if (!assignmentId) return;

    const confirmed = window.confirm("Do you want to acknowledge this asset?");

    if (confirmed) {
      acknowledgeMutation.mutate(assignmentId);
    }
  };

  const myAssets = data ?? [];
  const canAcknowledgeAnyAsset = myAssets.some((asset) => Boolean(asset.assignmentId));

  if (isLoading) {
    return <p>Loading my assets...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Assets</h1>
        <p className="mt-2 text-base font-medium text-slate-700">
          View and acknowledge assets assigned to you.
        </p>
      </div>

      {!canAcknowledgeAnyAsset && myAssets.length > 0 && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          The current backend response for `/api/v1/assets/my` does not include `assignmentId`,
          so acknowledge actions stay disabled until that field is returned.
        </div>
      )}

      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Asset Code</th>
              <th className="p-3">Asset Type</th>
              <th className="p-3">Asset Name</th>
              <th className="p-3">Assigned On</th>
              <th className="p-3">Acknowledgement Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {myAssets.map((asset) => (
              <tr key={asset.assignmentId || asset.assetCode} className="border-t">
                <td className="p-3">{asset.assetCode}</td>
                <td className="p-3">{asset.assetType}</td>
                <td className="p-3">{asset.assetName}</td>
                <td className="p-3">{asset.assignedOn}</td>
                <td className="p-3">
                  <AcknowledgementStatusBadge status={asset.acknowledgementStatus} />
                </td>
                <td className="p-3">
                  <Button
                    disabled={
                      asset.acknowledgementStatus === "ACKNOWLEDGED" ||
                      !asset.assignmentId ||
                      acknowledgeMutation.isPending
                    }
                    onClick={() => handleAcknowledge(asset.assignmentId)}
                  >
                    Acknowledge
                  </Button>
                </td>
              </tr>
            ))}

            {myAssets.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No assigned assets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAssetsPage;
