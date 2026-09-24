import type {
  AddUserAddressInput,
  UserAddressesData,
} from "@profile/ProfileAPI";
import { Plus, Trash2 } from "lucide-react";
import styles from "../../Profile.module.css";
import { useState } from "react";
import {
  AddressSchema,
  type AddressFormDataType,
} from "@profile/validations/AddressSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import Input from "@auth/Form/input/Input";
import { Form } from "react-bootstrap";
import LottieHandler from "@shared/LottieHandler/LottieHandler";
import BackToTop from "@shared/BackToTop/BackToTop";
import { COUNTRIES } from "@shared/constants/countries";

const { mainAddrBox } = styles;

type AddressesViewProps = {
  addresses: UserAddressesData[];
  loading: string;
  onAdd: (data: AddUserAddressInput) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, data: AddUserAddressInput) => void;
};

const AddressesView = ({
  addresses,
  loading,
  onAdd,
  onDelete,
  onEdit,
}: AddressesViewProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddressFormDataType>({
    mode: "onBlur",
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      addressType: "",
      streetAddress: "",
      city: "",
      state: null,
      postalCode: null,
      country: "Egypt",
      isDefault: false,
    },
  });

  if (loading === "pending") return <LottieHandler type="loading" />;

  const onSubmit: SubmitHandler<AddressFormDataType> = (data) => {
    const addressData: AddUserAddressInput = {
      addressType: data.addressType?.trim() || "home",
      country: data.country?.trim() || "Egypt",
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state?.trim() || null,
      postalCode: data.postalCode?.trim() || null,
      isDefault: data.isDefault ?? false,
    };

    if (editingId) {
      onEdit(editingId, addressData);
    } else {
      onAdd(addressData);
    }

    setEditingId(null);
    setIsAdding(false);
    reset();
  };

  const startEdit = (addr: UserAddressesData) => {
    setEditingId(addr.addressID);
    setIsAdding(true);
    setValue("addressType", addr.addressType);
    setValue("streetAddress", addr.streetAddress);
    setValue("city", addr.city);
    setValue("postalCode", addr.postalCode ?? null);
    setValue("state", addr.state ?? null);
    setValue("country", addr.country);
    setValue("isDefault", addr.isDefault);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    reset();
  };

  return (
    <>
      <div className={`card shadow-sm p-4 mb-4 ${mainAddrBox}`}>
        <div className="d-flex justify-content-between align-items-center mb-3 ">
          <h2>Addresses</h2>
          <button
            type="button"
            onClick={() => {
              setIsAdding(true);
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <Plus size={16} />
            Add Address
          </button>
        </div>

        {isAdding && (
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="border rounded p-3 mb-4 bg-light"
          >
            <h4 className="font-semibold text-gray-800 mb-3">
              {editingId ? "Edit Address" : "New Address"}
            </h4>
            <div className="row g-2">
              <Input<AddressFormDataType>
                className="form-control"
                label="Address Type (e.g. Home)"
                name="addressType"
                register={register}
                error={errors.addressType?.message}
              />
              <Input<AddressFormDataType>
                className="form-control"
                label="Street Address"
                name="streetAddress"
                register={register}
                error={errors.streetAddress?.message}
              />
              <Input<AddressFormDataType>
                className="form-control"
                label="City"
                name="city"
                register={register}
                error={errors.city?.message}
              />
              <Input<AddressFormDataType>
                className="form-control"
                label="State / Province (Optional)"
                name="state"
                register={register}
                error={errors.state?.message}
              />

              <Input<AddressFormDataType>
                className="form-control"
                label="Postal Code (Optional)"
                name="postalCode"
                register={register}
                error={errors.postalCode?.message}
              />
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>

                <Form.Select
                  {...register("country")}
                  defaultValue="Egypt"
                  isInvalid={!!errors.country}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </Form.Select>

                <Form.Control.Feedback type="invalid">
                  {errors.country?.message}
                </Form.Control.Feedback>

                <Form.Text muted>Egypt is selected by default.</Form.Text>
              </Form.Group>

              <label
                style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}
              >
                <input
                  style={{ width: "20px" }}
                  type="checkbox"
                  {...register("isDefault")}
                />
                <span>Default Address</span>
              </label>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-success">
                {editingId ? "Update" : "Add Address"}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCancel();
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}

        <div className="row g-3">
          {addresses.map((addr) => (
            <div key={addr.addressID}>
              <div className="border rounded p-3 h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h3>{addr.addressType}</h3>
                  {addr.isDefault && (
                    <span className="badge bg-success">Default</span>
                  )}
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(addr.addressID);
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                      className="btn btn-sm btn-outline-danger border-0"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary me-2 border-0"
                      onClick={() => {
                        startEdit(addr);
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <p className="mb-1 text-muted">{addr.streetAddress}</p>
                <p className="mb-0 text-muted">
                  {addr.country && `${addr.country} - `} {addr.city}{" "}
                  {addr.postalCode && `- ${addr.postalCode}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-5">
          <LottieHandler type="empty" message="No saved addresses yet." />
        </div>
      )}
      <BackToTop />
    </>
  );
};

export default AddressesView;
