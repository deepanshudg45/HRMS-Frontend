import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Input, Modal, Select } from "@/components/ui";
import { StandardResponse } from "@/types/api";
import {
  createMaintenanceRecord,
  getAssetMaintenanceRecords,
  updateMaintenanceRecord,
} from "../api/assetsApi";
import {
  Asset,
  CreateMaintenancePayload,
  MaintenanceRecord,
  UpdateMaintenancePayload,
} from "../types/assets.types";

interface MaintenancePageProps {
  asset: Asset;
}

type MaintenanceFormValues = {
  maintenanceType: string;
  description: string;
  sentForRepairAt: Date;
  vendor: string;
};

const maintenanceTypeOptions = [
  { label: "Repair", value: "REPAIR" },
  { label: "Service", value: "SERVICE" },
  { label: "Inspection", value: "INSPECTION" },
  { label: "Disposal", value: "DISPOSAL" },
];

const getAssetStatusFromMaintenance = (status: "COMPLETED" | "SCRAPPED") => {
  return status === "COMPLETED" ? "AVAILABLE" : "RETIRED";
};

const MaintenancePage = ({ asset }: MaintenancePageProps) => {
  const queryClient = useQueryClient();
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    record: MaintenanceRecord;
    status: "COMPLETED" | "SCRAPPED";
  } | null>(null);

  const { register, control, handleSubmit, reset } = useForm<MaintenanceFormValues>({
    defaultValues: {
      maintenanceType: "REPAIR",
      description: "",
      sentForRepairAt: new Date(),
      vendor: "",
    },
  });

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["asset-maintenance", asset.id],
    queryFn: () => getAssetMaintenanceRecords(asset.id),
  });

  const createMaintenanceMutation = useMutation({
    mutationFn: (values: CreateMaintenancePayload) =>
      createMaintenanceRecord(asset.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-maintenance", asset.id] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.setQueryData<StandardResponse<Asset>>(["asset", asset.id], (oldData) => {
        if (!oldData?.data) return oldData;
        return { ...oldData, data: { ...oldData.data, status: "UNDER_REPAIR" } };
      });
      reset();
    },
  });

  const updateMaintenanceMutation = useMutation({
    mutationFn: ({
      record,
      status,
    }: {
      record: MaintenanceRecord;
      status: "COMPLETED" | "SCRAPPED";
    }) => {
      const payload: UpdateMaintenancePayload = {
        status,
        returnedFromRepairAt: new Date().toISOString(),
        repairCostINR: record.repairCostINR || 0,
        vendor: record.vendor,
        notes: record.notes,
      };

      return updateMaintenanceRecord(asset.id, record.id, payload);
    },
    onSuccess: (record) => {
      queryClient.invalidateQueries({ queryKey: ["asset-maintenance", asset.id] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.setQueryData<StandardResponse<Asset>>(["asset", asset.id], (oldData) => {
        if (!oldData?.data) return oldData;
        return { ...oldData, data: { ...oldData.data, status: getAssetStatusFromMaintenance(record.maintStatus as "COMPLETED" | "SCRAPPED") } };
      });
    },
  });

  const onSubmit = (values: MaintenanceFormValues) => {
    createMaintenanceMutation.mutate({
      maintenanceType: values.maintenanceType,
      description: values.description,
      sentForRepairAt: values.sentForRepairAt.toISOString(),
      vendor: values.vendor,
    });
  };

  const handleStatusUpdate = (
    record: MaintenanceRecord,
    status: "COMPLETED" | "SCRAPPED"
  ) => {
    setPendingStatusUpdate({ record, status });
  };

  return (
    <div className="space-y-6">
      <div className="rounded border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Add Maintenance Log</h2>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Select
            label="Maintenance Type"
            options={maintenanceTypeOptions}
            {...register("maintenanceType")}
          />
          <Input label="Vendor" {...register("vendor")} />
          <Input label="Description" {...register("description", { required: true })} />
          <div>
            <label className="mb-2 block">Sent For Repair At</label>
            <Controller
              control={control}
              name="sentForRepairAt"
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={createMaintenanceMutation.isPending}>
              {createMaintenanceMutation.isPending ? "Saving..." : "Add Maintenance"}
            </Button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Type</th>
              <th className="p-3">Description</th>
              <th className="p-3">Sent For Repair</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Loading maintenance logs...
                </td>
              </tr>
            )}

            {!isLoading &&
              records.map((record) => (
                <tr key={record.id} className="border-t">
                  <td className="p-3">{record.maintenanceType}</td>
                  <td className="p-3">{record.description}</td>
                  <td className="p-3">{record.sentForRepairAt || "-"}</td>
                  <td className="p-3">{record.vendor || "-"}</td>
                  <td className="p-3">{record.maintStatus}</td>
                  <td className="p-3">{record.createdAt}</td>
                  <td className="p-3">
                    {record.maintStatus === "IN_PROGRESS" ? (
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => handleStatusUpdate(record, "COMPLETED")}
                          disabled={updateMaintenanceMutation.isPending}
                        >
                          Complete
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleStatusUpdate(record, "SCRAPPED")}
                          disabled={updateMaintenanceMutation.isPending}
                        >
                          Scrap
                        </Button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}

            {!isLoading && records.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No maintenance logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={Boolean(pendingStatusUpdate)} onClose={() => setPendingStatusUpdate(null)}>
        <div className="w-[min(420px,90vw)] rounded bg-white p-6">
          <h2 className="text-xl font-semibold">Confirm Status Update</h2>
          <p className="mt-3 text-sm text-gray-600">
            Mark this maintenance as {pendingStatusUpdate?.status}?
          </p>
          <div className="mt-6 flex gap-2">
            <Button
              onClick={() => {
                if (!pendingStatusUpdate) return;
                updateMaintenanceMutation.mutate(pendingStatusUpdate);
                setPendingStatusUpdate(null);
              }}
            >
              Confirm
            </Button>
            <Button variant="secondary" onClick={() => setPendingStatusUpdate(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MaintenancePage;
