import { Asset } from "../types/assets.types";
import AssetStatusBadge from "./AssetStatusBadge";

interface AssetListTableProps {
  assets: Asset[];
}

const AssetListTable = ({ assets }: AssetListTableProps) => {
  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Asset Code</th>
            <th className="p-3">Asset Type</th>
            <th className="p-3">Asset Name</th>
            <th className="p-3">Brand</th>
            <th className="p-3">Status</th>
            <th className="p-3">Location</th>
            <th className="p-3">Assigned To</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-t">
              <td className="p-3">{asset.asset_code}</td>
              <td className="p-3">{asset.asset_type}</td>
              <td className="p-3">{asset.asset_name}</td>
              <td className="p-3">{asset.brand}</td>
              <td className="p-3">
                <AssetStatusBadge status={asset.status} />
              </td>
              <td className="p-3">{asset.location}</td>
              <td className="p-3">{asset.assigned_to?.name || "-"}</td>
            </tr>
          ))}

          {assets.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                No assets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssetListTable;
