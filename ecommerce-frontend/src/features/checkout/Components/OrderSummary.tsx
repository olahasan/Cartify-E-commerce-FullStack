const {
  sectionTitle,
  line,
  card,
  orderItem,
  itemImg,
  itemInfo,
  itemName,
  itemDetail,
  itemPrice,
  summaryRowsContainer,
  summaryRow,
  discountVal,
  DiscountBox,
  val,
  TotalStyle,
  SummeryErrorMessage,
  btnCheckout,
  btnShine,
  secureBadge,
} = styles;
import { API_BASE_URL } from "@config/api";
import styles from "../checkout.module.css";
import { formatCurrency } from "@shared/utils/formatCurrency";
import { Spinner } from "react-bootstrap";
import { useAppSelector } from "@app/hooks";

interface OrderSummaryProps {
  isSubmitting: boolean;
  error: string | null;
  total: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  finalTotal: number;
}

const OrderSummary = ({
  isSubmitting,
  error,
  total,
  shipping,
  tax,
  grandTotal,
  finalTotal,
}: OrderSummaryProps) => {
  const { productsFullInfo } = useAppSelector((state) => state.cart);
  const { promoRes } = useAppSelector((state) => state.promo);

  return (
    <>
      <div className={card}>
        <div className={sectionTitle}>
          Order Summary <span className={line}></span>
        </div>

        {productsFullInfo.map((product) => (
          <div className={orderItem} key={product.productID}>
            <div className={itemImg}>
              {product.imageUrl ? (
                <img
                  className={itemImg}
                  src={`${API_BASE_URL}${product.imageUrl}`}
                  alt={product.altText}
                />
              ) : (
                <img src="/fallback.jpg" alt="fallback" />
              )}
            </div>

            <div className={itemInfo}>
              <div className={itemName}>{product.productName}</div>
              <div className={itemDetail}>
                Price: {formatCurrency(product.price)} × {product.quantity}
              </div>
            </div>
            <div className={itemPrice}>{formatCurrency(product.subtotal)}</div>
          </div>
        ))}

        <div className={summaryRowsContainer}>
          <div className={summaryRow}>
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className={summaryRow}>
            <span>Shipping</span>
            <span>{formatCurrency(shipping)}</span>
          </div>
          <div className={summaryRow}>
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className={summaryRow}>
            <span>Total Before Discount</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>

          {promoRes?.isValid && (
            <div className={summaryRow}>
              <span>Discount</span>
              <span className={discountVal}>
                - {formatCurrency(promoRes?.discountAmount)}
              </span>
            </div>
          )}
          <hr className={DiscountBox}></hr>
          <div className={summaryRow}>
            <span>Total</span>
            <span className={val}>
              {!promoRes?.isValid ? (
                formatCurrency(grandTotal)
              ) : (
                <>
                  <del>{formatCurrency(grandTotal)}</del>
                  <div className={TotalStyle}>{formatCurrency(finalTotal)}</div>
                </>
              )}
            </span>
          </div>
        </div>

        {/* ✅ Error Message */}
        {error && (
          <div className={SummeryErrorMessage}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className={btnCheckout} disabled={isSubmitting}>
          <span className={btnShine}></span>
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm"></Spinner>
              loading...
            </>
          ) : (
            "Complete Payment"
          )}
        </button>
        <div className={secureBadge}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Secure payment protected by 256-bit SSL encryption.
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
