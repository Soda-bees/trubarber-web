declare module 'react-star-ratings' {
    interface StarRatingsProps {
      rating: number;
      starRatedColor?: string;
      starEmptyColor?: string;
      starHoverColor?: string;
      numberOfStars: number;
      changeRating?: (newRating: number) => void;
      name?: string;
      starDimension?: string;
      starSpacing?: string;
    }
  
    const StarRatings: React.FC<StarRatingsProps>;
  
    export default StarRatings;
  }
  