import { useAppDispatch, useAppSelector } from "@app/hooks";
import OrdersView from "./OrdersView";
import { useEffect, useState } from "react";
import {
  GetOrderDetailsThunk,
  GetUserOrdersThunk,
} from "@profile/ProfileSlice";
import useScrollToTop from "@shared/hooks/useScrollToTop";

const Orders = () => {
  useScrollToTop();
  const dispatch = useAppDispatch();
  const { userOrders, orderDetails, loading } = useAppSelector(
    (state) => state.profile,
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(GetUserOrdersThunk());
  }, [dispatch]);

  const handleViewDetails = (orderId: number) => {
    dispatch(GetOrderDetailsThunk(orderId));
    setShowModal(true);
  };

  return (
    <>
      <h1 className="p-relative">Orders</h1>
      <OrdersView
        userOrders={userOrders}
        loading={loading}
        onViewDetails={handleViewDetails}
        orderDetails={orderDetails}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
};

export default Orders;
