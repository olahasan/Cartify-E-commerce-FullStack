import ContactUsForm from "@contact_us/Form/ContactUsForm";
import styles from "../FormSection.module.css";
const { contact, container, titleTry, all, pic, text, form, alll } = styles;

const FormSection = () => {
  return (
    <div className={contact}>
      <div className={container}>
        <h2 className={titleTry}>contact Us</h2>
      </div>
      <div className={all}>
        <div className={pic}>
          <div className={text}>
            <h2>Need Assistance?</h2>
            <p>
              Whether you have questions about your order, need help finding the
              right product, or require assistance with your account, our
              dedicated support team is ready to help. We strive to provide
              quick solutions and a smooth shopping experience for every
              customer.
            </p>
          </div>
        </div>
        <div className={form}>
          <div className={alll}>
            <h2>Send Us a Message</h2>
            <p>
              Have a question about an order, product, or your account? Fill out
              the form below and our team will get back to you as soon as
              possible.
            </p>
            <ContactUsForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSection;
