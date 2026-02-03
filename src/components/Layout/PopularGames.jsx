import { useContext, useState, useRef } from 'react';
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../AppContext';
import ImgLogoTransparent from "/src/assets/svg/logo-transparent.svg";

const PopularGames = ({ games, title, icon, link, onGameClick }) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(10);
    const [showBackBtn, setShowBackBtn] = useState(false);
    const containerRef = useRef(null);
    const { isMobile } = useOutletContext();

    const handleLoadMore = () => {
        const previousCount = visibleCount;
        setVisibleCount(prevCount => prevCount + 10);
        
        if (!showBackBtn) {
            setShowBackBtn(true);
        }
        
        if (containerRef.current) {
            const gamesGrid = containerRef.current.querySelector('.grid');
            if (gamesGrid && previousCount > 10) {
                const newGameIndex = previousCount;
                const newGameElement = gamesGrid.children[newGameIndex];
                if (newGameElement) {
                    newGameElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        }
    };

    const handleBack = () => {
        setVisibleCount(10);
        setShowBackBtn(false);
        
        if (containerRef.current) {
            const gamesGrid = containerRef.current.querySelector('.grid');
            if (gamesGrid) {
                gamesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const visibleGames = games.slice(0, visibleCount);
    const hasMoreGames = visibleCount < games.length;

    return (
        <div ref={containerRef} className="relative overflow-hidden sm:pb-5 py-6">
            <div className="relative mb-5 flex items-center justify-between gap-2 py-4 min-h-20">
                <img
                    src={ImgLogoTransparent}
                    alt="fortunajuegos"
                    className="absolute left-0 h-auto w-[4.25rem] opacity-50 top-0.5"
                />
                <h2 className="text-dark-grey-50 text-xs font-bold uppercase !leading-[1.1] tracking-[1.2px] md:text-sm">
                    {title}
                </h2>
            </div>

            <div>
                <div
                    className="mb-3 grid gap-4 sm:mb-5 sm:gap-2 lg:gap-4"
                    style={{ '--games-list-grid-cols': isMobile ? 2 : 5, gridTemplateColumns: 'repeat(var(--games-list-grid-cols, 5), minmax(0, 1fr))' }}
                >
                    {
                        visibleGames.map((game) => (
                            <div key={game.id}>
                                <div className="group relative h-full flex flex-col rounded-tl-lg rounded-tr-lg">
                                    <div
                                        className="group-hover:shadow-games-tile-hover relative aspect-[var(--image-aspect-ratio)] overflow-hidden rounded-lg"
                                        style={{ '--image-aspect-ratio': '3/2' }}
                                    >
                                        <picture className="contents">
                                            <source media="(min-width: 2400px)" srcSet={game.image_local != null && game.image_local !== "" ? contextData.cdnUrl + game.image_local : game.image_url} />
                                            <img
                                                className="h-full w-full rounded-lg object-cover transition-all duration-500 ease-out group-hover:opacity-50"
                                                src={game.image_local != null && game.image_local !== "" ? contextData.cdnUrl + game.image_local : game.image_url}
                                                alt={game.name}
                                                loading="lazy"
                                                fetchPriority="high"
                                            />
                                        </picture>

                                        <div className="ease-elastic-out absolute inset-0 flex flex-col justify-between p-[8%] opacity-0 transition-all duration-300 after:ease-elastic-out after:absolute after:-inset-[8%] after:opacity-0 after:transition-all after:duration-300 group-hover:after:bg-dark-grey-950/50 group-hover:opacity-100 group-hover:after:opacity-100" />
                                        <div className="ease-elastic-out pointer-events-none absolute inset-x-[8%] top-0 z-[2] mx-auto flex h-full max-w-max flex-col items-center justify-center gap-2 opacity-0 transition-all duration-500 group-hover:opacity-100">
                                            <button onClick={() => onGameClick && onGameClick(game)} type="button" className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full text-ellipsis ring-0 font-bold rounded-lg text-sm gap-2 px-2 py-1.5 text-theme-primary-950 bg-theme-secondary-500 disabled:bg-theme-secondary-500 disabled:text-theme-primary-950 disabled:opacity-30 focus-visible:outline-theme-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-theme-secondary-500/20 focus:outline focus:outline-4 hover:bg-theme-secondary-600 hover:text-theme-primary-950 inline-flex items-center justify-center pointer-events-auto min-h-10 w-full"><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--tabler flex-shrink-0 flex-shrink-0 h-4 w-4" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4v16a1 1 0 0 0 1.524.852l13-8a1 1 0 0 0 0-1.704l-13-8A1 1 0 0 0 6 4"></path></svg><span className="">¡Jugar ahora!</span></button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 pb-1 pl-0.5 pt-4">
                                        <a
                                            className="text-dark-grey-50 cursor-pointer text-base font-bold !leading-normal hover:text-dark-grey-50 after:absolute after:inset-0 after:z-[1] block w-full" onClick={() => onGameClick && onGameClick(game)}>
                                            {game.name}
                                        </a>
                                        <span className="text-dark-grey-50/50 text-sm !leading-normal">
                                            {game.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="relative flex items-center justify-center sm:justify-normal gap-4">
                    {showBackBtn && (
                        <button 
                            type="button" 
                            onClick={handleBack}
                            className="back-btn flex aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed flex-shrink-0 text-ellipsis focus-visible:outline-0 font-bold rounded-lg text-base px-4 py-3 text-theme-secondary-500 bg-transparent ring-1 ring-inset ring-current disabled:ring-theme-secondary-500 disabled:bg-transparent disabled:opacity-30 focus-visible:ring-theme-secondary-500 focus-visible:ring-2 focus:outline-theme-secondary-500/20 focus:bg-theme-secondary-500/10 focus:outline focus:outline-4 hover:bg-theme-secondary-500/10 items-center justify-center max-w-fit gap-4 pl-3 pr-5 md:flex"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--tabler flex-shrink-0 flex-shrink-0 -rotate-90 h-3.5 w-3.5" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 11l5-5l5 5M7 17l5-5l5 5"></path>
                            </svg>
                            <span>Cerrar</span>
                        </button>
                    )}
                    
                    {hasMoreGames && (
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full text-ellipsis focus-visible:outline-0 font-bold rounded-lg text-base gap-3 px-4 py-3 text-theme-secondary-500 bg-transparent ring-1 ring-inset ring-current disabled:ring-theme-secondary-500 disabled:bg-transparent disabled:opacity-30 focus-visible:ring-theme-secondary-500 focus-visible:ring-2 focus:outline-theme-secondary-500/20 focus:bg-theme-secondary-500/10 focus:outline focus:outline-4 hover:bg-theme-secondary-500/10 inline-flex items-center justify-center w-full sm:absolute sm:left-1/2 sm:max-w-[15.875rem] sm:-translate-x-1/2"
                        >
                            Cargar más
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopularGames;