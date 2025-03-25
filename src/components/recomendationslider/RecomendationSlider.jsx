// import React, { useEffect, useRef, useState } from "react";
import "./recomendationslider.scss";
import { Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Itemcard from "../itemcard/Itemcard";
import { useAppStore } from "../../store";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
const RecommendationSlider = () => {
  const { properties } = useAppStore();

  return (
    <Swiper
      modules={[Pagination, Scrollbar, A11y, Autoplay]}
      spaceBetween={10}
      breakpoints={{
        240: {
          slidesPerView: 1,
        },
        320: {
          slidesPerView: 2,
        },
        576: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      }}
      pagination={{ clickable: true }}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
      }}
      preventClicks={false}
      preventClicksPropagation={false}
    >
      {properties && properties.length > 0 ? (
        properties.map((property, index) => {
          return (
            <SwiperSlide key={index}>
              <Link
                to={`/propertydetails/${property._id}`}
                key={`${property.id}-${index}`}
                style={{ color: "black", margin: "5px" }}
              >
                <Itemcard property={property} />
              </Link>
            </SwiperSlide>
          );
        })
      ) : (
        <h1>No Listings Found</h1>
      )}
    </Swiper>
  );
};

export default RecommendationSlider;
