import { useRef, useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ImgBanner1 from "/src/assets/img/casino-banner1.jpg";
import ImgBanner2 from "/src/assets/img/casino-banner2.jpg";
import ImgBanner3 from "/src/assets/img/casino-banner3.jpg";
import ImgBanner4 from "/src/assets/img/casino-banner4.jpg";
import ImgBanner5 from "/src/assets/img/casino-banner5.jpg";
import ImgBanner6 from "/src/assets/img/casino-banner6.jpg";
import ImgBanner7 from "/src/assets/img/casino-banner7.jpg";

const CasinoSlideshow = () => {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const { isMobile } = useOutletContext();

  const slides = [
    { id: 0, image: ImgBanner1 },
    { id: 1, image: ImgBanner2 },
    { id: 2, image: ImgBanner3 },
    { id: 3, image: ImgBanner4 },
    { id: 4, image: ImgBanner5 },
    { id: 5, image: ImgBanner6 },
    { id: 6, image: ImgBanner7 },
  ];

  const handleSlideChange = (swiper) => {
    const realIndex = swiper.realIndex + 1;
    setCurrentSlide(realIndex);
  };

  const handlePrevClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  useEffect(() => {
    if (swiperRef.current) {
      setCurrentSlide(swiperRef.current.swiper.realIndex + 1);
    }
  }, []);

  return (
    <div className="w-full relative">
      <div id="slider">
        <div id="image-slider">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay, Pagination]}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
              disabledClass: 'swiper-button-disabled',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
              type: 'bullets',
              // dynamicBullets: true,
            }}
            loop={true}
            autoplay={{
              delay: 300000,
              disableOnInteraction: false,
            }}
            onSlideChange={(swiper) => handleSlideChange(swiper)}
            onInit={(swiper) => {
              setCurrentSlide(swiper.realIndex + 1);
            }}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id} className="clickable image-slide">
                <picture>
                  <img
                    className={isMobile ? "display-casino-mobile" : "display-pc"}
                    src={slide.image}
                    alt={`Banner ${slide.id + 1}`}
                    title={`Banner ${slide.id + 1}`}
                    loading="lazy"
                  />
                </picture>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal w-100" />
          <div className="disclaimer-container" style={{ display: 'block' }} />
        </div>

        {
          !isMobile &&
          <div id="navigation">
            <div
              className="arrow left"
              onClick={handlePrevClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img">
                <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
              </svg>
            </div>
            <div
              className="arrow right"
              onClick={handleNextClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
              </svg>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default CasinoSlideshow;