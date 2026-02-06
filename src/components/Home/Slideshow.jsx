import { useRef, useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ImgBanner1 from "/src/assets/img/banner1.jpg";
import ImgBanner2 from "/src/assets/img/banner2.jpg";
import ImgBanner3 from "/src/assets/img/banner3.jpg";
import ImgBanner4 from "/src/assets/img/banner4.jpg";
import ImgBanner5 from "/src/assets/img/banner5.jpg";
import ImgBanner6 from "/src/assets/img/banner6.jpg";

const Slideshow = () => {
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
  ];

  const handleSlideChange = (swiper) => {
    const realIndex = swiper.realIndex + 1;
    setCurrentSlide(realIndex);
  };

  useEffect(() => {
    if (swiperRef.current) {
      setCurrentSlide(swiperRef.current.swiper.realIndex + 1);
    }
  }, []);

  return (
    <div className="w-full relative">
      <div className="top-banner-slider-component">
        <div
          className="top-banner-slider-container js-top-banner-slider-container"
          data-autoplay="true"
          data-show-dots="true"
          data-type-slider="slide"
          data-always-slide="true"
        >
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={15}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            onSlideChange={(swiper) => handleSlideChange(swiper)}
            onInit={(swiper) => {
              setCurrentSlide(swiper.realIndex + 1);
            }}
            className="swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div>
                  <div className="container-wrapper">
                    <div className="cmp-container">
                      <div className="top-content-banner">
                        <div className="top-banner-component">
                          <div className="image-container">
                            <picture>
                              <img
                                className={isMobile ? "display-mobile" : "display-pc"}
                                src={slide.image}
                                alt={`Banner ${slide.id + 1}`}
                                title={`Banner ${slide.id + 1}`}
                                loading="lazy"
                              />
                            </picture>
                          </div>
                          <div className="content-info no-marginLeft">
                            {/* Content will be specific to each slide - example for slide 0 */}
                            {slide.id === 0 && (
                              <>
                                <div className={`rich-text ${isMobile ? 'display-mobile' : 'display-pc'}`}>
                                  <p>
                                    <span className={isMobile ? "text-s" : "text-m"}>
                                      <b>
                                        GET <span style={{ color: 'rgb(255, 219, 2)' }}>5 X</span> BONUS SPINS
                                      </b>
                                    </span>
                                  </p>
                                  <p>
                                    <span className={isMobile ? "text-s" : "text-m"}>
                                      <b>
                                        UPON <span style={{ color: 'rgb(255, 219, 2)' }}>REGISTRATION</span>
                                      </b>
                                    </span>
                                  </p>
                                  <p>
                                    <span className={isMobile ? "text-s" : "text-m"}>
                                      <b>ON GATES OF OLYMPUS</b>
                                    </span>
                                  </p>
                                  <p>
                                    <span className={isMobile ? "text-s" : "text-m"}>
                                      <b>
                                        <span style={{ color: 'rgb(255, 219, 2)' }}>SUPER SCATTER</span>
                                      </b>
                                    </span>
                                  </p>
                                  <p>
                                    <span className="text-xs">NO DEPOSIT NEEDED!</span>
                                  </p>
                                </div>
                                <div className="top-banner-secondary-wrapper">
                                  <div className="buttons">
                                    <div className="buttons-wrapper">
                                      <div className="CTA_btns">
                                        <div className="cta-template cta-glow">
                                          <a
                                            href="javascript:void(0);"
                                            aria-label="JOIN NOW"
                                            target="_self"
                                          >
                                            <span className="label bold">JOIN NOW</span>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Slide 1 - GoPlay */}
                            {slide.id === 1 && (
                              <>
                                <div className={`rich-text ${isMobile ? 'display-mobile' : 'display-pc'}`}>
                                  <p>
                                    <b>
                                      <span className={isMobile ? "text-s Mobile demibold" : "text-l PC demibold"}>
                                        MAKE A MIN DEPOSIT
                                      </span>
                                    </b>
                                  </p>
                                  <p>
                                    <b>
                                      <span className={isMobile ? "text-m Mobile demibold" : "text-xl PC demibold"}>
                                        <span style={{ color: 'rgb(125, 247, 0)' }}>OF $20</span>
                                      </span>
                                    </b>
                                  </p>
                                  <p>
                                    <b>
                                      <span className={isMobile ? "text-xs Mobile demibold" : "text-m PC demibold"}>
                                        &amp; GET 20% UP TO $100 BONUS
                                      </span>
                                    </b>
                                  </p>
                                  <p>
                                    <b>
                                      <span className={isMobile ? "text-xs Mobile demibold" : "text-s PC demibold"}>
                                        WITH CODE: GOPLAY
                                      </span>
                                    </b>
                                  </p>
                                </div>
                                <div className="top-banner-secondary-wrapper">
                                  <div className="buttons">
                                    <div className="buttons-wrapper">
                                      <div className="CTA_btns">
                                        <div className="cta-template cta-glow">
                                          <a
                                            href="javascript:void(0);"
                                            aria-label="DEPOSITA AHORA"
                                            target="_self"
                                          >
                                            <span className="label bold">DEPOSITA AHORA</span>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Slide 2 - Welcome Offer */}
                            {slide.id === 2 && (
                              <>
                                <div className={`rich-text ${isMobile ? 'display-mobile' : 'display-pc'}`}>
                                  <p>
                                    <span className="text-s bold">100% DE HASTA</span>
                                    <br />
                                    <span
                                      className={isMobile ? "text-xl" : "text-xxl"}
                                      style={{ fontWeight: 900, color: 'rgb(125, 247, 0)' }}
                                    >
                                      500$
                                    </span>
                                    <br />
                                    <span
                                      className={isMobile ? "text-l" : "text-xl"}
                                      style={{ fontWeight: 900, color: 'rgb(125, 247, 0)' }}
                                    >
                                      +100 Giros gratis
                                    </span>
                                    <br />
                                    <span className="text-xs bold">Bonus en tu primer depósito</span>
                                  </p>
                                </div>
                                <div className="top-banner-secondary-wrapper">
                                  <div className="buttons">
                                    <div className="buttons-wrapper">
                                      <div className="CTA_btns">
                                        <div className="cta-template cta-secondary">
                                          <a
                                            href="javascript:void(0);"
                                            aria-label="ÚNETE AHORA"
                                            target="_self"
                                          >
                                            <span className="label bold">ÚNETE AHORA</span>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Slide 3 - Fortune Roulette */}
                            {slide.id === 3 && (
                              <>
                                <div className={`rich-text ${isMobile ? 'display-mobile' : 'display-pc'}`}>
                                  <p>
                                    <b>
                                      <span className={isMobile ? "text-m Mobile demibold" : "text-xl PC demibold"}>
                                        <span style={{ color: 'rgb(246, 218, 1)' }}>SPIN THE WHEEL</span>
                                      </span>
                                    </b>
                                  </p>
                                  <p>
                                    <b>
                                      <span className={isMobile ? "text-s Mobile demibold" : "text-xl PC demibold"}>
                                        OF FORTUNE
                                      </span>
                                    </b>
                                  </p>
                                </div>
                                <div className="top-banner-secondary-wrapper">
                                  <div className="buttons">
                                    <div className="buttons-wrapper">
                                      <div className="CTA_btns">
                                        <div className="cta-template cta-secondary">
                                          <a
                                            href="javascript:void(0);"
                                            aria-label="JUEGA AHORA"
                                            target="_self"
                                          >
                                            <span className="label bold">JUEGA AHORA</span>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Slide 4 - Vikings */}
                            {slide.id === 4 && (
                              <>
                                <div className={`rich-text ${isMobile ? 'display-mobile' : 'display-pc'}`}>
                                  <p>
                                    <b>
                                      <span className={isMobile ? "text-m Mobile demibold" : "text-xl PC demibold"}>
                                        <span style={{ color: 'rgb(246, 218, 1)' }}>VANQUISH, SPIN</span>
                                      </span>
                                    </b>
                                  </p>
                                  <p>
                                    <b>
                                      <span className={isMobile ? "text-s Mobile demibold" : "text-xl PC demibold"}>
                                        AND CLAIM GLORY
                                      </span>
                                    </b>
                                  </p>
                                </div>
                                <div className="top-banner-secondary-wrapper">
                                  <div className="buttons">
                                    <div className="buttons-wrapper">
                                      <div className="CTA_btns">
                                        <div className="cta-template cta-secondary">
                                          <a
                                            href="javascript:void(0);"
                                            aria-label="JUEGA AHORA"
                                            target="_self"
                                          >
                                            <span className="label bold">JUEGA AHORA</span>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Slide 5 - Jackpot Hunt */}
                            {slide.id === 5 && (
                              <>
                                <div className={`rich-text ${isMobile ? 'display-mobile' : 'display-pc'}`}>
                                  <p>
                                    <b>
                                      <span className={isMobile ? "text-m Mobile demibold" : "text-xl PC demibold"}>
                                        <span style={{ color: 'rgb(246, 218, 1)' }}>THE CHASE FOR</span>
                                      </span>
                                    </b>
                                  </p>
                                  <p>
                                    <b>
                                      <span className={isMobile ? "text-s Mobile demibold" : "text-xl PC demibold"}>
                                        JACKPOTS BEGINS
                                      </span>
                                    </b>
                                  </p>
                                </div>
                                <div className="top-banner-secondary-wrapper">
                                  <div className="buttons">
                                    <div className="buttons-wrapper">
                                      <div className="CTA_btns">
                                        <div className="cta-template cta-secondary">
                                          <a
                                            href="/promotions/jackpot-hunt"
                                            aria-label="JUEGA"
                                            target="_self"
                                          >
                                            <span className="label bold">JUEGA</span>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <div className="swiper-buttons">
              <div className="swiper-button-next">
                <span className="next">
                  <svg
                    width="1.8em"
                    height="1.8em"
                    viewBox="0 0 24 24"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    className="sc-fzoydu kUYJSY"
                    style={{ display: 'block' }}
                  >
                    <g transform="rotate(180) translate(-24 -24)">
                      <path
                        fill="currentColor"
                        d="M14.18,20.36a2,2,0,0,1-1.41-.58L6.4,13.41a2,2,0,0,1,0-2.82l6.37-6.37A2,2,0,0,1,15.6,7.05l-4.95,5L15.6,17a2,2,0,0,1-1.42,3.41Z"
                      />
                    </g>
                  </svg>
                </span>
              </div>
              <div className="swiper-button-prev">
                <span className="prev">
                  <svg
                    width="1.8em"
                    height="1.8em"
                    viewBox="0 0 24 24"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    className="sc-fzoydu hmTUa"
                    style={{ display: 'block' }}
                  >
                    <g>
                      <path
                        fill="currentColor"
                        d="M14.18,20.36a2,2,0,0,1-1.41-.58L6.4,13.41a2,2,0,0,1,0-2.82l6.37-6.37A2,2,0,0,1,15.6,7.05l-4.95,5L15.6,17a2,2,0,0,1-1.42,3.41Z"
                      />
                    </g>
                  </svg>
                </span>
              </div>
            </div>
          </Swiper>

          <div className="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal" />
          <div className="disclaimer-container" style={{ display: 'block' }} />
        </div>
      </div>
    </div>
  );
};

export default Slideshow;