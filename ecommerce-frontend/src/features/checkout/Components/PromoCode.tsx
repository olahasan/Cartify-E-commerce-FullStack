const {
  sectionTitle,
  line,
  card,
  promoWrap,
  promoField,
  field,
  btnApply,
  promoMsgGreen,
  promoMsgRed,
} = styles;
import { Spinner } from "react-bootstrap";
import styles from "../checkout.module.css";
import { validatePromoCodeThunk } from "@promo/promoSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";

interface PromoCodeProps {
  promoCode: string;
  setPromoCode: React.Dispatch<React.SetStateAction<string>>;
  total: number;
}

const PromoCode = ({ promoCode, setPromoCode, total }: PromoCodeProps) => {
  const dispatch = useAppDispatch();
  const { promoRes, loading } = useAppSelector((state) => state.promo);

  const applyPromo = () => {
    if (!promoCode.trim() || loading === "pending") return;
    dispatch(
      validatePromoCodeThunk({
        code: promoCode.trim(),
        orderTotal: total,
      }),
    );
  };
  return (
    <>
      <div className={card}>
        <div className={sectionTitle}>
          Promo Code <span className={line}></span>
        </div>
        <div className={promoWrap}>
          <div className={`${field} ${promoField}`}>
            <input
              type="text"
              placeholder="LUXORA20"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
          </div>
          <button
            type="button"
            className={btnApply}
            onClick={applyPromo}
            disabled={loading === "pending" || !promoCode.trim()}
          >
            {loading === "pending" ? (
              <>
                <Spinner animation="border" size="sm"></Spinner>Applying...
              </>
            ) : (
              "Apply"
            )}
          </button>
        </div>
        <div
          className={
            promoRes ? (promoRes.isValid ? promoMsgGreen : promoMsgRed) : ""
          }
        >
          {promoCode.trim() && promoRes?.message && (
            <>
              {promoRes.message}
              {promoRes.isValid && " ✓"}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PromoCode;
