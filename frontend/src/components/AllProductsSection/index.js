import { Component } from "react";

import FiltersGroup from "../FiltersGroup";
import ProductCard from "../ProductCard";
import ProductsHeader from "../ProductsHeader";

import "./index.css";

const categoryOptions = [
  { name: "Clothing", categoryId: "Clothing" },
  { name: "Electronics", categoryId: "Electronics" },
  { name: "Appliances", categoryId: "Appliances" },
  { name: "Grocery", categoryId: "Grocery" },
  { name: "Toys", categoryId: "Toys" },
];

const sortbyOptions = [
  { optionId: "PRICE_HIGH", displayText: "Price (High-Low)" },
  { optionId: "PRICE_LOW", displayText: "Price (Low-High)" },
];

const ratingsList = [
  {
    ratingId: "4",
    imageUrl:
      "https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png",
  },
  {
    ratingId: "3",
    imageUrl:
      "https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png",
  },
  {
    ratingId: "2",
    imageUrl:
      "https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png",
  },
  {
    ratingId: "1",
    imageUrl:
      "https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png",
  },
];

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.initial,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: "",
    searchInput: "",
    activeRatingId: "",
  };

  componentDidMount() {
    this.getProducts();
  }

  getProducts = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress });

    const { activeOptionId, activeCategoryId, searchInput, activeRatingId } =
      this.state;

    const apiUrl = `https://nxttrendz-backend-akau.onrender.com/api/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`;
    console.log("🚀 Fetching:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      const fetchedData = await response.json();

      if (response.ok) {
        console.log("✅ Fetched Data:", fetchedData);

        const updatedData = fetchedData.products.map((product) => ({
          id: product.id,
          title: product.title,
          brand: product.brand,
          price: product.price,
          imageUrl: product.imageUrl,
          rating: product.rating,
        }));

        this.setState({
          productsList: updatedData,
          apiStatus: apiStatusConstants.success,
        });
      } else {
        console.error("❌ Backend Error:", fetchedData);
        this.setState({ apiStatus: apiStatusConstants.failure });
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  changeSortby = (activeOptionId) => {
    this.setState({ activeOptionId }, this.getProducts);
  };

  changeCategory = (activeCategoryId) => {
    this.setState({ activeCategoryId }, this.getProducts);
  };

  changeRating = (activeRatingId) => {
    this.setState({ activeRatingId }, this.getProducts);
  };

  changeSearchInput = (searchInput) => {
    this.setState({ searchInput });
  };

  enterSearchInput = () => {
    this.getProducts();
  };

  clearFilters = () => {
    this.setState(
      {
        searchInput: "",
        activeCategoryId: "",
        activeRatingId: "",
      },
      this.getProducts
    );
  };

  renderLoadingView = () => (
    <div className="products-loader-container">
      <p>Loading...</p>
    </div>
  );

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  );

  renderProductsListView = () => {
    const { productsList, activeOptionId } = this.state;
    const shouldShowProductsList = productsList.length > 0;

    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map((product) => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-description">Try other filters.</p>
      </div>
    );
  };

  renderAllProducts = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  render() {
    const { activeCategoryId, searchInput, activeRatingId } = this.state;

    return (
      <div className="all-products-section">
        <FiltersGroup
          searchInput={searchInput}
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          changeSearchInput={this.changeSearchInput}
          enterSearchInput={this.enterSearchInput}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          changeCategory={this.changeCategory}
          changeRating={this.changeRating}
          clearFilters={this.clearFilters}
        />
        {this.renderAllProducts()}
      </div>
    );
  }
}

export default AllProductsSection;
