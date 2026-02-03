import Img18 from "/src/assets/img/18.webp";
import ImgGCB from "/src/assets/svg/GCB.svg";
import ImgFactory from "/src/assets/svg/engage-factory-logo.svg";

const Footer = () => {
    return (
        <footer className="w-full overflow-hidden pb-6 [grid-area:_footer]">
            <div className="container px-5">
                <hr className="border-theme-secondary/10 mt-6 border-t sm:mt-12" />

                <div className="flex flex-col gap-6 lg:pt-6">
                    <div className="flex flex-col justify-center lg:flex-row lg:items-start lg:gap-6">
                        <div className="prose text-dark-grey-50 max-w-none text-xs [&_p]:mb-5">
                            <p>
                                FORTUNAJUEGOS es operado por Entertainment Art BV (número de registro 127327, constituida en septiembre de 2012),
                                con domicilio social en Emancipatie Boulevard 29, Willemstad, Curazao.
                                <br /><br />
                                Entertainment Art BV cuenta con la licencia completa del Gobierno Central de Curazao y opera bajo la licencia
                                de eGaming (OGL/2024/995/0478).
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-6 lg:min-w-[14.25rem] lg:flex-col lg:items-stretch">
                            <a
                                href="#"
                                rel="noreferrer"
                                title="Debe tener 18 años o más para usar fortunajuegos.com"
                                className="group flex items-center gap-6"
                            >
                                <picture className="contents">
                                    <img
                                        src={Img18}
                                        alt="18+"
                                        className="max-h-11 min-w-11 group-even:w-full"
                                        loading="lazy"
                                    />
                                </picture>
                                <p className="text-dark-grey-50 text-xs !leading-tight">
                                    Debe tener 18 años o más para usar fortunajuegos.com
                                </p>
                            </a>

                            <a
                                href="#"
                                rel="noreferrer"
                                className="group flex items-center gap-6"
                            >
                                <picture className="contents">
                                    <img
                                        src={ImgGCB}
                                        alt="CiL"
                                        className="max-h-11 min-w-11 group-even:w-full"
                                        loading="lazy"
                                    />
                                </picture>
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="border-theme-secondary/10 mt-4 border-t" />

                <div className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-dark-grey-50 flex-1 text-xs !leading-tight">
                        © 2017-2025 FORTUNAJUEGOS. Reservados todos los derechos.
                        Los juegos y apuestas deportivas a distancia realizados en exceso pueden causar ludopatía.
                    </p>

                    <div className="flex items-center gap-6">
                        <img
                            src={ImgFactory}
                            alt="Engage Factory logo"
                        />
                        <p className="text-dark-grey-50 whitespace-nowrap text-xs !leading-tight">
                            Desarrollado por&nbsp;
                            <a
                                href="https://engagefactory.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="underline"
                            >
                                Engage Factory
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;