import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../../AppContext";
import SearchInput from "../SearchInput";
import { callApi } from "../../utils/Utils";
import ImgLogo from "/src/assets/svg/logo-desktop.svg";
import ImgMobileLogo from "/src/assets/svg/logo-mobile.svg";
import ImgCloseMenu from "/src/assets/svg/close-menu.svg";
import ImgOpenMenu from "/src/assets/svg/open-menu.svg";
import ImgSearch from "/src/assets/svg/search.svg";
import ImgSupport from "/src/assets/svg/support-black.svg";

const Header = ({
    isLogin,
    isMobile,
    userBalance,
    supportParent,
    handleLoginClick,
    openSupportModal,
}) => {
    const { contextData } = useContext(AppContext);
    const [games, setGames] = useState([]);
    const [txtSearch, setTxtSearch] = useState("");
    const [isLoadingGames, setIsLoadingGames] = useState(false);
    const { isSidebarExpanded, toggleSidebar } = useContext(LayoutContext);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [searchDelayTimer, setSearchDelayTimer] = useState();

    const configureImageSrc = (result) => {
        (result.content || []).forEach((element) => {
            element.imageDataSrc = element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
        });
    };    

    const search = (e) => {
        let keyword = e.target.value;
        setTxtSearch(keyword);

        if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
            let keyword = e.target.value;
            do_search(keyword);
        } else {
            if (
                (e.keyCode >= 48 && e.keyCode <= 57) ||
                (e.keyCode >= 65 && e.keyCode <= 90) ||
                e.keyCode == 8 ||
                e.keyCode == 46
            ) {
                do_search(keyword);
            }
        }

        if (e.key === "Enter" || e.keyCode === 13 || e.key === "Escape" || e.keyCode === 27) {
            searchRef.current?.blur();
        }
    };

    const do_search = (keyword) => {
        clearTimeout(searchDelayTimer);

        if (keyword == "") {
            return;
        }

        setGames([]);
        setIsLoadingGames(true);

        let pageSize = 50;

        let searchDelayTimerTmp = setTimeout(function () {
            callApi(
                contextData,
                "GET",
                "/search-content?keyword=" + txtSearch + "&page_group_code=" + "default_pages_home" + "&length=" + pageSize,
                callbackSearch,
                null
            );
        }, 1000);

        setSearchDelayTimer(searchDelayTimerTmp);
    };

    const callbackSearch = (result) => {
        if (result.status === 500 || result.status === 422) {

        } else {
            configureImageSrc(result);
            setGames(result.content);
        }
        setIsLoadingGames(false);
    };

    return (
        <header className="bg-primary-900 sticky top-0 z-[11] [grid-area:_header] border-theme-secondary/10 border-b">
            <div className={`relative min-h-[3.5rem] flex-wrap items-center gap-2 px-4 py-3 lg:z-[100] flex`}>
                <div className="flex items-center gap-4">
                    {
                        !isMobile &&
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 focus-visible:outline-0 font-bold rounded-lg text-base gap-2.5 p-2.5 text-theme-secondary-500 bg-theme-secondary-500/10 disabled:bg-theme-secondary-500/10 disabled:text-theme-secondary-500 disabled:opacity-30 focus-visible:ring-theme-secondary-500 focus-visible:ring-2 focus-visible:ring-inset focus:outline-theme-secondary-500/10 focus:bg-theme-secondary-500/20 focus:outline focus:outline-4 hover:bg-theme-secondary-500/20 inline-flex items-center justify-center"
                        >
                            <img src={isSidebarExpanded ? ImgCloseMenu : ImgOpenMenu} alt="Menu toggle" style={{ width: 20 }} />
                        </button>
                    }

                    <a onClick={() => navigate("/")} className="block lg:mr-8 cursor-pointer" title="Logo">
                        <img src={isMobile ? ImgMobileLogo : ImgLogo} alt="Logo" />
                    </a>
                </div>

                <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
                    {
                        !isMobile &&
                        <div className="relative w-full max-w-full flex-1">
                            <SearchInput
                                txtSearch={txtSearch}
                                setTxtSearch={setTxtSearch}
                                searchRef={searchRef}
                                search={search}
                                isMobile={true}
                            />
                        </div>
                    }

                    <button className="button-support" onClick={() => { openSupportModal(false); }}>
                        <img src={ImgSupport} />
                    </button>

                    {isLogin ? (
                        <>
                            <div className="inline-flex items-center rounded-lg bg-theme-secondary-500/10 px-4 py-3 text-theme-secondary-500 font-bold">
                                <span className="text-sm sm:text-base">$ {Number.isFinite(Number(userBalance)) ? Number(userBalance).toFixed(2) : "0.00"}</span>
                            </div>

                            <a
                                onClick={() => navigate("/profile")}
                                className={`cursor-pointer flex items-center gap-3 min-h-10 rounded-lg bg-theme-secondary-500/10 text-theme-secondary-500 font-bold hover:bg-theme-secondary-500/20 ${isMobile ? "p-2" : "px-4 py-3"}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    fill="currentColor"
                                >
                                    <path d="M5.85 17.1q1.275-.975 2.85-1.537T12 15t3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4T6.337 6.338T4 12q0 1.475.488 2.775T5.85 17.1M12 13q-1.475 0-2.488-1.012T8.5 9.5t1.013-2.488T12 6t2.488 1.013T15.5 9.5t-1.012 2.488T12 13m0 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q1.325 0 2.5-.387t2.15-1.113q-.975-.725-2.15-1.112T12 17t-2.5.388T7.35 18.5q.975.725 2.15 1.113T12 20m0-9q.65 0 1.075-.425T13.5 9.5t-.425-1.075T12 8t-1.075.425T10.5 9.5t.425 1.075T12 11m0 7.5" />
                                </svg>
                                {
                                    !isMobile && <span>Mi cuenta</span>
                                }
                            </a>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 ml-2">
                            {
                                isMobile ?
                                    <button
                                        type="button"
                                        onClick={handleLoginClick}
                                        className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis focus-visible:outline-0 font-bold rounded-lg gap-3 px-4 py-3 text-theme-secondary-500 bg-transparent ring-1 ring-inset ring-current disabled:ring-theme-secondary-500 disabled:bg-transparent disabled:opacity-30 focus-visible:ring-theme-secondary-500 focus-visible:ring-2 focus:outline-theme-secondary-500/20 focus:bg-theme-secondary-500/10 focus:outline focus:outline-4 hover:bg-theme-secondary-500/10 inline-flex items-center justify-center text-xs !leading-tight sm:min-h-12 sm:text-lg lg:min-w-[9.5rem]"
                                    >
                                        Iniciar sesión
                                    </button>
                                    :
                                    <button
                                        type="button"
                                        onClick={handleLoginClick}
                                        className="min-h-12 rounded-lg bg-transparent px-6 py-3 text-theme-secondary-500 font-bold ring-1 ring-theme-secondary-500 hover:bg-theme-secondary-500/10 focus-visible:ring-2 focus-visible:ring-theme-secondary-500"
                                    >
                                        Iniciar sesión
                                    </button>
                            }
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;