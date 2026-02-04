import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ImgPromotion1 from "/src/assets/img/promotion1.webp";
import ImgPromotion2 from "/src/assets/img/promotion2.webp";
import ImgPromotion3 from "/src/assets/img/promotion3.webp";

const Promotions = () => {
    const { isMobile } = useOutletContext();

    const promotions = [
        {
            title: "Mega Combi Bono",
            description: "Gana hasta un 100% MÁS!",
            image: ImgPromotion1,
        },
        {
            title: "Únete a FORTUNA",
            description: "¡Y comienza a ganar dinero las 24 horas del día, los 7 días de la semana usando tu teléfono inteligente!",
            image: ImgPromotion2,
        },
        {
            title: "Drops & Wins",
            description: "¡Premios sorpresa y torneos, premios en efectivo todo el día!",
            image: ImgPromotion3,
        },
    ];

    return (
        <div className="relative overflow-hidden py-2 lg:py-5">
            <div className="relative mb-3 flex items-center justify-between gap-2 py-4">
                <h2 className="text-dark-grey-50 text-xs font-bold uppercase !leading-[1.1] tracking-[1.2px] md:text-sm">
                    Promociones
                </h2>
            </div>

            <div className="relative w-full pb-4">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView={1.1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    navigation={{
                        prevEl: '.custom-prev-button',
                        nextEl: '.custom-next-button',
                    }}
                    grabCursor={true}
                    className="scroll-snap-slider scroll-snap-slider--overrides transform-gpu overflow-x-clip overflow-visible -draggable"
                >
                    {promotions.map((promo) => (
                        <SwiperSlide key={promo.title} className="h-auto">
                            <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-primary-900 hover:shadow-games-tile-hover sm:rounded-2xl lg:rounded-3xl">
                                <div className="relative">
                                    <img
                                        src={promo.image}
                                        alt={promo.title}
                                        className="w-full object-cover !aspect-[16/9]"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-5 sm:p-6 sm:pb-6 lg:px-8 lg:pb-8">
                                    <div>
                                        <h3 className="mb-2 text-2xl font-bold tracking-tight text-white">
                                            {promo.title}
                                        </h3>
                                        <p className="text-sm font-normal !leading-tight text-white">
                                            {promo.description}
                                        </p>
                                    </div>

                                    <a
                                        href="#"
                                        className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 font-bold rounded-lg text-base gap-3 px-4 py-3 text-theme-primary-950 bg-theme-secondary-500 disabled:bg-theme-secondary-500 disabled:text-theme-primary-950 disabled:opacity-30 focus-visible:outline-theme-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-theme-secondary-500/20 focus:outline focus:outline-4 hover:bg-theme-secondary-600 hover:text-theme-primary-950 inline-flex items-center justify-center z-[1] mt-4 w-fit !leading-tight sm:mt-5 lg:mt-6"
                                    >
                                        Leer más
                                    </a>
                                </div>

                                <a
                                    href="#"
                                    className="absolute inset-0 cursor-pointer"
                                    title={promo.title}
                                    aria-label={`Ver detalles de ${promo.title}`}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="relative flex items-center justify-between pt-4">
                    <div className="swiper-navigation">
                        <button
                            type="button"
                            className="custom-prev-button group flex h-8 w-8 items-center justify-center rounded-lg bg-theme-secondary-500 p-2.5 text-theme-primary-950 hover:bg-theme-secondary-600 disabled:invisible"
                            aria-label="Anterior"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14M5 12l4 4m-4-4l4-4" />
                            </svg>
                        </button>
                    </div>

                    <div className="swiper-navigation">
                        <button
                            type="button"
                            className="custom-next-button group flex h-8 w-8 items-center justify-center rounded-lg bg-theme-secondary-500 p-2.5 text-theme-primary-950 hover:bg-theme-secondary-600 disabled:invisible"
                            aria-label="Siguiente"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14m-4 4l4-4m-4-4l4 4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Promotions;