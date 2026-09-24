import StatsMain from "@assets/aboutUs/image-header-desktop.jpg";
import styles from "../StatsSection.module.css";
const { title, sectionDesc, bigBox, box1, num, box2, image } = styles;
const StatsSection = () => {
  const stats = [
    { value: "10k+", label: "Happy Customers" },
    { value: "500+", label: "Products Available" },
    { value: "99%", label: "Customer Satisfaction" },
  ];
  return (
    <>
      <div className={title}>Why Choose Cartify?</div>
      <p className={sectionDesc}>
        Numbers that reflect our commitment to quality and customer
        satisfaction.
      </p>
      <div className={bigBox}>
        <div className={box1}>
          <h2>
            Delivering <span>quality</span> for every customer.
          </h2>
          <p>
            At Cartify, we focus on providing a smooth shopping experience with
            trusted products, secure payments, and customer-first service.
          </p>
          <ul>
            {stats.map((item) => (
              <li key={item.label}>
                <span className={num}>{item.value}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={box2}>
          <div className={image}>
            <img loading="lazy" src={StatsMain} alt="our team pic" />
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsSection;
