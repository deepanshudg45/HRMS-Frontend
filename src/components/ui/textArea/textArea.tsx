export const Textarea = ({ label, ...props }: any) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <textarea {...props} className="border p-2 w-full" />
    </div>
  );
};