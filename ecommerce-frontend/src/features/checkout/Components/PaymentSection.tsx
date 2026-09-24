const {
  sectionTitle,
  line,
  card,
  fieldRow,
  field,
  labelCapitalize,
  payTabs,
  payTab,
  payTabNotAllowed,
  active,
  cardPreview,
  cardPreviewTop,
  cardChip,
  cardLogo,
  cardNumber,
  cardBottom,
  cardLabel,
  cardValue,
  CardDetails,
  DefaultCheckbox,
  ErrorMessage,
} = styles;
import Input from "@auth/Form/input/Input";
import styles from "../checkout.module.css";
import type { CheckoutSchemaType } from "@checkout/validations/CheckoutSchema";
import { CardElement } from "@stripe/react-stripe-js";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import type { StripeCardElementChangeEvent } from "@stripe/stripe-js";

interface PaymentSectionProps {
  watch: UseFormWatch<CheckoutSchemaType>;
  register: UseFormRegister<CheckoutSchemaType>;
  errors: FieldErrors<CheckoutSchemaType>;

  cardBrand: string | null;
  setCardBrand: React.Dispatch<React.SetStateAction<string | null>>;

  isDefault: boolean;
  setIsDefault: React.Dispatch<React.SetStateAction<boolean>>;

  error: string | null;
}

const PaymentSection = ({
  watch,
  register,
  errors,
  cardBrand,
  setCardBrand,
  isDefault,
  setIsDefault,
  error,
}: PaymentSectionProps) => {
  return (
    <>
      <div className={card}>
        <div className={sectionTitle}>
          Payment Method <span className={line}></span>
        </div>

        <div className={payTabs}>
          <div className={`${payTab} ${active}`}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Credit Card
          </div>

          <div
            className={`${payTab} ${payTabNotAllowed}`}
            aria-disabled="true"
            title="Coming Soon"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Digital Wallet
            <small className="d-block">Coming Soon</small>
          </div>

          <div
            className={`${payTab} ${payTabNotAllowed}`}
            aria-disabled="true"
            title="Coming Soon"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="18.5" cy="14.5" r="1.5" />
              <circle cx="4.5" cy="14.5" r="1.5" />
            </svg>
            Cash on Delivery
            <small className="d-block">Coming Soon</small>
          </div>
        </div>

        {/* <!-- Card Form --> */}
        <div>
          <div className={cardPreview}>
            <div className={cardPreviewTop}>
              <div className={cardChip}></div>
              <div className={cardLogo}>
                {cardBrand ? cardBrand.toUpperCase() : "CARD"}
              </div>
            </div>
            <div className={cardNumber}>•••• •••• •••• 1234</div>
            <div className={cardBottom}>
              <div>
                <div className={cardLabel}>Cardholder Name</div>
                <div className={cardValue}>
                  {watch("defaultPaymentMethod.cardHolderName") ||
                    "Name on Card"}
                </div>
              </div>
              <div>
                <div className={cardLabel}>Expires</div>
                <div className={cardValue}>MM/YY</div>
              </div>
            </div>
          </div>

          <div className={CardDetails}>
            <label>Card Details</label>
            <div>
              <CardElement
                onChange={(event: StripeCardElementChangeEvent) => {
                  if (event.brand) {
                    setCardBrand(event.brand);
                  }
                }}
                options={{
                  hidePostalCode: true,
                }}
              />
            </div>
          </div>

          {/* Default Checkbox */}
          <div className={DefaultCheckbox}>
            <label>
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => {
                  setIsDefault(e.target.checked);
                }}
              />
              Set as default
            </label>
          </div>

          {/* Error Message */}
          {error && <div className={ErrorMessage}>{error}</div>}

          <div className={fieldRow}>
            <div className={field}>
              <label className={labelCapitalize}>Cardholder Name</label>
              <Input<CheckoutSchemaType>
                name="defaultPaymentMethod.cardHolderName"
                register={register}
                className="form-control"
                error={errors.defaultPaymentMethod?.cardHolderName?.message}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSection;
