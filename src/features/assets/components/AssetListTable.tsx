import { AssetSummary } from "../types/assets.types";
import AssetStatusBadge from "./AssetStatusBadge";

interface AssetListTableProps {
  assets: AssetSummary[];
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
            <th className="p-3">Serial No</th>
            <th className="p-3">Status</th>
            <th className="p-3">Category</th>
            <th className="p-3">Assigned To</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-t">
              <td className="p-3">{asset.code}</td>
              <td className="p-3">{asset.type}</td>
              <td className="p-3">{asset.name}</td>
              <td className="p-3">{asset.serialNo || "-"}</td>
              <td className="p-3">
                <AssetStatusBadge status={asset.status} />
              </td>
              <td className="p-3">{asset.category}</td>
              <td className="p-3">-</td>
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
