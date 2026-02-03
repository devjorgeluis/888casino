import { useContext } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ImgLogoTransparent from "/src/assets/svg/logo-transparent.svg";

const ProviderContainer = ({
    categories,
    selectedProvider,
    onProviderSelect,
}) => {
    const { contextData } = useContext(AppContext);
    const { isMobile } = useOutletContext();
    const location = useLocation();

    const providers = categories.filter((cat) => cat.code && cat.code !== "home");

    const handleClick = (e, provider) => {
        e.preventDefault();
        onProviderSelect(provider);
    };

    const isSelected = (provider) => {
        const hashCode = location.hash.substring(1);
        return (
            (selectedProvider && selectedProvider.id === provider.id) ||
            hashCode === provider.code
        );
    };

    return (
        <div className="relative overflow-hidden py-2 lg:py-5">
            <div className="relative mb-3 flex items-center justify-between gap-2 py-4">
                {
                    !isMobile && 
                    <img
                        src={ImgLogoTransparent}
                        alt="fortunajuegos"
                        className="absolute left-0 -top-1/2 h-auto w-[4.25rem] translate-y-2 opacity-50"
                    />
                }

                <h1 className={`text-center text-xs font-bold uppercase tracking-wider text-dark-grey-50 sm:text-sm`}>
                    Proveedores
                </h1>
            </div>

            <div className="relative px-4 lg:px-0">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView="auto"
                    centeredSlides={false}
                    grabCursor={true}
                    loop={providers.length > 6}
                    navigation={{
                        prevEl: ".custom-swiper-button-prev",
                        nextEl: ".custom-swiper-button-next",
                    }}
                    breakpoints={{
                        320: { slidesPerView: 2, spaceBetween: 12 },
                        640: { slidesPerView: 4, spaceBetween: 16 },
                        768: { slidesPerView: 5, spaceBetween: 20 },
                        1024: { slidesPerView: 6, spaceBetween: 24 },
                        1280: { slidesPerView: 8, spaceBetween: 24 },
                    }}
                    className="!overflow-visible"
                >
                    {providers.map((provider) => {
                        const selected = isSelected(provider);
                        const imageUrl = provider.image_local
                            ? `${contextData.cdnUrl}${provider.image_local}`
                            : provider.image_url;

                        return (
                            <SwiperSlide key={provider.id} className="!w-28 !h-auto sm:!w-32">
                                <button
                                    onClick={(e) => handleClick(e, provider)}
                                    className={`bg-theme-secondary/10 
                                        relative flex h-full w-full flex-col items-center justify-between 
                                        gap-3 rounded-xl border p-4 transition-all duration-300
                                        ${selected
                                            ? "border-theme-secondary ring-2 ring-theme-secondary bg-theme-secondary/10"
                                            : "border-transparent bg-dark-grey-900/50 hover:bg-theme-secondary/10 hover:border-theme-secondary/20"
                                        }
                                    `}
                                    aria-label={`Ver juegos de ${provider.name}`}
                                >
                                    <div className="flex aspect-[3/2] w-full max-w-24 items-center justify-center">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={provider.name}
                                                className="max-h-12 max-w-full object-contain"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-12 w-24 rounded bg-dark-grey-800" />
                                        )}
                                    </div>

                                    <span className="rounded-md bg-dark-grey-800 px-2 py-1 text-xs font-medium text-white ring-1 ring-dark-grey-700">
                                        {provider.element_count} Juegos
                                    </span>
                                </button>
                            </SwiperSlide>
                        );
                    })}

                    <div className="custom-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/50 lg:flex">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </div>

                    <div className="custom-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/50 lg:flex">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                </Swiper>
            </div>
        </div>
    );
};

export default ProviderContainer;