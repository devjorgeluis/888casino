import { useOutletContext } from "react-router-dom";
import ImgDropWinsBackground from "/src/assets/img/drop-wins-background.webp";
import ImgMobileDropWinsBackground from "/src/assets/img/mobile-drop-wins-background.webp";
import ImgMobileDropWins from "/src/assets/img/mobile-drop-wins.webp";
import ImgJoinFortuna from "/src/assets/img/join-fortuna.webp";
import ImgPrepayment from "/src/assets/img/prepayment.webp";

const DropWins = () => {
    const { isMobile } = useOutletContext();

    return (
        <div className="mb-10 [&_.scroll-snap-slider]:[grid-template-areas:'first_second''first_third']">
            <div className="relative w-full">
                <div className="scroll-snap-slider overflow-x-clip -draggable transform-gpu sm:grid sm:grid-cols-2 sm:gap-2 lg:grid-cols-2 lg:grid-rows-2">
                    {
                        isMobile ? <>
                            <div className="flex flex-col gap-2 py-6 sm:gap-2.5">
                                <div className="grid gap-2 sm:gap-4" style={{ gridTemplateColumns: "repeat(1, minmax(0px, 1fr))", gridAutoFlow: "row"}}>
                                    <div className="hover:shadow-games-tile-hover group group w-full rounded-3xl">
                                        <div className="bg-primary relative grid h-full w-full grid-cols-12 overflow-hidden rounded-3xl">
                                            <picture className="contents">
                                                <img className="absolute inset-0 h-full w-full object-cover" src={ImgMobileDropWinsBackground} loading="eager" fetchPriority="high" data-allow-mismatch="attribute" />
                                            </picture>
                                            <div className="relative z-[1] order-2 col-span-12 flex flex-col gap-4 px-4 pb-4 text-left md:px-9 md:pb-9">
                                            <h3 className="!text-white text-xl font-bold !leading-none tracking-[-0.96px] md:text-4xl text-white">Drops&amp;Wins</h3>
                                            <div className="flex flex-col items-start gap-4 sm:gap-6">
                                                <p className="!text-white text-sm font-normal !leading-normal text-white">Entrega de premios y torneos, ¡premios en metálico durante todo el día!</p>
                                                <a className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 rounded-lg gap-2.5 px-3 py-2 text-theme-primary-950 bg-theme-secondary-500 disabled:bg-theme-secondary-500 disabled:text-theme-primary-950 disabled:opacity-30 focus-visible:outline-theme-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-theme-secondary-500/20 focus:outline focus:outline-4 hover:bg-theme-secondary-600 hover:text-theme-primary-950 inline-flex items-center justify-center relative z-[2] text-sm font-bold" href="/casino" as="button" type="button" exact="false" exactquery="false" exacthash="false">
                                                    <span>Leer Más</span>
                                                </a>
                                            </div>
                                            </div>
                                            <div className="relative order-1 col-span-12 aspect-[6/5] overflow-hidden rounded-t-3xl [mask-image:linear-gradient(to_bottom,#000,transparent)]">
                                            <picture className="contents">
                                                <img className="w-full max-w-none transition-transform group-hover:scale-105 lg:absolute absolute inset-0 h-full rounded-t-3xl object-cover" src={ImgMobileDropWins} loading="eager" fetchPriority="high" data-allow-mismatch="attribute" />
                                            </picture>
                                            </div>
                                            <a className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 font-bold rounded-lg text-base gap-3 px-4 py-3 text-theme-secondary-500 disabled:text-theme-secondary-500 disabled:opacity-30 focus:text-theme-secondary-600 hover:text-theme-secondary-600 inline-flex items-center justify-center absolute inset-0 z-[1] opacity-0" href="/casino" as="button" type="button" disabled="false" exact="false" exactquery="false" exacthash="false">
                                                <span className="">Leer Más</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </> :
                        <div className="swiper-slide h-auto sm:[grid-area:_first]">
                            <div className="group group min-h-[15.65rem] w-full rounded-2xl sm:min-h-[35rem] sm:rounded-3xl lg:min-h-[30rem] h-full w-full">
                                <div className="relative grid h-full grid-cols-12 overflow-hidden rounded-2xl bg-primary py-6 pl-6 sm:rounded-3xl lg:py-8 lg:pl-8">
                                    <div className="relative z-[1] col-span-9 flex flex-col gap-4 text-left sm:col-span-8 lg:col-span-6">
                                        <h3 className="text-2xl font-bold leading-none tracking-tight text-white sm:text-4xl sm:tracking-[-0.6px] lg:text-5xl lg:tracking-[-0.96px]">
                                            Drops & Wins
                                        </h3>
                                        <div className="flex flex-1 flex-col items-start justify-between gap-6 lg:justify-end">
                                            <p className="text-base font-normal leading-tight text-white">
                                                Entrega de premios y torneos, ¡premios en metálico durante todo el día!
                                            </p>
                                            <a
                                                href="#"
                                                className="z-[2] inline-flex items-center justify-center gap-3 rounded-lg bg-white p-2 font-bold text-theme-primary-950 transition hover:bg-theme-secondary-600 hover:text-theme-primary-950 lg:px-4 lg:py-3"
                                            >
                                                Leer Más
                                            </a>
                                        </div>
                                    </div>

                                    <div className="[mask-image:linear-gradient(to_left,#000_48%,transparent_98%)] absolute bottom-0 right-0 top-0 w-[66%] rounded-r-2xl sm:w-[84%] sm:rounded-r-3xl lg:w-1/2">
                                        <picture>
                                            <img
                                                src={ImgDropWinsBackground}
                                                alt="Drops & Wins - Torneos y premios diarios"
                                                className="h-full w-full rounded-r-2xl object-cover transition-transform group-hover:scale-125 sm:rounded-r-3xl"
                                                loading="eager"
                                                fetchPriority="high"
                                            />
                                        </picture>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        !isMobile && <>
                            <div className="swiper-slide h-auto sm:[grid-area:_second]">
                                <div className="group rounded-xl sm:rounded-3xl h-full w-full">
                                    <div className="relative grid h-full w-full grid-cols-12 overflow-hidden rounded-xl py-6 pl-6 sm:rounded-3xl bg-primary">
                                        {/* Text Content */}
                                        <div className="relative z-[1] col-span-7 flex flex-col gap-6 text-left sm:justify-between">
                                            <h3 className="!text-white text-2xl font-bold !leading-tight tracking-tight text-dark-grey-800">
                                                Únete a FORTUNA
                                            </h3>

                                            <div>
                                                <a
                                                    href="#"
                                                    className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 font-bold rounded-lg text-base gap-3 text-theme-primary-950 disabled:bg-theme-secondary-500 disabled:text-theme-primary-950 disabled:opacity-30 focus-visible:outline-theme-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-theme-secondary-500/20 focus:outline focus:outline-4 hover:bg-theme-secondary-600 hover:text-theme-primary-950 inline-flex items-center justify-center relative z-[2] bg-white p-2"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="iconify iconify--material-symbols-light min-h-4 min-w-4"
                                                        style={{ fontSize: "16px" }}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path fill="currentColor" d="m13.692 17.308l-.707-.72l4.088-4.088H5v-1h12.073l-4.088-4.088l.707-.72L19 12z" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>

                                        <div className="[mask-image:linear-gradient(to_left,#000_48%,transparent_98%)] absolute bottom-0 right-0 top-0 w-[66%] rounded-r-xl sm:rounded-r-3xl">
                                            <picture>
                                                <img
                                                    src={ImgJoinFortuna}
                                                    alt="Únete a FORTUNA - Promoción deportiva"
                                                    className="h-full w-full rounded-r-xl object-cover transition-transform duration-500 group-hover:scale-125 sm:rounded-r-3xl"
                                                    loading="eager"
                                                    fetchPriority="high"
                                                />
                                            </picture>
                                        </div>

                                        <a
                                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 font-bold rounded-lg text-base gap-3 px-4 py-3 text-theme-secondary-500 disabled:text-theme-secondary-500 disabled:opacity-30 focus:text-theme-secondary-600 hover:text-theme-secondary-600 inline-flex items-center justify-center absolute inset-0 z-[1] opacity-0"
                                            href="#"
                                        >
                                            <span className="">Leer más</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="swiper-slide h-auto sm:[grid-area:_third]">
                                <div className="group rounded-xl sm:rounded-3xl h-full w-full">
                                    <div className="relative grid h-full grid-cols-12 overflow-hidden rounded-xl bg-primary py-6 pl-6 sm:rounded-3xl">
                                        <div className="relative z-[1] col-span-7 flex flex-col gap-6 text-left sm:justify-between">
                                            <h3 className="text-2xl font-bold leading-tight tracking-tight text-white">
                                                Pago Anticipado
                                            </h3>

                                            <div>
                                                <a
                                                    href="#"
                                                    className="z-[2] inline-flex items-center justify-center rounded-lg bg-white p-2 font-bold text-theme-primary-950 transition hover:bg-theme-secondary-600"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="iconify iconify--material-symbols-light min-h-4 min-w-4"
                                                        style={{ fontSize: "16px" }}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path fill="currentColor" d="m13.692 17.308l-.707-.72l4.088-4.088H5v-1h12.073l-4.088-4.088l.707-.72L19 12z" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>

                                        <div className="[mask-image:linear-gradient(to_left,#000_48%,transparent_98%)] absolute bottom-0 right-0 top-0 w-[66%] rounded-r-xl sm:rounded-r-3xl">
                                            <picture>
                                                <img
                                                    src={ImgPrepayment}
                                                    alt="Pago Anticipado - Gana antes de tiempo"
                                                    className="h-full w-full rounded-r-xl object-cover transition-transform group-hover:scale-125 sm:rounded-r-3xl"
                                                    loading="eager"
                                                    fetchPriority="high"
                                                />
                                            </picture>
                                        </div>

                                        <a
                                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 font-bold rounded-lg text-base gap-3 px-4 py-3 text-theme-secondary-500 disabled:text-theme-secondary-500 disabled:opacity-30 focus:text-theme-secondary-600 hover:text-theme-secondary-600 inline-flex items-center justify-center absolute inset-0 z-[1] opacity-0"
                                            href="#"
                                        >
                                            <span className="">Leer más</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default DropWins;