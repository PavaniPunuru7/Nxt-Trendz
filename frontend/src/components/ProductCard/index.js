import { Link } from "react-router-dom";
import "./index.css";

const ProductCard = (props) => {
  const { productData } = props;
  console.log("🔍 ProductCard - productData", productData); // 👀 Check this

  const { title, brand, imageUrl, rating, price, id } = productData;

  return (
    <li className="product-item">
      <Link to={`/products/${id}`} className="link-item">
        <img src={imageUrl} alt="product" className="thumbnail" />
        <h1 className="title">
          {typeof title === "object" ? "Invalid title" : title}
        </h1>
        <p className="brand">
          by {typeof brand === "object" ? "Invalid brand" : brand}
        </p>
        <div className="product-details">
          <p className="price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ProductCard;
