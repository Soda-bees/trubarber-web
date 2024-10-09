import React from "react";
import images from "../../services/config/images";

type Props = {};

const LogoLine = (props: Props) => {
  return (
    <div className="relative overflow-hidden bg-black w-full h-20 flex items-center">
      <div
        className="flex items-center absolute"
        style={{
          animation: "slideHorizontal 30s linear infinite",
          // width: "200%",
        }}
      >
        {/* Original Content */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="flex items-center justify-center w-1/3">
              <img src={images.truLogoTwo} className="w-24 h-auto" alt="logo" />
              <div
                className="text-white text-3xl px-60"
                style={{ letterSpacing: "1em" }}
              >
                BARBER
              </div>
            </div>

            <div className="flex items-center justify-center w-1/3">
              <img src={images.truLogoTwo} className="w-24 h-auto" alt="logo" />
              <div
                className="text-white text-3xl px-60"
                style={{ letterSpacing: "1em" }}
              >
                BARBER
              </div>
            </div>

            <div className="flex items-center justify-center w-1/3">
              <img src={images.truLogoTwo} className="w-24 h-auto" alt="logo" />
              <div
                className="text-white text-3xl px-60"
                style={{ letterSpacing: "1em" }}
              >
                BARBER
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideHorizontal {
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
