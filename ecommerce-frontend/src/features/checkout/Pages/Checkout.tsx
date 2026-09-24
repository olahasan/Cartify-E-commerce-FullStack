import { useAppDispatch, useAppSelector } from "@app/hooks";
import styles from "../checkout.module.css";
import { useEffect, useMemo, useState } from "react";
import { GetUserCheckoutThunk } from "@checkout/checkoutSlice";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import {
  CheckoutSchema,
  type CheckoutSchemaType,
} from "@checkout/validations/CheckoutSchema";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { clearPromo } from "@promo/promoSlice";
import {
  createOrderAPI,
  type TCreateOrderRequest,
} from "@checkout/checkoutAPI";
import { useNavigate } from "react-router-dom";
import { ClearCart } from "@cart/cartSlice";
import BackToTop from "@shared/BackToTop/BackToTop";
import AddressSection from "@checkout/Components/AddressSection";
import ContactSection from "@checkout/Components/ContactSection";
import PromoCode from "@checkout/Components/PromoCode";
import OrderSummary from "@checkout/Components/OrderSummary";
import PaymentSection from "@checkout/Components/PaymentSection";
import type { StripeCardElement } from "@stripe/stripe-js";
import { extractCountryCode, extractPhone } from "@shared/utils/phone";
import { COUNTRIES } from "@shared/constants/countries";

const { checkoutWrap } = styles;

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const { productsFullInfo, items } = useAppSelector((state) => state.cart);
  const { CheckoutRes } = useAppSelector((state) => state.checkout);
  const { promoRes } = useAppSelector((state) => state.promo);
  const [isPersonalInfoEditing, setIsPersonalInfoEditing] = useState(false);
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useForm<CheckoutSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryCode: "",
      defaultAddress: {
        addressType: "",
        streetAddress: "",
        city: "",
        state: null,
        postalCode: null,
        country: "Egypt",
        isDefault: false,
      },
      defaultPaymentMethod: {
        cardHolderName: "",
      },
    },
  });

  const onSubmit: SubmitHandler<CheckoutSchemaType> = async (data) => {
    const orderPayload: TCreateOrderRequest = {
      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: `${data.countryCode}${data.phone}`,
      },
      address: {
        addressType: data.defaultAddress.addressType,
        streetAddress: data.defaultAddress.streetAddress,
        city: data.defaultAddress.city,
        state: data.defaultAddress.state ?? null,
        postalCode: data.defaultAddress.postalCode ?? null,
        country: data.defaultAddress.country,
      },
      orderAddress: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: `${data.countryCode}${data.phone}`,
        streetAddress: data.defaultAddress.streetAddress,
        city: data.defaultAddress.city,
        state: data.defaultAddress.state ?? null,
        postalCode: data.defaultAddress.postalCode ?? null,
        country: data.defaultAddress.country,
      },
      payment: {
        paymentMethodId: "",
        paymentBrand: cardBrand,
        paymentLast4: null,
      },
      items: productsFullInfo.map((product) => ({
        productId: product.productID,
        quantity: items[product.productID],
      })),
      promoCode: promoRes?.isValid ? promoCode : null,
    };

    try {
      setIsAddressEditing(false);
      setIsPersonalInfoEditing(false);
      setIsSubmitting(true);
      setError(null);
      const response = await createOrderAPI(orderPayload);
      const { clientSecret } = response.data;
      const cardElement = elements?.getElement(
        CardElement,
      ) as StripeCardElement | null;
      if (!stripe || !cardElement) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: data.defaultPaymentMethod?.cardHolderName,
          },
        },
      });

      if (result.error) {
        setError(result.error.message ?? "Payment failed");
        return;
      }
      dispatch(ClearCart());
      navigate("/order-success", {
        state: {
          orderNumber: response.data.orderNumber,
          grandTotal: grandTotal,
          finalAmount: response.data.finalAmount,
          shipping: response.data.shipping,
          tax: response.data.tax,
          subtotal: response.data.subtotal,
          discount: response.data.discount,
          items: productsFullInfo.map((product) => ({
            productId: product.productID,
            productName: product.productName,
            quantity: items[product.productID],
            price: product.price,
          })),
          address: orderPayload.orderAddress,
          promoCode: orderPayload.promoCode,
        },
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (section: "personal" | "address") => {
    const currentValues = getValues();

    if (section === "personal") {
      reset({
        ...currentValues,
        firstName: CheckoutRes?.firstName,
        lastName: CheckoutRes?.lastName,
        email: CheckoutRes?.email,
        phone: extractPhone(CheckoutRes?.phone),
        countryCode: extractCountryCode(CheckoutRes?.phone),
      });
    }
    if (section === "address") {
      reset({
        ...currentValues,
        defaultAddress: {
          addressType: CheckoutRes?.defaultAddress?.addressType ?? "",
          streetAddress: CheckoutRes?.defaultAddress?.streetAddress ?? "",
          city: CheckoutRes?.defaultAddress?.city ?? "",
          state: CheckoutRes?.defaultAddress?.state ?? null,
          postalCode: CheckoutRes?.defaultAddress?.postalCode ?? null,
          country: CheckoutRes?.defaultAddress?.country ?? "Egypt",
          isDefault: CheckoutRes?.defaultAddress?.isDefault ?? false,
        },
      });
    }
  };

  const total = useMemo(() => {
    return productsFullInfo.reduce((sum, product) => {
      const qty = items[product.productID] || 0;
      return sum + product.price * qty;
    }, 0);
  }, [productsFullInfo, items]);

  const round = (num: number) => Math.round(num * 100) / 100;
  const shipping = total < 1000 ? 50 : 0;
  const tax = round(total * 0.14);
  const grandTotal = round(total + shipping + tax);
  const finalTotal = promoRes?.isValid
    ? round(grandTotal - promoRes.discountAmount)
    : grandTotal;

  useEffect(() => {
    dispatch(GetUserCheckoutThunk());
  }, [dispatch]);

  useEffect(() => {
    if (CheckoutRes) {
      reset({
        firstName: CheckoutRes.firstName,
        lastName: CheckoutRes.lastName,
        email: CheckoutRes.email,
        phone: extractPhone(CheckoutRes.phone),
        countryCode: extractCountryCode(CheckoutRes.phone),

        defaultAddress: {
          addressType: CheckoutRes.defaultAddress?.addressType ?? "",
          streetAddress: CheckoutRes.defaultAddress?.streetAddress ?? "",
          city: CheckoutRes.defaultAddress?.city ?? "",
          state: CheckoutRes.defaultAddress?.state ?? null,
          postalCode: CheckoutRes.defaultAddress?.postalCode ?? null,
          country: CheckoutRes.defaultAddress?.country ?? "Egypt",
          isDefault: CheckoutRes.defaultAddress?.isDefault ?? false,
        },
      });
    }
  }, [CheckoutRes, reset]);

  useEffect(() => {
    dispatch(clearPromo());
  }, [dispatch, total]);

  return (
    <div>
      <h1>Checkout</h1>
      {/* <!-- MAIN --> */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className={checkoutWrap}>
          {/* <!-- LEFT COL --> */}
          <div className="left-col">
            {/* <!-- Contact --> */}
            <ContactSection
              isPersonalInfoEditing={isPersonalInfoEditing}
              setIsPersonalInfoEditing={setIsPersonalInfoEditing}
              watch={watch}
              trigger={trigger}
              register={register}
              errors={errors}
              handleCancel={handleCancel}
            />

            {/* <!-- Shipping --> */}
            <AddressSection
              isAddressEditing={isAddressEditing}
              setIsAddressEditing={setIsAddressEditing}
              watch={watch}
              trigger={trigger}
              register={register}
              errors={errors}
              COUNTRIES={COUNTRIES} //redline:
              handleCancel={handleCancel}
            />

            {/* <!-- Payment --> */}
            <PaymentSection
              watch={watch}
              register={register}
              errors={errors}
              cardBrand={cardBrand}
              setCardBrand={setCardBrand}
              isDefault={isDefault}
              setIsDefault={setIsDefault}
              error={error}
            />
          </div>

          {/* <!-- RIGHT COL --> */}
          <div className="right-col">
            {/* <!-- Promo --> */}
            <PromoCode
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              total={total}
            />

            {/* <!-- Order Summary --> */}
            <OrderSummary
              isSubmitting={isSubmitting}
              error={error}
              total={total}
              shipping={shipping}
              tax={tax}
              grandTotal={grandTotal}
              finalTotal={finalTotal}
            />
          </div>
        </div>
      </Form>
      <BackToTop />
    </div>
  );
};
export default Checkout;
