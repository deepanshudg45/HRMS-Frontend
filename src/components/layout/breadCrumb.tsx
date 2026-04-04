import { useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();

  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <div className="mb-4">
      {paths.map((p, i) => (
        <span key={i}>
          {p} {i < paths.length - 1 && " / "}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;