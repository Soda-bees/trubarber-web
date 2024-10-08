// import React, { useState } from "react";
// import images from "../../services/config/images";

// type Props = {};

// const LogoLine = (props: Props) => {
//   const [sliderImages, setSliderImages] = useState<
//     { image: string; text: string }[]
//   >([
//     { image: images.truLogoTwo, text: "BARBER" },
//     { image: images.truLogoTwo, text: "BARBER" },
//     { image: images.truLogoTwo, text: "BARBER" },
//     { image: images.truLogoTwo, text: "BARBER" },
//     { image: images.truLogoTwo, text: "BARBER" },
//     { image: images.truLogoTwo, text: "BARBER" },
//     { image: images.truLogoTwo, text: "BARBER" },
//     { image: images.truLogoTwo, text: "BARBER" },
//   ]);

//   return (
//     <div className="relative overflow-hidden bg-blue-500 w-full">
//       <div className="flex">
//         {
//           sliderImages.map((item, index) => {
//             return (
//               <div className="flex flex-row items-center">
//               <img src={item?.image} className="w-36" />
//               <div className="text-4xl font-bold">B</div>
//               <div className="text-4xl font-bold">A</div>
//               </div>
//             )
//           })
//         }
        

//       </div>
//     </div>
//   );
// };

// export default LogoLine;

import React, { useState } from "react";
import images from "../../services/config/images";

type Props = {};

const LogoLine = (props: Props) => {
  const [sliderImages] = useState<{ image: string; text: string }[]>([
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
  ]);

  return (
    <div className="relative overflow-hidden bg-blue-500 w-full">
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: "slide 15s linear infinite",
          display: "flex", // Ensure flex display
        }}
      >
        {/* Duplicating the content to create a looping effect */}
        {sliderImages.concat(sliderImages).map((item, index) => {
          return (
            <div key={index} className="flex items-center justify-center mx-2">
              <img src={item?.image} className="w-36" />
              {/* <div className="text-4xl font-bold mx-2">B</div>
              <div className="text-4xl font-bold mx-2">A</div> */}
            </div>
          );
        })}
      </div>

      {/* Inline style for keyframes */}
      <style>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default LogoLine;
