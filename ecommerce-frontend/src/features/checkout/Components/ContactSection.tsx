const {
  sectionTitle,
  line,
  card,
  fieldRow,
  two,
  field,
  labelCapitalize,
  inputIconWrap,
  icon,
} = styles;
import { Edit2, Save, X } from "lucide-react";
import styles from "../checkout.module.css";
import Input from "@auth/Form/input/Input";
import type { CheckoutSchemaType } from "@checkout/validations/CheckoutSchema";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";

interface ContactSectionProps {
  isPersonalInfoEditing: boolean;
  setIsPersonalInfoEditing: React.Dispatch<React.SetStateAction<boolean>>;

  watch: UseFormWatch<CheckoutSchemaType>;
  register: UseFormRegister<CheckoutSchemaType>;
  trigger: UseFormTrigger<CheckoutSchemaType>;

  errors: FieldErrors<CheckoutSchemaType>;
  handleCancel: (section: "personal" | "address") => void;
}

const ContactSection = ({
  isPersonalInfoEditing,
  setIsPersonalInfoEditing,
  watch,
  trigger,
  register,
  errors,
  handleCancel,
}: ContactSectionProps) => {
  return (
    <>
      <div className={card}>
        <div className={sectionTitle}>
          Personal Information<span className={line}></span>
          {!isPersonalInfoEditing ? (
            <button
              onClick={() => setIsPersonalInfoEditing(true)}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <Edit2 size={16} />
              Edit
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-success d-flex align-items-center gap-2"
                onClick={async () => {
                  const valid = await trigger([
                    "firstName",
                    "lastName",
                    "email",
                    "phone",
                  ]);

                  if (valid) {
                    setIsPersonalInfoEditing(false);
                  }
                }}
              >
                <Save size={16} />
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCancel("personal");
                  setIsPersonalInfoEditing(false);
                }}
                className="btn btn-secondary d-flex align-items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className={`${fieldRow} ${two}`}>
          <div className={field}>
            <label className={labelCapitalize}>First Name</label>
            {isPersonalInfoEditing ? (
              <Input<CheckoutSchemaType>
                name="firstName"
                register={register}
                className="form-control"
                error={errors.firstName?.message}
                hideLabel
              />
            ) : (
              <p className="form-control-plaintext bg-light rounded px-3 py-2">
                {watch("firstName")}
              </p>
            )}
          </div>

          <div className={field}>
            <label className={labelCapitalize}>Last Name</label>
            {isPersonalInfoEditing ? (
              <Input<CheckoutSchemaType>
                name="lastName"
                register={register}
                className="form-control"
                error={errors.lastName?.message}
                hideLabel
              />
            ) : (
              <p className="form-control-plaintext bg-light rounded px-3 py-2">
                {watch("lastName")}
              </p>
            )}
          </div>
        </div>

        <div className={fieldRow}>
          <div className={field}>
            <label className={labelCapitalize}>Email</label>
            <div className={inputIconWrap}>
              <svg
                className={icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 6L2 7" />
              </svg>
              <p className="form-control-plaintext bg-light rounded px-3 py-2 ml-2 w-75">
                {watch("email")}
              </p>
            </div>
          </div>
        </div>
        <div className={fieldRow}>
          <div className={field}>
            <label className={labelCapitalize}>Phone Number</label>
            <div className={inputIconWrap}>
              <svg
                className={icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {isPersonalInfoEditing ? (
                <Input<CheckoutSchemaType>
                  name="phone"
                  register={register}
                  className="form-control w-75"
                  error={errors.phone?.message}
                  hideLabel
                />
              ) : (
                <p className="form-control-plaintext bg-light rounded px-3 py-2 w-75">
                  {watch("phone")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactSection;
