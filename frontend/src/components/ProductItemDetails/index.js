// ProductItemDetails.js
import { Component } from "react";
import { Link } from "react-router-dom";
import { BsPlusSquare, BsDashSquare } from "react-icons/bs";

import CartContext from "../../context/CartContext";
import Header from "../Header";
import SimilarProductItem from "../SimilarProductItem";

import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  };

  componentDidMount() {
    this.getProductData();
  }

  getProductData = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress });

    const { match } = this.props;
    const { id } = match.params;

    try {
      const response = await fetch(
        `https://nxttrendz-backend-akau.onrender.com/api/products/${id}`
      );
      if (response.ok) {
        const data = await response.json();

        this.setState({
          productData: data.product,
          similarProductsData: data.similar_products || [],
          apiStatus: apiStatusConstants.success,
        });
      } else {
        this.setState({ apiStatus: apiStatusConstants.failure });
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  renderLoadingView = () => (
    <div className="products-details-loader-container">
      <p>Loading...</p>
    </div>
  );

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  );

  onDecrementQuantity = () => {
    const { quantity } = this.state;
    if (quantity > 1) {
      this.setState((prevState) => ({ quantity: prevState.quantity - 1 }));
    }
  };

  onIncrementQuantity = () => {
    this.setState((prevState) => ({ quantity: prevState.quantity + 1 }));
  };

  renderProductDetailsView = () => (
    <CartContext.Consumer>
      {(value) => {
        const { productData, quantity, similarProductsData } = this.state;
        const {
          availability,
          brand,
          description,
          imageUrl,
          price,
          rating,
          title,
          totalReviews,
        } = productData;
        const { addCartItem } = value;
        const onClickAddToCart = () => {
          addCartItem({ ...productData, quantity });
        };

        return (
          <div className="product-details-success-view">
            <div className="product-details-container">
              <img src={imageUrl} alt="product" className="product-image" />
              <div className="product">
                <h1 className="product-name">{title}</h1>
                <p className="price-details">Rs {price}/-</p>
                <div className="rating-and-reviews-count">
                  <div className="rating-container">
                    <p className="rating">{rating}</p>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      alt="star"
                      className="star"
                    />
                  </div>
                  <p className="reviews-count">{totalReviews} Reviews</p>
                </div>
                <p className="product-description">{description}</p>
                <div className="label-value-container">
                  <p className="label">Available:</p>
                  <p className="value">{availability}</p>
                </div>
                <div className="label-value-container">
                  <p className="label">Brand:</p>
                  <p className="value">{brand}</p>
                </div>
                <hr className="horizontal-line" />
                <div className="quantity-container">
                  <button
                    type="button"
                    className="quantity-controller-button"
                    onClick={this.onDecrementQuantity}
                    data-testid="minus"
                  >
                    <BsDashSquare className="quantity-controller-icon" />
                  </button>
                  <p className="quantity">{quantity}</p>
                  <button
                    type="button"
                    className="quantity-controller-button"
                    onClick={this.onIncrementQuantity}
                    data-testid="plus"
                  >
                    <BsPlusSquare className="quantity-controller-icon" />
                  </button>
                </div>
                <button
                  type="button"
                  className="button add-to-cart-btn"
                  onClick={onClickAddToCart}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
            <h1 className="similar-products-heading">Similar Products</h1>
            <ul className="similar-products-list">
              {similarProductsData.map((eachSimilarProduct) => (
                <SimilarProductItem
                  productDetails={eachSimilarProduct}
                  key={eachSimilarProduct.id}
                />
              ))}
            </ul>
          </div>
        );
      }}
    </CartContext.Consumer>
  );

  renderProductDetails = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    );
  }
}

export default ProductItemDetails;
