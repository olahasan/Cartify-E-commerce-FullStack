import type { UserPersonalInfoData } from "@profile/ProfileAPI";
import type { TPersonalInfoInputs } from "@profile/ProfileSlice";
import { Edit2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

import styles from "../../Profile.module.css";

import {
  PersonalInfoSchema,
  type PersonalInfoSchemaType,
} from "@profile/validations/PersonalInfoSchema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@auth/Form/input/Input";
import { Form } from "react-bootstrap";
import LottieHandler from "@shared/LottieHandler/LottieHandler";
import BackToTop from "@shared/BackToTop/BackToTop";
import { formatDate } from "@shared/utils/formatDate";
import { extractCountryCode, extractPhone } from "@shared/utils/phone";
import { COUNTRY_CODES } from "@shared/constants/countryCodes";

const { mainAddrBox } = styles;

const toInputDate = (date?: string | null) => {
  if (!date) return "";

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

type PersonalInfoViewProps = {
  personalInfo: UserPersonalInfoData | null;
  loading: string;
  onEdit: (data: TPersonalInfoInputs) => void;
};

const PersonalInfoView = ({
  personalInfo,
  loading,
  onEdit,
}: PersonalInfoViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(PersonalInfoSchema),
  });

  const onSubmit: SubmitHandler<PersonalInfoSchemaType> = (data) => {
    const fullPhoneNumber = `${data.countryCode}${data.phone}`;

    const personalInfoData: TPersonalInfoInputs = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: fullPhoneNumber,
      dateOfBirth: data.dateOfBirth ?? "",
      profilePicture: data.profilePicture ?? null,
    };

    onEdit(personalInfoData);
    setIsEditing(false);
    reset(data);
  };

  useEffect(() => {
    if (personalInfo && isEditing) {
      reset({
        firstName: personalInfo.firstName ?? "",
        lastName: personalInfo.lastName ?? "",
        countryCode: extractCountryCode(personalInfo.phone),
        phone: extractPhone(personalInfo.phone),
        dateOfBirth: toInputDate(personalInfo.dateOfBirth),
        profilePicture: personalInfo.profilePicture ?? null,
      });
    }
  }, [personalInfo, isEditing, reset]);

  if (loading === "pending") return <LottieHandler type="loading" />;

  return (
    <>
      <div className={`card shadow-sm p-4 mb-4 ${mainAddrBox}`}>
        <div className="row g-4">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Personal Info</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary d-flex align-items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-success d-flex align-items-center gap-2"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                    }}
                    className="btn btn-secondary d-flex align-items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium mb-2">First Name</label>
              {isEditing ? (
                <Input<PersonalInfoSchemaType>
                  name="firstName"
                  register={register}
                  className="form-control"
                  error={errors.firstName?.message}
                  hideLabel
                />
              ) : (
                <p className="form-control-plaintext bg-light rounded px-3 py-2">
                  {personalInfo?.firstName}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium mb-2">Last Name</label>
              {isEditing ? (
                <Input<PersonalInfoSchemaType>
                  label="lastName"
                  name="lastName"
                  register={register}
                  className="form-control"
                  error={errors.lastName?.message}
                  hideLabel
                />
              ) : (
                <p className="form-control-plaintext bg-light rounded px-3 py-2">
                  {personalInfo?.lastName}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium mb-2">Email</label>
              {
                <p className="form-control-plaintext bg-light rounded px-3 py-2">
                  {personalInfo?.email}
                </p>
              }
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium mb-2">Date of Birth</label>
              {isEditing ? (
                <Input<PersonalInfoSchemaType>
                  type="date"
                  label="Date of Birth"
                  name="dateOfBirth"
                  register={register}
                  className="form-control"
                  error={errors.dateOfBirth?.message}
                  hideLabel
                />
              ) : (
                <p className="form-control-plaintext bg-light rounded px-3 py-2">
                  {formatDate(personalInfo?.dateOfBirth)}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium mb-2">Country Code</label>
              {isEditing ? (
                <Form.Group className="mb-2">
                  <Form.Select {...register("countryCode")} defaultValue="+20">
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : (
                <p className="form-control-plaintext bg-light rounded px-3 py-2">
                  {extractCountryCode(personalInfo?.phone)}
                </p>
              )}
            </div>

            <div className="mb-0">
              <label className="form-label fw-medium mb-2">Phone Number</label>
              {isEditing ? (
                <Input<PersonalInfoSchemaType>
                  label="Phone Number"
                  name="phone"
                  register={register}
                  className="form-control"
                  error={errors.phone?.message}
                  hideLabel
                />
              ) : (
                <p className="form-control-plaintext bg-light rounded px-3 py-2">
                  {extractPhone(personalInfo?.phone)}
                </p>
              )}
            </div>
          </Form>
        </div>
      </div>

      <div className={`card shadow-sm p-4 mb-4 ${mainAddrBox}`}>
        <div className="row g-4">
          <h2>Account Info</h2>

          <div>
            <label className="form-label fw-medium mb-2">Full Name</label>
            {
              <p className="form-control-plaintext bg-light rounded px-3 py-2">
                {personalInfo?.fullName}
              </p>
            }
          </div>
          <div>
            <label className="form-label fw-medium mb-2">Email</label>
            {
              <p className="form-control-plaintext bg-light rounded px-3 py-2">
                {personalInfo?.email}
              </p>
            }
          </div>
          <div>
            <label className="form-label fw-medium mb-2">Member Since</label>
            {
              <p className="form-control-plaintext bg-light rounded px-3 py-2">
                {formatDate(personalInfo?.createdAt)}
              </p>
            }
          </div>
          <div>
            <label className="form-label fw-medium mb-2">Last Updated</label>
            {
              <p className="form-control-plaintext bg-light rounded px-3 py-2">
                {formatDate(personalInfo?.updatedAt)}
              </p>
            }
          </div>
        </div>
      </div>
      <BackToTop />
    </>
  );
};

export default PersonalInfoView;
