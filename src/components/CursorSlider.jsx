// PhotoSlider.js
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PhotoSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const images = [
    "https://via.placeholder.com/800x400?text=Photo+1",
    "https://via.placeholder.com/800x400?text=Photo+2",
    "https://via.placeholder.com/800x400?text=Photo+3",
    "https://via.placeholder.com/800x400?text=Photo+4",
    "https://via.placeholder.com/800x400?text=Photo+5",
    "https://via.placeholder.com/800x400?text=Photo+6",
  ];

  return (
    <div className="my-8">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <img src={src} alt={`Slide ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PhotoSlider;
