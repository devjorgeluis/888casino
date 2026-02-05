import { useContext, useRef } from 'react';
import { AppContext } from '../../AppContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import GameCard from '../GameCard';
import IconArrowLeft from "/src/assets/svg/arrow-left.svg";
import IconArrowRight from "/src/assets/svg/arrow-right.svg";

const HotGameSlideshow = ({ games, name, title, onGameClick }) => {
    const { contextData } = useContext(AppContext);
    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const handleGameClick = (game, isDemo = false) => {
        if (onGameClick) {
            onGameClick(game, isDemo);
        }
    };

    return (
        <div className="sc-htehQK ieKpMF cy-orbit-swiper">
            <div className="sc-kAuobC hvWNQq cy-games-list-title">
                <div className="sc-cbRazL kytqOW cy-games-title-text">{title}</div>
                <div className="sc-fEyyHY inSENM"></div>
                <div className="sc-iNjjOV kuICQf cy-swiper-buttons">
                    <div className="sc-cLVkoy gTiEhq">
                        <button 
                            className="sc-ksJhlw fTCwfC cy-swiper-button-prev" 
                            ref={prevRef}
                            aria-label="Previous slide"
                        >
                            <span className="sc-hBpigv iTELlo">
                                <img src={IconArrowLeft} className="sc-bqOBqt kKmHiP" />
                            </span>
                            <div className="sc-bjEuFB cSRHhG"></div>
                        </button>
                    </div>
                    <div className="sc-cLVkoy gTiEhq">
                        <button 
                            className="sc-ksJhlw gpefPx cy-swiper-button-next" 
                            ref={nextRef}
                            aria-label="Next slide"
                        >
                            <span className="sc-hBpigv bzAYWQ">
                                <img src={IconArrowRight} className="sc-bqOBqt PBviZ" />
                            </span>
                            <div className="sc-bjEuFB cSRHhG"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div className="sc-hAHgYv faMpiy cy-orbit-swiper-wrapper">
                <div className="sc-iysFMw cxdLwt cy-orbit-swiper-games-list">
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation]}
                        spaceBetween={10}
                        slidesPerView={6.8}
                        breakpoints={{
                            0: { slidesPerView: 3.5, spaceBetween: 8 },
                            576: { slidesPerView: 4.5, spaceBetween: 10 },
                            992: { slidesPerView: 6.8, spaceBetween: 10 }
                        }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onSwiper={(swiper) => {
                            setTimeout(() => {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                                swiper.navigation.init();
                                swiper.navigation.update();
                            });
                        }}
                        className="row-top-games"
                    >
                        {games?.map((game, index) => (
                            <SwiperSlide 
                                key={`hot-${name}-${game.id ?? index}-${index}`} 
                                className="sc-gSkVGw sc-lbNtLv evQOJh bdSJRm cy-single-game-regular-template game-box swiper-mode game-group-videoslot game-category-slots game-company-games-global game-type-2400475"
                            >
                                <GameCard
                                    id={game.id}
                                    provider="Casino"
                                    title={game.name}
                                    type="slideshow"
                                    imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                                    onGameClick={() => {
                                        handleGameClick(game);
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default HotGameSlideshow;