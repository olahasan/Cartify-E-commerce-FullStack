import type { OrderDetailsData, UserOrdersData } from "@profile/ProfileAPI";
import styles from "../../Profile.module.css";
import { formatCurrency } from "@shared/utils/formatCurrency";
import OrderDetailsModal from "./OrderDetailsModal";
import { CheckCircle, Clock, Eye, Truck, type LucideIcon } from "lucide-react";
import LottieHandler from "@shared/LottieHandler/LottieHandler";
import BackToTop from "@shared/BackToTop/BackToTop";
import { formatDate } from "@shared/utils/formatDate";

const {
  statusIconStyle,
  mainAddrBox,
  sameHoverAsHead,
  myOrders,
  myOrdersParagraph,
  myOrdersbtn,
  myOrdersContainer,
  tableResponsive,
} = styles;

type OrderStatus = "delivered" | "processing" | "shipped";
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
  };

  const config = statusConfig[status as OrderStatus] || statusConfig.processing;
  const Icon = config.icon;

  return (
    <span
      className={statusIconStyle}
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

type OrdersViewProps = {
  userOrders: UserOrdersData[];
  loading: string;
  onViewDetails: (id: number) => void;
  orderDetails?: OrderDetailsData | null;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function OrdersView({
  userOrders,
  loading,
  onViewDetails,
  orderDetails,
  showModal,
  setShowModal,
}: OrdersViewProps) {
  if (loading === "pending") return <LottieHandler type="loading" />;
  return (
    <>
      <div className={`card shadow-sm p-4 mb-4 ${mainAddrBox}`}>
        {/* Page Header */}
        <div className={myOrdersContainer}>
          <div>
            <h2 className={myOrders}>My Orders</h2>
            <p className={myOrdersParagraph}>
              View all your current and previous orders.
            </p>
          </div>
          <div className={myOrdersbtn}>
            {userOrders.length} {userOrders.length === 1 ? "Order" : "Orders"}
          </div>
        </div>
      </div>

      <div className={`card shadow-sm p-4 mb-4 ${mainAddrBox}`}>
        <h2>My Orders</h2>
        {userOrders.length === 0 ? (
          <LottieHandler type="empty" message="Your Order List is Empty" />
        ) : (
          <div className={tableResponsive}>
            <table
              className={`table table-hover align-middle mb-0 ${sameHoverAsHead} `}
            >
              <thead className="table-light">
                <tr>
                  <th className="text-center fw-semibold">Order ID</th>
                  <th className="text-center fw-semibold">Items</th>
                  <th className="text-center fw-semibold">Date</th>
                  <th className="text-center fw-semibold">Subtotal</th>
                  <th className="text-center fw-semibold">Status</th>
                  <th className="text-center fw-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {userOrders.map((order) => (
                  <tr key={order.orderId} className="table-hover">
                    <td className="text-center fw-medium">
                      {`#ORD-${order.orderId}`}
                    </td>
                    <td className="text-center fw-medium">
                      {`${order.itemsCount}`}
                    </td>
                    <td className="text-center text-muted">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="text-center fw-semibold">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-primary d-inline-flex align-items-center gap-1"
                        onClick={() => onViewDetails(order.orderId)}
                      >
                        <Eye size={16} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && orderDetails && (
        <OrderDetailsModal
          show={showModal}
          onHide={() => setShowModal(false)}
          orderDetails={orderDetails}
        />
      )}
      <BackToTop />
    </>
  );
}

export default OrdersView;
