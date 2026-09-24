import type { OrderDetailsData } from "@profile/ProfileAPI";
import { formatCurrency } from "@shared/utils/formatCurrency";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react";

import styles from "../../Profile.module.css";
import { formatDate } from "@shared/utils/formatDate";
import { toast } from "react-toastify";
const {
  statusStyle,
  overLayModalStyle,
  ModalContainer,
  orderDetailsHeader,
  xbtn,
  bodyOrderStatus,
  body,
  divTable,
  summary,
  summary2,
  cardStyle,
  sectionTitle,
  addrLine,
  footer,
} = styles;

// type OrderStatus = "delivered" | "processing" | "shipped";
type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    OrderStatus,
    {
      bg: string;
      color: string;
      icon: LucideIcon;
      text: string;
    }
  > = {
    pending: {
      bg: "#e2e3e5",
      color: "#495057",
      icon: Clock,
      text: status,
    },

    paid: {
      bg: "#cff4fc",
      color: "#055160",
      icon: CheckCircle,
      text: status,
    },

    delivered: {
      bg: "#d1f4e0",
      color: "#0f5132",
      icon: CheckCircle,
      text: status,
    },
    processing: {
      bg: "#fff3cd",
      color: "#997404",
      icon: Clock,
      text: status,
    },
    shipped: {
      bg: "#cfe2ff",
      color: "#084298",
      icon: Truck,
      text: status,
    },
    cancelled: {
      bg: "#f8d7da",
      color: "#842029",
      icon: Package,
      text: status,
    },
  };

  const config = statusConfig[status as OrderStatus] || statusConfig.processing;
  const Icon = config.icon;

  return (
    <span
      className={statusStyle}
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      <Icon size={14} />
      {config.text}
    </span>
  );
};

type OrderDetailsModalProps = {
  show: boolean;
  onHide: () => void;
  orderDetails: OrderDetailsData;
};

// Modal Component
const OrderDetailsModal = ({
  show,
  onHide,
  orderDetails,
}: OrderDetailsModalProps) => {
  if (!show) return null;

  return (
    <div className={overLayModalStyle}>
      <div className={ModalContainer}>
        {/* Header */}
        <div className={orderDetailsHeader}>
          <div>
            <h2>
              Order Details #{orderDetails.orderID}
              <small>Ref:({orderDetails.orderNumber.slice(0, 8)})</small>
            </h2>
            <p>{formatDate(orderDetails.createdAt)}</p>
          </div>
          <button className={xbtn} onClick={onHide}>
            ✕
          </button>
        </div>

        <div className={body}>
          {/* Status */}
          <div className={bodyOrderStatus}>
            <div>
              <p>Order Status</p>
              {getStatusBadge(orderDetails.status)}
            </div>
            <Package size={40} />
          </div>

          <h3>Order Items ({orderDetails.summary.totalItems})</h3>

          <div className={divTable}>
            <table>
              <thead>
                <tr>
                  <th>Items</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.items.map((item, index: number) => (
                  <tr
                    key={item.orderItemID}
                    style={{
                      borderBottom:
                        index !== orderDetails.items.length - 1
                          ? "1px solid #e5e7eb"
                          : "none",
                    }}
                  >
                    <td>
                      <div>{item.productName}</div>
                    </td>
                    <td>
                      <span>{item.quantity}</span>
                    </td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={summary}>
            <div>
              <span>Subtotal:</span>
              <span>
                {formatCurrency(orderDetails.summary.calculatedTotal)}
              </span>
            </div>

            <div>
              <span>Shipping:</span>
              <span>
                {orderDetails.shippingAmount === 0
                  ? "Free 🎁"
                  : formatCurrency(orderDetails.shippingAmount)}
              </span>
            </div>

            <div>
              <span>Tax:</span>
              <span>{formatCurrency(orderDetails.taxAmount)}</span>
            </div>

            <div>
              <span>Total Before Discount:</span>
              <span>{formatCurrency(orderDetails.totalAmount)}</span>
            </div>

            {orderDetails.promoCode && (
              <div>
                <span>Promo Code:</span>
                <span>{orderDetails.promoCode}</span>
              </div>
            )}

            {orderDetails.discountAmount > 0 && (
              <div>
                <span>Discount:</span>
                <span> - {formatCurrency(orderDetails.discountAmount)}</span>
              </div>
            )}

            <div>
              <div>
                <span>Total:</span>
                <span>{formatCurrency(orderDetails.finalAmount)}</span>
              </div>
            </div>
          </div>

          <div className={summary2}>
            <div className={cardStyle}>
              <p className={sectionTitle}>Shipping Address</p>
              <p className={addrLine}>
                {orderDetails.address.firstName} {orderDetails.address.lastName}
              </p>
              <p className={addrLine}>
                {orderDetails.address.streetAddress} ،
                {orderDetails.address.city}، {orderDetails.address.state}
              </p>
              <p className={addrLine}>
                {orderDetails.address.postalCode} -
                {orderDetails.address.country}
              </p>
              <p className={addrLine}>
                {orderDetails.address.email} · {orderDetails.address.phone}
              </p>
            </div>

            <div className={cardStyle}>
              <p className={sectionTitle}>Payment Method</p>
              <p className={addrLine}>
                {orderDetails.paymentBrand} ****{orderDetails.paymentLast4}
              </p>
            </div>
          </div>
        </div>

        <div className={footer}>
          <button onClick={onHide}>Close</button>
          <button
            title="Order tracking will be available soon"
            onClick={() => toast.info("Tracking will be available soon")}
            // disabled
          >
            <Truck size={16} />
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
