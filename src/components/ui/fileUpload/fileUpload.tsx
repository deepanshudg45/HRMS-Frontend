export const FileUpload = ({ onUpload, maxSize = 2 }: any) => {
  const handleFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert("File too large");
      return;
    }
    onUpload(file);
  };

  return (
    <input
      type="file"
      onChange={(e) => handleFile(e.target.files![0])}
    />
  );
};