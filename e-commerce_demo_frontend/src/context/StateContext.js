import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [qty, setQty] = useState(1);
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem('cartItems') !== null ? JSON.parse(localStorage.getItem('cartItems')) : []
  });
  const [totalPrice, setTotalPrice] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem('totalPrice') !== null ? JSON.parse(localStorage.getItem('totalPrice')) : 0
  });
  const [totalQuantities, setTotalQuantities] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem('totalQuantities') !== null ? JSON.parse(localStorage.getItem('totalQuantities')) : 0
  });

  let foundProduct;
  let productIndex;

  useEffect(() => {
    if (typeof window !== "undefined") {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
        localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities))
    }
  }, [cartItems, totalPrice, totalQuantities]);

  const sortItems = (items) => {
    items.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    return items;
  }

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id);

    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
    if(checkProductInCart) {

      let updatedCartItems = cartItems.map((cartProduct) => {
        if(cartProduct._id === product._id) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity
          }
        } else {
          return {...cartProduct}
        }
      })
      updatedCartItems = sortItems(updatedCartItems);
      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      const newCartItems = [...cartItems, { ...product }];
      const sortedItems = sortItems(newCartItems);
      setCartItems(sortedItems);
    }
    toast.success(`${qty} ${product.name} added to the cart.`);
  }

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
    setCartItems(newCartItems);
  }

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    productIndex = cartItems.findIndex((product) => product._id === id);
    let newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === 'inc') {
      newCartItems = [...newCartItems, {...foundProduct, quantity: foundProduct.quantity + 1 }];
      newCartItems = sortItems(newCartItems);
      setCartItems(newCartItems);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === 'dec' && foundProduct.quantity > 1) {
      newCartItems = [...newCartItems, {...foundProduct, quantity: foundProduct.quantity - 1 }];
      newCartItems = sortItems(newCartItems);
      setCartItems(newCartItems);
      setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
    }
  }

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  }

  const decQty = () => {
    setQty((prevQty) => {
      if(prevQty - 1 < 1) return 1;
      return prevQty - 1;
    })
  }

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        setCartItems,
        cartItems,
        totalPrice,
        setTotalPrice,
        totalQuantities,
        setTotalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context);
