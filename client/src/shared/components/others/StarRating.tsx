import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = Math.floor(5 - rating);

  return (
    <div className="flex">
      {Array.from({ length: fullStars }).map((_, index) => (
        <FaStar color="#ffe234" key={index} />
      ))}
      {hasHalfStar && <FaStarHalfAlt color="#ffe234" />}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <FaRegStar color="#ffe234" key={index} />
      ))}
    </div>
  );
};

export default StarRating;
