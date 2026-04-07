import { Badge } from "@/components/ui";

interface AcknowledgementStatusBadgeProps {
  status: string;
}

const AcknowledgementStatusBadge = ({ status }: AcknowledgementStatusBadgeProps) => {
  const variant = status === "ACKNOWLEDGED" ? "success" : "warning";

  return <Badge variant={variant}>{status}</Badge>;
};

export default AcknowledgementStatusBadge;
