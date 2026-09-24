import colton from "@assets/aboutUs/image-colton.jpg";
import irene from "@assets/aboutUs/image-irene.jpg";
import anne from "@assets/aboutUs/image-anne.jpg";
import StarIcon from "@assets/aboutUs/icon-star.svg";
import styles from "../SocialProof.module.css";
const {
  title,
  sectionDesc,
  container,
  box1,
  box2,
  card,
  head,
  thetry,
  text,
  box3,
  box4,
} = styles;
const SocialProof = () => {
  const stars = Array.from({ length: 5 });
  return (
    <>
      <div>
        <h2 className={title}>What Our Customers Say</h2>
        <p className={sectionDesc}>
          Thousands of shoppers trust Cartify for quality products and reliable
          service.
        </p>
      </div>
      <div className={container}>
        <div className={box1}>
          <div className={box3}>
            <h2>10,000+ customers trust Cartify every day.</h2>
            <p>
              We provide quality products, secure payments, and dedicated
              customer support to ensure the best shopping experience possible.
            </p>
          </div>

          <div className={box4}>
            <ul>
              <li>
                {stars.map((_, index) => (
                  <img key={index} loading="lazy" src={StarIcon} alt="star" />
                ))}
                <p>Rated 5 Stars in Product Quality</p>
              </li>
              <li>
                {stars.map((_, index) => (
                  <img key={index} loading="lazy" src={StarIcon} alt="star" />
                ))}
                <p>Rated 5 Stars in Customer Service</p>
              </li>
              <li>
                {stars.map((_, index) => (
                  <img key={index} loading="lazy" src={StarIcon} alt="star" />
                ))}
                <p>Rated 5 Stars in Delivery</p>
              </li>
            </ul>
          </div>
        </div>

        <div className={box2}>
          <div className={card}>
            <div className={head}>
              <img loading="lazy" src={colton} alt="customer pic" />

              <div className={thetry}>
                <h4>Colton Smith</h4>
                <h6>Verified Buyer</h6>
              </div>
            </div>

            <div className={text}>
              <p>
                "We needed the same printed design as the one we had ordered a
                week prior. Not only did they find the original order, but we
                also received it in time. Excellent!"
              </p>
            </div>
          </div>

          <div className={card}>
            <div className={head}>
              <img loading="lazy" src={irene} alt="pic" />
              <div className={thetry}>
                <h4>Irene Roberts</h4>
                <h6>Verified Buyer</h6>
              </div>
            </div>

            <div className={text}>
              <p>
                "Customer service is always excellent and very quick turn
                around. Completely delighted with the simplicity of the purchase
                and the speed of delivery."
              </p>
            </div>
          </div>

          <div className={card}>
            <div className={head}>
              <img loading="lazy" src={anne} alt="pic" />
              <div className={thetry}>
                <h4>Anne Wallace</h4>
                <h6>Verified Buyer</h6>
              </div>
            </div>

            <div className={text}>
              <p>
                "Put an order with this company and can only praise them for the
                very high standard. Will definitely use them again and recommend
                them to everyone!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialProof;
