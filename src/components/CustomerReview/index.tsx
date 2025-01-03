import React, { useState } from "react";
import images from "../../services/config/images";
import StarRatings from "react-star-ratings";
import { motion, AnimatePresence } from "framer-motion";
import LeftToRightAnimation from "../LeftToRightAnimation";
import RightToLeftAnimation from "../RightToLeftAnimation";

type Review = {
  image: string;
  name: string;
  location: string;
  rating: number;
  content: string;
};

type Props = {};

const CustomerReview = (props: Props) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      image: images.reviewBarber,
      name: "John Doe",
      location: "123 Main St, City",
      rating: 2.5,
      content: `“ Trim & Tonic is the best barbershop I've been to in years! The atmosphere is welcoming, the barbers are skilled, and I always leave feeling like a million bucks. Highly recommend! ”`,
    },
    {
      image: images.reviewBarber,
      name: "Jane Smith",
      location: "456 Oak St, City",
      rating: 4.5,
      content: `“ Trim & Tonic is the best barbershop I've been to in years! The atmosphere is welcoming, the barbers are skilled, and I always leave feeling like a million bucks. Highly recommend! ”`,
    },
    {
      image: images.reviewBarber,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 3.5,
      content: `“ Trim & Tonic is the best barbershop I've been to in years! The atmosphere is welcoming, the barbers are skilled, and I always leave feeling like a million bucks. Highly recommend! ”`,
    },
    {
      image: images.reviewBarber,
      name: "Alice Brown",
      location: "321 Elm St, City",
      rating: 4.0,
      content: `“ Great service and friendly staff! ”`,
    },
    {
      image: images.reviewBarber,
      name: "Charlie Green",
      location: "654 Maple St, City",
      rating: 5.0,
      content: `“ I love this place! Always a great experience. ”`,
    },
    {
      image: images.reviewBarber,
      name: "Diana White",
      location: "987 Birch St, City",
      rating: 4.8,
      content: `“ Best haircut I've had in years! ”`,
    },
    {
      image: images.reviewBarber,
      name: "Diana White",
      location: "987 Birch St, City",
      rating: 4.8,
      content: `“ Best haircut I've had in years! ”`,
    },
  ]);

  const handleRatingChange = (newRating: number, index: number) => {
    const updatedReviews = [...reviews];
    updatedReviews[currentIndex + index].rating = newRating;
    setReviews(updatedReviews);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = 4;

  const nextReviews = () => {
    if (currentIndex + reviewsPerPage < reviews.length) {
      setCurrentIndex(currentIndex + reviewsPerPage);
    }
  };

  const previousReviews = () => {
    if (currentIndex - reviewsPerPage >= 0) {
      setCurrentIndex(currentIndex - reviewsPerPage);
    }
  };

  return (
    <div className="p-4 md:p-10 lg:p-20 flex flex-col lg:flex-row gap-4">
      <LeftToRightAnimation className="mb-10 flex flex-col justify-between w-full lg:w-[70%]">
        <div>
          <h2 className="text-3xl md:text-5xl font-semibold">
            Customer Reviews
          </h2>
          <p className="text-lg md:text-2xl font-light mt-4">
            Discover firsthand accounts of our customer’s experiences with our
            services. Your satisfaction is our priority. Read on to see why our
            customers choose us and how we've made a positive impact on their
            lives.
          </p>
        </div>
        <div className="flex space-x-10 mt-10 justify-end lg:justify-start">
          <img
            src={images.greyArrow}
            className="cursor-pointer w-5 md:w-6"
            onClick={previousReviews}
            alt="Previous"
          />
          <img
            src={images.greyArrow}
            className="rotate-180 cursor-pointer w-5 md:w-6"
            onClick={nextReviews}
            alt="Next"
          />
        </div>
      </LeftToRightAnimation>

      <div
        className="grid grid-cols-1 h-[50%] sm:grid-cols-2 gap-4 w-full"
      >
        {reviews
          .slice(currentIndex, currentIndex + reviewsPerPage)
          .map((review, index) => (
            <RightToLeftAnimation
              key={currentIndex + index}
              className="border border-gray-300 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div className="flex flex-row items-start">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-16 h-16 object-cover rounded-full mr-4"
                />
                <div>
                  <div className="text-lg font-semibold">{review.name}</div>
                  <div className="flex items-center mt-1">
                    <span className="text-md mr-2 mt-1">{review.rating}</span>
                    <StarRatings
                      rating={review.rating}
                      starRatedColor="gold"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="2px"
                      changeRating={(newRating) =>
                        handleRatingChange(newRating, index)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 text-gray-700 line-clamp-3">{review.content}</div>
            </RightToLeftAnimation>
          ))}
      </div>


      {/* <div className="grid grid-cols-1 h-[50%] sm:grid-cols-2 gap-4 w-full">
        {reviews
          .slice(currentIndex, currentIndex + reviewsPerPage)
          .map((review, index) => (
            <div
              key={currentIndex + index}
              className="border border-gray-300 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div className="flex flex-row items-start">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-16 h-16 object-cover rounded-full mr-4"
                />
                <div>
                  <div className="text-lg font-semibold">{review.name}</div>
                  <div className="flex items-center mt-1">
                    <span className="text-md mr-2 mt-1">{review.rating}</span>
                    <StarRatings
                      rating={review.rating}
                      starRatedColor="gold"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="2px"
                      changeRating={(newRating) =>
                        handleRatingChange(newRating, index)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 text-gray-700 line-clamp-3">
                {review.content}
              </div>
            </div>
          ))}
      </div> */}

    </div>
  );
};

export default CustomerReview;
