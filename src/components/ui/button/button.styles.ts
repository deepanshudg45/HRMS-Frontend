export const getButtonClasses = (variant: string) => {
  const base = "px-4 py-2 rounded";

  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-200",
    danger: "bg-red-600 text-white",
    ghost: "bg-transparent",
  };

  return `${base} ${variants[variant]}`;
};