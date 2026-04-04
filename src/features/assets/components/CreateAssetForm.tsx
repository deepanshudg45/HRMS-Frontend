import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button, DatePicker, Input, Select, Textarea } from "@/components/ui";
import { createAsset } from "../api/assetsApi";
import {
  createAssetSchema,
  CreateAssetFormValues,
} from "../schema/createAssetSchema";

const assetTypeOptions = [
  { label: "Select Type", value: "" },
  { label: "Laptop", value: "LAPTOP" },
  { label: "Monitor", value: "MONITOR" },
  { label: "Phone", value: "PHONE" },
];

const assetCategoryOptions = [
  { label: "Select Category", value: "" },
  { label: "IT", value: "IT" },
  { label: "Office", value: "OFFICE" },
  { label: "Accessories", value: "ACCESSORIES" },
];

const CreateAssetForm = () => {
  const { register, control, handleSubmit, reset } = useForm<CreateAssetFormValues>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      asset_type: "",
      asset_name: "",
      brand: "",
      model: "",
      category: "",
      serial_no: "",
      purchase_date: new Date(),
      purchase_cost_inr: 0,
      vendor: "",
      warranty_expiry: new Date(),
      location: "",
      notes: "",
    },
  });

  const createAssetMutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (values: CreateAssetFormValues) => {
    createAssetMutation.mutate({
      ...values,
      purchase_date: values.purchase_date.toISOString(),
      warranty_expiry: values.warranty_expiry.toISOString(),
    });
  };

  return (
    <div className="rounded border bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">Create Asset</h2>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Select label="Asset Type" options={assetTypeOptions} {...register("asset_type")} />
        <Input label="Asset Name" {...register("asset_name")} />
        <Input label="Brand" {...register("brand")} />
        <Input label="Model" {...register("model")} />
        <Select
          label="Asset Category"
          options={assetCategoryOptions}
          {...register("category")}
        />
        <Input label="Serial No" {...register("serial_no")} />
        <div>
          <label className="mb-2 block">Purchase Date</label>
          <Controller
            control={control}
            name="purchase_date"
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <Input
          label="Purchase Cost INR"
          type="number"
          {...register("purchase_cost_inr", { valueAsNumber: true })}
        />
        <Input label="Vendor" {...register("vendor")} />
        <div>
          <label className="mb-2 block">Warranty Expiry</label>
          <Controller
            control={control}
            name="warranty_expiry"
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
