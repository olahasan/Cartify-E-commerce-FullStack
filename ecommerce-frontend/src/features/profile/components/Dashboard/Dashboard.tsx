import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useEffect } from "react";
import { GetUserDashboardThunk } from "@profile/ProfileSlice";
import DashboardView from "./DashboardView";
import useScrollToTop from "@shared/hooks/useScrollToTop";

const Dashboard = () => {
  useScrollToTop();

  const dispatch = useAppDispatch();
  const { userDashboard } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (!userDashboard) {
      dispatch(GetUserDashboardThunk());
    }
  }, [dispatch, userDashboard]);

  return (
    <>
      <h1 className="p-relative">Dashboard</h1>
      <DashboardView userDashboard={userDashboard} />
    </>
  );
};

export default Dashboard;
