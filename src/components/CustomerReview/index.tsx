import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import StarRatings from "react-star-ratings";
import { motion, AnimatePresence } from "framer-motion";
import LeftToRightAnimation from "../LeftToRightAnimation";
import RightToLeftAnimation from "../RightToLeftAnimation";
import { useSelector } from "react-redux";
import { selectBarbers } from "../../Store/BarbersSlice";
import { useOutletContext } from "react-router-dom";

type Review = {
  barberData: string | any;
  comment: string;
  createdAt: string;
  rating: string | any;
  updatedAt: string;
  userData: any;
  __v: number;
  _id: string
};

type Props = {};

const CustomerReview = (props: Props) => {
  const { showSidebar } = useOutletContext<{ showSidebar: boolean }>();

  const barbers = useSelector(selectBarbers)

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    getAllReviews()
  }, [barbers])

  const getAllReviews = async () => {
    const allReviews = barbers?.flatMap(barber => barber?.reviews);
    setReviews(allReviews)
  }


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
          <RightToLeftAnimation>
            <img
              src={images.greyArrow}
              className="cursor-pointer w-5 md:w-6"
              onClick={previousReviews}
              alt="Previous"
            />
          </RightToLeftAnimation>
          <LeftToRightAnimation>
            <img
              src={images.greyArrow}
              className="rotate-180 cursor-pointer w-5 md:w-6"
              onClick={nextReviews}
              alt="Next"
            />
          </LeftToRightAnimation>
        </div>
      </LeftToRightAnimation>

      <div
        // className="grid grid-cols-1 h-[50%] sm:grid-cols-2 gap-4 w-full"
        className={
          `grid grid-cols-1 h-[50%] gap-4 w-full ${showSidebar ? 'sm:grid-cols-1 xl:grid-cols-2' : 'sm:grid-cols-2'}`
        }
      >
        {reviews?.length > 0 && reviews
          .slice(currentIndex, currentIndex + reviewsPerPage)
          .map((review: any, index) => (
            <RightToLeftAnimation
              key={currentIndex + index}
              className="border border-gray-300 rounded-2xl p-5 flex flex-col justify-between relative"
            >
              <div className="flex flex-row items-start">
                <img
                  src={review?.userData?.profile ? review?.userData?.profile : review?.userData?.gender === 'male' ? images.male : images.female}
                  alt={review.name}
                  className="w-16 h-16 object-cover rounded-full mr-4"
                />
                <div>
                  <div className="text-lg font-semibold">{review?.userData?.name}</div>
                  <div className="text-sm">creaed das at</div>
                  <div className="flex items-center">
                    <span className="text-md mr-2 mt-1">{review?.rating}</span>
                    <StarRatings
                      rating={parseFloat(review.rating)}
                      starRatedColor="gold"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="2px"
                    />
                  </div>

                </div>
              </div>
              <div className="mt-4 text-gray-700 line-clamp-3 h-full">"{review.comment}"</div>
            </RightToLeftAnimation>
          ))}
      </div>
    </div>
  );
};

export default CustomerReview;
