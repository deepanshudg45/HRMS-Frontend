export const Select = ({ label, options = [], ...props }: any) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <select {...props}>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};