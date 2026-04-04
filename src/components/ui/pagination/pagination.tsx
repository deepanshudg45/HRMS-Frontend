export const Pagination = ({ page, total, pageSize, onChange }: any) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex gap-2">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={page === i + 1 ? "font-bold underline" : ""}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};
