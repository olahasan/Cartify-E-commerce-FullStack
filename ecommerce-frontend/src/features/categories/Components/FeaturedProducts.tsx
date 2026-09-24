import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../Category.module.css";
import ProductCard from "@products/components/ProductCard";
import type { TRandomProduct } from "@products/productAPI";

const { featuredProducts, featuredProductsList, featuredProductsItem } = styles;

interface FeaturedProductsProps {
  products: TRandomProduct[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  return (
    <aside className={featuredProducts}>
      <h2>Featured Products</h2>
      <div className={featuredProductsList}>
        {products.map((product) => (
          <NavLink
            key={product.productID}
            to={`/products/${product.productID}`}
            className={featuredProductsItem}
          >
            <ProductCard
              productID={product.productID}
              name={product.productName}
              price={product.price}
              imageUrl={product.imageUrl}
              rating={product.rating}
              totalReviews={product.totalReviews}
              description={product.description}
            />
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default FeaturedProducts;
