import { formatCurrency } from "@shared/utils/formatCurrency";
import styles from "../cart.module.css";
import { useAppSelector } from "@app/hooks";
import { selectCartTotal } from "@cart/cartSlice";

const CartSubtotalPrice = () => {
  const total = useAppSelector(selectCartTotal);

  return (
    <>
      {total > 0 && (
        <div className={styles.container}>
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      )}
    </>
  );
};

export default CartSubtotalPrice;
