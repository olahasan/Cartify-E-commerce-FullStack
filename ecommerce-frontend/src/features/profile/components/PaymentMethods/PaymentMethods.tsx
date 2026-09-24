import {
  AddUserPaymentMethodThunk,
  DeleteUserPaymentMethodThunk,
  GetUserPaymentMethodsThunk,
} from "@profile/ProfileSlice";
import PaymentMethodsView from "./PaymentMethodsView";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import type { TAddPaymentMethodInput } from "@profile/ProfileAPI";
import useScrollToTop from "@shared/hooks/useScrollToTop";

const PaymentMethods = () => {
  useScrollToTop();
  const dispatch = useAppDispatch();
  const { userPaymentMethods, loading } = useAppSelector(
    (state) => state.profile,
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(GetUserPaymentMethodsThunk());
  }, [dispatch]);

  const handleAdd = async (data: TAddPaymentMethodInput) => {
    try {
      await dispatch(AddUserPaymentMethodThunk(data)).unwrap();

      dispatch(GetUserPaymentMethodsThunk());
    } catch (error: unknown) {
      console.error("handleAdd failed:", error);

      alert(
        `Failed to add payment method: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(
        DeleteUserPaymentMethodThunk({ paymentMethodId: id }),
      ).unwrap();
      dispatch(GetUserPaymentMethodsThunk());
    } catch (error: unknown) {
      console.error("handleDelete failed:", error);

      alert(
        `Failed to delete payment method: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  return (
    <>
      <h1 className="p-relative">Payment Methods</h1>
      <PaymentMethodsView
        userPaymentMethods={userPaymentMethods}
        loading={loading}
        showModal={showModal}
        setShowModal={setShowModal}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </>
  );
};

export default PaymentMethods;
