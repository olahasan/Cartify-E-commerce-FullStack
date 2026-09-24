import React from "react";
import { NavLink } from "react-router-dom";
import type { TProducts } from "@products/productAPI";
import ProductCard from "@products/components/ProductCard";

import styles from "../Category.module.css";

const { productGrid, productCard } = styles;

interface ProductGridProps {
  products: TProducts[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className={productGrid}>
      {products.map((product) => (
        <NavLink
          key={product.productID}
          to={`/products/${product.productID}`}
          className={productCard}
        >
          <ProductCard
            productID={product.productID}
            name={product.productName}
            price={product.price}
            imageUrl={product.productImageUrl}
            rating={product.rating}
            totalReviews={product.totalReviews}
            description={product.description}
            quantity={product.quantity}
          />
        </NavLink>
      ))}
    </div>
  );
};

export default ProductGrid;
