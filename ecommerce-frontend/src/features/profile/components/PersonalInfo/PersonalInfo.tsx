import { useAppDispatch, useAppSelector } from "@app/hooks";
import PersonalInfoView from "./PersonalInfoView";
import { useEffect } from "react";
import {
  GetUserPersonalInfoThunk,
  UpdateUserPersonalInfoThunk,
  type TPersonalInfoInputs,
} from "@profile/ProfileSlice";
import useScrollToTop from "@shared/hooks/useScrollToTop";

const PersonalInfo = () => {
  useScrollToTop();
  const dispatch = useAppDispatch();
  const { userPersonalInfo, loading } = useAppSelector(
    (state) => state.profile,
  );

  useEffect(() => {
    if (!userPersonalInfo) {
      dispatch(GetUserPersonalInfoThunk());
    }
  }, [dispatch, userPersonalInfo]);

  const handleEdit = (data: TPersonalInfoInputs) => {
    dispatch(UpdateUserPersonalInfoThunk(data));
  };

  return (
    <>
      <h1 className="p-relative">Personal Information</h1>
      <PersonalInfoView
        personalInfo={userPersonalInfo}
        loading={loading}
        onEdit={handleEdit}
      />
    </>
  );
};

export default PersonalInfo;
