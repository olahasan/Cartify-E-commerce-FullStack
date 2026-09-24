import type { UserDashboardData } from "@profile/ProfileAPI";
import styles from "../../Profile.module.css";

import {
  CheckCircle,
  Clock,
  CreditCard,
  HeartPlus,
  MapPin,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { formatCurrency } from "@shared/utils/formatCurrency";
import { useMemo } from "react";
import LottieHandler from "@shared/LottieHandler/LottieHandler";
import BackToTop from "@shared/BackToTop/BackToTop";
import { formatNumber } from "@shared/utils/formatNumber";
import { formatDate } from "@shared/utils/formatDate";

const { mainAddrBox, container, box } = styles;

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
      style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <Icon size={14} />
      {config.text}
    </span>
  );
};

type DashboardViewProps = {
  userDashboard: UserDashboardData | null;
};

const DashboardView = ({ userDashboard }: DashboardViewProps) => {
  const totalSpent = useMemo(() => {
    return (
      userDashboard?.recentOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      ) ?? 0
    );
  }, [userDashboard]);

  if (!userDashboard) {
    return <LottieHandler type="loading" />;
  }

  type OverviewCard = {
    title: string;
    value: string | number;
    icon: LucideIcon;
  };

  const overviewCards: OverviewCard[] = [
    {
      title: "Total Orders",
      value: userDashboard?.stats.orders,
      icon: Package,
    },
    {
      title: "Last 3 Orders (EGP)",
      value: formatNumber(totalSpent),
      icon: CreditCard,
    },
    {
      title: "Wishlist",
      value: userDashboard?.stats.wishlist,
      icon: HeartPlus,
    },
    {
      title: "Saved Addresses",
      value: userDashboard?.stats.addresses,
      icon: MapPin,
    },
  ];

  return (
    <>
      <div className={`card shadow-sm p-4 mb-4 ${mainAddrBox}`}>
        <div className="bg-white rounded shadow-sm p-4">
          <div className="container py-4">
            <h2 className="h2 fw-bold text-dark mb-4">Overview</h2>
            <div className={container}>
              {overviewCards.map(({ title, value, icon: Icon }) => (
                <div key={title} className={box}>
                  <div className="card text-white shadow-lg">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-light small mb-1">{title}</p>
                        <p className="h1 fw-bold mb-0">{value}</p>
                      </div>
                      <Icon size={40} className="opacity-75" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`card shadow-sm p-4 mb-4 ${mainAddrBox}`}>
        <div className="bg-white rounded shadow-sm p-4">
          <h3 className="h4 fw-bold text-dark mb-4">Recent Orders</h3>
          <div className="d-flex flex-column gap-3">
            {userDashboard?.recentOrders.map((order) => (
              <div
                key={order.orderID}
                className="d-flex justify-content-between align-items-center p-3 bg-light rounded"
              >
                <div>
                  <p className="fw-semibold text-dark mb-1">{`#ORD-${order.orderID}`}</p>
                  <p className="text-muted small mb-0">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="text-center">
                  <p className="fw-bold text-dark mb-1">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BackToTop />
    </>
  );
};

export default DashboardView;
