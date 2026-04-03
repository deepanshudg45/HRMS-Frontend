import { useEffect } from "react";

export const Modal = ({ open, onClose, children }: any) => {
  useEffect(() => {
    const handleEsc = (e: any) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4">{children}</div>
    </div>
  );
};