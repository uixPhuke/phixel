import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/logoWhite.png";

const Footer = () => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.user);

  const login = () => {
    navigate("/login");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-secondary px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Signup Section */}
          {!isLogin && (
            <div className="col-span-2 lg:col-span-2 bg-accent text-primary text-center p-6 rounded-lg flex items-center justify-center">
              <div>
                <h2 className=" sm:text-base lg:text-md text-xs font-bold mb-3">
                  JOIN UiX AND GET 15% OFF
                </h2>

                <button
                  onClick={login}
                  className="bg-primary text-secondary py-2 px-4 rounded-md hover:opacity-90 transition"
                >
                  SIGN UP FOR FREE
                </button>
              </div>
            </div>
          )}

          {/* Products */}
          <div>
            <h3 className="font-bold text-xs mb-3">PRODUCTS</h3>
            <ul className="space-y-2 text-accent text-xxs">
              <li>T Shirt</li>
              <li>Shorts</li>
              <li>Accessories</li>
              <li>New Arrivals</li>
              <li>Special Offer</li>
              <li>Flat 50% Off!</li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-bold text-xs mb-3">COLLECTIONS</h3>
            <ul className="space-y-2 text-accent text-xxs">
              <li>UiX Street</li>
              <li>UiX Originals</li>
              <li>UiX Minimal</li>
              <li>UiX Classic</li>
              <li>Sustainability</li>
              <li>Limited Edition</li>
              <li>Creator Series</li>
              <li>UiX Signature</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-xs mb-3">SUPPORT</h3>
            <ul className="space-y-2 text-accent text-xxs">
              <li>Help</li>
              <li>Customer Services</li>
              <li>Returns & Exchanges</li>
              <li>Shipping</li>
              <li>Order Tracker</li>
              <li>Store Finder</li>
              <li>UiX Club</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-secondary text-xs mb-3">COMPANY INFO</h3>
            <ul className="space-y-2 text-accent text-xxs">
              <li>About UiX</li>
              <li>Stories</li>
              <li>UiX Apps</li>
              <li>Press</li>
              <li>Careers</li>
            </ul>
          </div>

          {/* Social + Logo */}
          <div className="col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold mb-4 text-left">FOLLOW US</h3>

              <div className="flex items-center space-x-4">
                <FaInstagram
                  size={20}
                  className="hover:text-accent cursor-pointer transition"
                />
                <FaTwitter
                  size={20}
                  className="hover:text-accent cursor-pointer transition"
                />
                <FaLinkedin
                  size={20}
                  className="hover:text-accent cursor-pointer transition"
                />
              </div>
            </div>

          
          </div>
            <div className="mt-6 justify-end">
              <Link to="/">
                <img
                  src={logo}
                  className="h-20 sm:h-24 lg:h-28"
                  alt="uixLogo"
                />
              </Link>
            </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 pt-6 border-t border-accent/20 text-center">
          <ul className="flex flex-wrap justify-center gap-4 text-xs text-accent">
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms and Conditions</a>
            </li>
            <li>
              <a href="#">Cookies</a>
            </li>
          </ul>

          <p className="text-accent text-xs mt-4">
            ©{currentYear} UiX Pvt. Ltd
          </p>

          <p className="text-accent text-xs mt-4">
            Developed by{" "}
            <a
              href="https://phuke.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-secondary"
            >
              Ruhon Borah
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;