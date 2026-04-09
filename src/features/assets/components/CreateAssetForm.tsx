import { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { createAsset, getAssets } from "../api/assetsApi";
import {
  createAssetSchema,
  CreateAssetFormValues,
} from "../schema/createAssetSchema";
import { AuthContext } from "@/context/authContext";

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
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<CreateAssetFormValues>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      assetType: "",
      assetName: "",
      brand: "",
      model: "",
      assetCategory: "",
      serialNo: "",
      purchaseDate: "",
      purchaseCostINR: 0,
      vendor: "",
      warrantyExpiry: "",
      location: "",
      notes: "",
    },
  });

  const createAssetMutation = useMutation({
    mutationFn: createAsset,
    onSuccess: async (asset) => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["assets"] });

      if (asset.id) {
        navigate(`/app/assets/${asset.id}`);
        return;
      }

      const assetsResult = await queryClient.fetchQuery({
        queryKey: ["assets", 1, 1, "", "", "", asset.assetCode],
        queryFn: () => getAssets({ page: 1, limit: 1, search: asset.assetCode }),
      });

      const createdAssetId = assetsResult.data?.data[0]?.id;
      navigate(createdAssetId ? `/app/assets/${createdAssetId}` : "/app/assets");
    },
  });

  const onSubmit = (values: CreateAssetFormValues) => {
    createAssetMutation.mutate(values);
  };

  if (auth?.role !== "HR") {
    return null;
  }

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
        <Input label="Purchase Date" type="date" {...register("purchaseDate")} />
        <Input
          label="Purchase Cost INR"
          type="number"
          {...register("purchaseCostINR", { valueAsNumber: true })}
        />
        <Input label="Vendor" {...register("vendor")} />
        <Input label="Warranty Expiry" type="date" {...register("warrantyExpiry")} />
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
