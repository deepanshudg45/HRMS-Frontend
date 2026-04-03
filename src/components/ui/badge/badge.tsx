export const Badge = ({ variant, children }: any) => {
  const colors: any = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return <span className={`${colors[variant]} text-white px-2 py-1`}>{children}</span>;
};