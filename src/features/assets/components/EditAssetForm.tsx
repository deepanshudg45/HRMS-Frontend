import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button, DatePicker, Input, Select, Textarea } from "@/components/ui";
import { updateAsset } from "../api/assetsApi";
import { Asset } from "../types/assets.types";
import {
  createAssetSchema,
  CreateAssetFormValues,
} from "../schema/createAssetSchema";

interface EditAssetFormProps {
  asset: Asset;
  onUpdated: () => void;
}

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

const toDate = (value: string) => {
  return value ? new Date(value) : new Date();
};

const EditAssetForm = ({ asset, onUpdated }: EditAssetFormProps) => {
  const isRetired = asset.status === "RETIRED";

  const { register, control, handleSubmit } = useForm<CreateAssetFormValues>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      assetType: asset.assetType,
      assetName: asset.assetName,
      brand: asset.brand,
      model: asset.model,
      assetCategory: asset.assetCategory,
      serialNo: asset.serialNo,
      purchaseDate: toDate(asset.purchaseDate),
      purchaseCostINR: asset.purchaseCostINR,
      vendor: asset.vendor,
      warrantyExpiry: toDate(asset.warrantyExpiry),
      location: asset.location,
      notes: asset.notes,
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: (values: CreateAssetFormValues) =>
      updateAsset(asset.id, {
        ...values,
        purchaseDate: values.purchaseDate.toISOString(),
        warrantyExpiry: values.warrantyExpiry.toISOString(),
      }),
    onSuccess: () => {
      toast.success("Asset updated successfully");
      onUpdated();
    },
  });

  const onSubmit = (values: CreateAssetFormValues) => {
    updateAssetMutation.mutate(values);
  };

  return (
    <div className="rounded border bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">Edit Asset</h2>

      {isRetired && (
        <p className="mb-4 rounded bg-gray-100 p-3 text-sm text-gray-600">
          This asset is retired, so editing is disabled.
        </p>
      )}

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isRetired || updateAssetMutation.isPending} className="contents">
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
        </fieldset>

        <div className="md:col-span-2">
          <Button type="submit" disabled={isRetired || updateAssetMutation.isPending}>
            {updateAssetMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditAssetForm;
