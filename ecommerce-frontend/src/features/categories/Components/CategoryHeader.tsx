import React from "react";
import styles from "../Category.module.css";

import { API_BASE_URL } from "@config/api";

interface CategoryHeaderProps {
  name: string;
  imageUrl: string;
}

const { categoryHeader } = styles;

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ name, imageUrl }) => {
  return (
    <header className={categoryHeader}>
      {imageUrl && <img src={`${API_BASE_URL}${imageUrl}`} alt={name} />}
    </header>
  );
};

export default CategoryHeader;
