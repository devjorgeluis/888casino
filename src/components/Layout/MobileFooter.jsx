import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import SearchInput from "../SearchInput";
import ImgHome from "/src/assets/svg/home.svg";
import ImgCasino from "/src/assets/svg/casino.svg";
import ImgLiveCasino from "/src/assets/svg/live-casino.svg";
import ImgHot from "/src/assets/svg/hot.svg";
import ImgJoker from "/src/assets/svg/joker.svg";
import ImgCrash from "/src/assets/svg/crash.svg";
import ImgMegaway from "/src/assets/svg/megaway.svg";
import ImgRuleta from "/src/assets/svg/ruleta.svg";
import ImgMobileCircleSport from "/src/assets/svg/mobile-circle-sport.svg";
import ImgMobileCircleLiveSport from "/src/assets/svg/mobile-circle-blue-sport.svg";
import ImgMobileLogo from "/src/assets/svg/mobile-logo.svg";
import ImgMobileHome from "/src/assets/svg/mobile-home.svg";
import ImgMobileCasino from "/src/assets/svg/mobile-casino.svg";
import ImgMobileLiveCasino from "/src/assets/svg/mobile-live-casino.svg";
import ImgMobileSports from "/src/assets/svg/mobile-sports.svg";
import ImgArrowLeft from "/src/assets/svg/arrow-left.svg";
// import ImgSearch from "/src/assets/svg/search.svg"; // Unused import
// import ImgPhone from "/src/assets/svg/phone.svg"; // Unused import

const MobileFooter = ({
    isSlotsOnly,
    isLogin,
    isMobile,
    supportParent,
    openSupportModal,
    handleLogoutClick,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarExpanded, toggleSidebar, setShowMobileSearch } = useContext(LayoutContext);
    const { contextData } = useContext(AppContext);

    const [expandedMenus, setExpandedMenus] = useState([]);
    const [liveCasinoMenus, setLiveCasinoMenus] = useState([]);
    const [hasFetchedLiveCasino, setHasFetchedLiveCasino] = useState(false);
    const [games, setGames] = useState([]);
    const [txtSearch, setTxtSearch] = useState("");
    const [searchDelayTimer, setSearchDelayTimer] = useState();
    const searchRef = useRef(null);
    const [isLoadingGames, setIsLoadingGames] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    // const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Uncomment if needed

    const isSlotsOnlyMode = isSlotsOnly === true || isSlotsOnly === "true";
    const isMenuExpanded = (menuId) => expandedMenus.includes(menuId);

    useEffect(() => {
        setIsSearchActive(txtSearch.trim() !== "");
    }, [txtSearch]);

    // Fetch live casino categories
    useEffect(() => {
        if (!hasFetchedLiveCasino) {
            callApi(
                contextData,
                "GET",
                "/get-page?page=livecasino",
                (result) => {
                    if (result.status === 500 || result.status === 422) return;

                    const menus = [{ name: "Inicio", code: "home", href: "/live-casino#home" }];
                    result.data.categories.forEach((element) => {
                        menus.push({
                            name: element.name,
                            href: `/live-casino#${element.code}`,
                            code: element.code,
                        });
                    });

                    setLiveCasinoMenus(menus);
                    setHasFetchedLiveCasino(true);
                },
                null
            );
        }
    }, [hasFetchedLiveCasino, contextData]);

    // Auto-expand based on route
    useEffect(() => {
        const currentPath = location.pathname;
        const hash = location.hash.slice(1);

        if (currentPath.startsWith("/live-casino") && hash && !isMenuExpanded("live-casino")) {
            setExpandedMenus((prev) => [...prev, "live-casino"]);
        }

        if (currentPath.startsWith("/profile") && !isMenuExpanded("profile")) {
            setExpandedMenus((prev) => [...prev, "profile"]);
        }
    }, [location.pathname, location.hash]);

    const handleNavigation = (item) => () => {
        if (item.action) {
            item.action();
        } else if (item.href !== "#") {
            navigate(item.href);
        }
        if (isSidebarExpanded) {
            toggleSidebar();
        }
    };

    const handleSimpleNavigation = (path) => () => {
        navigate(path);
        if (isSidebarExpanded) {
            toggleSidebar();
        }
    };

    // Comment out if not used
    // const toggleUserMenu = () => {
    //     setIsUserMenuOpen(!isUserMenuOpen);
    // };

    const isMenuActive = (item) => {
        const currentPath = location.pathname;
        const currentHash = location.hash;

        if (item.href.includes("#")) {
            return location.pathname + location.hash === item.href;
        }

        if (item.id === "profile" && currentPath.startsWith("/profile")) {
            return true;
        }

        if (item.href === currentPath && !currentHash) {
            return true;
        }

        return false;
    };

    const showFullMenu = isSlotsOnly === "false" || isSlotsOnly === false;

    // Fix: Correctly handle the ruleta item condition
    const menuItems = [
        {
            id: "home",
            name: "Inicio",
            image: ImgHome,
            href: "/",
            subItems: [],
        },
        {
            id: "casino",
            name: "Tragamonedas",
            image: ImgCasino,
            href: "/casino",
            subItems: [],
        },
        ...(isSlotsOnlyMode
            ? []
            : [
                {
                    id: "live-casino",
                    name: "Casino en Vivo",
                    image: ImgLiveCasino,
                    href: "/live-casino",
                    subItems: [],
                },
            ]),
        {
            id: "hot",
            name: "Juegos Nuevos",
            image: ImgHot,
            href: "/casino#hot",
            subItems: [],
        },
        {
            id: "joker",
            name: "Jokers",
            image: ImgJoker,
            href: "/casino#joker",
            subItems: [],
        },
        ...(!isSlotsOnlyMode 
        ? [{
            id: "crash",
            name: "Juegos de Crash",
            image: ImgCrash,
            href: "/casino#arcade",
            subItems: [],
        }]
        : []),
        {
            id: "megaway",
            name: "Megaways",
            image: ImgMegaway,
            href: "/casino#megaways",
            subItems: [],
        },
        // Fix: Correctly add ruleta item when in slots only mode
        ...(!isSlotsOnlyMode 
            ? [{
                id: "ruleta",
                name: "Ruletas",
                image: ImgRuleta,
                href: "/casino#roulette",
                subItems: [],
            }]
            : []),
        // Fix: Add support item if supportParent exists
        ...(supportParent
            ? [{
                id: "support",
                name: "Contacta a Tu Cajero",
                image: ImgPhone,
                href: "#",
                subItems: [],
                action: () => {
                    openSupportModal(true);
                    if (isSidebarExpanded) {
                        toggleSidebar();
                    }
                },
            }]
            : []),
    ];

    const isBottomNavActive = (path) => {
        const currentPath = location.pathname;

        if (path === "/casino" && currentPath === "/casino") {
            return true;
        }

        return currentPath === path;
    };

    const search = (e) => {
        let keyword = e.target.value;
        setTxtSearch(keyword);

        if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
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
            setGames([]);
            setIsLoadingGames(false);
            return;
        }

        setGames([]);
        setIsLoadingGames(true);

        let pageSize = isMobile ? 50 : 12;

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

    const configureImageSrc = (result) => {
        (result.content || []).forEach((element) => {
            element.imageDataSrc = element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
        });
    };

    const callbackSearch = (result) => {
        if (result.status === 500 || result.status === 422) {
            // Handle error if needed
        } else {
            configureImageSrc(result);
            setGames(result.content);
        }
        setIsLoadingGames(false);
    };

    return (
        <>
            <div className="sc-gIvVow cZNKpo hybrid-embedded-nav-menu cy-hybrid-embedded-nav-menu">
                <div className="sc-fFJegD fJFmTt">
                    <div className="sc-eJmjAC FRJkW cy-hybrid-embedded-nav-menu-list">
                        <a
                            onClick={handleSimpleNavigation("/")}
                            className="sc-ciMfCw ja-dRuB sc-fYIXqs zMWZi cy-bottom-navbar-menu-item"
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={`sc-dcomKt ${isBottomNavActive("/") ? "kBkDtU" : "ezbnfo"} cy-bottom-navbar-menu-icon`}>
                                <img src={ImgMobileHome} className="sc-bqOBqt PBviZ" alt="Home" />
                            </div>
                            <div className="sc-bcckXD imDsVC">Inicio</div>
                        </a>
                        <a
                            onClick={handleSimpleNavigation("/casino")}
                            className="sc-ciMfCw ja-dRuB sc-fYIXqs zMWZi cy-bottom-navbar-menu-item"
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={`sc-dcomKt ${isBottomNavActive("/casino") ? "kBkDtU" : "ezbnfo"} cy-bottom-navbar-menu-icon`}>
                                <img src={ImgMobileCasino} className="sc-bqOBqt PBviZ" alt="Casino" />
                            </div>
                            <div className="sc-bcckXD imDsVC">Tragamonedas</div>
                        </a>
                        {
                            showFullMenu && <>
                                <a
                                    onClick={handleSimpleNavigation("/live-casino")}
                                    className="sc-ciMfCw ja-dRuB sc-fYIXqs zMWZi cy-bottom-navbar-menu-item"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className={`sc-dcomKt ${isBottomNavActive("/live-casino") ? "kBkDtU" : "ezbnfo"} cy-bottom-navbar-menu-icon`}>
                                        <img src={ImgMobileLiveCasino} className="sc-bqOBqt PBviZ" alt="Live Casino" />
                                    </div>
                                    <div className="sc-bcckXD imDsVC">Casino en Vivo</div>
                                </a>
                                <a
                                    onClick={handleSimpleNavigation("/sports")}
                                    className="sc-ciMfCw ja-dRuB sc-fYIXqs zMWZi cy-bottom-navbar-menu-item"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className={`sc-dcomKt ${isBottomNavActive("/sports") ? "kBkDtU" : "ezbnfo"} cy-bottom-navbar-menu-icon`}>
                                        <img src={ImgMobileSports} className="sc-bqOBqt PBviZ" alt="Sports" />
                                    </div>
                                    <div className="sc-bcckXD imDsVC">Deportes</div>
                                </a>
                            </>
                        }
                    </div>
                </div>
            </div>

            {isSidebarExpanded && (
                <div className="sc-gvsNSq jxqyxT cy-main-nav open-menu">
                    <div className="sc-daLoug sc-dXijah hUcPdj bDBgJW">
                        <div className="sc-codVKW bPGlzn">
                            <div className="sc-fEyyHY cwRgmi">
                                <div className="sc-etyUPJ gNGgmX cy-close-mobile-menu-icon">
                                    <img src={ImgArrowLeft} onClick={toggleSidebar} style={{ cursor: 'pointer' }} alt="Close" />
                                </div>
                            </div>
                            <div className="sc-fEyyHY cwRgmi">
                                <div className="sc-yWEwC sc-bvtzcD cOhCUT bwJqBY cy-logo-container">
                                    <a onClick={handleSimpleNavigation("/")} className="sc-ciMfCw ja-dRuB" style={{ cursor: 'pointer' }}>
                                        <img src={ImgMobileLogo} className="sc-gHXKQl eKXwKk logo cy-logo" alt="Logo" />
                                    </a>
                                </div>
                            </div>
                            <div className="sc-fEyyHY cwRgmi"></div>
                        </div>
                        <div className="sc-hhFrFd bCsUbK">
                            <div className="sc-gSONCE sc-dxYMJA fxKZYg gpHIWH">
                                <div className="sc-iYjPCr gWmbXn cy-side-menu">
                                    {
                                        isSlotsOnly == "false" && <>
                                            <div className="sc-gKjrUP ieYZAJ cy-menu-links-group cy-menu-links-cross-brands-group">
                                                <li className="sc-kIfdec jmRoun cy-menu-item">
                                                    <a onClick={handleSimpleNavigation("/sports")} className="sc-ciMfCw ja-dRuB" style={{ cursor: 'pointer' }}>
                                                        <div className="sc-cAeysB fHjzIS">
                                                            <div className="sc-dGzCaO bRZDKe">
                                                                <img src={ImgMobileCircleSport} alt="Sports" />
                                                            </div>
                                                            <span className="sc-KeRuP fuWdtC">Deportes</span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li className="sc-kIfdec jmRoun cy-menu-item">
                                                    <a onClick={handleSimpleNavigation("/live-sports")} className="sc-ciMfCw ja-dRuB" style={{ cursor: 'pointer' }}>
                                                        <div className="sc-cAeysB fPYrue">
                                                            <div className="sc-dGzCaO bRZDKe">
                                                                <img src={ImgMobileCircleLiveSport} alt="Live Sports" />
                                                            </div>
                                                            <span className="sc-KeRuP fuWdtC">En Vivo</span>
                                                        </div>
                                                    </a>
                                                </li>
                                            </div>
                                            <div className="sc-dnaMGt cselLF cy-game-search-box cy-menu-links-group">
                                                <ul className="sc-caJMrc goXKGs cy-menu-item">
                                                    <SearchInput
                                                        txtSearch={txtSearch}
                                                        setTxtSearch={setTxtSearch}
                                                        searchRef={searchRef}
                                                        search={search}
                                                        isMobile={isMobile}
                                                        games={games}
                                                        isLoadingGames={isLoadingGames}
                                                    />
                                                </ul>
                                            </div>
                                        </>
                                    }
                                    {!isSearchActive && (
                                        <section className="sc-klCKcm sc-kZzZex eLAEaM jdUfX">
                                            <div className="sc-MKQME sc-jlirRl ekPQQx fJgckN">
                                                <ul className="cy-menu-links-group">
                                                    {menuItems.map((item, index) => {
                                                        const isActive = isMenuActive(item);
                                                        const isLast = index === menuItems.length - 1;

                                                        return (
                                                            <div key={item.id}>
                                                                <li className="sc-fkVSuP sc-bsyrka izPQbG kxFylD cy-menu-item">
                                                                    <a onClick={handleNavigation(item)} className="sc-ciMfCw ja-dRuB" style={{ cursor: 'pointer' }}>
                                                                        <div className={`sc-gPLYmt sc-cjShfW efmGEW bDGwEc ${isActive ? "dtqOUd" : ""}`}>
                                                                            <span className="sc-iDhmSy jagTrD"></span>
                                                                            <div className={`sc-dgWXKx sc-bsStmr dvyXko hWgsTC ${isLast ? "phone" : ""}`}>
                                                                                <img src={item.image} className="sc-bqOBqt PBviZ" alt={item.name} />
                                                                            </div>
                                                                            <span className="sc-bMhjqq sc-kfiijn eeQnce gwhmuu">{item.name}</span>
                                                                        </div>
                                                                    </a>
                                                                </li>
                                                                <div className="sc-cLVYFp sc-kiUgTw cSIQFP hPFZit"></div>
                                                            </div>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MobileFooter;