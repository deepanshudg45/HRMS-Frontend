export const Badge = ({ variant, children, className = "" }: any) => {
  const colors: any = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    primary: "bg-blue-600",
    secondary: "bg-gray-500",
    danger: "bg-red-600",
  };

  return (
    <span className={`${colors[variant]} text-white px-2 py-1 rounded ${className}`}>
      {children}
    </span>
  );
};
