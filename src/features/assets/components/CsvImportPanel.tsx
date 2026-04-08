import { useState } from "react";
import Papa from "papaparse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal } from "@/components/ui";
import { importAssets } from "../api/assetsApi";
import { ImportResult } from "../types/assets.types";

type CsvRow = Record<string, string>;

const CsvImportPanel = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<CsvRow[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const importMutation = useMutation({
    mutationFn: importAssets,
    onSuccess: (result) => {
      setImportResult(result);
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  const parseFile = (nextFile: File) => {
    if (!nextFile.name.toLowerCase().endsWith(".csv")) {
      alert("Please upload a CSV file.");
      return;
    }

    setFile(nextFile);
    Papa.parse<CsvRow>(nextFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setPreviewRows(result.data.slice(0, 5));
      },
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) parseFile(droppedFile);
  };

  const columns = previewRows[0] ? Object.keys(previewRows[0]) : [];

  return (
    <div className="space-y-4 rounded border bg-white p-6">
      <h2 className="text-xl font-semibold">CSV Import</h2>

      <div
        className="rounded border-2 border-dashed border-gray-300 p-8 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <p className="mb-3 text-sm text-gray-600">Drag and drop a CSV file here</p>
        <input
          type="file"
          accept=".csv"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) parseFile(selectedFile);
          }}
        />
        {file && <p className="mt-3 text-sm text-green-700">Selected: {file.name}</p>}
      </div>

      {previewRows.length > 0 && (
        <div className="overflow-x-auto rounded border">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                {columns.map((column) => (
                  <th key={column} className="p-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, index) => (
                <tr key={index} className="border-t">
                  {columns.map((column) => (
                    <td key={column} className="p-3">
                      {row[column] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Button
        disabled={!file || importMutation.isPending}
        onClick={() => file && importMutation.mutate(file)}
      >
        {importMutation.isPending ? "Importing..." : "Confirm Import"}
      </Button>

      <Modal open={Boolean(importResult)} onClose={() => setImportResult(null)}>
        <div className="w-[min(720px,90vw)] rounded bg-white p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold">Import Result</h2>
            <Button variant="ghost" onClick={() => setImportResult(null)}>
              Close
            </Button>
          </div>

          {importResult && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded bg-green-100 p-4 text-green-800">
                  Imported: {importResult.imported}
                </div>
                <div className="rounded bg-amber-100 p-4 text-amber-800">
                  Skipped: {importResult.skipped}
                </div>
              </div>

              <div className="overflow-x-auto rounded border">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3">Row</th>
                      <th className="p-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importResult.errors.map((error) => (
                      <tr key={`${error.row}-${error.reason}`} className="border-t">
                        <td className="p-3">{error.row}</td>
                        <td className="p-3">{error.reason}</td>
                      </tr>
                    ))}
                    {importResult.errors.length === 0 && (
                      <tr>
                        <td colSpan={2} className="p-4 text-center text-gray-500">
                          No import errors.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CsvImportPanel;
