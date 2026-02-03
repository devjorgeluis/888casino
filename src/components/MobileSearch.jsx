import { useState, useEffect, useContext, useRef } from "react";
import { LayoutContext } from "./Layout/LayoutContext";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import LoadApi from "./Loading/LoadApi";
import LoginModal from "./Modal/LoginModal";
import GameCard from "./GameCard";
import ImgSearch from "/src/assets/svg/search.svg";
import ImgClose from "/src/assets/svg/large-close.svg";

const MobileSearch = ({ isLogin, isMobile, onClose }) => {
    const { contextData } = useContext(AppContext);
    const { setShowMobileSearch, launchGameFromSearch } = useContext(LayoutContext);
    const [games, setGames] = useState([]);
    const [txtSearch, setTxtSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const searchRef = useRef(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [searchDelayTimer, setSearchDelayTimer] = useState();

    const handleCloseModal = () => {
        if (onClose) onClose();
        if (setShowMobileSearch) setShowMobileSearch(false);
    };

    const handleClearSearch = () => {
        setTxtSearch("");
        setGames([]);
        setIsSearch(false);
        setHasSearched(false);
        searchRef.current?.focus();
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginConfirm = () => {
        setShowLoginModal(false);
    };

    const launchGame = (game, type, launcher) => {
        launchGameFromSearch(game, type, launcher);
    };

    const configureImageSrc = (result) => {
        (result.content || []).forEach((element) => {
            element.imageDataSrc =
                element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
        });
    };

    const search = (e) => {
        const keyword = e.target.value;
        setTxtSearch(keyword);

        if (/Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent)) {
            do_search(keyword);
        } else if (
            (e.keyCode >= 48 && e.keyCode <= 57) ||
            (e.keyCode >= 65 && e.keyCode <= 90) ||
            e.keyCode === 8 ||
            e.keyCode === 46
        ) {
            do_search(keyword);
        }

        if (e.key === "Enter" || e.key === "Escape") {
            searchRef.current?.blur();
        }
    };

    const do_search = (keyword) => {
        setIsSearch(true);
        clearTimeout(searchDelayTimer);

        if (!keyword) {
            setIsSearch(false);
            setHasSearched(false);
            setGames([]);
            return;
        }

        setGames([]);
        setHasSearched(true);

        const timer = setTimeout(() => {
            callApi(
                contextData,
                "GET",
                `/search-content?keyword=${keyword}&page_group_code=default_pages_home&length=50`,
                callbackSearch,
                null
            );
        }, 1000);

        setSearchDelayTimer(timer);
    };

    const callbackSearch = (result) => {
        setIsSearch(false);
        if (result.status === 500 || result.status === 422) return;

        configureImageSrc(result);
        setGames(result.content || []);
    };

    const handleOverlayClick = (e) => {
        e.stopPropagation();
    };

    return (
        <>
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onConfirm={handleLoginConfirm}
                />
            )}

            <div
                className="flex h-full w-full items-center justify-center vfm vfm--fixed vfm--inset"
                role="dialog"
                aria-modal="true"
                style={{ zIndex: 100 }}
                onClick={handleOverlayClick}
            >
                <div
                    className="vfm__overlay vfm--overlay vfm--absolute vfm--inset vfm--prevent-none !bg-black/80"
                    aria-hidden="true"
                    onClick={handleOverlayClick}
                ></div>

                <div className="vfm__content vfm--outline-none confirm-modal-content">
                    <div
                        className="relative flex max-h-[calc(100dvh-2rem)] w-screen max-w-[calc(100vw_-_2rem)] flex-col py-6 sm:max-h-[70dvh] sm:py-8 lg:max-w-[64rem] rounded-3xl dark:ring-gray-800 ring-dark-grey-700 ring-1 dark:bg-gray-900 bg-dark-grey-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 font-bold rounded-lg text-sm gap-2 disabled:text-theme-secondary-500 disabled:opacity-30 focus:text-theme-secondary-600 hover:text-theme-secondary-600 inline-flex items-center justify-center absolute right-4 top-4 z-[11] p-1.5 text-white"
                        >
                            <img src={ImgClose} alt="Cerrar" className="h-6 w-6" />
                        </button>

                        <div className="px-6 sm:px-8 mb-4 sm:mb-6">
                            <div className="flex flex-col gap-6">
                                <span className="text-4xl font-bold -tracking-[0.6px] text-white sm:-tracking-[0.72px]">
                                    Buscar
                                </span>

                                <div className="relative w-full transition-all">
                                    <input
                                        ref={searchRef}
                                        className="relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-lg placeholder-gray-400 dark:placeholder-gray-500 px-2.5 dark:bg-gray-900 dark:text-white ring-1 ring-inset dark:ring-gray-700 focus:ring-2 dark:focus:ring-primary-400 pe-9 ring-theme-secondary text-white focus:ring-theme-secondary focus:outline-0 min-h-12 truncate !border-0 bg-black/50 py-3 pl-3 pr-10 text-lg font-normal !leading-tight shadow-none !outline-none !outline-offset-0 !ring-1 !ring-offset-0 lg:text-base"
                                        placeholder="Buscar"
                                        value={txtSearch}
                                        onChange={(e) => setTxtSearch(e.target.value)}
                                        onKeyUp={search}
                                        autoFocus
                                    />
                                    <span className="absolute inset-y-0 right-0 flex items-center px-3">
                                        {txtSearch !== "" ? (
                                            <img
                                                src={ImgClose}
                                                alt="Limpiar búsqueda"
                                                className="h-5 w-5 cursor-pointer text-white/70 hover:text-white transition-colors"
                                                onClick={handleClearSearch}
                                            />
                                        ) : (
                                            <img
                                                src={ImgSearch}
                                                alt="Buscar"
                                                className="h-5 w-5 text-white/50 pointer-events-none"
                                            />
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
                            <div
                                data-overlayscrollbars-initialize=""
                                className="w-full !overflow-x-clip h-full px-6 sm:px-8"
                                data-overlayscrollbars="host"
                            >
                                <div
                                    data-overlayscrollbars-contents=""
                                    data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYHidden"
                                    tabIndex="-1"
                                >
                                    <div>
                                        <div className="mb-4 sm:mb-6">
                                            {isSearch ? (
                                                <div className="pt-1">
                                                    <LoadApi />
                                                </div>
                                            ) : games.length > 0 ? (
                                                <div className="grid h-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                                                    {games.map((item) => (
                                                        <GameCard
                                                            key={"search" + item.id}
                                                            id={item.id}
                                                            provider="Casino"
                                                            title={item.name}
                                                            imageSrc={
                                                                item.image_local !== null
                                                                    ? contextData.cdnUrl + item.image_local
                                                                    : item.image_url
                                                            }
                                                            onClick={() => (isLogin ? launchGame(item, "slot", "tab") : handleLoginClick())}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                hasSearched && txtSearch && (
                                                    <div className="mx-auto flex w-full max-w-[25rem] flex-col justify-center gap-8 p-4">
                                                        <p className="text-dark-grey-200 text-base font-normal !leading-tight">
                                                            Sin resultados de búsqueda
                                                        </p>
                                                        <button
                                                            onClick={handleClearSearch}
                                                            type="button"
                                                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 font-bold rounded-lg gap-3 px-4 text-theme-primary-950 bg-theme-secondary-500 disabled:bg-theme-secondary-500 disabled:text-theme-primary-950 disabled:opacity-30 focus-visible:outline-theme-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-theme-secondary-500/20 focus:outline focus:outline-4 hover:bg-theme-secondary-600 hover:text-theme-primary-950 inline-flex items-center justify-center w-full py-3.5 text-lg !leading-tight lg:text-base"
                                                        >
                                                            <span>Restablecer</span>
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileSearch;