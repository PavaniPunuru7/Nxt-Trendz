import { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import Products from "./components/Products";
import ProductItemDetails from "./components/ProductItemDetails";
import Cart from "./components/Cart";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import CartContext from "./context/CartContext";

import "./App.css";

class App extends Component {
  state = {
    cartList: [],
  };

  addCartItem = (product) => {
    this.setState((prevState) => {
      const isProductAlreadyExists = prevState.cartList.find(
        (ele) => ele.id === product.id
      );

      if (isProductAlreadyExists) {
        return {
          cartList: prevState.cartList.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + product.quantity }
              : item
          ),
        };
      }

      return {
        cartList: [...prevState.cartList, product],
      };
    });
  };

  removeCartItem = (productId) => {
    this.setState((prevState) => ({
      cartList: prevState.cartList.filter((item) => item.id !== productId),
    }));
  };

  removeAllCartItems = () => {
    this.setState({ cartList: [] });
  };

  incrementCartItemQuantity = (productId) => {
    this.setState((prevState) => ({
      cartList: prevState.cartList.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  };

  decrementCartItemQuantity = (productId) => {
    this.setState((prevState) => ({
      cartList: prevState.cartList
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity >= 1),
    }));
  };

  render() {
    const { cartList } = this.state;

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUp />} />

          {/* ✅ Protected Routes Wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductItemDetails />} />
            <Route path="/cart" element={<Cart />} />
          </Route>

          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </CartContext.Provider>
    );
  }
}

export default App;
