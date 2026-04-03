export const Input = ({ label, error, ...props }: any) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input {...props} className="border p-2 w-full" />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};