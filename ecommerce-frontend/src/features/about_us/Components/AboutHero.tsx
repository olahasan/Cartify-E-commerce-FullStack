import aboutmain from "@assets/aboutUs/about-main.jpg";
import Member1 from "@assets/aboutUs/about-01.jpg";
import Member2 from "@assets/aboutUs/about-02.jpg";
import Member3 from "@assets/aboutUs/about-03.jpg";
import Member4 from "@assets/aboutUs/about-04.jpg";
import styles from "../AboutHero.module.css";
const { about, container, titleTry, sec1, photos, sec2, box } = styles;
const AboutHero = () => {
  return (
    <div className={about} id="AAbout">
      <div className={container}>
        <div>
          <h2 className={titleTry}>About Us</h2>
        </div>

        <div className={sec1}>
          <div className={photos}>
            <img src={aboutmain} alt="team pic" />
          </div>
          <p>
            <span> Cartify</span> is dedicated to delivering a seamless shopping
            experience through quality products, secure payments, and excellent
            customer support.
            <p>
              We believe that online shopping should be simple, secure, and
              enjoyable. Our goal is to provide customers with high-quality
              products, fast service, and a platform designed to make every
              purchase smooth and convenient.
            </p>
          </p>
        </div>
        <div className={sec2}>
          <div className={box}>
            <img src={Member1} alt="About_Us Member-1 pic" />
            <h2>Jennifer Soft</h2>
            <span>Founder & CEO </span>
            <ul>
              <li>
                <i className="fa-brands fa-square-instagram"></i>
              </li>
              <li>
                <i className="fa-brands fa-square-facebook"></i>
              </li>
              <li>
                <i className="fa-brands fa-square-youtube"></i>
              </li>
              <li>
                <i className="fa-brands fa-square-twitter"></i>
              </li>
            </ul>
            <p>
              Jennifer leads Cartify with a vision focused on innovation and
              customer satisfaction. She works to ensure that every shopping
              experience is simple, secure, and enjoyable for our growing
              community.
            </p>
          </div>
          <div className={box}>
            <div>
              <img src={Member2} alt="About_Us Member-2 pic" />
            </div>
            <div>
              <h2>Daisy Walker</h2>
              <span>Marketing Manager</span>
              <ul>
                <li>
                  <i className="fa-brands fa-square-instagram"></i>
                </li>
                <li>
                  <i className="fa-brands fa-square-facebook"></i>
                </li>
              </ul>
              <p>
                Daisy develops creative marketing strategies that help Cartify
                reach more customers. Her goal is to build trust and create
                meaningful connections with shoppers around the world.
              </p>
            </div>
          </div>
          <div className={box}>
            <div>
              <img src={Member3} alt="About_Us Member-3 pic" />
            </div>
            <div>
              <h2>Florence Nelson</h2>
              <span>Customer Success Manager</span>
              <ul>
                <li>
                  <i className="fa-brands fa-square-instagram"></i>
                </li>
                <li>
                  <i className="fa-brands fa-square-facebook"></i>
                </li>
                <li className="onlyOne"></li>
                <li>
                  <i className="fa-brands fa-square-twitter"></i>
                </li>
              </ul>
              <p>
                Florence is dedicated to providing excellent support and making
                sure every customer receives the assistance they need. She
                believes great service builds long-term relationships.
              </p>
            </div>
          </div>
          <div className={box}>
            <div>
              <img src={Member4} alt="About_Us Member-4 pic" />
            </div>
            <div>
              <h2>Valentina Martin</h2>
              <span>Product Manager</span>
              <ul>
                <li>
                  <i className="fa-brands fa-square-instagram"></i>
                </li>
                <li>
                  <i className="fa-brands fa-square-facebook"></i>
                </li>
                <li>
                  <i className="fa-brands fa-square-youtube"></i>
                </li>
              </ul>
              <p>
                Valentina oversees product quality and user experience across
                the platform. She focuses on delivering features that make
                online shopping easier and more convenient.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
