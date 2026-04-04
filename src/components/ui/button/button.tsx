import { ButtonProps } from "./button.types";
import { getButtonClasses } from "./button.styles";

export const Button = ({ variant = "primary", children, ...props }: ButtonProps) => {
  return (
    <button className={getButtonClasses(variant)} {...props}>
      {children}
    </button>
  );
};