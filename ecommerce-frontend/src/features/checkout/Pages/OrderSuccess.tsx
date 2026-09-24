import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../checkout.module.css";
import { formatCurrency } from "@shared/utils/formatCurrency";
import BackToTop from "@shared/BackToTop/BackToTop";
const {
  OrderSuccessContainer,
  HeaderContainer,
  logo,
  successPharse,
  thanksPara,
  cardStyle,
  sectionTitle,
  rowStyle,
  labelStyle,
  DiscountStyle,
  TotalStyle,
  grandTotalStyle,
  valStyle,
  badgeStyle,
  itemStyle,
  productNameStyle,
  QuantityStyle,
  PriceStyle,
  SubtotalContainer,
  addrLine,
  contactLine,
  btns,
  btnStyle,
  btnPrimaryStyle,
} = styles;

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderSuccessState {
  orderNumber: string;
  grandTotal: number;
  finalAmount: number;
  shipping: number;
  tax: number;
  subtotal: number;
  items: OrderItem[];
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string | null;
    postalCode: string | null;
    country: string;
  };
  promoCode: string | null;
  discount: number;
}

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderSuccessState | undefined;

  useEffect(() => {
    if (!state) navigate("/");
  }, [state, navigate]);

  if (!state) return null;

  const {
    orderNumber,
    grandTotal,
    finalAmount,
    shipping,
    tax,
    subtotal,
    items,
    address,
    promoCode,
    discount,
  } = state;

  return (
    <div className={OrderSuccessContainer}>
      {/* Header */}
      <div className={HeaderContainer}>
        <div className={logo}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className={successPharse}>Order Placed Successfully!</h1>
        <p className={thanksPara}>Thank you! We're preparing your order.</p>
      </div>

      {/* Order Details */}
      <div className={cardStyle}>
        <p className={sectionTitle}>Order Details</p>
        <div className={rowStyle}>
          <span className={labelStyle}>Order Number</span>
          <span className={valStyle}>#{orderNumber}</span>
        </div>
        <div className={rowStyle}>
          <span className={labelStyle}>Order Status</span>
          <span className={badgeStyle}>Paid</span>
        </div>
        {promoCode && (
          <div className={rowStyle}>
            <span className={labelStyle}>Promo Code</span>
            <span className={valStyle}>{promoCode}</span>
          </div>
        )}
      </div>

      {/* products */}
      <div className={cardStyle}>
        <p className={sectionTitle}>Items</p>
        {items.map((item) => (
          <div key={item.productId} className={itemStyle}>
            <div>
              <p className={productNameStyle}>{item.productName}</p>
              <p className={QuantityStyle}>Quantity: {item.quantity}</p>
            </div>
            <span className={PriceStyle}>
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}

        {/* Subtotal */}
        <div className={SubtotalContainer}>
          <div className={rowStyle}>
            <span className={labelStyle}>Subtotal</span>
            <span className={valStyle}>{formatCurrency(subtotal)} </span>
          </div>
          <div className={rowStyle}>
            <span className={labelStyle}>Shipping</span>
            <span className={valStyle}>{formatCurrency(shipping)} </span>
          </div>
          <div className={rowStyle}>
            <span className={labelStyle}>Tax</span>
            <span className={valStyle}>{formatCurrency(tax)}</span>
          </div>
          <div className={rowStyle}>
            <span className={labelStyle}>Total Before Discount</span>
            <span className={valStyle}>{formatCurrency(grandTotal)}</span>
          </div>
          {discount > 0 && (
            <div className={rowStyle}>
              <span className={labelStyle}>Discount</span>
              <span className={DiscountStyle}>
                - {formatCurrency(discount)}
              </span>
            </div>
          )}
          <div className={TotalStyle}>
            <span>Total</span>
            {discount > 0 ? (
              <>
                <del>{formatCurrency(grandTotal)}</del>
                <div className={grandTotalStyle}>
                  {formatCurrency(finalAmount)}
                </div>
              </>
            ) : (
              formatCurrency(grandTotal)
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className={cardStyle}>
        <p className={sectionTitle}>Shipping Address</p>
        <p className={addrLine}>
          {address.firstName} {address.lastName}
        </p>
        <p className={addrLine}>
          {address.streetAddress} {address.city && `, ${address.city}`}
          {address.state && `, ${address.state}`}
        </p>
        <p className={addrLine}>
          {address.postalCode && `${address.postalCode} - `}
          {address.country}
        </p>
        <p className={`${addrLine} ${contactLine} `}>
          {address.email}
          {address.email && address.phone && " · "}
          {address.phone}
        </p>
      </div>

      {/* buttons */}
      <div className={btns}>
        <button className={btnStyle} onClick={() => navigate("/")}>
          Continue Shopping
        </button>
        <button
          className={`${btnStyle} ${btnPrimaryStyle}`}
          onClick={() => navigate("/profile/Orders")}
        >
          My Orders
        </button>
      </div>
      <BackToTop />
    </div>
  );
};

export default OrderSuccess;
