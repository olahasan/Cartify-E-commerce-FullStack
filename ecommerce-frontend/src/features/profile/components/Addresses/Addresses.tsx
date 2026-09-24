import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  AddUserAddressInfoThunk,
  DeleteUserAddressThunk,
  GetUserAddressesThunk,
  GetUserDashboardThunk,
  UpdateUserAddressInfoThunk,
} from "@profile/ProfileSlice";
import { useEffect } from "react";
import AddressesView from "./AddressesView";
import type { AddUserAddressInput } from "@profile/ProfileAPI";
import useScrollToTop from "@shared/hooks/useScrollToTop";

const Addresses = () => {
  useScrollToTop();
  const dispatch = useAppDispatch();
  const { userAddresses, loading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(GetUserAddressesThunk());
  }, [dispatch]);

  const handleAdd = async (data: AddUserAddressInput) => {
    await dispatch(AddUserAddressInfoThunk(data)).unwrap();
    dispatch(GetUserAddressesThunk());
    dispatch(GetUserDashboardThunk());
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: number) => {
    await dispatch(DeleteUserAddressThunk({ addressId: id })).unwrap();
    dispatch(GetUserAddressesThunk());
    dispatch(GetUserDashboardThunk());
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleEdit = (id: number, data: AddUserAddressInput) => {
    dispatch(
      UpdateUserAddressInfoThunk({
        addressId: id,
        address: data,
      }),
    );
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <h1 className="p-relative">Addresses</h1>
      <AddressesView
        addresses={userAddresses}
        loading={loading}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </>
  );
};

export default Addresses;
