const {
  sectionTitle,
  line,
  card,
  fieldRow,
  two,
  field,
  labelCapitalize,
  formHint,
} = styles;
import type { CheckoutSchemaType } from "@checkout/validations/CheckoutSchema";
import styles from "../checkout.module.css";
import Input from "@auth/Form/input/Input";
import { Form } from "react-bootstrap";
import { Edit2, Plus, Save, X } from "lucide-react";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";

interface AddressSectionProps {
  isAddressEditing: boolean;
  setIsAddressEditing: React.Dispatch<React.SetStateAction<boolean>>;

  watch: UseFormWatch<CheckoutSchemaType>;
  register: UseFormRegister<CheckoutSchemaType>;
  trigger: UseFormTrigger<CheckoutSchemaType>;

  errors: FieldErrors<CheckoutSchemaType>;

  COUNTRIES: {
    value: string;
    label: string;
  }[];

  handleCancel: (section: "personal" | "address") => void;
}
const AddressSection = ({
  isAddressEditing,
  setIsAddressEditing,
  watch,
  trigger,
  register,
  errors,
  COUNTRIES,
  handleCancel,
}: AddressSectionProps) => {
  const hasShippingAddress = Boolean(
    watch("defaultAddress.addressType") ||
    watch("defaultAddress.streetAddress") ||
    watch("defaultAddress.city"),
  );
  return (
    <>
      <div className={card}>
        <div className={sectionTitle}>
          Shipping Address <span className={line}></span>
          {!isAddressEditing ? (
            <button
              onClick={() => setIsAddressEditing(true)}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              {hasShippingAddress ? (
                <>
                  <Edit2 size={16} />
                  Edit
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Shipping Address
                </>
              )}
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-success d-flex align-items-center gap-2"
                onClick={async () => {
                  const valid = await trigger([
                    "defaultAddress.addressType",
                    "defaultAddress.streetAddress",
                    "defaultAddress.city",
                    "defaultAddress.state",
                    "defaultAddress.postalCode",
                    "defaultAddress.country",
                  ]);

                  if (valid) {
                    setIsAddressEditing(false);
                  }
                }}
              >
                <Save size={16} />
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCancel("address");
                  setIsAddressEditing(false);
                }}
                className="btn btn-secondary d-flex align-items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {!isAddressEditing && !hasShippingAddress ? (
          <div className="alert alert-info mt-3">
            <strong>No default shipping address found.</strong>
            <br />
            Please click <strong>"Add Shipping Address"</strong> above to enter
            your shipping address.
          </div>
        ) : (
          <>
            <div className={fieldRow}>
              <div className={field}>
                <label className={labelCapitalize}>
                  Address Label (e.g. Home)
                </label>
                {isAddressEditing ? (
                  <Input<CheckoutSchemaType>
                    name="defaultAddress.addressType"
                    className="form-control"
                    register={register}
                    error={errors.defaultAddress?.addressType?.message}
                  />
                ) : (
                  <p className="form-control-plaintext bg-light rounded px-3 py-2">
                    {watch("defaultAddress.addressType")}
                  </p>
                )}
              </div>
            </div>
            <div className={fieldRow}>
              <div className={field}>
                <label className={labelCapitalize}>Street Address</label>

                {isAddressEditing ? (
                  <Input<CheckoutSchemaType>
                    name="defaultAddress.streetAddress"
                    className="form-control"
                    register={register}
                    error={errors.defaultAddress?.streetAddress?.message}
                  />
                ) : (
                  <p className="form-control-plaintext bg-light rounded px-3 py-2">
                    {watch("defaultAddress.streetAddress")}
                  </p>
                )}
              </div>
            </div>
            <div className={`${fieldRow} ${two}`}>
              <div className={field}>
                <label className={labelCapitalize}>City</label>
                {isAddressEditing ? (
                  <Input<CheckoutSchemaType>
                    name="defaultAddress.city"
                    className="form-control"
                    register={register}
                    error={errors.defaultAddress?.city?.message}
                  />
                ) : (
                  <p className="form-control-plaintext bg-light rounded px-3 py-2">
                    {watch("defaultAddress.city")}
                  </p>
                )}
              </div>
              <div className={field}>
                <label className={labelCapitalize}>
                  State / Province (Optional)
                </label>
                {isAddressEditing ? (
                  <Input<CheckoutSchemaType>
                    name="defaultAddress.state"
                    className="form-control"
                    register={register}
                    error={errors.defaultAddress?.state?.message}
                  />
                ) : (
                  <p className="form-control-plaintext bg-light rounded px-3 py-2">
                    {watch("defaultAddress.state") || "\u00A0"}
                  </p>
                )}
              </div>
            </div>
            <div className={`${fieldRow} ${two}`}>
              <div className={field}>
                <Form.Group className="mt-0">
                  <Form.Label className={labelCapitalize}>Country</Form.Label>

                  {isAddressEditing ? (
                    <>
                      <Form.Select
                        {...register("defaultAddress.country")}
                        defaultValue="Egypt"
                        isInvalid={!!errors.defaultAddress?.country}
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </Form.Select>

                      <Form.Control.Feedback type="invalid">
                        {errors.defaultAddress?.country?.message}
                      </Form.Control.Feedback>

                      <Form.Text className={formHint}>
                        Egypt is preselected as the default country.
                      </Form.Text>
                    </>
                  ) : (
                    <p className="form-control-plaintext bg-light rounded px-3 py-2">
                      {COUNTRIES.find(
                        (country) =>
                          country.value === watch("defaultAddress.country"),
                      )?.label ?? watch("defaultAddress.country")}
                    </p>
                  )}
                </Form.Group>
              </div>
              <div className={field}>
                <label className={`mt-2 ${labelCapitalize}`}>Postal Code</label>

                {isAddressEditing ? (
                  <Input<CheckoutSchemaType>
                    name="defaultAddress.postalCode"
                    className="form-control"
                    register={register}
                    error={errors.defaultAddress?.postalCode?.message}
                  />
                ) : (
                  <p className="form-control-plaintext bg-light rounded px-3 py-2">
                    {watch("defaultAddress.postalCode")}
                  </p>
                )}
              </div>
            </div>
            <div className={`${fieldRow} `}>
              <div className={field}>
                <input
                  id="defaultAddress"
                  type="checkbox"
                  {...register("defaultAddress.isDefault")}
                />
                <label className={labelCapitalize} htmlFor="defaultAddress">
                  Default Address
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AddressSection;
