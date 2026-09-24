import { useEffect } from "react";
import styles from "./Blog.module.css";
const { title, sectionDesc, bigBox, box1, icon1, box2, icon2, box3, icon3 } =
  styles;
const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  type BlogCard = {
    icon: string;
    title: string;
    text: string;
    style: string;
  };
  const blogs: BlogCard[] = [
    {
      icon: `${icon1} fa-brands fa-opencart fa-2xl`,
      title: "Shopping Tips",
      text: "Discover practical shopping tips that help you save money, compare products, and make smarter buying decisions every time you shop online.",
      style: box1,
    },
    {
      icon: `${icon2} fa-solid fa-signs-post fa-2xl`,
      title: "Product Guides",
      text: "Learn how to choose the right products by comparing features, prices, and customer reviews before placing your next order.",
      style: box2,
    },
    {
      icon: `${icon3} fa-solid fa-arrow-trend-up fa-2xl`,
      title: "Online Shopping",
      text: "Explore the latest trends in online shopping and see how secure payments, fast delivery, and convenience are changing retail.",
      style: box3,
    },
  ];
  return (
    <>
      <div>
        <h2 className={title}>Our Blog</h2>
        <p className={sectionDesc}>
          Shopping guides, product tips, and the latest e-commerce insights.
        </p>
      </div>
      <div className={bigBox}>
        {blogs.map((blog, index) => (
          <div key={index} className={blog.style}>
            <i className={`${blog.icon}`}></i>
            <h2>{blog.title}</h2>
            <p>{blog.text}</p>
            <button>
              Read More <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Blog;
