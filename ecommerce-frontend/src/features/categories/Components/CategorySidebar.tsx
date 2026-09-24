import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { getCategorySidebar } from "@products/productSlice";
import { ChevronRight, ChevronDown } from "lucide-react";
import "./CategorySidebar.css";
import { useNavigate } from "react-router-dom";
import CategorySidebarSkeleton from "@categories/Skeleton/CategorySidebarSkeleton";

interface ICategorySidebar {
  categoryID: number;
  categoryName: string;
  categorySlug: string;
  hierarchy: string;
  level: number;
  showInHome: boolean;
  showInForAll: boolean;
  parentCategoryID: number | null;
  categoryImageUrl: string | null;
  productCount?: number;
  homepageImageUrl: string | null;
  carouselImageUrl: string | null;
  carouselAltText: string | null;
}

interface ICategoryNode extends ICategorySidebar {
  children: ICategoryNode[];
  isOpen?: boolean;
}

interface FiltersState {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
}

interface CategorySidebarProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  defaultFilters: FiltersState;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  filters,
  onFiltersChange,
  defaultFilters,
}) => {
  const dispatch = useAppDispatch();
  const { CategorySidebar, loading, error } = useAppSelector(
    (state) => state.product,
  );
  const [categoryTree, setCategoryTree] = useState<ICategoryNode[]>([]);

  const navigate = useNavigate();
  const currentSlug = location.pathname
    .replace("/categories/", "")
    .replace(/^\//, "");
  const decodedCurrentSlug = decodeURIComponent(currentSlug);

  useEffect(() => {
    dispatch(getCategorySidebar());
  }, [dispatch]);

  useEffect(() => {
    if (CategorySidebar.length > 0) {
      const tree = buildCategoryTree(CategorySidebar);
      setCategoryTree(tree);
    }
  }, [CategorySidebar, decodedCurrentSlug]);

  const buildCategoryTree = (
    categories: ICategorySidebar[],
  ): ICategoryNode[] => {
    const map: Record<number, ICategoryNode> = {};
    const roots: ICategoryNode[] = [];

    categories.forEach((cat) => {
      const isOpen = decodedCurrentSlug.startsWith(cat.hierarchy);

      map[cat.categoryID] = {
        ...cat,
        children: [],
        isOpen: isOpen,
      };
    });
    categories.forEach((cat) => {
      if (cat.parentCategoryID && map[cat.parentCategoryID]) {
        map[cat.parentCategoryID].children.push(map[cat.categoryID]);
      } else {
        roots.push(map[cat.categoryID]);
      }
    });

    return roots;
  };

  const toggleCategory = (categoryId: number) => {
    const updateNodeState = (nodes: ICategoryNode[]): ICategoryNode[] => {
      return nodes.map((node) => {
        if (node.categoryID === categoryId) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateNodeState(node.children) };
        }
        return node;
      });
    };

    setCategoryTree(updateNodeState(categoryTree));
  };

  const handleCategorySelect = (node: ICategoryNode) => {
    navigate(
      `/categories/${encodeURIComponent(node.hierarchy)}?type=SIDEBAR_CLICK`,
    );
  };

  const clearAllFilters = () => {
    onFiltersChange(defaultFilters);
    navigate("/categories");
  };

  const renderCategoryTree = (nodes: ICategoryNode[], level = 0) => (
    <ul className={`category-list level-${level}`} role="tree">
      {nodes.map((node) => (
        <li
          key={node.categoryID}
          className="category-item"
          role="treeitem"
          aria-expanded={node.isOpen}
        >
          <div className="category-content">
            {node.children.length > 0 ? (
              <button
                className="toggle-btn"
                onClick={() => toggleCategory(node.categoryID)}
                aria-label={node.isOpen ? "Collapse" : "Expand"}
              >
                {node.isOpen ? (
                  <ChevronDown size={14} className="toggle-icon" />
                ) : (
                  <ChevronRight size={14} className="toggle-icon" />
                )}
              </button>
            ) : (
              <span className="toggle-placeholder"></span>
            )}
            <label className="category-label">
              <input
                type="checkbox"
                checked={decodedCurrentSlug.includes(node.hierarchy)}
                onChange={() => handleCategorySelect(node)}
                className="category-checkbox"
              />
              <span className="category-name">{node.categoryName}</span>
              {node.productCount !== undefined && (
                <span className="category-count">({node.productCount})</span>
              )}
            </label>
          </div>
          {node.children.length > 0 && node.isOpen && (
            <div className="category-children">
              {renderCategoryTree(node.children, level + 1)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  if (loading === "pending" && CategorySidebar.length === 0)
    return <CategorySidebarSkeleton />;

  if (error != null)
    return <div className="category-sidebar-error">Error: {error}</div>;
  if (CategorySidebar.length <= 0) return <CategorySidebarSkeleton />;

  return (
    <div className="category-sidebar">
      <div className="sidebar-header">
        <h3>Filters</h3>
        <button className="clear-filters-btn" onClick={clearAllFilters}>
          Clear All
        </button>
      </div>
      <div className="filter-section">
        <h4 className="filter-title">Categories</h4>
        <div className="filter-content">{renderCategoryTree(categoryTree)}</div>
      </div>

      <div className="filter-section">
        <h4 className="filter-title">Price Range</h4>
        <div className="filter-content">
          <div className="price-range">
            <input
              type="range"
              min="0"
              max="10000"
              value={filters.maxPrice}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  maxPrice: parseInt(e.target.value),
                })
              }
              className="price-slider"
            />

            <div className="price-inputs">
              <div className="price-input-group">
                <label>Min</label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={filters.minPrice}
                  // value={3}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      minPrice: parseInt(e.target.value) || 0,
                    })
                  }
                  className="price-input"
                />
              </div>
              <div className="price-input-group">
                <label>Max</label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      maxPrice: parseInt(e.target.value) || 10000,
                    })
                  }
                  className="price-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4 className="filter-title">Customer Ratings</h4>
        <div className="filter-content">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="rating-option">
              <input
                type="checkbox"
                checked={filters.minRating === rating}
                onChange={() =>
                  onFiltersChange({
                    ...filters,
                    minRating: filters.minRating === rating ? 0 : rating,
                  })
                }
                className="rating-checkbox"
              />
              <span className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < rating ? "star filled" : "star"}>
                    ★
                  </span>
                ))}
              </span>
              <span className="rating-text">&amp; Up</span>
            </label>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h4 className="filter-title">Availability</h4>
        <div className="filter-content">
          <label className="availability-option">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              className="availability-checkbox"
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  inStockOnly: e.target.checked,
                })
              }
            />
            <span className="availability-text">In Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
