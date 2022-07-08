import React from "react";
import Carousel from "framer-motion-carousel";

export const XSlider = ({ className, children }) => {
  return (
    <div className="w-full">
      <Carousel autoPlay={false} renderDots={() => null}>
        {children}
      </Carousel>
    </div>
  );
};
