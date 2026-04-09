export const Input = ({ label, error, ...props }: any) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">{label}</label>
      )}
      <input
        {...props}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
