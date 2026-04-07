import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Modal, Select, Textarea } from "@/components/ui";
import { StandardResponse } from "@/types/api";
import { returnAsset } from "../api/assetsApi";
import { Asset, ReturnAssetPayload } from "../types/assets.types";

interface AssetReturnModalProps {
  asset: Asset;
  open: boolean;
  onClose: () => void;
}

type ReturnFormValues = {
  returnedOn: Date;
  conditionAtReturn: "GOOD" | "DAMAGED" | "LOST";
  returnReason: string;
};

const conditionOptions = [
  { label: "Good", value: "GOOD" },
  { label: "Damaged", value: "DAMAGED" },
  { label: "Lost", value: "LOST" },
];

const getNextAssetStatus = (condition: ReturnFormValues["conditionAtReturn"]) => {
  if (condition === "GOOD") return "AVAILABLE";
  if (condition === "DAMAGED") return "UNDER_REPAIR";
  return "LOST";
};

const AssetReturnModal = ({ asset, open, onClose }: AssetReturnModalProps) => {
  const queryClient = useQueryClient();

  const { control, handleSubmit, register, reset } = useForm<ReturnFormValues>({
    defaultValues: {
      returnedOn: new Date(),
      conditionAtReturn: "GOOD",
      returnReason: "",
    },
  });

  const returnAssetMutation = useMutation({
    mutationFn: (values: ReturnAssetPayload) => returnAsset(asset.id, values),
    onSuccess: (response, values) => {
      const nextStatus = response.assetStatus || getNextAssetStatus(values.conditionAtReturn);

      queryClient.setQueryData<StandardResponse<Asset>>(["asset", asset.id], (oldData) => {
        if (!oldData?.data) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            status: nextStatus,
            currentAssignee: undefined,
            assignmentId: undefined,
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset-assignments", asset.id] });
      reset();
      onClose();
    },
  });

  const onSubmit = (values: ReturnFormValues) => {
    returnAssetMutation.mutate({
      returnedOn: values.returnedOn.toISOString(),
      conditionAtReturn: values.conditionAtReturn,
      returnReason: values.returnReason,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[min(560px,90vw)] rounded bg-white p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Return Asset</h2>
            <p className="text-sm text-gray-600">{asset.assetName}</p>
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2 block">Returned On</label>
            <Controller
              control={control}
              name="returnedOn"
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <Select
            label="Condition At Return"
            options={conditionOptions}
            {...register("conditionAtReturn")}
          />

          <Textarea
            label="Return Reason"
            required
            {...register("returnReason", { required: true })}
          />

          <Button type="submit" disabled={returnAssetMutation.isPending}>
            {returnAssetMutation.isPending ? "Returning..." : "Return Asset"}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default AssetReturnModal;
