import React from "react";
import { FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-5">
      <div className="container flex_between text-gray-400">
        <span>© 2023 All rights reserved</span>
        <span>
          Made with{" "}
          <FaHeart className="text-red-500 inline transition-transform duration-300 hover:scale-110" />{" "}
          by Itqan Team
        </span>
      </div>
    </footer>
  );
};

export default Footer;
