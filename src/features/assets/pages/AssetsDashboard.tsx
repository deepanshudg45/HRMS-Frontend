import { useContext, useState } from "react";
import { Button, Input, Pagination, Select } from "@/components/ui";
import { AuthContext } from "@/context/authContext";
import AssetListTable from "../components/AssetListTable";
import AssetListTableSkeleton from "../components/AssetListTableSkeleton";
import CreateAssetForm from "../components/CreateAssetForm";
import CsvImportPanel from "../components/CsvImportPanel";
import { useAssets } from "../hooks/useAssets";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Available", value: "AVAILABLE" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "Under Repair", value: "UNDER_REPAIR" },
  { label: "Retired", value: "RETIRED" },
  { label: "Lost", value: "LOST" },
];

const typeOptions = [
  { label: "All Types", value: "" },
  { label: "Laptop", value: "LAPTOP" },
  { label: "Mobile", value: "MOBILE" },
  { label: "Desktop", value: "DESKTOP" },
  { label: "Furniture", value: "FURNITURE" },
  { label: "Other", value: "OTHER" },
];

const categoryOptions = [
  { label: "All Categories", value: "" },
  { label: "Laptop", value: "LAPTOP" },
  { label: "Mobile", value: "MOBILE" },
  { label: "Desktop", value: "DESKTOP" },
  { label: "Chair", value: "CHAIR" },
  { label: "Table", value: "TABLE" },
  { label: "Other", value: "OTHER" },
];

const limit = 10;

const AssetsDashboard = () => {
  const auth = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading } = useAssets({
    search: debouncedSearch,
    status,
    type,
    category,
    page,
    limit,
  });

  const assets = data?.data?.data ?? [];
  const total = data?.data?.meta?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Assets Dashboard</h1>
          <p className="text-sm text-gray-600">
            Search, filter, and view company assets.
          </p>
        </div>

        {auth?.role === "HR" ? (
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateForm((value) => !value)}>
              {showCreateForm ? "Hide Create Form" : "Create Asset"}
            </Button>
            <Button variant="secondary" onClick={() => setShowImportPanel((value) => !value)}>
              {showImportPanel ? "Hide Import" : "Import CSV"}
            </Button>
          </div>
        ) : (
          <Button disabled variant="secondary">
            Create Asset
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Input
          label="Search"
          placeholder="Search by code or name"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        />

        <Select
          label="Type"
          options={typeOptions}
          value={type}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setType(e.target.value);
            setPage(1);
          }}
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="space-y-4">
        {isLoading ? <AssetListTableSkeleton /> : <AssetListTable assets={assets} />}

        <Pagination page={page} total={total} pageSize={limit} onChange={setPage} />
      </div>

      {showCreateForm && <CreateAssetForm />}
      {showImportPanel && auth?.role === "HR" && <CsvImportPanel />}
    </div>
  );
};

export default AssetsDashboard;
