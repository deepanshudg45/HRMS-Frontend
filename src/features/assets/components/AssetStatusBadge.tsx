import { Badge } from "@/components/ui";

interface AssetStatusBadgeProps {
  status: string;
}

const getStatusVariant = (status: string) => {
  if (status === "AVAILABLE") return "success";
  if (status === "ASSIGNED") return "primary";
  if (status === "UNDER_REPAIR") return "warning";
  if (status === "RETIRED") return "secondary";
  return "danger";
};

const getStatusClasses = (status: string) => {
  if (status === "AVAILABLE") return "bg-green-600";
  if (status === "ASSIGNED") return "bg-blue-600";
  if (status === "UNDER_REPAIR") return "bg-amber-500";
  if (status === "RETIRED") return "bg-gray-500";
  return "bg-red-600";
};

const AssetStatusBadge = ({ status }: AssetStatusBadgeProps) => {
  return (
    <Badge variant={getStatusVariant(status)} className={getStatusClasses(status)}>
      {status}
    </Badge>
  );
};

export default AssetStatusBadge;
