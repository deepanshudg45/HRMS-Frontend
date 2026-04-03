export const Pagination = ({ page, total, pageSize, onChange }: any) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
  );
};