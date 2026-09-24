import styles from "../FormSection.module.css";
const { input, send } = styles;
import Input from "./ContactInput";
import {
  contactSchema,
  type contactType,
} from "@contact_us/validations/contactSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form } from "react-bootstrap";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import TextArea from "./TextArea";
import { useState } from "react";

const ContactUsForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<contactType>({
    mode: "onBlur",
    resolver: zodResolver(contactSchema),
  });

  const submitForm: SubmitHandler<contactType> = async () => {
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success(
        "✔ Message sent successfully. We'll get back to you as soon as possible.",
      );
      reset({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailOnBlurHandler = async () => {
    await trigger("email");
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(submitForm)}>
        <Input
          className={input}
          placeholder="Your Name"
          name="name"
          register={register}
          error={errors.name?.message}
        />

        <Input
          className={input}
          placeholder="Your Email Address"
          name="email"
          register={register}
          onBlur={emailOnBlurHandler}
          error={errors.email?.message}
        />

        <Input
          className={input}
          placeholder="Your Phone"
          type="tel"
          name="phone"
          register={register}
          error={errors.phone?.message}
        />
        <TextArea
          className={input}
          name="message"
          placeholder="How can we help you?"
          register={register}
          error={errors.message?.message}
        />

        <Button
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={`${input} ${send} mb-5`}
          variant="info"
          type="submit"
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Sending Message...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default ContactUsForm;
