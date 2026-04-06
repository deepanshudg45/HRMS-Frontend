const AssetListTableSkeleton = () => {
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
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-t">
              {Array.from({ length: 7 }).map((__, cellIndex) => (
                <td key={cellIndex} className="p-3">
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetListTableSkeleton;
