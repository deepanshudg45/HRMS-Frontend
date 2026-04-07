import { useQuery } from "@tanstack/react-query";
import { getAssetAssignmentHistory } from "../api/assetsApi";

interface AssetAssignmentHistoryProps {
  assetId: string;
}

const AssetAssignmentHistory = ({ assetId }: AssetAssignmentHistoryProps) => {
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["asset-assignments", assetId],
    queryFn: () => getAssetAssignmentHistory(assetId),
  });

  if (isLoading) {
    return <p>Loading assignment history...</p>;
  }

  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Employee Name</th>
            <th className="p-3">Assigned On</th>
            <th className="p-3">Condition At Assignment</th>
            <th className="p-3">Returned On</th>
            <th className="p-3">Condition At Return</th>
            <th className="p-3">Return Reason</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id} className="border-t">
              <td className="p-3">{assignment.employeeName || assignment.employeeId}</td>
              <td className="p-3">{assignment.assignedOn || "-"}</td>
              <td className="p-3">{assignment.conditionAtAssignment || "-"}</td>
              <td className="p-3">{assignment.returnedOn || "-"}</td>
              <td className="p-3">{assignment.conditionAtReturn || "-"}</td>
              <td className="p-3">{assignment.returnReason || "-"}</td>
            </tr>
          ))}

          {assignments.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No assignment history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssetAssignmentHistory;
