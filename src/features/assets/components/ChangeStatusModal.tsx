import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Select } from "@/components/ui";
import { StandardResponse } from "@/types/api";
import { updateAssetStatus } from "../api/assetsApi";
import { Asset, UpdateAssetStatusPayload } from "../types/assets.types";
import { useState } from "react";

interface ChangeStatusModalProps {
  asset: Asset;
  open: boolean;
  onClose: () => void;
}

const statusOptions = [
  { label: "Retired", value: "RETIRED" },
  { label: "Lost", value: "LOST" },
];

const ChangeStatusModal = ({ asset, open, onClose }: ChangeStatusModalProps) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<UpdateAssetStatusPayload["status"]>("RETIRED");

  const updateStatusMutation = useMutation({
    mutationFn: () => updateAssetStatus(asset.id, { status }),
    onSuccess: (response) => {
      queryClient.setQueryData<StandardResponse<Asset>>(["asset", asset.id], (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            status: response.status,
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset-reports"] });
      onClose();
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[min(460px,90vw)] rounded bg-white p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Change Asset Status</h2>
            <p className="text-sm text-gray-600">{asset.assetName}</p>
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        {asset.status === "ASSIGNED" && (
          <p className="mb-4 rounded bg-amber-100 p-3 text-sm text-amber-800">
            This asset is currently ASSIGNED — unassign before retiring
          </p>
        )}

        <div className="space-y-4">
          <Select
            label="Target Status"
            options={statusOptions}
            value={status}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setStatus(event.target.value as UpdateAssetStatusPayload["status"])
            }
          />

          <Button
            onClick={() => updateStatusMutation.mutate()}
            disabled={updateStatusMutation.isPending || asset.status === "ASSIGNED"}
          >
            {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeStatusModal;
