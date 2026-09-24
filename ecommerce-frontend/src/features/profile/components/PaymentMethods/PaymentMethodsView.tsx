import { CreditCard, Plus, Trash2 } from "lucide-react";
import styles from "../../Profile.module.css";
import type {
  TAddPaymentMethodInput,
  TPaymentMethodsData,
} from "@profile/ProfileAPI";
import PaymentMethodsModal from "./PaymentMethodsModal";
import LottieHandler from "@shared/LottieHandler/LottieHandler";
import BackToTop from "@shared/BackToTop/BackToTop";

const {
  mainAddrBox,
  myOrders,
  myOrdersParagraph,
  subMainAddrBox,
  cardStyle,
  myOrdersContainer,
  cardHighlight,
  cardContainer,
  cardHeader,
  cardBrandContainer,
  cardBrandStyle,
  Badges,
  defaultBadge,
  TrashBadge,
  last4Numbers,
  CardholderContainer,
  CardholderStyle,
  ExpiresContainer,
  ExpiresStyle,
  emptyCardContainer,
  CreditCardStyle,
} = styles;

const getCardColor = (type: string) => {
  const colors: Record<string, string> = {
    Visa: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    Mastercard: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
    "American Express": "linear-gradient(135deg, #006fcf 0%, #2e77bb 100%)",
    Card: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };
  return colors[type] || colors.Card;
};

interface PaymentMethodsViewProps {
  userPaymentMethods: TPaymentMethodsData[];
  loading: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: (id: number) => void;
  onAdd: (data: TAddPaymentMethodInput) => void;
}

const PaymentMethodsView = ({
  userPaymentMethods,
  loading,
  showModal,
  setShowModal,
  onDelete,
  onAdd,
}: PaymentMethodsViewProps) => {
  if (loading === "pending") return <LottieHandler type="loading" />;

  return (
    <>
      <div className={`card shadow-sm p-4 mb-4 ${mainAddrBox}`}>
        <div className={myOrdersContainer}>
          <div>
            <h2 className={myOrders}>Payment Methods</h2>
            <p className={myOrdersParagraph}>
              Manage your saved payment methods
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Add Card
            <Plus size={20} />
          </button>
        </div>
      </div>
      <div className={`card shadow-sm p-4 mb-4 ${mainAddrBox}`}>
        <div className={subMainAddrBox}>
          {userPaymentMethods.map((card) => (
            <div
              className={cardStyle}
              key={card.paymentMethodID}
              style={{
                background: getCardColor(card.brand),
              }}
            >
              <div className={cardHighlight} />

              <div className={cardContainer}>
                <div className={cardHeader}>
                  <div className={cardBrandContainer}>
                    <CreditCard size={32} />
                    <span className={cardBrandStyle}>{card.brand}</span>
                  </div>

                  <div className={Badges}>
                    {card.isDefault && (
                      <span className={defaultBadge}>Default</span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(card.paymentMethodID);
                      }}
                      className={TrashBadge}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className={last4Numbers}>•••• •••• •••• {card.last4}</div>

                <div className={CardholderContainer}>
                  <div>
                    <div className={CardholderStyle}>Cardholder</div>

                    <div>{card.cardHolderName || "Not available"}</div>
                  </div>
                  <div className={ExpiresContainer}>
                    <div className={ExpiresStyle}>Expires</div>
                    <div>
                      {card.expMonth}/{card.expYear}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {userPaymentMethods.length === 0 && (
          <div className={emptyCardContainer}>
            <CreditCard size={64} className={CreditCardStyle} />
            <h3>No payment methods yet</h3>
            <p>Add a payment method to make checkout faster and easier.</p>
            <button
              type="button"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Add Payment Method
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <PaymentMethodsModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onAdd={onAdd}
        />
      )}

      <BackToTop />
    </>
  );
};

export default PaymentMethodsView;
