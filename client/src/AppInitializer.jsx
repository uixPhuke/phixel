// AppInitializer.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verify } from "./actions/userActions";
import { getWishlist } from "./actions/wishlistActions";
import { getCart } from "./actions/cartActions";

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verify());
    dispatch(getWishlist());
    dispatch(getCart());
  }, [dispatch]);

  return null; // no UI
};

export default AppInitializer;