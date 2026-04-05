import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Input, Select, Textarea } from "@/components/ui";
import { createAsset } from "../api/assetsApi";
import {
  createAssetSchema,
  CreateAssetFormValues,
} from "../schema/createAssetSchema";

const assetTypeOptions = [
  { label: "Select Type", value: "" },
  { label: "Laptop", value: "LAPTOP" },
  { label: "Mobile", value: "MOBILE" },
  { label: "Desktop", value: "DESKTOP" },
  { label: "Furniture", value: "FURNITURE" },
  { label: "Other", value: "OTHER" },
];

const assetCategoryOptions = [
  { label: "Select Category", value: "" },
  { label: "Laptop", value: "LAPTOP" },
  { label: "Mobile", value: "MOBILE" },
  { label: "Desktop", value: "DESKTOP" },
  { label: "Chair", value: "CHAIR" },
  { label: "Table", value: "TABLE" },
  { label: "Other", value: "OTHER" },
];

const CreateAssetForm = () => {
  const queryClient = useQueryClient();
  const { register, control, handleSubmit, reset } = useForm<CreateAssetFormValues>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      assetType: "",
      assetName: "",
      brand: "",
      model: "",
      assetCategory: "",
      serialNo: "",
      purchaseDate: new Date(),
      purchaseCostINR: 0,
      vendor: "",
      warrantyExpiry: new Date(),
      location: "",
      notes: "",
    },
  });

  const createAssetMutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  const onSubmit = (values: CreateAssetFormValues) => {
    createAssetMutation.mutate({
      ...values,
      purchaseDate: values.purchaseDate.toISOString(),
      warrantyExpiry: values.warrantyExpiry.toISOString(),
    });
  };

  return (
    <div className="rounded border bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">Create Asset</h2>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Select label="Asset Type" options={assetTypeOptions} {...register("assetType")} />
        <Input label="Asset Name" {...register("assetName")} />
        <Input label="Brand" {...register("brand")} />
        <Input label="Model" {...register("model")} />
        <Select
          label="Asset Category"
          options={assetCategoryOptions}
          {...register("assetCategory")}
        />
        <Input label="Serial No" {...register("serialNo")} />
        <div>
          <label className="mb-2 block">Purchase Date</label>
          <Controller
            control={control}
            name="purchaseDate"
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <Input
          label="Purchase Cost INR"
          type="number"
          {...register("purchaseCostINR", { valueAsNumber: true })}
        />
        <Input label="Vendor" {...register("vendor")} />
        <div>
          <label className="mb-2 block">Warranty Expiry</label>
          <Controller
            control={control}
            name="warrantyExpiry"
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <Input label="Location" {...register("location")} />
        <div className="md:col-span-2">
          <Textarea label="Notes" {...register("notes")} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">
            {createAssetMutation.isPending ? "Saving..." : "Create Asset"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssetForm;
