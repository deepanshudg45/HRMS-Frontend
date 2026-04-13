import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Input, Modal, Select, Textarea } from "@/components/ui";
import { StandardResponse } from "@/types/api";
import { assignAsset } from "../api/assetsApi";
import { Asset, AssignAssetPayload } from "../types/assets.types";

interface AssetAssignmentModalProps {
  asset: Asset;
  open: boolean;
  onClose: () => void;
}

type AssignmentFormValues = {
  employeeId: string;
  assignedOn: Date;
  conditionAtAssignment: "GOOD" | "FAIR" | "POOR";
  notes: string;
};

const conditionOptions = [
  { label: "Good", value: "GOOD" },
  { label: "Fair", value: "FAIR" },
  { label: "Poor", value: "POOR" },
];

const AssetAssignmentModal = ({ asset, open, onClose }: AssetAssignmentModalProps) => {
  const queryClient = useQueryClient();

  const { control, handleSubmit, register, reset } = useForm<AssignmentFormValues>({
    defaultValues: {
      employeeId: "",
      assignedOn: new Date(),
      conditionAtAssignment: "GOOD",
      notes: "",
    },
  });

  const assignAssetMutation = useMutation({
    mutationFn: (values: AssignAssetPayload) => assignAsset(asset.id, values),
    onSuccess: (response, values) => {
      const assignment = response.data;

      queryClient.setQueryData<StandardResponse<Asset>>(["asset", asset.id], (oldData) => {
        if (!oldData?.data) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            status: "ASSIGNED",
            assignmentId: assignment?.id || oldData.data.assignmentId,
            currentAssignee: {
              employeeId: values.employeeId,
              assignedOn: assignment?.assignedOn || values.assignedOn,
            },
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset-assignments", asset.id] });
      reset();
      onClose();
    },
  });

  const onSubmit = (values: AssignmentFormValues) => {
    assignAssetMutation.mutate({
      employeeId: values.employeeId,
      assignedOn: values.assignedOn.toISOString(),
      conditionAtAssignment: values.conditionAtAssignment,
      notes: values.notes,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[min(640px,90vw)] rounded bg-white p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Assign Asset</h2>
            <p className="text-sm text-gray-600">{asset.assetName}</p>
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Employee ID"
              placeholder="Enter employee ID from the backend system"
              {...register("employeeId", { required: true })}
            />
            <p className="mt-2 text-sm text-gray-500">
              The current WITS backend accepts an `employeeId` header/body value, but it does
              not expose an employee search endpoint yet.
            </p>
          </div>

          <div>
            <label className="mb-2 block">Assigned On</label>
            <Controller
              control={control}
              name="assignedOn"
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <Select
            label="Condition At Assignment"
            options={conditionOptions}
            {...register("conditionAtAssignment")}
          />

          <Textarea label="Notes" {...register("notes")} />

          <Button type="submit" disabled={assignAssetMutation.isPending}>
            {assignAssetMutation.isPending ? "Assigning..." : "Assign Asset"}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default AssetAssignmentModal;
