import ImgLiveCasinoHeroImg from "/src/assets/img/live-casino-hero-image.webp";
import ImgLiveCasinoHeroBackgroundImg from "/src/assets/img/live-casino-hero-background-image.webp";

const Hero = () => {
    return (
        <div className="flex flex-col gap-2 py-6 sm:gap-2.5">
            <div
                className="grid gap-2 sm:gap-4"
                style={{
                    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                    gridAutoFlow: 'column'
                }}
            >
                <div className="group w-full rounded-3xl hover:shadow-games-tile-hover">
                    <div className="bg-primary relative grid h-full w-full grid-cols-12 overflow-hidden rounded-3xl sm:min-h-[30rem]">
                        <picture className="contents">
                            <img
                                src={ImgLiveCasinoHeroBackgroundImg}
                                alt="Treasure Island"
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="eager"
                                fetchPriority="high"
                            />
                        </picture>

                        <div className="relative z-[1] order-1 col-span-12 flex flex-1 flex-col gap-4 py-4 pl-4 pr-0 text-left sm:col-span-5 sm:py-8 sm:pl-8 lg:col-span-6">
                            <h3 className="text-3xl font-bold !leading-none tracking-[-0.96px] text-white sm:text-5xl">
                                Treasure Island
                            </h3>

                            <div className="flex flex-1 flex-col items-start justify-end gap-6">
                                <p className="text-base font-normal !leading-normal text-white">
                                    ¡Descubre premios ocultos, desbloquea emocionantes funciones y juega con crupieres reales para tener la oportunidad de ganar un tesoro!
                                </p>

                                <a
                                    href="#"
                                    className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 rounded-lg gap-3 text-theme-primary-950 bg-theme-secondary-500 disabled:bg-theme-secondary-500 disabled:text-theme-primary-950 disabled:opacity-30 focus-visible:outline-theme-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-theme-secondary-500/20 focus:outline focus:outline-4 hover:bg-theme-secondary-600 hover:text-theme-primary-950 inline-flex items-center justify-center relative z-[2] px-4 py-3 text-base font-bold !leading-normal"
                                >
                                    Juega ahora
                                </a>
                            </div>
                        </div>

                        <div className="relative order-2 col-span-12 aspect-auto flex-1 self-stretch overflow-hidden rounded-r-3xl [mask-image:linear-gradient(to_right,transparent,#000)] sm:col-span-7 lg:col-span-6">
                            <picture className="contents">
                                <img
                                    src={ImgLiveCasinoHeroImg}
                                    alt="Drops y Wins promotional graphic"
                                    className="absolute inset-0 h-full w-full max-w-none rounded-r-3xl object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="eager"
                                    fetchPriority="high"
                                />
                            </picture>
                        </div>

                        <a
                            href="#"
                            className="absolute inset-0 z-[1] opacity-0 focus:outline-none"
                            aria-label="Ver promoción Drops y Wins"
                        >
                            Leer más
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero;