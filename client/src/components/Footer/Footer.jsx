import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaReddit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const navigate = useNavigate();
  const login = () => {
    navigate("/login");
  };
  const { isLogin } = useSelector((state) => state.user);
  return (
    <footer className="bg-primary text-secondary px-4 py-8 ">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Signup Section */}
          {!isLogin && (
            <div className="col-span-2 bg-accent text-primary text-center p-4 md:p-8 rounded-lg flex items-center justify-center">
              <div>
                <h2 className="text-md font-bold mb-2">
                  JOIN UiX AND GET 15% OFF
                </h2>

                <button
                  onClick={login}
                  className="bg-primary text-secondary py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                >
                  SIGN UP FOR FREE
                </button>
              </div>
            </div>
          )}

          {/* Footer Links */}
          <div>
            <h3 className="font-bold mb-2">PRODUCTS</h3>

            <ul className="space-y-2 text-accent">
              <li>T Shirt</li>
              <li>Shorts</li>
              <li>Accessories</li>
              <li>New Arrivals</li>
              <li>Special Offer</li>
              <li>Flat 50% Off!</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">COLLECTIONS</h3>

            <ul className="space-y-2 text-accent">
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

          <div>
            <h3 className="font-bold mb-2">SUPPORT</h3>

            <ul className="space-y-2 text-accent">
              <li>Help</li>
              <li>Customer Services</li>
              <li>Returns & Exchanges</li>
              <li>Shipping</li>
              <li>Order Tracker</li>
              <li>Store Finder</li>
              <li>UiX Club</li>
              <li>UiX Club Terms and Conditions</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">COMPANY INFO</h3>

            <ul className="space-y-2 text-accent">
              <li>About UiX</li>
              <li>Stories</li>
              <li>UiX Apps</li>
              <li>Entity Details</li>
              <li>Press</li>
              <li>Careers</li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="lg:col-span-1">
            <h3 className="font-bold mb-4 text-center lg:text-left">
              FOLLOW US
            </h3>

            <div className="flex justify-center lg:justify-start space-x-4">
              <FaInstagram
                size={30}
                className="text-secondary hover:text-accent transition-colors"
              />

              <FaTwitter
                size={30}
                className="text-secondary hover:text-accent transition-colors"
              />

              <FaYoutube
                size={30}
                className="text-secondary hover:text-accent transition-colors"
              />

              <FaLinkedin
                size={30}
                className="text-secondary hover:text-accent transition-colors"
              />

              <FaReddit
                size={30}
                className="text-secondary hover:text-accent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-accent mt-8 pt-4 text-center">
          <ul className="flex justify-center space-x-4 text-xs text-accent">
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
            ©2026 UiX India Marketing Pvt. Ltd
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
