import { DayPicker } from "react-day-picker";

export const DatePicker = ({ value, onChange }: any) => {
  return <DayPicker mode="single" selected={value} onSelect={onChange} />;
};