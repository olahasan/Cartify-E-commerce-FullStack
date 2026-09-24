import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../Category.module.css";
const { breadcrumb, separator } = styles;

interface BreadcrumbProps {
  hierarchy: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ hierarchy }) => {
  if (!hierarchy) return null;

  const parts = hierarchy.split(" / ");
  const breadcrumbItems = parts.map((part, index) => {
    const path = parts.slice(0, index + 1).join(" / ");
    const isLast = index === parts.length - 1;
    return { part, path, isLast };
  });

  return (
    <nav aria-label="breadcrumb">
      <ol className={breadcrumb}>
        <li className="breadcrumb-item">
          <NavLink to="/">Home</NavLink>
        </li>
        {breadcrumbItems.map(({ part, path, isLast }) => (
          <React.Fragment key={path}>
            <li className={separator}>/</li>
            {isLast ? (
              <li className="breadcrumb-item active" aria-current="page">
                {part}
              </li>
            ) : (
              <li className="breadcrumb-item">
                <NavLink
                  to={`/categories/${encodeURIComponent(path)}?type=AUTO`}
                >
                  {part}
                </NavLink>
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
