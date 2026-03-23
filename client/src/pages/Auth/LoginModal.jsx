import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setShowLoginModalFalse } from "../../slices/userSlice";
import { Login } from "./Login";
import { IoMdClose } from "react-icons/io";

const LoginModal = ({ isOpen, onClose, setToggleAuth }) => {
  const location = useLocation();
  const dispatch = useDispatch();

 
  useEffect(() => {
    if (location.pathname === "/login") {
      dispatch(setShowLoginModalFalse());
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  //safe to return
  if (!isOpen || location.pathname === "/login") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <IoMdClose />
        </button>

        <div className="flex justify-center items-center px-6 py-12">
          <div className="w-full max-w-lg">
            <Login
              setToggleAuth={setToggleAuth}
              handleOnClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;