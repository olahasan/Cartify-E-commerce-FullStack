import { CheckCircle, CreditCard, Lock, X } from "lucide-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import type { TAddPaymentMethodInput } from "@profile/ProfileAPI";

import styles from "../../Profile.module.css";
const {
  overLayStyle,
  modalHeader,
  CardPreviewContainer,
  cardNumberStyle,
  cardNumberBulletsStyle,
  CardholderStyle,
  errorStyle,
  CardNumberContainer,
  CardHolderContainer,
  CardholderName,
  ExpiryContainer,
  CardDetailsStyle,
  DefaultCheckbox,
  SecurityContainer,
  btns,
} = styles;

type PaymentMethodsModalProps = {
  show: boolean;
  onHide: () => void;
  onAdd: (data: TAddPaymentMethodInput) => void;
};

const PaymentMethodsModal = ({
  show,
  onHide,
  onAdd,
}: PaymentMethodsModalProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [cardType, setCardType] = useState("Card");

  if (!show) return null;

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "Visa";
    if (/^5[1-5]/.test(cleaned)) return "Mastercard";
    if (/^3[47]/.test(cleaned)) return "American Express";
    return "Card";
  };

  const getCardColor = (type: string) => {
    const colors: Record<string, string> = {
      Visa: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      Mastercard: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
      "American Express": "linear-gradient(135deg, #006fcf 0%, #2e77bb 100%)",
      Card: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    };
    return colors[type] || colors.Card;
  };

  // Format Card Number
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ").substr(0, 19);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setError("Stripe has not been loaded yet.");
      return;
    }

    if (!formData.cardHolder || formData.cardHolder.trim() === "") {
      setError("Please enter the cardholder name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement("card");
      if (!cardElement) throw new Error("CardElement not found");

      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: formData.cardHolder,
          },
        });

      if (stripeError) {
        console.error("Stripe Error:", stripeError);
        setError(stripeError.message || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      if (!paymentMethod?.card || !paymentMethod?.id) {
        throw new Error("Failed to create payment method.");
      }

      const paymentData: TAddPaymentMethodInput = {
        StripePaymentMethodId: paymentMethod.id,
        IsDefault: isDefault,
        Brand: paymentMethod.card.brand,
        CardLast4: paymentMethod.card.last4,
        CardHolderName: formData.cardHolder,
        ExpiryMonth: paymentMethod.card.exp_month,
        ExpiryYear: paymentMethod.card.exp_year,
      };

      await onAdd(paymentData);

      onHide();
      setFormData({
        cardNumber: "",
        cardHolder: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
      });
      setIsDefault(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={overLayStyle}>
        <div>
          {/* Header */}
          <div
            className={modalHeader}
            style={{
              background: getCardColor(cardType),
            }}
          >
            <h2>Add Payment Method</h2>
            <button onClick={onHide}>
              <X size={20} />
            </button>
          </div>
          {/* Card Preview */}
          <div className={CardPreviewContainer}>
            <div
              style={{
                background: getCardColor(cardType),
              }}
            >
              <div>
                <CreditCard size={40} />
                <div>{cardType}</div>
              </div>

              <div className={cardNumberStyle}>
                <div className={cardNumberBulletsStyle}>
                  {formData.cardNumber || "•••• •••• •••• ••••"}
                </div>
              </div>

              <div className={CardholderStyle}>
                <div>
                  <div>Cardholder</div>
                  <div>{formData.cardHolder || "Full Name"}</div>
                </div>
                <div>
                  <div>Expires</div>
                  <div>
                    {formData.expiryMonth && formData.expiryYear
                      ? `${formData.expiryMonth}/${formData.expiryYear}`
                      : "MM/YY"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          {/* 
            Used only for the live card preview UI.

            Actual card details are securely collected by Stripe CardElement.
            Only the cardholder name is used when creating the PaymentMethod.
          */}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <h6 className="fw-bold mb-1">Card Preview (Visual Only)</h6>
              <p className="text-muted small mb-0">
                This section is for display purposes only.
                <br /> Real card details are securely collected by Stripe below.
              </p>
            </div>

            {/* Card Number */}
            <div className={CardNumberContainer}>
              <label>
                Card Number <small>(Preview)</small>
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setFormData({ ...formData, cardNumber: formatted });
                  setCardType(getCardType(formatted));
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            {/* Card Holder */}
            <div className={CardHolderContainer}>
              <label>
                Cardholder Name <small>(Required)</small>
              </label>
              <input
                type="text"
                value={formData.cardHolder}
                onChange={(e) =>
                  setFormData({ ...formData, cardHolder: e.target.value })
                }
                placeholder="Name as shown on card"
                className={CardholderName}
              />
            </div>

            {/* Expiry & CVV */}
            <div className={ExpiryContainer}>
              <div>
                <label>
                  Month <small>(Preview)</small>
                </label>
                <select
                  value={formData.expiryMonth}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryMonth: e.target.value })
                  }
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={String(m).padStart(2, "0")}>
                      {String(m).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>
                  Year <small>(Preview)</small>
                </label>
                <select
                  value={formData.expiryYear}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryYear: e.target.value })
                  }
                >
                  <option value="">YY</option>
                  {Array.from({ length: 10 }, (_, i) => 25 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>
                  Security Code <small>(Preview)</small>
                </label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>

            {/* Stripe Card Element */}
            <div className={CardDetailsStyle}>
              <label className="mb-0">Secure Payment Details (Stripe)</label>
              <p className="text-muted small mb-2 ms-1 ">
                Your real card information is handled securely by Stripe.
              </p>
              <div>
                <CardElement
                  options={{
                    hidePostalCode: true,
                  }}
                />
              </div>
            </div>

            {/* Default Checkbox */}
            <div className={DefaultCheckbox}>
              <label style={{ alignItems: "flex-end" }}>
                <input
                  style={{ width: "20px" }}
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
            {error && <div className={errorStyle}>{error}</div>}

            {/* Security Notice */}
            <div className={SecurityContainer}>
              <Lock size={20} />
              <div>
                <strong>100% Secure</strong> — Your payment information is
                protected with SSL encryption. We never store your CVV.
              </div>
            </div>

            {/* Buttons */}
            <div className={btns}>
              <button
                type="submit"
                disabled={loading || !stripe}
                style={{
                  background: getCardColor(cardType),
                }}
              >
                <CheckCircle size={20} />
                {loading ? "Adding..." : "Add Card"}
              </button>
              <button type="button" onClick={onHide}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsModal;
