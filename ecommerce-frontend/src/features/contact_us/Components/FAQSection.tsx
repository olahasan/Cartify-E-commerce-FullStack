import illustrationWoman from "@assets/contactUs/illustration-woman-online-desktop.svg";
import IconArrowDown from "@assets/contactUs/icon-arrow-down.svg";
import styles from "../FAQSection.module.css";
import { useState } from "react";
import BackToTop from "@shared/BackToTop/BackToTop";
const {
  title,
  main,
  container,
  photo_box,
  image,
  q_box,
  heading,
  qa_box,
  q,
  rotate,
  a,
  hide,
} = styles;
const FAQSection = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const toggleQuestion = (index: number) => {
    setOpenQuestion((prev) => (prev === index ? null : index));
  };
  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "After your order is shipped, you'll receive an email with a tracking number so you can follow its delivery status.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept Visa, Mastercard, and other secure payment methods through our encrypted checkout process.",
    },
    {
      question: "Can I return or exchange a product?",
      answer:
        "Yes. Eligible products can be returned or exchanged within our return period if they meet the return policy.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Delivery times depend on your location, but most orders arrive within a few business days after shipping.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach our support team anytime through the Contact Us page, and we'll respond as quickly as possible.",
    },
  ];
  return (
    <>
      <div className={title}>Frequently Asked Questions</div>
      <div className={main}>
        <div className={container}>
          <div className={photo_box}>
            <div className={image}>
              <img
                loading="lazy"
                src={illustrationWoman}
                alt="illustration-woman"
              />
            </div>
          </div>

          <div className={q_box}>
            <div className={heading}>
              <h2>FAQ</h2>
            </div>

            <div className={qa_box}>
              {faqs.map((faq, index) => (
                <div key={index}>
                  <button
                    type="button"
                    className={q}
                    onClick={() => {
                      toggleQuestion(index);
                    }}
                    aria-expanded={openQuestion === index}
                    aria-controls={`faq-${index}`}
                  >
                    <h4>{faq.question}</h4>

                    <img
                      className={openQuestion === index ? rotate : ""}
                      loading="lazy"
                      src={IconArrowDown}
                      alt=""
                    />
                  </button>

                  <div
                    id={`faq-${index}`}
                    className={`${a} ${openQuestion === index ? "" : hide}`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                  {index < faqs.length - 1 && <hr />}
                </div>
              ))}
            </div>
          </div>
        </div>
        <BackToTop />
      </div>
    </>
  );
};

export default FAQSection;
