import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Input, Modal, Select, Textarea } from "@/components/ui";
import { StandardResponse } from "@/types/api";
import { assignAsset, searchEmployees } from "../api/assetsApi";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  Asset,
  AssignAssetPayload,
  EmployeeOption,
} from "../types/assets.types";

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

const getEmployeeId = (employee: EmployeeOption) => {
  return employee.employeeId || employee.id || "";
};

const getEmployeeLabel = (employee: EmployeeOption) => {
  const employeeCode = employee.employeeCode || employee.employeeId || employee.id || "";
  const name = employee.name || employee.email || "Employee";

  return employeeCode ? `${name} (${employeeCode})` : name;
};

const AssetAssignmentModal = ({ asset, open, onClose }: AssetAssignmentModalProps) => {
  const queryClient = useQueryClient();
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOption | null>(null);
  const debouncedEmployeeSearch = useDebouncedValue(employeeSearch, 300);

  const { control, handleSubmit, register, reset, setValue } =
    useForm<AssignmentFormValues>({
      defaultValues: {
        employeeId: "",
        assignedOn: new Date(),
        conditionAtAssignment: "GOOD",
        notes: "",
      },
    });

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["employees", debouncedEmployeeSearch],
    queryFn: () => searchEmployees(debouncedEmployeeSearch),
    enabled: open && debouncedEmployeeSearch.length > 0,
  });

  const selectedEmployeeName = useMemo(() => {
    return selectedEmployee ? getEmployeeLabel(selectedEmployee) : "";
  }, [selectedEmployee]);

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
              employeeCode: selectedEmployee?.employeeCode || values.employeeId,
              name: selectedEmployee?.name || selectedEmployee?.email || values.employeeId,
              assignedOn: assignment?.assignedOn || values.assignedOn,
            },
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset-assignments", asset.id] });
      reset();
      setEmployeeSearch("");
      setSelectedEmployee(null);
      onClose();
    },
  });

  const handleEmployeeSelect = (employee: EmployeeOption) => {
    const employeeId = getEmployeeId(employee);

    setSelectedEmployee(employee);
    setEmployeeSearch(getEmployeeLabel(employee));
    setValue("employeeId", employeeId);
  };

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
              label="Search Employee"
              placeholder="Type employee name, code, or email"
              value={employeeSearch}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmployeeSearch(event.target.value);
                setSelectedEmployee(null);
                setValue("employeeId", "");
              }}
            />

            {employeeSearch && !selectedEmployee && (
              <div className="mt-2 rounded border bg-white">
                {isLoadingEmployees && (
                  <p className="p-3 text-sm text-gray-500">Searching employees...</p>
                )}

                {!isLoadingEmployees &&
                  employees.map((employee) => (
                    <button
                      key={getEmployeeId(employee)}
                      type="button"
                      className="block w-full border-b p-3 text-left hover:bg-gray-50"
                      onClick={() => handleEmployeeSelect(employee)}
                    >
                      {getEmployeeLabel(employee)}
                    </button>
                  ))}

                {!isLoadingEmployees && employees.length === 0 && (
                  <p className="p-3 text-sm text-gray-500">No employees found.</p>
                )}
              </div>
            )}

            {selectedEmployeeName && (
              <p className="mt-2 text-sm text-green-700">
                Selected: {selectedEmployeeName}
              </p>
            )}

            <input type="hidden" {...register("employeeId", { required: true })} />
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

          <Button type="submit" disabled={!selectedEmployee || assignAssetMutation.isPending}>
            {assignAssetMutation.isPending ? "Assigning..." : "Assign Asset"}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default AssetAssignmentModal;
