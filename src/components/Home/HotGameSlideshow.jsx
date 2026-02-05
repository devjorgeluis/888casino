import { useContext, useRef } from 'react';
import { AppContext } from '../../AppContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import GameCard from '../GameCard';

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
        <>
            <header className="casino-widget__heading section-heading">
                <h2 className="section-heading__left">
                    <span className="section-heading__title title-2-semi-bold">
                        <i18n-t>{title}</i18n-t>
                    </span>
                </h2>
            </header>
            <div className="casino-widget__games">
                <div className="swiper-container">
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
                        style={{ width: '100%' }}
                    >
                        {games?.map((game, index) => (
                            <SwiperSlide key={`hot-${name}-${game.id ?? index}-${index}`} className="top-game-item">
                                <GameCard
                                    key={`hotcard-${name}-${game.id ?? index}-${index}`}
                                    id={game.id}
                                    provider={'Casino'}
                                    title={game.name}
                                    type="slideshow"
                                    imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                                    onGameClick={() => {
                                        handleGameClick(game);
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                        <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
                    </Swiper>
                    
                    <button ref={prevRef} className="splide__arrow splide__arrow--prev slider-button slider-button--prev">
                        <svg-image glyph="chevron_left" width="24px" height="24px" fill="currentColor">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="currentColor"><path d="M8.3 12.7c-.4-.4-.4-1 0-1.4l4.5-4.5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.4 12l3.8 3.8c.4.4.4 1 0 1.4s-1 .4-1.4 0l-4.5-4.5z"></path></svg>
                        </svg-image>
                    </button>
                    <button ref={nextRef} className="splide__arrow splide__arrow--next slider-button slider-button--next">
                        <svg-image glyph="chevron_right" width="24px" height="24px" fill="currentColor">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="currentColor"><path d="M9.8 17.2c-.4-.4-.4-1 0-1.4l3.8-3.8-3.8-3.8c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l4.5 4.5c.4.4.4 1 0 1.4l-4.5 4.5c-.4.4-1 .4-1.4 0z"></path></svg>
                        </svg-image>
                    </button>
                </div>
            </div>
        </>
    );
};

export default HotGameSlideshow;